export async function fetchRaw({ barcode, timeout = 10000, debug }) {
  if (!barcode) throw new Error('barcode required');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?lc=en`;
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) {
      if (debug) console.error(`OFF HTTP ${res.status}`);
      return null;
    }
    const data = await res.json();
    if (data.status === 1) return data.product;
    if (debug) console.error(data.status_verbose || 'not found');
    return null;
  } catch (e) {
    if (debug) console.error(`OFF fetch error: ${e.message}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}
