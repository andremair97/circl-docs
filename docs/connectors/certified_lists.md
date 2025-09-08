# Certified Lists Connector

The certified-lists connector aggregates product certification data from two
programs:

- **EU Ecolabel** – public catalogues (ECAT) of certified products/services.
- **Green Seal** – the Green Seal Certified Directory.

Both providers normalise their records into a minimal `UniversalCertificationV0`
shape for Circl's transparency layer.

By default the connector runs fully offline using small fixture files. Maintainers
may opt into live HTTP smoke tests:

- EU Ecolabel: set `EU_ECOLABEL_DATA_URL` to a CSV or JSON export you control.
- Green Seal: set `GS_API_KEY` (and optionally `GS_API_BASE`) per their API terms.

## CLI examples

```bash
python -m connectors.certified_lists.cli search --provider eu_ecolabel --q "soap" --limit 2
python -m connectors.certified_lists.cli search --provider green_seal --q "hand soap" --limit 2 --standard GS-41
python -m connectors.certified_lists.cli item --provider green_seal --id "GS-41-456"
```

## Example normalised output

```json
{
  "source": "cert:green-seal",
  "provider": "green_seal",
  "certificate_id": "GS-41-456",
  "product": {"brand": "SoapCo", "name": "Eco Hand Soap", "categories": ["Hand Soaps"]},
  "organization": {"name": "SoapCo LLC"},
  "status": {"status": "active", "standard": "GS-41"},
  "urls": {"detail": "https://certified.greenseal.org/products/gs-41-456"}
}
```

## Notes

- User-Agent strings identify Circl and requests are throttled politely.
- Fixtures are intentionally tiny to keep tests fast.
