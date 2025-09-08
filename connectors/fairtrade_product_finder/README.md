# Fairtrade Product Finder Connector

This connector returns Fairtrade-certified products from multiple sources. It
ships with two small fixture providers and an optional CSV provider for "live"
usage.

## Providers

| Provider | Description |
| --- | --- |
| `fixtures_uk` | Hand-curated examples from the UK directory |
| `fixtures_global` | Sample entries from the global directory |
| `csv` | Loads a CSV export via `FAIRTRADE_CSV_URL` or `FAIRTRADE_CSV_PATH` |

## Environment variables

- `FAIRTRADE_CSV_URL` – HTTPS URL to a CSV export
- `FAIRTRADE_CSV_PATH` – local path to a CSV export
- `FAIRTRADE_TIMEOUT_SECONDS` – request timeout (default: 10)
- `FAIRTRADE_RPS` – requests per second throttle for remote CSV (default: 3)

## CSV header mapping

| Header | Notes |
| --- | --- |
| `name` | Product name |
| `brand` | Brand owner |
| `category` | Category text |
| `gtin` | EAN/UPC code |
| `country` | Single or `;` separated markets |
| `image_url` | Optional image URL |
| `page_url` | Optional public page |
| `licensee` | Licence holder |
| `floid` | Fairtrade Organisation ID |
| `validity_from` | Certification start (ISO8601) |
| `validity_to` | Certification end (ISO8601) |
| `status` | `valid` or `expired` |

## Troubleshooting

- Either `FAIRTRADE_CSV_URL` or `FAIRTRADE_CSV_PATH` must be set for the CSV
  provider.
- Remote fetches use a conservative token bucket so large files may take a
  while to download.
- Unknown headers are ignored; ensure required fields are present.

## Contributing fixtures

Keep fixtures small. Add new examples under `fixtures/` and extend tests where
appropriate.
