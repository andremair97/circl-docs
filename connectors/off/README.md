# Open Food Facts Connector (isolated)

Minimal client + adapter for Open Food Facts (OFF) using the public HTTP APIs.
Uses only Python's standard library and respects OFF's [usage guidelines](https://support.openfoodfacts.org/help/en/).

## Usage

### Unit tests
```bash
python -m pytest tests/connectors/test_off_unit.py -q
```

### Opt-in live tests
```bash
OFF_LIVE_TEST=1 python -m pytest tests/connectors/test_off_live.py -q
```

### CLI examples
```bash
python -m connectors.off.cli search --q "oat milk" --limit 3
python -m connectors.off.cli product --barcode 737628064502
```

The connector is read-only and returns normalised dictionaries matching a
lightweight `UniversalProductV0` schema.
