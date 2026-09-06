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

  getAssets(identityId) {
    return this.getAssetsForIdentity(identityId);
  }

  /**
   * Enumerate assets for a given identity from Iconify Logos
   * @param {string} identityId
   * @returns {Array<import('../types.mjs').BrandAsset>}
   */
  getAssetsForIdentity(identityId) {
    const assets = [];
    const cleanId = (identityId || '').toLowerCase().trim();
    // Enumerate actual source assets for cleanId and known variant suffixes
    const candidateSuffixes = ['', '-icon', '-wordmark', '-tile'];
    const seenNames = new Set();

    for (const suffix of candidateSuffixes) {
      const candidateName = `${cleanId}${suffix}`;
      const match = this.icons.get(candidateName);
      if (!match || seenNames.has(match.name)) continue;
      seenNames.add(match.name);

      const ratio = match.width && match.height ? Number((match.width / match.height).toFixed(2)) : 1.0;
      let role = 'logo';
      if (suffix === '-icon' || ratio <= 1.25) {
        role = 'symbol';
      } else if (suffix === '-wordmark' || ratio >= 2.0) {
        role = 'wordmark-horizontal';
      }

      assets.push({
        assetId: `${identityId}-iconify-logos-${role}${suffix ? '-' + suffix.slice(1) : ''}`,
        identityId,
        sourceProvider: 'iconify',
        sourceCollection: 'logos',
        sourceId: match.sourceId,
        sourceVersion: this.version,
        role,
        context: ['general'],
        contextOrigin: 'unknown',
        graphicVariant: 'color',
        file: `${identityId}-iconify-${role}${suffix ? '-' + suffix.slice(1) : ''}.svg`,
        rawSha256: '',
        license: match.license,
        sourceUrl: match.sourceUrl,
        colorType: 'multi-color',
        xmlValid: false,
        renderable: false,
        integrityVerified: false,
        isCanonical: false,
        _svgFetcher: () => this.getRawSvg(match.name)
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
