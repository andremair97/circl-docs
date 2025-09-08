# Fairtrade Product Finder Connector

The Fairtrade Product Finder connector returns Fairtrade-certified products and
licensees in a normalized shape. Official directories exist — the [Fairtrade
Finder](https://www.fairtrade.org.uk/products/) and [FLOCERT customer search](https://www.flocert.net/solutions/fairtrade-services/customer-search/) — but
they do not expose public JSON APIs. This module therefore ships with fixture
providers and an opt-in CSV provider for maintainers who can supply exports.

## Usage

### CLI

```bash
python -m connectors.fairtrade_product_finder.cli search --provider fixtures_uk --q "coffee" --limit 5
python -m connectors.fairtrade_product_finder.cli search --provider csv --q "tea" --brand "Clipper" --country "UK"
python -m connectors.fairtrade_product_finder.cli item --provider fixtures_uk --id "UK-FT-0001"
python -m connectors.fairtrade_product_finder.cli gtin --provider csv --gtin 5051234567890
```

Each command prints JSON Lines of normalized ``FairtradeProductV0`` items.

## Normalized output

```json
{
  "source": "fairtrade:uk-fixtures",
  "provider": "fixtures_uk",
  "id": "UK-FT-0001",
  "name": "Fair Brew Coffee Beans",
  "brand_owner": {"brand": "Fair Brew", "manufacturer": "Fair Brew Ltd"},
  "categories": ["coffee"],
  "product_ids": {"gtins": ["5012345678900"]},
  "country_markets": ["UK"],
  "images": ["https://example.org/coffee.jpg"],
  "url": "https://example.org/coffee",
  "price": {},
  "certification": {"scheme": "Fairtrade", "scope": "UK"},
  "provenance": {"source_url": "https://www.fairtrade.org.uk/products/"}
}
```

## Notes

- Fixture providers keep data sets tiny for offline tests.
- The CSV provider performs polite throttling and sets a custom User-Agent.
- Live CSV tests are gated by ``FT_LIVE_TEST`` and require ``FAIRTRADE_CSV_URL``
  or ``FAIRTRADE_CSV_PATH``.
