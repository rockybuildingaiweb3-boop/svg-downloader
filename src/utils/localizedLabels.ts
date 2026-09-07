import type { TranslationDictionary } from '../i18n/types';
import { getSemanticSourceLabel } from '../types';

/**
 * Centralized Enum and Filter Localization Helpers
 * Invariant: Never display raw unlocalized enum strings to users.
 */

/**
 * Returns localized label for an icon category.
 */
export function getLocalizedCategoryLabel(category: string, t: TranslationDictionary): string {
  if (!category) return '';
  if (category === 'all') return t.filters.categories.all || 'All';
  if (t.filters.categories[category]) return t.filters.categories[category]!;
  const camel = category.replace(/-([a-z])/g, (_, g) => g.toUpperCase());
  if (t.filters.categories[camel]) return t.filters.categories[camel]!;
  return category;
}

/**
 * Returns localized label for a source provider or platform.
 */
export function getLocalizedSourceLabel(source: string, t?: TranslationDictionary): string {
  if (!source) return '';
  if (source === 'all') return t?.filters.allSources || 'All Sources';
  return getSemanticSourceLabel(source);
}

/**
 * Returns localized label for a filter status.
 */
export function getLocalizedStatusLabel(status: string, t: TranslationDictionary): string {
  if (!status) return '';
  switch (status) {
    case 'verified':
      return t.card.verified;
    case 'multi-source':
      return t.header.multiSourceBadge;
    case 'unresolved':
      return t.card.unresolved;
    case 'all':
      return t.filters.trustOptions.all || 'All';
    default:
      return status;
  }
}

/**
 * Returns localized label for an asset role.
 */
export function getLocalizedRoleLabel(role: string, t: TranslationDictionary): string {
  if (!role) return '';
  if (role === 'all') return t.filters.roleOptions.all || t.filters.allRoles || 'All Roles';
  return t.filters.roleOptions[role] || role;
}

/**
 * Returns localized label for a usage context.
 */
export function getLocalizedContextLabel(context: string, t: TranslationDictionary): string {
  if (!context) return '';
  if (context === 'all') return t.filters.contextOptions.all || t.filters.allContexts || 'All Contexts';
  return t.filters.contextOptions[context] || context;
}

/**
 * Returns localized label for a graphic variant.
 */
export function getLocalizedVariantLabel(variant: string, t: TranslationDictionary): string {
  if (!variant) return '';
  if (variant === 'all') return t.filters.variantOptions.all || t.filters.allVariants || 'All Variants';
  return t.filters.variantOptions[variant] || variant;
}

/**
 * Returns localized label for a trust state.
 */
export function getLocalizedTrustLabel(trust: string, t: TranslationDictionary): string {
  if (!trust) return '';
  if (trust === 'all') return t.filters.trustOptions.all || t.filters.allTrustStates || 'All States';
  return t.filters.trustOptions[trust] || trust;
}

/**
 * Returns localized label for an entity type.
 */
export function getLocalizedEntityTypeLabel(entityType: string, t: TranslationDictionary): string {
  if (!entityType) return '';
  return t.filters.entityTypes?.[entityType] || entityType;
}
