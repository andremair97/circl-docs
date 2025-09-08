# CDP Scores Connector

Isolated connector for public corporate scores published by [CDP](https://www.cdp.net/).
It ships with tiny CSV fixtures for offline tests and can optionally fetch a
CSV/JSON export via a user-provided URL. The connector normalises records into
the in-module `UniversalESGScoreV0` shape.

## Maintainer quick commands

```bash
# Unit tests (offline)
python -m pytest tests/connectors/test_cdp_unit.py -q

# Opt-in live test
CDP_LIVE_TEST=1 CDP_SCORES_CSV_URL="https://example.com/cdp_scores_2024.csv" \
python -m pytest tests/connectors/test_cdp_live_csv.py -q

# CLI smokes
python -m connectors.cdp.cli search --provider csv_local --q "Alphabet" --year 2024 --limit 3
```
