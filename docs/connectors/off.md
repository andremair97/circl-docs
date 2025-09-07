# Open Food Facts

**Overlay:** `overlays/off.product.overlay.json`

**Fixture:** `examples/off/product.sample.json`

Maps `product_name` → `title`, `brands` → `brand`, `code` → `barcode`.

## Try locally

```bash
node scripts/map.mjs --source off --in examples/off/product.sample.json
```

## Sample input

```json
--8<-- "examples/off/product.sample.json"
```
