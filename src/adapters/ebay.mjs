export async function fetchRaw({ query, timeout = 10000, debug }) {
  if (!query) throw new Error('query required');
  if (process.env.EBAY_APP_ID) {
    if (debug) console.error('eBay live fetch not implemented');
    // Placeholder for future implementation
  }
  return null;
}
