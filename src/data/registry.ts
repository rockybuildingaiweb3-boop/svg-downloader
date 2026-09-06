/**
 * Authoritative Unified Registry Data Access Module
 */
import {
  CANONICAL_CATALOG,
  REGISTRY_ITEMS,
  REGISTRY_ASSETS,
  REGISTRY_STATS,
  ICON_MAP,
  ASSET_MAP,
  CURATED_ICONS
} from './catalog';

export {
  CANONICAL_CATALOG,
  REGISTRY_ITEMS,
  REGISTRY_ASSETS,
  REGISTRY_STATS,
  ICON_MAP,
  ASSET_MAP,
  CURATED_ICONS
};

export const TOTAL_IDENTITIES = REGISTRY_ITEMS.length;
export const TOTAL_ASSETS = REGISTRY_ASSETS.length;

export function getIdentityById(id: string) {
  return ICON_MAP[id] || null;
}

export function getAssetById(assetId: string) {
  return ASSET_MAP[assetId] || null;
}
