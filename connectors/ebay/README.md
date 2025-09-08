# eBay Browse API Connector

This module implements a minimal connector for the eBay Browse API. It includes
an HTTP client, normalisation adapter, command-line interface, fixtures and
tests. The implementation is self-contained and does not alter existing code in
the repository.

Environment variables:

- `EBAY_OAUTH_TOKEN` – required for live calls.
- `EBAY_MARKETPLACE` – marketplace site ID (default `EBAY_GB`).
- `EBAY_ENV` – `prod` or `sandbox` (default `prod`).

## Maintainer quick commands

```bash
# Offline unit tests
python -m pytest tests/connectors/test_ebay_unit.py -q

# Opt-in live smoke (requires token + marketplace)
export EBAY_OAUTH_TOKEN=***
export EBAY_MARKETPLACE=EBAY_GB
export EBAY_LIVE_TEST=1
python -m pytest tests/connectors/test_ebay_live.py -q

# CLI smokes (live)
python -m connectors.ebay.cli search --q "laptop" --limit 3 --market EBAY_GB
python -m connectors.ebay.cli item --id "<ITEM_ID>" --market EBAY_GB
```
