/**
 * Standard Provenance Record Model (Requirement 36)
 * Records exhaustive source traceability for each vector asset.
 */

export class ProvenanceManager {
  constructor() {
    this.records = [];
  }

  /**
   * Adds a provenance record
   * @param {Object} item
   */
  record({
    identityId,
    assetId,
    sourceProvider,
    sourceCollection,
    sourceId,
    sourceVersion,
    sourceUrl,
    role,
    context,
    graphicVariant,
    license,
    brandColor,
    file,
    rawSha256,
    verificationStatus = 'verified',
    trustState = 'verified',
    isCanonical = false,
    xmlValid = true,
    renderable = true
  }) {
    const entry = {
      identityId: String(identityId),
      assetId: String(assetId),
      sourceProvider: String(sourceProvider),
      sourceCollection: String(sourceCollection || sourceProvider),
      sourceId: String(sourceId),
      sourceVersion: String(sourceVersion || 'unknown'),
      sourceUrl: sourceUrl || '',
      role: role || 'logo',
      context: Array.isArray(context) ? context : [context || 'general'],
      graphicVariant: graphicVariant || 'default',
      license: license || 'CC0 / Trademark',
      brandColor: brandColor || '#000000',
      file: String(file),
      rawSha256: String(rawSha256),
      verificationStatus: verificationStatus || 'verified',
      trustState: trustState || 'verified',
      isCanonical: Boolean(isCanonical),
      xmlValid: Boolean(xmlValid),
      renderable: Boolean(renderable),
      recordedAt: new Date().toISOString()
    };

    this.records.push(entry);
    return entry;
  }

  getAll() {
    return this.records;
  }

  getByAssetId(assetId) {
    return this.records.find(r => r.assetId === assetId) || null;
  }

  getByIdentity(identityId) {
    return this.records.filter(r => r.identityId === identityId);
  }

  toJSON() {
    return {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      totalRecords: this.records.length,
      records: this.records
    };
  }
}
