# TCO Certified Connector

Isolated connector that surfaces basic certificate metadata from TCO Certified.
It ships with three providers:

- **GTIN API** – opt-in live lookup by GTIN via `TCO_GTIN_API_BASE`
- **CSV loader** – local exports, no network
- **Product Finder stub** – small fixture for offline development

All providers normalise to the in-module `UniversalCertificationV0` shape.

## Maintainer quick commands

```bash
# Unit tests (offline)
python -m pytest tests/connectors/test_tco_certified_unit.py -q

# Opt-in live GTIN test
TCO_LIVE_TEST=1 TCO_GTIN_API_BASE="https://industry.tcocertified.com/gtin-api" \
  python -m pytest tests/connectors/test_tco_certified_live_gtin.py -q

# CLI examples
python -m connectors.tco_certified.cli search --provider csv --q "Dell" --path connectors/tco_certified/fixtures/certificates_sample.csv
python -m connectors.tco_certified.cli search --provider productfinder-stub --q display
```
