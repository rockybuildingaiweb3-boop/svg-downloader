import rawCatalog from '../../generated/catalog.json';
import type { IconRecord, IconItem } from '../types';

export const CANONICAL_CATALOG: IconRecord[] = rawCatalog as unknown as IconRecord[];

/**
 * Maps canonical record to UI IconItem
 */
export const CURATED_ICONS: IconItem[] = CANONICAL_CATALOG.map((rec) => {
  return {
    id: rec.id,
    slug: rec.id,
    fileName: rec.file,
    title: rec.title,
    category: rec.category || 'tools',
    hex: (rec.brandColor || '#111827').replace('#', ''),
    source: rec.source,
    sourceVersion: rec.sourceVersion,
    sourceId: rec.sourceId,
    sha256: rec.rawSha256,
    variant: rec.variant,
    variants: rec.variants,
    license: rec.license,
    sourceUrl: rec.sourceUrl,
    alternativeSources: rec.alternativeSources,
    verified: rec.verified
  };
});

export const ICON_MAP: Record<string, IconItem> = CURATED_ICONS.reduce((acc, icon) => {
  acc[icon.slug] = icon;
  return acc;
}, {} as Record<string, IconItem>);
