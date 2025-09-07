export async function fetchRaw({ id, query, timeout = 10000, debug }) {
  if (!id && !query) throw new Error('id or query required');
  const key = process.env.IFIXIT_API_KEY;
  if (!key) {
    if (debug) console.error('Missing IFIXIT_API_KEY');
    return null;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    if (id) {
      const url = `https://www.ifixit.com/api/2.0/guides/${id}?api_key=${key}`;
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) {
        if (debug) console.error(`iFixit HTTP ${res.status}`);
        return null;
      }
      return await res.json();
    }
    if (query) {
      const url = `https://www.ifixit.com/api/2.0/search/${encodeURIComponent(query)}?api_key=${key}`;
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) {
        if (debug) console.error(`iFixit HTTP ${res.status}`);
        return null;
      }
      const data = await res.json();
      const guide = data.results?.find(r => r.type === 'guide');
      const gid = guide?.id || guide?.guideid || guide?.resourceid;
      if (!gid) return null;
      const gRes = await fetch(`https://www.ifixit.com/api/2.0/guides/${gid}?api_key=${key}`, { signal: controller.signal });
      if (!gRes.ok) return null;
      return await gRes.json();
    }
    return null;
  } catch (e) {
    if (debug) console.error(`iFixit fetch error: ${e.message}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}
