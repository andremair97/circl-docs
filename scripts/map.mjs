#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      out[key] = argv[++i];
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

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const {
    source,
    in: inFile,
    schema = path.join(ROOT, 'schemas', 'universal', 'product.schema.json'),
    overlay = source && path.join(ROOT, 'overlays', `${source}.product.overlay.json`),
    out,
  } = args;

  if (!source || !inFile) {
    console.error('usage: --source <id> --in <file>');
    process.exit(2);
  }

  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(inFile, 'utf8'));
  } catch (e) {
    console.error(`cannot read input file: ${e.message}`);
    process.exit(2);
  }

  let overlayMap;
  let schemaJson;
  try {
    overlayMap = JSON.parse(fs.readFileSync(overlay, 'utf8'));
    schemaJson = JSON.parse(fs.readFileSync(schema, 'utf8'));
  } catch (e) {
    console.error(`missing schema/overlay: ${e.message}`);
    process.exit(2);
  }

  const mapped = {};
  for (const [target, sourcePath] of Object.entries(overlayMap)) {
    const val = get(raw, sourcePath);
    if (val !== undefined && val !== null && val !== '') {
      set(mapped, target, val);
    }
  }

  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schemaJson);
  const valid = validate(mapped);
  if (!valid) {
    for (const err of validate.errors) {
      const loc = err.instancePath || '$';
      console.error(`${loc} ${err.message}`);
    }
    process.exit(1);
  }

  if (out) {
    fs.writeFileSync(out, JSON.stringify(mapped, null, 2));
  } else {
    process.stdout.write(JSON.stringify(mapped, null, 2));
  }
  process.exit(0);
}

main();
