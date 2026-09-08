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
  categoryId: StandardCategoryId;
  id: StandardCategoryId; // backwards-compatible alias
  domainId: 'technology' | 'consumer' | 'business' | 'system';
  domain?: 'technology' | 'consumer' | 'business' | 'system'; // backwards-compatible alias
  parentId: StandardCategoryId | null;
  labelKey: string;
  order: number;
  iconName: string;
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
  { categoryId: 'all', id: 'all', domainId: 'system', domain: 'system', parentId: null, labelKey: 'filters.categories.all', order: 0, iconName: 'Layers' },
  { categoryId: 'technology', id: 'technology', domainId: 'technology', domain: 'technology', parentId: null, labelKey: 'filters.categories.technology', order: 10, iconName: 'Cpu' },
  { categoryId: 'developer-tools', id: 'developer-tools', domainId: 'technology', domain: 'technology', parentId: 'technology', labelKey: 'filters.categories.developer-tools', order: 20, iconName: 'Wrench' },
  { categoryId: 'cloud', id: 'cloud', domainId: 'technology', domain: 'technology', parentId: 'technology', labelKey: 'filters.categories.cloud', order: 30, iconName: 'Cloud' },
  { categoryId: 'databases', id: 'databases', domainId: 'technology', domain: 'technology', parentId: 'technology', labelKey: 'filters.categories.databases', order: 40, iconName: 'Database' },
  { categoryId: 'ai', id: 'ai', domainId: 'technology', domain: 'technology', parentId: 'technology', labelKey: 'filters.categories.ai', order: 50, iconName: 'Bot' },
  { categoryId: 'infrastructure', id: 'infrastructure', domainId: 'technology', domain: 'technology', parentId: 'technology', labelKey: 'filters.categories.infrastructure', order: 60, iconName: 'Server' },
  { categoryId: 'security', id: 'security', domainId: 'technology', domain: 'technology', parentId: 'technology', labelKey: 'filters.categories.security', order: 70, iconName: 'ShieldCheck' },
  { categoryId: 'apps', id: 'apps', domainId: 'consumer', domain: 'consumer', parentId: null, labelKey: 'filters.categories.apps', order: 100, iconName: 'Smartphone' },
  { categoryId: 'social', id: 'social', domainId: 'consumer', domain: 'consumer', parentId: 'apps', labelKey: 'filters.categories.social', order: 110, iconName: 'Share2' },
  { categoryId: 'design', id: 'design', domainId: 'consumer', domain: 'consumer', parentId: 'apps', labelKey: 'filters.categories.design', order: 120, iconName: 'Palette' },
  { categoryId: 'gaming', id: 'gaming', domainId: 'consumer', domain: 'consumer', parentId: 'apps', labelKey: 'filters.categories.gaming', order: 130, iconName: 'Gamepad2' },
  { categoryId: 'productivity', id: 'productivity', domainId: 'consumer', domain: 'consumer', parentId: 'apps', labelKey: 'filters.categories.productivity', order: 140, iconName: 'CheckSquare' },
  { categoryId: 'media', id: 'media', domainId: 'consumer', domain: 'consumer', parentId: 'apps', labelKey: 'filters.categories.media', order: 150, iconName: 'Film' },
  { categoryId: 'communication', id: 'communication', domainId: 'consumer', domain: 'consumer', parentId: 'apps', labelKey: 'filters.categories.communication', order: 160, iconName: 'MessageSquare' },
  { categoryId: 'brands', id: 'brands', domainId: 'business', domain: 'business', parentId: null, labelKey: 'filters.categories.brands', order: 200, iconName: 'Building2' },
  { categoryId: 'web3', id: 'web3', domainId: 'business', domain: 'business', parentId: 'brands', labelKey: 'filters.categories.web3', order: 210, iconName: 'Coins' },
  { categoryId: 'uncategorized', id: 'uncategorized', domainId: 'system', domain: 'system', parentId: null, labelKey: 'filters.categories.uncategorized', order: 300, iconName: 'HelpCircle' },
  { categoryId: 'needs-review', id: 'needs-review', domainId: 'system', domain: 'system', parentId: null, labelKey: 'filters.categories.needs-review', order: 310, iconName: 'AlertCircle' },
];

export interface MultiCategoryMetadata {
  primaryCategory: string;
  categories: string[];
  categorySource: 'curated' | 'derived' | 'source' | 'fallback';
  categoryConfidence: number;
  categoryEvidence?: string[];
}

import type { EntityType } from '../types';

export function inferEntityType(item: {
  id?: string;
  title?: string;
  primaryCategory?: string;
  category?: string;
  categories?: string[];
  deviconTags?: string[];
  sourceProvider?: string;
}): EntityType {
  const id = (item.id || '').toLowerCase();
  const tags = (item.deviconTags || []).map(t => t.toLowerCase());
  const cat = item.primaryCategory || item.category || '';

  if (tags.includes('framework') || id.endsWith('js') || id.includes('framework')) {
    return 'framework';
  }
  if (
    tags.includes('programming') ||
    tags.includes('language') ||
    ['python', 'rust', 'c', 'cplusplus', 'csharp', 'java', 'typescript', 'javascript', 'go', 'golang', 'ruby', 'php', 'swift', 'kotlin', 'dart', 'scala', 'elixir', 'haskell', 'lua', 'perl', 'r', 'julia'].includes(id)
  ) {
    return 'programming-language';
  }
  if (cat === 'databases' || tags.includes('database') || id.includes('sql') || id.includes('db')) {
    return 'database';
  }
  if (cat === 'web3' || tags.includes('blockchain') || tags.includes('cryptocurrency')) {
    return 'protocol';
  }
  if (['github', 'gitlab', 'aws', 'amazonwebservices', 'googlecloud', 'microsoftazure', 'vercel', 'netlify', 'cloudflare', 'digitalocean', 'heroku'].includes(id)) {
    return 'platform';
  }
  if (['docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'webpack', 'vite', 'esbuild', 'babel', 'git'].includes(id)) {
    return 'tool';
  }
  if (tags.includes('platform') || tags.includes('cloud-platform') || tags.includes('paas') || tags.includes('iaas')) {
    return 'platform';
  }
  if (['slack', 'discord', 'telegram', 'whatsapp', 'signal', 'spotify', 'zoom', 'notion', 'figma'].includes(id)) {
    return 'app';
  }
  if (['apple', 'google', 'microsoft', 'amazon', 'meta', 'tesla', 'nvidia', 'intel', 'amd', 'samsung', 'sony', 'adobe', 'ibm', 'oracle', 'salesforce'].includes(id)) {
    return 'company';
  }
  if (tags.includes('tool') || tags.includes('cli') || tags.includes('linter') || tags.includes('bundler')) {
    return 'tool';
  }
  if (tags.includes('social-network') || tags.includes('chat') || tags.includes('messaging')) {
    return 'service';
  }
  if (tags.includes('game') || tags.includes('gaming')) {
    return 'game';
  }
  return 'unknown';
}

