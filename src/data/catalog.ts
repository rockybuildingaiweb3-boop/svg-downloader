import rawRegistry from '../../generated/registry.json';
import type { IconRecord, IconItem, SourceRecord, BrandAsset, RegistryStats, ConcreteAssetItem } from '../types';
import { getSemanticSourceLabel } from '../types';

export const REGISTRY_STATS: RegistryStats = (rawRegistry as any).stats;
export const CANONICAL_CATALOG: IconRecord[] = (rawRegistry as any).identities as IconRecord[];

/**
 * Maps canonical record to UI IconItem with full BrandIdentity and AssetFamily support
 */
export const REGISTRY_ITEMS: IconItem[] = CANONICAL_CATALOG.map((rec) => {
  const sourceProvider = (rec.sourceProvider || (rec.source === 'svg-logos' ? 'iconify' : rec.source)) as any;
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
    category: rec.primaryCategory || rec.category || 'technology',
    primaryCategory: rec.primaryCategory || rec.category || 'technology',
    categories: Array.isArray(rec.categories) && rec.categories.length > 0
      ? rec.categories
      : [rec.primaryCategory || rec.category || 'technology'],
    categorySource: rec.categorySource || 'derived',
    categoryConfidence: rec.categoryConfidence ?? 0.8,
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

// Backward-compatible alias (Principle 34)
export const CURATED_ICONS: IconItem[] = REGISTRY_ITEMS;

export const ICON_MAP: Record<string, IconItem> = REGISTRY_ITEMS.reduce((acc, icon) => {
  acc[icon.slug] = icon;
  return acc;
}, {} as Record<string, IconItem>);

// Flattened concrete assets list for "Browse by Assets" mode
export const REGISTRY_ASSETS: ConcreteAssetItem[] = [];
for (const icon of REGISTRY_ITEMS) {
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
    });
  }
}

export const ASSET_MAP: Record<string, ConcreteAssetItem> = REGISTRY_ASSETS.reduce((acc, asset) => {
  acc[asset.assetId] = asset;
  return acc;
}, {} as Record<string, ConcreteAssetItem>);
