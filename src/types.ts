export type IconCategory =
  | 'all'
  | 'mainstream'
  | 'bigtech'
  | 'ai'
  | 'frontend'
  | 'languages'
  | 'cloud'
  | 'tools'
  | 'social';

export type IconSource = 'all' | 'simple-icons' | 'devicon' | 'official' | 'wikimedia' | 'svg-logos';

export type VerificationStatus = 'all' | 'verified' | 'warning' | 'conflict' | 'unresolved' | 'invalid';

export type SourcePolicy = 'brand' | 'technology' | 'monochrome' | 'official';

export type PresentationMode = 'raw' | 'preview-dark' | 'preview-light' | 'derived-currentColor';

export interface AlternativeSource {
  source: IconSource;
  sourceId: string;
  sourceVersion: string;
  variants?: string[];
  license?: string;
  sourceUrl?: string;
}

export interface IconRecord {
  id: string;
  title: string;
  canonicalName: string;
  source: 'simple-icons' | 'devicon' | 'official' | 'wikimedia' | 'svg-logos';
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
  category: string;
  xmlValid: boolean;
  sourceTrusted: boolean;
  canonicalResolved: boolean;
  integrityVerified: boolean;
  renderable: boolean;
  verificationStatus: 'verified' | 'warning' | 'conflict' | 'unresolved' | 'invalid';
  verified: boolean;
  alternativeSources?: AlternativeSource[];
  conflicts?: string[];
  notes?: string;
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
  source: 'simple-icons' | 'devicon' | 'official' | 'wikimedia' | 'svg-logos';
  sourceVersion: string;
  sourceId: string;
  sha256: string;
  variant: string;
  variants: Record<string, string>;
  license?: string;
  sourceUrl?: string;
  alternativeSources?: AlternativeSource[];
  xmlValid: boolean;
  sourceTrusted: boolean;
  canonicalResolved: boolean;
  integrityVerified: boolean;
  renderable: boolean;
  verificationStatus: 'verified' | 'warning' | 'conflict' | 'unresolved' | 'invalid';
  verified: boolean;
  conflicts?: string[];
  notes?: string;
}

export type ScriptType = 'sync' | 'nodejs' | 'python' | 'bash';

export interface ScriptOptions {
  outDir: string;
  policy: SourcePolicy;
  scope: 'mainstream' | 'selected' | 'all';
  prefix: string;
  registry: boolean;
}
