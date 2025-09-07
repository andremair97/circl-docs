import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const SAMPLE = path.join(ROOT, 'examples', 'ifixit', 'guide.sample.json');

async function fetchWithTimeout(url, timeout, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchRaw({ id, query, timeout = 10000, debug }) {
  const key = process.env.IFIXIT_API_KEY;
  try {
    if (key) {
      const headers = { 'X-API-KEY': key };
      if (id) {
        const res = await fetchWithTimeout(`https://www.ifixit.com/api/2.0/guides/${id}`, timeout, { headers });
        if (res.ok) return await res.json();
      } else if (query) {
        const res = await fetchWithTimeout(`https://www.ifixit.com/api/2.0/search/${encodeURIComponent(query)}`, timeout, { headers });
        if (res.ok) {
          const data = await res.json();
          const first = data.results?.find(r => r.type === 'guide');
          if (first?.guideid) {
            const gRes = await fetchWithTimeout(`https://www.ifixit.com/api/2.0/guides/${first.guideid}`, timeout, { headers });
            if (gRes.ok) return await gRes.json();
          }
        }
      }
    } else if (debug) {
      console.error('iFixit API key missing');
    }
  } catch (e) {
    if (debug) console.error(`iFixit fetch error: ${e.message}`);
  }
  try {
    return JSON.parse(fs.readFileSync(SAMPLE, 'utf8'));
  } catch (e) {
    if (debug) console.error(`iFixit sample error: ${e.message}`);
    return null;
  }
}
