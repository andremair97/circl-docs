#!/usr/bin/env node
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { adapters } from '../src/adapters/index.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const SAMPLE_FILES = {
  off: 'product.sample.json',
  ifixit: 'guide.sample.json',
  ebay: 'product.sample.json',
  lot: 'item.sample.json'
};

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

function safeGet(obj, dotted) {
  return dotted.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

function firstCsv(s) {
  return typeof s === 'string' ? s.split(',')[0].trim() : undefined;
}

function csvToArray(s) {
  return typeof s === 'string' ? s.split(',').map(t => t.trim()).filter(Boolean) : [];
}

function interpolate(str, raw, ctx) {
  return str.replace(/\$\{([^}]+)\}/g, (_, k) => {
    if (ctx && ctx[k] !== undefined) return ctx[k];
    const v = safeGet(raw, k);
    return v !== undefined ? v : '';
  });
}

function evalSpec(spec, raw, ctx) {
  if (!spec || typeof spec !== 'object') return undefined;
  if (spec.path) return safeGet(raw, spec.path);
  if (spec.const !== undefined) return interpolate(String(spec.const), raw, ctx);
  if (spec.now) return new Date().toISOString();
  if (spec.pipe) {
    let val = safeGet(raw, spec.pipe[0]);
    const fn = spec.pipe[1];
    if (fn === 'firstCsv') val = firstCsv(val);
    else if (fn === 'csvToArray') val = csvToArray(val);
    return val;
  }
  if (spec.object) {
    const obj = {};
    for (const [k, v] of Object.entries(spec.object)) {
      const r = evalSpec(v, raw, ctx);
      if (r !== undefined) obj[k] = r;
    }
    if (Object.keys(obj).length === 0) return undefined;
    return obj;
  }
  if (Array.isArray(spec.array)) {
    const arr = [];
    for (const item of spec.array) {
      const r = evalSpec(item, raw, ctx);
      if (r !== undefined) arr.push(r);
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

  if (!source || !out) {
    console.error('usage: --source <name> (--barcode|--id|--query|--in <file>) --out <file>');
    process.exit(2);
  }

  const provided = [barcode, id, query, inFile].filter(Boolean);
  if (provided.length !== 1) {
    console.error('usage: provide exactly one of --barcode, --id, --query, --in');
    process.exit(2);
  }

  const overlayPath = overlay || path.join(ROOT, 'schemas', 'overlays', source, 'product.overlay.json');
  const schemaPath = schema || path.join(ROOT, 'schemas', 'universal', 'product.json');

  let raw;
  let fallback = false;

  if (inFile) {
    try {
      raw = JSON.parse(fs.readFileSync(inFile, 'utf8'));
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
    for (let attempt = 0; attempt < 2 && !raw; attempt++) {
      try {
        raw = await adapter.fetchRaw({ barcode, id, query, timeout: Number(timeout), debug });
      } catch (e) {
        if (debug) console.error(`adapter error: ${e.message}`);
        break;
      }
    }
    if (!raw) {
      try {
        const samplePath = path.join(ROOT, 'examples', source, SAMPLE_FILES[source]);
        raw = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
        fallback = true;
      } catch (e) {
        console.error(`failed to load sample: ${e.message}`);
        process.exit(3);
      }
    }
  }

  let overlayMap;
  let schemaJson;
  try {
    overlayMap = JSON.parse(fs.readFileSync(overlayPath, 'utf8'));
    schemaJson = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  } catch (e) {
    console.error(`missing schema/overlay: ${e.message}`);
    process.exit(2);
  }

  const context = { code: barcode, id, query };
  const mapped = {};
  for (const [k, v] of Object.entries(overlayMap.mapping || {})) {
    const val = evalSpec(v, raw, context);
    if (val !== undefined) mapped[k] = val;
  }

  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schemaJson);
  const valid = validate(mapped);

  try {
    fs.writeFileSync(out, JSON.stringify(mapped, null, 2));
  } catch (e) {
    console.error(`failed to write ${out}: ${e.message}`);
  }

  if (!quiet) {
    if (debug) {
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
  process.exit(0);
}

main();
