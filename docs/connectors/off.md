# Open Food Facts Connector

The Open Food Facts (OFF) connector provides a thin wrapper around the public
OFF HTTP APIs and normalises responses into Circl's `UniversalProductV0` shape.
It is read-only and self-contained.

## Endpoints

- [Search API v2](https://world.openfoodfacts.org/api/v2/search)
- [Product API v0](https://world.openfoodfacts.org/api/v0/product/``{barcode}``.json)

OFF requires a custom User-Agent. This connector uses:
`circl-off-connector/0.1 (+https://github.com/andremair97/circl-docs)`
— see OFF's [usage guidelines](https://support.openfoodfacts.org/help/en/).

## CLI examples

```bash
python -m connectors.off.cli search --q "oat milk" --limit 3
python -m connectors.off.cli product --barcode 737628064502
```

## Example output

```json
{"source": "openfoodfacts", "id": "1234567890123", "title": "Sample Product", "badges": ["en:organic", "a", "b"], "sustainability": {"eco_score": "a", "nutri_score": "b", "labels": ["en:organic"]}}
```

_Data from [OpenFoodFacts.org](https://world.openfoodfacts.org/)_.
