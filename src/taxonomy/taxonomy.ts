/**
 * Language-neutral Category Taxonomy Definitions
 * Requirement: Category IDs must be language-neutral strings.
 * Categories are metadata and views; they do NOT determine whether an identity exists.
 */

export const CATEGORY_IDS = [
  'all',
  'brands',
  'technology',
  'developer-tools',
  'cloud',
  'databases',
  'ai',
  'web3',
  'apps',
  'social',
  'design',
  'gaming',
  'infrastructure',
  'security',
  'productivity',
  'media',
  'communication',
  'uncategorized',
  'needs-review',
] as const;

export type StandardCategoryId = typeof CATEGORY_IDS[number];

export interface CategoryDefinition {
  id: StandardCategoryId;
  iconName: string;
}

export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  { id: 'all', iconName: 'Layers' },
  { id: 'brands', iconName: 'Building2' },
  { id: 'technology', iconName: 'Cpu' },
  { id: 'developer-tools', iconName: 'Wrench' },
  { id: 'cloud', iconName: 'Cloud' },
  { id: 'databases', iconName: 'Database' },
  { id: 'ai', iconName: 'Bot' },
  { id: 'web3', iconName: 'Coins' },
  { id: 'apps', iconName: 'Smartphone' },
  { id: 'social', iconName: 'Share2' },
  { id: 'design', iconName: 'Palette' },
  { id: 'gaming', iconName: 'Gamepad2' },
  { id: 'infrastructure', iconName: 'Server' },
  { id: 'security', iconName: 'ShieldCheck' },
  { id: 'productivity', iconName: 'CheckSquare' },
  { id: 'media', iconName: 'Film' },
  { id: 'communication', iconName: 'MessageSquare' },
  { id: 'uncategorized', iconName: 'HelpCircle' },
  { id: 'needs-review', iconName: 'AlertCircle' },
];

export interface MultiCategoryMetadata {
  primaryCategory: string;
  categories: string[];
  categorySource: 'curated' | 'derived' | 'source' | 'fallback';
  categoryConfidence: number;
}
