# iFixit Connector

Minimal, isolated connector for the [iFixit API v2](https://www.ifixit.com/api/2.0/).
It uses only the Python standard library and normalises responses into the
`UniversalRepairV0` shape for Circl's Repair pathway.

## Maintainer quick commands

```bash
# Unit tests (offline)
python -m pytest tests/connectors/test_ifixit_unit.py -q

# Opt-in live tests (tiny)
IFIXIT_LIVE_TEST=1 python -m pytest tests/connectors/test_ifixit_live.py -q

# CLI smokes
python -m connectors.ifixit.cli search --q "iphone 11" --limit 3
python -m connectors.ifixit.cli guides --device "iPhone 11" --limit 3
python -m connectors.ifixit.cli wiki --device "iPhone 11"
```
