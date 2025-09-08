"""CSV provider for the Fairtrade Product Finder connector."""

from __future__ import annotations

import csv
import os
import random
import shutil
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Dict, List

from .. import adapter

__all__ = ["CsvLoadError", "search_products", "get_product", "lookup_by_gtin"]

USER_AGENT = (
    "circl-fairtrade-csv/0.1 "
    "(+https://github.com/andremair97/circl-docs)"
)


class CsvLoadError(Exception):
    """Raised when the CSV source cannot be loaded."""


_tokens: float = 0.0
_last: float = time.monotonic()


def _throttle() -> None:
    rate = float(os.getenv("FAIRTRADE_RPS", "3"))
    capacity = max(rate, 1)
    global _tokens, _last
    now = time.monotonic()
    _tokens = min(capacity, _tokens + (now - _last) * rate)
    if _tokens < 1:
        wait = (1 - _tokens) / rate
        time.sleep(wait + random.uniform(0, 0.1))
        now = time.monotonic()
        _tokens = min(capacity, _tokens + (now - _last) * rate)
    _tokens -= 1
    _last = now


def _fetch_url(url: str) -> Path:
    _throttle()
    headers = {"User-Agent": USER_AGENT, "Accept": "text/csv, */*"}
    req = urllib.request.Request(url, headers=headers)
    timeout = float(os.getenv("FAIRTRADE_TIMEOUT_SECONDS", "10"))
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            tmp = tempfile.NamedTemporaryFile(delete=False)
            with tmp:
                shutil.copyfileobj(resp, tmp)
            return Path(tmp.name)
    except urllib.error.URLError as exc:  # pragma: no cover - network failure
        raise CsvLoadError(str(exc)) from exc


_DATA: List[Dict] | None = None
_SOURCE: str | None = None


def _load_data() -> None:
    global _DATA, _SOURCE
    if _DATA is not None:
        return
    path = os.getenv("FAIRTRADE_CSV_PATH")
    url = os.getenv("FAIRTRADE_CSV_URL")
    if path:
        csv_path = Path(path)
    elif url:
        csv_path = _fetch_url(url)
    else:
        raise CsvLoadError("FAIRTRADE_CSV_URL or FAIRTRADE_CSV_PATH must be set")
    _SOURCE = url if url else Path(path).resolve().as_uri()
    try:
        with csv_path.open(newline="", encoding="utf-8") as fh:
            reader = csv.DictReader(fh)
            _DATA = list(reader)
    except OSError as exc:
        raise CsvLoadError(str(exc)) from exc
    finally:
        if url and csv_path.exists():
            csv_path.unlink(missing_ok=True)


def _normalize(row: Dict, idx: int) -> adapter.FairtradeProductV0:
    gtin = row.get("gtin") or ""
    countries: List[str] = []
    country_field = row.get("country") or ""
    for part in country_field.replace(";", ",").split(","):
        part = part.strip()
        if part:
            countries.append(part)
    images = [row.get("image_url")] if row.get("image_url") else []
    item_id = row.get("id") or gtin or f"row{idx}"
    return {
        "source": "fairtrade:csv",
        "provider": "csv",
        "id": item_id,
        "name": row.get("name"),
        "brand_owner": {"brand": row.get("brand")},
        "categories": [row.get("category")] if row.get("category") else [],
        "product_ids": {"gtins": [gtin] if gtin else []},
        "country_markets": countries,
        "images": images,
        "url": row.get("page_url"),
        "price": {},
        "certification": {
            "scheme": "Fairtrade",
            "floid": row.get("floid"),
            "licensee": row.get("licensee"),
            "status": row.get("status"),
            "valid_from": row.get("validity_from"),
            "valid_to": row.get("validity_to"),
        },
        "provenance": {
            "source_url": _SOURCE,
            "fetched_at": adapter.iso_now(),
            "raw": adapter.sanitize_raw(row),
        },
    }


def search_products(
    query: str,
    *,
    brand: str | None = None,
    country: str | None = None,
    limit: int = 20,
    offset: int = 0,
    **kwargs,
) -> List[adapter.FairtradeProductV0]:
    _load_data()
    q = query.lower()
    results: List[adapter.FairtradeProductV0] = []
    assert _DATA is not None
    for idx, row in enumerate(_DATA):
        name = (row.get("name") or "").lower()
        category = (row.get("category") or "").lower()
        row_brand = (row.get("brand") or "").lower()
        countries = (row.get("country") or "").lower()
        if q not in name and q not in category and q not in row_brand:
            continue
        if brand and row_brand != brand.lower():
            continue
        if country and country.lower() not in countries:
            continue
        results.append(_normalize(row, idx))
    return results[offset : offset + limit]


def get_product(product_id: str, **kwargs) -> adapter.FairtradeProductV0 | None:
    _load_data()
    assert _DATA is not None
    for idx, row in enumerate(_DATA):
        item = _normalize(row, idx)
        if item["id"] == product_id:
            return item
    return None


def lookup_by_gtin(gtin: str, **kwargs) -> adapter.FairtradeProductV0 | None:
    _load_data()
    assert _DATA is not None
    for idx, row in enumerate(_DATA):
        if row.get("gtin") == gtin:
            return _normalize(row, idx)
    return None
