import aliasesData from '../../config/aliases.json';
import { IconItem, BrandAsset, AssetRole, UsageContext, SourceProvider, SourcePolicy } from '../types';

export interface AssetCriteria {
  role?: AssetRole | string;
  context?: UsageContext | string;
  variant?: string;
  sourceProvider?: SourceProvider | string;
  policy?: SourcePolicy;
}

export interface ResolvedAssetMatch {
  identity: IconItem;
  matchedAsset: BrandAsset;
  allAssets: BrandAsset[];
  matchType: 'exact-identity' | 'alias' | 'role-context-match' | 'fuzzy-identity' | 'tag';
  matchReason?: string;
}

export interface AssetAwareSearchResult {
  icon: IconItem;
  matchedAsset?: BrandAsset;
  matchReason: string;
  matchScore: number;
}

// Canonical Aliases Map: resolves aliases strictly to identity IDs, not filenames.
const ALIASES_MAP: Record<string, string> = {
  ...aliasesData,
  node: 'nodedotjs',
  nodejs: 'nodedotjs',
  next: 'nextdotjs',
  nextjs: 'nextdotjs',
  vue: 'vuedotjs',
  vuejs: 'vuedotjs',
  aws: 'amazonwebservices',
  gcp: 'googlecloud',
  azure: 'microsoftazure',
  twitter: 'x',
  cpp: 'cplusplus',
  'c++': 'cplusplus',
  golang: 'go',
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  k8s: 'kubernetes',
  vscode: 'visualstudiocode',
  tailwind: 'tailwindcss',
  nuxt: 'nuxt',
  nuxtjs: 'nuxt'
};

/**
 * Step 1: Normalize query string
 */
export function normalizeQuery(query: string): string {
  if (!query) return '';
  return query
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9+-]/g, '');
}

/**
 * Step 2: Alias Resolution (resolves alias to identity ID, never to filenames)
 */
export function resolveAlias(raw: string): string {
  const norm = normalizeQuery(raw);
  if (ALIASES_MAP[norm]) return ALIASES_MAP[norm];

  const stripped = norm.replace(/[^a-z0-9]/g, '');
  if (ALIASES_MAP[stripped]) return ALIASES_MAP[stripped];

  return norm;
}

/**
 * Step 3: Identity Resolution
 * query -> normalize -> alias resolution -> identity resolution
 */
export function resolveIdentity(query: string, catalog: IconItem[]): IconItem | null {
  if (!query || !catalog.length) return null;
  const normalized = normalizeQuery(query);
  const canonicalId = resolveAlias(normalized);

  // Exact ID / slug match
  const exact = catalog.find(i => i.id === canonicalId || i.slug === canonicalId);
  if (exact) return exact;

  // Title match
  const titleMatch = catalog.find(i => normalizeQuery(i.title) === normalized);
  if (titleMatch) return titleMatch;

  // Normalized prefix match
  const prefixMatch = catalog.find(i => i.id.startsWith(canonicalId) || i.slug.startsWith(canonicalId));
  if (prefixMatch) return prefixMatch;

  return null;
}

/**
 * Step 4: Asset Resolution within an Identity Family
 * context matching -> role matching -> variant matching -> source policy
 */
export function resolveAsset(identity: IconItem, criteria: AssetCriteria = {}): BrandAsset | null {
  if (!identity || !identity.assets || identity.assets.length === 0) {
    return identity.canonicalAsset || null;
  }

  const assets = identity.assets;

  // 1. If explicit source provider requested
  let filtered = assets;
  if (criteria.sourceProvider && criteria.sourceProvider !== 'all') {
    const provMatches = filtered.filter(a => a.sourceProvider === criteria.sourceProvider);
    if (provMatches.length > 0) filtered = provMatches;
  }

  // 2. If role requested (symbol, logo, wordmark, app-icon, favicon, etc.)
  if (criteria.role && criteria.role !== 'all') {
    const roleMatches = filtered.filter(a => a.role === criteria.role);
    if (roleMatches.length > 0) filtered = roleMatches;
  }

  // 3. If context requested (web, mobile, desktop, app-store, social, etc.)
  if (criteria.context && criteria.context !== 'all') {
    const contextMatches = filtered.filter(a => a.context?.includes(criteria.context as any));
    if (contextMatches.length > 0) filtered = contextMatches;
  }

  // 4. If variant requested (color, monochrome, original, plain, line, wordmark)
  if (criteria.variant && criteria.variant !== 'all') {
    const variantMatches = filtered.filter(a =>
      a.graphicVariant === criteria.variant ||
      (criteria.variant === 'monochrome' && a.colorType === 'monochrome') ||
      (criteria.variant === 'color' && a.colorType === 'multi-color')
    );
    if (variantMatches.length > 0) filtered = variantMatches;
  }

  // 5. Prefer canonical asset if it is among filtered
  const canonicalInFiltered = filtered.find(a => a.isCanonical || a.assetId === identity.canonicalAssetId);
  if (canonicalInFiltered) return canonicalInFiltered;

  return filtered[0] || identity.canonicalAsset || assets[0];
}

/**
 * Step 5: Complete Resolver Pipeline
 * query -> normalize -> alias -> identity -> asset family discovery -> context matching -> role matching -> variant matching -> canonical asset selection
 */
