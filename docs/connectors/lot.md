# Library of Things

**Overlay:** `overlays/lot.product.overlay.json`

**Fixture:** `examples/lot/product.sample.json`

Maps `itemName` → `title`, `organisation` → `brand`, `barcode` → `barcode`.

## Try locally

```bash
node scripts/map.mjs --source lot --in examples/lot/product.sample.json
```

## Sample input

```json
--8<-- "examples/lot/product.sample.json"
```
