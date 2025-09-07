import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const SAMPLE = path.join(ROOT, 'examples', 'lot', 'item.sample.json');

export async function fetchRaw({ id, timeout = 10000, debug }) {
  try {
    return JSON.parse(fs.readFileSync(SAMPLE, 'utf8'));
  } catch (e) {
    if (debug) console.error(`LoT sample error: ${e.message}`);
    return null;
  }
}
