// Minimal catalog for connectors hub.
// Why: centralises link metadata without touching individual connector pages.
export type Connector = { slug: string; title: string; description?: string }

export const CONNECTORS: Connector[] = [
  { slug: 'ebay', title: 'eBay' },
  { slug: 'ifixit', title: 'iFixit' },
  { slug: 'off', title: 'Open Food Facts' },
  { slug: 'eu-ecolabel', title: 'EU Ecolabel' },
  { slug: 'green-seal', title: 'Green Seal' },
  { slug: 'cdp', title: 'CDP (Carbon Disclosure Project)' },
  { slug: 'tco-certified', title: 'TCO Certified' },
  { slug: 'energy-star', title: 'ENERGY STAR' },
  { slug: 'fairtrade', title: 'Fairtrade Product Finder' },
  { slug: 'library-of-things', title: 'Library of Things (UK)' },
  { slug: 'bcorp', title: 'B Corp Directory' },
]
