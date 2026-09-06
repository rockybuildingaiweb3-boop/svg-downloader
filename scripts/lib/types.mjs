/**
 * Canonical Data Model & Types for SVG Icon Architecture
 * Multi-Source Verified Asset Registry
 */

/**
 * @typedef {'symbol' | 'logo' | 'wordmark' | 'app-icon' | 'favicon' | 'badge' | 'mark' | 'wordmark-horizontal' | 'wordmark-stacked'} AssetRole
 */

/**
 * @typedef {'web' | 'desktop' | 'mobile' | 'app-store' | 'favicon' | 'social' | 'avatar' | 'general'} UsageContext
 */

/**
 * @typedef {'source-confirmed' | 'inferred' | 'unknown'} ContextOrigin
 */

/**
 * @typedef {'simple-icons' | 'devicon' | 'iconify' | 'official' | 'wikimedia'} SourceProvider
 */

/**
 * @typedef {'simple-icons' | 'devicon' | 'official' | 'wikimedia' | 'svg-logos' | 'iconify'} IconSource
 */

/**
 * @typedef {'trusted' | 'verified' | 'community' | 'unverified'} TrustState
 */

/**
 * @typedef {'verified' | 'warning' | 'conflict' | 'unresolved' | 'invalid'} VerificationStatus
 */

/**
 * @typedef {Object} SourceRecord
 * @property {SourceProvider} sourceProvider
 * @property {string} sourcePlatform
 * @property {string} sourceCollection
 * @property {string} sourceId
 * @property {string} sourceVersion
 * @property {string} [sourceUrl]
 * @property {string} license
 * @property {TrustState} trustState
 * @property {number} assetCount
 * @property {AssetRole[]} [availableRoles]
 * @property {string[]} [availableVariants]
 */

/**
 * @typedef {Object} BrandAsset
 * @property {string} assetId - Unique stable identifier for this specific asset
 * @property {string} identityId - Canonical brand identity ID
 * @property {SourceProvider} sourceProvider - Pluggable source provider
 * @property {string} [sourcePlatform] - Semantically correct label (Simple Icons, Devicon, SVG Logos, Official Vendor, Wikimedia Commons)
 * @property {string} sourceCollection - Collection within provider ('logos', 'simple-icons', etc.)
 * @property {string} sourceId - Original ID within source
 * @property {string} sourceVersion - Exact version of source package
 * @property {AssetRole} role - Distinct functional asset role
 * @property {UsageContext[]} context - Intended deployment contexts
 * @property {ContextOrigin} contextOrigin - Provenance of context metadata
 * @property {string} graphicVariant - Visual variant (monochrome, color, original, wordmark, etc.)
 * @property {string} file - Filename or relative path
 * @property {string} rawSha256 - SHA-256 hash of original raw vector
 * @property {string} license - License metadata
 * @property {string} [sourceUrl] - Upstream origin link
 * @property {boolean} isCanonical - Whether this is the primary asset under active policy
 * @property {boolean} xmlValid - Strict XML syntax and structure valid
 * @property {boolean} svgRenderable - Valid viewBox and renderable SVG elements
 * @property {boolean} renderable - Same as svgRenderable
 * @property {boolean} sourceTrusted - Source comes from trusted platform
 * @property {boolean} canonicalResolved - Resolved under policy
 * @property {boolean} integrityVerified - SHA-256 integrity verified
 * @property {boolean} variantVerified - Variant semantics verified
 * @property {VerificationStatus} verificationStatus
 * @property {TrustState} trustState
 * @property {'monochrome' | 'multi-color'} [colorType]
 * @property {number} [elementCount]
 * @property {string} [notes]
 */

/**
 * @typedef {Object} AlternativeSource
 * @property {IconSource} source - Source identifier (e.g. 'devicon', 'svg-logos')
 * @property {string} sourceId - Slug/name in the source catalog
 * @property {string} sourceVersion - Exact version of source package
 * @property {string[]} [variants] - Available variant names
 * @property {string} [svgPath] - Path to the alternative SVG
 * @property {string} [license] - License information
 * @property {string} [sourceUrl] - Upstream URL
 */

