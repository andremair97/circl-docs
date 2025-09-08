import { ConnectorDefinition } from './types';
import { buildValidator } from './validators';

// Basic schemas for validation examples. These are intentionally tiny to keep tests fast.
const offSchema = { type: 'object', required: ['code'], properties: { code: { type: 'string' } }, additionalProperties: true };
const ebaySchema = { type: 'object', required: ['itemSummaries'], properties: { itemSummaries: { type: 'array' } }, additionalProperties: true };
const ifixitSchema = { type: 'object', required: ['results'], properties: { results: { type: 'array' } }, additionalProperties: true };

const validateOff = buildValidator(offSchema);
const validateEbay = buildValidator(ebaySchema);
const validateIfixit = buildValidator(ifixitSchema);

export const CONNECTORS: ConnectorDefinition[] = [
  {
    id: 'ebay',
    label: 'eBay',
    docsUrl: 'https://developer.ebay.com/api-docs/buy/browse/resources/item_summary/methods/search',
    requiredEnv: ['EBAY_OAUTH_TOKEN'],
    sampleQuery: { q: 'phone' },
    async fetchSample({ env, fetchImpl }) {
      const base = env.EBAY_BROWSE_BASE || 'https://api.ebay.com/buy/browse/v1';
      const market = env.EBAY_MARKETPLACE || 'EBAY_GB';
      const token = env.EBAY_OAUTH_TOKEN || '';
      const url = `${base}/item_summary/search?q=phone&limit=1`;
      const res = await fetchImpl(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'X-EBAY-C-MARKETPLACE-ID': market,
        },
      });
      const data = await res.json();
      return { result: data };
    },
    validate: (data) => validateEbay(data),
  },
  {
    id: 'ifixit',
    label: 'iFixit',
    docsUrl: 'https://www.ifixit.com/api/2.0/doc',
    requiredEnv: [],
    sampleQuery: { q: 'iphone' },
    async fetchSample({ env, fetchImpl }) {
      const base = env.IFIXIT_API_BASE || 'https://www.ifixit.com/api/2.0';
      const url = `${base}/suggest/iphone?doctypes=guide`;
      const res = await fetchImpl(url, { headers: { Accept: 'application/json', 'User-Agent': 'circl-docs-ui' } });
      const data = await res.json();
      return { result: data };
    },
    validate: (data) => validateIfixit(data),
  },
  {
    id: 'off',
    label: 'Open Food Facts',
    docsUrl: 'https://world.openfoodfacts.org/data',
    requiredEnv: [],
    sampleQuery: { barcode: '737628064502' },
    async fetchSample({ env, fetchImpl }) {
      const base = env.OFF_API_BASE || 'https://world.openfoodfacts.org';
      const url = `${base}/api/v2/product/737628064502.json?fields=code,product_name`;
      const res = await fetchImpl(url, { headers: { Accept: 'application/json' } });
      const data = await res.json();
      return { result: data.product };
    },
    validate: (data) => validateOff(data),
  },
  { id: 'energystar', label: 'ENERGY STAR', requiredEnv: [] },
  { id: 'ecolabel', label: 'EU Ecolabel', requiredEnv: [] },
  { id: 'tco', label: 'TCO Certified', requiredEnv: [] },
  { id: 'cdp', label: 'CDP', requiredEnv: [] },
  { id: 'fairtrade', label: 'Fairtrade', requiredEnv: [] },
  { id: 'bcorp', label: 'B Corp', requiredEnv: [] },
  { id: 'libraryofthings', label: 'Library of Things', requiredEnv: [] },
];
