# Library of Things (UK) connector

The Library of Things connector surfaces borrowable items from UK tool and
thing libraries. It is self‑contained and does not hook into the global UI or
schemas yet.

## Providers

- `myturn` – supports live HTTP when `MYTURN_BASE_URL` is set and optionally
  `MYTURN_API_TOKEN`. Without those variables the provider falls back to bundled
  fixtures.
- `lot` – stub for the Library of Things platform. Fixture only.
- `lendengine` – stub for Lend Engine deployments. Fixture only.

## Environment

- `MYTURN_BASE_URL` – tenant base URL such as `https://edinburgh.myturn.com`.
- `MYTURN_API_TOKEN` – optional bearer or token header.
- `MYTURN_TIMEOUT_SECONDS` – request timeout (default 10).
- `MYTURN_REQUESTS_PER_SEC` – polite rate limit (default 4).

## CLI

Search for an item:

```bash
python -m connectors.libraryofthings_uk.cli search --provider myturn --q "drill"
```

Fetch a single item:

```bash
python -m connectors.libraryofthings_uk.cli item --provider myturn --id "mt1"
```

## Normalized output

Each provider returns items shaped as `UniversalBorrowV0`:

```json
{
  "source": "lot-uk:myturn",
  "provider": "myturn",
  "id": "mt1",
  "title": "Hammer Drill",
  "price": {"value": 7.5, "currency": "GBP", "per": "day"},
  "deposit": {"value": 30.0, "currency": "GBP"},
  "availability": {"status": "available"},
  "location": {"name": "Central Library", "postcode": "EH1 1AA"},
  "provenance": {"source_url": "…", "fetched_at": "2023-08-01T00:00:00Z"}
}
```

## Notes

- Fixtures keep unit tests offline and tiny. Opt into live tests by setting
  `LOT_LIVE_TEST=1` and `MYTURN_BASE_URL`.
- Requests include a custom User‑Agent and basic throttling for politeness.
