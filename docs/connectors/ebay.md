# eBay

**Overlay:** `overlays/ebay.product.overlay.json`

**Fixture:** `examples/ebay/product.sample.json`

Maps `title` → `title`, `brand` → `brand`, `ean` → `barcode`.

## Try locally

```bash
node scripts/map.mjs --source ebay --in examples/ebay/product.sample.json
```

## Sample input

```json
--8<-- "examples/ebay/product.sample.json"
```
