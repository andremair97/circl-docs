export async function fetchRaw({ query, timeout = 10000, debug = false }) {
  const appId = process.env.EBAY_APP_ID;
  if (query && appId) {
    if (debug) console.error('eBay live lookup TODO');
    return null;
  }
  return null;
}
