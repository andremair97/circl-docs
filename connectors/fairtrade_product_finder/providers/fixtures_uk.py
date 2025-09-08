"""Fixture provider for the UK Fairtrade Product Finder."""

from __future__ import annotations

import json
import os
from typing import Dict, List, Optional

from ..adapter import FairtradeProductV0, sanitize_raw, iso_now

__all__ = ["search_products", "get_product", "lookup_by_gtin"]

_FIXTURE_PATH = os.path.join(
    os.path.dirname(__file__), "..", "fixtures", "uk_directory.json"
)
_data: Optional[List[Dict]] = None


def _load() -> List[Dict]:
    global _data
    if _data is None:
        with open(_FIXTURE_PATH, "r", encoding="utf-8") as fh:
            _data = json.load(fh)
    return _data


def _map(item: Dict) -> FairtradeProductV0:
    return {
        "source": "fairtrade:uk-fixtures",
        "provider": "fixtures_uk",
        "id": str(item.get("id", "")),
        "name": item.get("name"),
        "brand_owner": {"brand": item.get("brand")},
        "categories": [item.get("category")] if item.get("category") else [],
        "product_ids": {"gtins": item.get("gtins", [])},
        "country_markets": item.get("country_markets", []),
        "images": item.get("images", []),
        "url": item.get("url"),
        "price": {},
        "certification": {
            "scheme": "Fairtrade",
            "floid": item.get("floid"),
            "licensee": item.get("licensee"),
            "status": item.get("status"),
            "valid_from": item.get("valid_from"),
            "valid_to": item.get("valid_to"),
            "scope": "UK",
        },
        "provenance": {
            "source_url": item.get("url"),
            "fetched_at": iso_now(),
            "raw": sanitize_raw(item),
        },
    }


def search_products(
    query: str,
    brand: str | None = None,
    country: str | None = "UK",
    limit: int = 20,
    offset: int = 0,
    **kwargs,
) -> List[FairtradeProductV0]:
    data = _load()
    query_l = query.lower()
    out: List[FairtradeProductV0] = []
    for item in data:
        if brand and item.get("brand", "").lower() != brand.lower():
            continue
        if country and country not in item.get("country_markets", []):
            continue
        text = " ".join(
            [item.get("name", ""), item.get("brand", ""), item.get("category", "")]
        ).lower()
        if query_l not in text:
            continue
        out.append(_map(item))
    return out[offset : offset + limit]


def get_product(product_id: str, **kwargs) -> Optional[FairtradeProductV0]:
    for item in _load():
        if str(item.get("id")) == str(product_id):
            return _map(item)
    return None


def lookup_by_gtin(gtin: str, **kwargs) -> Optional[FairtradeProductV0]:
    for item in _load():
        if gtin in item.get("gtins", []):
            return _map(item)
    return None
