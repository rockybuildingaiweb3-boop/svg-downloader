#!/usr/bin/env node

/**
 * Verified Multi-Source SVG Asset Registry Automated Test Suite
 * Validates integrity, scale, lack of artificial ceilings, and metadata correctness.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import crypto from 'node:crypto';
import { IconResolver } from './lib/resolver.mjs';

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

  // TEST 1: Registry File Exists and Meets Scale Requirements
  console.log('📦 1. Registry Scale & Schema Requirements');
  const registryPath = path.join(ROOT, 'generated', 'registry.json');
  const publicRegPath = path.join(ROOT, 'public', 'registry.json');
  const catalogPath = path.join(ROOT, 'generated', 'catalog.json');

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

  // TEST 2: Public Sync Mirror
  console.log('\n🔄 2. Static Serving & Public Mirror Freshness');
  try {
    const pubText = await fs.readFile(publicRegPath, 'utf8');
    const pubReg = JSON.parse(pubText);
    assert(pubReg.stats.totalIdentities === registry?.stats?.totalIdentities, 'public/registry.json matches generated/registry.json identity count');
  } catch (err) {
    assert(false, `public/registry.json is fresh: ${err.message}`);
  }

  // TEST 3: Cryptographic Integrity of Sample Canonical Assets
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

  // TEST 4: Authoritative Resolver & Search
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

  // TEST 5: Truthful License Reporting
  console.log('\n⚖️ 5. Truthful License Semantics');
  const officialAsset = registry?.identities?.find(i => i.sourceProvider === 'official' || i.sourceProvider === 'wikimedia');
  if (officialAsset) {
    assert(officialAsset.license !== null, `Official asset license is explicitly reported: "${officialAsset.license}"`);
  }

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
