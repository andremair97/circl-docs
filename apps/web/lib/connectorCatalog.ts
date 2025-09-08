export type ConnectorMeta = { title: string; description?: string }

export const CONNECTOR_CATALOG: Record<string, ConnectorMeta> = {
  'ebay': { title: 'eBay' },
  'ifixit': { title: 'iFixit' },
  'off': { title: 'Open Food Facts' },
  'eu-ecolabel': { title: 'EU Ecolabel' },
  'green-seal': { title: 'Green Seal' },
  'cdp': { title: 'CDP (Carbon Disclosure Project)' },
  'tco-certified': { title: 'TCO Certified' },
  'energy-star': { title: 'ENERGY STAR' },
  'fairtrade': { title: 'Fairtrade Product Finder' },
  'library-of-things': { title: 'Library of Things (UK)' },
  'bcorp': { title: 'B Corp Directory' },
}

export function prettifySlug(slug: string): string {
  if (!slug) return ''
  return slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
}
