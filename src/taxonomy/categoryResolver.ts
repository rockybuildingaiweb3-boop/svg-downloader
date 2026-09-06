import { IconItem, ConcreteAssetItem } from '../types';
import { CATEGORY_IDS, StandardCategoryId } from './taxonomy';

export interface CategoryStatItem {
  id: string;
  identitiesCount: number;
  assetsCount: number;
}

export interface CategoryRegistryStats {
  totalIdentities: number;
  totalAssets: number;
  categoryStats: Record<string, CategoryStatItem>;
  uncategorizedCount: number;
  needsReviewCount: number;
}

/**
 * Computes dynamic category statistics directly from the actual active registry dataset
 * Requirement 1.5: The UI should automatically calculate category counts, category identity counts,
 * and category asset counts from the actual registry. Do NOT hardcode counts.
 */
export function computeCategoryStats(items: IconItem[]): CategoryRegistryStats {
  const categoryStats: Record<string, CategoryStatItem> = {};
  let totalAssets = 0;

  for (const catId of CATEGORY_IDS) {
    categoryStats[catId] = {
      id: catId,
      identitiesCount: 0,
      assetsCount: 0,
    };
  }

  let uncategorizedCount = 0;
  let needsReviewCount = 0;

  for (const item of items) {
    const assetCount = item.assets && item.assets.length > 0 ? item.assets.length : 1;
    totalAssets += assetCount;

    // Determine category membership
    const cats: string[] = Array.isArray(item.categories) && item.categories.length > 0
      ? item.categories
      : (item.category ? [item.category] : ['uncategorized']);

    if (item.primaryCategory === 'uncategorized' || cats.includes('uncategorized')) {
      uncategorizedCount++;
    }
    if (item.primaryCategory === 'needs-review' || cats.includes('needs-review')) {
      needsReviewCount++;
    }

    // Update counts for each category this item belongs to
    for (const cat of cats) {
      if (!categoryStats[cat]) {
        categoryStats[cat] = {
          id: cat,
          identitiesCount: 0,
          assetsCount: 0,
        };
      }
      categoryStats[cat].identitiesCount++;
      categoryStats[cat].assetsCount += assetCount;
    }

    // 'all' aggregates everything
    categoryStats['all'].identitiesCount++;
    categoryStats['all'].assetsCount += assetCount;
  }

  return {
    totalIdentities: items.length,
    totalAssets,
    categoryStats,
    uncategorizedCount,
    needsReviewCount,
  };
}

/**
 * Filters icons by category membership (multi-category aware)
 */
export function filterIconsByCategory(items: IconItem[], categoryId: string): IconItem[] {
  if (!categoryId || categoryId === 'all') {
    return items;
  }

  return items.filter(item => {
    if (item.primaryCategory === categoryId) return true;
    if (Array.isArray(item.categories) && item.categories.includes(categoryId)) return true;
    if (item.category === categoryId) return true;
    return false;
  });
}

/**
 * Filters concrete assets by category membership
 */
export function filterAssetsByCategory(assets: ConcreteAssetItem[], categoryId: string): ConcreteAssetItem[] {
  if (!categoryId || categoryId === 'all') {
    return assets;
  }

  return assets.filter(asset => {
    if (asset.primaryCategory === categoryId) return true;
    if (Array.isArray(asset.categories) && asset.categories.includes(categoryId)) return true;
    if (asset.category === categoryId) return true;
    return false;
  });
}
