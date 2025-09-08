"""Normalize Library of Things (UK) provider payloads to ``UniversalBorrowV0``.

The connector is intentionally lightweight and defensive so each provider can
map its responses without coupling to global schemas. Only a small subset of
data is captured for provenance and demonstration purposes.
"""

from __future__ import annotations

import datetime as _dt
import json
from typing import Dict, List, Optional, TypedDict


class Price(TypedDict, total=False):
    value: Optional[float]
    currency: Optional[str]
    per: Optional[str]


class Availability(TypedDict, total=False):
    status: Optional[str]
    nextAvailable: Optional[str]
    calendarUrl: Optional[str]


class Location(TypedDict, total=False):
    name: Optional[str]
    address: Optional[str]
    postcode: Optional[str]
    city: Optional[str]
    lat: Optional[float]
    lon: Optional[float]


class UniversalBorrowV0(TypedDict, total=False):
    source: str
    provider: str
    id: str
    title: Optional[str]
    category: Optional[str]
    images: List[str]
    url: Optional[str]
    price: Price
    deposit: Price
    availability: Availability
    location: Location
    badges: List[str]
    provenance: Dict


def iso_now() -> str:
    """Return the current UTC timestamp in ISO8601."""

    return _dt.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def sanitize_raw(raw: Dict, max_bytes: int = 30000) -> Dict:
    """Trim large values so provenance stays reasonably small.

    The function recursively truncates long strings and lists. If the resulting
    JSON blob still exceeds ``max_bytes`` the dict is pruned key by key until the
    size fits. This keeps provenance from ballooning in tests or fixtures.
    """

    def _trim(val):
        if isinstance(val, list):
            return [_trim(v) for v in val[:20]]
        if isinstance(val, dict):
            return {k: _trim(v) for k, v in list(val.items())[:20]}
        if isinstance(val, str) and len(val) > 1000:
            return val[:1000]
        return val

    sanitized = _trim(raw)
    encoded = json.dumps(sanitized, ensure_ascii=False).encode("utf-8")
    if len(encoded) <= max_bytes:
        return sanitized

    # Drop trailing keys until under the byte budget. The exact keys are not
    # important for provenance; keeping something is better than nothing.
    pruned: Dict = {}
    for key, value in sanitized.items():
        tentative = {**pruned, key: value}
        if len(json.dumps(tentative, ensure_ascii=False).encode("utf-8")) > max_bytes:
            break
        pruned = tentative
    return pruned
