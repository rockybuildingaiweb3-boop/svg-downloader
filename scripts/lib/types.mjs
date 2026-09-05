/**
 * Canonical Data Model & Types for SVG Icon Architecture
 */

/**
 * @typedef {'simple-icons' | 'devicon' | 'official' | 'wikimedia' | 'svg-logos'} IconSource
 */

/**
 * @typedef {'verified' | 'warning' | 'conflict' | 'unresolved' | 'invalid'} VerificationStatus
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
 * @typedef {Object} IconRecord
 * @property {string} id - Canonical unique identity (e.g. 'apple', 'react', 'amazon')
 * @property {string} title - Human-readable display title (e.g. 'Apple', 'React', 'Amazon')
 * @property {string} canonicalName - Normalized canonical name (matches id)
 * @property {IconSource} source - Canonical primary source
 * @property {string} sourceId - Source slug or filename
 * @property {string} sourceVersion - Exact version of source library
 * @property {string} variant - Canonical variant name (e.g. 'default', 'original', 'plain')
 * @property {Record<string, string>} variants - Mapping of variant names to filenames
 * @property {string} file - Canonical filename in icons/ directory (e.g. 'apple.svg')
 * @property {string} rawSha256 - Deterministic SHA-256 hash of original unmodified SVG
 * @property {string} [derivedSha256] - Optional SHA-256 hash if derived file generated
 * @property {string} [license] - License or trademark attribution note
 * @property {string} [sourceUrl] - Upstream official source URL
 * @property {string} [brandColor] - Official brand color hex (e.g. '#FF9900')
 * @property {string} category - Primary collection category
 * 
 * First-class Verification & Provenance flags
 * @property {boolean} xmlValid - Strict XML syntax and structure valid
 * @property {boolean} sourceTrusted - Comes from a verified/official source adapter
 * @property {boolean} canonicalResolved - Successfully resolved without ambiguous collisions
 * @property {boolean} integrityVerified - File contents match expected rawSha256
 * @property {boolean} renderable - Contains valid viewBox and renderable SVG elements
 * @property {VerificationStatus} verificationStatus - Overall verification status
 * @property {boolean} verified - Legacy boolean flag (true if verificationStatus === 'verified')
 * 
 * Rich provenance & alternatives
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
 * @property {boolean} renderable
 * @property {string} [viewBox]
 * @property {number} [width]
 * @property {number} [height]
 * @property {number} [elementCount]
 */
