# iFixit Connector

- **Pathway:** product
- **Overlay:** `overlays/ifixit.product.overlay.json`
- **Fixture:** `examples/ifixit/product.raw.json`

Maps iFixit fields to the universal product schema:

| Source field | Universal field |
|--------------|-----------------|
| `name` | `title` |
| `brand` | `brand` |
| `sku` | `barcode` |

Try locally:

```bash
node scripts/map.mjs --source ifixit --in examples/ifixit/product.raw.json
```

```json
--8<-- "examples/ifixit/product.raw.json"
```
