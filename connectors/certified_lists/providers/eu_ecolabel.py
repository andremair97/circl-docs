"""EU Ecolabel provider.

Fixture-first with optional live ingestion via CSV/JSON exports. Live mode is
opt-in through the ``EU_ECOLABEL_DATA_URL`` environment variable.
"""

from __future__ import annotations

import csv
import json
import os
import random
import time
import urllib.request
from pathlib import Path
from typing import Dict, List

from .. import adapter

FIXTURES = Path(__file__).resolve().parents[1] / "fixtures"

DEFAULT_TIMEOUT = int(os.getenv("EU_ECOLABEL_TIMEOUT_SECONDS", "10"))
RATE = float(os.getenv("EU_ECOLABEL_REQUESTS_PER_SEC", "2"))
DATA_URL = os.getenv("EU_ECOLABEL_DATA_URL")

_NEXT_REQUEST = 0.0


class EUEcolabelHttpError(Exception):
    pass


class EUEcolabelParseError(Exception):
    pass


def _throttle() -> None:
    global _NEXT_REQUEST
    now = time.time()
    wait = _NEXT_REQUEST - now
    if wait > 0:
        time.sleep(wait + random.uniform(0, 0.25))
    _NEXT_REQUEST = max(now, _NEXT_REQUEST) + 1 / RATE


def _fetch(url: str) -> bytes:
    _throttle()
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "circl-certified-eu/0.1 (+https://github.com/andremair97/circl-docs)",
            "Accept": "text/csv, application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=DEFAULT_TIMEOUT) as resp:
            return resp.read()
    except urllib.error.HTTPError as exc:  # pragma: no cover - network branch
        raise EUEcolabelHttpError(f"HTTP error {exc.code}") from exc
    except urllib.error.URLError as exc:  # pragma: no cover - network branch
        raise EUEcolabelHttpError(str(exc)) from exc


def _load_live_data() -> List[Dict]:  # pragma: no cover - live path
    if not DATA_URL:
        return []
    body = _fetch(DATA_URL)
    if DATA_URL.endswith(".json"):
        try:
            rows = json.loads(body.decode("utf-8"))
        except json.JSONDecodeError as exc:
            raise EUEcolabelParseError(str(exc)) from exc
    else:
        text = body.decode("utf-8", errors="ignore")
        rows = list(csv.DictReader(text.splitlines()))
    return [_normalise_row(row, DATA_URL) for row in rows]


def _load_fixture_data() -> List[Dict]:
    rows: List[Dict] = []
    csv_text = (FIXTURES / "eu_sample_products.csv").read_text()
    rows.extend(
        _normalise_row(row, f"file://{FIXTURES / 'eu_sample_products.csv'}")
        for row in csv.DictReader(csv_text.splitlines())
    )
    json_rows = json.loads((FIXTURES / "eu_sample_products.json").read_text())
    rows.extend(
        _normalise_row(row, f"file://{FIXTURES / 'eu_sample_products.json'}")
        for row in json_rows
    )
    return rows


def _load_all() -> List[Dict]:
    return _load_live_data() if DATA_URL else _load_fixture_data()


def _normalise_row(row: Dict, source_url: str) -> Dict:
    item: adapter.UniversalCertificationV0 = {
        "source": "cert:eu-ecolabel",
        "provider": "eu_ecolabel",
        "certificate_id": row.get("certificate_id", ""),
        "product": {
            "brand": row.get("brand"),
            "name": row.get("product_name"),
            "model": row.get("model"),
            "gtin": row.get("gtin"),
            "categories": [c.strip() for c in row.get("categories", [])
                            if c and c.strip()] if isinstance(row.get("categories"), list)
            else [c.strip() for c in str(row.get("categories", "")).split(";") if c.strip()],
        },
        "organization": {
            "name": row.get("company"),
            "country": row.get("country"),
            "website": row.get("website"),
        },
        "status": {
            "status": row.get("status", "unknown"),
            "issued": row.get("issued"),
            "expires": row.get("expires"),
            "standard": row.get("standard"),
        },
        "marketplace_badges": [],
        "urls": {"detail": row.get("detail_url", "")},
        "provenance": {
            "source_url": source_url,
            "fetched_at": adapter.iso_now(),
            "raw": adapter.sanitize_raw(row),
        },
    }
    return item


def search_certified(query: str, limit: int = 20, offset: int = 0, **_: Dict) -> List[Dict]:
    """Search certified products/services."""

    data = _load_all()
    q = query.lower()
    results = [
        item
        for item in data
        if not q
        or q in (item["product"].get("name", "").lower())
        or q in (item["product"].get("brand", "").lower())
        or any(q in c.lower() for c in item["product"].get("categories", []))
        or q in ((item["product"].get("model") or "").lower())
    ]
    return results[offset : offset + limit]


def get_certificate(cert_id: str, **_: Dict) -> Dict | None:
    """Fetch a single certificate by id."""

    data = _load_all()
    for item in data:
        if item.get("certificate_id") == cert_id:
            return item
    return None
