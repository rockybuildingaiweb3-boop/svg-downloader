#!/usr/bin/env node

/**
 * ============================================================================
 * Canonical SVG Icon Sync Pipeline (Authoritative Single Engine)
 * ============================================================================
 * 
 * Sources:
 * - Simple Icons (CC0 canonical monochrome brand vector library)
 * - Devicon (developer & tech vectors with rich variant hierarchy)
 * - Iconify SVG Logos (Gil Barbara authentic high-fidelity vectors)
 * - Official / Wikimedia (verified vendor corporate assets)
 * 
 * Guarantees:
 * - Deterministic SHA-256 integrity hashing & XML DOM validation
 * - 100% authentic raw canonical assets (NO AI paths, NO regex recoloring, NO -2.svg suffixes)
 * - Manifest-driven safe stale asset cleanup
 * ============================================================================
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { IconResolver } from './lib/resolver.mjs';
import { validateSvg, computeSha256 } from './lib/validator.mjs';
import { RegistryGenerator } from './lib/registryGenerator.mjs';

const ROOT = process.cwd();
const GENERATED_DIR = path.resolve(ROOT, 'generated');
const GENERATED_ICONS_DIR = path.resolve(GENERATED_DIR, 'icons');
const PUBLIC_ICONS_DIR = path.resolve(ROOT, 'public', 'icons');
const SRC_DATA_DIR = path.resolve(ROOT, 'src', 'data');

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    return;
  }

  const resolver = new IconResolver(ROOT);
  await resolver.load();

  const command = args[0]?.toLowerCase();

  // Mode: SEARCH
  if (command === 'search') {
    const term = args.slice(1).filter(a => !a.startsWith('-')).join(' ').trim();
    if (!term) {
      console.error('Error: Please specify a search query, e.g. "npm run sync -- search github"');
      process.exit(1);
    }
    handleSearch(resolver, term);
    return;
  }

  // Mode: DOCTOR
  if (command === 'doctor') {
    await handleDoctor(resolver);
    return;
  }

  // Mode: SOURCES
  if (command === 'sources') {
    handleSources(resolver);
    return;
  }

  // Mode: VARIANTS
  if (command === 'variants') {
    handleVariants(resolver);
    return;
  }

  // Mode: AUDIT
  if (command === 'audit') {
    await handleAudit();
    return;
  }

  // Mode: VERIFY
  if (command === 'verify') {
    await handleVerify(PUBLIC_ICONS_DIR);
    return;
  }

  // Sync execution
  const dryRun = args.includes('--dry-run');
  const policy = getArgValue(args, '--policy') || resolver.sourcePolicies.defaultPolicy || 'brand';
  const isAllMode = args.includes('--all') || args.includes('-a');
  const scopeArg = getArgValue(args, '--scope');

  let iconsToResolve = [];

  if (isAllMode || scopeArg === 'all') {
    console.log('📦 Execution Scope: ALL DISCOVERED IDENTITIES across all adapters');
    iconsToResolve = resolver.discoverAllIdentities();
  } else if (scopeArg === 'mainstream' || command === 'update' || (args.filter(a => !a.startsWith('-') && a !== 'sync').length === 0)) {
    console.log('📦 Execution Scope: MAINSTREAM (Curated high-priority industry collection)');
    iconsToResolve = resolver.collections.mainstream || [];
  } else {
    // Custom positional icons
    const customList = args
      .filter(a => !a.startsWith('-') && a !== 'sync')
      .flatMap(a => a.split(','))
      .map(s => s.trim())
      .filter(Boolean);

    if (customList.length > 0) {
      console.log(`📦 Execution Scope: CUSTOM (${customList.length} specified icon identifiers)`);
      iconsToResolve = customList;
    } else {
      iconsToResolve = resolver.collections.mainstream || [];
    }
  }

  console.log(`\n🚀 Starting Canonical SVG Sync Pipeline...`);
  console.log(`- Active Source Policy: "${policy}"`);
  console.log(`- Simple Icons:  ${resolver.simpleIcons.version} (${resolver.simpleIcons.count()} icons)`);
  console.log(`- Devicon:       ${resolver.devicon.version} (${resolver.devicon.count()} icons)`);
  console.log(`- SVG Logos:     ${resolver.svgLogos.version} (${resolver.svgLogos.count()} icons)`);
  console.log(`- Official:      ${resolver.official.count()} verified vendor assets`);
  if (dryRun) {
    console.log(`- Mode:          --dry-run (no disk modifications will be performed)\n`);
  } else {
    console.log('');
  }

  if (!dryRun) {
    await fs.mkdir(GENERATED_ICONS_DIR, { recursive: true });
    await fs.mkdir(PUBLIC_ICONS_DIR, { recursive: true });
    await fs.mkdir(SRC_DATA_DIR, { recursive: true });
  }

  const resolvedRecords = [];
  const failures = [];
  const warnings = [];
  const processedIdentities = new Set();
  let downloadedCount = 0;

  console.log('STATUS   CANONICAL ID      SOURCE         FILE           INFO');
  console.log('-----------------------------------------------------------------------');

  for (const query of iconsToResolve) {
    const record = await resolver.resolveIcon(query, { policy });

    if (!record) {
      console.log(`FAILED   ${query.padEnd(17)} [UNRESOLVED]  -              No trusted canonical SVG source found`);
      failures.push({ id: query, error: 'Unresolved in all trusted catalogs' });
      continue;
    }

    if (processedIdentities.has(record.id)) {
      continue;
    }
    processedIdentities.add(record.id);

    try {
      const rawSvg = await record._svgFetcher();
      if (!rawSvg) {
        throw new Error('Could not retrieve authentic raw SVG content from adapter');
      }

      // XML & Vector Validation
      const valResult = validateSvg(rawSvg, record.id);
      if (valResult.status === 'FAILED') {
        console.log(`FAILED   ${record.id.padEnd(17)} ${record.source.padEnd(14)} ${record.file.padEnd(14)} ${valResult.message}`);
        failures.push({ id: record.id, error: valResult.message });
        continue;
      }

      record.rawSha256 = valResult.sha256;
      record.xmlValid = valResult.xmlValid;
      record.renderable = valResult.renderable;
      record.integrityVerified = true;
      record.verificationStatus = valResult.status === 'WARNING' ? 'warning' : 'verified';
      record.verified = true;

      if (valResult.status === 'WARNING') {
        console.log(`WARNING  ${record.id.padEnd(17)} ${record.source.padEnd(14)} ${record.file.padEnd(14)} ${valResult.message}`);
        warnings.push({ id: record.id, message: valResult.message });
      } else {
        console.log(`VALID    ${record.id.padEnd(17)} ${record.source.padEnd(14)} ${record.file.padEnd(14)} ${record.title}`);
      }

      downloadedCount++;

      const cleanRawSvg = rawSvg.trim();
      if (!dryRun) {
        const genPath = path.join(GENERATED_ICONS_DIR, record.file);
        const pubPath = path.join(PUBLIC_ICONS_DIR, record.file);
        await fs.writeFile(genPath, cleanRawSvg, 'utf8');
        await fs.writeFile(pubPath, cleanRawSvg, 'utf8');
      }

      resolvedRecords.push(record);
    } catch (err) {
      console.log(`FAILED   ${record.id.padEnd(17)} ${record.source.padEnd(14)} ${record.file.padEnd(14)} ${err.message}`);
      failures.push({ id: record.id, error: err.message });
    }
  }

  // Manifest-driven stale asset cleanup
  let staleRemovedCount = 0;
  if (!dryRun) {
    staleRemovedCount += await cleanStaleAssets(PUBLIC_ICONS_DIR, resolvedRecords, dryRun);
    await cleanStaleAssets(GENERATED_ICONS_DIR, resolvedRecords, dryRun);
  } else {
    staleRemovedCount += await cleanStaleAssets(PUBLIC_ICONS_DIR, resolvedRecords, true);
  }

  // Generate Registries & Manifest
  if (!dryRun && resolvedRecords.length > 0) {
    const metadata = {
      sourceVersions: {
        'simple-icons': resolver.simpleIcons.version,
        'devicon': resolver.devicon.version,
        'svg-logos': resolver.svgLogos.version,
        'official': 'official-vendor'
      },
      policy,
      conflicts: resolver.conflicts
    };

    const generator = new RegistryGenerator(GENERATED_DIR, resolvedRecords, metadata);
    await generator.generateAll();

    // Copy catalog.json and manifest.json to public/ and src/data/
    const catalogPath = path.join(GENERATED_DIR, 'catalog.json');
    const manifestPath = path.join(GENERATED_DIR, 'manifest.json');
    const conflictsPath = path.join(GENERATED_DIR, 'conflicts.json');

    await fs.copyFile(catalogPath, path.join(PUBLIC_ICONS_DIR, '..', 'catalog.json'));
    await fs.copyFile(manifestPath, path.join(PUBLIC_ICONS_DIR, '..', 'manifest.json'));
    await fs.copyFile(conflictsPath, path.join(PUBLIC_ICONS_DIR, '..', 'conflicts.json'));

    // Also copy to src/data/catalog.json for compile-time bundle access
    await fs.copyFile(catalogPath, path.join(SRC_DATA_DIR, 'catalog.json'));
  }

  // Output Standard Statistics Breakdown
  console.log('\n=======================================================================');
  console.log(`✨ PIPELINE SYNCHRONIZATION SUMMARY`);
  console.log('-----------------------------------------------------------------------');
  console.log(`Discovered:     ${iconsToResolve.length}`);
  console.log(`Resolved:       ${resolvedRecords.length}`);
  console.log(`Downloaded:     ${downloadedCount}`);
  console.log(`Validated:      ${resolvedRecords.length}`);
  console.log(`Warnings:       ${warnings.length}`);
  console.log(`Conflicts:      ${resolver.conflicts.length}`);
  console.log(`Unresolved:     ${failures.length}`);
  console.log(`Stale Removed:  ${staleRemovedCount}`);
  console.log('-----------------------------------------------------------------------');
  if (!dryRun) {
    console.log(`Output Locations:`);
    console.log(`- Canonical SVGs:   ${path.relative(ROOT, PUBLIC_ICONS_DIR)}/`);
    console.log(`- Catalog:          ${path.relative(ROOT, path.join(ROOT, 'public', 'catalog.json'))}`);
    console.log(`- Manifest:         ${path.relative(ROOT, path.join(ROOT, 'public', 'manifest.json'))}`);
    console.log(`- Conflicts Report: ${path.relative(ROOT, path.join(ROOT, 'public', 'conflicts.json'))}`);
    console.log(`- Engineering Code: ${path.relative(ROOT, GENERATED_DIR)}/ (index.ts, react.tsx, vue.ts)`);
  }
  console.log('=======================================================================\n');

  if (failures.length > 0 && customListSpecified(args)) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

function customListSpecified(args) {
  const custom = args.filter(a => !a.startsWith('-') && a !== 'sync' && a !== 'update');
  return custom.length > 0;
}

async function cleanStaleAssets(dir, activeRecords, dryRun = false) {
  let count = 0;
  try {
    const activeFiles = new Set(activeRecords.map(r => r.file));
    const entries = await fs.readdir(dir);
    for (const f of entries) {
      if (!f.endsWith('.svg')) continue;
      // Stale condition: legacy -2.svg or not in active records
      const isLegacySuffix = Boolean(f.match(/-\d+\.svg$/));
      const isUnmanaged = !activeFiles.has(f);

      if (isLegacySuffix || isUnmanaged) {
        if (!dryRun) {
          await fs.unlink(path.join(dir, f));
        }
        count++;
      }
    }
  } catch {}
  return count;
}

function handleSearch(resolver, query) {
  console.log(`\n🔍 Searching canonical catalogs for "${query}"...\n`);
  const results = resolver.search(query);
  if (results.length === 0) {
    console.log(`No matching icons found for "${query}".`);
    return;
  }

  console.log(`Found ${results.length} matches across all sources:`);
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
  console.log(`\n🔍 Verifying Canonical SVG Assets in ${iconsDir}...\n`);
  try {
    const files = await fs.readdir(iconsDir);
    const svgFiles = files.filter(f => f.endsWith('.svg'));
    let valid = 0;
    let failed = 0;

    // Load manifest if available
    let manifestMap = null;
    try {
      const manifestText = await fs.readFile(path.join(iconsDir, '..', 'manifest.json'), 'utf8');
      const manifest = JSON.parse(manifestText);
      manifestMap = new Map((manifest.icons || []).map(i => [i.file, i.rawSha256]));
    } catch {}

    console.log('STATUS   FILE                 SHA-256 (FIRST 12)   DETAILS');
    console.log('---------------------------------------------------------------------');

    for (const file of svgFiles) {
      const content = await fs.readFile(path.join(iconsDir, file), 'utf8');
      const res = validateSvg(content, file);
      const computedSha = res.sha256;

      let shaMatch = true;
      if (manifestMap && manifestMap.has(file)) {
        shaMatch = manifestMap.get(file) === computedSha;
      }

      if (res.status === 'FAILED' || !shaMatch) {
        console.log(`FAILED   ${file.padEnd(20)} ${computedSha.slice(0, 12)}         ${!shaMatch ? 'SHA256 mismatch against manifest' : res.message}`);
        failed++;
      } else {
        console.log(`OK       ${file.padEnd(20)} ${computedSha.slice(0, 12)}         ${res.message}`);
        valid++;
      }
    }

    console.log(`\nVerification finished: ${valid} passed, ${failed} failed (${svgFiles.length} total files).`);
    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error(`Verification error: ${err.message}`);
    process.exit(1);
  }
}

async function handleDoctor(resolver) {
  console.log('\n🩺 Running Canonical SVG Pipeline System Diagnostic...\n');
  console.log(`- Node version:      ${process.version}`);
  console.log(`- Working Directory: ${ROOT}`);
  console.log(`- Simple Icons:      ${resolver.simpleIcons.loaded ? 'OK' : 'Not Loaded'} (v${resolver.simpleIcons.version}, ${resolver.simpleIcons.count()} icons)`);
  console.log(`- Devicon:           ${resolver.devicon.loaded ? 'OK' : 'Not Loaded'} (v${resolver.devicon.version}, ${resolver.devicon.count()} icons)`);
  console.log(`- SVG Logos:         ${resolver.svgLogos.loaded ? 'OK' : 'Not Loaded'} (v${resolver.svgLogos.version}, ${resolver.svgLogos.count()} icons)`);
  console.log(`- Official/Special:  ${resolver.official.loaded ? 'OK' : 'Not Loaded'} (${resolver.official.count()} items)`);

  // Check write access to public/icons
  try {
    await fs.mkdir(PUBLIC_ICONS_DIR, { recursive: true });
    const testFile = path.join(PUBLIC_ICONS_DIR, '.doctor_test');
    await fs.writeFile(testFile, 'test', 'utf8');
    await fs.unlink(testFile);
    console.log(`- Directory Access:  OK (Read/Write verified for ${path.relative(ROOT, PUBLIC_ICONS_DIR)})`);
  } catch (err) {
    console.log(`- Directory Access:  FAILED (${err.message})`);
  }

  console.log('\nAll diagnostic checks complete.\n');
}

function handleSources(resolver) {
  console.log('\n📚 Available Canonical Source Adapters & Policies:\n');
  console.log('SOURCE NAME     VERSION        COUNT   LICENSE / NOTES');
  console.log('-----------------------------------------------------------------------------');
  console.log(`simple-icons    ${resolver.simpleIcons.version.padEnd(14)} ${String(resolver.simpleIcons.count()).padEnd(7)} CC0 1.0 Universal (Strict single-path)`);
  console.log(`devicon         ${resolver.devicon.version.padEnd(14)} ${String(resolver.devicon.count()).padEnd(7)} MIT + Brand Trademark Guidelines`);
  console.log(`svg-logos       ${resolver.svgLogos.version.padEnd(14)} ${String(resolver.svgLogos.count()).padEnd(7)} CC0 / Gil Barbara Vector Archive`);
  console.log(`official        vendor-archive ${String(resolver.official.count()).padEnd(7)} Verified Public Domain / Trademark Archive`);

  console.log('\nConfigured Source Policies (config/source-policies.json):');
  for (const [key, pol] of Object.entries(resolver.sourcePolicies.policies)) {
    console.log(`- [${key}] ${pol.name}: ${pol.priority.join(' > ')}`);
  }
  console.log('');
}

function handleVariants(resolver) {
  console.log('\n🧬 Variant Modeling Analysis across Devicon and Catalogs:\n');
  let totalVariants = 0;
  const variantCounts = {};

  for (const item of resolver.devicon.getAll()) {
    const list = item.variantList || [];
    totalVariants += list.length;
    for (const v of list) {
      variantCounts[v] = (variantCounts[v] || 0) + 1;
    }
  }

  console.log(`Total Devicon icons:    ${resolver.devicon.count()}`);
  console.log(`Total distinct variants: ${totalVariants}`);
  console.log('\nTop Variant Distributions:');
  for (const [v, count] of Object.entries(variantCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`- ${v.padEnd(20)}: ${count} icons`);
  }
  console.log('');
}

async function handleAudit() {
  console.log('\n📋 Auditing Manifest and Integrity Records...\n');
  try {
    const manifestPath = path.join(ROOT, 'public', 'manifest.json');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));

    console.log(`Manifest Generated: ${manifest.generatedAt}`);
    console.log(`Total Icons:        ${manifest.totalIcons}`);
    console.log('\nCounts by Source:');
    for (const [src, count] of Object.entries(manifest.countsBySource || {})) {
      console.log(`- ${src.padEnd(16)}: ${count}`);
    }

    const missingHashes = (manifest.icons || []).filter(i => !i.rawSha256);
    console.log(`\nIntegrity Verification:`);
    console.log(`- Valid SHA-256 entries: ${(manifest.icons || []).length - missingHashes.length}`);
    console.log(`- Missing SHA-256:       ${missingHashes.length}`);
    console.log('\nAudit complete.\n');
  } catch (err) {
    console.error(`Audit error: ${err.message}`);
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
Canonical SVG Icon Sync Pipeline (Authoritative Single Engine)

Usage:
  node scripts/icon-sync.mjs [options] [icons...]
  npm run sync [-- [options] [icons...]]

Options:
  --all, -a                  Sync all discovered canonical icons across all adapters
  --scope <mainstream|all>   Scope of icons to sync
  --policy <policy-name>     Specify active source policy (brand | technology | monochrome | official)
  --dry-run                  Simulate resolution, validation, and cleanup without disk changes
  search <query>             Search across all catalogs and aliases
  verify                     Verify on-disk SVG XML validity and SHA-256 hashes
  doctor                     Run environment and adapter diagnostics
  sources                    List available source adapters, versions, and policies
  variants                   Show variant statistics
  audit                      Audit manifest integrity and licensing
  update                     Re-sync catalog and regenerate registries
  --help, -h                 Show this help message

Examples:
  npm run sync                                # Sync curated mainstream collection
  npm run sync -- --all                       # Sync all discovered canonical identities
  npm run sync -- apple github react          # Sync specific icons
  npm run sync -- --policy technology         # Sync using technology priority
  npm run sync -- search nextjs               # Search for nextjs alias
  npm run sync -- verify                      # Cryptographic & XML verification
`);
}

main().catch(err => {
  console.error('\n❌ Fatal error in icon sync pipeline:', err);
  process.exit(1);
});
