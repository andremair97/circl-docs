"""Adapter that normalises eBay Browse API payloads to ``UniversalListingV0``.

The goal is to keep this module self-contained so the connector can be developed
in isolation. Only a small subset of fields from the Browse API is mapped.
"""

from __future__ import annotations

import json
from copy import deepcopy
from datetime import datetime, timezone
from typing import Dict, List, Optional, TypedDict


# ---------------------------------------------------------------------------
# TypedDicts representing a lightweight, local universal listing structure
# ---------------------------------------------------------------------------


class Price(TypedDict, total=False):
    value: Optional[float]
    currency: Optional[str]


class Seller(TypedDict, total=False):
    username: Optional[str]
    feedbackScore: Optional[int]
    feedbackPercentage: Optional[float]


class Shipping(TypedDict, total=False):
    type: Optional[str]
    cost: Optional[Price]
    location: Optional[str]
    estimatedDelivery: Optional[str]


class UniversalListingV0(TypedDict, total=False):
    source: str
    id: str
    title: Optional[str]
    price: Price
    condition: Optional[str]
    images: List[str]
    url: Optional[str]
    seller: Seller
    location: Optional[str]
    shipping: Shipping
    categories: List[Dict]
    provenance: Dict
    badges: List[str]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _to_float(value: Optional[str]) -> Optional[float]:
    try:
        return float(value) if value is not None else None
    except (ValueError, TypeError):
        return None


def _truncate_raw(data: Dict, max_bytes: int = 30 * 1024) -> Dict:
    """Return ``data`` if serialised size is below ``max_bytes`` otherwise ``{}``."""

    try:
        if len(json.dumps(data)) <= max_bytes:
            return data
    except Exception:  # pragma: no cover - very unlikely
        return {}
    return {}


def _extract_common(item: Dict) -> UniversalListingV0:
    price_dict = item.get("price", {}) or {}
    price: Price = {
        "value": _to_float(price_dict.get("value")),
        "currency": price_dict.get("currency"),
    }
    images: List[str] = []
    main_image = item.get("image", {}).get("imageUrl")
    if main_image:
        images.append(main_image)
    for thumb in item.get("thumbnailImages", []) or []:
        url = thumb.get("imageUrl")
        if url:
            images.append(url)
    seller_dict = item.get("seller", {}) or {}
    seller: Seller = {
        "username": seller_dict.get("username"),
        "feedbackScore": seller_dict.get("feedbackScore"),
        "feedbackPercentage": _to_float(seller_dict.get("feedbackPercentage")),
    }
    location_dict = item.get("itemLocation", {}) or {}
    if isinstance(location_dict, dict):
        parts = [
            location_dict.get("city"),
            location_dict.get("stateOrProvince"),
            location_dict.get("country"),
        ]
        location = ", ".join(p for p in parts if p)
    else:
        location = location_dict or None
    shipping: Shipping = {}
    options = item.get("shippingOptions") or []
    if options:
        opt = options[0]
        shipping["type"] = opt.get("type") or opt.get("shippingCostType")
        cost_dict = opt.get("shippingCost") or {}
        if cost_dict:
            shipping["cost"] = {
                "value": _to_float(cost_dict.get("value")),
                "currency": cost_dict.get("currency"),
            }
        shipping["location"] = opt.get("shipToLocation")
        shipping["estimatedDelivery"] = opt.get("estimatedDelivery")
    badges: List[str] = []
    for opt in item.get("buyingOptions", []) or []:
        badges.append(f"buyingOption:{opt}")
    categories = item.get("categories", []) or []
    listing: UniversalListingV0 = {
        "source": "ebay-browse",
        "id": item.get("itemId", ""),
        "title": item.get("title"),
        "price": price,
        "condition": item.get("condition"),
        "images": images,
        "url": item.get("itemWebUrl"),
        "seller": seller,
        "location": location,
        "shipping": shipping,
        "categories": categories,
        "badges": badges,
    }
    return listing


def map_item_summary_search(raw: Dict) -> List[UniversalListingV0]:
    """Map ``item_summary/search`` payload to ``UniversalListingV0`` list."""

    results: List[UniversalListingV0] = []
    for item in raw.get("itemSummaries", []) or []:
        listing = _extract_common(item)
        listing["provenance"] = {
            "source_url": item.get("itemWebUrl"),
            "fetched_at": datetime.now(timezone.utc).isoformat(),
            "raw": _truncate_raw(deepcopy(item)),
        }
        results.append(listing)
    return results


def map_item_detail(raw: Dict) -> Optional[UniversalListingV0]:
    """Map ``item/{id}`` payload to ``UniversalListingV0``."""

    if not raw:
        return None
    listing = _extract_common(raw)
    listing["provenance"] = {
        "source_url": raw.get("itemWebUrl"),
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "raw": _truncate_raw(deepcopy(raw)),
    }
    return listing
