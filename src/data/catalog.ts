import rawRegistry from '../../generated/registry.json';
import buildMetadata from '../../generated/build-metadata.json';
import type { IconRecord, IconItem, SourceRecord, BrandAsset, RegistryStats, ConcreteAssetItem, SourceProvider } from '../types';
import { getSemanticSourceLabel } from '../types';
import { inferEntityType } from '../taxonomy/taxonomy';

import { ENABLED_SOURCES } from './sourceRegistry';

export const BUILD_METADATA = buildMetadata;
export const REGISTRY_STATS: RegistryStats = (rawRegistry as any).stats;
export const CANONICAL_CATALOG: IconRecord[] = (rawRegistry as any).identities as IconRecord[];

export function classifyLicenseStatus(license: string | undefined): string {
  if (!license || license.toLowerCase() === 'unknown') return 'unknown';
  const l = license.toLowerCase();
  if (l.includes('trademark') || l.includes('brand guidelines') || l.includes('proprietary')) return 'trademark';
  if (l.includes('restricted') || l.includes('all rights reserved') || l.includes('non-commercial')) return 'restricted';
  if (l.includes('mixed') || l.includes('multi')) return 'mixed';
  return 'known';
}

function normalizeProvider(prov: string | undefined): SourceProvider {
  if (!prov) return 'unknown' as any;
  if (prov === 'iconify') return 'svg-logos';
  return prov as SourceProvider;
}

/**
 * Maps canonical record to UI IconItem with full BrandIdentity and AssetFamily support
 */
export function hydrateItem(rec: any): IconItem {
  const rawProv = rec.sourceProvider || rec.source;
  const sourceProvider = normalizeProvider(rawProv);
  const sourceCollection = rec.sourceCollection || (rec.source === 'svg-logos' || rec.source === 'iconify' ? 'logos' : rec.source) || 'unknown';
  const role = (rec.role || 'unknown') as any;
  const context = (rec.context && rec.context.length > 0) ? rec.context : (['unknown'] as any[]);
  const contextOrigin = (rec.contextOrigin || 'unknown') as any;
  const graphicVariant = rec.graphicVariant || rec.variant || 'unknown';
  const trustState = rec.trustState || 'community';

  const defaultAsset: BrandAsset = {
    assetId: rec.canonicalAssetId || `${rec.id}-${sourceProvider}-${role}`,
    identityId: rec.id,
    sourceProvider,
    sourcePlatform: getSemanticSourceLabel(sourceProvider, sourceCollection),
    sourceCollection,
    sourceId: rec.sourceId || rec.id,
    sourceVersion: rec.sourceVersion || 'unknown',
    role,
    context,
    contextOrigin,
    graphicVariant,
    file: rec.file,
    rawSha256: rec.rawSha256,
    license: rec.license || 'Unknown',
    licenseStatus: classifyLicenseStatus(rec.license),
    sourceUrl: rec.sourceUrl,
    isCanonical: true,
    xmlValid: rec.xmlValid ?? false,
    svgRenderable: rec.svgRenderable ?? rec.renderable ?? false,
    sourceTrusted: rec.sourceTrusted ?? false,
    canonicalResolved: rec.canonicalResolved ?? false,
    integrityVerified: rec.integrityVerified ?? false,
    variantVerified: rec.variantVerified ?? false,
    renderable: rec.renderable ?? false,
    verificationStatus: rec.verificationStatus || (rec.verified ? 'verified' : 'unresolved'),
    trustState,
    colorType: rec.colorType || (rec.assets?.[0]?.colorType) || 'monochrome',
    structuralMetrics: rec.structuralMetrics || (rec.assets?.[0]?.structuralMetrics),
    notes: rec.notes,
    canonicalDecision: (rec as any).canonicalDecision
  };

  const assets: BrandAsset[] = (rec.assets && rec.assets.length > 0)
    ? rec.assets.map(a => {
        const aProv = normalizeProvider(a.sourceProvider || sourceProvider);
        const aColl = a.sourceCollection || (aProv === 'svg-logos' ? 'logos' : sourceCollection);
        return {
          ...a,
          sourceProvider: aProv,
          sourceCollection: aColl,
          sourcePlatform: a.sourcePlatform || getSemanticSourceLabel(aProv, aColl),
          licenseStatus: classifyLicenseStatus(a.license || rec.license)
        };
      })
    : [defaultAsset];

  const distinctProviders = new Set(assets.map(a => a.sourceProvider).filter(Boolean));
  const assetProviderCount = distinctProviders.size;

  const canonicalAsset = rec.canonicalAsset ? {
    ...rec.canonicalAsset,
    sourceProvider: normalizeProvider(rec.canonicalAsset.sourceProvider || sourceProvider),
    licenseStatus: classifyLicenseStatus(rec.canonicalAsset.license || rec.license)
  } : (assets.find(a => a.isCanonical) || assets[0]);

  const sourceRecords: SourceRecord[] = (rec.sourceRecords || []).map(sr => ({
    ...sr,
    sourceProvider: normalizeProvider(sr.sourceProvider)
  }));
  const sourcesCount = rec.sourceCoverageFound !== undefined
    ? rec.sourceCoverageFound
    : (rec.sourceCoverage ? Object.values(rec.sourceCoverage).filter(v => v === 'available').length : undefined);

  return {
    id: rec.id,
    slug: rec.id,
    fileName: rec.file,
    title: rec.title,
    category: rec.primaryCategory || rec.category || 'uncategorized',
    primaryCategory: rec.primaryCategory || rec.category || 'uncategorized',
    categories: Array.isArray(rec.categories) && rec.categories.length > 0
      ? rec.categories
      : [rec.primaryCategory || rec.category || 'uncategorized'],
    categorySource: rec.categorySource || 'fallback',
    categoryConfidence: rec.categoryConfidence !== undefined ? rec.categoryConfidence : undefined,
    categoryEvidence: rec.categoryEvidence || [],
    entityType: rec.entityType || inferEntityType(rec),
    sourceCoverage: rec.sourceCoverage,
    sourceCoverageFound: rec.sourceCoverageFound !== undefined
      ? rec.sourceCoverageFound
      : (rec.sourceCoverage ? Object.values(rec.sourceCoverage).filter(v => v === 'available').length : undefined),
    sourceCoverageChecked: rec.sourceCoverageChecked !== undefined
      ? rec.sourceCoverageChecked
      : (rec.sourceCoverage ? Object.keys(rec.sourceCoverage).length : undefined),
    sourceCoverageScore: rec.sourceCoverageScore !== undefined
      ? rec.sourceCoverageScore
      : (rec.sourceCoverage ? `${Object.values(rec.sourceCoverage).filter(v => v === 'available').length} / ${Object.keys(rec.sourceCoverage).length}` : undefined),
    providerCount: rec.providerCount !== undefined ? rec.providerCount : rec.sourceCoverageFound,
    assetProviderCount,
    assetCount: assets.length,
    hex: (rec.brandColor || '#111827').replace('#', ''),
    source: normalizeProvider(rec.source),
    sourceProvider,
    sourcePlatform: getSemanticSourceLabel(sourceProvider, sourceCollection),
    sourceCollection,
    sourceVersion: rec.sourceVersion,
    sourceId: rec.sourceId,
    sha256: rec.rawSha256,
    role,
    context,
    contextOrigin,
    graphicVariant,
    variant: rec.variant || 'default',
    variants: rec.variants || {},
    license: rec.license,
    licenseStatus: classifyLicenseStatus(rec.license),
    sourceUrl: rec.sourceUrl,
    alternativeSources: rec.alternativeSources,
    sourceRecords,
    sourcesCount,
    // Granular verification flags
    xmlValid: rec.xmlValid ?? false,
    svgRenderable: rec.svgRenderable ?? rec.renderable ?? false,
    sourceTrusted: rec.sourceTrusted ?? false,
    canonicalResolved: rec.canonicalResolved ?? false,
    integrityVerified: rec.integrityVerified ?? false,
    variantVerified: rec.variantVerified ?? false,
    renderable: rec.renderable ?? false,
    verificationStatus: rec.verificationStatus || (rec.verified ? 'verified' : 'unresolved'),
    trustState,
    verified: rec.verified ?? false,
    conflicts: rec.conflicts,
    notes: rec.notes,
    colorType: canonicalAsset.colorType || rec.colorType || 'monochrome',
    structuralMetrics: canonicalAsset.structuralMetrics || rec.structuralMetrics,
    canonicalAssetId: canonicalAsset.assetId,
    canonicalAsset,
    canonicalDecision: (rec as any).canonicalDecision,
    assets,
    totalAssets: assets.length
  };
}

