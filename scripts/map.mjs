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
  return String(s ?? '').split(',')[0].trim();
}

function csvToArray(s) {
  return String(s ?? '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);
}

function interpolate(str, ctx, raw) {
  return str.replace(/\${([^}]+)}/g, (_, k) => {
    if (ctx[k] !== undefined) return ctx[k];
    const val = safeGet(raw, k);
    return val !== undefined ? val : '';
  });
}

function mapSpec(spec, raw, ctx) {
  if (spec.path) return safeGet(raw, spec.path);
  if (spec.const !== undefined) {
    return typeof spec.const === 'string' ? interpolate(spec.const, ctx, raw) : spec.const;
  }
  if (spec.now) return new Date().toISOString();
  if (spec.pipe) {
    let val = safeGet(raw, spec.pipe[0]);
    for (const fn of spec.pipe.slice(1)) {
      if (fn === 'firstCsv') val = firstCsv(val);
      else if (fn === 'csvToArray') val = csvToArray(val);
    }
    return val;
  }
  if (spec.object) {
    const obj = {};
    for (const [k, v] of Object.entries(spec.object)) {
      const mv = mapSpec(v, raw, ctx);
      if (mv !== undefined && mv !== null && mv !== '') obj[k] = mv;
    }
    if (Object.keys(obj).length) return obj;
    return undefined;
  }
  if (spec.array) {
    const arr = [];
    for (const item of spec.array) {
      const mv = mapSpec(item, raw, ctx);
      if (mv !== undefined && mv !== null) arr.push(mv);
    }
    if (arr.length) return arr;
    return undefined;
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
    quiet,
  } = args;

  if (!source) {
    console.error('missing --source');
    process.exit(2);
  }
  const adapter = adapters[source];
  if (!adapter) {
    console.error('unknown source');
    process.exit(2);
  }
  const provided = [barcode, id, query, inFile].filter(Boolean);
  if (provided.length !== 1) {
    console.error('usage: provide exactly one of --barcode, --id, --query, --in');
    process.exit(2);
  }

  const schemaPath = schema || path.join(ROOT, 'schemas', 'universal', 'product.json');
  const overlayPath = overlay || path.join(ROOT, 'schemas', 'overlays', source, 'product.overlay.json');

  let raw;
  if (inFile) {
    try {
      raw = JSON.parse(fs.readFileSync(inFile, 'utf8'));
    } catch (e) {
      console.error(`cannot read input file: ${e.message}`);
      process.exit(2);
    }
  } else {
    try {
      raw = await adapter.fetchRaw({ barcode, id, query, timeout: Number(timeout), debug });
    } catch (e) {
      if (debug) console.error(`adapter error: ${e.message}`);
    }
    if (!raw) {
      const sampleMap = {
        off: 'product.sample.json',
        ifixit: 'guide.sample.json',
        ebay: 'product.sample.json',
        lot: 'item.sample.json',
      };
      const samplePath = path.join(ROOT, 'examples', source, sampleMap[source]);
      try {
        raw = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
      } catch (e) {
        console.error(`failed to load sample: ${e.message}`);
        process.exit(3);
      }
    }
  }

  let overlayJson, schemaJson;
  try {
    overlayJson = JSON.parse(fs.readFileSync(overlayPath, 'utf8'));
    schemaJson = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  } catch (e) {
    console.error(`missing schema/overlay: ${e.message}`);
    process.exit(2);
  }

  const ctx = { barcode, id, query };
  const mapped = {};
  for (const [k, v] of Object.entries(overlayJson.mapping || {})) {
    const mv = mapSpec(v, raw, ctx);
    if (mv !== undefined && mv !== null) mapped[k] = mv;
  }

  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schemaJson);
  const valid = validate(mapped);

  try {
    if (out) {
      fs.writeFileSync(out, JSON.stringify(mapped, null, 2));
    } else {
      process.stdout.write(JSON.stringify(mapped, null, 2));
    }
  } catch (e) {
    console.error(`failed to write output: ${e.message}`);
  }

  if (!quiet) {
    if (debug) console.error(`Mapped fields: ${Object.keys(mapped).length}`);
    if (!valid) {
      console.error('Validation errors:');
      for (const err of validate.errors) {
        const loc = err.instancePath || '$';
        console.error(`${loc} ${err.message}`);
      }
    }
  }

  process.exit(valid ? 0 : 1);
}

main().catch(e => {
  console.error(e.message);
  process.exit(3);
});
