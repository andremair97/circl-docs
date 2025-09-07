# iFixit Connector

The iFixit connector pulls public repair guides and device information from the
[iFixit API v2](https://www.ifixit.com/api/2.0/) and maps them into Circl's
`UniversalRepairV0` schema. The connector currently taps the **Search**,
**Guides**, and **Wikis** endpoints.

- Search: <https://www.ifixit.com/api/2.0/search>
- Guides: <https://www.ifixit.com/api/2.0/Guides>
- Wikis: <https://www.ifixit.com/api/2.0/wikis>

Most endpoints are public, but if you have an app id or auth token they can be
passed via the `IFIXIT_APP_ID` and `IFIXIT_AUTH_TOKEN` environment variables.

## CLI examples

```bash
python -m connectors.ifixit.cli search --q "iphone 11" --limit 3
python -m connectors.ifixit.cli guides --device "iPhone 11" --limit 3
python -m connectors.ifixit.cli wiki --device "iPhone 11"
```

## Example output

```json
{
  "source": "ifixit",
  "id": "1",
  "device": "iPhone 11",
  "title": "Battery Replacement",
  "url": "https://www.ifixit.com/Guide/iPhone+11+Battery+Replacement/1"
}
```
