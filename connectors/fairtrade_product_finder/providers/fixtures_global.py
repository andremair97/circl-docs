"""Fixture provider for the Fairtrade Product Finder (global directory)."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List

from .. import adapter

_SOURCE_URL = "https://www.fairtrade.net/products"
_FIXTURES = Path(__file__).resolve().parent.parent / "fixtures" / "global_directory.json"

with _FIXTURES.open("r", encoding="utf-8") as fh:
    _DATA: List[Dict] = json.load(fh)


def _normalize(entry: Dict) -> adapter.FairtradeProductV0:
    return {
        "source": "fairtrade:global-fixtures",
        "provider": "fixtures_global",
        "id": entry.get("id", ""),
        "name": entry.get("name"),
        "brand_owner": {
            "brand": entry.get("brand"),
            "manufacturer": entry.get("manufacturer"),
        },
        "categories": [entry.get("category")] if entry.get("category") else [],
        "product_ids": {
            "gtins": entry.get("gtins", []),
            "sku": entry.get("sku"),
        },
        "country_markets": entry.get("country_markets", []),
        "images": [entry.get("image")] if entry.get("image") else [],
        "url": entry.get("url"),
        "price": {},
        "certification": {
            "scheme": "Fairtrade",
            "floid": entry.get("floid"),
            "licensee": entry.get("licensee"),
            "status": entry.get("status"),
            "valid_from": entry.get("valid_from"),
            "valid_to": entry.get("valid_to"),
            "scope": "International",
        },
        "provenance": {
            "source_url": _SOURCE_URL,
            "fetched_at": adapter.iso_now(),
            "raw": adapter.sanitize_raw(entry),
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
    q = query.lower()
    results: List[adapter.FairtradeProductV0] = []
    for entry in _DATA:
        name = (entry.get("name") or "").lower()
        category = (entry.get("category") or "").lower()
        entry_brand = (entry.get("brand") or "").lower()
        countries = entry.get("country_markets", [])
        if q not in name and q not in category and q not in entry_brand:
            continue
        if brand and entry_brand != brand.lower():
            continue
        if country and country not in countries:
            continue
        results.append(_normalize(entry))
    return results[offset : offset + limit]


def get_product(product_id: str, **kwargs) -> adapter.FairtradeProductV0 | None:
    for entry in _DATA:
        if entry.get("id") == product_id:
            return _normalize(entry)
    return None


def lookup_by_gtin(gtin: str, **kwargs) -> adapter.FairtradeProductV0 | None:
    for entry in _DATA:
        if gtin in entry.get("gtins", []):
            return _normalize(entry)
    return None
