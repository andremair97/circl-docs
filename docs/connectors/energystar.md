# ENERGY STAR Connector

Fetches ENERGY STAR certified product data from the public
[Socrata](https://data.energystar.gov) API. The connector keeps a small
registry of categories and normalises results into a lightweight
`UniversalEnergyProductV0` shape.

## Environment

Set optional environment variables to tune behaviour:

- `ENERGY_STAR_APP_TOKEN` — API token for higher rate limits.
- `ENERGY_STAR_TIMEOUT_SECONDS` — request timeout (default `10`).
- `ENERGY_STAR_RPS` — requests per second throttle (default `4`).
- `ENERGY_STAR_BASE` — override base URL (default `https://data.energystar.gov`).

## CLI

```bash
python -m connectors.energystar.cli search --category televisions --q "Samsung 55" --limit 5
python -m connectors.energystar.cli item --category televisions --id "TV123"
```

Example normalised record:

```json
{
  "source": "energystar:socrata",
  "provider": "socrata",
  "category": "televisions",
  "id": "TV123",
  "title": "BrandA A1",
  "identifiers": {"esuid": "TV123", "model_number": "A1", "upcs": []},
  "links": {"product_page": "https://example.com/tv1"},
  "metrics": {"annual_kwh": 100.0, "capacity": "55", "efficiency": null, "other": {}},
  "labels": ["ENERGY STAR", "Most Efficient 2024"],
  "provenance": {"source_url": "…", "fetched_at": "…"}
}
```

ENERGY STAR is a registered trademark of the U.S. Environmental Protection
Agency; using the logo or name may require permission. See
[API User Essentials](https://www.energystar.gov/about/api-user-essentials) for
usage guidelines.