export const REGISTRY_IDENTITIES: IconItem[] = CANONICAL_CATALOG.map(hydrateItem);

// Transitional compatibility alias
export const REGISTRY_ITEMS: IconItem[] = REGISTRY_IDENTITIES;

export const ICON_MAP: Record<string, IconItem> = REGISTRY_IDENTITIES.reduce((acc, icon) => {
  acc[icon.slug] = icon;
  return acc;
}, {} as Record<string, IconItem>);

// Flattened concrete assets list for "Browse by Assets" mode
export const REGISTRY_ASSETS: ConcreteAssetItem[] = [];
for (const icon of REGISTRY_IDENTITIES) {
  for (const asset of icon.assets || []) {
    REGISTRY_ASSETS.push({
      ...asset,
      identityTitle: icon.title,
      identitySlug: icon.slug,
      brandColor: icon.hex ? `#${icon.hex}` : undefined,
      category: icon.category,
      primaryCategory: icon.primaryCategory,
      categories: icon.categories,
      categorySource: icon.categorySource,
      categoryConfidence: icon.categoryConfidence,
      categoryEvidence: icon.categoryEvidence,
      entityType: icon.entityType,
    });
  }
}

export const ASSET_MAP: Record<string, ConcreteAssetItem> = REGISTRY_ASSETS.reduce((acc, asset) => {
  acc[asset.assetId] = asset;
  return acc;
}, {} as Record<string, ConcreteAssetItem>);

export const REGISTRY_SOURCES: SourceProvider[] = ENABLED_SOURCES.map(s => s.id);

// Pre-indexed Category and Source lookup maps for O(1) filtering (Phase 18)
export const CATEGORY_INDEX: Record<string, string[]> = {};
export const SOURCE_INDEX: Record<string, string[]> = {};

for (const icon of REGISTRY_IDENTITIES) {
  const cats = icon.categories || (icon.category ? [icon.category] : ['uncategorized']);
  for (const cat of cats) {
    if (!CATEGORY_INDEX[cat]) CATEGORY_INDEX[cat] = [];
    CATEGORY_INDEX[cat].push(icon.id);
  }

  const src = icon.sourceProvider || 'simple-icons';
  if (!SOURCE_INDEX[src]) SOURCE_INDEX[src] = [];
  SOURCE_INDEX[src].push(icon.id);

  for (const asset of icon.assets || []) {
    if (asset.sourceProvider && asset.sourceProvider !== src) {
      if (!SOURCE_INDEX[asset.sourceProvider]) SOURCE_INDEX[asset.sourceProvider] = [];
      if (!SOURCE_INDEX[asset.sourceProvider].includes(icon.id)) {
        SOURCE_INDEX[asset.sourceProvider].push(icon.id);
      }
    }
  }
}
