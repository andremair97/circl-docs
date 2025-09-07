# Library of Things Connector

- **Pathway:** product
- **Overlay:** `overlays/lot.product.overlay.json`
- **Fixture:** `examples/lot/product.raw.json`

Maps Library of Things fields to the universal product schema:

| Source field | Universal field |
|--------------|-----------------|
| `title` | `title` |
| `brand` | `brand` |
| `id` | `barcode` |

Try locally:

```bash
node scripts/map.mjs --source lot --in examples/lot/product.raw.json
```

```json
--8<-- "examples/lot/product.raw.json"
```
