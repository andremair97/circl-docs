# Fairtrade Product Finder Connector

This connector surfaces Fairtrade certified products and licensees. It ships with
lightweight fixtures for the UK and global directories plus an optional CSV
provider for "live" data sets. The modules are self-contained and do not pull in
third‑party dependencies.

## Providers

| Provider | Description | Source |
| --- | --- | --- |
| `fixtures_uk` | Small sample of the UK product directory | `fixtures/uk_directory.json` |
| `fixtures_global` | Sample of the international directory | `fixtures/global_directory.json` |
| `csv` | Opt-in CSV export, loaded from env | `FAIRTRADE_CSV_PATH` or `FAIRTRADE_CSV_URL` |

## Environment variables

- `FAIRTRADE_CSV_PATH` — path to a CSV file.
- `FAIRTRADE_CSV_URL` — HTTPS URL to fetch the CSV from.
- `FAIRTRADE_TIMEOUT_SECONDS` — network timeout (default 10).
- `FAIRTRADE_RPS` — requests per second throttle for remote CSV (default 3).

## CSV header mapping

| Header | Normalized field |
| --- | --- |
| `name` | `name` |
| `brand` | `brand_owner.brand` |
| `category` | `categories` |
| `gtin` | `product_ids.gtins` |
| `country` | `country_markets` |
| `image_url` | `images` |
| `page_url` | `url` |
| `licensee` | `certification.licensee` |
| `floid` | `certification.floid` |
| `validity_from` | `certification.valid_from` |
| `validity_to` | `certification.valid_to` |
| `status` | `certification.status` |

## Contributing fixtures

Keep fixtures small and representative. Add new examples under
`connectors/fairtrade_product_finder/fixtures/` and ensure tests still pass.
