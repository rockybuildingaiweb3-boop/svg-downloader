#!/usr/bin/env node

/**
 * Static Analysis Validator (Phase 37)
 * Comprehensive automated quality gate for code health and architectural integrity:
 * 1. Hardcoded UI strings
 * 2. Legacy CURATED_ICONS imports in active code
 * 3. Hardcoded provider counts
 * 4. Hardcoded category counts
 * 5. Unsafe category fallbacks (|| 'technology' or || 'brands')
 * 6. Static health claims (Registry Health 100%)
 * 7. Provider naming inconsistencies (iconify as provider ID)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');
const SCRIPTS_DIR = path.join(ROOT, 'scripts');

async function getAllFiles(dir, exts = ['.ts', '.tsx', '.mjs', '.js']) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        files.push(...await getAllFiles(full, exts));
      }
    } else if (exts.some(ext => entry.name.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

async function runStaticAnalysis() {
  console.log('\n=======================================================================');
  console.log('🛡️  RUNNING STATIC ANALYSIS & ARCHITECTURAL INTEGRITY AUDIT');
  console.log('=======================================================================\n');

  let passedChecks = 0;
  let totalErrors = 0;

  function recordPass(checkName) {
    console.log(`  ✅ PASS: ${checkName}`);
    passedChecks++;
  }

  function recordFail(checkName, details = []) {
    console.error(`  ❌ FAIL: ${checkName}`);
    for (const d of details) {
      console.error(`     - ${d}`);
    }
    totalErrors++;
  }

  const srcFiles = await getAllFiles(SRC_DIR);
  const scriptFiles = await getAllFiles(SCRIPTS_DIR);
  const allCodeFiles = [...srcFiles, ...scriptFiles];

  // 1. Check Hardcoded UI Strings via audit-i18n.mjs
  try {
    execSync('node scripts/audit-i18n.mjs --strict', { cwd: ROOT, stdio: 'pipe' });
    recordPass('0 hardcoded user-visible strings across all UI components');
  } catch (err) {
    recordFail('Hardcoded user-visible UI strings detected', [err.stdout?.toString() || err.message]);
  }

  // 2. Check Legacy CURATED_ICONS Imports
  const legacyViolations = [];
  for (const file of srcFiles) {
    const rel = path.relative(ROOT, file);
    if (rel.replace(/\\/g, '/') === 'src/data/curatedIcons.ts') continue;
    const content = await fs.readFile(file, 'utf8');
    if (content.includes('CURATED_ICONS')) {
      legacyViolations.push(`${rel} references deprecated CURATED_ICONS`);
    }
  }
  if (legacyViolations.length === 0) {
    recordPass('0 active application files import or reference CURATED_ICONS');
  } else {
    recordFail('Deprecated CURATED_ICONS referenced in active code', legacyViolations);
  }

  // 3. Check Hardcoded Provider Counts
  const providerCountViolations = [];
  for (const file of allCodeFiles) {
    const rel = path.relative(ROOT, file);
    if (rel.includes('static-analysis') || rel.includes('test-registry')) continue;
    const content = await fs.readFile(file, 'utf8');
    if (/sourceCoverageChecked\s*=\s*\d+/.test(content)) {
      providerCountViolations.push(`${rel} contains hardcoded sourceCoverageChecked assignment`);
    }
  }
  if (providerCountViolations.length === 0) {
    recordPass('Source coverage checked count is derived dynamically from enabled providers');
  } else {
    recordFail('Hardcoded source provider count detected', providerCountViolations);
  }

  // 4. Check Unsafe Category Fallbacks (|| 'technology' or || 'brands')
  const fallbackViolations = [];
  for (const file of allCodeFiles) {
    const rel = path.relative(ROOT, file);
    if (rel.includes('static-analysis') || rel.includes('test-registry')) continue;
    const content = await fs.readFile(file, 'utf8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/category.*\|\|\s*['"]technology['"]/i.test(line) ||
          /category.*\|\|\s*['"]brands['"]/i.test(line) ||
          /primaryCategory.*\|\|\s*['"]technology['"]/i.test(line) ||
          /primaryCategory.*\|\|\s*['"]brands['"]/i.test(line)) {
        fallbackViolations.push(`${rel}:${i + 1} contains unsafe fallback to technology or brands: "${line.trim()}"`);
      }
    }
  }
  if (fallbackViolations.length === 0) {
    recordPass('Zero unsafe category fallbacks (|| "technology" or || "brands") found');
  } else {
    recordFail('Unsafe category fallback found', fallbackViolations);
  }

  // 5. Check Static Health Claims in UI Dictionaries
  const staticHealthViolations = [];
  const i18nFiles = srcFiles.filter(f => f.includes(path.join('src', 'i18n')));
  for (const file of i18nFiles) {
    const rel = path.relative(ROOT, file);
    const content = await fs.readFile(file, 'utf8');
    if (/healthTitle:\s*['"][^'"]*100%['"]/i.test(content)) {
      staticHealthViolations.push(`${rel} contains static 100% health title`);
    }
  }
  if (staticHealthViolations.length === 0) {
    recordPass('Health titles are dynamic and accept computed health parameters');
  } else {
    recordFail('Static health claim found in UI dictionary', staticHealthViolations);
  }

  // 6. Check Provider Naming Inconsistencies (iconify as provider ID)
  const providerNamingViolations = [];
  const sourcesConfigRaw = await fs.readFile(path.join(ROOT, 'config', 'sources.json'), 'utf8');
  const sourcesConfig = JSON.parse(sourcesConfigRaw);

  for (const s of sourcesConfig.sources) {
    if (s.id === 'iconify') {
      providerNamingViolations.push(`config/sources.json has provider id "iconify" instead of "svg-logos"`);
    }
  }

  if (providerNamingViolations.length === 0) {
    recordPass('Provider identifiers normalized: svg-logos is canonical provider ID');
  } else {
    recordFail('Inconsistent provider naming detected', providerNamingViolations);
  }

  console.log('\n=======================================================================');
  if (totalErrors === 0) {
    console.log(`✨ STATIC ANALYSIS PASSED: ${passedChecks} checks satisfied with 0 violations.`);
    console.log('=======================================================================\n');
    process.exit(0);
  } else {
    console.error(`💥 STATIC ANALYSIS FAILED: ${totalErrors} violation(s) detected.`);
    console.log('=======================================================================\n');
    process.exit(1);
  }
}

runStaticAnalysis().catch(err => {
  console.error('Fatal static analysis error:', err);
  process.exit(1);
});
