#!/usr/bin/env node
<<<<<<< HEAD
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { adapters } from '../src/adapters/index.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const SAMPLE = {
  off: 'product.sample.json',
  ifixit: 'guide.sample.json',
  ebay: 'product.sample.json',
  lot: 'item.sample.json'
};
=======
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
>>>>>>> 1d1b96e (docs: note connector pathway)

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
<<<<<<< HEAD
      const key = arg.slice(2);
      if (['debug', 'quiet'].includes(key)) {
        out[key] = true;
      } else {
        out[key] = argv[++i];
      }
=======
      out[arg.slice(2)] = argv[++i];
>>>>>>> 1d1b96e (docs: note connector pathway)
    }
  }
  return out;
}

<<<<<<< HEAD
function safeGet(obj, dotted) {
  return dotted.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}

function firstCsv(s) {
  return typeof s === 'string' ? s.split(',')[0].trim() : undefined;
}

function csvToArray(s) {
  return typeof s === 'string' ? s.split(',').map(t => t.trim()).filter(Boolean) : [];
}

function mapValue(spec, raw, ctx) {
  if (spec.path) return safeGet(raw, spec.path);
  if (spec.const !== undefined) return String(spec.const).replace(/\$\{(\w+)\}/g, (_, k) => ctx[k] ?? '');
  if (spec.now) return new Date().toISOString();
  if (spec.pipe) {
    let val = safeGet(raw, spec.pipe[0]);
    for (const step of spec.pipe.slice(1)) {
      if (step === 'firstCsv') val = firstCsv(val);
      else if (step === 'csvToArray') val = csvToArray(val);
    }
    return val;
  }
  if (spec.object) {
    const obj = {};
    for (const [k, v] of Object.entries(spec.object)) {
      const val = mapValue(v, raw, ctx);
      if (val !== undefined && val !== null && !(typeof val === 'object' && Object.keys(val).length === 0)) {
        obj[k] = val;
      }
    }
    return Object.keys(obj).length ? obj : undefined;
  }
  if (spec.array) {
    const arr = [];
    for (const v of spec.array) {
      const val = mapValue(v, raw, ctx);
      if (val !== undefined && val !== null) arr.push(val);
    }
    return arr;
  }
  return undefined;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const {
    source,
    barcode,
    id,
    query,
    in: inFile,
    schema,
    overlay,
    out,
    timeout = '10000',
    debug,
    quiet
  } = args;

  if (!source || (!barcode && !id && !query && !inFile) || !out) {
    console.error('usage: --source <src> [--barcode|--id|--query|--in <file>] --out <file>');
    process.exit(2);
  }

  const schemaPath = schema || path.join(ROOT, 'schemas', 'universal', 'product.json');
  const overlayPath = overlay || path.join(ROOT, 'schemas', 'overlays', source, 'product.overlay.json');

  let raw;
  if (inFile) {
    try {
      raw = JSON.parse(await fs.readFile(inFile, 'utf8'));
    } catch (e) {
      console.error(`cannot read input file: ${e.message}`);
      process.exit(2);
    }
  } else {
    const adapter = adapters[source];
    if (!adapter) {
      console.error(`unknown source: ${source}`);
      process.exit(2);
    }
    try {
      raw = await adapter.fetchRaw({ barcode, id, query, timeout: Number(timeout), debug });
    } catch (e) {
      console.error(`adapter error: ${e.message}`);
      process.exit(2);
    }
    if (!raw) {
      try {
        const samplePath = path.join(ROOT, 'examples', source, SAMPLE[source]);
        raw = JSON.parse(await fs.readFile(samplePath, 'utf8'));
      } catch (e) {
        console.error(`failed to load sample: ${e.message}`);
        process.exit(3);
      }
    }
  }

  let overlaySpec;
  let schemaJson;
  try {
    overlaySpec = JSON.parse(await fs.readFile(overlayPath, 'utf8'));
    schemaJson = JSON.parse(await fs.readFile(schemaPath, 'utf8'));
  } catch (e) {
    console.error(`missing schema/overlay: ${e.message}`);
    process.exit(2);
  }

  const ctx = { code: barcode || raw?.code || id, id, query };
  const mapped = {};
  for (const [k, v] of Object.entries(overlaySpec.mapping || {})) {
    const val = mapValue(v, raw, ctx);
    if (val !== undefined && val !== null) {
      mapped[k] = val;
    }
  }

  const ajv = new Ajv({ strict: false, allErrors: true });
  addFormats(ajv);
  const validate = ajv.compile(schemaJson);
  const valid = validate(mapped);

  try {
    await fs.writeFile(out, JSON.stringify(mapped, null, 2));
  } catch (e) {
    console.error(`failed to write ${out}: ${e.message}`);
  }

  if (!quiet && !valid) {
    console.error('Validation errors:');
    for (const err of validate.errors) {
      const loc = err.instancePath || '$';
      console.error(`${loc} ${err.message}`);
    }
  }

  if (debug) {
    console.error(`Mapped fields: ${Object.keys(mapped).length}`);
  }

  if (!valid) process.exit(1);
  process.exit(0);
}

main();
=======
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
>>>>>>> 1d1b96e (docs: note connector pathway)
