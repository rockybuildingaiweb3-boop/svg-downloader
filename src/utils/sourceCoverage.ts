import { IconItem, SourceProvider } from '../types';

export type SourceAvailabilityState = 'available' | 'not-found' | 'not-supported' | 'error' | 'unknown';

export interface SourceCoverageMap {
  'simple-icons': SourceAvailabilityState;
  devicon: SourceAvailabilityState;
  'svg-logos': SourceAvailabilityState;
  official: SourceAvailabilityState;
  wikimedia: SourceAvailabilityState;
}

export interface SourceDistributionStats {
  singleSourceCount: number;
  twoSourcesCount: number;
  threeSourcesCount: number;
  fourOrMoreSourcesCount: number;
  singleSourceItems: string[];
  twoSourceItems: string[];
}

export interface SourceProviderMatrix {
  provider: SourceProvider | 'svg-logos';
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

export const ENABLED_SOURCE_PROVIDERS: Array<{ id: SourceProvider | 'svg-logos'; label: string }> = [
  { id: 'official', label: 'Official Vendor' },
  { id: 'simple-icons', label: 'Simple Icons' },
  { id: 'svg-logos', label: 'SVG Logos' },
  { id: 'devicon', label: 'Devicon' },
  { id: 'wikimedia', label: 'Wikimedia Commons' },
];

/**
 * Calculates deterministic source coverage summary for the entire registry
 */
export function computeRegistryCoverageSummary(items: IconItem[]): RegistryCoverageSummary {
  const totalIdentities = items.length;
  let totalAssets = 0;

  const providerCounts: Record<string, { identities: number; assets: number }> = {
    official: { identities: 0, assets: 0 },
    'simple-icons': { identities: 0, assets: 0 },
    'svg-logos': { identities: 0, assets: 0 },
    devicon: { identities: 0, assets: 0 },
    wikimedia: { identities: 0, assets: 0 },
  };

  let singleSourceCount = 0;
  let twoSourcesCount = 0;
  let threeSourcesCount = 0;
  let fourOrMoreSourcesCount = 0;
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
        const p = a.sourceProvider === 'iconify' ? 'svg-logos' : a.sourceProvider;
        if (p) distinctProviders.add(p);
      }
    }

    if (distinctProviders.size === 0 && item.sourceProvider) {
      const p = item.sourceProvider === 'iconify' ? 'svg-logos' : item.sourceProvider;
      distinctProviders.add(p);
    }

    // Update provider counts
    for (const prov of distinctProviders) {
      if (providerCounts[prov]) {
        providerCounts[prov].identities++;
      }
    }

    for (const a of assets) {
      const p = a.sourceProvider === 'iconify' ? 'svg-logos' : a.sourceProvider;
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
    } else if (sourcesCount >= 4) {
      fourOrMoreSourcesCount++;
    }
  }

  const providerMatrix: SourceProviderMatrix[] = ENABLED_SOURCE_PROVIDERS.map(p => ({
    provider: p.id,
    label: p.label,
    identitiesFound: providerCounts[p.id]?.identities || 0,
    totalAssets: providerCounts[p.id]?.assets || 0,
    percentage: totalIdentities > 0 ? Math.round(((providerCounts[p.id]?.identities || 0) / totalIdentities) * 100) : 0,
  }));

  return {
    totalIdentities,
    totalAssets,
    totalProviders: ENABLED_SOURCE_PROVIDERS.length,
    providerMatrix,
    distribution: {
      singleSourceCount,
      twoSourcesCount,
      threeSourcesCount,
      fourOrMoreSourcesCount,
      singleSourceItems,
      twoSourceItems,
    },
  };
}
