export type IconCategory =
  | 'all'
  | 'bigtech'
  | 'ai'
  | 'frontend'
  | 'languages'
  | 'cloud'
  | 'tools'
  | 'social';

export type IconSource = 'all' | 'simple-icons' | 'devicon' | 'official' | 'wikimedia';

export type ColorMode = 'brand' | 'raw' | 'currentColor' | 'mono-dark' | 'mono-light';

export interface AlternativeSource {
  source: string;
  sourceId: string;
  sourceVersion: string;
  variants?: string[];
}

export interface IconRecord {
  id: string;
  title: string;
  canonicalName: string;
  source: 'simple-icons' | 'devicon' | 'official' | 'wikimedia';
  sourceId: string;
  sourceVersion: string;
  variant: string;
  variants?: Record<string, string>;
  file: string;
  rawSha256: string;
  derivedSha256?: string;
  license?: string;
  sourceUrl?: string;
  brandColor?: string;
  category?: string;
  verified: boolean;
  alternativeSources?: AlternativeSource[];
}

/**
 * UI Component representation mapped from canonical IconRecord
 */
export interface IconItem {
  id: string;
  slug: string;
  fileName: string;
  title: string;
  category: string;
  hex: string;
  svg?: string;
  source: 'simple-icons' | 'devicon' | 'official' | 'wikimedia';
  sourceVersion: string;
  sourceId: string;
  sha256: string;
  variant: string;
  variants?: Record<string, string>;
  license?: string;
  sourceUrl?: string;
  alternativeSources?: AlternativeSource[];
  verified: boolean;
}

export type ScriptType = 'sync' | 'nodejs' | 'python' | 'bash';

export interface ScriptOptions {
  outDir: string;
  colorMode: 'raw' | 'brand' | 'currentColor' | 'mono';
  source: 'both' | 'simple' | 'devicon';
  scope: 'mainstream' | 'selected' | 'all';
  prefix: string;
  registry: boolean;
}
