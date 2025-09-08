# Fairtrade Product Finder

The Fairtrade Product Finder connector returns Fairtrade-certified products and
licensees. Official directories exist for the [Fairtrade Finder](https://www.fairtrade.org.uk/fairtrade-products/)
and [FLOCERT customer search](https://www.flocert.net/solutions/fairtrade-services/fairtrade-customer-search/)
but they do not expose public JSON APIs. This module therefore ships with small
fixture providers and an optional CSV provider for live datasets.

## Providers

- `fixtures_uk` – small UK examples
- `fixtures_global` – global sample entries
- `csv` – opt-in CSV export via `FAIRTRADE_CSV_URL` or `FAIRTRADE_CSV_PATH`

## CLI

```bash
python -m connectors.fairtrade_product_finder.cli search --provider fixtures_uk --q "coffee" --limit 5
python -m connectors.fairtrade_product_finder.cli item --provider fixtures_uk --id "UK-FT-0001"
python -m connectors.fairtrade_product_finder.cli gtin --provider csv --gtin 5051234567890
```

## Normalised output

```json
{
  "source": "fairtrade:uk-fixtures",
  "provider": "fixtures_uk",
  "id": "UK-FT-0001",
  "name": "Fairtrade Ground Coffee",
  "brand_owner": {"brand": "Cafe Example"},
  "categories": ["coffee"],
  "product_ids": {"gtins": ["5012345678900"]},
  "country_markets": ["UK"],
  "images": ["https://example.com/coffee.jpg"],
  "url": "https://www.fairtrade.org.uk/directory/coffee-1",
  "price": {},
  "certification": {"scheme": "Fairtrade", "licensee": "Cafe Example Ltd", "scope": "UK"},
  "provenance": {"source_url": "https://www.fairtrade.org.uk/directory/coffee-1"}
}
```

## Notes

Use a polite User-Agent and keep request rates low when using the CSV provider.
Fixtures should remain small to keep the repository lightweight.
