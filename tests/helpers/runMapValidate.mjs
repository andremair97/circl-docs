import { spawn } from 'node:child_process';
import fs from 'node:fs';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

export default async function runMapValidate(source, fixture) {
  return new Promise((resolve, reject) => {
    // Use modern flag names while shim keeps backward compatibility
    const overlay = `schemas/overlays/${source}/product.overlay.json`;
    const schemaPath = fs.existsSync('schemas/universal/product.json')
      ? 'schemas/universal/product.json'
      : 'schemas/universal/product.schema.json';
    const proc = spawn('node', [
      'scripts/map.mjs',
      '--source', source,
      '--input', fixture,
      '--overlay', overlay,
      '--schema', schemaPath
    ], {
      stdio: ['ignore', 'pipe', 'inherit']
    });
    let stdout = '';
    proc.stdout.on('data', d => (stdout += d));
    proc.on('close', code => {
      if (code !== 0) {
        reject(new Error(`exit ${code}`));
        return;
      }
      try {
        const mapped = JSON.parse(stdout);
        // Validate mapped output against the same schema used by the mapper
        const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
        const ajv = new Ajv({ allErrors: true, strict: false });
        addFormats(ajv);
        const valid = ajv.validate(schema, mapped);
        if (!valid) {
          reject(new Error(ajv.errorsText()));
          return;
        }
        console.log(`[${source}] [OK]`);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });
}
