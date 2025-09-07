#!/usr/bin/env node
import 'dotenv/config';
import { promises as fs, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { adapters } from '../src/adapters/index.mjs';

// --- begin compatibility shim (no new imports) ---
const __argv = process.argv.slice(2);
const __get = (keys, def) => {
  for (let i = 0; i < __argv.length; i++) {
    const a = __argv[i];
    const n = __argv[i + 1];
    if (keys.includes(a) && n && !n.startsWith('-')) return n;
    const [k, v] = a.split('=');
    if (keys.includes(k) && v) return v;
  }
  return def;
};
const __has = (keys) => __argv.some(a => keys.includes(a));

// Old tests call:  node scripts/map.mjs --source <name> --in <fixture>
// New CLI may use: --input/--overlay/--schema
// If old style is detected, derive overlay+schema automatically.
const __maybeSource = __get(['--source'], null);
const __maybeInput  = __get(['--input', '--in'], null);
const __maybeOverlay = __get(['--overlay', '--map'], null);
const __maybeSchema  = __get(['--schema'], null);

// If old style provided but overlay/schema missing, synthesize them.
if (__maybeSource && __maybeInput) {
  if (!__maybeOverlay) {
    // e.g., overlays/off.product.overlay.json for --source off
    const guessedOverlay = `overlays/${__maybeSource}.product.overlay.json`;
    __argv.push('--overlay', guessedOverlay);
  }
  if (!__maybeSchema) {
    // Prefer new filename if present; fallback to older tests filename.
    const preferred = 'schemas/universal/product.json';
    const fallback  = 'schemas/universal/product.schema.json';
    try {
      if (existsSync(preferred)) {
        __argv.push('--schema', preferred);
      } else if (existsSync(fallback)) {
        __argv.push('--schema', fallback);
      }
    } catch (_) {
      // If fs check fails for any reason, still try preferred first:
      __argv.push('--schema', preferred);
    }
  }
  // Normalize to new flag name expected by script:
  if (!__argv.includes('--input') && __maybeInput) {
    __argv.push('--input', __maybeInput);
  }
}
// Reassign process.argv so the rest of the script sees normalized flags.
process.argv = [process.argv[0], process.argv[1], ...__argv];
// --- end compatibility shim ---



const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const SAMPLE = {
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

if (!source || (!barcode && !id && !query && !inFile)) {
    console.error('usage: --source <src> [--barcode|--id|--query|--in <file>] [--out <file>]');
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

  // --- begin: fill minimal required defaults if overlay didn't provide them ---
  // id: prefer overlay; else ctx.id; else barcode/code from raw; else raw.id
  if (!mapped.id) {
    mapped.id =
      ctx.id ??
      ctx.code ??
      raw?.id ??
      raw?.code ??
      raw?.uuid ??
      raw?.Item?.id ??
      raw?.product?.id ??
      null;
  }

  // title: try common title/name fields across sources
  if (!mapped.title) {
    const titleCandidates = [
      mapped.name,
      raw?.title,
      raw?.product_name,
      raw?.name,
      raw?.Item?.title,
      raw?.product?.product_name,
      raw?.listing?.title,
      raw?.Title
    ];
    mapped.title = titleCandidates.find(Boolean) ?? null;
  }

  // provenance: object with minimal fields the schema expects
  if (!mapped.provenance) {
    mapped.provenance = {
      source: source,
      method: inFile ? 'fixture' : 'adapter',
      fetched_at: new Date().toISOString()
    };
  }
  // --- end: defaults ---


  const ajv = new Ajv({ strict: false, allErrors: true });
  addFormats(ajv);
  const validate = ajv.compile(schemaJson);
  const valid = validate(mapped);

  const outputJson = JSON.stringify(mapped, null, 2);
  if (out) {
    try {
      await fs.writeFile(out, outputJson);
    } catch (e) {
      console.error(`failed to write ${out}: ${e.message}`);
    }
  } else {
    // default for tests: print to stdout
    console.log(outputJson);
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
