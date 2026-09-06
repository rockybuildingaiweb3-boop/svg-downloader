/**
 * Identity Resolver (Requirement 50)
 * Resolves raw queries to normalized canonical identities, aliases, and categories.
 */

export class IdentityResolver {
  constructor(aliasesMap = new Map(), collections = {}, sourcePolicies = {}) {
    this.aliases = aliasesMap;
    this.collections = collections;
    this.sourcePolicies = sourcePolicies;
  }

  /**
   * Normalizes a query string
   * @param {string} query
   * @returns {string}
   */
  normalize(query) {
    if (!query) return '';
    return query.toLowerCase().trim().replace(/[\s_]+/g, '-');
  }

  /**
   * Resolves alias to canonical identity slug
   * @param {string} raw
   * @returns {string}
   */
  resolveAlias(raw) {
    const norm = this.normalize(raw);
    const directAlias = this.aliases.get(norm);
    if (directAlias) return directAlias;

    const stripped = norm.replace(/[^a-z0-9]/g, '');
    const strippedAlias = this.aliases.get(stripped);
    if (strippedAlias) return strippedAlias;

    return norm;
  }

  /**
   * Looks up which category an identity belongs to
   * @param {string} id
   * @returns {string}
   */
  getCategory(id) {
    const cats = this.collections.categories || {};
    for (const [catName, list] of Object.entries(cats)) {
      if (Array.isArray(list) && list.includes(id)) {
        return catName;
      }
    }
    return 'mainstream';
  }

  /**
   * Returns active source priority for an identity based on source-policies.json
   * @param {string} id
   * @param {string} [requestedPolicy]
   * @returns {string[]}
   */
  getSourcePriority(id, requestedPolicy) {
    const overrides = this.sourcePolicies.identityOverrides || {};
    if (overrides[id]) {
      const p = this.sourcePolicies.policies?.[overrides[id]];
      if (p?.priority) return p.priority;
    }

    const polKey = requestedPolicy || this.sourcePolicies.defaultPolicy || 'brand';
    return this.sourcePolicies.policies?.[polKey]?.priority || [
      'official',
      'wikimedia',
      'svg-logos',
      'simple-icons',
      'devicon'
    ];
  }
}
