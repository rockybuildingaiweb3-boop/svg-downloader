import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Adapter for Iconify SVG Logos package (@iconify-json/logos)
 * High-fidelity, multi-color authentic brand and technology vector logos
 */
export class SvgLogosAdapter {
  constructor(rootDir = process.cwd()) {
    this.rootDir = rootDir;
    this.pkgDir = path.join(rootDir, 'node_modules', '@iconify-json', 'logos');
    this.version = '1.2.13';
    this.icons = new Map(); // name -> metadata
    this.aliasMap = new Map(); // altname -> name
    this.identityToAssetsMap = new Map(); // base identity -> list of asset entries
    this.loaded = false;
  }

  async load() {
    if (this.loaded) return this;

    // 1. Read package.json for pinned version
    const pkgJsonPath = path.join(this.pkgDir, 'package.json');
    try {
      const text = await fs.readFile(pkgJsonPath, 'utf8');
      const pkg = JSON.parse(text);
      this.version = pkg.version || '1.2.13';
    } catch {}

    // 2. Read icons.json
    const iconsJsonPath = path.join(this.pkgDir, 'icons.json');
    let iconsData;
    try {
      const text = await fs.readFile(iconsJsonPath, 'utf8');
      iconsData = JSON.parse(text);
    } catch (err) {
      console.warn(`[SvgLogosAdapter] Warning: Could not load icons.json: ${err.message}`);
      this.loaded = true;
      return this;
    }

    const defaultWidth = iconsData.width || 256;
    const defaultHeight = iconsData.height || 256;
    const iconEntries = iconsData.icons || {};
    const aliases = iconsData.aliases || {};

    for (const [name, iconObj] of Object.entries(iconEntries)) {
      const cleanName = name.toLowerCase();
      const width = iconObj.width || defaultWidth;
      const height = iconObj.height || defaultHeight;
      const body = iconObj.body || '';

      // Build canonical raw SVG string
      const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${body}</svg>`;

      // Format title
      const title = name
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      // Derive base identity ID and role from geometry & name structure
      let baseIdentity = cleanName;
      let suffix = '';
      let role = 'logo';

      if (cleanName.endsWith('-icon')) {
        baseIdentity = cleanName.slice(0, -5);
        suffix = 'icon';
        role = 'symbol';
      } else if (cleanName.endsWith('-wordmark')) {
        baseIdentity = cleanName.slice(0, -9);
        suffix = 'wordmark';
        role = 'wordmark-horizontal';
      } else if (cleanName.endsWith('-tile')) {
        baseIdentity = cleanName.slice(0, -5);
        suffix = 'tile';
        role = 'symbol';
      } else {
        const ratio = width && height ? Number((width / height).toFixed(2)) : 1.0;
        if (ratio >= 2.0) {
          role = 'wordmark-horizontal';
        } else if (ratio <= 1.25) {
          role = 'symbol';
        }
      }

      const entry = {
        source: 'svg-logos',
        sourceId: name,
        name: cleanName,
        baseIdentity,
        suffix,
        role,
        roleOrigin: 'inferred',
        title,
        width,
        height,
        rawSvg,
        license: 'CC0 1.0 Universal / Gil Barbara SVG Logos Archive',
        licenseStatus: 'known',
        sourceUrl: `https://github.com/gilbarbara/logos`,
        variant: 'color',
        variants: { default: `${cleanName}.svg` }
      };

      this.icons.set(cleanName, entry);

      // Inverted index: add to identityToAssetsMap
      if (!this.identityToAssetsMap.has(baseIdentity)) {
        this.identityToAssetsMap.set(baseIdentity, []);
      }
      this.identityToAssetsMap.get(baseIdentity).push(entry);

      // Register without suffix as alias if not present
      if (baseIdentity !== cleanName && !this.aliasMap.has(baseIdentity)) {
        this.aliasMap.set(baseIdentity, cleanName);
      }

      // Register stripped alphanumeric
      const stripped = cleanName.replace(/[^a-z0-9]/g, '');
      if (stripped && !this.aliasMap.has(stripped)) {
        this.aliasMap.set(stripped, cleanName);
      }
    }

