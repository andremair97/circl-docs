export type ConnectorMeta = { title: string; description?: string }

// Keys mirror directory names under `apps/web/app/connectors` so that
// filesystem discovery can link to these pages without additional mapping.
export const CONNECTOR_CATALOG: Record<string, ConnectorMeta> = {
  bcorp: { title: 'B Corp Directory' },
  cdp: { title: 'CDP (Carbon Disclosure Project)' },
  ecolabels: { title: 'Eco-labels (EU Ecolabel & Green Seal)' },
  'energy-star': { title: 'ENERGY STAR' },
  fairtrade: { title: 'Fairtrade Product Finder' },
  ifixit: { title: 'iFixit' },
  lot: { title: 'Library of Things (UK)' },
  off: { title: 'Open Food Facts' },
  tco: { title: 'TCO Certified' },
  ebay: { title: 'eBay' },
}

export function prettifySlug(slug: string): string {
  if (!slug) return ''
  return slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
}
