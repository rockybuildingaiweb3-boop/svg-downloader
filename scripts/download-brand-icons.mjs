#!/usr/bin/env node

/**
 * Backward compatibility wrapper around the canonical icon sync pipeline
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const syncScript = path.resolve(__dirname, 'icon-sync.mjs');

const child = spawn(process.execPath, [syncScript, ...process.argv.slice(2)], {
  stdio: 'inherit'
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