export function resolveBestAsset(
  query: string,
  criteria: AssetCriteria = {},
  catalog: IconItem[]
): ResolvedAssetMatch | null {
  const identity = resolveIdentity(query, catalog);
  if (!identity) return null;

  const matchedAsset = resolveAsset(identity, criteria) || identity.canonicalAsset;

  return {
    identity,
    matchedAsset,
    allAssets: identity.assets || [matchedAsset],
    matchType: 'exact-identity',
    matchReason: `Resolved identity "${identity.id}" with asset role "${matchedAsset.role}" (${matchedAsset.graphicVariant})`
  };
}

/**
 * Step 6: Asset-Aware Multi-Token Search
 * Supports:
 * - title, canonical identity, slug, aliases
 * - source, source collection
 * - asset role (e.g. symbol, logo, wordmark, favicon, app-icon)
 * - graphic variant (e.g. color, monochrome, original, plain, wordmark)
 * - context (e.g. mobile, web, desktop, social)
 * - category
 * 
 * Handles multi-token queries like:
 * "instagram mobile", "instagram favicon", "github wordmark", "nextjs", "node", "aws"
 */
export function searchCatalogAssetAware(query: string, catalog: IconItem[]): AssetAwareSearchResult[] {
  if (!query || !query.trim()) {
    return catalog.map(icon => ({
      icon,
      matchedAsset: icon.canonicalAsset,
      matchReason: 'Catalog baseline',
      matchScore: 0
    }));
  }

  const rawTokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (rawTokens.length === 0) return [];

  // Known role and context keywords
  const ROLE_KEYWORDS = ['symbol', 'logo', 'wordmark', 'favicon', 'app-icon', 'badge', 'mark', 'icon'];
  const CONTEXT_KEYWORDS = ['mobile', 'web', 'desktop', 'social', 'app-store', 'avatar', 'general'];
  const VARIANT_KEYWORDS = ['monochrome', 'mono', 'color', 'original', 'plain', 'line', 'white', 'dark'];

  let roleFilter: string | null = null;
  let contextFilter: string | null = null;
  let variantFilter: string | null = null;
  const identityTokens: string[] = [];

  for (const token of rawTokens) {
    if (ROLE_KEYWORDS.includes(token)) {
      roleFilter = token === 'icon' ? 'symbol' : token;
    } else if (CONTEXT_KEYWORDS.includes(token)) {
      contextFilter = token;
    } else if (VARIANT_KEYWORDS.includes(token)) {
      variantFilter = token === 'mono' ? 'monochrome' : token;
    } else {
      identityTokens.push(token);
    }
  }

  const targetIdentityQuery = identityTokens.join('-') || rawTokens[0];
  const resolvedTargetId = resolveAlias(targetIdentityQuery);

  const results: AssetAwareSearchResult[] = [];

  for (const icon of catalog) {
    let score = 0;
    let matchReason = '';
    let matchedAsset: BrandAsset | undefined = icon.canonicalAsset;

    const iconId = icon.id.toLowerCase();
    const iconSlug = icon.slug.toLowerCase();
    const iconTitle = icon.title.toLowerCase();
    const iconCategory = icon.category.toLowerCase();
    const iconAliases = (icon.aliases || []).map(a => a.toLowerCase());

    // 1. Check Identity Match
    if (iconId === resolvedTargetId || iconSlug === resolvedTargetId) {
      score += 100;
      matchReason = `精确匹配标识: ${icon.id}`;
    } else if (iconAliases.includes(targetIdentityQuery)) {
      score += 90;
      matchReason = `别名匹配: ${targetIdentityQuery} -> ${icon.id}`;
    } else if (iconTitle === targetIdentityQuery || iconTitle.includes(targetIdentityQuery)) {
      score += 70;
      matchReason = `品牌标题匹配: ${icon.title}`;
    } else if (iconId.includes(targetIdentityQuery) || iconSlug.includes(targetIdentityQuery)) {
      score += 50;
      matchReason = `标识前缀/包含匹配`;
    } else if (iconCategory.includes(targetIdentityQuery)) {
      score += 30;
      matchReason = `分类匹配: ${icon.category}`;
    }

    // If query has no identity tokens (e.g. user just typed "mobile" or "wordmark")
    if (identityTokens.length === 0 && (roleFilter || contextFilter || variantFilter)) {
      score += 10;
    }

    // 2. Check Asset-Aware Role / Context / Variant Match
    if (score > 0 || identityTokens.length === 0) {
      const family = icon.assets || [icon.canonicalAsset];

      let candidate = family.find(a => {
        let match = true;
        if (roleFilter && a.role !== roleFilter) match = false;
        if (contextFilter && !a.context?.includes(contextFilter as any)) match = false;
        if (variantFilter && a.graphicVariant !== variantFilter && a.colorType !== variantFilter) match = false;
        return match;
      });

      if (candidate) {
        matchedAsset = candidate;
        score += 40;
        const reasons: string[] = [];
        if (roleFilter) reasons.push(`角色: ${roleFilter}`);
        if (contextFilter) reasons.push(`上下文: ${contextFilter}`);
        if (variantFilter) reasons.push(`变体: ${variantFilter}`);
        matchReason = `${matchReason ? matchReason + ' + ' : ''}精准资产形态 (${reasons.join(', ')})`;
      } else if (roleFilter || contextFilter || variantFilter) {
        // If user specifically requested role/context and this icon has NO matching asset, lower score
        if (identityTokens.length === 0) {
          continue; // Skip icons without that asset role
        }
      }
    }

    if (score > 0) {
      results.push({
        icon,
        matchedAsset: matchedAsset || icon.canonicalAsset,
        matchReason: matchReason || '匹配查询',
        matchScore: score
      });
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.matchScore - a.matchScore);
  return results;
}
