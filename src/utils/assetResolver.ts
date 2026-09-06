import aliasesData from '../../config/aliases.json';
import { IconItem, BrandAsset, AssetRole, UsageContext, SourceProvider, SourcePolicy, MatchingMode } from '../types';

/**
 * Resolves an alias or brand synonym to canonical identity id
 */
export function resolveAlias(name: string): string {
  if (!name) return '';
  const lower = name.toLowerCase().trim();
  const aliases = aliasesData as Record<string, string>;
  return aliases[lower] || lower;
}

/**
 * Resolves brand identity from catalog by id, title, or alias
 */
export function resolveIdentity(query: string, catalog: IconItem[]): IconItem | null {
  if (!query) return null;
  const lower = query.toLowerCase().trim();
  const canonicalId = resolveAlias(lower);

  // Exact id or canonicalId
  const match = catalog.find(i => i.id === canonicalId || i.slug === canonicalId || i.id === lower);
  if (match) return match;

  // Title match
  const titleMatch = catalog.find(i => i.title.toLowerCase() === lower);
  if (titleMatch) return titleMatch;

  // Alias / tags match
  const aliasMatch = catalog.find(i => i.aliases?.some(a => a.toLowerCase() === lower));
  if (aliasMatch) return aliasMatch;

  return null;
}

export interface AssetCriteria {
  role?: AssetRole | string;
  context?: UsageContext | string;
  variant?: string;
  sourceProvider?: SourceProvider | string;
  policy?: SourcePolicy;
  mode?: MatchingMode; // 'strict' | 'preferred' | 'fallback'
}

export interface MatchChecklist {
  exactIdentity: boolean;
  aliasMatch: boolean;
  roleMatch: boolean;
  contextMatch: boolean;
  variantMatch: boolean;
  trustedSource: boolean;
}

export interface ResolvedAssetMatch {
  identity: IconItem;
  matchedAsset: BrandAsset | null;
  allAssets: BrandAsset[];
  matchType: 'exact-identity' | 'alias' | 'role-context-match' | 'fuzzy-identity' | 'tag' | 'unresolved';
  matchReason?: string;
  fallbackOccurred?: boolean;
}

export interface AssetAwareSearchResult {
  icon: IconItem;
  matchedAsset?: BrandAsset;
  matchReason: string;
  matchScore: number;
  matchChecklist?: MatchChecklist;
}

export interface ParsedSearchIntent {
  rawQuery: string;
  targetIdentity: string;
  resolvedIdentityId: string;
  roleConstraint: AssetRole | null;
  contextConstraint: UsageContext | null;
  variantPreference: string | null;
  mode: MatchingMode;
}

/**
 * Parses natural-language user queries into structured constraints
 * e.g., "Instagram icon for mobile navigation" -> { targetIdentity: 'instagram', role: 'symbol', context: 'mobile' }
 */
export function parseSearchIntent(query: string): ParsedSearchIntent {
  const trimmed = (query || '').trim();
  const rawTokens = trimmed.toLowerCase().split(/\s+/).filter(Boolean);

  const ROLE_MAP: Record<string, AssetRole> = {
    symbol: 'symbol',
    icon: 'symbol',
    glyph: 'symbol',
    logo: 'logo',
    brandmark: 'logo',
    wordmark: 'wordmark-horizontal',
    'wordmark-horizontal': 'wordmark-horizontal',
    'wordmark-stacked': 'wordmark-stacked',
    favicon: 'favicon',
    'app-icon': 'app-icon',
    appicon: 'app-icon',
    badge: 'badge',
    mark: 'mark'
  };

  const CONTEXT_MAP: Record<string, UsageContext> = {
    mobile: 'mobile',
    phone: 'mobile',
    ios: 'mobile',
    android: 'mobile',
    navigation: 'mobile',
    web: 'web',
    website: 'web',
    header: 'web',
    footer: 'web',
    desktop: 'desktop',
    social: 'social',
    avatar: 'avatar',
    app: 'app-store',
    'app-store': 'app-store'
  };

  const VARIANT_MAP: Record<string, string> = {
    color: 'color',
    multicolor: 'color',
    'multi-color': 'color',
    monochrome: 'monochrome',
    mono: 'monochrome',
    white: 'monochrome',
    black: 'monochrome',
    dark: 'monochrome',
    original: 'original',
    plain: 'plain',
    line: 'line'
  };

  let roleConstraint: AssetRole | null = null;
  let contextConstraint: UsageContext | null = null;
  let variantPreference: string | null = null;
  const identityTokens: string[] = [];

  const stopWords = new Set(['for', 'the', 'a', 'an', 'in', 'on', 'with', 'and', 'only', 'strict']);
  let isStrict = trimmed.toLowerCase().includes('only') || trimmed.toLowerCase().includes('strict');

  for (const token of rawTokens) {
    if (ROLE_MAP[token]) {
      roleConstraint = ROLE_MAP[token];
    } else if (CONTEXT_MAP[token]) {
      contextConstraint = CONTEXT_MAP[token];
    } else if (VARIANT_MAP[token]) {
      variantPreference = VARIANT_MAP[token];
    } else if (!stopWords.has(token)) {
      identityTokens.push(token);
    }
  }

  const targetIdentity = identityTokens.join('-') || rawTokens[0] || '';
  const resolvedIdentityId = resolveAlias(targetIdentity);

  return {
    rawQuery: query,
    targetIdentity,
    resolvedIdentityId,
    roleConstraint,
    contextConstraint,
    variantPreference,
    mode: isStrict ? 'strict' : 'preferred'
  };
}

