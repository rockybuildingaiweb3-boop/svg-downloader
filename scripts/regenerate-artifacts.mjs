import fs from 'node:fs/promises';
import path from 'node:path';
import { RegistryGenerator } from './lib/registryGenerator.mjs';

const ROOT = process.cwd();
const GENERATED_DIR = path.resolve(ROOT, 'generated');
const PUBLIC_DIR = path.resolve(ROOT, 'public');

async function run() {
  console.log('Reading generated/registry.json...');
  const regContent = await fs.readFile(path.join(GENERATED_DIR, 'registry.json'), 'utf8');
  const reg = JSON.parse(regContent);
  const records = reg.identities || [];
  console.log(`Loaded ${records.length} identities from registry.json`);

  let sourcesConfig = [];
  try {
    const raw = await fs.readFile(path.join(ROOT, 'config', 'sources.json'), 'utf8');
    sourcesConfig = JSON.parse(raw).sources || [];
  } catch (e) {
    console.warn('Could not read config/sources.json:', e.message);
  }

  const metadata = {
    generatedAt: new Date().toISOString(),
    version: '2.0.0',
    sourceVersions: {
      'simple-icons': '16.30.0',
      'devicon': '2.17.0',
      'svg-logos': '1.2.13',
      'official': 'official-vendor',
      'wikimedia': 'commons-archive'
    },
    sources: sourcesConfig,
    policy: 'brand',
    conflicts: reg.conflicts || [],
    collections: reg.collections || {}
  };

  console.log('Instantiating RegistryGenerator and regenerating all artifacts...');
  const generator = new RegistryGenerator(GENERATED_DIR, records, metadata);
  await generator.generateAll();

  // Copy to public/
  const filesToCopy = [
    'catalog.json',
    'registry.json',
    'manifest.json',
    'source-manifest.json',
    'conflicts.json',
    'sources.json',
    'coverage.json',
    'categories.json',
    'statistics.json'
  ];

  for (const file of filesToCopy) {
    await fs.copyFile(path.join(GENERATED_DIR, file), path.join(PUBLIC_DIR, file));
    console.log(`Synchronized ${file} to public/`);
  }

  // Update build-metadata.json
  const { execSync } = await import('child_process');
  let gitCommit = 'unknown';
  try {
    gitCommit = execSync('git rev-parse HEAD', { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {}

  const enabledProvidersCount = sourcesConfig.filter(s => s.enabled !== false).length || 5;

  const buildMeta = {
    registryGeneratedAt: metadata.generatedAt,
    gitCommit,
    buildId: `prod-${gitCommit.slice(0, 8)}`,
    registryVersion: '2.0.0',
    totalIdentities: records.length,
    totalAssets: records.reduce((acc, r) => acc + (r.assets?.length || 0), 0),
    totalProviders: enabledProvidersCount
  };

  await fs.writeFile(path.join(GENERATED_DIR, 'build-metadata.json'), JSON.stringify(buildMeta, null, 2) + '\n', 'utf8');
  await fs.writeFile(path.join(PUBLIC_DIR, 'build-metadata.json'), JSON.stringify(buildMeta, null, 2) + '\n', 'utf8');
  console.log('Synchronized build-metadata.json');

  console.log('✅ All registry artifacts regenerated successfully.');
}

run().catch(err => {
  console.error('Failed to regenerate artifacts:', err);
  process.exit(1);
});
