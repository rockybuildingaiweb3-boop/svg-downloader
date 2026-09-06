export type IconCategory =
  | 'all'
  | 'mainstream'
  | 'brands'
  | 'technologies'
  | 'apps'
  | 'social'
  | 'cloud'
  | 'databases'
  | 'design'
  | 'developer-tools'
  | 'gaming'
  | 'web3'
  | 'custom'
  | 'bigtech'
  | 'ai'
  | 'frontend'
  | 'languages'
  | 'tools';

export type CollectionType = 'mainstream' | 'all' | 'custom';

export type AssetRole =
  | 'all'
  | 'symbol'
  | 'logo'
  | 'wordmark'
  | 'app-icon'
  | 'favicon'
  | 'badge'
  | 'mark'
  | 'wordmark-horizontal'
  | 'wordmark-stacked';

export type UsageContext =
  | 'all'
  | 'web'
  | 'desktop'
  | 'mobile'
  | 'app-store'
  | 'favicon'
  | 'social'
  | 'avatar'
  | 'general';

export type ContextOrigin = 'source-confirmed' | 'inferred' | 'unknown';

export type SourceProvider =
  | 'simple-icons'
  | 'devicon'
  | 'iconify'
  | 'official'
  | 'wikimedia';

export type IconSource = 'all' | SourceProvider | 'svg-logos';

export type TrustState = 'trusted' | 'verified' | 'community' | 'unverified';

export type VerificationStatus = 'all' | 'verified' | 'warning' | 'conflict' | 'unresolved' | 'invalid';

export type BrowseLevel = 'identities' | 'assets';

export type SourcePolicy = 'brand' | 'technology' | 'monochrome' | 'official';

export type PresentationMode = 'raw' | 'preview-dark' | 'preview-light' | 'derived-currentColor';

export interface CanonicalDecision {
  selectedAssetId: string;
  score: number;
  reasons: string[];
  policy: string;
  mode?: string;
}

export interface RegistryStats {
  generatedAt: string;
  totalIdentities: number;
  totalAssets: number;
  sourceCounts: Record<string, number>;
  canonicalCount: number;
  variantCount: number;
  verifiedIdentities: number;
  conflictsCount: number;
  sourceVersions: Record<string, string>;
}

/**
 * Granular verification metrics
 * Note: A valid SVG is NOT automatically a correct brand logo.
 */
export interface VerificationFlags {
  xmlValid: boolean;
  svgRenderable: boolean;
  sourceTrusted: boolean;
  canonicalResolved: boolean;
  integrityVerified: boolean;
  variantVerified: boolean;
  status: 'verified' | 'warning' | 'conflict' | 'unresolved' | 'invalid';
}

/**
 * Source Record (Evidence from source platform)
 * Distinguishes source evidence from the selected canonical asset.
 */
export interface SourceRecord {
  sourceProvider: SourceProvider;
  sourcePlatform: string; // "Simple Icons", "Devicon", "SVG Logos", "Official Vendor", "Wikimedia Commons"
  sourceCollection: string;
  sourceId: string;
  sourceVersion: string;
  sourceUrl?: string;
  license: string;
  trustState: TrustState;
  assetCount: number;
  availableRoles: AssetRole[];
  availableVariants: string[];
}

export type MatchingMode = 'strict' | 'preferred' | 'fallback';

export type SvgColorType = 'monochrome' | 'single-color' | 'multi-color' | 'gradient' | 'currentColor' | 'unknown';

/**
 * Measurable SVG Structural Metadata calculated via XML AST analysis
 */
export interface SvgStructuralMetrics {
  viewBox?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  fileSize: number; // in bytes
  elementCount: number;
  pathCount: number;
  colorCount: number;
  colorType: SvgColorType;
  distinctColors: string[];
  hasGradient: boolean;
  hasMask: boolean;
  hasClipPath: boolean;
  hasText: boolean;
  hasStyles: boolean;
  hasCurrentColor: boolean;
}

/**
 * Download Receipt shown after a successful download
 */
export interface DownloadReceipt {
  fileName: string;
  identityId: string;
  title: string;
  fileSize: number;
  sourceProvider: SourceProvider;
  sourcePlatform: string;
  role: AssetRole;
  graphicVariant: string;
  rawSha256: string;
  license?: string;
  sourceUrl?: string;
  verificationStatus: string;
  timestamp: string;
}

/**
 * An individual authentic vector asset in an identity's Asset Family
 * Raw canonical SVG must NEVER be modified.
 */
