import { computeSha256 } from './validator.mjs';

/**
 * Content-Aware SHA-256 Deduplicator (Requirements 34 & 35)
 * Detects identical SVG contents across multiple source records and links provenance.
 */
export class AssetDeduplicator {
  constructor() {
    this.shaToAsset = new Map(); // sha256 -> { canonicalFile, sources: [] }
    this.duplicateCount = 0;
  }

  /**
   * Registers an asset content and determines if it is a duplicate of an existing asset
   * @param {string} rawSvg
   * @param {Object} assetMeta
   * @returns {{ isDuplicate: boolean, canonicalFile: string, sha256: string, duplicateOf?: Object }}
   */
  register(rawSvg, assetMeta) {
    const sha256 = computeSha256(rawSvg);
    const existing = this.shaToAsset.get(sha256);

    if (existing) {
      this.duplicateCount++;
      existing.sources.push({
        sourceProvider: assetMeta.sourceProvider,
        sourceCollection: assetMeta.sourceCollection,
        sourceId: assetMeta.sourceId,
        sourceVersion: assetMeta.sourceVersion,
        role: assetMeta.role,
        context: assetMeta.context,
        graphicVariant: assetMeta.graphicVariant,
        file: assetMeta.file
      });

      return {
        isDuplicate: true,
        canonicalFile: existing.canonicalFile,
        sha256,
        duplicateOf: existing
      };
    }

    // First time seeing this byte fingerprint
    const record = {
      canonicalFile: assetMeta.file,
      identityId: assetMeta.identityId,
      sha256,
      sources: [
        {
          sourceProvider: assetMeta.sourceProvider,
          sourceCollection: assetMeta.sourceCollection,
          sourceId: assetMeta.sourceId,
          sourceVersion: assetMeta.sourceVersion,
          role: assetMeta.role,
          context: assetMeta.context,
          graphicVariant: assetMeta.graphicVariant,
          file: assetMeta.file
        }
      ]
    };

    this.shaToAsset.set(sha256, record);

    return {
      isDuplicate: false,
      canonicalFile: assetMeta.file,
      sha256
    };
  }

  getStats() {
    return {
      uniqueAssetsCount: this.shaToAsset.size,
      duplicateAssetsDetected: this.duplicateCount
    };
  }

  getProvenanceForSha(sha256) {
    return this.shaToAsset.get(sha256) || null;
  }
}
