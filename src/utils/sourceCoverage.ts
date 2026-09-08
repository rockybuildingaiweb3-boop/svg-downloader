import { IconItem, SourceProvider } from '../types';
import { ENABLED_SOURCES } from '../data/sourceRegistry';

export type SourceAvailabilityState =
  | 'available'
  | 'not-found'
  | 'not-supported'
  | 'error'
  | 'timeout'
  | 'disabled'
  | 'unknown';

export interface SourceCoverageMap {
  'simple-icons': SourceAvailabilityState;
  devicon: SourceAvailabilityState;
  'svg-logos': SourceAvailabilityState;
  official: SourceAvailabilityState;
  wikimedia: SourceAvailabilityState;
  [key: string]: SourceAvailabilityState;
}

export interface SourceDistributionStats {
  oneProvider: number;
  twoProviders: number;
  threeProviders: number;
  fourProviders: number;
  fiveOrMoreProviders: number;
  singleSourceCount: number;
  twoSourcesCount: number;
  threeSourcesCount: number;
  fourOrMoreSourcesCount: number;
  singleSourceItems: string[];
  twoSourceItems: string[];
  multiSourcePercentage: number;
  singleSourcePercentage: number;
}

export interface SourceProviderMatrix {
  provider: SourceProvider;
  label: string;
  identitiesFound: number;
  totalAssets: number;
  percentage: number;
}

export interface RegistryCoverageSummary {
  totalIdentities: number;
  totalAssets: number;
  totalProviders: number;
  providerMatrix: SourceProviderMatrix[];
  distribution: SourceDistributionStats;
}

export const ENABLED_SOURCE_PROVIDERS: Array<{ id: SourceProvider; label: string }> = ENABLED_SOURCES.map(s => ({
  id: s.id,
  label: s.name
}));

/**
 * Calculates deterministic source coverage summary for the entire registry
 */
export function computeRegistryCoverageSummary(items: IconItem[]): RegistryCoverageSummary {
  const totalIdentities = items.length;
  let totalAssets = 0;

  const providerCounts: Record<string, { identities: number; assets: number }> = {};
  for (const p of ENABLED_SOURCE_PROVIDERS) {
    providerCounts[p.id] = { identities: 0, assets: 0 };
  }

  let singleSourceCount = 0;
  let twoSourcesCount = 0;
  let threeSourcesCount = 0;
  let fourSourcesCount = 0;
  let fiveOrMoreSourcesCount = 0;
  const singleSourceItems: string[] = [];
  const twoSourceItems: string[] = [];

  for (const item of items) {
    const assets = item.assets && item.assets.length > 0 ? item.assets : [];
    const concreteCount = item.assets?.length ?? (item.assetCount ?? 0);
    totalAssets += concreteCount;

    // Identify distinct providers present in this identity
    const distinctProviders = new Set<string>();

    if (item.sourceCoverage) {
      for (const [prov, state] of Object.entries(item.sourceCoverage)) {
        if (state === 'available') {
          distinctProviders.add(prov === 'iconify' ? 'svg-logos' : prov);
        }
      }
    } else {
      for (const a of assets) {
        const p = (a.sourceProvider as string) === 'iconify' ? 'svg-logos' : a.sourceProvider;
        if (p) distinctProviders.add(p);
      }
    }

    if (distinctProviders.size === 0 && item.sourceProvider) {
      const p = (item.sourceProvider as string) === 'iconify' ? 'svg-logos' : item.sourceProvider;
      distinctProviders.add(p);
    }

    // Update provider counts
    for (const prov of distinctProviders) {
      if (providerCounts[prov]) {
        providerCounts[prov].identities++;
      }
    }

    for (const a of assets) {
      const p = (a.sourceProvider as string) === 'iconify' ? 'svg-logos' : a.sourceProvider;
      if (providerCounts[p]) {
        providerCounts[p].assets++;
      }
    }

    // Source Distribution
    const sourcesCount = distinctProviders.size;
    if (sourcesCount === 1) {
      singleSourceCount++;
      if (singleSourceItems.length < 50) singleSourceItems.push(item.id);
    } else if (sourcesCount === 2) {
      twoSourcesCount++;
      if (twoSourceItems.length < 50) twoSourceItems.push(item.id);
    } else if (sourcesCount === 3) {
      threeSourcesCount++;
    } else if (sourcesCount === 4) {
      fourSourcesCount++;
    } else if (sourcesCount >= 5) {
      fiveOrMoreSourcesCount++;
    }
  }

  const providerMatrix: SourceProviderMatrix[] = ENABLED_SOURCE_PROVIDERS.map(p => ({
    provider: p.id,
    label: p.label,
    identitiesFound: providerCounts[p.id]?.identities || 0,
    totalAssets: providerCounts[p.id]?.assets || 0,
    percentage: totalIdentities > 0 ? Math.round(((providerCounts[p.id]?.identities || 0) / totalIdentities) * 100) : 0,
  }));

  const multiSourceCount = twoSourcesCount + threeSourcesCount + fourSourcesCount + fiveOrMoreSourcesCount;
  const multiSourcePercentage = totalIdentities > 0
    ? Math.round((multiSourceCount / totalIdentities) * 1000) / 10
    : 0;
  const singleSourcePercentage = totalIdentities > 0
    ? Math.round((singleSourceCount / totalIdentities) * 1000) / 10
    : 0;

  return {
    totalIdentities,
    totalAssets,
    totalProviders: ENABLED_SOURCE_PROVIDERS.length,
    providerMatrix,
    distribution: {
      oneProvider: singleSourceCount,
      twoProviders: twoSourcesCount,
      threeProviders: threeSourcesCount,
      fourProviders: fourSourcesCount,
      fiveOrMoreProviders: fiveOrMoreSourcesCount,
      singleSourceCount,
      twoSourcesCount,
      threeSourcesCount,
      fourOrMoreSourcesCount: fourSourcesCount + fiveOrMoreSourcesCount,
      singleSourceItems,
      twoSourceItems,
      multiSourcePercentage,
      singleSourcePercentage,
    },
  };
}

