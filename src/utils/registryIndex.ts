import {
  REGISTRY_IDENTITIES,
  REGISTRY_ASSETS,
  ICON_MAP,
  ASSET_MAP,
  CATEGORY_INDEX,
  SOURCE_INDEX,
  REGISTRY_SOURCES,
  REGISTRY_STATS
} from '../data/catalog';
import type { IconItem, ConcreteAssetItem, AssetRole } from '../types';

/**
 * Precomputed Registry Indexes & High-Performance Lookup Engine
 * Requirement: Prepare frontend search and filtering for large-scale datasets (10k+).
 */

// Precomputed role and variant indexes for assets
const ASSETS_BY_ROLE = new Map<string, ConcreteAssetItem[]>();
const ASSETS_BY_VARIANT = new Map<string, ConcreteAssetItem[]>();
const ASSETS_BY_SOURCE = new Map<string, ConcreteAssetItem[]>();

for (const asset of REGISTRY_ASSETS) {
  const role = asset.role || 'logo';
  let roleList = ASSETS_BY_ROLE.get(role);
  if (!roleList) {
    roleList = [];
    ASSETS_BY_ROLE.set(role, roleList);
  }
  roleList.push(asset);

  const variant = asset.graphicVariant || 'default';
  let variantList = ASSETS_BY_VARIANT.get(variant);
  if (!variantList) {
    variantList = [];
    ASSETS_BY_VARIANT.set(variant, variantList);
  }
  variantList.push(asset);

  const source = asset.sourceProvider || 'simple-icons';
  let sourceList = ASSETS_BY_SOURCE.get(source);
  if (!sourceList) {
    sourceList = [];
    ASSETS_BY_SOURCE.set(source, sourceList);
  }
  sourceList.push(asset);
}

/**
 * Find an identity by its unique ID.
 */
export function findIdentityById(id: string): IconItem | undefined {
  return ICON_MAP[id];
}

/**
 * Find an identity by its slug.
 */
export function findIdentityBySlug(slug: string): IconItem | undefined {
  return ICON_MAP[slug];
}

/**
 * Find a concrete asset by its unique asset ID.
 */
export function findAssetById(assetId: string): ConcreteAssetItem | undefined {
  return ASSET_MAP[assetId];
}

/**
 * Retrieve all identities belonging to a category (or all if category is 'all').
 */
export function getIdentitiesByCategory(category: string): IconItem[] {
  if (!category || category === 'all') return REGISTRY_IDENTITIES;
  const ids = CATEGORY_INDEX[category];
  if (!ids) return [];
  return ids.map(id => ICON_MAP[id]).filter(Boolean) as IconItem[];
}

/**
 * Retrieve all identities from a specific source provider.
 */
export function getIdentitiesBySource(sourceProvider: string): IconItem[] {
  if (!sourceProvider || sourceProvider === 'all') return REGISTRY_IDENTITIES;
  const ids = SOURCE_INDEX[sourceProvider];
  if (!ids) return [];
  return ids.map(id => ICON_MAP[id]).filter(Boolean) as IconItem[];
}

/**
 * Retrieve all concrete assets from a specific source provider.
 */
export function getAssetsBySource(sourceProvider: string): ConcreteAssetItem[] {
  if (!sourceProvider || sourceProvider === 'all') return REGISTRY_ASSETS;
  return ASSETS_BY_SOURCE.get(sourceProvider) || [];
}

/**
 * Retrieve all concrete assets with a given role.
 */
export function getAssetsByRole(role: AssetRole | string): ConcreteAssetItem[] {
  if (!role || role === 'all') return REGISTRY_ASSETS;
  return ASSETS_BY_ROLE.get(role) || [];
}

/**
 * Retrieve all concrete assets with a given graphic variant.
 */
export function getAssetsByVariant(variant: string): ConcreteAssetItem[] {
  if (!variant || variant === 'all') return REGISTRY_ASSETS;
  return ASSETS_BY_VARIANT.get(variant) || [];
}

/**
 * Quick summary stats for top-level health checks.
 */
export function getRegistrySummary() {
  return {
    totalIdentities: REGISTRY_IDENTITIES.length,
    totalAssets: REGISTRY_ASSETS.length,
    totalSources: REGISTRY_SOURCES.length,
    stats: REGISTRY_STATS
  };
}
