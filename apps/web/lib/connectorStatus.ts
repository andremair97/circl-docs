/**
 * Determine whether a connector likely uses live data or bundled samples.
 * We avoid network requests and instead check for environment variables
 * that unlock remote APIs. If none of the required variables are present we
 * assume the connector will fall back to sample data.
 */

type EnvGroup = string[]

// Map connector slug to groups of environment variables. If any group is
// fully satisfied the connector is considered "live".
const REQUIREMENTS: Record<string, EnvGroup[]> = {
  // eBay Browse API requires an OAuth token
  ebay: [['EBAY_OAUTH_TOKEN']],
  // B Corp search relies on Algolia credentials
  bcorp: [['BCORP_ALGOLIA_APP_ID', 'BCORP_ALGOLIA_API_KEY']],
  // Fairtrade dataset served via JSON export
  fairtrade: [['FAIRTRADE_JSON_URL']],
  // Library of Things JSON feed URL
  lot: [['LOT_FEED_URL']],
  // ENERGY STAR providers each need a JSON endpoint
  'energy-star': [
    ['ENERGY_STAR_PROVIDER_REFRIGERATORS_URL'],
    ['ENERGY_STAR_PROVIDER_DISHWASHERS_URL'],
    ['ENERGY_STAR_PROVIDER_MONITORS_URL'],
  ],
  // EU Ecolabel or Green Seal feeds
  ecolabels: [
    ['EU_ECOLABEL_API_URL'],
    ['EU_ECOLABEL_CSV_URL'],
    ['GREEN_SEAL_API_BASE', 'GREEN_SEAL_API_KEY'],
  ],
  // TCO Certified API credentials
  tco: [['TCO_API_USER', 'TCO_API_KEY']],
  // CDP corporate scores endpoints
  cdp: [['CDP_CORP_BASE', 'CDP_CORP_API_KEY']],
}

/**
 * Return a human-readable status for the connector.
 * "live data" when at least one env group is satisfied; otherwise "sample data".
 */
export function connectorStatus(slug: string): 'live data' | 'sample data' {
  const groups = REQUIREMENTS[slug]
  if (!groups) return 'live data'
  const live = groups.some((group) => group.every((env) => !!process.env[env]))
  return live ? 'live data' : 'sample data'
}

