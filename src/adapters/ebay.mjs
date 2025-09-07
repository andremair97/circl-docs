import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const SAMPLE = path.join(ROOT, 'examples', 'ebay', 'product.sample.json');

export async function fetchRaw({ query, timeout = 10000, debug }) {
  const appId = process.env.EBAY_APP_ID;
  if (query && appId && debug) {
    console.error('eBay live API not implemented');
  }
  try {
    return JSON.parse(fs.readFileSync(SAMPLE, 'utf8'));
  } catch (e) {
    if (debug) console.error(`eBay sample error: ${e.message}`);
    return null;
  }
}
