"""Normalize Fairtrade sources to ``FairtradeProductV0``."""

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


def sanitize_raw(raw: dict, max_bytes: int = 30000) -> dict:
    """Trim large values so provenance stays reasonably small.

    Arrays and dictionaries are truncated to 20 items and long strings are
    shortened to 1000 characters. If the resulting JSON encoding still exceeds
    ``max_bytes`` the raw payload is discarded entirely.
    """

    def _trim(value):
        if isinstance(value, list):
            return [_trim(v) for v in value[:20]]
        if isinstance(value, dict):
            return {k: _trim(v) for k, v in list(value.items())[:20]}
        if isinstance(value, str) and len(value) > 1000:
            return value[:1000]
        return value

    trimmed = _trim(raw)
    try:
        encoded = json.dumps(trimmed).encode("utf-8")
    except Exception:
        return {}
    if len(encoded) > max_bytes:
        return {}
    return trimmed


def iso_now() -> str:
    """Return a UTC timestamp in ISO8601 format with ``Z`` suffix."""

    return _dt.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
