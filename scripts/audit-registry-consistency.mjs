/**
 * Automated Registry Consistency Audit (Phase 32)
 *
 * Verifies:
 * 1. generated/registry.json and public/registry.json exist and are in sync.
 * 2. generated/statistics.json matches generated/registry.json counts.
 * 3. generated/build-metadata.json and public/build-metadata.json exist and match.
 * 4. Zero occurrences of stale/hardcoded values (8,052 / 8052, sourceCoverageChecked || 5, etc.) in src/.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let hasErrors = false;

function fail(msg) {
  console.error(`❌ FAIL: ${msg}`);
  hasErrors = true;
}

function pass(msg) {
  console.log(`✅ PASS: ${msg}`);
}

console.log('🔍 Running Registry Consistency Audit...\n');

// 1. Check generated/registry.json
const genRegPath = path.join(rootDir, 'generated', 'registry.json');
if (!fs.existsSync(genRegPath)) {
  fail('generated/registry.json does not exist');
  process.exit(1);
}
const genReg = JSON.parse(fs.readFileSync(genRegPath, 'utf8'));
const genIdentitiesCount = genReg.stats?.totalIdentities ?? genReg.identities?.length;
const genAssetsCount = genReg.stats?.totalAssets ?? genReg.assets?.length;

pass(`generated/registry.json loaded (${genIdentitiesCount} identities, ${genAssetsCount} assets)`);

// 2. Check public/registry.json
const pubRegPath = path.join(rootDir, 'public', 'registry.json');
if (!fs.existsSync(pubRegPath)) {
  fail('public/registry.json does not exist');
} else {
  const pubReg = JSON.parse(fs.readFileSync(pubRegPath, 'utf8'));
  const pubIdentitiesCount = pubReg.stats?.totalIdentities ?? pubReg.identities?.length;
  const pubAssetsCount = pubReg.stats?.totalAssets ?? pubReg.assets?.length;

  if (pubIdentitiesCount !== genIdentitiesCount) {
    fail(`public/registry.json identities (${pubIdentitiesCount}) does not match generated (${genIdentitiesCount})`);
  } else if (pubAssetsCount !== genAssetsCount) {
    fail(`public/registry.json assets (${pubAssetsCount}) does not match generated (${genAssetsCount})`);
  } else {
    pass(`public/registry.json in sync with generated/registry.json (${pubIdentitiesCount} identities, ${pubAssetsCount} assets)`);
  }
}

// 3. Check generated/statistics.json
const genStatsPath = path.join(rootDir, 'generated', 'statistics.json');
if (!fs.existsSync(genStatsPath)) {
  fail('generated/statistics.json does not exist');
} else {
  const genStats = JSON.parse(fs.readFileSync(genStatsPath, 'utf8'));
  if (genStats.totalIdentities !== genIdentitiesCount) {
    fail(`generated/statistics.json identities (${genStats.totalIdentities}) does not match generated/registry.json (${genIdentitiesCount})`);
  } else if (genStats.totalAssets !== genAssetsCount) {
    fail(`generated/statistics.json assets (${genStats.totalAssets}) does not match generated/registry.json (${genAssetsCount})`);
  } else {
    pass(`generated/statistics.json matches registry stats (${genStats.totalIdentities} identities, ${genStats.totalAssets} assets)`);
  }
}

// 4. Check build-metadata.json
const genMetaPath = path.join(rootDir, 'generated', 'build-metadata.json');
const pubMetaPath = path.join(rootDir, 'public', 'build-metadata.json');
if (!fs.existsSync(genMetaPath)) {
  fail('generated/build-metadata.json does not exist');
} else if (!fs.existsSync(pubMetaPath)) {
  fail('public/build-metadata.json does not exist');
} else {
  const genMeta = JSON.parse(fs.readFileSync(genMetaPath, 'utf8'));
  const pubMeta = JSON.parse(fs.readFileSync(pubMetaPath, 'utf8'));

  if (genMeta.totalIdentities !== genIdentitiesCount || genMeta.totalAssets !== genAssetsCount) {
    fail(`generated/build-metadata.json counts (${genMeta.totalIdentities} / ${genMeta.totalAssets}) mismatch registry (${genIdentitiesCount} / ${genAssetsCount})`);
  } else if (pubMeta.totalIdentities !== genIdentitiesCount || pubMeta.totalAssets !== genAssetsCount) {
    fail(`public/build-metadata.json counts mismatch registry`);
  } else {
    pass(`Build metadata verified across generated/ and public/ (commit: ${genMeta.gitCommit.slice(0, 8)})`);
  }
}

// 5. Scan src/ for forbidden patterns
const FORBIDDEN_PATTERNS = [
  { pattern: /8[,.]?052/, label: 'Stale asset count 8052' },
  { pattern: /sourceCoverageChecked\s*\|\|\s*5/, label: 'Hardcoded coverage fallback || 5' },
  { pattern: /category\s*\|\|\s*['"]bigtech['"]/, label: 'Legacy category fallback bigtech' }
];

const srcDir = path.join(rootDir, 'src');
function walk(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(full));
    } else if (/\.(tsx?|jsx?|json|css)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const srcFiles = walk(srcDir);
let forbiddenFound = 0;

for (const file of srcFiles) {
  // Ignore build-metadata.json imports
  const content = fs.readFileSync(file, 'utf8');
  for (const { pattern, label } of FORBIDDEN_PATTERNS) {
    if (pattern.test(content)) {
      fail(`Forbidden pattern [${label}] found in ${path.relative(rootDir, file)}`);
      forbiddenFound++;
    }
  }
}

if (forbiddenFound === 0) {
  pass('src/ scanned: 0 hardcoded stale counts or legacy category fallbacks found');
}

console.log('\n=======================================================================');
if (hasErrors) {
  console.error('❌ REGISTRY CONSISTENCY AUDIT FAILED');
  process.exit(1);
} else {
  console.log('✅ REGISTRY CONSISTENCY AUDIT PASSED: All registry datasets & frontend code are truthful and synchronized.');
}
console.log('=======================================================================\n');
