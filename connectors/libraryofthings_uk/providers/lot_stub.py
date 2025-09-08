"""Fixture-backed stub for the Library of Things UK platform.

This stub demonstrates the connector shape without relying on the real
Library of Things platform which currently lacks an open API. It reads from a
small JSON fixture bundled with the repo.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List, Optional

from ..adapter import Availability, Location, Price, UniversalBorrowV0, iso_now, sanitize_raw

_FIXTURE = Path(__file__).resolve().parent.parent / "fixtures" / "lot_stub_inventory.json"


def _load() -> List[Dict]:
    with open(_FIXTURE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data.get("items", [])


def _map(item: Dict) -> UniversalBorrowV0:
    images = [item["image"]] if item.get("image") else []
    price: Price = {"value": float(item.get("price", 0)), "currency": "GBP", "per": "day"}
    deposit: Price = {"value": float(item.get("deposit", 0)), "currency": "GBP"}
    availability: Availability = {
        "status": item.get("status"),
        "nextAvailable": item.get("nextAvailable"),
    }
    location: Location = {
        "name": item.get("location"),
        "postcode": item.get("postcode"),
    }
    return {
        "source": "lot-uk:platform",
        "provider": "lot",
        "id": str(item.get("id")),
        "title": item.get("title"),
        "category": item.get("category"),
        "images": images,
        "url": item.get("url"),
        "price": price,
        "deposit": deposit,
        "availability": availability,
        "location": location,
        "badges": item.get("badges", []),
        "provenance": {
            "source_url": "fixture://lot_stub_inventory",
            "fetched_at": iso_now(),
            "raw": sanitize_raw(item),
        },
    }


def search_items(query: str, limit: int = 20, offset: int = 0, **_: dict) -> List[UniversalBorrowV0]:
    items = _load()
    filtered = [i for i in items if query.lower() in i.get("title", "").lower()]
    sliced = filtered[offset : offset + limit]
    return [_map(i) for i in sliced]


def get_item(item_id: str, **_: dict) -> Optional[UniversalBorrowV0]:
    for item in _load():
        if str(item.get("id")) == str(item_id):
            return _map(item)
    return None
