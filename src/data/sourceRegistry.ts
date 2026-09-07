import sourcesConfig from '../../config/sources.json';
import type { SourceProvider } from '../types';

/**
 * ============================================================================
 * Canonical Source Registry (Single Source of Truth)
 * Requirement T0.2 & T0.3: One canonical source registry across the app.
 * ============================================================================
 */

export interface SourceDefinition {
  id: SourceProvider;
  name: string;
  platform: string;
  collection: string;
  adapter: string;
  enabled: boolean;
  version: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  trustPolicy: 'trusted' | 'community';
}

const PLATFORM_MAP: Record<string, string> = {
  'official': 'vendor',
  'simple-icons': 'simple-icons',
  'devicon': 'devicon',
  'svg-logos': 'iconify',
  'wikimedia': 'wikimedia'
};

export const CANONICAL_SOURCES: SourceDefinition[] = (sourcesConfig.sources || []).map((s: any) => ({
  id: (s.id === 'iconify' ? 'svg-logos' : s.id) as SourceProvider,
  name: s.name,
  platform: PLATFORM_MAP[s.id] || s.id,
  collection: s.collection || (s.id === 'svg-logos' ? 'logos' : s.id),
  adapter: s.adapter || s.id,
  enabled: s.enabled ?? true,
  version: s.version || '1.0.0',
  license: s.license,
  licenseUrl: s.licenseUrl,
  sourceUrl: s.sourceUrl,
  trustPolicy: s.trustPolicy || 'trusted'
}));

export const ENABLED_SOURCES: SourceDefinition[] = CANONICAL_SOURCES.filter(s => s.enabled);

export const SOURCE_IDS = ENABLED_SOURCES.map(s => s.id);

export const SOURCE_MAP: Record<string, SourceDefinition> = CANONICAL_SOURCES.reduce((acc, s) => {
  acc[s.id] = s;
  return acc;
}, {} as Record<string, SourceDefinition>);

export function getSourceDefinition(providerId: string): SourceDefinition | undefined {
  const norm = providerId === 'iconify' ? 'svg-logos' : providerId;
  return SOURCE_MAP[norm];
}

export function getSemanticProviderName(providerId: string): string {
  const def = getSourceDefinition(providerId);
  return def ? def.name : providerId;
}

export function isValidSourceProvider(id: string): id is SourceProvider {
  return Boolean(SOURCE_MAP[id]);
}