export type HealthDimensionId = 'coverage' | 'integrity' | 'classification' | 'provenance' | 'resolution';

export interface HealthDimension {
  id: HealthDimensionId;
  name: string;
  score: number;
  weight: number;
  description: string;
  healthyCount: number;
  warningCount: number;
  unknownCount: number;
  failedCount: number;
  total: number;
  count: number; // backward-compatibility alias for healthyCount
  formula: string;
}

export interface RegistryHealthMetrics {
  healthScore: number;
  formula: string;
  dimensions: {
    coverage: HealthDimension;
    integrity: HealthDimension;
    classification: HealthDimension;
    provenance: HealthDimension;
    resolution: HealthDimension;
  };
  verifiedIdentities: number;
  sparseSourceIdentities: number;
  unresolvedIdentities: number;
  unknownLicenseCount: number;
  needsReviewIdentities: number;
  uncategorizedIdentities: number;
  isPerfect: boolean;
}

/**
 * Honest Registry Health Calculator
 * Refactored measurement model where every dimension measures exactly what its name claims:
 * 1. Coverage (20%): Authoritative source availability and multi-source redundancy across enabled providers.
 * 2. Integrity (25%): Structural vector validity, SVG renderability, and cryptographic SHA-256 digest.
 * 3. Classification (20%): Curated and upstream taxonomy mapping vs provisional or fallback categories.
 * 4. Provenance (15%): Direct upstream attribution traceability and verified license evidence.
 * 5. Resolution (20%): Deterministic canonical asset arbitration and collision resolution.
 */