export interface BrandAsset {
  assetId: string;
  identityId: string;
  sourceProvider: SourceProvider;
  sourcePlatform?: string;
  sourceCollection: string;
  sourceId: string;
  sourceVersion: string;
  role: AssetRole;
  context: UsageContext[];
  contextOrigin: ContextOrigin;
  graphicVariant: string;
  file: string;
  rawSha256: string;
  license: string;
  sourceUrl?: string;
  isCanonical: boolean;
  // Granular verification fields
  xmlValid: boolean;
  svgRenderable: boolean;
  sourceTrusted: boolean;
  canonicalResolved: boolean;
  integrityVerified: boolean;
  variantVerified: boolean;
  renderable: boolean;
  verificationStatus: 'verified' | 'warning' | 'conflict' | 'unresolved' | 'invalid';
  trustState: TrustState;
  colorType?: SvgColorType;
  elementCount?: number;
  structuralMetrics?: SvgStructuralMetrics;
  notes?: string;
  rawSvg?: string;
  canonicalDecision?: CanonicalDecision;
  licenseStatus?: string;
  primaryCategory?: string;
  categories?: string[];
  categorySource?: 'curated' | 'derived' | 'source' | 'fallback';
  categoryConfidence?: number;
}

export interface ConcreteAssetItem extends BrandAsset {
  identityTitle?: string;
  identitySlug?: string;
  brandColor?: string;
  category?: string;
  primaryCategory?: string;
  categories?: string[];
  categorySource?: 'curated' | 'derived' | 'source' | 'fallback';
  categoryConfidence?: number;
  matchScore?: number;
  matchChecklist?: string[];
  matchReason?: string;
}

export interface AlternativeSource {
  source: IconSource;
  sourceId: string;
  sourceVersion: string;
  variants?: string[];
  license?: string;
  sourceUrl?: string;
}

/**
 * Full Canonical Brand Identity modeling BRAND IDENTITY -> ASSET FAMILY -> ASSET
 */
export interface BrandIdentity {
  id: string;
  title: string;
  canonicalName: string;
  category: string;
  primaryCategory?: string;
  categories?: string[];
  categorySource?: 'curated' | 'derived' | 'source' | 'fallback';
  categoryConfidence?: number;
  brandColor?: string;
  aliases?: string[];
  tags?: string[];
  canonicalAssetId: string;
  canonicalAsset: BrandAsset;
  assets: BrandAsset[];
  totalAssets: number;
  sourceRecords: SourceRecord[];
  sourcesAvailable: SourceProvider[];
  sourceCoverage?: Record<string, 'available' | 'not-found' | 'not-supported' | 'error' | 'unknown'>;
  sourceCoverageFound?: number;
  sourceCoverageChecked?: number;
  sourceCoverageScore?: string;
  rolesAvailable: AssetRole[];
  contextsAvailable: UsageContext[];
  variantsAvailable: string[];
  hasMultiSource: boolean;
  hasMultiVariant: boolean;
  // Granular verification fields
  xmlValid: boolean;
  svgRenderable: boolean;
  sourceTrusted: boolean;
  canonicalResolved: boolean;
  integrityVerified: boolean;
  variantVerified: boolean;
  verificationStatus: 'verified' | 'warning' | 'conflict' | 'unresolved' | 'invalid';
  trustState: TrustState;
  verified: boolean;
  conflicts?: string[];
  notes?: string;
}

/**
 * Backward-compatible icon record with complete asset family attachment
 */
export interface IconRecord {
  id: string;
  title: string;
  canonicalName: string;
  source: 'simple-icons' | 'devicon' | 'official' | 'wikimedia' | 'svg-logos' | 'iconify';
  sourceProvider?: SourceProvider;
  sourceCollection?: string;
  sourceId: string;
  sourceVersion: string;
  variant: string;
  role?: AssetRole;
  context?: UsageContext[];
  contextOrigin?: ContextOrigin;
  graphicVariant?: string;
  variants?: Record<string, string>;
  file: string;
  rawSha256: string;
  derivedSha256?: string;
  license?: string;
  sourceUrl?: string;
  brandColor?: string;
  category: string;
  primaryCategory?: string;
  categories?: string[];
  categorySource?: 'curated' | 'derived' | 'source' | 'fallback';
  categoryConfidence?: number;
  sourceCoverage?: Record<string, 'available' | 'not-found' | 'not-supported' | 'error' | 'unknown'>;
  sourceCoverageFound?: number;
  sourceCoverageChecked?: number;
  sourceCoverageScore?: string;
  // Granular verification
  xmlValid: boolean;
  svgRenderable?: boolean;
  sourceTrusted: boolean;
  canonicalResolved: boolean;
  integrityVerified: boolean;
  variantVerified?: boolean;
  renderable: boolean;
  verificationStatus: 'verified' | 'warning' | 'conflict' | 'unresolved' | 'invalid';
  trustState?: TrustState;
  verified: boolean;
  alternativeSources?: AlternativeSource[];
  sourceRecords?: SourceRecord[];
  conflicts?: string[];
  notes?: string;
  colorType?: SvgColorType;
  structuralMetrics?: SvgStructuralMetrics;
  // Asset family modeling
  canonicalAssetId?: string;
  canonicalAsset?: BrandAsset;
  assets?: BrandAsset[];
  totalAssets?: number;
}

