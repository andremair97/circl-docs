#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      out[arg.slice(2)] = argv[++i];
    }
  }
  return out;
}

function get(obj, dotted) {
  return dotted.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}

function set(obj, dotted, value) {
  const parts = dotted.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    cur = cur[parts[i]] || (cur[parts[i]] = {});
  }
  cur[parts[parts.length - 1]] = value;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const args = parseArgs(process.argv.slice(2));
const { source, in: inFile } = args;

if (!source || !inFile) {
  console.error('usage: --source <source> --in <file>');
  process.exit(2);
}

try {
  const overlayPath = path.join(ROOT, 'overlays', `${source}.product.overlay.json`);
  const overlay = JSON.parse(fs.readFileSync(overlayPath, 'utf8'));
  const raw = JSON.parse(fs.readFileSync(inFile, 'utf8'));
  const mapped = {};
  for (const [target, srcPath] of Object.entries(overlay)) {
    const val = get(raw, srcPath);
    if (val !== undefined && val !== null && val !== '') {
      set(mapped, target, val);
    }
  }
  process.stdout.write(JSON.stringify(mapped, null, 2));
  process.exit(0);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
