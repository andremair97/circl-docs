# iFixit

**Overlay:** `overlays/ifixit.product.overlay.json`

**Fixture:** `examples/ifixit/product.sample.json`

Maps `name` → `title`, `manufacturer` → `brand`, `sku` → `barcode`.

## Try locally

```bash
node scripts/map.mjs --source ifixit --in examples/ifixit/product.sample.json
```

## Sample input

```json
--8<-- "examples/ifixit/product.sample.json"
```
