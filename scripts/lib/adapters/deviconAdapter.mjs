import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Adapter for Devicon npm package
 */
export class DeviconAdapter {
  constructor(rootDir = process.cwd()) {
    this.rootDir = rootDir;
    this.pkgDir = path.join(rootDir, 'node_modules', 'devicon');
    this.version = null;
    this.icons = new Map(); // name -> metadata
    this.altMap = new Map(); // altname -> name
    this.loaded = false;
  }

  async load() {
    if (this.loaded) return this;

    // 1. Read package.json for exact pinned version
    const pkgJsonPath = path.join(this.pkgDir, 'package.json');
    try {
      const pkgContent = await fs.readFile(pkgJsonPath, 'utf8');
      const pkg = JSON.parse(pkgContent);
      this.version = pkg.version || '2.17.0';
    } catch (err) {
      throw new Error(`Failed to read Devicon package at ${pkgJsonPath}: ${err.message}`);
    }

    // 2. Read devicon.json metadata catalog
    const devJsonPath = path.join(this.pkgDir, 'devicon.json');
    let devJson;
    try {
      const text = await fs.readFile(devJsonPath, 'utf8');
      devJson = JSON.parse(text);
    } catch (err) {
      throw new Error(`Failed to read Devicon catalog at ${devJsonPath}: ${err.message}`);
    }

    if (!Array.isArray(devJson)) {
      throw new Error(`Invalid devicon.json format: expected array`);
    }

    for (const item of devJson) {
      if (!item.name) continue;
      const name = item.name.toLowerCase();
      const iconDir = path.join(this.pkgDir, 'icons', name);

      // Extract available SVG variants from devicon.json
      let svgVersions = [];
      if (item.versions) {
        if (Array.isArray(item.versions)) {
          svgVersions = item.versions;
        } else if (Array.isArray(item.versions.svg)) {
          svgVersions = item.versions.svg;
        }
      }

      const variantMap = {};
      for (const ver of svgVersions) {
        variantMap[ver] = path.join(iconDir, `${name}-${ver}.svg`);
      }

      // Check aliases in devicon.json (e.g. original-wordmark)
      if (Array.isArray(item.aliases)) {
        for (const al of item.aliases) {
          if (al.alias) {
            variantMap[al.alias] = path.join(iconDir, `${name}-${al.alias}.svg`);
          }
        }
      }

      const availableVariants = Object.keys(variantMap);
      if (availableVariants.length === 0) continue;

      // Select default primary variant: prefer 'original', then 'plain', then first
      let primaryVariant = 'original';
      if (!variantMap[primaryVariant]) {
        primaryVariant = variantMap['plain'] ? 'plain' : availableVariants[0];
      }

      const entry = {
        source: 'devicon',
        sourceId: name,
        name,
        title: item.name,
        hex: item.color ? (item.color.startsWith('#') ? item.color : `#${item.color}`) : undefined,
        license: 'Devicon (MIT License) with brand trademark guidelines',
        sourceUrl: `https://devicon.dev/`,
        variants: variantMap,
        variantList: availableVariants,
        primaryVariant,
        svgPath: variantMap[primaryVariant],
        altnames: Array.isArray(item.altnames) ? item.altnames : [],
        tags: Array.isArray(item.tags) ? item.tags : []
      };

      this.icons.set(name, entry);

      // Register altnames
      for (const alt of entry.altnames) {
        const clean = alt.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (clean && !this.altMap.has(clean)) {
          this.altMap.set(clean, name);
        }
      }
    }

    this.loaded = true;
    return this;
  }

  get(name) {
    if (!name) return null;
    const clean = name.toLowerCase();
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
    if (this.altMap.has(stripped)) {
      return this.icons.get(this.altMap.get(stripped));
    }
    return null;
  }

  async getRawSvg(name, variant = null) {
    const entry = this.get(name);
    if (!entry) return null;
    const v = variant || entry.primaryVariant;
    const p = entry.variants[v] || entry.svgPath;
    if (!p) return null;
    try {
      return await fs.readFile(p, 'utf8');
    } catch {
      // If specific variant file doesn't exist, fallback to another variant
      for (const fallbackPath of Object.values(entry.variants)) {
        try {
          return await fs.readFile(fallbackPath, 'utf8');
        } catch {}
      }
    }
    return null;
  }

  /**
   * Enumerate assets for a given identity across all its variants
   * @param {string} identityId
   * @returns {Array<import('../types.mjs').BrandAsset>}
   */
  getAssets(identityId) {
    const match = this.findByQuery(identityId);
    if (!match) return [];
    const assets = [];
    for (const variant of match.variantList) {
      let role = 'symbol';
      if (variant.includes('wordmark')) {
        role = 'wordmark-horizontal';
      } else if (variant === 'original') {
        role = 'logo';
      } else if (variant === 'plain' || variant === 'line') {
        role = 'symbol';
      }

      assets.push({
        assetId: `${identityId}-devicon-${variant}`,
        identityId,
        sourceProvider: 'devicon',
        sourceCollection: 'devicon',
        sourceId: match.name,
        sourceVersion: this.version,
        role,
        context: ['general'],
        contextOrigin: 'unknown',
        graphicVariant: variant,
        file: `${identityId}-devicon-${variant}.svg`,
        rawSha256: '',
        license: match.license,
        sourceUrl: match.sourceUrl,
        colorType: variant.includes('plain') || variant.includes('line') ? 'monochrome' : 'multi-color',
        xmlValid: false,
        renderable: false,
        integrityVerified: false,
        isCanonical: false,
        _svgFetcher: () => this.getRawSvg(match.name, variant)
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
