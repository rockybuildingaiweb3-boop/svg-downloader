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

export interface HealthDimension {
  name: string;
  score: number;
  weight: number;
  description: string;
  count: number;
  total: number;
}

export interface RegistryHealthMetrics {
  healthScore: number;
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
 * Honest Registry Health Calculator (Requirement T2.1 & Phase 7)
 * Calculates true composite health score and 5-dimension breakdown:
 * 1. Coverage (20%): Multi-source verified coverage ratio
 * 2. Integrity (25%): Cryptographically valid, renderable & well-formed
 * 3. Classification (20%): Curated and verified taxonomy mapping
 * 4. Provenance (15%): Direct upstream attribution & known licensing
 * 5. Resolution (20%): Disambiguated and verified canonical identities
 */
export function computeRegistryHealth(items: IconItem[]): RegistryHealthMetrics {
  const total = items.length;
  if (total === 0) {
    const emptyDim = (name: string, weight: number, desc: string): HealthDimension => ({
      name,
      score: 100,
      weight,
      description: desc,
      count: 0,
      total: 0,
    });
    return {
      healthScore: 100,
      dimensions: {
        coverage: emptyDim('Coverage', 20, 'Multi-source verified coverage ratio'),
        integrity: emptyDim('Integrity', 25, 'Cryptographic and structural vector integrity'),
        classification: emptyDim('Classification', 20, 'Curated taxonomy categorization ratio'),
        provenance: emptyDim('Provenance', 15, 'Direct upstream licensing and attribution'),
        resolution: emptyDim('Resolution', 20, 'Disambiguated canonical resolution ratio'),
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

  let verifiedCount = 0;
  let unresolvedCount = 0;
  let sparseCount = 0;
  let multiSourceCount = 0;
  let unknownLicenseCount = 0;
  let needsReviewCount = 0;
  let uncategorizedCount = 0;

  for (const item of items) {
    if (item.verificationStatus === 'verified' || item.verified) {
      verifiedCount++;
    } else if (item.verificationStatus === 'unresolved') {
      unresolvedCount++;
    }

    if (!item.license || item.licenseStatus === 'unknown') {
      unknownLicenseCount++;
    }

    const cat = item.primaryCategory || item.category;
    if (cat === 'needs-review') {
      needsReviewCount++;
    } else if (cat === 'uncategorized') {
      uncategorizedCount++;
    }

    const sources = item.sourceCoverage
      ? Object.values(item.sourceCoverage).filter(s => s === 'available').length
      : (item.assets && item.assets.length > 0 ? new Set(item.assets.map(a => a.sourceProvider)).size : 1);

    if (sources === 1) {
      sparseCount++;
    } else if (sources > 1) {
      multiSourceCount++;
    }
  }

  // 5 Explicit dimensions
  const coverageScore = Math.round((multiSourceCount / total) * 1000) / 10;
  const integrityScore = Math.round((verifiedCount / total) * 1000) / 10;
  const classifiedCount = Math.max(0, total - uncategorizedCount - needsReviewCount);
  const classificationScore = Math.round((classifiedCount / total) * 1000) / 10;
  const knownLicenseCount = Math.max(0, total - unknownLicenseCount);
  const provenanceScore = Math.round((knownLicenseCount / total) * 1000) / 10;
  const resolvedCount = Math.max(0, total - unresolvedCount);
  const resolutionScore = Math.round((resolvedCount / total) * 1000) / 10;

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
    dimensions: {
      coverage: {
        name: 'Coverage',
        score: coverageScore,
        weight: 20,
        description: 'Multi-source verified coverage ratio across 5 providers',
        count: multiSourceCount,
        total,
      },
      integrity: {
        name: 'Integrity',
        score: integrityScore,
        weight: 25,
        description: 'Cryptographic SHA-256 and XML schema verification ratio',
        count: verifiedCount,
        total,
      },
      classification: {
        name: 'Classification',
        score: classificationScore,
        weight: 20,
        description: 'Curated 19-category taxonomy categorization ratio',
        count: classifiedCount,
        total,
      },
      provenance: {
        name: 'Provenance',
        score: provenanceScore,
        weight: 15,
        description: 'Known license and direct upstream attribution ratio',
        count: knownLicenseCount,
        total,
      },
      resolution: {
        name: 'Resolution',
        score: resolutionScore,
        weight: 20,
        description: 'Disambiguated canonical resolution ratio',
        count: resolvedCount,
        total,
      },
    },
    verifiedIdentities: verifiedCount,
    sparseSourceIdentities: sparseCount,
    unresolvedIdentities: unresolvedCount,
    unknownLicenseCount,
    needsReviewIdentities: needsReviewCount,
    uncategorizedIdentities: uncategorizedCount,
    isPerfect: healthScore >= 99.5 && unresolvedCount === 0 && unknownLicenseCount === 0,
  };
}
