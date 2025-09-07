import { spawn } from 'node:child_process';
import fs from 'node:fs';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

export default async function runMapValidate(source, fixture) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', ['scripts/map.mjs', '--source', source, '--in', fixture], {
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
        const schema = JSON.parse(
          fs.readFileSync('schemas/universal/product.schema.json', 'utf8')
        );
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
