import fs from 'node:fs/promises';
import path from 'node:path';
import { SimpleIconsAdapter } from './lib/adapters/simpleIconsAdapter.mjs';
import { DeviconAdapter } from './lib/adapters/deviconAdapter.mjs';
import { SvgLogosAdapter } from './lib/adapters/svgLogosAdapter.mjs';
import { OfficialAdapter } from './lib/adapters/officialAdapter.mjs';
import { WikimediaAdapter } from './lib/adapters/wikimediaAdapter.mjs';
import { validateSvg, computeSha256 } from './lib/validator.mjs';

async function runDoctor() {
  console.log('\n=======================================================================');
  console.log('🩺 VERIFIED ICON REGISTRY HEALTH DOCTOR & COMPLIANCE AUDIT');
  console.log('=======================================================================\n');

  const rootDir = process.cwd();
  const generatedDir = path.join(rootDir, 'generated');
  const publicIconsDir = path.join(rootDir, 'public', 'icons');
  const catalogPath = path.join(generatedDir, 'catalog.json');
  const manifestPath = path.join(generatedDir, 'manifest.json');
  const aliasesPath = path.join(rootDir, 'config', 'aliases.json');
  const collectionsPath = path.join(rootDir, 'config', 'collections.json');

  // 1. Check Source Coverage
  console.log('📡 1. SOURCE COVERAGE');
  const simpleIcons = new SimpleIconsAdapter(rootDir);
  const devicon = new DeviconAdapter(rootDir);
  const svgLogos = new SvgLogosAdapter(rootDir);
  const official = new OfficialAdapter(rootDir);
  const wikimedia = new WikimediaAdapter(rootDir);

  await Promise.all([
    simpleIcons.load(),
    devicon.load(),
    svgLogos.load(),
    official.load(),
    wikimedia.load()
  ]);

  const simpleCount = simpleIcons.count ? simpleIcons.count() : simpleIcons.icons.size;
  const deviconCount = devicon.count ? devicon.count() : devicon.icons.size;
  const svgLogosCount = svgLogos.count ? svgLogos.count() : svgLogos.icons.size;
  const officialCount = official.count ? official.count() : official.icons.size;
  const wikimediaCount = wikimedia.count ? wikimedia.count() : (wikimedia.icons?.size || 0);

  console.log(`   Simple Icons:      ${simpleCount} discovered (v${simpleIcons.version})`);
  console.log(`   Devicon:           ${deviconCount} discovered (v${devicon.version})`);
  console.log(`   SVG Logos:         ${svgLogosCount} discovered (v${svgLogos.version})`);
  console.log(`   Official Vendor:   ${officialCount} discovered`);
  console.log(`   Wikimedia Commons: ${wikimediaCount} discovered\n`);

  // 2. Check Aliases & Collisions
  console.log('🔍 2. IDENTITY & ALIAS COLLISIONS');
  let aliasCollisions = 0;
  let aliasCount = 0;
  try {
    const aliasContent = await fs.readFile(aliasesPath, 'utf8');
    const aliases = JSON.parse(aliasContent);
    const seenAliases = new Map();
    for (const [alias, target] of Object.entries(aliases)) {
      aliasCount++;
      const lower = alias.toLowerCase().trim();
      if (seenAliases.has(lower) && seenAliases.get(lower) !== target) {
        aliasCollisions++;
        console.warn(`   ⚠️ Alias Collision: "${lower}" maps to multiple targets: ${seenAliases.get(lower)} vs ${target}`);
      }
      seenAliases.set(lower, target);
    }
    console.log(`   Audited ${aliasCount} aliases. Collisions: ${aliasCollisions}`);
  } catch (err) {
    console.warn(`   ⚠️ Could not read aliases.json: ${err.message}`);
  }

  // 3. Check Catalog & Assets
  console.log('\n📊 3. CATALOG & ASSET FIDELITY');
  let catalog = [];
  try {
    const catContent = await fs.readFile(catalogPath, 'utf8');
    catalog = JSON.parse(catContent);
  } catch (err) {
    console.error(`   ❌ Failed reading catalog.json: ${err.message}`);
  }

  let totalAssets = 0;
  let totalVariants = 0;
  let validCount = 0;
  let warningCount = 0;
  let unresolvedCount = 0;
  let multiColorCount = 0;
  let missingViewBoxCount = 0;
  let hashMismatchCount = 0;
  let staleFilesCount = 0;
  let duplicateAssetsCount = 0;
  let structuralMetricsCount = 0;
  let geometryAnomalyCount = 0;
  const contextOriginCounts = { 'source-confirmed': 0, 'inferred': 0, 'unknown': 0 };
  const shaMap = new Map();

  // Audit on-disk SVGs in public/icons
  let onDiskFiles = [];
  try {
    onDiskFiles = await fs.readdir(publicIconsDir);
  } catch {}

  const referencedFiles = new Set();

  for (const record of catalog) {
    if (record.verificationStatus === 'unresolved') {
      unresolvedCount++;
      continue;
    }

    const assets = record.assets || (record.canonicalAsset ? [record.canonicalAsset] : []);
    totalAssets += assets.length;

    if (record.variants) {
      totalVariants += Object.keys(record.variants).length;
    }

    for (const asset of assets) {
      referencedFiles.add(asset.file);
      const filePath = path.join(publicIconsDir, asset.file);

      // Audit context origin
      const origin = asset.contextOrigin || 'unknown';
      if (contextOriginCounts[origin] !== undefined) {
        contextOriginCounts[origin]++;
      } else {
        contextOriginCounts[origin] = 1;
      }

      // Audit AST structural metrics
      if (asset.structuralMetrics) {
        structuralMetricsCount++;
        if (asset.structuralMetrics.aspectRatio && (asset.structuralMetrics.aspectRatio <= 0 || isNaN(asset.structuralMetrics.aspectRatio))) {
          geometryAnomalyCount++;
        }
      }

      let content = '';
      try {
        content = await fs.readFile(filePath, 'utf8');
      } catch (err) {
        warningCount++;
        continue;
      }

      // SHA-256 integrity
      const diskSha = computeSha256(content);
      if (asset.rawSha256 && asset.rawSha256 !== diskSha) {
        hashMismatchCount++;
      }

      // Deduplication check
      if (shaMap.has(diskSha)) {
        duplicateAssetsCount++;
      } else {
        shaMap.set(diskSha, asset.file);
      }

      // XML & AST validation
      const val = validateSvg(content, asset.file);
      if (val.status === 'VALID') {
        validCount++;
        if (val.isMultiColor) multiColorCount++;
      } else {
        warningCount++;
      }

      if (!val.viewBox) {
        missingViewBoxCount++;
      }
    }
  }

  // Stale files on disk not referenced in catalog
  for (const file of onDiskFiles) {
    if (file.endsWith('.svg') && !referencedFiles.has(file)) {
      staleFilesCount++;
    }
  }

  // UI Catalog freshness check
  let uiCatalogStale = false;
  try {
    const publicCat = await fs.readFile(path.join(rootDir, 'public', 'catalog.json'), 'utf8');
    if (publicCat.length !== (await fs.readFile(catalogPath, 'utf8')).length) {
      uiCatalogStale = true;
    }
  } catch {}

  console.log(`   Canonical identities:   ${catalog.length}`);
  console.log(`   Total vector assets:    ${totalAssets}`);
  console.log(`   Variant representations: ${totalVariants}`);
  console.log(`   Valid vector documents: ${validCount}`);
  console.log(`   Multi-color assets:     ${multiColorCount}`);
  console.log(`   Missing viewBox:        ${missingViewBoxCount}`);
  console.log(`   Hash mismatches:        ${hashMismatchCount}`);
  console.log(`   Warnings:               ${warningCount}`);
  console.log(`   Unresolved identities:  ${unresolvedCount}`);
  console.log(`   Duplicate content assets: ${duplicateAssetsCount}`);
  console.log(`   Stale files on disk:    ${staleFilesCount}`);
  console.log(`   Context Origin breakdown: source-confirmed=${contextOriginCounts['source-confirmed']}, inferred=${contextOriginCounts['inferred']}, unknown=${contextOriginCounts['unknown']}`);
  console.log(`   AST Structural Metrics: ${structuralMetricsCount} assets analyzed`);
  console.log(`   Geometry Anomalies:     ${geometryAnomalyCount}`);
  console.log(`   UI Catalog in sync:     ${!uiCatalogStale}`);

  // Write audit report
  const auditReport = {
    generatedAt: new Date().toISOString(),
    doctorStatus: (hashMismatchCount === 0 && warningCount === 0 && geometryAnomalyCount === 0) ? 'HEALTHY' : 'WARNINGS_DETECTED',
    sourceCoverage: {
      simpleIcons: { count: simpleCount, version: simpleIcons.version },
      devicon: { count: deviconCount, version: devicon.version },
      svgLogos: { count: svgLogosCount, version: svgLogos.version },
      official: { count: officialCount },
      wikimedia: { count: wikimediaCount }
    },
    catalogMetrics: {
      canonicalIdentities: catalog.length,
      totalAssets,
      totalVariants,
      valid: validCount,
      warnings: warningCount,
      unresolved: unresolvedCount,
      multiColorAssets: multiColorCount,
      missingViewBox: missingViewBoxCount,
      hashMismatches: hashMismatchCount,
      duplicateAssets: duplicateAssetsCount,
      staleFiles: staleFilesCount,
      contextOriginDistribution: contextOriginCounts,
      structuralMetricsCoverage: structuralMetricsCount,
      geometryAnomalies: geometryAnomalyCount,
      uiCatalogFresh: !uiCatalogStale
    }
  };

  try {
    await fs.writeFile(path.join(generatedDir, 'audit-report.json'), JSON.stringify(auditReport, null, 2), 'utf8');
  } catch {}

  console.log('\n=======================================================================');
  console.log(`✨ AUDIT RESULT: ${auditReport.doctorStatus} · Written to generated/audit-report.json`);
  console.log('=======================================================================\n');

  if (hashMismatchCount > 0) {
    process.exitCode = 1;
  }
}

runDoctor().catch(err => {
  console.error(`Doctor run failed: ${err.message}`);
  process.exit(1);
});