    // Register explicit aliases from icons.json
    for (const [aliasName, aliasObj] of Object.entries(aliases)) {
      if (aliasObj.parent) {
        this.aliasMap.set(aliasName.toLowerCase(), aliasObj.parent.toLowerCase());
      }
    }

    this.loaded = true;
    return this;
  }

  get(name) {
    if (!name) return null;
    const clean = name.toLowerCase();
    if (this.icons.has(clean)) return this.icons.get(clean);
    if (this.aliasMap.has(clean)) {
      const parent = this.aliasMap.get(clean);
      return this.icons.get(parent) || null;
    }
    return null;
  }

  findByQuery(query) {
    if (!query) return null;
    const clean = query.toLowerCase().trim();
    if (this.icons.has(clean)) return this.icons.get(clean);

    const withIcon = `${clean}-icon`;
    if (this.icons.has(withIcon)) return this.icons.get(withIcon);

    if (this.aliasMap.has(clean)) {
      return this.icons.get(this.aliasMap.get(clean)) || null;
    }

    const stripped = clean.replace(/[^a-z0-9]/g, '');
    if (this.icons.has(stripped)) return this.icons.get(stripped);
    if (this.aliasMap.has(stripped)) {
      return this.icons.get(this.aliasMap.get(stripped)) || null;
    }

    return null;
  }

  async getRawSvg(name) {
    const entry = this.get(name);
    if (!entry) return null;
    return entry.rawSvg;
  }

  getAssets(identityId) {
    return this.getAssetsForIdentity(identityId);
  }

  /**
   * Enumerate assets for a given identity from Iconify Logos
   * Uses complete inverted index instead of probing fixed suffixes
   * @param {string} identityId
   * @returns {Array<import('../types.mjs').BrandAsset>}
   */
  getAssetsForIdentity(identityId) {
    const cleanId = (identityId || '').toLowerCase().trim();
    const matches = this.identityToAssetsMap.get(cleanId) || [];
    
    // Also check direct match if identityId itself was a specific entry
    const direct = this.icons.get(cleanId);
    const combined = new Map();
    for (const m of matches) combined.set(m.name, m);
    if (direct) combined.set(direct.name, direct);

    const assets = [];
    for (const match of combined.values()) {
      assets.push({
        assetId: `${match.name}-iconify-logos`,
        identityId: cleanId,
        sourceProvider: 'iconify',
        sourceCollection: 'logos',
        sourceId: match.sourceId,
        sourceVersion: this.version,
        role: match.role,
        roleOrigin: match.roleOrigin,
        context: ['general'],
        contextOrigin: 'unknown',
        graphicVariant: 'color',
        file: `${match.name}.svg`,
        rawSha256: '',
        license: match.license,
        licenseStatus: match.licenseStatus,
        sourceUrl: match.sourceUrl,
        colorType: 'multi-color',
        sourceTrust: 'trusted',
        xmlValid: false,
        renderable: false,
        integrityVerified: false,
        isCanonical: false,
        _svgFetcher: () => this.getRawSvg(match.name)
      });
    }

    return assets;
  }

  /**
   * Full source inventory enumeration across all 2,110 SVG Logos entries
   * @returns {Array<import('../types.mjs').BrandAsset>}
   */
  listAllAssets() {
    const assets = [];
    for (const match of this.icons.values()) {
      assets.push({
        assetId: `${match.name}-iconify-logos`,
        identityId: match.baseIdentity,
        sourceProvider: 'iconify',
        sourceCollection: 'logos',
        sourceId: match.sourceId,
        sourceVersion: this.version,
        role: match.role,
        roleOrigin: match.roleOrigin,
        context: ['general'],
        contextOrigin: 'unknown',
        graphicVariant: 'color',
        file: `${match.name}.svg`,
        rawSha256: '',
        license: match.license,
        licenseStatus: match.licenseStatus,
        sourceUrl: match.sourceUrl,
        colorType: 'multi-color',
        sourceTrust: 'trusted',
        xmlValid: false,
        renderable: false,
        integrityVerified: false,
        isCanonical: false,
        _svgFetcher: () => this.getRawSvg(match.name)
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
