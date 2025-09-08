"""CSV provider for Fairtrade Product Finder.

Data is loaded from a CSV export either via ``FAIRTRADE_CSV_URL`` or a local
file via ``FAIRTRADE_CSV_PATH``. The module performs a small token-bucket
throttle for remote requests and maps rows to ``FairtradeProductV0`` objects.
"""

from __future__ import annotations

import csv
import os
import random
import tempfile
import time
import urllib.error
import urllib.request
from typing import Dict, List, Optional

from ..adapter import FairtradeProductV0, sanitize_raw, iso_now

__all__ = ["CsvLoadError", "search_products", "get_product", "lookup_by_gtin"]

USER_AGENT = (
    "circl-fairtrade-csv/0.1 "
    "(+https://github.com/andremair97/circl-docs)"
)


class CsvLoadError(Exception):
    """Raised when the CSV source cannot be loaded."""


_tokens: float = 0.0
_last: float = time.monotonic()
_rows: Optional[List[Dict[str, str]]] = None
_source_url: Optional[str] = None


def _throttle() -> None:
    global _tokens, _last
    rate = float(os.getenv("FAIRTRADE_RPS", "3"))
    capacity = max(rate, 1.0)
    now = time.monotonic()
    elapsed = now - _last
    _tokens = min(capacity, _tokens + elapsed * rate)
    if _tokens < 1:
        wait = (1 - _tokens) / rate
        time.sleep(wait + random.uniform(0, 0.1))
        now = time.monotonic()
        elapsed = now - _last
        _tokens = min(capacity, _tokens + elapsed * rate)
    _tokens -= 1
    _last = now


def _load_rows() -> List[Dict[str, str]]:
    global _rows, _source_url
    if _rows is not None:
        return _rows

    path = os.getenv("FAIRTRADE_CSV_PATH")
    url = os.getenv("FAIRTRADE_CSV_URL")
    if not path and not url:
        raise CsvLoadError("FAIRTRADE_CSV_URL or FAIRTRADE_CSV_PATH required")

    if path:
        _source_url = path
        fh = open(path, "r", encoding="utf-8")
    else:
        _throttle()
        headers = {"User-Agent": USER_AGENT, "Accept": "text/csv, */*"}
        req = urllib.request.Request(url, headers=headers)
        timeout = float(os.getenv("FAIRTRADE_TIMEOUT_SECONDS", "10"))
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                status = getattr(resp, "status", resp.getcode())
                if status != 200:
                    raise CsvLoadError(f"HTTP {status} for {url}")
                with tempfile.NamedTemporaryFile(delete=False) as tmp:
                    while True:
                        chunk = resp.read(8192)
                        if not chunk:
                            break
                        tmp.write(chunk)
                    tmp_path = tmp.name
        except urllib.error.URLError as exc:  # pragma: no cover - network failure
            raise CsvLoadError(str(exc)) from exc
        fh = open(tmp_path, "r", encoding="utf-8")
        _source_url = url

    with fh:
        reader = csv.DictReader(fh)
        _rows = [row for row in reader]
    return _rows


def _map(row: Dict[str, str]) -> FairtradeProductV0:
    gtin = (row.get("gtin") or "").strip()
    categories = [row["category"].strip()] if row.get("category") else []
    countries = []
    if row.get("country"):
        countries = [c.strip() for c in row["country"].split(";") if c.strip()]
    images = [row["image_url"].strip()] if row.get("image_url") else []
    return {
        "source": "fairtrade:csv",
        "provider": "csv",
        "id": gtin or (row.get("name") or ""),
        "name": row.get("name"),
        "brand_owner": {"brand": row.get("brand")},
        "categories": categories,
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
            "source_url": _source_url,
            "fetched_at": iso_now(),
            "raw": sanitize_raw(row),
        },
    }


def search_products(
    query: str,
    brand: str | None = None,
    country: str | None = None,
    limit: int = 20,
    offset: int = 0,
    **kwargs,
) -> List[FairtradeProductV0]:
    rows = _load_rows()
    query_l = query.lower()
    out: List[FairtradeProductV0] = []
    for row in rows:
        if brand and (row.get("brand") or "").lower() != brand.lower():
            continue
        if country:
            countries = [c.strip() for c in (row.get("country") or "").split(";") if c.strip()]
            if country not in countries:
                continue
        text = " ".join(
            [row.get("name", ""), row.get("brand", ""), row.get("category", "")]
        ).lower()
        if query_l not in text:
            continue
        out.append(_map(row))
    return out[offset : offset + limit]


def get_product(product_id: str, **kwargs) -> Optional[FairtradeProductV0]:
    rows = _load_rows()
    for row in rows:
        rid = (row.get("gtin") or row.get("name") or "").strip()
        if rid == product_id:
            return _map(row)
    return None


def lookup_by_gtin(gtin: str, **kwargs) -> Optional[FairtradeProductV0]:
    rows = _load_rows()
    for row in rows:
        if (row.get("gtin") or "").strip() == gtin:
            return _map(row)
    return None
