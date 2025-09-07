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
      if (['debug', 'quiet'].includes(key)) {
        out[key] = true;
      } else {
        out[key] = argv[++i];
      }
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

async function fetchWithTimeout(url, timeout) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const {
    barcode,
    in: inFile,
    schema = path.join(ROOT, 'schemas', 'universal', 'product.schema.json'),
    overlay = path.join(ROOT, 'overlays', 'off.product.overlay.json'),
    out,
    timeout = '8000',
    debug,
    quiet,
  } = args;

  if ((barcode && inFile) || (!barcode && !inFile)) {
    console.error('usage: --barcode <code> | --in <file>');
    process.exit(2);
  }

  let raw;
  let offStatus = '';
  let fallback = false;

  if (barcode) {
    try {
      const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?lc=en`;
      const res = await fetchWithTimeout(url, Number(timeout));
      offStatus = `HTTP ${res.status}`;
      if (res.ok) {
        const data = await res.json();
        if (data.status === 1) {
          raw = data.product;
        } else {
          throw new Error(data.status_verbose || 'not found');
        }
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (e) {
      console.error(`fetch error: ${e.message}`);
    }
  } else if (inFile) {
    try {
      raw = JSON.parse(fs.readFileSync(inFile, 'utf8'));
    } catch (e) {
      console.error(`cannot read input file: ${e.message}`);
      process.exit(2);
    }
  }

  if (!raw) {
    try {
      raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'examples', 'off', 'product.sample.json'), 'utf8'));
      fallback = true;
    } catch (e) {
      console.error(`failed to load sample: ${e.message}`);
      process.exit(3);
    }
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
  for (const [target, source] of Object.entries(overlayMap)) {
    const val = get(raw, source);
    if (val !== undefined && val !== null && val !== '') {
      set(mapped, target, val);
    }
  }

  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schemaJson);
  const valid = validate(mapped);

  if (out) {
    try {
      fs.writeFileSync(out, JSON.stringify(mapped, null, 2));
    } catch (e) {
      console.error(`failed to write ${out}: ${e.message}`);
    }
  } else {
    process.stdout.write(JSON.stringify(mapped, null, 2));
  }

  if (!quiet) {
    if (debug) {
      console.error(`OFF status: ${offStatus || 'n/a'}`);
      console.error(`Sample fallback: ${fallback}`);
      console.error(`Mapped fields: ${Object.keys(mapped).length}`);
    }
    if (!valid) {
      console.error('Validation errors:');
      for (const err of validate.errors) {
        const loc = err.instancePath || '$';
        console.error(`${loc} ${err.message}`);
      }
    }
  }

  if (!valid) process.exit(1);
  if (fallback && barcode) process.exit(3);
  process.exit(0);
}

main();

