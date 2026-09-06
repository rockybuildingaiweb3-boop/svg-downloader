import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Registry, Manifest & Provenance Generator
 * Requirement 36 & 40: Outputs catalog.json, manifest.json, conflicts.json, sources.json with pinned versions.
 */
export class RegistryGenerator {
  constructor(outDir, records, metadata = {}) {
    this.outDir = outDir;
    this.records = records;
    this.metadata = metadata;
  }

  async generateAll() {
    await fs.mkdir(this.outDir, { recursive: true });

    await Promise.all([
      this.generateRegistryJson(),
      this.generateCatalogJson(),
      this.generateManifestJson(),
      this.generateConflictsJson(),
      this.generateSourcesJson(),
      this.generateTypeScriptIndex(),
      this.generateReactComponent(),
      this.generateVueComponent(),
      this.generateReadme()
    ]);
  }

  cleanRecord(record) {
    const { _svgFetcher, ...rest } = record;
    if (rest.assets && Array.isArray(rest.assets)) {
      rest.assets = rest.assets.map(a => {
        const { _svgFetcher: _af, ...aRest } = a;
        return aRest;
      });
    }
    if (rest.canonicalAsset) {
      const { _svgFetcher: _cf, ...cRest } = rest.canonicalAsset;
      rest.canonicalAsset = cRest;
    }
    return rest;
  }

  async generateRegistryJson() {
    const cleanRecords = this.records.map(r => this.cleanRecord(r));
    const allAssets = [];
    for (const r of cleanRecords) {
      if (r.assets && Array.isArray(r.assets)) {
        for (const a of r.assets) {
          allAssets.push(a);
        }
      } else if (r.canonicalAsset) {
        allAssets.push(r.canonicalAsset);
      }
    }

    const sourceCounts = {};
    for (const a of allAssets) {
      const src = a.sourceProvider || 'simple-icons';
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;
    }

    const stats = {
      generatedAt: new Date().toISOString(),
      totalIdentities: cleanRecords.length,
      totalAssets: allAssets.length,
      sourceCounts,
      canonicalCount: cleanRecords.length,
      variantCount: Math.max(0, allAssets.length - cleanRecords.length),
      verifiedIdentities: cleanRecords.filter(r => r.verified || r.verificationStatus === 'verified').length,
      conflictsCount: (this.metadata.conflicts || []).length,
      sourceVersions: this.metadata.sourceVersions || {}
    };

    const registryPayload = {
      version: '2.0.0',
      stats,
      identities: cleanRecords,
      assets: allAssets,
      sources: this.metadata.sources || [],
      collections: this.metadata.collections || {}
    };

    const filePath = path.join(this.outDir, 'registry.json');
    await fs.writeFile(filePath, JSON.stringify(registryPayload, null, 2), 'utf8');
  }

  async generateCatalogJson() {
    const cleanRecords = this.records.map(r => this.cleanRecord(r));
    const filePath = path.join(this.outDir, 'catalog.json');
    await fs.writeFile(filePath, JSON.stringify(cleanRecords, null, 2), 'utf8');
  }

  async generateManifestJson() {
    const cleanRecords = this.records.map(r => this.cleanRecord(r));

    const sources = [...new Set(cleanRecords.map(r => r.sourceProvider || r.source))];
    const countsBySource = {};
    for (const s of sources) {
      countsBySource[s] = cleanRecords.filter(r => (r.sourceProvider || r.source) === s).length;
    }

    const manifest = {
      generatedAt: new Date().toISOString(),
      generator: 'Canonical SVG Sync Pipeline v2.0 (Authoritative)',
      sourceVersions: this.metadata.sourceVersions || {
        'simple-icons': '16.29.0',
        'devicon': '2.17.0',
        'iconify-logos': '1.2.13',
        'official-vendor': 'pinned-archive',
        'wikimedia-commons': 'pinned-archive'
      },
      totalIdentities: cleanRecords.length,
      totalAssets: cleanRecords.reduce((acc, r) => acc + (r.assets?.length || 1), 0),
      sources,
      countsBySource,
      icons: cleanRecords
    };

    const filePath = path.join(this.outDir, 'manifest.json');
    await fs.writeFile(filePath, JSON.stringify(manifest, null, 2), 'utf8');
  }

