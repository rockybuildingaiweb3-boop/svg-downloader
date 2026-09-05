import fs from 'node:fs/promises';
import path from 'node:path';
import { SimpleIconsAdapter } from './adapters/simpleIconsAdapter.mjs';
import { DeviconAdapter } from './adapters/deviconAdapter.mjs';
import { OfficialAdapter } from './adapters/officialAdapter.mjs';
import { SvgLogosAdapter } from './adapters/svgLogosAdapter.mjs';

/**
 * Authoritative Single Source-of-Truth Resolver with Pluggable Source Policies
 */
export class IconResolver {
  constructor(rootDir = process.cwd()) {
    this.rootDir = rootDir;
    this.simpleIcons = new SimpleIconsAdapter(rootDir);
    this.devicon = new DeviconAdapter(rootDir);
    this.official = new OfficialAdapter(rootDir);
    this.svgLogos = new SvgLogosAdapter(rootDir);
    this.aliases = new Map();
    this.collections = { mainstream: [], categories: {} };
    this.sourcePolicies = {
      defaultPolicy: 'brand',
      policies: {
        brand: {
          name: 'Brand (High Fidelity)',
          description: 'Prefers official vendor marks, followed by SVG Logos, Simple Icons, and Devicon',
          priority: ['official', 'wikimedia', 'svg-logos', 'simple-icons', 'devicon']
        },
        technology: {
          name: 'Technology (Dev & Frameworks)',
          description: 'Prefers Devicon original developer marks, followed by SVG Logos, Official, and Simple Icons',
          priority: ['devicon', 'svg-logos', 'official', 'wikimedia', 'simple-icons']
        },
        monochrome: {
          name: 'Monochrome (Single Color)',
          description: 'Prefers Simple Icons single-path canonical glyphs for UI icon systems',
          priority: ['simple-icons', 'devicon', 'svg-logos', 'official']
        },
        official: {
          name: 'Strict Official Only',
          description: 'Only verified official vendor assets and Wikimedia Commons archives',
          priority: ['official', 'wikimedia']
        }
      },
      identityOverrides: {}
    };
    this.loaded = false;
    this.conflicts = [];
  }

  async load() {
    if (this.loaded) return this;

    // 1. Load config/aliases.json
    try {
      const aliasContent = await fs.readFile(path.join(this.rootDir, 'config', 'aliases.json'), 'utf8');
      const aliasJson = JSON.parse(aliasContent);
      for (const [k, v] of Object.entries(aliasJson)) {
        this.aliases.set(k.toLowerCase().trim(), v.toLowerCase().trim());
      }
    } catch (err) {
      console.warn(`[IconResolver] Warning: could not load config/aliases.json: ${err.message}`);
    }

    // 2. Load config/collections.json
    try {
      const collContent = await fs.readFile(path.join(this.rootDir, 'config', 'collections.json'), 'utf8');
      this.collections = JSON.parse(collContent);
    } catch (err) {
      console.warn(`[IconResolver] Warning: could not load config/collections.json: ${err.message}`);
    }

    // 3. Load config/source-policies.json
    try {
      const polContent = await fs.readFile(path.join(this.rootDir, 'config', 'source-policies.json'), 'utf8');
      const polJson = JSON.parse(polContent);
      if (polJson.defaultPolicy) this.sourcePolicies.defaultPolicy = polJson.defaultPolicy;
      if (polJson.policies) this.sourcePolicies.policies = polJson.policies;
      if (polJson.identityOverrides) this.sourcePolicies.identityOverrides = polJson.identityOverrides;
    } catch (err) {
      console.warn(`[IconResolver] Warning: could not load config/source-policies.json: ${err.message}`);
    }

    // 4. Load all 4 adapters in parallel
    await Promise.all([
      this.simpleIcons.load(),
      this.devicon.load(),
      this.official.load(),
      this.svgLogos.load()
    ]);

    this.loaded = true;
    return this;
  }

  /**
   * Normalizes a query string
   * @param {string} query
   * @returns {string}
   */
  normalizeQuery(query) {
    if (!query) return '';
    return query.toLowerCase().trim().replace(/[\s_]+/g, '-');
  }

