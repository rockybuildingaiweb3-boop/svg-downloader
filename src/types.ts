export type IconCategory =
  | 'all'
  | 'bigtech'
  | 'ai'
  | 'frontend'
  | 'languages'
  | 'cloud'
  | 'tools'
  | 'social';

export type IconSource = 'all' | 'simple-icons' | 'devicon' | 'official-archive';

export type ColorMode = 'brand' | 'currentColor' | 'mono-dark' | 'mono-light';

export interface IconItem {
  slug: string;
  fileName: string;
  title: string;
  category: string;
  hex: string;
  svg: string;
  source?: 'simple-icons' | 'devicon' | 'official-archive';
  sha256?: string;
  variant?: string;
}

export type ScriptType = 'sync' | 'nodejs' | 'python' | 'bash';

export interface ScriptOptions {
  outDir: string;
  colorMode: 'brand' | 'currentColor' | 'mono' | 'raw';
  source: 'both' | 'simple' | 'devicon';
  scope: 'mainstream' | 'selected' | 'all';
  prefix: string;
  registry: boolean;
}

