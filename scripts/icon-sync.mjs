#!/usr/bin/env node

/**
 * ============================================================================
 * Canonical SVG Icon Sync Pipeline (Authoritative Engine)
 * ============================================================================
 * 
 * Supports:
 * - Simple Icons (3450+ official brand vectors, automatically discovered)
 * - Devicon (570+ developer tool vectors with variant modeling)
 * - Controlled Official / Wikimedia fallbacks (e.g. Microsoft 4-color corporate mark)
 * - Deterministic SHA-256 integrity hashing & XML DOM validation
 * - 100% raw canonical assets (NO AI paths, NO regex recoloring, NO -2.svg suffixes)
 * 
 * CLI Modes:
 *   node scripts/icon-sync.mjs                     (Sync mainstream collection by default)
 *   node scripts/icon-sync.mjs --scope mainstream  (Sync mainstream collection)
 *   node scripts/icon-sync.mjs --all               (Sync all discovered icons)
 *   node scripts/icon-sync.mjs apple google react  (Sync custom specified icons)
 *   node scripts/icon-sync.mjs search <term>       (Search canonical catalogs with aliases)
 *   node scripts/icon-sync.mjs verify              (Verify on-disk SVGs and SHA-256 hashes)
 *   node scripts/icon-sync.mjs update              (Re-sync and regenerate registries)
 * ============================================================================
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { IconResolver } from './lib/resolver.mjs';
import { validateSvg } from './lib/validator.mjs';
import { RegistryGenerator } from './lib/registryGenerator.mjs';

const ROOT = process.cwd();
const GENERATED_DIR = path.resolve(ROOT, 'generated');
const GENERATED_ICONS_DIR = path.resolve(GENERATED_DIR, 'icons');
const PUBLIC_ICONS_DIR = path.resolve(ROOT, 'public', 'icons');

async function main() {
  const args = process.argv.slice(2);

  // Command routing
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    return;
  }

  const resolver = new IconResolver(ROOT);
  await resolver.load();

  const command = args[0]?.toLowerCase();

  // Mode: SEARCH
  if (command === 'search') {
    const term = args.slice(1).join(' ').trim();
    if (!term) {
      console.error('Error: Please specify a search query, e.g. "icon-sync search github"');
      process.exit(1);
    }
    handleSearch(resolver, term);
    return;
  }

  // Mode: VERIFY
  if (command === 'verify') {
    await handleVerify(GENERATED_ICONS_DIR);
    return;
  }

  // Determine icons to sync
  let iconsToResolve = [];
  let isAllMode = args.includes('--all') || args.includes('-a');
  let scopeArg = getArgValue(args, '--scope');

  if (isAllMode) {
    console.log('📦 Mode: ALL (Enumerate all Simple Icons & Devicon catalogs)');
    const allSlugs = new Set([
      ...resolver.simpleIcons.getAll().map(i => i.slug),
      ...resolver.devicon.getAll().map(i => i.name),
      ...resolver.official.getAll().map(i => i.slug)
    ]);
    iconsToResolve = Array.from(allSlugs);
  } else if (scopeArg === 'mainstream' || (!scopeArg && args.filter(a => !a.startsWith('-')).length === 0) || command === 'update') {
    console.log('📦 Mode: MAINSTREAM (Curated high-priority industry icons)');
    iconsToResolve = resolver.collections.mainstream || [];
  } else {
    // Custom positional icons or --scope list
    const customList = args
      .filter(a => !a.startsWith('-') && a !== 'sync')
      .flatMap(a => a.split(','))
      .map(s => s.trim())
      .filter(Boolean);

    if (customList.length > 0) {
      console.log(`📦 Mode: CUSTOM (${customList.length} specified icons)`);
      iconsToResolve = customList;
    } else {
      iconsToResolve = resolver.collections.mainstream || [];
    }
  }

  console.log(`🚀 Starting Canonical SVG Icon Sync Pipeline...`);
  console.log(`- Simple Icons version: ${resolver.simpleIcons.version} (${resolver.simpleIcons.count()} icons available)`);
  console.log(`- Devicon version:      ${resolver.devicon.version} (${resolver.devicon.count()} icons available)`);
  console.log(`- Official/Wikimedia:   ${resolver.official.count()} fallback icons available\n`);

  await fs.mkdir(GENERATED_ICONS_DIR, { recursive: true });
  await fs.mkdir(PUBLIC_ICONS_DIR, { recursive: true });

  const resolvedRecords = [];
  const failures = [];
  const warnings = [];
  const processedIdentities = new Set();

  console.log('STATUS   CANONICAL ID      SOURCE         FILE           INFO');
  console.log('-----------------------------------------------------------------------');

  for (const query of iconsToResolve) {
    const record = await resolver.resolveIcon(query);

    if (!record) {
      console.log(`FAILED   ${query.padEnd(17)} [UNRESOLVED]  -              No trusted canonical SVG source found`);
      failures.push({ id: query, error: 'Unresolved in all trusted catalogs' });
      continue;
    }

    if (processedIdentities.has(record.id)) {
      continue; // Skip duplicates in input query
    }
    processedIdentities.add(record.id);

    try {
      const rawSvg = await record._svgFetcher();
      if (!rawSvg) {
        throw new Error('Could not retrieve raw SVG content');
      }

      // XML Validation
      const valResult = validateSvg(rawSvg, record.id);
      if (valResult.status === 'FAILED') {
        console.log(`FAILED   ${record.id.padEnd(17)} ${record.source.padEnd(14)} ${record.file.padEnd(14)} ${valResult.message}`);
        failures.push({ id: record.id, error: valResult.message });
        continue;
      }

      // Record deterministic raw SHA-256
      record.rawSha256 = valResult.sha256;

      if (valResult.status === 'WARNING') {
        console.log(`WARNING  ${record.id.padEnd(17)} ${record.source.padEnd(14)} ${record.file.padEnd(14)} ${valResult.message}`);
        warnings.push({ id: record.id, message: valResult.message });
      } else {
        console.log(`VALID    ${record.id.padEnd(17)} ${record.source.padEnd(14)} ${record.file.padEnd(14)} ${record.title}`);
      }

      // Write strictly raw canonical SVG without modification
      const genPath = path.join(GENERATED_ICONS_DIR, record.file);
      const pubPath = path.join(PUBLIC_ICONS_DIR, record.file);
      await fs.writeFile(genPath, rawSvg, 'utf8');
      await fs.writeFile(pubPath, rawSvg, 'utf8');

      resolvedRecords.push(record);
    } catch (err) {
      console.log(`FAILED   ${record.id.padEnd(17)} ${record.source.padEnd(14)} ${record.file.padEnd(14)} ${err.message}`);
      failures.push({ id: record.id, error: err.message });
    }
  }

  // Clean legacy -2.svg and stale files from public/icons
  await cleanLegacyFiles(PUBLIC_ICONS_DIR, resolvedRecords);

  // Generate Registries, Manifest, and Catalog
  const metadata = {
    sourceVersions: {
      'simple-icons': resolver.simpleIcons.version,
      'devicon': resolver.devicon.version,
      'official': 'official-vendor'
    },
    conflicts: resolver.conflicts
  };

  const generator = new RegistryGenerator(GENERATED_DIR, resolvedRecords, metadata);
  await generator.generateAll();

  // Also copy catalog.json and manifest.json to public/ for web app runtime
  await fs.copyFile(
    path.join(GENERATED_DIR, 'catalog.json'),
    path.join(ROOT, 'public', 'catalog.json')
  );
  await fs.copyFile(
    path.join(GENERATED_DIR, 'manifest.json'),
    path.join(ROOT, 'public', 'manifest.json')
  );

  console.log('\n=======================================================================');
  console.log(`✨ Sync Complete!`);
  console.log(`- Canonical icons resolved: ${resolvedRecords.length}`);
  console.log(`- Validated successfully:   ${resolvedRecords.length}`);
  console.log(`- Warnings noted:           ${warnings.length}`);
  console.log(`- Failures:                 ${failures.length}`);
  console.log(`- Conflicts resolved:       ${resolver.conflicts.length}`);
  console.log(`\nGenerated Artifacts:`);
  console.log(`- Canonical SVGs:   ${path.relative(ROOT, GENERATED_ICONS_DIR)}/`);
  console.log(`- Public SVGs:      ${path.relative(ROOT, PUBLIC_ICONS_DIR)}/`);
  console.log(`- Catalog:          ${path.relative(ROOT, path.join(GENERATED_DIR, 'catalog.json'))}`);
  console.log(`- Manifest:         ${path.relative(ROOT, path.join(GENERATED_DIR, 'manifest.json'))}`);
  console.log(`- Conflicts Report: ${path.relative(ROOT, path.join(GENERATED_DIR, 'conflicts.json'))}`);
  console.log(`- TypeScript types: ${path.relative(ROOT, path.join(GENERATED_DIR, 'index.ts'))}`);
  console.log(`- React Component:  ${path.relative(ROOT, path.join(GENERATED_DIR, 'react.tsx'))}`);
  console.log(`- Vue Component:    ${path.relative(ROOT, path.join(GENERATED_DIR, 'vue.ts'))}`);
  console.log('=======================================================================\n');

  if (failures.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

async function cleanLegacyFiles(dir, activeRecords) {
  try {
    const activeFiles = new Set(activeRecords.map(r => r.file));
    const files = await fs.readdir(dir);
    let removedCount = 0;
    for (const f of files) {
      // Remove any file ending in -2.svg, -3.svg etc.
      if (f.match(/-\d+\.svg$/)) {
        await fs.unlink(path.join(dir, f));
        removedCount++;
      }
    }
    if (removedCount > 0) {
      console.log(`\n🧹 Cleaned up ${removedCount} legacy duplicate suffix files (-2.svg)`);
    }
  } catch {}
}

function handleSearch(resolver, query) {
  console.log(`\n🔍 Searching canonical catalogs for "${query}"...\n`);
  const results = resolver.search(query);
  if (results.length === 0) {
    console.log(`No matching icons found for "${query}".`);
    return;
  }

  console.log(`Found ${results.length} matches:`);
  console.log('ID / SLUG             SOURCE         MATCH TYPE');
  console.log('------------------------------------------------------------');
  for (const r of results.slice(0, 30)) {
    console.log(`${r.id.padEnd(21)} ${r.source.padEnd(14)} ${r.matchType}`);
  }
  if (results.length > 30) {
    console.log(`... and ${results.length - 30} more.`);
  }
  console.log('');
}

async function handleVerify(iconsDir) {
  console.log(`\n🔍 Verifying SVG files in ${iconsDir}...\n`);
  try {
    const files = await fs.readdir(iconsDir);
    const svgFiles = files.filter(f => f.endsWith('.svg'));
    let valid = 0;
    let failed = 0;

    for (const file of svgFiles) {
      const content = await fs.readFile(path.join(iconsDir, file), 'utf8');
      const res = validateSvg(content, file);
      if (res.status === 'FAILED') {
        console.log(`FAILED   ${file.padEnd(20)} ${res.message}`);
        failed++;
      } else {
        valid++;
      }
    }

    console.log(`\nVerification finished: ${valid} valid, ${failed} failed out of ${svgFiles.length} files.`);
  } catch (err) {
    console.error(`Verification error: ${err.message}`);
  }
}

function getArgValue(args, key) {
  const idx = args.indexOf(key);
  if (idx !== -1 && idx + 1 < args.length) {
    return args[idx + 1];
  }
  return null;
}

function printHelp() {
  console.log(`
Canonical SVG Icon Sync Pipeline

Usage:
  node scripts/icon-sync.mjs [options] [icons...]

Options:
  --scope <mainstream|all>   Scope of icons to sync
  --all, -a                  Sync all discovered icons from Simple Icons & Devicon
  search <term>              Search for icons and aliases
  verify                     Verify existing SVG files on disk
  update                     Re-sync catalog and update registries
  --help, -h                 Show this help message

Examples:
  node scripts/icon-sync.mjs                     # Sync mainstream collection
  node scripts/icon-sync.mjs apple react docker  # Sync specific icons
  node scripts/icon-sync.mjs search nextjs       # Search for nextjs alias
  node scripts/icon-sync.mjs verify              # Verify SVGs on disk
`);
}

main().catch(err => {
  console.error('\n❌ Fatal error in icon sync pipeline:', err);
  process.exit(1);
});
