/**
 * Authoritative Unified Registry Data Access Module (Phase 1)
 */
import {
  CANONICAL_CATALOG,
  REGISTRY_IDENTITIES,
  REGISTRY_ASSETS,
  REGISTRY_STATS,
  REGISTRY_SOURCES,
  ICON_MAP,
  ASSET_MAP,
  CATEGORY_INDEX,
  SOURCE_INDEX,
  REGISTRY_SNAPSHOT,
} from './catalog';

export {
  CANONICAL_CATALOG,
  REGISTRY_IDENTITIES,
  REGISTRY_ASSETS,
  REGISTRY_STATS,
  REGISTRY_SOURCES,
  ICON_MAP,
  ASSET_MAP,
  CATEGORY_INDEX,
  SOURCE_INDEX,
  REGISTRY_SNAPSHOT,
};

export const TOTAL_IDENTITIES = REGISTRY_IDENTITIES.length;
export const TOTAL_ASSETS = REGISTRY_ASSETS.length;

export function getIdentityById(id: string) {
  return ICON_MAP[id] || null;
}

export function getAssetById(assetId: string) {
  return ASSET_MAP[assetId] || null;
}