  /**
   * Resolves alias to canonical slug if exists
   * @param {string} raw
   * @returns {string}
   */
  applyAlias(raw) {
    const norm = this.normalizeQuery(raw);
    const directAlias = this.aliases.get(norm);
    if (directAlias) return directAlias;

    // Check stripped alphanumeric
    const stripped = norm.replace(/[^a-z0-9]/g, '');
    const strippedAlias = this.aliases.get(stripped);
    if (strippedAlias) return strippedAlias;

    return norm;
  }

  /**
   * Look up which category an icon ID belongs to
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
    return 'tools';
  }

  /**
   * Resolves a query to a canonical icon record according to configured policies
   * @param {string} inputQuery
   * @param {Object} [options]
   * @param {string} [options.policy] - 'brand' | 'technology' | 'monochrome' | 'official'
   * @param {string} [options.preferredVariant]
   * @param {string} [options.preferredSource]
   * @returns {Promise<import('./types.mjs').IconRecord | null>}
   */
  async resolveIcon(inputQuery, options = {}) {
    if (!this.loaded) await this.load();

    const normalized = this.normalizeQuery(inputQuery);
    const canonicalId = this.applyAlias(normalized);

    // Search all 4 adapters for candidate representations
    const offMatch = this.official.get(canonicalId) || this.official.get(normalized);
    const logoMatch = this.svgLogos.findByQuery(canonicalId) || this.svgLogos.findByQuery(normalized);
    const devMatch = this.devicon.findByQuery(canonicalId) || this.devicon.findByQuery(normalized);
    const siMatch = this.simpleIcons.findByQuery(canonicalId) || this.simpleIcons.findByQuery(normalized);

    // If unresolved across all sources, return null explicitly
    if (!offMatch && !logoMatch && !devMatch && !siMatch) {
      return null;
    }

    // Collect all valid candidate sources
    const candidates = [];
    if (offMatch) {
      candidates.push({
        source: offMatch.source || 'official',
        data: offMatch,
        version: offMatch.sourceVersion || 'official'
      });
    }
    if (logoMatch) {
      candidates.push({
        source: 'svg-logos',
        data: logoMatch,
        version: this.svgLogos.version
      });
    }
    if (devMatch) {
      candidates.push({
        source: 'devicon',
        data: devMatch,
        version: this.devicon.version
      });
    }
    if (siMatch) {
      candidates.push({
        source: 'simple-icons',
        data: siMatch,
        version: this.simpleIcons.version
      });
    }

    // Determine active policy and priority
    const policyKey = options.policy || this.sourcePolicies.defaultPolicy || 'brand';
    const activePolicy = this.sourcePolicies.policies[policyKey] || this.sourcePolicies.policies['brand'];
    const priority = activePolicy.priority || ['official', 'wikimedia', 'svg-logos', 'simple-icons', 'devicon'];

    // Check identity overrides (e.g. Amazon, Microsoft, OpenAI, Google)
    const override = this.sourcePolicies.identityOverrides?.[canonicalId];
    const preferredSource = options.preferredSource || override?.preferredSource;

    let primary = null;

    if (preferredSource) {
      primary = candidates.find(c => c.source === preferredSource || (preferredSource === 'wikimedia' && c.source === 'wikimedia'));
    }

    if (!primary) {
      for (const p of priority) {
        const found = candidates.find(c => c.source === p || (p === 'official' && (c.source === 'official' || c.source === 'wikimedia')));
        if (found) {
          primary = found;
          break;
        }
      }
    }

    if (!primary) {
      primary = candidates[0];
    }

    // Detect and log conflicts/collisions
    if (candidates.length > 1) {
      this.conflicts.push({
        id: canonicalId,
        inputQuery,
        resolvedSource: primary.source,
        policyApplied: policyKey,
        competingSources: candidates.filter(c => c !== primary).map(c => ({
          source: c.source,
          sourceId: c.data.slug || c.data.name || c.data.sourceId,
          version: c.version,
          variants: c.source === 'devicon' ? c.data.variantList : ['default']
        })),
        resolution: `Selected ${primary.source} based on policy "${policyKey}". Deterministic output: ${canonicalId}.svg without numerical suffixes.`
      });
    }

    // Build Alternative Sources list
    const alternativeSources = [];
    for (const c of candidates) {
      if (c === primary) continue;
      alternativeSources.push({
        source: c.source,
        sourceId: c.data.slug || c.data.name || c.data.sourceId,
        sourceVersion: c.version,
        variants: c.source === 'devicon' ? c.data.variantList : ['default'],
        license: c.data.license || undefined,
        sourceUrl: c.data.sourceUrl || undefined
      });
    }

    // Determine brandColor (preserving authentic brand color metadata without recoloring raw SVG)
    let brandColor = '#111827';
    if (offMatch?.hex) brandColor = offMatch.hex;
    else if (siMatch?.hex) brandColor = siMatch.hex;
    else if (devMatch?.hex) brandColor = devMatch.hex;

    // Build canonical record
    let record;

    if (primary.source === 'official' || primary.source === 'wikimedia') {
      const data = primary.data;
      record = {
        id: canonicalId,
        title: data.title || canonicalId,
        canonicalName: canonicalId,
        source: data.source,
        sourceId: data.sourceId,
        sourceVersion: data.sourceVersion || 'official',
        variant: override?.preferredVariant || data.variant || 'official',
        variants: { official: `${canonicalId}.svg` },
        file: `${canonicalId}.svg`,
        rawSha256: '',
        license: data.license,
        sourceUrl: data.sourceUrl,
        brandColor: data.hex || brandColor,
        category: data.category || this.getCategory(canonicalId),
        xmlValid: true,
        sourceTrusted: true,
        canonicalResolved: true,
        integrityVerified: true,
        renderable: true,
        verificationStatus: 'verified',
        verified: true,
        alternativeSources: alternativeSources.length > 0 ? alternativeSources : undefined,
        notes: data.notes || undefined,
        _svgFetcher: () => this.official.getRawSvg(data.slug)
      };
    } else if (primary.source === 'svg-logos') {
      const data = primary.data;
      record = {
        id: canonicalId,
        title: data.title || canonicalId,
        canonicalName: canonicalId,
        source: 'svg-logos',
        sourceId: data.sourceId,
        sourceVersion: this.svgLogos.version,
        variant: 'default',
        variants: { default: `${canonicalId}.svg` },
        file: `${canonicalId}.svg`,
        rawSha256: '',
        license: data.license,
        sourceUrl: data.sourceUrl,
        brandColor,
        category: this.getCategory(canonicalId),
        xmlValid: true,
        sourceTrusted: true,
        canonicalResolved: true,
        integrityVerified: true,
        renderable: true,
        verificationStatus: 'verified',
        verified: true,
        alternativeSources: alternativeSources.length > 0 ? alternativeSources : undefined,
        _svgFetcher: () => this.svgLogos.getRawSvg(data.name)
      };
    } else if (primary.source === 'devicon') {
      const data = primary.data;
      const chosenVariant = options.preferredVariant || override?.preferredVariant || data.primaryVariant;
      const variantsDict = {};
      for (const v of data.variantList) {
        variantsDict[v] = `${canonicalId}-${v}.svg`;
      }

      record = {
        id: canonicalId,
        title: data.title ? (data.title.charAt(0).toUpperCase() + data.title.slice(1)) : canonicalId,
        canonicalName: canonicalId,
        source: 'devicon',
        sourceId: data.name,
        sourceVersion: this.devicon.version,
        variant: chosenVariant,
        variants: variantsDict,
        file: `${canonicalId}.svg`,
        rawSha256: '',
        license: data.license,
        sourceUrl: data.sourceUrl,
        brandColor: data.hex || brandColor,
        category: this.getCategory(canonicalId),
        xmlValid: true,
        sourceTrusted: true,
        canonicalResolved: true,
        integrityVerified: true,
        renderable: true,
        verificationStatus: 'verified',
        verified: true,
        alternativeSources: alternativeSources.length > 0 ? alternativeSources : undefined,
        _svgFetcher: () => this.devicon.getRawSvg(data.name, chosenVariant)
      };
    } else {
      // simple-icons
      const data = primary.data;
      record = {
        id: canonicalId,
        title: data.title || canonicalId,
        canonicalName: canonicalId,
        source: 'simple-icons',
        sourceId: data.slug,
        sourceVersion: this.simpleIcons.version,
        variant: 'default',
        variants: { default: `${canonicalId}.svg` },
        file: `${canonicalId}.svg`,
        rawSha256: '',
        license: data.license,
        sourceUrl: data.sourceUrl,
        brandColor: data.hex || brandColor,
        category: this.getCategory(canonicalId),
        xmlValid: true,
        sourceTrusted: true,
        canonicalResolved: true,
        integrityVerified: true,
        renderable: true,
        verificationStatus: 'verified',
        verified: true,
        alternativeSources: alternativeSources.length > 0 ? alternativeSources : undefined,
        _svgFetcher: () => this.simpleIcons.getRawSvg(data.slug)
      };
    }

    return record;
  }