export function computeRegistryHealth(items: IconItem[]): RegistryHealthMetrics {
  const total = items.length;
  const enabledCount = ENABLED_SOURCE_PROVIDERS.length;
  const healthFormula = 'Health = (Coverage × 20%) + (Integrity × 25%) + (Classification × 20%) + (Provenance × 15%) + (Resolution × 20%)';

  if (total === 0) {
    const emptyDim = (id: HealthDimensionId, name: string, weight: number, desc: string, formula: string): HealthDimension => ({
      id,
      name,
      score: 100,
      weight,
      description: desc,
      healthyCount: 0,
      warningCount: 0,
      unknownCount: 0,
      failedCount: 0,
      count: 0,
      total: 0,
      formula,
    });
    return {
      healthScore: 100,
      formula: healthFormula,
      dimensions: {
        coverage: emptyDim('coverage', 'Coverage', 20, `Authoritative coverage across ${enabledCount} enabled providers`, 'Healthy (≥2 providers) + Warning (1 provider × 0.6)'),
        integrity: emptyDim('integrity', 'Integrity', 25, 'Structural vector validity, SVG renderability, and cryptographic SHA-256 digest', 'xmlValid && svgRenderable && integrityVerified'),
        classification: emptyDim('classification', 'Classification', 20, 'Curated and upstream taxonomy mapping vs provisional or fallback categories', 'Curated/Source (100%) + Derived/Heuristic (50%)'),
        provenance: emptyDim('provenance', 'Provenance', 15, 'Direct upstream attribution traceability and verified license evidence', 'Traceable origin + verified license evidence'),
        resolution: emptyDim('resolution', 'Resolution', 20, 'Deterministic canonical asset arbitration and collision resolution', 'Verified canonical resolution with zero unresolved risk'),
      },
      verifiedIdentities: 0,
      sparseSourceIdentities: 0,
      unresolvedIdentities: 0,
      unknownLicenseCount: 0,
      needsReviewIdentities: 0,
      uncategorizedIdentities: 0,
      isPerfect: true,
    };
  }

  // 1. Coverage counters
  let covHealthy = 0; // multi-source (>= 2 providers)
  let covWarning = 0; // single-source (exactly 1 provider)
  let covFailed = 0;  // 0 providers when probed
  let covUnknown = 0; // no coverage probes or assets

  // 2. Integrity counters
  let intHealthy = 0; // xmlValid && svgRenderable && integrityVerified
  let intWarning = 0; // xmlValid && svgRenderable && !integrityVerified
  let intFailed = 0;  // !xmlValid || !svgRenderable
  let intUnknown = 0; // missing validation fields

  // 3. Classification counters
  let catHealthy = 0; // curated or source (authoritative taxonomy)
  let catWarning = 0; // derived or heuristic (inferred domain)
  let catUnknown = 0; // fallback / needs-review / unconfirmed
  let catFailed = 0;  // uncategorized

  // 4. Provenance counters
  let provHealthy = 0; // traceable origin AND verified license evidence
  let provWarning = 0; // traceable origin without license, or vice-versa
  let provFailed = 0;  // missing both origin and license
  let provUnknown = 0; // unrecorded provenance

  // 5. Resolution counters
  let resHealthy = 0; // verified canonical resolution, 0 conflicts
  let resWarning = 0; // warning or conflict (unresolved-risk)
  let resFailed = 0;  // invalid resolution
  let resUnknown = 0; // unresolved or missing canonical asset

  // Auxiliary metrics for dashboard cards
  let verifiedCount = 0;
  let unresolvedCount = 0;
  let unknownLicenseCount = 0;
  let needsReviewCount = 0;
  let uncategorizedCount = 0;

  for (const item of items) {
    // -------------------------------------------------------------
    // DIMENSION 1: COVERAGE
    // Invariant: Missing data must NOT become single-source coverage.
    // Count only authoritative sourceCoverage or concrete assets.
    // -------------------------------------------------------------
    let availableProviders = 0;
    let hasAuthoritativeData = false;

    if (item.sourceCoverage && typeof item.sourceCoverage === 'object') {
      const probes = Object.values(item.sourceCoverage);
      const knownProbes = probes.filter(s => s && s !== 'unknown');
      if (knownProbes.length > 0) {
        hasAuthoritativeData = true;
        availableProviders = probes.filter(s => s === 'available').length;
      }
    }

    if (!hasAuthoritativeData && item.assets && item.assets.length > 0) {
      const distinct = new Set(item.assets.map(a => a.sourceProvider).filter(Boolean));
      if (distinct.size > 0) {
        hasAuthoritativeData = true;
        availableProviders = distinct.size;
      }
    }

    if (!hasAuthoritativeData) {
      covUnknown++;
    } else if (availableProviders >= 2) {
      covHealthy++;
    } else if (availableProviders === 1) {
      covWarning++;
    } else {
      covFailed++;
    }

    // -------------------------------------------------------------
    // DIMENSION 2: INTEGRITY
    // Invariant: Derive strictly from granular fields (xmlValid,
    // svgRenderable, integrityVerified). Do NOT use generic verified.
    // -------------------------------------------------------------
    const xmlValid = item.xmlValid === true;
    const svgRenderable = item.svgRenderable === true;
    const integrityVerified = item.integrityVerified === true;

    if (item.xmlValid === undefined || item.svgRenderable === undefined) {
      intUnknown++;
    } else if (!xmlValid || !svgRenderable) {
      intFailed++;
    } else if (integrityVerified) {
      intHealthy++;
    } else {
      intWarning++;
    }

    // -------------------------------------------------------------
    // DIMENSION 3: CLASSIFICATION
    // Invariant: Distinguish curated/source/derived/heuristic/unknown.
    // Do NOT treat fallback/unknown as healthy.
    // -------------------------------------------------------------
    const cat = item.primaryCategory || item.category;
    const src = item.categorySource;

    if (cat === 'needs-review') {
      needsReviewCount++;
    } else if (cat === 'uncategorized') {
      uncategorizedCount++;
    }

    if (cat === 'uncategorized') {
      catFailed++;
    } else if (cat === 'needs-review' || src === 'fallback' || !src) {
      catUnknown++;
    } else if (src === 'curated' || src === 'source') {
      catHealthy++;
    } else if (src === 'derived' || src === 'heuristic') {
      catWarning++;
    } else {
      catUnknown++;
    }

    // -------------------------------------------------------------
    // DIMENSION 4: PROVENANCE
    // Invariant: Require source attribution/record AND license evidence.
    // Separate "license known" from "provenance traceable".
    // -------------------------------------------------------------
    const isTraceable = !!(
      (item.sourcePlatform || item.sourceProvider) &&
      item.sourceUrl &&
      ((item.sourceRecords && item.sourceRecords.length > 0) || item.sourceId)
    );
    const hasLicense = !!(item.license && item.license !== 'unknown' && item.licenseStatus !== 'unknown');
    const hasLicenseEvidence = !!(
      item.licenseEvidence ||
      (item.sourceRecords && item.sourceRecords.some(r => r.license && r.license !== 'unknown'))
    );

    if (!hasLicense) {
      unknownLicenseCount++;
    }

    if (isTraceable && hasLicense && hasLicenseEvidence) {
      provHealthy++;
    } else if (isTraceable || hasLicense) {
      provWarning++;
    } else if (!isTraceable && !hasLicense) {
      provFailed++;
    } else {
      provUnknown++;
    }

    // -------------------------------------------------------------
    // DIMENSION 5: RESOLUTION
    // Invariant: Verified canonical resolution = healthy.
    // Warning/conflict = unresolved-risk, not healthy.
    // Invalid must NEVER count as resolved.
    // -------------------------------------------------------------
    const st = item.verificationStatus;
    const hasCanonical = !!(item.canonicalAssetId || item.canonicalAsset);
    const hasConflict = (item.conflicts && item.conflicts.length > 0) || st === 'conflict';

    if (st === 'verified') {
      verifiedCount++;
    } else if (st === 'unresolved') {
      unresolvedCount++;
    }

    if (st === 'invalid') {
      resFailed++;
    } else if (st === 'unresolved' || !hasCanonical) {
      resUnknown++;
    } else if (st === 'warning' || hasConflict) {
      resWarning++;
    } else if (st === 'verified' && hasCanonical) {
      resHealthy++;
    } else {
      resUnknown++;
    }
  }

  // Dimension Score Computations
  // Coverage: Multi-source (1.0) + Single-source (0.6) - availability with single-point-of-failure warning
  const coverageScore = Math.round(((covHealthy * 1.0 + covWarning * 0.6) / total) * 1000) / 10;
  // Integrity: Valid + Renderable + Hash Verified (1.0) + Valid + Renderable without Hash (0.5)
  const integrityScore = Math.round(((intHealthy * 1.0 + intWarning * 0.5) / total) * 1000) / 10;
  // Classification: Curated/Source (1.0) + Derived/Heuristic (0.5); Fallback/Needs-Review (0.0)
  const classificationScore = Math.round(((catHealthy * 1.0 + catWarning * 0.5) / total) * 1000) / 10;
  // Provenance: Traceable & Verified License (1.0) + Partial (0.5)
  const provenanceScore = Math.round(((provHealthy * 1.0 + provWarning * 0.5) / total) * 1000) / 10;
  // Resolution: Disambiguated Canonical (1.0) + Warning/Conflict Risk (0.5); Invalid (0.0)
  const resolutionScore = Math.round(((resHealthy * 1.0 + resWarning * 0.5) / total) * 1000) / 10;

  // Composite weighted score (weights: 20%, 25%, 20%, 15%, 20%)
  const healthScore = Math.round(
    (coverageScore * 0.20 +
      integrityScore * 0.25 +
      classificationScore * 0.20 +
      provenanceScore * 0.15 +
      resolutionScore * 0.20) * 10
  ) / 10;

  return {
    healthScore,
    formula: healthFormula,
    dimensions: {
      coverage: {
        id: 'coverage',
        name: 'Coverage',
        score: coverageScore,
        weight: 20,
        description: `Authoritative coverage across ${enabledCount} enabled providers`,
        healthyCount: covHealthy,
        warningCount: covWarning,
        unknownCount: covUnknown,
        failedCount: covFailed,
        count: covHealthy,
        total,
        formula: 'Multi-source (100%) + Single-source (60%)',
      },
      integrity: {
        id: 'integrity',
        name: 'Integrity',
        score: integrityScore,
        weight: 25,
        description: 'Structural vector validity, SVG renderability, and cryptographic SHA-256 digest',
        healthyCount: intHealthy,
        warningCount: intWarning,
        unknownCount: intUnknown,
        failedCount: intFailed,
        count: intHealthy,
        total,
        formula: 'xmlValid && svgRenderable && integrityVerified',
      },
      classification: {
        id: 'classification',
        name: 'Classification',
        score: classificationScore,
        weight: 20,
        description: 'Curated and upstream taxonomy mapping vs provisional or fallback categories',
        healthyCount: catHealthy,
        warningCount: catWarning,
        unknownCount: catUnknown,
        failedCount: catFailed,
        count: catHealthy,
        total,
        formula: 'Curated/Source (100%) + Derived/Heuristic (50%)',
      },
      provenance: {
        id: 'provenance',
        name: 'Provenance',
        score: provenanceScore,
        weight: 15,
        description: 'Direct upstream attribution traceability and verified license evidence',
        healthyCount: provHealthy,
        warningCount: provWarning,
        unknownCount: provUnknown,
        failedCount: provFailed,
        count: provHealthy,
        total,
        formula: 'Traceable origin + verified license evidence',
      },
      resolution: {
        id: 'resolution',
        name: 'Resolution',
        score: resolutionScore,
        weight: 20,
        description: 'Deterministic canonical asset arbitration and collision resolution',
        healthyCount: resHealthy,
        warningCount: resWarning,
        unknownCount: resUnknown,
        failedCount: resFailed,
        count: resHealthy,
        total,
        formula: 'Verified canonical resolution with zero unresolved risk',
      },
    },
    verifiedIdentities: verifiedCount,
    sparseSourceIdentities: covWarning,
    unresolvedIdentities: unresolvedCount,
    unknownLicenseCount,
    needsReviewIdentities: needsReviewCount,
    uncategorizedIdentities: uncategorizedCount,
    isPerfect: healthScore >= 99.5 && unresolvedCount === 0 && unknownLicenseCount === 0,
  };
}
