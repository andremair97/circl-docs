export async function fetchRaw({ id, query, timeout = 10000, debug = false }) {
  const key = process.env.IFIXIT_API_KEY;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    if (key) {
      if (id) {
        const url = `https://www.ifixit.com/api/2.0/guides/${id}?api_key=${key}`;
        const res = await fetch(url, { signal: controller.signal });
        if (res.ok) return await res.json();
        if (debug) console.error(`iFixit HTTP ${res.status}`);
        return null;
      }
      if (query) {
        const searchUrl = `https://www.ifixit.com/api/2.0/search/${encodeURIComponent(query)}?api_key=${key}`;
        const res = await fetch(searchUrl, { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          const guide = data.results?.find(r => r.type === 'guide');
          if (guide) {
            const guideRes = await fetch(`https://www.ifixit.com/api/2.0/guides/${guide.data.id}?api_key=${key}`, { signal: controller.signal });
            if (guideRes.ok) return await guideRes.json();
          }
        } else if (debug) {
          console.error(`iFixit search HTTP ${res.status}`);
        }
      }
    }
  } catch (e) {
    if (debug) console.error(`iFixit fetch error: ${e.message}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
  return null;
}
