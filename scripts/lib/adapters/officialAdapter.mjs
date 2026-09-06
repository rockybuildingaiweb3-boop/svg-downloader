import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Adapter for verified official vendor and Wikimedia Commons controlled fallback sources
 */
export class OfficialAdapter {
  constructor(rootDir = process.cwd()) {
    this.rootDir = rootDir;
    this.specPath = path.join(rootDir, 'config', 'specialSources.json');
    this.assetsDir = path.join(rootDir, 'config', 'assets');
    this.icons = new Map();
    this.version = 'official-vendor';
    this.loaded = false;
  }

  async load() {
    if (this.loaded) return this;

    try {
      const text = await fs.readFile(this.specPath, 'utf8');
      const specs = JSON.parse(text);

      for (const [slug, spec] of Object.entries(specs)) {
        const localPath = path.join(this.assetsDir, `${slug}.svg`);
        let hasLocal = false;
        try {
          await fs.access(localPath);
          hasLocal = true;
        } catch {}

        this.icons.set(slug.toLowerCase(), {
          source: spec.source || 'wikimedia',
          sourceId: spec.sourceId || `${slug}.svg`,
          sourceVersion: spec.sourceVersion || 'official',
          slug: slug.toLowerCase(),
          title: spec.title || slug,
          hex: spec.brandColor || '#111827',
          sourceUrl: spec.sourceUrl,
          license: spec.license || 'Public Domain / Corporate Trademark',
          licenseStatus: 'known',
          category: spec.category || 'brands',
          notes: spec.notes || '',
          variant: 'official',
          localPath: hasLocal ? localPath : null
        });
      }
    } catch (err) {
      console.warn(`[OfficialAdapter] Warning reading special sources: ${err.message}`);
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

    const localAssetPath = path.join(this.assetsDir, `${entry.slug}.svg`);
    try {
      const content = await fs.readFile(localAssetPath, 'utf8');
      entry.localPath = localAssetPath;
      return content;
    } catch {}

    if (entry.sourceUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        timeoutId.unref?.();
        const res = await fetch(entry.sourceUrl, {
          signal: controller.signal,
          headers: { 'User-Agent': 'Brand-Tech-SVG-Pipeline/2.0' }
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const content = await res.text();
          await fs.mkdir(this.assetsDir, { recursive: true });
          await fs.writeFile(localAssetPath, content, 'utf8');
          entry.localPath = localAssetPath;
          return content;
        }
      } catch (err) {
        console.warn(`[OfficialAdapter] Fetch failed for ${entry.slug}: ${err.message}`);
      }
    }

    return null;
  }

  /**
   * Enumerate verified vendor assets for an identity
   * @param {string} identityId
   * @returns {Array<import('../types.mjs').BrandAsset>}
   */
  getAssets(identityId) {
    const match = this.get(identityId);
    if (!match) return [];
    const isWiki = match.source === 'wikimedia';
    const role = match.notes?.toLowerCase().includes('mark') ? 'mark' : 'logo';
    return [{
      assetId: `${identityId}-${isWiki ? 'wikimedia' : 'official'}-${role}`,
      identityId,
      sourceProvider: isWiki ? 'wikimedia' : 'official',
      sourceCollection: isWiki ? 'commons-controlled' : 'vendor-archive',
      sourceId: match.sourceId,
      sourceVersion: match.sourceVersion || 'official',
      role,
      roleOrigin: 'source-confirmed',
      context: ['general'],
      contextOrigin: isWiki ? 'unknown' : 'inferred',
      graphicVariant: 'official',
      file: `${identityId}.svg`,
      rawSha256: '',
      license: match.license,
      licenseStatus: match.licenseStatus,
      sourceUrl: match.sourceUrl,
      colorType: 'multi-color',
      sourceTrust: isWiki ? 'community' : 'official',
      xmlValid: false,
      renderable: false,
      integrityVerified: false,
      isCanonical: false,
      notes: match.notes,
      _svgFetcher: () => this.getRawSvg(match.slug)
    }];
  }

  /**
   * Full source inventory enumeration for official vendor assets
   * @returns {Array<import('../types.mjs').BrandAsset>}
   */
  listAllAssets() {
    const assets = [];
    for (const match of this.icons.values()) {
      const isWiki = match.source === 'wikimedia';
      const role = match.notes?.toLowerCase().includes('mark') ? 'mark' : 'logo';
      assets.push({
        assetId: `${match.slug}-${isWiki ? 'wikimedia' : 'official'}-${role}`,
        identityId: match.slug,
        sourceProvider: isWiki ? 'wikimedia' : 'official',
        sourceCollection: isWiki ? 'commons-controlled' : 'vendor-archive',
        sourceId: match.sourceId,
        sourceVersion: match.sourceVersion || 'official',
        role,
        roleOrigin: 'source-confirmed',
        context: ['general'],
        contextOrigin: isWiki ? 'unknown' : 'inferred',
        graphicVariant: 'official',
        file: `${match.slug}.svg`,
        rawSha256: '',
        license: match.license,
        licenseStatus: match.licenseStatus,
        sourceUrl: match.sourceUrl,
        colorType: 'multi-color',
        sourceTrust: isWiki ? 'community' : 'official',
        xmlValid: false,
        renderable: false,
        integrityVerified: false,
        isCanonical: false,
        notes: match.notes,
        _svgFetcher: () => this.getRawSvg(match.slug)
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
