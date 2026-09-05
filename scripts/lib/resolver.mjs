import fs from 'node:fs/promises';
import path from 'node:path';
import { SimpleIconsAdapter } from './adapters/simpleIconsAdapter.mjs';
import { DeviconAdapter } from './adapters/deviconAdapter.mjs';
import { OfficialAdapter } from './adapters/officialAdapter.mjs';

/**
 * Authoritative Single Source-of-Truth Resolver
 */
export class IconResolver {
  constructor(rootDir = process.cwd()) {
    this.rootDir = rootDir;
    this.simpleIcons = new SimpleIconsAdapter(rootDir);
    this.devicon = new DeviconAdapter(rootDir);
    this.official = new OfficialAdapter(rootDir);
    this.aliases = new Map();
    this.collections = { mainstream: [], categories: {} };
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

    // 3. Load all adapters in parallel
    await Promise.all([
      this.simpleIcons.load(),
      this.devicon.load(),
      this.official.load()
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
   * Resolves a query to a canonical icon record
   * @param {string} inputQuery
   * @param {Object} [options]
   * @param {string} [options.preferredVariant]
   * @param {string} [options.preferredSource]
   * @returns {Promise<import('./types.mjs').IconRecord | null>}
   */
  async resolveIcon(inputQuery, options = {}) {
    if (!this.loaded) await this.load();

    const normalized = this.normalizeQuery(inputQuery);
    const canonicalId = this.applyAlias(normalized);

    // 1. Search Simple Icons (Priority 1)
    const siMatch = this.simpleIcons.findByQuery(canonicalId) || this.simpleIcons.findByQuery(normalized);

    // 2. Search Devicon (Priority 2)
    const devMatch = this.devicon.findByQuery(canonicalId) || this.devicon.findByQuery(normalized);

    // 3. Search Official / Wikimedia fallback (Priority 3/4)
    const offMatch = this.official.get(canonicalId) || this.official.get(normalized);

    // If unresolved in all sources, fail explicitly
    if (!siMatch && !devMatch && !offMatch) {
      return null;
    }

    // Determine competing sources
    const candidates = [];
    if (siMatch) candidates.push({ source: 'simple-icons', data: siMatch, version: this.simpleIcons.version });
    if (devMatch) candidates.push({ source: 'devicon', data: devMatch, version: this.devicon.version });
    if (offMatch) candidates.push({ source: offMatch.source, data: offMatch, version: offMatch.sourceVersion });

    // Handle conflict detection & recording
    if (candidates.length > 1) {
      this.conflicts.push({
        id: canonicalId,
        inputQuery,
        resolvedSource: candidates[0].source,
        competingSources: candidates.slice(1).map(c => ({
          source: c.source,
          sourceId: c.data.slug || c.data.name,
          version: c.version,
          variants: c.source === 'devicon' ? c.data.variantList : ['default']
        })),
        resolution: `Selected ${candidates[0].source} based on priority. Deterministic output: ${canonicalId}.svg without numerical -2.svg suffixes.`
      });
    }

    // Determine primary source by priority (Simple Icons > Devicon > Official > Wikimedia)
    let primary = candidates[0];

    // Build canonical record
    let record;

    if (primary.source === 'simple-icons') {
      const data = primary.data;
      const alternativeSources = [];

      if (devMatch) {
        alternativeSources.push({
          source: 'devicon',
          sourceId: devMatch.name,
          sourceVersion: this.devicon.version,
          variants: devMatch.variantList
        });
      }

      record = {
        id: canonicalId,
        title: data.title,
        canonicalName: canonicalId,
        source: 'simple-icons',
        sourceId: data.slug,
        sourceVersion: this.simpleIcons.version,
        variant: 'default',
        variants: { default: `${canonicalId}.svg` },
        file: `${canonicalId}.svg`,
        rawSha256: '', // populated after reading raw SVG
        license: data.license,
        sourceUrl: data.sourceUrl,
        brandColor: data.hex || '#111827',
        category: this.getCategory(canonicalId),
        verified: true,
        alternativeSources: alternativeSources.length > 0 ? alternativeSources : undefined,
        _svgFetcher: () => this.simpleIcons.getRawSvg(data.slug)
      };
    } else if (primary.source === 'devicon') {
      const data = primary.data;
      const chosenVariant = options.preferredVariant || data.primaryVariant;
      const variantsDict = {};
      for (const v of data.variantList) {
        variantsDict[v] = `${canonicalId}-${v}.svg`;
      }

      record = {
        id: canonicalId,
        title: data.title.charAt(0).toUpperCase() + data.title.slice(1),
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
        brandColor: data.hex || '#111827',
        category: this.getCategory(canonicalId),
        verified: true,
        _svgFetcher: () => this.devicon.getRawSvg(data.name, chosenVariant)
      };
    } else {
      // Official / Wikimedia
      const data = primary.data;
      record = {
        id: canonicalId,
        title: data.title,
        canonicalName: canonicalId,
        source: data.source,
        sourceId: data.sourceId,
        sourceVersion: data.sourceVersion,
        variant: data.variant || 'official',
        variants: { official: `${canonicalId}.svg` },
        file: `${canonicalId}.svg`,
        rawSha256: '',
        license: data.license,
        sourceUrl: data.sourceUrl,
        brandColor: data.hex || '#111827',
        category: data.category || this.getCategory(canonicalId),
        verified: true,
        _svgFetcher: () => this.official.getRawSvg(data.slug)
      };
    }

    return record;
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

    // 2. Search Simple Icons
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

    // 3. Search Devicon
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

    // 4. Search Special
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

    return results;
  }
}