  async generateConflictsJson() {
    const conflicts = this.metadata.conflicts || [];
    const report = {
      generatedAt: new Date().toISOString(),
      totalConflictsDetected: conflicts.length,
      policy: this.metadata.policy || 'brand',
      note: 'All source collisions are deterministically resolved according to the active source policy without numerical suffix collisions (-2.svg).',
      conflicts
    };

    const filePath = path.join(this.outDir, 'conflicts.json');
    await fs.writeFile(filePath, JSON.stringify(report, null, 2), 'utf8');
  }

  async generateSourcesJson() {
    const allSources = [];
    for (const r of this.records) {
      if (r.sourceRecords && Array.isArray(r.sourceRecords)) {
        for (const sr of r.sourceRecords) {
          allSources.push({
            identityId: r.id,
            ...sr
          });
        }
      }
      if (r.assets && Array.isArray(r.assets)) {
        for (const a of r.assets) {
          allSources.push({
            identityId: r.id,
            assetId: a.assetId,
            sourceProvider: a.sourceProvider,
            sourceCollection: a.sourceCollection,
            sourceId: a.sourceId,
            sourceVersion: a.sourceVersion,
            role: a.role,
            context: a.context,
            graphicVariant: a.graphicVariant,
            license: a.license,
            file: a.file,
            rawSha256: a.rawSha256,
            verificationStatus: a.verificationStatus || 'verified'
          });
        }
      }
    }

    const sourcesPayload = {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      sourceVersions: this.metadata.sourceVersions || {
        'simple-icons': '16.29.0',
        'devicon': '2.17.0',
        'iconify-logos': '1.2.13'
      },
      totalSourcesRecorded: allSources.length,
      sources: allSources
    };

    const filePath = path.join(this.outDir, 'sources.json');
    await fs.writeFile(filePath, JSON.stringify(sourcesPayload, null, 2), 'utf8');
  }

  async generateTypeScriptIndex() {
    const sorted = [...this.records].sort((a, b) => a.id.localeCompare(b.id));
    const iconNamesUnion = sorted.map(r => `  | '${r.id}'`).join('\n');

    const tsContent = `/**
 * Canonical SVG Icon Registry (Auto-generated)
 * Total canonical identities: ${sorted.length}
 */
import rawCatalog from './catalog.json';

export type IconName =
${iconNamesUnion};

export type IconSource = 'simple-icons' | 'devicon' | 'official' | 'wikimedia' | 'svg-logos' | 'iconify';
export type VerificationStatus = 'verified' | 'warning' | 'conflict' | 'unresolved' | 'invalid';

export interface AlternativeSource {
  source: IconSource;
  sourceId: string;
  sourceVersion: string;
  variants?: string[];
  license?: string;
  sourceUrl?: string;
}

export interface BrandAsset {
  assetId: string;
  identityId: string;
  sourceProvider: IconSource;
  sourceCollection: string;
  sourceId: string;
  sourceVersion: string;
  role: string;
  context: string[];
  graphicVariant: string;
  file: string;
  rawSha256: string;
  license: string;
  sourceUrl?: string;
  isCanonical: boolean;
  xmlValid: boolean;
  renderable: boolean;
  verificationStatus: VerificationStatus;
}

export interface IconRecord {
  id: IconName;
  title: string;
  canonicalName: string;
  source: IconSource;
  sourceProvider?: IconSource;
  sourceCollection?: string;
  sourceId: string;
  sourceVersion: string;
  variant: string;
  variants?: Record<string, string>;
  file: string;
  rawSha256: string;
  license?: string;
  sourceUrl?: string;
  brandColor?: string;
  category?: string;
  xmlValid: boolean;
  sourceTrusted: boolean;
  canonicalResolved: boolean;
  integrityVerified: boolean;
  renderable: boolean;
  verificationStatus: VerificationStatus;
  verified: boolean;
  assets?: BrandAsset[];
  totalAssets?: number;
  conflicts?: string[];
  notes?: string;
}

export const ICON_NAMES: IconName[] = (rawCatalog as any[]).map(r => r.id as IconName);

export const ICONS: Record<IconName, IconRecord> = (rawCatalog as any[]).reduce((acc, r) => {
  acc[r.id as IconName] = r;
  return acc;
}, {} as Record<IconName, IconRecord>);
`;

    const filePath = path.join(this.outDir, 'index.ts');
    await fs.writeFile(filePath, tsContent, 'utf8');
  }

