# ENERGY STAR Connector

Offline-friendly connector for ENERGY STAR certified products served via the
public [Socrata](https://data.energystar.gov) API. The module is self-contained
and stdlib-only.

## Environment Variables

| Name | Description | Default |
| --- | --- | --- |
| `ENERGY_STAR_APP_TOKEN` | Optional API token for higher rate limits | _none_ |
| `ENERGY_STAR_TIMEOUT_SECONDS` | HTTP timeout in seconds | `10` |
| `ENERGY_STAR_RPS` | Requests per second throttle | `4` |
| `ENERGY_STAR_BASE` | Base URL for the API | `https://data.energystar.gov` |

## Categories

| Key | Dataset ID | Human Name |
| --- | --- | --- |
| televisions | pd96-rr3d | ENERGY STAR Certified Televisions |
| computers | j7nq-iepp | ENERGY STAR Certified Computers |
| dehumidifiers | mgiu-hu4z | ENERGY STAR Certified Dehumidifiers |
| heat_pumps | w7cv-9xjt | ENERGY STAR Certified Air-Source Heat Pumps |

## CLI Examples

```bash
python -m connectors.energystar.cli search --category televisions --q "Samsung" --limit 5
python -m connectors.energystar.cli item --category televisions --id "TV123"
```

## Adding Categories

1. Extend the registry in `client.py` with the dataset id and human name.
2. Add fixtures under `fixtures/` and corresponding unit tests.
3. Keep requests polite: respect throttle env vars and provide a meaningful
   User-Agent.

ENERGY STAR is a registered trademark of the U.S. Environmental Protection
Agency. Use of the mark or logo may require permission.
