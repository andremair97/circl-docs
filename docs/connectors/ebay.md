# eBay Connector

- **Pathway:** product
- **Overlay:** `overlays/ebay.product.overlay.json`
- **Fixture:** `examples/ebay/product.raw.json`

Maps eBay fields to the universal product schema:

| Source field | Universal field |
|--------------|-----------------|
| `title` | `title` |
| `brand` | `brand` |
| `ean` | `barcode` |

Try locally:

```bash
node scripts/map.mjs --source ebay --in examples/ebay/product.raw.json
```

```json
--8<-- "examples/ebay/product.raw.json"
```
