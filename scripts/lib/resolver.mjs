import fs from 'node:fs/promises';
import path from 'node:path';
import { SimpleIconsAdapter } from './adapters/simpleIconsAdapter.mjs';
import { DeviconAdapter } from './adapters/deviconAdapter.mjs';
import { OfficialAdapter } from './adapters/officialAdapter.mjs';
import { SvgLogosAdapter } from './adapters/svgLogosAdapter.mjs';
import { WikimediaAdapter } from './adapters/wikimediaAdapter.mjs';
import { classifyIdentity } from './categoryClassifier.mjs';

/**
 * Authoritative Single Source-of-Truth Resolver with Pluggable Source Policies
 */
export class IconResolver {
  constructor(rootDir = process.cwd()) {
    this.rootDir = rootDir;
    this.simpleIcons = new SimpleIconsAdapter(rootDir);
    this.devicon = new DeviconAdapter(rootDir);
    this.official = new OfficialAdapter(rootDir);
    this.svgLogos = new SvgLogosAdapter(rootDir);
    this.wikimedia = new WikimediaAdapter(rootDir);
    this.aliases = new Map();
    this.canonicalToAliases = new Map();
    this.collections = { mainstream: [], categories: {} };
    this.sourcePolicies = {
      defaultPolicy: 'brand',
      policies: {
        brand: {
          name: 'Brand (High Fidelity)',
          description: 'Prefers official vendor marks, followed by SVG Logos, Simple Icons, and Devicon',
          priority: ['official', 'wikimedia', 'svg-logos', 'simple-icons', 'devicon']
        },
        technology: {
          name: 'Technology (Dev & Frameworks)',
          description: 'Prefers Devicon original developer marks, followed by SVG Logos, Official, and Simple Icons',
          priority: ['devicon', 'svg-logos', 'official', 'wikimedia', 'simple-icons']
        },
        monochrome: {
          name: 'Monochrome (Single Color)',
          description: 'Prefers Simple Icons single-path canonical glyphs for UI icon systems',
          priority: ['simple-icons', 'devicon', 'svg-logos', 'official']
        },
        official: {
          name: 'Strict Official Only',
          description: 'Only verified official vendor assets and Wikimedia Commons archives',
          priority: ['official', 'wikimedia']
        }
      },
      identityOverrides: {}
    };
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
        const cleanK = k.toLowerCase().trim();
        const cleanV = v.toLowerCase().trim();
        this.aliases.set(cleanK, cleanV);
        if (!this.canonicalToAliases.has(cleanV)) {
          this.canonicalToAliases.set(cleanV, new Set());
        }
        this.canonicalToAliases.get(cleanV).add(cleanK);
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

    // 3. Load config/source-policies.json
    try {
      const polContent = await fs.readFile(path.join(this.rootDir, 'config', 'source-policies.json'), 'utf8');
      const polJson = JSON.parse(polContent);
      if (polJson.defaultPolicy) this.sourcePolicies.defaultPolicy = polJson.defaultPolicy;
      if (polJson.policies) this.sourcePolicies.policies = polJson.policies;
      if (polJson.identityOverrides) this.sourcePolicies.identityOverrides = polJson.identityOverrides;
    } catch (err) {
      console.warn(`[IconResolver] Warning: could not load config/source-policies.json: ${err.message}`);
    }

    // 4. Load all 5 adapters in parallel
    await Promise.all([
      this.simpleIcons.load(),
      this.devicon.load(),
      this.official.load(),
      this.svgLogos.load(),
      this.wikimedia.load()
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
   * Step 1 & 2: Resolves a query to canonical identity ID
   * @param {string} inputQuery
   * @returns {string | null}
   */
  resolveIdentity(inputQuery) {
    if (!inputQuery) return null;
    const normalized = this.normalizeQuery(inputQuery);
    const canonicalId = this.applyAlias(normalized);

    // Check if known across adapters
    if (this.official.get(canonicalId) || this.official.get(normalized)) return canonicalId;
    if (this.svgLogos.findByQuery(canonicalId) || this.svgLogos.findByQuery(normalized)) return canonicalId;
    if (this.devicon.findByQuery(canonicalId) || this.devicon.findByQuery(normalized)) return canonicalId;
    if (this.simpleIcons.findByQuery(canonicalId) || this.simpleIcons.findByQuery(normalized)) return canonicalId;
    if (this.aliases.has(normalized)) return canonicalId;

    return null;
  }

  /**
   * Helper to determine semantically correct source platform label and trust state
   * Requirement 16: Wikimedia is a source platform, not proof of official authorship.
   */
  getSourcePlatformAndTrust(provider, collection = '') {
    switch (provider) {
      case 'official':
        return { sourcePlatform: 'Official Vendor', trustState: 'verified' };
      case 'wikimedia':
        return { sourcePlatform: 'Wikimedia Commons', trustState: 'community' };
      case 'iconify':
      case 'svg-logos':
        return { sourcePlatform: 'SVG Logos', trustState: 'verified' };
      case 'devicon':
        return { sourcePlatform: 'Devicon', trustState: 'community' };
      case 'simple-icons':
      default:
        return { sourcePlatform: 'Simple Icons', trustState: 'verified' };
    }
  }

  /**
   * Discovers complete Asset Family and builds Source Records (evidence) across all 5 enabled providers
   * Active Cross-Source Resolution with Bidirectional Alias Clustering
   * @param {string} canonicalId
   * @returns {{ allFamilyAssets: import('./types.mjs').BrandAsset[], sourceRecords: import('./types.mjs').SourceRecord[], sourceCoverage: Record<string, string>, sourceCoverageFound: number, sourceCoverageChecked: number, sourceCoverageScore: string, deviconTags: string[], identityAliases: string[] }}
   */
  getAssetFamily(canonicalId) {
    // 1. Gather all candidate aliases for this canonical identity
    const candidates = new Set();
    const cleanId = (canonicalId || '').toLowerCase().trim();
    candidates.add(cleanId);
    candidates.add(cleanId.replace(/[\s_]+/g, '-'));
    candidates.add(cleanId.replace(/[^a-z0-9]/g, ''));

    if (this.canonicalToAliases.has(cleanId)) {
      for (const alt of this.canonicalToAliases.get(cleanId)) {
        candidates.add(alt);
        candidates.add(alt.replace(/[\s_]+/g, '-'));
        candidates.add(alt.replace(/[^a-z0-9]/g, ''));
      }
    }

    const candidateList = Array.from(candidates);

    // 2. Query Official Vendor Provider
    const officialAssets = [];
    for (const c of candidateList) {
      const found = this.official.getAssets(c);
      if (found.length > 0) {
        officialAssets.push(...found);
        break;
      }
    }

    // 3. Query Wikimedia Commons Provider
    const wikimediaAssets = [];
    for (const c of candidateList) {
      const found = this.wikimedia.getAssets(c);
      if (found.length > 0) {
        wikimediaAssets.push(...found);
        break;
      }
    }

    // 4. Query SVG Logos Provider (with -icon probe)
    const svgLogosAssets = [];
    const seenSvgNames = new Set();
    for (const c of candidateList) {
      const found = this.svgLogos.getAssets(c);
      for (const a of found) {
        if (!seenSvgNames.has(a.sourceId)) {
          seenSvgNames.add(a.sourceId);
          svgLogosAssets.push(a);
        }
      }
      if (!c.endsWith('-icon')) {
        const foundIcon = this.svgLogos.getAssets(`${c}-icon`);
        for (const a of foundIcon) {
          if (!seenSvgNames.has(a.sourceId)) {
            seenSvgNames.add(a.sourceId);
            svgLogosAssets.push(a);
          }
        }
      }
    }

    // 5. Query Devicon Provider
    const deviconAssets = [];
    let deviconTags = [];
    for (const c of candidateList) {
      const devMatch = this.devicon.findByQuery(c);
      if (devMatch && Array.isArray(devMatch.tags) && devMatch.tags.length > 0) {
        deviconTags = devMatch.tags;
      }
      const found = this.devicon.getAssets(c);
      if (found.length > 0) {
        deviconAssets.push(...found);
        break;
      }
    }

    // 6. Query Simple Icons Provider
    const simpleIconsAssets = [];
    for (const c of candidateList) {
      const found = this.simpleIcons.getAssets(c);
      if (found.length > 0) {
        simpleIconsAssets.push(...found);
        break;
      }
    }

    // Explicit Source Availability Status (Objective 3.2 & 3.4)
    const sourceCoverage = {
      official: officialAssets.length > 0 ? 'available' : 'not-found',
      wikimedia: wikimediaAssets.length > 0 ? 'available' : 'not-found',
      'svg-logos': svgLogosAssets.length > 0 ? 'available' : 'not-found',
      devicon: deviconAssets.length > 0 ? 'available' : 'not-found',
      'simple-icons': simpleIconsAssets.length > 0 ? 'available' : 'not-found'
    };

    const sourceCoverageFound = Object.values(sourceCoverage).filter(s => s === 'available').length;
    const sourceCoverageChecked = 5;
    const sourceCoverageScore = `${sourceCoverageFound} / ${sourceCoverageChecked}`;

    const allFamilyAssets = [
      ...officialAssets,
      ...wikimediaAssets,
      ...svgLogosAssets,
      ...deviconAssets,
      ...simpleIconsAssets
    ];

    // Ensure assets reference canonicalId as their identityId
    for (const asset of allFamilyAssets) {
      asset.identityId = canonicalId;
      const { sourcePlatform, trustState } = this.getSourcePlatformAndTrust(asset.sourceProvider, asset.sourceCollection);
      asset.sourcePlatform = sourcePlatform;
      asset.trustState = trustState;
      asset.xmlValid = false;
      asset.svgRenderable = false;
      asset.renderable = false;
      asset.sourceTrusted = trustState === 'verified' || trustState === 'trusted';
      asset.canonicalResolved = false;
      asset.integrityVerified = false;
      asset.variantVerified = false;
      asset.verificationStatus = 'unresolved';
    }

    // Build Source Records (Requirement 22 & 3.3: Distinguish source evidence from canonical asset)
    const sourceRecordsMap = new Map();

    for (const a of allFamilyAssets) {
      const prov = a.sourceProvider === 'iconify' ? 'svg-logos' : a.sourceProvider;
      if (!sourceRecordsMap.has(prov)) {
        const { sourcePlatform, trustState } = this.getSourcePlatformAndTrust(a.sourceProvider, a.sourceCollection);
        sourceRecordsMap.set(prov, {
          sourceProvider: a.sourceProvider,
          sourcePlatform,
          sourceCollection: a.sourceCollection,
          sourceId: a.sourceId,
          sourceVersion: a.sourceVersion,
          sourceUrl: a.sourceUrl,
          license: a.license,
          trustState,
          assetCount: 0,
          availableRoles: [],
          availableVariants: []
        });
      }

      const rec = sourceRecordsMap.get(prov);
      rec.assetCount++;
      if (!rec.availableRoles.includes(a.role)) rec.availableRoles.push(a.role);
      if (!rec.availableVariants.includes(a.graphicVariant)) rec.availableVariants.push(a.graphicVariant);
    }

    return {
      allFamilyAssets,
      sourceRecords: Array.from(sourceRecordsMap.values()),
      sourceCoverage,
      sourceCoverageFound,
      sourceCoverageChecked,
      sourceCoverageScore,
      deviconTags,
      identityAliases: candidateList
    };
  }

  /**
   * Evaluates and scores an asset candidate deterministically according to semantic source policy
   * Score = sourceScore + trustScore + roleScore + contextScore + variantScore + identityOverrideScore + evidenceScore
   * @param {import('./types.mjs').BrandAsset} asset
   * @param {Object} criteria
   * @param {Object} activePolicy
   * @param {Object} override
   * @returns {{ score: number, reasons: string[] }}
   */
  scoreCandidate(asset, criteria, activePolicy, override) {
    let score = 0;
    const reasons = [];

    // 1. Explicit Identity Override Match (+150 / +50)
    if (override?.preferredSource && asset.sourceProvider === override.preferredSource) {
      score += 150;
      reasons.push(`Explicit override for source (${asset.sourceProvider})`);
    }
    if (override?.preferredVariant && (asset.graphicVariant === override.preferredVariant || asset.role === override.preferredVariant)) {
      score += 50;
      reasons.push(`Explicit override for variant (${asset.graphicVariant})`);
    }

    // 2. User Requested Preferred Source (+100)
    if (criteria.preferredSource && (asset.sourceProvider === criteria.preferredSource || (criteria.preferredSource === 'svg-logos' && asset.sourceProvider === 'iconify'))) {
      score += 100;
      reasons.push(`Requested source matched (${asset.sourceProvider})`);
    }

    // 3. Source Policy Priority Ranking (0-50 based on activePolicy.priority list)
    const priorityList = activePolicy.priority || ['official', 'wikimedia', 'iconify', 'svg-logos', 'simple-icons', 'devicon'];
    const providerKey = asset.sourceProvider === 'iconify' ? 'svg-logos' : asset.sourceProvider;
    const pIndex = priorityList.indexOf(providerKey) !== -1 ? priorityList.indexOf(providerKey) : priorityList.indexOf(asset.sourceProvider);
    if (pIndex !== -1) {
      const pScore = Math.max(0, (priorityList.length - pIndex) * 10);
      score += pScore;
      reasons.push(`Source priority #${pIndex + 1} (+${pScore})`);
    }

    // 4. Trust State Score
    if (asset.trustState === 'trusted') { score += 40; }
    else if (asset.trustState === 'verified') { score += 30; }
    else if (asset.trustState === 'community') { score += 15; }

    // 5. Role Match
    if (criteria.role && criteria.role !== 'all') {
      if (asset.role === criteria.role) {
        score += 60;
        reasons.push(`Exact role match (${asset.role})`);
      } else {
        score -= 30;
      }
    } else {
      if (asset.role === 'symbol') score += 20;
      else if (asset.role === 'logo') score += 15;
    }

    // 6. Context Match
    if (criteria.context && criteria.context !== 'all') {
      if (asset.context?.includes(criteria.context)) {
        score += 50;
        reasons.push(`Exact context match (${criteria.context})`);
      } else {
        score -= 20;
      }
    }

    // 7. Graphic Variant / Color Match
    if (criteria.variant && criteria.variant !== 'all') {
      if (asset.graphicVariant === criteria.variant ||
         (criteria.variant === 'color' && asset.colorType === 'multi-color') ||
         (criteria.variant === 'monochrome' && asset.colorType === 'monochrome')) {
        score += 50;
        reasons.push(`Variant match (${criteria.variant})`);
      } else {
        score -= 20;
      }
    }

    // 8. Evidence Score
    if (asset.contextOrigin === 'source-confirmed') score += 25;
    else if (asset.contextOrigin === 'inferred') score += 10;

    return { score, reasons };
  }

  /**
   * Resolves specific asset in family with strict, preferred, or fallback semantics
   * @param {string} canonicalId
   * @param {Object} [criteria]
   * @param {string} [criteria.mode='preferred'] - 'strict' | 'preferred' | 'fallback'
   * @param {import('./types.mjs').BrandAsset[]} allFamilyAssets
   * @returns {import('./types.mjs').BrandAsset | null}
   */
  resolveAsset(canonicalId, criteria = {}, allFamilyAssets = []) {
    if (!allFamilyAssets || allFamilyAssets.length === 0) return null;

    const mode = criteria.mode || 'preferred';
    const policyKey = criteria.policy || this.sourcePolicies.defaultPolicy || 'brand';
    const activePolicy = this.sourcePolicies.policies[policyKey] || this.sourcePolicies.policies['brand'];
    const override = this.sourcePolicies.identityOverrides?.[canonicalId];

    // In STRICT mode, check hard constraints: if an asset fails any required filter, disqualify it
    if (mode === 'strict') {
      const candidates = allFamilyAssets.filter(a => {
        if (criteria.role && criteria.role !== 'all' && a.role !== criteria.role) return false;
        if (criteria.context && criteria.context !== 'all' && !a.context?.includes(criteria.context)) return false;
        if (criteria.variant && criteria.variant !== 'all' && a.graphicVariant !== criteria.variant && a.colorType !== criteria.variant) return false;
        if (criteria.sourceProvider && criteria.sourceProvider !== 'all' && a.sourceProvider !== criteria.sourceProvider) return false;
        return true;
      });

      if (candidates.length === 0) {
        // Principle 9 & 10: Strict constraints must return null if not matched (no silent generic logo fallback)
        return null;
      }

      // Rank remaining candidates by score
      const scored = candidates.map(a => ({
        asset: a,
        ...this.scoreCandidate(a, criteria, activePolicy, override)
      }));
      const winner = scored[0].asset;
      winner.canonicalResolved = true;
      winner.canonicalDecision = {
        selectedAssetId: winner.assetId,
        score: scored[0].score,
        reasons: scored[0].reasons,
        policy: policyKey,
        mode: 'strict'
      };
      return winner;
    }

    // In PREFERRED / FALLBACK mode: score all assets and select highest score
    const scored = allFamilyAssets.map(a => {
      const { score, reasons } = this.scoreCandidate(a, criteria, activePolicy, override);
      return { asset: a, score, reasons };
    });

    scored.sort((a, b) => b.score - a.score);

    const winner = scored[0].asset;
    winner.canonicalResolved = true;
    winner.canonicalDecision = {
      selectedAssetId: winner.assetId,
      score: scored[0].score,
      reasons: scored[0].reasons,
      policy: policyKey,
      mode
    };
    return winner;
  }

  /**
   * Complete multi-step asset resolution pipeline
   * query -> normalize -> alias resolution -> identity resolution -> asset family discovery -> context matching -> role matching -> variant matching -> source policy -> canonical asset selection
   * @param {string} inputQuery
   * @param {Object} [options]
   * @returns {Promise<{ canonicalId: string, canonicalAsset: import('./types.mjs').BrandAsset, allFamilyAssets: import('./types.mjs').BrandAsset[], sourceRecords: import('./types.mjs').SourceRecord[] } | null>}
   */
  async resolveBestAsset(inputQuery, options = {}) {
    if (!this.loaded) await this.load();

    const normalized = this.normalizeQuery(inputQuery);
    const canonicalId = this.resolveIdentity(normalized) || this.applyAlias(normalized);
    if (!canonicalId) return null;

    const {
      allFamilyAssets,
      sourceRecords,
      sourceCoverage,
      sourceCoverageFound,
      sourceCoverageChecked,
      sourceCoverageScore,
      deviconTags,
      identityAliases
    } = this.getAssetFamily(canonicalId);
    if (allFamilyAssets.length === 0) return null;

    const canonicalAsset = this.resolveAsset(canonicalId, options, allFamilyAssets);
    if (!canonicalAsset) return null;

    return {
      canonicalId,
      canonicalAsset,
      allFamilyAssets,
      sourceRecords,
      sourceCoverage,
      sourceCoverageFound,
      sourceCoverageChecked,
      sourceCoverageScore,
      deviconTags,
      identityAliases
    };
  }

  /**
   * Resolves a query to a canonical icon record according to configured policies
   * @param {string} inputQuery
   * @param {Object} [options]
   * @param {string} [options.policy] - 'brand' | 'technology' | 'monochrome' | 'official'
   * @param {string} [options.preferredVariant]
   * @param {string} [options.preferredSource]
   * @returns {Promise<import('./types.mjs').IconRecord | null>}
   */
  async resolveIcon(inputQuery, options = {}) {
    const resolved = await this.resolveBestAsset(inputQuery, options);
    if (!resolved) return null;

    const {
      canonicalId,
      canonicalAsset,
      allFamilyAssets,
      sourceRecords,
      sourceCoverage,
      sourceCoverageFound,
      sourceCoverageChecked,
      sourceCoverageScore,
      deviconTags,
      identityAliases
    } = resolved;
    const policyKey = options.policy || this.sourcePolicies.defaultPolicy || 'brand';

    // Mark canonical status and clean filenames without collision
    for (const asset of allFamilyAssets) {
      asset.isCanonical = asset === canonicalAsset;
      if (asset.isCanonical) {
        asset.file = `${canonicalId}.svg`;
      } else {
        asset.file = `${canonicalId}-${asset.sourceProvider}-${asset.role}-${asset.graphicVariant}.svg`;
      }
    }

    // Detect and log conflicts/collisions
    if (allFamilyAssets.length > 1) {
      this.conflicts.push({
        id: canonicalId,
        inputQuery,
        canonicalAssetId: canonicalAsset.assetId,
        resolvedSource: canonicalAsset.sourceProvider,
        policyApplied: policyKey,
        totalAssetsInFamily: allFamilyAssets.length,
        competingAssets: allFamilyAssets.filter(a => a !== canonicalAsset).map(a => ({
          assetId: a.assetId,
          sourceProvider: a.sourceProvider,
          sourceCollection: a.sourceCollection,
          role: a.role,
          graphicVariant: a.graphicVariant,
          context: a.context,
          license: a.license
        })),
        resolution: `Selected ${canonicalAsset.assetId} (${canonicalAsset.sourceProvider}, role: ${canonicalAsset.role}) under policy "${policyKey}". Output file: ${canonicalId}.svg without numerical suffix collisions.`
      });
    }

    // Find display title
    const offMatch = this.official.get(canonicalId);
    const wikiMatch = this.wikimedia.get(canonicalId);
    const siMatch = this.simpleIcons.findByQuery(canonicalId);
    const devMatch = this.devicon.findByQuery(canonicalId);
    const logoMatch = this.svgLogos.findByQuery(canonicalId);

    let title = canonicalId.charAt(0).toUpperCase() + canonicalId.slice(1);
    if (offMatch?.title) title = offMatch.title;
    else if (wikiMatch?.title) title = wikiMatch.title;
    else if (siMatch?.title) title = siMatch.title;
    else if (devMatch?.title) title = devMatch.title.charAt(0).toUpperCase() + devMatch.title.slice(1);
    else if (logoMatch?.title) title = logoMatch.title;

    let brandColor = '#111827';
    if (offMatch?.hex) brandColor = offMatch.hex;
    else if (wikiMatch?.hex) brandColor = wikiMatch.hex;
    else if (siMatch?.hex) brandColor = siMatch.hex;
    else if (devMatch?.hex) brandColor = devMatch.hex;

    // Multi-Category Classification (Objective 1)
    const catClassification = classifyIdentity({
      id: canonicalId,
      title,
      aliases: identityAliases,
      deviconTags,
      collections: this.collections
    });

    // Annotate all family assets with category metadata
    for (const a of allFamilyAssets) {
      a.primaryCategory = catClassification.primaryCategory;
      a.categories = catClassification.categories;
      a.categorySource = catClassification.categorySource;
      a.categoryConfidence = catClassification.categoryConfidence;
      a.category = catClassification.primaryCategory;
    }

    // Alternative Sources list for backward compatibility
    const alternativeSources = [];
    const seenProviders = new Set([canonicalAsset.sourceProvider]);
    for (const a of allFamilyAssets) {
      if (seenProviders.has(a.sourceProvider)) continue;
      seenProviders.add(a.sourceProvider);
      alternativeSources.push({
        source: a.sourceProvider === 'iconify' ? 'svg-logos' : a.sourceProvider,
        sourceId: a.sourceId,
        sourceVersion: a.sourceVersion,
        variants: [a.graphicVariant],
        license: a.license,
        sourceUrl: a.sourceUrl
      });
    }

    const variantsDict = {
      default: `${canonicalId}.svg`
    };
    for (const a of allFamilyAssets) {
      variantsDict[a.graphicVariant] = a.file;
      variantsDict[a.assetId] = a.file;
    }

    const { sourcePlatform, trustState } = this.getSourcePlatformAndTrust(canonicalAsset.sourceProvider, canonicalAsset.sourceCollection);

    const record = {
      id: canonicalId,
      title,
      canonicalName: canonicalId,
      source: canonicalAsset.sourceProvider === 'iconify' ? 'svg-logos' : canonicalAsset.sourceProvider,
      sourceProvider: canonicalAsset.sourceProvider,
      sourcePlatform,
      sourceCollection: canonicalAsset.sourceCollection,
      sourceId: canonicalAsset.sourceId,
      sourceVersion: canonicalAsset.sourceVersion,
      variant: canonicalAsset.graphicVariant,
      role: canonicalAsset.role,
      context: canonicalAsset.context,
      contextOrigin: canonicalAsset.contextOrigin,
      graphicVariant: canonicalAsset.graphicVariant,
      variants: variantsDict,
      file: `${canonicalId}.svg`,
      rawSha256: '',
      license: canonicalAsset.license,
      sourceUrl: canonicalAsset.sourceUrl,
      brandColor,
      category: catClassification.primaryCategory,
      primaryCategory: catClassification.primaryCategory,
      categories: catClassification.categories,
      categorySource: catClassification.categorySource,
      categoryConfidence: catClassification.categoryConfidence,
      sourceCoverage,
      sourceCoverageFound,
      sourceCoverageChecked,
      sourceCoverageScore,
      // Granular verification fields: Must NOT default to true before actual SVG parsing & hashing
      xmlValid: false,
      svgRenderable: false,
      sourceTrusted: trustState === 'verified' || trustState === 'trusted',
      canonicalResolved: true,
      integrityVerified: false,
      variantVerified: false,
      renderable: false,
      verificationStatus: 'unresolved',
      trustState,
      verified: false,
      sourceRecords,
      alternativeSources: alternativeSources.length > 0 ? alternativeSources : undefined,
      notes: canonicalAsset.notes || undefined,
      // Full Asset Family Modeling
      canonicalAssetId: canonicalAsset.assetId,
      canonicalDecision: canonicalAsset.canonicalDecision || {
        selectedAssetId: canonicalAsset.assetId,
        score: 0,
        reasons: ['Selected by policy default'],
        policy: policyKey,
        mode: 'preferred'
      },
      canonicalAsset,
      assets: allFamilyAssets,
      totalAssets: allFamilyAssets.length,
      _svgFetcher: canonicalAsset._svgFetcher
    };

    return record;
  }

  /**
   * Discover all unique canonical identities across all adapters
   * Preserves distinct source IDs and clusters them into semantic identities
   * @returns {string[]}
   */
  discoverAllIdentities() {
    const idSet = new Set();

    // 1. Add curated mainstream collection
    for (const id of this.collections.mainstream || []) {
      idSet.add(this.applyAlias(id));
    }

    // 2. Add all official items
    for (const item of this.official.getAll()) {
      idSet.add(this.applyAlias(item.slug));
    }

    // 2b. Add all wikimedia items
    for (const item of this.wikimedia.getAll()) {
      idSet.add(this.applyAlias(item.slug));
    }

    // 3. Add all devicon items
    for (const item of this.devicon.getAll()) {
      idSet.add(this.applyAlias(item.name));
    }

    // 4. Add all SVG Logos items: only group -icon if the base name is a recognized identity
    for (const item of this.svgLogos.getAll()) {
      if (item.name.endsWith('-icon')) {
        const base = item.name.slice(0, -5);
        if (this.simpleIcons.get(base) || this.devicon.get(base) || this.svgLogos.get(base) || this.aliases.has(base)) {
          idSet.add(this.applyAlias(base));
        } else {
          idSet.add(this.applyAlias(item.name));
        }
      } else {
        idSet.add(this.applyAlias(item.name));
      }
    }

    // 5. Add all Simple Icons items
    for (const item of this.simpleIcons.getAll()) {
      idSet.add(this.applyAlias(item.slug));
    }

    return Array.from(idSet).sort();
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

    // 2. Search Special/Official
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

    // 3. Search SVG Logos
    for (const logo of this.svgLogos.getAll()) {
      if (seen.has(logo.name)) continue;
      if (logo.name.includes(q) || logo.title.toLowerCase().includes(q)) {
        results.push({
          id: logo.name,
          title: logo.title,
          source: 'svg-logos',
          matchType: logo.name === q ? 'exact' : 'partial'
        });
        seen.add(logo.name);
      }
    }

    // 4. Search Devicon
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

    // 5. Search Simple Icons
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

    return results;
  }
}