/**
 * Step 4: Asset Resolution within an Identity Family
 * Supports 'strict', 'preferred', and 'fallback' matching semantics
 * When strict: zero matching candidates = null (Principle 9 & 10)
 */
export function resolveAsset(identity: IconItem, criteria: AssetCriteria = {}): BrandAsset | null {
  if (!identity || !identity.assets || identity.assets.length === 0) {
    return identity.canonicalAsset || null;
  }

  const assets = identity.assets;
  const mode = criteria.mode || 'preferred';

  // In STRICT mode, hard constraints must be satisfied
  if (mode === 'strict') {
    const candidates = assets.filter(a => {
      if (criteria.sourceProvider && criteria.sourceProvider !== 'all' && a.sourceProvider !== criteria.sourceProvider) {
        return false;
      }
      if (criteria.role && criteria.role !== 'all' && a.role !== criteria.role) {
        return false;
      }
      if (criteria.context && criteria.context !== 'all' && !a.context?.includes(criteria.context as any)) {
        return false;
      }
      if (criteria.variant && criteria.variant !== 'all') {
        const matchesVariant =
          a.graphicVariant === criteria.variant ||
          (criteria.variant === 'monochrome' && a.colorType === 'monochrome') ||
          (criteria.variant === 'color' && a.colorType === 'multi-color');
        if (!matchesVariant) return false;
      }
      return true;
    });

    if (candidates.length === 0) {
      // Hard constraint failure: return null instead of silently falling back to a generic logo
      return null;
    }

    return candidates.find(a => a.isCanonical) || candidates[0];
  }

  // In PREFERRED mode: candidate scoring
  const scored = assets.map(a => {
    let score = 0;
    if (criteria.sourceProvider && criteria.sourceProvider !== 'all' && a.sourceProvider === criteria.sourceProvider) {
      score += 100;
    }
    if (criteria.role && criteria.role !== 'all') {
      if (a.role === criteria.role) score += 60;
      else score -= 20;
    }
    if (criteria.context && criteria.context !== 'all') {
      if (a.context?.includes(criteria.context as any)) score += 50;
      else score -= 15;
    }
    if (criteria.variant && criteria.variant !== 'all') {
      const matchesVariant =
        a.graphicVariant === criteria.variant ||
        (criteria.variant === 'monochrome' && a.colorType === 'monochrome') ||
        (criteria.variant === 'color' && a.colorType === 'multi-color');
      if (matchesVariant) score += 40;
      else score -= 10;
    }
    if (a.isCanonical) score += 25;
    if (a.trustState === 'verified' || a.trustState === 'trusted') score += 20;

    return { asset: a, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.asset || identity.canonicalAsset || assets[0];
}

/**
 * Step 5: Complete Resolver Pipeline
 */
export function resolveBestAsset(
  query: string,
  criteria: AssetCriteria = {},
  catalog: IconItem[]
): ResolvedAssetMatch | null {
  const identity = resolveIdentity(query, catalog);
  if (!identity) return null;

  const matchedAsset = resolveAsset(identity, criteria);

  if (!matchedAsset && criteria.mode === 'strict') {
    return {
      identity,
      matchedAsset: null,
      allAssets: identity.assets || [],
      matchType: 'unresolved',
      matchReason: `Strict constraint not met for identity "${identity.id}"`
    };
  }

  const finalAsset = matchedAsset || identity.canonicalAsset;

  return {
    identity,
    matchedAsset: finalAsset,
    allAssets: identity.assets || [finalAsset],
    matchType: 'exact-identity',
    matchReason: `Resolved identity "${identity.id}" with asset role "${finalAsset.role}" (${finalAsset.graphicVariant})`
  };
}

/**
 * Step 6: Asset-Aware Natural Language & Multi-Token Search
 * Returns explainable search scoring and match checklists
 */
export function searchCatalogAssetAware(query: string, catalog: IconItem[]): AssetAwareSearchResult[] {
  if (!query || !query.trim()) {
    return catalog.map(icon => ({
      icon,
      matchedAsset: icon.canonicalAsset,
      matchReason: 'Catalog baseline',
      matchScore: 0,
      matchChecklist: {
        exactIdentity: false,
        aliasMatch: false,
        roleMatch: false,
        contextMatch: false,
        variantMatch: false,
        trustedSource: true
      }
    }));
  }

  const intent = parseSearchIntent(query);
  const results: AssetAwareSearchResult[] = [];

  for (const icon of catalog) {
    let score = 0;
    const reasons: string[] = [];
    const checklist: MatchChecklist = {
      exactIdentity: false,
      aliasMatch: false,
      roleMatch: false,
      contextMatch: false,
      variantMatch: false,
      trustedSource: icon.trustState === 'verified' || icon.trustState === 'trusted'
    };

    const iconId = icon.id.toLowerCase();
    const iconSlug = icon.slug.toLowerCase();
    const iconTitle = icon.title.toLowerCase();
    const iconAliases = (icon.aliases || []).map(a => a.toLowerCase());

    // 1. Identity exactness
    if (iconId === intent.resolvedIdentityId || iconSlug === intent.resolvedIdentityId) {
      score += 50;
      checklist.exactIdentity = true;
      reasons.push(`✓ 精确标识: ${icon.id}`);
    } else if (iconAliases.includes(intent.targetIdentity)) {
      score += 45;
      checklist.aliasMatch = true;
      reasons.push(`✓ 别名: ${intent.targetIdentity} -> ${icon.id}`);
    } else if (iconTitle === intent.targetIdentity || iconTitle.includes(intent.targetIdentity)) {
      score += 35;
      reasons.push(`✓ 品牌名: ${icon.title}`);
    } else if (iconId.includes(intent.targetIdentity)) {
      score += 25;
      reasons.push(`✓ 包含: ${icon.id}`);
    } else if (intent.targetIdentity.length === 0 && (intent.roleConstraint || intent.contextConstraint || intent.variantPreference)) {
      // Query specified only role/context without identity
      score += 10;
    }

    if (score === 0) continue;

    // 2. Asset matching within family
    const family = icon.assets || [icon.canonicalAsset];
    let matchedAsset = icon.canonicalAsset;

    if (intent.roleConstraint || intent.contextConstraint || intent.variantPreference) {
      const criteria: AssetCriteria = {
        role: intent.roleConstraint || undefined,
        context: intent.contextConstraint || undefined,
        variant: intent.variantPreference || undefined,
        mode: intent.mode
      };

      const resolved = resolveAsset(icon, criteria);
      if (resolved) {
        matchedAsset = resolved;
        if (intent.roleConstraint && matchedAsset.role === intent.roleConstraint) {
          score += 20;
          checklist.roleMatch = true;
          reasons.push(`✓ 角色: ${intent.roleConstraint}`);
        }
        if (intent.contextConstraint && matchedAsset.context?.includes(intent.contextConstraint)) {
          score += 15;
          checklist.contextMatch = true;
          reasons.push(`✓ 上下文: ${intent.contextConstraint}`);
        }
        if (intent.variantPreference && (matchedAsset.graphicVariant === intent.variantPreference || matchedAsset.colorType === intent.variantPreference)) {
          score += 15;
          checklist.variantMatch = true;
          reasons.push(`✓ 变体: ${intent.variantPreference}`);
        }
      } else if (intent.mode === 'strict') {
        // In strict mode, skip if constraint was unsatisfied
        continue;
      }
    }

    if (checklist.trustedSource) {
      score += 5;
    }

    results.push({
      icon,
      matchedAsset,
      matchReason: reasons.join(' · ') || '匹配查询',
      matchScore: Math.min(100, score),
      matchChecklist: checklist
    });
  }

  // Sort descending by score
  results.sort((a, b) => b.matchScore - a.matchScore);
  return results;
}
