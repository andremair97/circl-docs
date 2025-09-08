"""Normalize Fairtrade Product Finder payloads to ``FairtradeProductV0``.

The adapter keeps the schema self-contained so the connector has no cross-PR
coupling. Helpers are intentionally small and conservative to avoid large
provenance payloads.
"""

from __future__ import annotations

import datetime as _dt
import json
from typing import Dict, List, Optional, TypedDict


class Certification(TypedDict, total=False):
    scheme: str
    floid: Optional[str]
    licensee: Optional[str]
    status: Optional[str]
    valid_from: Optional[str]
    valid_to: Optional[str]
    scope: Optional[str]


class ProductId(TypedDict, total=False):
    gtins: List[str]
    sku: Optional[str]


class Price(TypedDict, total=False):
    value: Optional[float]
    currency: Optional[str]
    unit: Optional[str]


class BrandOwner(TypedDict, total=False):
    brand: Optional[str]
    manufacturer: Optional[str]


class Provenance(TypedDict, total=False):
    source_url: Optional[str]
    fetched_at: Optional[str]
    raw: Dict


class FairtradeProductV0(TypedDict, total=False):
    source: str
    provider: str
    id: str
    name: Optional[str]
    brand_owner: BrandOwner
    categories: List[str]
    product_ids: ProductId
    country_markets: List[str]
    images: List[str]
    url: Optional[str]
    price: Price
    certification: Certification
    provenance: Provenance


def iso_now() -> str:
    """Return a UTC ISO8601 timestamp with ``Z`` suffix."""

    return _dt.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def _trim(value, max_items: int = 20, max_str: int = 1000):
    """Recursively trim ``value`` to keep provenance bounded."""

    if isinstance(value, list):
        return [_trim(v, max_items, max_str) for v in value[:max_items]]
    if isinstance(value, dict):
        return {
            k: _trim(v, max_items, max_str)
            for k, v in list(value.items())[:max_items]
        }
    if isinstance(value, str) and len(value) > max_str:
        return value[:max_str]
    return value


def sanitize_raw(raw: Dict, max_bytes: int = 30000) -> Dict:
    """Truncate large structures so the JSON encoded size stays within ``max_bytes``.

    The function does a best-effort trim; it never raises and returns a copy of
    ``raw`` that is safe to JSON‑encode in provenance.
    """

    trimmed = _trim(raw)
    encoded = json.dumps(trimmed, ensure_ascii=False)
    if len(encoded.encode("utf-8")) <= max_bytes:
        return trimmed
    # If still too large, trim more aggressively.
    trimmed = _trim(trimmed, max_items=10, max_str=200)
    encoded = json.dumps(trimmed, ensure_ascii=False)
    if len(encoded.encode("utf-8")) <= max_bytes:
        return trimmed
    return {}  # Fallback to empty if impossible to keep under the limit.
