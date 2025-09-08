# eBay Browse API Connector

The eBay connector fetches listings from the [Browse API](https://developer.ebay.com/api-docs/buy/browse/overview.html)
and normalises them to a lightweight shape suitable for experiments in this
repository.

## Endpoints used

- Search: [`item_summary/search`](https://developer.ebay.com/api-docs/buy/browse/resources/item_summary/methods/search)
- Item detail: [`item/{item_id}`](https://developer.ebay.com/api-docs/buy/browse/resources/item/methods/getItem)

## Request components

- OAuth: client-credentials token with Browse scopes, supplied via
  `EBAY_OAUTH_TOKEN`.
- Marketplace header: `X-EBAY-C-MARKETPLACE-ID` (default `EBAY_GB`).
- User-Agent: `circl-ebay-connector/0.1 (+https://github.com/andremair97/circl-docs)`.

Default search results only include `FIXED_PRICE` listings unless the `filter`
parameter overrides `buyingOptions`.

## CLI usage

```bash
export EBAY_OAUTH_TOKEN=***
python -m connectors.ebay.cli search --q "laptop" --limit 3 --market EBAY_GB
python -m connectors.ebay.cli item --id "<ITEM_ID>" --market EBAY_GB
```

## Example normalised item (redacted)

```json
{
  "source": "ebay-browse",
  "id": "v1|1234567890|0",
  "title": "Dell Inspiron 14 Laptop",
  "price": {"value": 299.99, "currency": "GBP"},
  "url": "https://www.ebay.com/itm/1234567890"
}
```

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
