import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Adapter for Simple Icons npm package
 * Canonical single-path monochrome vector library
 */
export class SimpleIconsAdapter {
  constructor(rootDir = process.cwd()) {
    this.rootDir = rootDir;
    this.pkgDir = path.join(rootDir, 'node_modules', 'simple-icons');
    this.version = null;
    this.icons = new Map(); // slug -> metadata
    this.titleMap = new Map(); // normalized title -> slug
    this.aliasMap = new Map(); // alias -> slug
    this.loaded = false;
  }

  async load() {
    if (this.loaded) return this;

    // 1. Read package.json for exact pinned version
    const pkgJsonPath = path.join(this.pkgDir, 'package.json');
    try {
      const pkgContent = await fs.readFile(pkgJsonPath, 'utf8');
      const pkg = JSON.parse(pkgContent);
      this.version = pkg.version || '16.30.0';
    } catch (err) {
      throw new Error(`Failed to read Simple Icons package at ${pkgJsonPath}: ${err.message}`);
    }

    // 2. Read catalog metadata
    const dataCandidates = [
      path.join(this.pkgDir, 'data', 'simple-icons.json'),
      path.join(this.pkgDir, '_data', 'simple-icons.json')
    ];

    let rawList = null;
    for (const cand of dataCandidates) {
      try {
        const text = await fs.readFile(cand, 'utf8');
        rawList = JSON.parse(text);
        break;
      } catch {}
    }

    if (!rawList) {
      throw new Error(`Could not find simple-icons.json in ${this.pkgDir}`);
    }

    const items = Array.isArray(rawList) ? rawList : rawList.icons || [];

    for (const item of items) {
      if (!item.slug) continue;
      const slug = item.slug.toLowerCase();
      const svgPath = path.join(this.pkgDir, 'icons', `${slug}.svg`);

      let license = null;
      let licenseStatus = 'unknown';
      if (item.license) {
        license = `${item.license.type || 'License'}${item.license.url ? ': ' + item.license.url : ''}`;
        licenseStatus = 'known';
      } else {
        license = 'CC0 1.0 Universal';
        licenseStatus = 'known';
      }

      const entry = {
        source: 'simple-icons',
        sourceId: slug,
        slug,
        title: item.title,
        hex: item.hex ? (item.hex.startsWith('#') ? item.hex : `#${item.hex}`) : undefined,
        sourceUrl: item.source || null,
        license,
        licenseStatus,
        guidelines: item.guidelines || null,
        svgPath,
        variant: 'default',
        aliases: []
      };

      this.icons.set(slug, entry);
      const strippedSlug = slug.replace(/[^a-z0-9]/g, '');
      if (strippedSlug && !this.icons.has(strippedSlug)) {
        this.icons.set(strippedSlug, entry);
      }
      if (slug.includes('_')) {
        this.icons.set(slug.replace(/_/g, '-'), entry);
      }

      // Map title
      const normTitle = item.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (normTitle && !this.titleMap.has(normTitle)) {
        this.titleMap.set(normTitle, slug);
      }

      // Map internal aka / loc aliases
      if (item.aliases) {
        if (Array.isArray(item.aliases.aka)) {
          for (const aka of item.aliases.aka) {
            const clean = aka.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (clean && !this.aliasMap.has(clean)) {
              this.aliasMap.set(clean, slug);
              entry.aliases.push(aka);
            }
          }
        }
      }
    }

    this.loaded = true;
    return this;
  }

  get(slug) {
    if (!slug) return null;
    const clean = slug.toLowerCase();
    return this.icons.get(clean) || null;
  }

  findByQuery(query) {
    if (!query) return null;
    const clean = query.toLowerCase().trim();
    if (this.icons.has(clean)) {
      return this.icons.get(clean);
    }
    const stripped = clean.replace(/[^a-z0-9]/g, '');
    if (this.icons.has(stripped)) {
      return this.icons.get(stripped);
    }
    if (this.aliasMap.has(stripped)) {
      return this.icons.get(this.aliasMap.get(stripped));
    }
    if (this.titleMap.has(stripped)) {
      return this.icons.get(this.titleMap.get(stripped));
    }
    return null;
  }

  async getRawSvg(slug) {
    const entry = this.get(slug);
    if (!entry) return null;
    return fs.readFile(entry.svgPath, 'utf8');
  }

  /**
   * Enumerate assets for a given identity
   * @param {string} identityId
   * @returns {Array<import('../types.mjs').BrandAsset>}
   */
  getAssets(identityId) {
    const match = this.findByQuery(identityId);
    if (!match) return [];
    return [{
      assetId: `${identityId}-simpleicons-symbol`,
      identityId,
      sourceProvider: 'simple-icons',
      sourceCollection: 'simple-icons',
      sourceId: match.slug,
      sourceVersion: this.version,
      role: 'symbol',
      roleOrigin: 'inferred',
      context: ['general'],
      contextOrigin: 'unknown',
      graphicVariant: 'monochrome',
      file: `${identityId}-simpleicons-symbol.svg`,
      rawSha256: '',
      license: match.license,
      licenseStatus: match.licenseStatus,
      sourceUrl: match.sourceUrl,
      colorType: 'monochrome',
      sourceTrust: 'trusted',
      xmlValid: false,
      renderable: false,
      integrityVerified: false,
      isCanonical: false,
      _svgFetcher: () => this.getRawSvg(match.slug)
    }];
  }

  /**
   * Full source inventory enumeration
   * @returns {Array<import('../types.mjs').BrandAsset>}
   */
  listAllAssets() {
    const assets = [];
    for (const item of this.icons.values()) {
      assets.push({
        assetId: `${item.slug}-simpleicons-symbol`,
        identityId: item.slug,
        sourceProvider: 'simple-icons',
        sourceCollection: 'simple-icons',
        sourceId: item.slug,
        sourceVersion: this.version,
        role: 'symbol',
        roleOrigin: 'inferred',
        context: ['general'],
        contextOrigin: 'unknown',
        graphicVariant: 'monochrome',
        file: `${item.slug}-simpleicons-symbol.svg`,
        rawSha256: '',
        license: item.license,
        licenseStatus: item.licenseStatus,
        sourceUrl: item.sourceUrl,
        colorType: 'monochrome',
        sourceTrust: 'trusted',
        xmlValid: false,
        renderable: false,
        integrityVerified: false,
        isCanonical: false,
        _svgFetcher: () => this.getRawSvg(item.slug)
      });
    }
    return assets;
  }

  getAllAssets() {
    return this.listAllAssets();
  }

  getAll() {
    return Array.from(this.icons.values());
  }

  count() {
    return this.icons.size;
  }
}
