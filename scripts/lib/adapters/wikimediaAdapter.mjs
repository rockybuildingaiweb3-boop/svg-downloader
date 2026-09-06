import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Adapter for verified Wikimedia Commons controlled vector source assets
 * Requirement 16 & 50: Wikimedia is a source platform, not proof of official authorship.
 */
export class WikimediaAdapter {
  constructor(rootDir = process.cwd()) {
    this.rootDir = rootDir;
    this.specPath = path.join(rootDir, 'config', 'specialSources.json');
    this.assetsDir = path.join(rootDir, 'config', 'assets');
    this.icons = new Map();
    this.version = 'wikimedia-commons-archive';
    this.loaded = false;
  }

  async load() {
    if (this.loaded) return this;

    try {
      const text = await fs.readFile(this.specPath, 'utf8');
      const specs = JSON.parse(text);

      for (const [slug, spec] of Object.entries(specs)) {
        if (spec.source === 'wikimedia') {
          const localPath = path.join(this.assetsDir, `${slug}.svg`);
          let hasLocal = false;
          try {
            await fs.access(localPath);
            hasLocal = true;
          } catch {}

          this.icons.set(slug.toLowerCase(), {
            source: 'wikimedia',
            sourceProvider: 'wikimedia',
            sourcePlatform: 'Wikimedia Commons',
            sourceCollection: 'commons',
            sourceId: spec.sourceId || `${slug}.svg`,
            sourceVersion: spec.sourceVersion || 'commons-archive',
            slug: slug.toLowerCase(),
            title: spec.title || slug,
            hex: spec.brandColor || '#111827',
            sourceUrl: spec.sourceUrl || `https://commons.wikimedia.org/wiki/File:${spec.sourceId || slug}`,
            license: spec.license || 'Public Domain / Trademark of respective owner',
            category: spec.category || 'bigtech',
            notes: spec.notes || 'Curated Wikimedia Commons vector mark',
            variant: 'official',
            graphicVariant: 'color',
            role: 'logo',
            context: ['general', 'web'],
            localPath: hasLocal ? localPath : null
          });
        }
      }
    } catch (err) {
      console.warn(`[WikimediaAdapter] Warning reading special sources: ${err.message}`);
    }

    this.loaded = true;
    return this;
  }

  get(slug) {
    if (!slug) return null;
    return this.icons.get(slug.toLowerCase()) || null;
  }

  async getRawSvg(slug) {
    const entry = this.get(slug);
    if (!entry) return null;

    // 1. Try local cached asset
    const localAssetPath = path.join(this.assetsDir, `${entry.slug}.svg`);
    try {
      const content = await fs.readFile(localAssetPath, 'utf8');
      entry.localPath = localAssetPath;
      return content;
    } catch {}

    // 2. Fetch from sourceUrl if online
    if (entry.sourceUrl) {
      try {
        const res = await fetch(entry.sourceUrl, {
          headers: { 'User-Agent': 'Verified-SVG-Asset-Registry-Bot/1.0' }
        });
        if (res.ok) {
          const text = await res.text();
          if (text.includes('<svg')) {
            try {
              await fs.mkdir(this.assetsDir, { recursive: true });
              await fs.writeFile(localAssetPath, text, 'utf8');
              entry.localPath = localAssetPath;
            } catch {}
            return text;
          }
        }
      } catch (err) {
        console.warn(`[WikimediaAdapter] Failed fetching remote asset for ${slug}: ${err.message}`);
      }
    }

    return null;
  }

  /**
   * Enumerate assets for a given identity from Wikimedia Commons
   * @param {string} identityId
   * @returns {Array<import('../types.mjs').BrandAsset>}
   */
  getAssets(identityId) {
    const clean = (identityId || '').toLowerCase().trim();
    const match = this.get(clean);
    if (!match) return [];

    const role = match.notes?.toLowerCase().includes('mark') ? 'mark' : 'logo';
    return [{
      assetId: `${clean}-wikimedia-${role}`,
      identityId: clean,
      sourceProvider: 'wikimedia',
      sourceCollection: 'commons-controlled',
      sourceId: match.sourceId,
      sourceVersion: match.sourceVersion || 'commons-archive',
      role,
      roleOrigin: 'source-confirmed',
      context: ['general', 'web'],
      contextOrigin: 'unknown',
      graphicVariant: 'color',
      file: `${clean}-wikimedia-${role}.svg`,
      rawSha256: '',
      license: match.license,
      licenseStatus: 'known',
      sourceUrl: match.sourceUrl,
      colorType: 'multi-color',
      sourceTrust: 'community',
      xmlValid: false,
      renderable: false,
      integrityVerified: false,
      isCanonical: false,
      notes: match.notes,
      _svgFetcher: () => this.getRawSvg(match.slug)
    }];
  }

  /**
   * Full source inventory enumeration for Wikimedia assets
   * @returns {Array<import('../types.mjs').BrandAsset>}
   */
  listAllAssets() {
    const assets = [];
    for (const item of this.icons.values()) {
      assets.push(...this.getAssets(item.slug));
    }
    return assets;
  }

  getAll() {
    return Array.from(this.icons.values());
  }

  size() {
    return this.icons.size;
  }
}

