import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..');

export function runMapValidate(source, fixture) {
  const cmd = ['scripts/map.mjs', '--source', source, '--in', fixture];
  const res = spawnSync('node', cmd, { encoding: 'utf8' });
  if (res.status !== 0) {
    throw new Error(`map.mjs failed for ${source}: ${res.stderr}`);
  }
  let output;
  try {
    output = JSON.parse(res.stdout);
  } catch {
    throw new Error('invalid JSON output');
  }
  const schema = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'schemas', 'universal', 'product.schema.json'), 'utf8')
  );
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const valid = validate(output);
  if (!valid) {
    throw new Error(ajv.errorsText(validate.errors));
  }
  console.log(`[${source}] OK`);
}