/**
 * UI Component representation mapped from BrandIdentity & Canonical Asset
 */
export interface IconItem {
  id: string;
  slug: string;
  fileName: string;
  title: string;
  category: string;
  primaryCategory?: string;
  categories?: string[];
  categorySource?: 'curated' | 'derived' | 'source' | 'fallback';
  categoryConfidence?: number;
  sourceCoverage?: Record<string, 'available' | 'not-found' | 'not-supported' | 'error' | 'unknown'>;
  sourceCoverageFound?: number;
  sourceCoverageChecked?: number;
  sourceCoverageScore?: string;
  hex: string;
  svg?: string;
  source: 'simple-icons' | 'devicon' | 'official' | 'wikimedia' | 'svg-logos' | 'iconify';
  sourceProvider: SourceProvider;
  sourcePlatform: string; // Semantically correct label: Simple Icons, Devicon, SVG Logos, Official Vendor, Wikimedia Commons
  sourceCollection: string;
  sourceVersion: string;
  sourceId: string;
  sha256: string;
  role: AssetRole;
  context: UsageContext[];
  contextOrigin: ContextOrigin;
  graphicVariant: string;
  variant: string;
  variants: Record<string, string>;
  license?: string;
  sourceUrl?: string;
  alternativeSources?: AlternativeSource[];
  sourceRecords: SourceRecord[];
  sourcesCount: number;
  // Granular verification fields
  xmlValid: boolean;
  svgRenderable: boolean;
  sourceTrusted: boolean;
  canonicalResolved: boolean;
  integrityVerified: boolean;
  variantVerified: boolean;
  renderable: boolean;
  verificationStatus: 'verified' | 'warning' | 'conflict' | 'unresolved' | 'invalid';
  trustState: TrustState; // Trusted, Verified, Community, Unverified
  verified: boolean;
  conflicts?: string[];
  notes?: string;
  colorType?: SvgColorType;
  structuralMetrics?: SvgStructuralMetrics;
  // Full Asset Family support
  canonicalAssetId: string;
  canonicalAsset: BrandAsset;
  assets?: BrandAsset[];
  totalAssets?: number;
  // Search explainability
  matchScore?: number;
  matchChecklist?: string[];
  matchReason?: string;
  aliases?: string[];
  canonicalDecision?: CanonicalDecision;
  licenseStatus?: string;
}

export type ScriptType = 'sync' | 'nodejs' | 'python' | 'bash';

export interface ScriptOptions {
  outDir: string;
  policy: SourcePolicy;
  scope: 'mainstream' | 'selected' | 'all';
  prefix: string;
  registry: boolean;
}

/**
 * Helper to get semantically correct source platform labels
 * Requirement 16:
 * Wikimedia is a source platform, not proof of official authorship.
 * Labels:
 * Simple Icons
 * Devicon
 * SVG Logos
 * Official Vendor
 * Wikimedia Commons
 */
export function getSemanticSourceLabel(provider: SourceProvider | string, collection?: string): string {
  if (provider === 'official') return 'Official Vendor';
  if (provider === 'wikimedia') return 'Wikimedia Commons';
  if (provider === 'iconify' || provider === 'svg-logos' || collection === 'logos') return 'SVG Logos';
  if (provider === 'devicon') return 'Devicon';
  if (provider === 'simple-icons') return 'Simple Icons';
  return provider || 'Simple Icons';
}

/**
 * Helper to get semantically correct trust state
 * Trust states: Trusted, Verified, Community, Unverified
 */
export function getTrustStateBadge(trustState: TrustState): { label: string; bgClass: string; textClass: string; borderClass: string } {
  switch (trustState) {
    case 'trusted':
      return { label: 'Trusted', bgClass: 'bg-emerald-50', textClass: 'text-emerald-700', borderClass: 'border-emerald-200' };
    case 'verified':
      return { label: 'Verified', bgClass: 'bg-blue-50', textClass: 'text-blue-700', borderClass: 'border-blue-200' };
    case 'community':
      return { label: 'Community', bgClass: 'bg-amber-50', textClass: 'text-amber-800', borderClass: 'border-amber-200' };
    case 'unverified':
    default:
      return { label: 'Unverified', bgClass: 'bg-rose-50', textClass: 'text-rose-700', borderClass: 'border-rose-200' };
  }
}
