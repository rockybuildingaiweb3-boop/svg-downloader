import { IconItem } from '../types';
import { CURATED_ICONS, REGISTRY_ITEMS, CANONICAL_CATALOG, ICON_MAP } from './catalog';
import { CATEGORY_IDS, StandardCategoryId, CATEGORY_DEFINITIONS } from '../taxonomy/taxonomy';

export { CURATED_ICONS, REGISTRY_ITEMS, CANONICAL_CATALOG, ICON_MAP, CATEGORY_DEFINITIONS };

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
