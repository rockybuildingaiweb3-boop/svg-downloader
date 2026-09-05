/**
 * Canonical Data Model & Types for SVG Icon Architecture
 */

/**
 * @typedef {'simple-icons' | 'devicon' | 'official' | 'wikimedia'} IconSource
 */

/**
 * @typedef {Object} AlternativeSource
 * @property {string} source - Source identifier (e.g. 'devicon')
 * @property {string} sourceId - Slug/name in the source catalog
 * @property {string} sourceVersion - Exact version of source package
 * @property {string[]} [variants] - Available variant names
 * @property {string} [svgPath] - Path to the alternative SVG
 */

/**
 * @typedef {Object} IconRecord
 * @property {string} id - Canonical unique identity (e.g. 'apple', 'react', 'nodedotjs')
 * @property {string} title - Human-readable display title (e.g. 'Apple', 'React', 'Node.js')
 * @property {string} canonicalName - Normalized canonical name (matches id)
 * @property {IconSource} source - Canonical primary source
 * @property {string} sourceId - Source slug or filename
 * @property {string} sourceVersion - Exact version of source library (e.g. '16.29.0')
 * @property {string} variant - Canonical variant name (e.g. 'default', 'original', 'plain')
 * @property {Record<string, string>} [variants] - Mapping of variant names to filenames
 * @property {string} file - Canonical filename in icons/ directory (e.g. 'apple.svg')
 * @property {string} rawSha256 - Deterministic SHA-256 hash of original unmodified SVG
 * @property {string} [derivedSha256] - Optional SHA-256 hash if derived file generated
 * @property {string} [license] - License or trademark attribution note
 * @property {string} [sourceUrl] - Upstream official source URL
 * @property {string} [brandColor] - Official brand color hex (e.g. '#61DAFB')
 * @property {string} [category] - Primary collection category
 * @property {boolean} verified - Verification status
 * @property {AlternativeSource[]} [alternativeSources] - Alternative sources mapped to this identity
 */

/**
 * @typedef {Object} ValidationResult
 * @property {'VALID' | 'WARNING' | 'FAILED'} status
 * @property {string} message
 * @property {string} sha256
 * @property {boolean} isMultiColor
 * @property {string} [viewBox]
 * @property {number} [width]
 * @property {number} [height]
 */
