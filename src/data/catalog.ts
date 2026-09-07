import rawRegistry from '../../generated/registry.json';
import buildMetadata from '../../generated/build-metadata.json';
import type { IconRecord, IconItem, SourceRecord, BrandAsset, RegistryStats, ConcreteAssetItem, SourceProvider } from '../types';
import { getSemanticSourceLabel } from '../types';
import { inferEntityType } from '../taxonomy/taxonomy';

export const BUILD_METADATA = buildMetadata;
export const REGISTRY_STATS: RegistryStats = (rawRegistry as any).stats;
export const CANONICAL_CATALOG: IconRecord[] = (rawRegistry as any).identities as IconRecord[];

/**
 * Maps canonical record to UI IconItem with full BrandIdentity and AssetFamily support
 */
export const REGISTRY_IDENTITIES: IconItem[] = CANONICAL_CATALOG.map((rec) => {
  const sourceProvider = (rec.sourceProvider || rec.source || 'simple-icons') as any;
  const sourceCollection = rec.sourceCollection || (rec.source === 'svg-logos' ? 'logos' : rec.source);
  const role = (rec.role || 'logo') as any;
  const context = (rec.context || ['general']) as any[];
  const contextOrigin = (rec.contextOrigin || 'unknown') as any;
  const graphicVariant = rec.graphicVariant || rec.variant || 'default';
  const trustState = (rec.trustState || (rec.sourceTrusted ? 'verified' : 'community')) as any;

  const defaultAsset: BrandAsset = {
    assetId: rec.canonicalAssetId || `${rec.id}-${sourceProvider}-${role}`,
    identityId: rec.id,
    sourceProvider,
    sourcePlatform: getSemanticSourceLabel(sourceProvider, sourceCollection),
    sourceCollection,
    sourceId: rec.sourceId,
    sourceVersion: rec.sourceVersion,
    role,
    context,
    contextOrigin,
    graphicVariant,
    file: rec.file,
    rawSha256: rec.rawSha256,
    license: rec.license || null as any,
    licenseStatus: rec.license ? 'permissive' : 'unknown',
    sourceUrl: rec.sourceUrl,
    isCanonical: true,
    xmlValid: rec.xmlValid ?? false,
    svgRenderable: rec.svgRenderable ?? rec.renderable ?? false,
    sourceTrusted: rec.sourceTrusted ?? (trustState === 'verified' || trustState === 'trusted'),
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
    ? rec.assets.map(a => ({
        ...a,
        sourcePlatform: getSemanticSourceLabel(a.sourceProvider || sourceProvider, a.sourceCollection || sourceCollection),
        xmlValid: a.xmlValid ?? false,
        svgRenderable: a.svgRenderable ?? a.renderable ?? false,
        sourceTrusted: a.sourceTrusted ?? (a.trustState === 'verified' || a.trustState === 'trusted'),
        canonicalResolved: a.canonicalResolved ?? false,
        integrityVerified: a.integrityVerified ?? false,
        variantVerified: a.variantVerified ?? false,
        renderable: a.renderable ?? false,
        verificationStatus: a.verificationStatus || 'unresolved',
        trustState: a.trustState || trustState,
        colorType: a.colorType || 'monochrome',
        structuralMetrics: a.structuralMetrics
      }))
    : [defaultAsset];

  const canonicalAsset = rec.canonicalAsset || assets.find(a => a.isCanonical) || assets[0];
  const sourceRecords: SourceRecord[] = rec.sourceRecords || [];
  const sourcesCount = rec.totalAssets
    ? Math.max(1, new Set(assets.map(a => a.sourceProvider)).size)
    : (sourceRecords.length || (rec.alternativeSources?.length ? rec.alternativeSources.length + 1 : 1));

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
    categorySource: rec.categorySource || 'derived',
    categoryConfidence: rec.categoryConfidence ?? 0.8,
    categoryEvidence: rec.categoryEvidence || [],
    entityType: rec.entityType || inferEntityType(rec),
    sourceCoverage: rec.sourceCoverage,
    sourceCoverageFound: rec.sourceCoverageFound,
    sourceCoverageChecked: rec.sourceCoverageChecked,
    sourceCoverageScore: rec.sourceCoverageScore,
    hex: (rec.brandColor || '#111827').replace('#', ''),
    source: rec.source,
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
    licenseStatus: rec.license ? 'permissive' : 'unknown',
    sourceUrl: rec.sourceUrl,
    alternativeSources: rec.alternativeSources,
    sourceRecords,
    sourcesCount,
    // Granular verification flags
    xmlValid: rec.xmlValid ?? false,
    svgRenderable: rec.svgRenderable ?? rec.renderable ?? false,
    sourceTrusted: rec.sourceTrusted ?? (trustState === 'verified' || trustState === 'trusted'),
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
});

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

import { ENABLED_SOURCES } from './sourceRegistry';
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
