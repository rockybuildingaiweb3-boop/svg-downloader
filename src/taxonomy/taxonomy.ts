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
  if (cat === 'cloud' || cat === 'infrastructure') {
    return 'platform';
  }
  if (cat === 'apps' || ['slack', 'discord', 'telegram', 'whatsapp', 'signal', 'spotify', 'zoom', 'notion', 'figma'].includes(id)) {
    return 'app';
  }
  if (cat === 'brands' || ['apple', 'google', 'microsoft', 'amazon', 'meta', 'tesla', 'nvidia', 'intel', 'amd', 'samsung', 'sony', 'adobe', 'ibm', 'oracle', 'salesforce'].includes(id)) {
    return 'company';
  }
  if (cat === 'developer-tools') {
    return 'tool';
  }
  if (cat === 'social' || cat === 'communication') {
    return 'service';
  }
  if (cat === 'ai') {
    return 'technology';
  }
  if (cat === 'gaming') {
    return 'game';
  }
  return 'technology';
}

