# CDP Scores Connector

The CDP Scores connector ingests public corporate scores (A–F) published by
[CDP](https://www.cdp.net/). It is a read-only importer that normalises rows into
a lightweight `UniversalESGScoreV0` shape.

- No scraping or partner API calls.
- Teams must only supply CSV exports or public datasets they are licensed to use.
- Live mode is opt-in via `CDP_SCORES_CSV_URL` or the `--url` flag.

## Schema snippet

```python
class UniversalESGScoreV0(TypedDict, total=False):
    source: str  # "cdp:scores"
    provider: str  # "csv_local" | "csv_http"
    org_name: str
    year: Optional[int]
    scores: Dict[str, Optional[str]]
    links: Dict[str, Optional[str]]
    provenance: Dict[str, Any]
```

## CLI examples

```bash
python -m connectors.cdp.cli search --provider csv_local --q "Alphabet" --year 2024 --limit 3
CDP_SCORES_CSV_URL="https://example.com/cdp_scores_2024.csv" \
python -m connectors.cdp.cli search --provider csv_http --q "Nestlé" --year 2024 --limit 3
```

## Example output

```json
{
  "source": "cdp:scores",
  "provider": "csv_local",
  "org_name": "Alphabet Inc",
  "year": 2024,
  "scores": {"climate_change": "A", "water_security": "B"}
}
```

## Further reading

- CDP public scores: <https://www.cdp.net/en/scores>
- CDP Disclosure API overview: <https://help.cdp.net/en/articles/7804165-disclosure-api>