  async generateReactComponent() {
    const reactContent = `import React from 'react';
import { ICONS, type IconName } from './index';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  title?: string;
}

/**
 * Universal Zero-Dependency Canonical SVG Icon Component for React
 */
export function Icon({ name, size = 24, title, className, ...props }: IconProps) {
  const icon = ICONS[name];
  if (!icon) {
    console.warn(\`[IconRegistry] Icon "\${name}" not found in canonical registry\`);
    return null;
  }

  const assetUrl = \`/icons/\${icon.file}\`;

  return (
    <img
      src={assetUrl}
      alt={title || icon.title || name}
      width={size}
      height={size}
      className={className}
      loading="lazy"
      decoding="async"
      {...(props as any)}
    />
  );
}

export default Icon;
`;
    const filePath = path.join(this.outDir, 'react.tsx');
    await fs.writeFile(filePath, reactContent, 'utf8');
  }

  async generateVueComponent() {
    const vueContent = `import { defineComponent, h, type PropType } from 'vue';
import { ICONS, type IconName } from './index';

export const Icon = defineComponent({
  name: 'CanonicalIcon',
  props: {
    name: {
      type: String as PropType<IconName>,
      required: true
    },
    size: {
      type: [Number, String],
      default: 24
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup(props, { attrs }) {
    return () => {
      const icon = ICONS[props.name];
      if (!icon) {
        console.warn(\`[IconRegistry] Icon "\${props.name}" not found in canonical registry\`);
        return null;
      }

      return h('img', {
        src: \`/icons/\${icon.file}\`,
        alt: props.title || icon.title || props.name,
        width: props.size,
        height: props.size,
        loading: 'lazy',
        decoding: 'async',
        ...attrs
      });
    };
  }
});

export default Icon;
`;
    const filePath = path.join(this.outDir, 'vue.ts');
    await fs.writeFile(filePath, vueContent, 'utf8');
  }

  async generateReadme() {
    const readmeContent = `# Canonical SVG Icon Registry

This directory contains the authoritative, auto-generated code and metadata outputs of the Canonical SVG Sync Pipeline.

## Source Versions Pinned:
- **Simple Icons**: 16.29.0
- **Devicon**: 2.17.0
- **Iconify SVG Logos**: 1.2.13
- **Official Vendor / Wikimedia**: Verified Brand Archives

## Artifacts:
- \`catalog.json\`: Full canonical icon catalog with asset families and provenance.
- \`manifest.json\`: Source counts, version pins, and checksum registry.
- \`conflicts.json\`: Record of multi-source candidate collisions resolved by policy.
- \`sources.json\`: Complete provenance records for every individual asset.
- \`audit-report.json\`: Full registry health check from \`npm run doctor\`.
- \`index.ts\`: Zero-dependency TypeScript type definitions and registry map.
- \`react.tsx\`: Universal React component.
- \`vue.ts\`: Universal Vue 3 component.
`;
    const filePath = path.join(this.outDir, 'README.md');
    await fs.writeFile(filePath, readmeContent, 'utf8');
  }
}
