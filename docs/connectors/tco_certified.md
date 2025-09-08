# TCO Certified Connector

The TCO Certified connector helps verify hardware certifications and exposes
basic metadata about compliant products. It follows a provider architecture so
each data source can evolve independently.

## Providers

- **GTIN API** – opt-in live lookup by GTIN. Requires an API base URL
  (`TCO_GTIN_API_BASE`) and optionally an API key (`TCO_GTIN_API_KEY`).
- **CSV loader** – reads local exports from the Product Finder. No network
  access required.
- **Product Finder stub** – small JSON fixture for offline development. Useful
  for tests and demos when live access is unavailable.

All providers normalise their output to a lightweight `UniversalCertificationV0`
shape so downstream code has a consistent contract.

## CLI examples

```bash
# Search via CSV
python -m connectors.tco_certified.cli search --provider csv --q "Dell" \
  --path connectors/tco_certified/fixtures/certificates_sample.csv

# Search fixture stub
python -m connectors.tco_certified.cli search --provider productfinder-stub --q display

# GTIN lookup (requires API base and optional key)
export TCO_GTIN_API_BASE="https://industry.tcocertified.com/gtin-api"
export TCO_GTIN_API_KEY="..."
python -m connectors.tco_certified.cli search --provider gtin-api --gtin 0887276789012
```

## Normalised output

```json
{
  "source": "tco:csv",
  "provider": "csv",
  "id": "DE125060063",
  "certificate_number": "DE125060063",
  "brand": "Dell",
  "model": "Latitude 7440",
  "gtins": ["0884112345678", "0884112345685"],
  "validity": {"valid_from": "2024-01-01", "valid_to": "2027-12-31", "status": "valid"},
  "links": {
    "product_finder": "https://tcocertified.com/product/dell-latitude-7440",
    "certificate_pdf": "https://tcocertified.com/certificates/DE125060063.pdf"
  }
}
```

## Notes

- The GTIN API is a pilot for resellers; access is not public.
- Respect rate limits (`TCO_GTIN_REQUESTS_PER_SEC`) and timeouts
  (`TCO_GTIN_TIMEOUT_SECONDS`). A custom User-Agent is sent by default.
- The connector avoids scraping the TCO Certified website. Use official exports
  or APIs only.
