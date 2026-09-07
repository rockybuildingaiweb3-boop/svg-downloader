import { IconItem } from '../types';
import { REGISTRY_IDENTITIES, REGISTRY_ITEMS, CANONICAL_CATALOG, ICON_MAP } from './catalog';
import { CATEGORY_IDS, StandardCategoryId, CATEGORY_DEFINITIONS } from '../taxonomy/taxonomy';

/**
 * @deprecated Legacy Curated Catalog Semantics.
 * Use REGISTRY_IDENTITIES and REGISTRY_ASSETS from src/data/catalog instead.
 * No new code may import CURATED_ICONS.
 */
export const CURATED_ICONS: IconItem[] = REGISTRY_IDENTITIES;

export { REGISTRY_IDENTITIES, REGISTRY_ITEMS, CANONICAL_CATALOG, ICON_MAP, CATEGORY_DEFINITIONS };

export interface CategoryItem {
  id: string;
  defaultLabel: string;
}

/**
 * Language-Neutral Category Definitions (Objective 1.7)
 * UI labels MUST come from i18n via t.filters.categories[id].
 * Never hardcode mixed-language labels.
 */
export const CATEGORIES: CategoryItem[] = CATEGORY_IDS.map(id => ({
  id,
  defaultLabel: id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
}));
