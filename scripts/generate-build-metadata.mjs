/**
 * Generates build-metadata.json in generated/ and mirrors it to public/
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const registryPath = path.join(rootDir, 'generated', 'registry.json');
if (!fs.existsSync(registryPath)) {
  console.error('Error: generated/registry.json not found');
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

let gitCommit = 'unknown';
try {
  gitCommit = execSync('git rev-parse HEAD', { cwd: rootDir, encoding: 'utf8' }).trim();
} catch (err) {
  gitCommit = 'head';
}

const buildMetadata = {
  registryGeneratedAt: registry.stats?.generatedAt || new Date().toISOString(),
  gitCommit,
  buildId: `prod-${gitCommit.slice(0, 8)}`,
  registryVersion: registry.version || '2.0.0',
  totalIdentities: registry.stats?.totalIdentities ?? (registry.identities ? registry.identities.length : 0),
  totalAssets: registry.stats?.totalAssets ?? (registry.assets ? registry.assets.length : 0),
  totalProviders: registry.stats?.totalProviders ?? (registry.sources ? registry.sources.filter(s => s.enabled !== false).length : 5)
};

const genPath = path.join(rootDir, 'generated', 'build-metadata.json');
const pubPath = path.join(rootDir, 'public', 'build-metadata.json');

fs.writeFileSync(genPath, JSON.stringify(buildMetadata, null, 2) + '\n', 'utf8');
fs.writeFileSync(pubPath, JSON.stringify(buildMetadata, null, 2) + '\n', 'utf8');

console.log(`Generated build metadata:
  Identities: ${buildMetadata.totalIdentities}
  Assets: ${buildMetadata.totalAssets}
  Commit: ${buildMetadata.gitCommit}
  Version: ${buildMetadata.registryVersion}`);