/**
 * @typedef {Object} BrandIdentity
 * @property {string} id - Canonical brand identity (e.g. 'apple', 'react', 'amazon')
 * @property {string} title - Display title
 * @property {string} canonicalName - Normalized canonical ID
 * @property {string} category - Collection category
 * @property {string} [brandColor] - Official brand color hex metadata (NOT applied to SVG)
 * @property {string[]} [aliases] - Aliases
 * @property {string[]} [tags] - Search tags
 * @property {string} canonicalAssetId - Primary active asset ID
 * @property {BrandAsset} canonicalAsset - Primary active asset
 * @property {BrandAsset[]} assets - Entire Asset Family
 * @property {number} totalAssets - Number of assets in family
 * @property {SourceRecord[]} [sourceRecords] - Source evidence records
 * @property {SourceProvider[]} sourcesAvailable
 * @property {AssetRole[]} rolesAvailable
 * @property {UsageContext[]} contextsAvailable
 * @property {boolean} hasMultiSource
 * @property {boolean} hasMultiVariant
 * @property {boolean} xmlValid
 * @property {boolean} svgRenderable
 * @property {boolean} sourceTrusted
 * @property {boolean} canonicalResolved
 * @property {boolean} integrityVerified
 * @property {boolean} variantVerified
 * @property {VerificationStatus} verificationStatus
 * @property {TrustState} trustState
 * @property {boolean} verified
 * @property {string[]} [conflicts]
 * @property {string} [notes]
 */

/**
 * @typedef {Object} IconRecord
 * @property {string} id - Canonical unique identity (e.g. 'apple', 'react', 'amazon')
 * @property {string} title - Human-readable display title (e.g. 'Apple', 'React', 'Amazon')
 * @property {string} canonicalName - Normalized canonical name (matches id)
 * @property {IconSource} source - Canonical primary source
 * @property {SourceProvider} [sourceProvider]
 * @property {string} [sourcePlatform]
 * @property {string} [sourceCollection]
 * @property {string} sourceId - Source slug or filename
 * @property {string} sourceVersion - Exact version of source library
 * @property {string} variant - Canonical variant name (e.g. 'default', 'original', 'plain')
 * @property {AssetRole} [role]
 * @property {UsageContext[]} [context]
 * @property {ContextOrigin} [contextOrigin]
 * @property {string} [graphicVariant]
 * @property {Record<string, string>} [variants] - Mapping of variant names to filenames
 * @property {string} file - Canonical filename in icons/ directory (e.g. 'apple.svg')
 * @property {string} rawSha256 - Deterministic SHA-256 hash of original unmodified SVG
 * @property {string} [derivedSha256] - Optional SHA-256 hash if derived file generated
 * @property {string} [license] - License or trademark attribution note
 * @property {string} [sourceUrl] - Upstream official source URL
 * @property {string} [brandColor] - Official brand color hex (e.g. '#FF9900')
 * @property {string} category - Primary collection category
 * 
 * First-class Granular Verification & Provenance flags
 * @property {boolean} xmlValid - Strict XML syntax and structure valid
 * @property {boolean} svgRenderable - Contains valid viewBox and renderable SVG elements
 * @property {boolean} sourceTrusted - Comes from a verified/official source adapter
 * @property {boolean} canonicalResolved - Successfully resolved without ambiguous collisions
 * @property {boolean} integrityVerified - File contents match expected rawSha256
 * @property {boolean} variantVerified - Variant semantics confirmed
 * @property {boolean} renderable - Same as svgRenderable
 * @property {VerificationStatus} verificationStatus - Overall verification status
 * @property {TrustState} [trustState] - Trusted, Verified, Community, Unverified
 * @property {boolean} verified - Legacy boolean flag
 * 
 * Rich provenance & Asset Family
 * @property {BrandAsset[]} [assets] - Complete asset family
 * @property {BrandAsset} [canonicalAsset] - Selected primary asset
 * @property {string} [canonicalAssetId]
 * @property {SourceRecord[]} [sourceRecords] - Source evidence records
 * @property {AlternativeSource[]} [alternativeSources] - Alternative sources mapped to this identity
 * @property {string[]} [conflicts] - Ambiguities or collisions noted during resolution
 * @property {string} [notes] - Additional provenance remarks
 */

/**
 * @typedef {Object} ValidationResult
 * @property {'VALID' | 'WARNING' | 'FAILED'} status
 * @property {string} message
 * @property {string} sha256
 * @property {boolean} isMultiColor
 * @property {boolean} xmlValid
 * @property {boolean} svgRenderable
 * @property {boolean} renderable
 * @property {string} [viewBox]
 * @property {number} [width]
 * @property {number} [height]
 * @property {number} [elementCount]
 */
