import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputFile = path.join(__dirname, '..', 'examples', 'off', 'product.sample.json');
const outputDir = path.join(__dirname, '..', 'examples', 'products');
const outputFile = path.join(outputDir, 'get-by-id.json');

const raw = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

const categories = raw.categories
  ? raw.categories.split(',').map(s => s.trim()).filter(Boolean)
  : [];

const packagingMaterials = raw.packaging
  ? Array.from(new Set(
      raw.packaging
        .replace(/ and /gi, ',')
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean)
    ))
  : [];

const brandName = raw.brands ? raw.brands.split(',')[0].trim() : '';

const product = {
  $schema: '/schemas/universal/product.json',
  id: raw.code,
  title: raw.product_name,
  brand: { name: brandName },
  identifiers: { barcode: raw.code },
  classification: { categories },
  packaging: {
    ...(raw.quantity ? { net_quantity: raw.quantity } : {}),
    materials: packagingMaterials,
  },
  provenance: {
    source: 'OpenFoodFacts',
    fetched_at: new Date(raw.last_modified_t * 1000).toISOString(),
    record_id: raw.code,
  },
};

if (raw.ecoscore_grade && ['a', 'b', 'c', 'd', 'e'].includes(raw.ecoscore_grade)) {
  product.scores = { ecoscore: { grade: raw.ecoscore_grade } };
}

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(product, null, 2) + '\n');
