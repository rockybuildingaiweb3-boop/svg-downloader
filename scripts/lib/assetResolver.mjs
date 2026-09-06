import { validateSvg } from './validator.mjs';

/**
 * Asset Resolver (Requirement 50)
 * Assembles all verified assets for a brand identity into a cohesive AssetFamily.
 */
export class AssetResolver {
  constructor(adapters = {}, deduplicator = null) {
    this.adapters = adapters;
    this.deduplicator = deduplicator;
  }

  /**
   * Infers role from asset identifiers and metadata
   * @param {string} name
   * @param {string} sourceProvider
   * @returns {string} 'symbol' | 'logo' | 'wordmark' | 'app-icon' | 'favicon'
   */
  inferRole(name, sourceProvider) {
    const lower = (name || '').toLowerCase();
    if (lower.includes('wordmark') || lower.includes('logotype') || lower.includes('text')) {
      return 'wordmark';
    }
    if (lower.includes('app-icon') || lower.includes('appicon') || lower.includes('icon-only')) {
      return 'app-icon';
    }
    if (lower.includes('favicon')) {
      return 'favicon';
    }
    if (sourceProvider === 'simple-icons') {
      return 'symbol';
    }
    if (lower.includes('symbol') || lower.includes('glyph') || lower.includes('mark') || lower.includes('badge')) {
      return 'symbol';
    }
    return 'logo';
  }

  /**
   * Infers usage contexts from asset name and provider
   * @param {string} name
   * @param {string} role
   * @returns {string[]}
   */
  inferContext(name, role) {
    const lower = (name || '').toLowerCase();
    const contexts = new Set(['general']);

    if (role === 'app-icon' || lower.includes('mobile') || lower.includes('app')) {
      contexts.add('mobile');
      contexts.add('app-store');
    }
    if (role === 'favicon' || lower.includes('favicon')) {
      contexts.add('favicon');
      contexts.add('web');
    }
    if (role === 'symbol' || role === 'logo' || lower.includes('web')) {
      contexts.add('web');
      contexts.add('desktop');
    }
    if (lower.includes('social') || lower.includes('avatar')) {
      contexts.add('social');
    }

    return Array.from(contexts);
  }

  /**
   * Infers graphic variant
   * @param {string} variantName
   * @param {boolean} isMultiColor
   * @returns {string} 'color' | 'monochrome' | 'original' | 'plain' | 'line' | 'wordmark'
   */
  inferVariant(variantName, isMultiColor) {
    const lower = (variantName || '').toLowerCase();
    if (lower.includes('wordmark')) return 'wordmark';
    if (lower.includes('line')) return 'line';
    if (lower.includes('plain')) return 'plain';
    if (lower.includes('original')) return 'original';
    if (lower.includes('monochrome') || !isMultiColor) return 'monochrome';
    return 'color';
  }
}
