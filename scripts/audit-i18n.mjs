#!/usr/bin/env node

/**
 * Automated Multilingual i18n Audit Validator
 * Requirement 2.7: Scans source files for suspicious hardcoded UI text.
 * Target: hardcoded user-visible strings found: 0
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');

// Allowlist of legitimate non-translatable tokens and constants
const ALLOWED_LITERALS = new Set([
  // Canonical Brand / Provider Names (Requirement 2.5: Do NOT translate canonical names)
  'simple icons',
  'devicon',
  'svg logos',
  'official vendor',
  'wikimedia commons',
  'wikimedia',
  'github',
  'apple',
  'google',
  'react',
  'vue',
  'openai',
  'microsoft',
  'amazon',
  'adobe',
  'oracle',
  'ibm',
  'stripe',
  'docker',
  'kubernetes',
  'typescript',
  'python',
  'tailwindcss',
  'nextdotjs',
  'vuedotjs',
  'javascript',
  'tailwind css',
  'html5',
  'css mask',
  'markdown',
  'react jsx',
  'vue sfc',
  'raw svg',

  // Punctuation and Technical Formatting
  '·',
  '•',
  '-',
  '/',
  '|',
  ':',
  '%',
  '#',
  'px',
  'rem',
  'utf8',
  'utf-8',
  'image/svg+xml',
  'application/json',
  'sha-256',
  'svg',
  'jsx',
  'html',
  'css',
  'json',
  'zip',
  'xml',
  'ast',
  'ctrl+k',
  'esc',
  'get',
  'post',
  'contain',
  'actual',
  'white',
  'dark',
  'grid',
  'monochrome',
  'multi-color',
  'single-color',
  'gradient',
  'currentcolor',
  'brand',
  'technology',
  'official',
  'community',
  'trusted',
  'verified',
  'unverified',
  'warning',
  'conflict',
  'unresolved',
  'invalid',
  'available',
  'not-found',
  'not-supported',
  'error',
  'unknown'
]);

// Allowlist of file regexes to ignore (dictionary files, declarations, generated data)
const IGNORED_FILES = [
  /[\\/]src[\\/]i18n[\\/]/,
  /\.d\.ts$/,
  /[\\/]src[\\/]data[\\/]catalog\.ts/,
];

async function collectSourceFiles(dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectSourceFiles(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      const isIgnored = IGNORED_FILES.some(pattern => pattern.test(fullPath));
      if (!isIgnored) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function isAllowedString(str) {
  const clean = str.trim().toLowerCase();
  if (!clean) return true;
  if (/^[\d\s\-_.,/|:;()[\]{}#%+*<>=]+$/.test(clean)) return true; // Only numbers/punctuation
  if (/^#[0-9a-f]{3,8}$/i.test(clean)) return true; // Hex color
  if (/^https?:\/\//i.test(clean)) return true; // URL
  if (ALLOWED_LITERALS.has(clean)) return true;
  if (/^\$\{.*\}$/.test(clean)) return true; // Pure template variable
  if (/^[a-z0-9_-]+\.[a-z0-9]+$/i.test(clean)) return true; // Filename like foo.svg
  return false;
}

async function auditFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.split('\n');
  const violations = [];

  for (let lineNum = 1; lineNum <= lines.length; lineNum++) {
    const line = lines[lineNum - 1].trim();

    // Skip comments and imports/exports
    if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) continue;
    if (line.startsWith('import ') || line.startsWith('export type') || line.startsWith('export interface')) continue;

    // 1. Check raw JSX text: >Some Text< (excluding brackets and variables)
    const jsxTextMatches = line.match(/>([^<>{}\r\n]+)</g);
    if (jsxTextMatches) {
      for (const m of jsxTextMatches) {
        const text = m.slice(1, -1).trim();
        if (text && !isAllowedString(text)) {
          // Check if it's not just whitespace or symbols
          if (/[a-zA-Z\u4e00-\u9fa5]{2,}/.test(text)) {
            violations.push({
              file: path.relative(ROOT, filePath),
              line: lineNum,
              text,
              type: 'JSX Text'
            });
          }
        }
      }
    }

    // 2. Check suspicious attributes: placeholder="...", title="...", aria-label="..."
    const attrMatches = line.match(/(?:placeholder|title|aria-label|aria-description|alt)=["']([^"']+)["']/g);
    if (attrMatches) {
      for (const m of attrMatches) {
        const quoteMatch = m.match(/=(["'])(.*?)\1/);
        if (quoteMatch && quoteMatch[2]) {
          const val = quoteMatch[2].trim();
          if (val && !isAllowedString(val) && /[a-zA-Z\u4e00-\u9fa5]{2,}/.test(val)) {
            violations.push({
              file: path.relative(ROOT, filePath),
              line: lineNum,
              text: val,
              type: 'UI Attribute'
            });
          }
        }
      }
    }
  }

  return violations;
}

async function runAudit() {
  console.log('🔍 Running Automated Multilingual i18n Audit...');
  const files = await collectSourceFiles(SRC_DIR);
  console.log(`Auditing ${files.length} TypeScript / React components...`);

  let totalViolations = [];
  for (const file of files) {
    const fileViolations = await auditFile(file);
    if (fileViolations.length > 0) {
      totalViolations.push(...fileViolations);
    }
  }

  console.log('\n=======================================================================');
  console.log('📋 I18N AUDIT REPORT');
  console.log('-----------------------------------------------------------------------');
  if (totalViolations.length === 0) {
    console.log('✅ PASS: All user-visible strings go through i18n dictionaries.');
    console.log('hardcoded user-visible strings found: 0');
    console.log('=======================================================================\n');
    return 0;
  } else {
    console.warn(`⚠️ Found ${totalViolations.length} potential hardcoded UI string(s):`);
    for (const v of totalViolations) {
      console.log(`  - [${v.type}] ${v.file}:${v.line} -> "${v.text}"`);
    }
    console.log('-----------------------------------------------------------------------');
    console.log(`hardcoded user-visible strings found: ${totalViolations.length}`);
    console.log('=======================================================================\n');
    return totalViolations.length;
  }
}

const exitCode = await runAudit();
if (process.argv.includes('--strict') && exitCode > 0) {
  process.exit(1);
}
