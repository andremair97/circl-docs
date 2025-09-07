# Open Food Facts Connector

- **Pathway:** product
- **Overlay:** `overlays/off.product.overlay.json`
- **Fixture:** `examples/off/product.raw.json`

Maps Open Food Facts fields to the universal product schema:

| Source field | Universal field |
|--------------|-----------------|
| `product_name` | `title` |
| `brands` | `brand` |
| `code` | `barcode` |

Try locally:

```bash
node scripts/map.mjs --source off --in examples/off/product.raw.json
```

```json
--8<-- "examples/off/product.raw.json"
```