  /**
   * Discover all unique canonical identities across all adapters
   * @returns {string[]}
   */
  discoverAllIdentities() {
    const idSet = new Set();

    // 1. Add curated mainstream collection
    for (const id of this.collections.mainstream || []) {
      idSet.add(this.applyAlias(id));
    }

    // 2. Add all official items
    for (const item of this.official.getAll()) {
      idSet.add(this.applyAlias(item.slug));
    }

    // 3. Add all devicon items
    for (const item of this.devicon.getAll()) {
      idSet.add(this.applyAlias(item.name));
    }

    // 4. Add all SVG Logos items
    for (const item of this.svgLogos.getAll()) {
      // Clean -icon suffix
      const clean = item.name.endsWith('-icon') ? item.name.slice(0, -5) : item.name;
      idSet.add(this.applyAlias(clean));
    }

    // 5. Add all Simple Icons items
    for (const item of this.simpleIcons.getAll()) {
      idSet.add(this.applyAlias(item.slug));
    }

    return Array.from(idSet).sort();
  }

  /**
   * Search across all catalogs with query
   * @param {string} query
   * @returns {Array<{ id: string, title: string, source: string, matchType: string }>}
   */
  search(query) {
    if (!query) return [];
    const q = query.toLowerCase().trim();
    const aliasResolved = this.applyAlias(q);
    const results = [];
    const seen = new Set();

    // 1. Exact alias match
    if (this.aliases.has(q)) {
      results.push({
        id: aliasResolved,
        title: aliasResolved,
        source: 'alias',
        matchType: `Alias: "${query}" -> "${aliasResolved}"`
      });
      seen.add(aliasResolved);
    }

    // 2. Search Special/Official
    for (const off of this.official.getAll()) {
      if (seen.has(off.slug)) continue;
      if (off.slug.includes(q) || off.title.toLowerCase().includes(q)) {
        results.push({
          id: off.slug,
          title: off.title,
          source: off.source,
          matchType: off.slug === q ? 'exact' : 'partial'
        });
        seen.add(off.slug);
      }
    }

    // 3. Search SVG Logos
    for (const logo of this.svgLogos.getAll()) {
      if (seen.has(logo.name)) continue;
      if (logo.name.includes(q) || logo.title.toLowerCase().includes(q)) {
        results.push({
          id: logo.name,
          title: logo.title,
          source: 'svg-logos',
          matchType: logo.name === q ? 'exact' : 'partial'
        });
        seen.add(logo.name);
      }
    }

    // 4. Search Devicon
    for (const dev of this.devicon.getAll()) {
      if (seen.has(dev.name)) continue;
      if (
        dev.name === q ||
        dev.name === aliasResolved ||
        dev.name.includes(q) ||
        dev.altnames.some(a => a.toLowerCase().includes(q))
      ) {
        results.push({
          id: dev.name,
          title: dev.title,
          source: 'devicon',
          matchType: dev.name === q || dev.name === aliasResolved ? 'exact' : 'partial'
        });
        seen.add(dev.name);
      }
    }

    // 5. Search Simple Icons
    for (const si of this.simpleIcons.getAll()) {
      if (seen.has(si.slug)) continue;
      if (
        si.slug === q ||
        si.slug === aliasResolved ||
        si.slug.includes(q) ||
        si.title.toLowerCase().includes(q) ||
        si.aliases.some(a => a.toLowerCase().includes(q))
      ) {
        results.push({
          id: si.slug,
          title: si.title,
          source: 'simple-icons',
          matchType: si.slug === q || si.slug === aliasResolved ? 'exact' : 'partial'
        });
        seen.add(si.slug);
      }
    }

    return results;
  }
}
