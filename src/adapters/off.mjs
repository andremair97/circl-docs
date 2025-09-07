import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const SAMPLE = path.join(ROOT, 'examples', 'off', 'product.sample.json');

async function fetchWithTimeout(url, timeout) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchRaw({ barcode, timeout = 10000, debug }) {
  if (!barcode) throw new Error('barcode required');
  const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?lc=en`;
  try {
    const res = await fetchWithTimeout(url, timeout);
    if (res.ok) {
      const data = await res.json();
      if (data.status === 1) return data.product;
      if (debug) console.error(`OFF status ${data.status}`);
    } else if (debug) {
      console.error(`OFF HTTP ${res.status}`);
    }
  } catch (e) {
    if (debug) console.error(`OFF fetch error: ${e.message}`);
  }
  try {
    return JSON.parse(fs.readFileSync(SAMPLE, 'utf8'));
  } catch (e) {
    if (debug) console.error(`OFF sample error: ${e.message}`);
    return null;
  }
}
