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
    totalAssets += Math.max(assets.length, 1);

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

export interface RegistryHealthMetrics {
  healthScore: number;
  verifiedIdentities: number;
  sparseSourceIdentities: number;
  unresolvedIdentities: number;
  unknownLicenseCount: number;
  needsReviewIdentities: number;
  uncategorizedIdentities: number;
  isPerfect: boolean;
}

/**
 * Honest Registry Health Calculator (Requirement T2.1)
 * Calculates true health score based on actual validation invariants and data quality.
 */
export function computeRegistryHealth(items: IconItem[]): RegistryHealthMetrics {
  const total = items.length;
  if (total === 0) {
    return {
      healthScore: 100,
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
      : 1;
    if (sources === 1) {
      sparseCount++;
    }
  }

  // Calculate honest score: factor in unresolved items, unknown licenses, and classification gaps
  const unresolvedPenalty = (unresolvedCount / total) * 100;
  const unknownLicensePenalty = (unknownLicenseCount / total) * 15;
  const classificationPenalty = ((needsReviewCount * 0.03 + uncategorizedCount * 0.08) / total) * 100;
  const score = Math.max(
    0,
    Math.min(100, Math.round((100 - unresolvedPenalty - unknownLicensePenalty - classificationPenalty) * 10) / 10)
  );

  return {
    healthScore: score,
    verifiedIdentities: verifiedCount,
    sparseSourceIdentities: sparseCount,
    unresolvedIdentities: unresolvedCount,
    unknownLicenseCount,
    needsReviewIdentities: needsReviewCount,
    uncategorizedIdentities: uncategorizedCount,
    isPerfect: score === 100 && unresolvedCount === 0 && unknownLicenseCount === 0 && needsReviewCount === 0,
  };
}
