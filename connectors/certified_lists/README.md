# Certified Lists Connector

Isolated connector that normalises certification directory entries from the
**EU Ecolabel** and **Green Seal** programs into a shared shape. It defaults to
small fixture files for offline development; live HTTP calls are opt-in and
require environment variables.

## Maintainer quick commands

```bash
# Unit tests (offline)
python -m pytest tests/connectors/test_certified_lists_unit.py -q

# Opt-in live tests (tiny)
CERTS_LIVE_TEST=1 GS_API_KEY=abc python -m pytest tests/connectors/test_certified_lists_live_green_seal.py -q
CERTS_LIVE_TEST=1 EU_ECOLABEL_DATA_URL=https://example.com/export.csv \
    python -m pytest tests/connectors/test_certified_lists_live_eu_ecolabel.py -q

# CLI examples
python -m connectors.certified_lists.cli search --provider eu_ecolabel --q "soap" --limit 2
python -m connectors.certified_lists.cli item --provider green_seal --id "GS-41-456"
```
