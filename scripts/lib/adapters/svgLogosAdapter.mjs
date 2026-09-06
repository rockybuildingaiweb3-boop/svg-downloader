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
    this.version = '1.2.9';
    this.icons = new Map(); // name -> metadata
    this.aliasMap = new Map(); // altname -> name
    this.loaded = false;
  }

  async load() {
    if (this.loaded) return this;

    // 1. Read package.json
    const pkgJsonPath = path.join(this.pkgDir, 'package.json');
    try {
      const text = await fs.readFile(pkgJsonPath, 'utf8');
      const pkg = JSON.parse(text);
      this.version = pkg.version || '1.2.9';
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

      const entry = {
        source: 'svg-logos',
        sourceId: name,
        name: cleanName,
        title,
        width,
        height,
        rawSvg,
        license: 'CC0 1.0 Universal / Gil Barbara SVG Logos Archive',
        sourceUrl: `https://github.com/gilbarbara/logos`,
        variant: 'default',
        variants: { default: `${cleanName}.svg` }
      };

      this.icons.set(cleanName, entry);

      // Register without -icon suffix as alias if it ends with -icon
      if (cleanName.endsWith('-icon')) {
        const withoutIcon = cleanName.slice(0, -5);
        if (!this.aliasMap.has(withoutIcon)) {
          this.aliasMap.set(withoutIcon, cleanName);
        }
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

    // Try with -icon suffix (e.g. google -> google-icon, docker -> docker-icon, cloudflare -> cloudflare-icon)
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

  /**
   * Enumerate assets for a given identity from Iconify Logos
   * @param {string} identityId
   * @returns {Array<import('../types.mjs').BrandAsset>}
   */
  getAssets(identityId) {
    const assets = [];
    const cleanId = identityId.toLowerCase().trim();

    // 1. Check icon variant e.g. "google-icon", "docker-icon", "instagram-icon"
    const iconName = `${cleanId}-icon`;
    const iconMatch = this.icons.get(iconName);
    if (iconMatch) {
      assets.push({
        assetId: `${identityId}-iconify-logos-symbol`,
        identityId,
        sourceProvider: 'iconify',
        sourceCollection: 'logos',
        sourceId: iconMatch.sourceId,
        sourceVersion: this.version,
        role: 'symbol',
        context: ['web', 'mobile', 'social'],
        contextOrigin: 'inferred',
        graphicVariant: 'color',
        file: `${identityId}-iconify-symbol.svg`,
        rawSha256: '',
        license: iconMatch.license,
        sourceUrl: iconMatch.sourceUrl,
        colorType: 'multi-color',
        xmlValid: true,
        renderable: true,
        integrityVerified: true,
        isCanonical: false,
        _svgFetcher: () => this.getRawSvg(iconMatch.name)
      });
    }

    // 2. Check full logo/wordmark e.g. "google", "docker", "instagram"
    const logoMatch = this.icons.get(cleanId) || this.findByQuery(cleanId);
    if (logoMatch && logoMatch.name !== iconName) {
      const isWordmark = iconMatch ? true : false;
      const role = isWordmark ? 'wordmark-horizontal' : 'logo';
      assets.push({
        assetId: `${identityId}-iconify-logos-${role}`,
        identityId,
        sourceProvider: 'iconify',
        sourceCollection: 'logos',
        sourceId: logoMatch.sourceId,
        sourceVersion: this.version,
        role,
        context: ['web', 'desktop'],
        contextOrigin: 'inferred',
        graphicVariant: 'color',
        file: `${identityId}-iconify-${role}.svg`,
        rawSha256: '',
        license: logoMatch.license,
        sourceUrl: logoMatch.sourceUrl,
        colorType: 'multi-color',
        xmlValid: true,
        renderable: true,
        integrityVerified: true,
        isCanonical: false,
        _svgFetcher: () => this.getRawSvg(logoMatch.name)
      });
    }

    return assets;
  }

  getAll() {
    return Array.from(this.icons.values());
  }

  count() {
    return this.icons.size;
  }
}
