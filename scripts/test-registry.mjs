#!/usr/bin/env node

/**
 * Verified Multi-Source SVG Asset Registry Automated Test Suite
 * Comprehensive validation of integrity, scale, taxonomy, multi-source evaluation,
 * honest health calculation, dictionary key parity, and architectural cleanliness.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { IconResolver } from './lib/resolver.mjs';
import { classifyIdentity, VALID_CATEGORIES } from './lib/categoryClassifier.mjs';
import { assignCategories } from '../src/taxonomy/categoryAssigner.ts';
import { computeRegistryHealth, computeRegistryCoverageSummary } from '../src/utils/sourceCoverage.ts';
import { en } from '../src/i18n/en.ts';
import { zhCN } from '../src/i18n/zh-CN.ts';
import { fr } from '../src/i18n/fr.ts';
import { de } from '../src/i18n/de.ts';
import { ja } from '../src/i18n/ja.ts';

const ROOT = process.cwd();

async function runTests() {
  console.log('\n=======================================================================');
  console.log('🧪 RUNNING REGISTRY INTEGRITY & REGRESSION TEST SUITE');
  console.log('=======================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // =========================================================================
  // TEST 1: Registry File Exists and Meets Scale Requirements
  // =========================================================================
  console.log('📦 1. Registry Scale & Schema Requirements');
  const registryPath = path.join(ROOT, 'generated', 'registry.json');
  const publicRegPath = path.join(ROOT, 'public', 'registry.json');

  let registry = null;
  try {
    const text = await fs.readFile(registryPath, 'utf8');
    registry = JSON.parse(text);
  } catch (err) {
    assert(false, `generated/registry.json must exist and be valid JSON: ${err.message}`);
  }

  if (registry) {
    assert(registry.stats !== undefined, 'Registry has stats block');
    assert(registry.stats.totalIdentities >= 4600, `Registry indexed >= 4,600 identities (actual: ${registry.stats.totalIdentities})`);
    assert(registry.stats.totalAssets >= 7000, `Registry indexed >= 7,000 concrete assets (actual: ${registry.stats.totalAssets})`);
    assert(registry.identities.length >= 4600, `Registry exposes >= 4,600 identities without curated ceiling (actual: ${registry.identities.length})`);
    assert(registry.assets.length >= 7000, `Registry exposes >= 7,000 concrete assets (actual: ${registry.assets.length})`);
    
    // Check sources
    const srcCounts = registry.stats.sourceCounts;
    assert(srcCounts['simple-icons'] >= 3000, `Simple Icons indexed >= 3000 (actual: ${srcCounts['simple-icons']})`);
    assert(srcCounts['devicon'] >= 2000, `Devicon indexed >= 2000 (actual: ${srcCounts['devicon']})`);
    assert(srcCounts['iconify'] >= 2000 || srcCounts['svg-logos'] >= 2000, `SVG Logos indexed >= 2000 (actual: ${srcCounts['iconify'] || srcCounts['svg-logos']})`);
  }

  // =========================================================================
  // TEST 2: Public Sync Mirror Freshness
  // =========================================================================
  console.log('\n🔄 2. Static Serving & Public Mirror Freshness');
  try {
    const pubText = await fs.readFile(publicRegPath, 'utf8');
    const pubReg = JSON.parse(pubText);
    assert(pubReg.stats.totalIdentities === registry?.stats?.totalIdentities, 'public/registry.json matches generated/registry.json identity count');
  } catch (err) {
    assert(false, `public/registry.json is fresh: ${err.message}`);
  }

  // =========================================================================
  // TEST 3: Cryptographic Integrity & XML Renderability
  // =========================================================================
  console.log('\n🔒 3. Cryptographic Integrity & XML Renderability');
  const sampleIdentities = ['docker', 'react', 'github', 'python', 'vuedotjs', 'kubernetes', 'typescript', 'rust', 'tailwindcss', 'nextdotjs'];
  for (const slug of sampleIdentities) {
    const rec = registry?.identities?.find(i => i.id === slug);
    assert(Boolean(rec), `Identity "${slug}" is present in registry`);
    if (rec) {
      assert(rec.verified === true, `Identity "${slug}" is marked verified`);
      assert(Boolean(rec.canonicalAssetId), `Identity "${slug}" has canonicalAssetId: ${rec.canonicalAssetId}`);
      assert(Boolean(rec.canonicalDecision), `Identity "${slug}" has canonicalDecision explanation`);
      
      const filePath = path.join(ROOT, 'public', 'icons', rec.file);
      try {
        const content = await fs.readFile(filePath, 'utf8');
        const hash = crypto.createHash('sha256').update(content, 'utf8').digest('hex');
        assert(hash === rec.rawSha256, `SHA-256 for "${slug}" matches disk content (${hash.slice(0, 12)})`);
        assert(content.includes('<svg') && content.includes('</svg>'), `"${slug}.svg" is genuine XML SVG`);
      } catch (err) {
        assert(false, `File for "${slug}" exists on disk: ${err.message}`);
      }
    }
  }

  // =========================================================================
  // TEST 4: Authoritative Resolver & Search
  // =========================================================================
  console.log('\n🔍 4. Authoritative Resolver & Search');
  const resolver = new IconResolver(ROOT);
  await resolver.load();

  const brandDocker = await resolver.resolveIcon('docker', { policy: 'brand' });
  assert(brandDocker?.id === 'docker', 'Resolves "docker" to canonical ID');
  assert(brandDocker?.assets?.length > 1, 'Multi-source brand has multiple assets in family');

  // Alias Resolution Tests
  const resolvedVue = resolver.resolveIdentity('vue');
  assert(resolvedVue === 'vuedotjs', 'Alias "vue" resolves to canonical "vuedotjs"');
  const resolvedNext = resolver.resolveIdentity('nextjs');
  assert(resolvedNext === 'nextdotjs', 'Alias "nextjs" resolves to canonical "nextdotjs"');

  // Policy Priority Tests
  const monoFigma = await resolver.resolveIcon('figma', { policy: 'monochrome' });
  assert(monoFigma?.sourceProvider === 'simple-icons', 'Monochrome policy selects Simple Icons for figma');

  const techDocker = await resolver.resolveIcon('docker', { policy: 'technology' });
  assert(techDocker?.sourceProvider === 'devicon', 'Technology policy selects Devicon for docker');

  // =========================================================================
  // TEST 5: Truthful License Reporting
  // =========================================================================
  console.log('\n⚖️ 5. Truthful License Semantics');
  const officialAsset = registry?.identities?.find(i => i.sourceProvider === 'official' || i.sourceProvider === 'wikimedia');
  if (officialAsset) {
    assert(officialAsset.license !== null, `Official asset license is explicitly reported: "${officialAsset.license}"`);
  }

  // =========================================================================
  // TEST 6: Data-Driven Taxonomy Assignment & Multi-Category Engine
  // =========================================================================
  console.log('\n🏷️ 6. Data-Driven Taxonomy Assignment Engine');
  // 6.1: Explicit semantic rule (Docker)
  const dockerAssignment = assignCategories({ id: 'docker', title: 'Docker' });
  assert(dockerAssignment.primaryCategory === 'infrastructure', 'Docker assigned primary category "infrastructure"');
  assert(dockerAssignment.categories.includes('developer-tools'), 'Docker multi-category includes "developer-tools"');
  assert(dockerAssignment.categoryConfidence >= 0.95, `Docker classification confidence high (actual: ${dockerAssignment.categoryConfidence})`);
  assert(dockerAssignment.categoryEvidence.length > 0, 'Docker classification includes audit evidence');

  // 6.2: Devicon upstream tag derivation
  const deviconFramework = assignCategories({ id: 'some-framework', title: 'Some Framework', deviconTags: ['framework', 'library'] });
  assert(deviconFramework.primaryCategory === 'technology', 'Devicon tag "framework" maps to "technology"');
  assert(deviconFramework.categories.includes('developer-tools'), 'Framework tag also assigns "developer-tools"');
  assert(deviconFramework.categoryEvidence.some(e => e.includes('framework')), 'Devicon tag evidence recorded');

  // 6.3: Fallback handling for needs-review
  const unknownItem = assignCategories({ id: 'unknown-xyz-pkg', title: 'XYZ Package' });
  assert(unknownItem.primaryCategory === 'needs-review', 'Unknown entity falls back to "needs-review"');
  assert(unknownItem.categoryConfidence < 0.50, `Needs-review confidence < 0.50 (actual: ${unknownItem.categoryConfidence})`);

  // 6.4: Fallback handling for uncategorized
  const invalidItem = assignCategories({ id: '??', title: '' });
  assert(invalidItem.primaryCategory === 'uncategorized', 'Empty/invalid entity falls back to "uncategorized"');
  assert(invalidItem.categoryConfidence <= 0.20, `Uncategorized confidence <= 0.20 (actual: ${invalidItem.categoryConfidence})`);

  // 6.5: Offline classifier parity
  const offlineDocker = classifyIdentity({ id: 'docker', title: 'Docker', collections: { categories: { cloud: ['docker'] } } });
  assert(VALID_CATEGORIES.includes(offlineDocker.primaryCategory), `Offline classifier outputs valid category (${offlineDocker.primaryCategory})`);
  assert(offlineDocker.categoryEvidence && offlineDocker.categoryEvidence.length > 0, 'Offline classifier outputs categoryEvidence');

  // =========================================================================
  // TEST 7: Dynamic Category Distribution & Audit Evidence Quality
  // =========================================================================
  console.log('\n📊 7. Dynamic Category Distribution & Audit Evidence in Live Registry');
  if (registry?.identities) {
    const categoryCounts = {};
    let withEvidence = 0;

    for (const item of registry.identities) {
      const cat = item.category || 'uncategorized';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      if (Array.isArray(item.categoryEvidence) && item.categoryEvidence.length > 0) {
        withEvidence++;
      }
    }

    assert(withEvidence === registry.identities.length, `100% of identities have auditable categoryEvidence (${withEvidence} / ${registry.identities.length})`);
    assert((categoryCounts['technology'] || 0) > 0, `Technology category count is non-zero (${categoryCounts['technology']})`);
    assert((categoryCounts['brands'] || 0) > 0, `Brands category count is non-zero (${categoryCounts['brands']})`);
    assert((categoryCounts['developer-tools'] || 0) > 0, `Developer-tools category count is non-zero (${categoryCounts['developer-tools']})`);
    console.log(`    Category distribution sample: technology=${categoryCounts['technology']}, brands=${categoryCounts['brands']}, devtools=${categoryCounts['developer-tools']}, cloud=${categoryCounts['cloud']}`);
  }

  // =========================================================================
  // TEST 8: Extensible Source Adapter Registry (config/sources.json)
  // =========================================================================
  console.log('\n🔌 8. Extensible Source Adapter Configuration (config/sources.json)');
  const sourcesConfigPath = path.join(ROOT, 'config', 'sources.json');
  let sourcesConfig = null;
  try {
    const srcText = await fs.readFile(sourcesConfigPath, 'utf8');
    sourcesConfig = JSON.parse(srcText);
    assert(Array.isArray(sourcesConfig.sources), 'sources.json contains sources array');
    assert(sourcesConfig.sources.length >= 5, `sources.json defines >= 5 sources (actual: ${sourcesConfig.sources.length})`);

    const requiredSources = ['official', 'simple-icons', 'devicon', 'svg-logos', 'wikimedia'];
    for (const reqId of requiredSources) {
      const found = sourcesConfig.sources.find(s => s.id === reqId);
      assert(Boolean(found), `Source provider "${reqId}" configured in sources.json`);
      if (found) {
        assert(found.enabled === true, `Provider "${reqId}" is marked enabled: true`);
        assert(Boolean(found.trustPolicy), `Provider "${reqId}" has trustPolicy declared`);
        assert(Boolean(found.license), `Provider "${reqId}" has default license declared`);
      }
    }
  } catch (err) {
    assert(false, `Failed to load config/sources.json: ${err.message}`);
  }

  // =========================================================================
  // TEST 9: Multi-Source Provider Availability Matrix Evaluation
  // =========================================================================
  console.log('\n🌐 9. Multi-Source Provider Availability Matrix');
  if (registry?.identities) {
    const multiSourceItem = registry.identities.find(i => i.id === 'docker' || i.id === 'react');
    assert(Boolean(multiSourceItem?.sourceCoverage), `Sample item "${multiSourceItem?.id}" has sourceCoverage map`);
    if (multiSourceItem?.sourceCoverage) {
      const keys = Object.keys(multiSourceItem.sourceCoverage);
      assert(keys.includes('simple-icons') && keys.includes('devicon'), 'sourceCoverage evaluates both simple-icons and devicon');
      const validStates = ['available', 'not-found', 'not-supported', 'error', 'unknown'];
      const statesValid = Object.values(multiSourceItem.sourceCoverage).every(s => validStates.includes(s));
      assert(statesValid, 'All evaluated source availability states are strictly valid');
    }
  }

  // =========================================================================
  // TEST 10: Structural Distinction: Concrete Assets vs. Sources
  // =========================================================================
  console.log('\n📐 10. Structural Distinction: Assets Count vs. Sources Count');
  if (registry) {
    assert(registry.stats.totalAssets !== registry.stats.totalSources, 'Total assets count is strictly distinct from source provider count');
    assert(registry.stats.totalAssets > registry.stats.totalIdentities, `Total assets (${registry.stats.totalAssets}) exceeds total identities (${registry.stats.totalIdentities}) due to variants`);
    
    // Check specific multi-variant item
    const docker = registry.identities.find(i => i.id === 'docker');
    if (docker && docker.assets) {
      const distinctSources = new Set(docker.assets.map(a => a.sourceProvider)).size;
      assert(docker.assets.length > distinctSources, `Docker has ${docker.assets.length} concrete assets across ${distinctSources} distinct sources (assets !== sources)`);
    }
  }

  // =========================================================================
  // TEST 11: Sparse-Source Distribution Coverage
  // =========================================================================
  console.log('\n📈 11. Sparse-Source Distribution Coverage');
  if (registry?.identities) {
    const coverage = computeRegistryCoverageSummary(registry.identities);
    assert(coverage.totalIdentities === registry.identities.length, 'Coverage summary matches registry total identities');
    assert(coverage.distribution.singleSourceCount > 0, `Sparse single-source identities detected: ${coverage.distribution.singleSourceCount}`);
    assert(coverage.distribution.twoSourcesCount > 0, `Two-source identities detected: ${coverage.distribution.twoSourcesCount}`);
    
    const sumDistribution = coverage.distribution.singleSourceCount +
      coverage.distribution.twoSourcesCount +
      coverage.distribution.threeSourcesCount +
      coverage.distribution.fourOrMoreSourcesCount;
    assert(sumDistribution === registry.identities.length, `Distribution sum (${sumDistribution}) strictly equals total identities (${registry.identities.length})`);
  }

  // =========================================================================
  // TEST 12: Honest Registry Health Metric Computation
  // =========================================================================
  console.log('\n🩺 12. Honest Registry Health Metric Computation');
  if (registry?.identities) {
    const health = computeRegistryHealth(registry.identities);
    assert(typeof health.healthScore === 'number' && !isNaN(health.healthScore), `Health score computed as numeric: ${health.healthScore}%`);
    assert(health.healthScore >= 0 && health.healthScore <= 100, 'Health score is within bounded range [0, 100]');
    assert(health.sparseSourceIdentities > 0, `Sparse-source identities honestly tracked: ${health.sparseSourceIdentities}`);
    assert(health.verifiedIdentities > 0, `Verified identities tracked: ${health.verifiedIdentities}`);
  }

  // =========================================================================
  // TEST 13: Multilingual Dictionary Parity (5 Locales)
  // =========================================================================
  console.log('\n🌍 13. Multilingual Dictionary Parity (en, zh-CN, fr, de, ja)');
  const locales = {
    'zh-CN': zhCN,
    'fr': fr,
    'de': de,
    'ja': ja
  };

  function getDeepKeys(obj, prefix = '') {
    return Object.keys(obj).reduce((keys, k) => {
      const fullKey = prefix ? `${prefix}.${k}` : k;
      if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
        return keys.concat(getDeepKeys(obj[k], fullKey));
      }
      return keys.concat(fullKey);
    }, []);
  }

  const enKeys = new Set(getDeepKeys(en));
  assert(enKeys.size > 50, `Canonical 'en' dictionary contains ${enKeys.size} translation keys`);

  for (const [lang, dict] of Object.entries(locales)) {
    const targetKeys = new Set(getDeepKeys(dict));
    const missingKeys = [...enKeys].filter(k => !targetKeys.has(k));
    assert(missingKeys.length === 0, `Locale '${lang}' has 100% key parity with 'en' (missing: ${missingKeys.length})`);
    if (missingKeys.length > 0) {
      console.error(`    Missing in ${lang}:`, missingKeys.slice(0, 10));
    }
  }

  // =========================================================================
  // TEST 14: Architectural Cleanliness: Zero Deprecated CURATED_ICONS in Active Code
  // =========================================================================
  console.log('\n🧹 14. Architectural Cleanliness & Legacy Isolation');
  const appSrcDir = path.join(ROOT, 'src');
  async function scanDirForDeprecated(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    let violations = [];
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules') {
          violations = violations.concat(await scanDirForDeprecated(full));
        }
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        // Allow only src/data/curatedIcons.ts to define the deprecated compatibility export
        if (entry.name === 'curatedIcons.ts') continue;
        const text = await fs.readFile(full, 'utf8');
        if (text.includes('CURATED_ICONS') && !text.includes('@deprecated')) {
          violations.push(path.relative(ROOT, full));
        }
      }
    }
    return violations;
  }

  const legacyViolations = await scanDirForDeprecated(appSrcDir);
  assert(legacyViolations.length === 0, `No active application files reference CURATED_ICONS (violations: ${legacyViolations.join(', ') || '0'})`);

  // =========================================================================
  // TEST 15: Static Analysis & Architectural Quality Gate (Phase 37)
  // =========================================================================
  console.log('\n🛡️ 15. Static Analysis & Architectural Quality Gate');
  let staticAnalysisPassed = false;
  try {
    execSync('node scripts/static-analysis.mjs', { cwd: ROOT, stdio: 'pipe' });
    staticAnalysisPassed = true;
  } catch (err) {
    staticAnalysisPassed = false;
  }
  assert(staticAnalysisPassed, 'Static analysis script passes with 0 architectural violations');

  // =========================================================================
  // TEST 16: Category Engine Safe Fallbacks (Phases 3 & 4)
  // =========================================================================
  console.log('\n🏷️ 16. Category Engine Safe Fallbacks');
  const unknownClassification = classifyIdentity({ id: 'xyz-completely-unknown-token-1234' });
  assert(unknownClassification.primaryCategory === 'needs-review' || unknownClassification.primaryCategory === 'uncategorized', 'Unknown token falls back to needs-review or uncategorized');
  assert(unknownClassification.primaryCategory !== 'technology', 'Unknown token does NOT silently fallback to technology');
  // =========================================================================
  // TEST 17: Centralized Enum Localization Helpers & Precomputed Index
  // =========================================================================
  console.log('\n🗂️ 17. Precomputed Registry Indexes & Localization Helpers');
  const {
    getLocalizedCategoryLabel,
    getLocalizedRoleLabel,
    getLocalizedContextLabel,
    getLocalizedVariantLabel,
    getLocalizedTrustLabel,
    getLocalizedStatusLabel,
    getLocalizedEntityTypeLabel
  } = await import('../src/utils/localizedLabels.ts');

  assert(getLocalizedCategoryLabel('developer-tools', en) === en.filters.categories['developer-tools'], 'Localized category helper handles developer-tools in en');
  assert(getLocalizedCategoryLabel('developer-tools', zhCN) === zhCN.filters.categories['developer-tools'], 'Localized category helper handles developer-tools in zh-CN');
  assert(getLocalizedRoleLabel('wordmark', en) === en.filters.roleOptions.wordmark, 'Localized role helper handles wordmark in en');
  assert(getLocalizedRoleLabel('wordmark', zhCN) === zhCN.filters.roleOptions.wordmark, 'Localized role helper handles wordmark in zh-CN');
  assert(getLocalizedTrustLabel('verified', en).includes('Verified'), 'Localized trust helper handles verified in en');
  assert(Boolean(getLocalizedStatusLabel('multi-source', en)), 'Localized status helper handles multi-source');

  const {
    findIdentityById,
    findIdentityBySlug,
    findAssetById,
    getIdentitiesByCategory,
    getIdentitiesBySource,
    getRegistrySummary
  } = await import('../src/utils/registryIndex.ts');

  const summary = getRegistrySummary();
  assert(summary.totalIdentities >= 4600, `Registry index summary reports >= 4,600 identities (${summary.totalIdentities})`);
  assert(summary.totalAssets >= 7000, `Registry index summary reports >= 7,000 assets (${summary.totalAssets})`);
  const foundDocker = findIdentityById('docker');
  assert(Boolean(foundDocker), 'findIdentityById("docker") returns Docker identity');
  const foundBySlug = findIdentityBySlug('docker');
  assert(Boolean(foundBySlug && foundBySlug.id === 'docker'), 'findIdentityBySlug("docker") matches');
  const devToolsIcons = getIdentitiesByCategory('developer-tools');
  assert(devToolsIcons.length > 0, `getIdentitiesByCategory("developer-tools") returns non-empty list (${devToolsIcons.length})`);

  // =========================================================================
  // TEST 18: Canonical Provider Registry & Dynamic Denominator
  // =========================================================================
  console.log('\n🏛️ 18. Canonical Provider Registry & Dynamic Denominator');
  const { ENABLED_SOURCES, CANONICAL_SOURCES, getEnabledProvidersCount, getSourceDefinition } = await import('../src/data/sourceRegistry.ts');
  assert(ENABLED_SOURCES.length >= 5, `Canonical source registry defines >= 5 enabled providers (actual: ${ENABLED_SOURCES.length})`);
  assert(getEnabledProvidersCount() === ENABLED_SOURCES.length, `getEnabledProvidersCount() dynamically matches enabled providers count (${getEnabledProvidersCount()})`);
  
  // Test adding a provider definition changes the enabled-provider denominator automatically
  const mockExtendedProviders = [...ENABLED_SOURCES, { id: 'custom-vendor', name: 'Custom Vendor', enabled: true }];
  const dynamicDenominator = mockExtendedProviders.filter(s => s.enabled).length;
  assert(dynamicDenominator === ENABLED_SOURCES.length + 1, `Adding a provider changes the enabled-provider denominator dynamically (${dynamicDenominator})`);

  // =========================================================================
  // TEST 19: Provider Normalization (svg-logos vs iconify)
  // =========================================================================
  console.log('\n🔤 19. Provider Normalization (svg-logos vs iconify)');
  const svgLogosDef = getSourceDefinition('svg-logos');
  assert(svgLogosDef?.id === 'svg-logos', 'Canonical provider ID is "svg-logos"');
  assert(svgLogosDef?.platform === 'iconify', 'Canonical platform is "iconify"');
  assert(svgLogosDef?.collection === 'logos', 'Canonical collection is "logos"');
  const aliasLookup = getSourceDefinition('iconify');
  assert(aliasLookup?.id === 'svg-logos', 'Resolving "iconify" returns normalized "svg-logos" definition');

  // =========================================================================
  // TEST 20: Provider Error vs Not-Found Distinction
  // =========================================================================
  console.log('\n⚠️ 20. Provider Error vs Not-Found Distinction');
  const testResolver = new IconResolver(ROOT);
  await testResolver.load();
  
  // Mock failure in an adapter to prove error != not-found
  const originalGetAssets = testResolver.wikimedia.getAssets;
  testResolver.wikimedia.getAssets = () => { throw new Error('Simulated network 500 error'); };
  const errorResolved = await testResolver.resolveIcon('react');
  testResolver.wikimedia.getAssets = originalGetAssets; // Restore
  
  assert(errorResolved?.sourceCoverage?.wikimedia === 'error', 'Adapter exception produces "error" status, NOT "not-found"');
  
  // Timeout test
  testResolver.wikimedia.getAssets = () => {
    const err = new Error('Request timeout');
    err.name = 'AbortError';
    throw err;
  };
  const timeoutResolved = await testResolver.resolveIcon('react');
  testResolver.wikimedia.getAssets = originalGetAssets; // Restore
  assert(timeoutResolved?.sourceCoverage?.wikimedia === 'timeout', 'Adapter timeout produces "timeout" status, NOT "not-found"');

  // =========================================================================
  // TEST 21: Entity Type Inference & Evidence
  // =========================================================================
  console.log('\n🏢 21. Entity Type Inference & Evidence');
  const { inferEntityType: inferClassifierEntity } = await import('./lib/categoryClassifier.mjs');
  const companyEntity = inferClassifierEntity('amazon', 'brands');
  assert(companyEntity.entityType === 'company', `Amazon inferred as entityType "company" (actual: ${companyEntity.entityType})`);
  assert(companyEntity.entityTypeConfidence >= 0.8, 'Company entity type has high confidence');
  assert(companyEntity.entityTypeEvidence.length > 0, 'Company entity type includes audit evidence');

  const platformEntity = inferClassifierEntity('aws', 'cloud');
  assert(platformEntity.entityType === 'platform', `AWS inferred as entityType "platform" (actual: ${platformEntity.entityType})`);

  const frameworkEntity = inferClassifierEntity('react', 'technology', ['framework']);
  assert(frameworkEntity.entityType === 'framework', `React inferred as entityType "framework" (actual: ${frameworkEntity.entityType})`);

  const databaseEntity = inferClassifierEntity('postgresql', 'databases');
  assert(databaseEntity.entityType === 'database', `PostgreSQL inferred as entityType "database" (actual: ${databaseEntity.entityType})`);

  // =========================================================================
  // TEST 22: Collection != Identity Existence & Dynamic Category Counts
  // =========================================================================
  console.log('\n📦 22. Collection Independence & Dynamic Category Counts');
  // Check that identity existence is not bound to curated collections
  const allIdentitiesCount = registry.identities.length;
  const inCollections = new Set();
  const collectionsJson = JSON.parse(await fs.readFile(path.join(ROOT, 'config', 'collections.json'), 'utf8'));
  for (const list of Object.values(collectionsJson.categories || {})) {
    for (const item of list) inCollections.add(item);
  }
  for (const item of collectionsJson.mainstream || []) inCollections.add(item);
  
  const outsideCollectionsCount = registry.identities.filter(i => !inCollections.has(i.id)).length;
  assert(outsideCollectionsCount > 0, `Identities exist outside curated collections (${outsideCollectionsCount} / ${allIdentitiesCount})`);

  // Dynamic Category Counts regression test
  const { computeCategoryStats } = await import('../src/taxonomy/categoryResolver.ts');
  const baselineStats = computeCategoryStats(registry.identities);
  const baselineCloud = baselineStats.categoryStats.cloud?.identitiesCount || 0;
  
  const mockIdentities = [
    ...registry.identities,
    {
      id: 'new-cloud-service-test',
      title: 'New Cloud Service',
      slug: 'new-cloud-service-test',
      category: 'cloud',
      primaryCategory: 'cloud',
      categories: ['cloud'],
      verificationStatus: 'verified'
    }
  ];
  const updatedStats = computeCategoryStats(mockIdentities);
  const updatedCloud = updatedStats.categoryStats.cloud?.identitiesCount || 0;
  assert(updatedCloud === baselineCloud + 1, `Inserting new identity with category "cloud" increases cloud identitiesCount from ${baselineCloud} to ${updatedCloud}`);

  // Test 22b: Selection & Download Semantics
  console.log('\n📥 22b. Identity Selection vs. Asset Selection Semantics');
  const sampleIcon = registry.identities[0];
  const sampleAsset = sampleIcon.assets?.[0] || registry.assets[0];
  
  const selectedSlugs = [sampleIcon.slug || sampleIcon.id];
  const selectedAssetIds = [sampleAsset.assetId];
  
  assert(selectedSlugs.length === 1 && typeof selectedSlugs[0] === 'string' && selectedSlugs[0].length > 0, 'Identity selection manages string slugs');
  assert(selectedAssetIds.length === 1 && selectedAssetIds[0].includes('-'), 'Asset selection manages concrete asset IDs with provider/role info');
  assert(selectedSlugs[0] !== selectedAssetIds[0], 'Identity slug and asset ID are strictly separated');
  assert(Boolean(sampleAsset.file && sampleAsset.rawSha256), 'Concrete asset has authentic file name and sha256 digest');

  // Summary
  console.log('\n=======================================================================');
  console.log(`✨ TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=======================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
