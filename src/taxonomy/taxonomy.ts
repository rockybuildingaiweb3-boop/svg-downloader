/**
 * Language-neutral Category Taxonomy Definitions & Hierarchical Structure (Phase 6)
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
  domain?: 'technology' | 'consumer' | 'business' | 'system';
}

export interface TaxonomyDomain {
  id: 'technology' | 'consumer' | 'business' | 'system';
  categories: StandardCategoryId[];
}

export const TAXONOMY_DOMAINS: TaxonomyDomain[] = [
  {
    id: 'technology',
    categories: ['technology', 'developer-tools', 'cloud', 'databases', 'infrastructure', 'security', 'ai'],
  },
  {
    id: 'consumer',
    categories: ['apps', 'social', 'media', 'gaming', 'communication', 'productivity', 'design'],
  },
  {
    id: 'business',
    categories: ['brands', 'web3'],
  },
  {
    id: 'system',
    categories: ['uncategorized', 'needs-review'],
  },
];

export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  { id: 'all', iconName: 'Layers' },
  { id: 'brands', iconName: 'Building2', domain: 'business' },
  { id: 'technology', iconName: 'Cpu', domain: 'technology' },
  { id: 'developer-tools', iconName: 'Wrench', domain: 'technology' },
  { id: 'cloud', iconName: 'Cloud', domain: 'technology' },
  { id: 'databases', iconName: 'Database', domain: 'technology' },
  { id: 'ai', iconName: 'Bot', domain: 'technology' },
  { id: 'web3', iconName: 'Coins', domain: 'business' },
  { id: 'apps', iconName: 'Smartphone', domain: 'consumer' },
  { id: 'social', iconName: 'Share2', domain: 'consumer' },
  { id: 'design', iconName: 'Palette', domain: 'consumer' },
  { id: 'gaming', iconName: 'Gamepad2', domain: 'consumer' },
  { id: 'infrastructure', iconName: 'Server', domain: 'technology' },
  { id: 'security', iconName: 'ShieldCheck', domain: 'technology' },
  { id: 'productivity', iconName: 'CheckSquare', domain: 'consumer' },
  { id: 'media', iconName: 'Film', domain: 'consumer' },
  { id: 'communication', iconName: 'MessageSquare', domain: 'consumer' },
  { id: 'uncategorized', iconName: 'HelpCircle', domain: 'system' },
  { id: 'needs-review', iconName: 'AlertCircle', domain: 'system' },
];

export interface MultiCategoryMetadata {
  primaryCategory: string;
  categories: string[];
  categorySource: 'curated' | 'derived' | 'source' | 'fallback';
  categoryConfidence: number;
  categoryEvidence?: string[];
}
