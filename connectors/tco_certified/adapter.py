"""Normalize TCO Certified payloads into ``UniversalCertificationV0``.

Each provider maps its raw responses through ``normalize`` to produce a stable
shape for downstream consumers. Provenance keeps a truncated copy of the raw
payload so callers can audit source data without bloating memory.
"""

from __future__ import annotations

import datetime as _dt
from typing import Any, Dict, List, Optional, TypedDict

__all__ = [
    "Links",
    "Validity",
    "UniversalCertificationV0",
    "sanitize_raw",
    "iso_now",
    "coerce_date",
    "listify_gtins",
    "normalize",
]


class Links(TypedDict, total=False):
    product_finder: Optional[str]
    certificate_pdf: Optional[str]
    product_page: Optional[str]


class Validity(TypedDict, total=False):
    valid_from: Optional[str]
    valid_to: Optional[str]
    status: Optional[str]


class UniversalCertificationV0(TypedDict, total=False):
    source: str
    provider: str
    id: str
    certificate_number: Optional[str]
    generation: Optional[str]
    category: Optional[str]
    brand: Optional[str]
    model: Optional[str]
    gtins: List[str]
    validity: Validity
    links: Links
    attributes: Dict[str, Any]
    provenance: Dict[str, Any]


def iso_now() -> str:
    """Return a UTC timestamp truncated to seconds."""

    return _dt.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def coerce_date(value: Any) -> Optional[str]:
    """Return ``value`` as ISO8601 date if possible."""

    if not value:
        return None
    try:
        return str(_dt.date.fromisoformat(str(value)))
    except Exception:  # pragma: no cover - defensive
        return None


def listify_gtins(value: Any) -> List[str]:
    """Turn ``value`` into a list of GTIN strings."""

    if not value:
        return []
    if isinstance(value, list):
        items = value
    elif isinstance(value, str):
        if "|" in value:
            items = value.split("|")
        elif "," in value:
            items = value.split(",")
        else:
            items = [value]
    else:
        items = [str(value)]
    return [str(i).strip() for i in items if str(i).strip()]


def sanitize_raw(raw: Dict[str, Any], max_bytes: int = 30000) -> Dict[str, Any]:
    """Recursively trim large structures for provenance.

    ``max_bytes`` applies to string representations, providing a hard ceiling so
    oversized payloads do not leak into logs or provenance stores.
    """

    def _trim(value: Any) -> Any:
        if isinstance(value, list):
            return [_trim(v) for v in value[:20]]
        if isinstance(value, dict):
            return {k: _trim(v) for k, v in list(value.items())[:20]}
        if isinstance(value, str) and len(value.encode("utf-8")) > max_bytes:
            return value.encode("utf-8")[:max_bytes].decode("utf-8", "ignore")
        return value

    return _trim(raw)


def normalize(raw: Dict[str, Any], provider: str, source: str) -> UniversalCertificationV0:
    """Normalise ``raw`` dict into ``UniversalCertificationV0``."""

    gtins = listify_gtins(raw.get("gtins"))
    validity = {
        "valid_from": coerce_date(raw.get("valid_from")),
        "valid_to": coerce_date(raw.get("valid_to")),
        "status": raw.get("status"),
    }
    links = {
        k: raw.get(k)
        for k in ["product_finder", "certificate_pdf", "product_page"]
        if raw.get(k)
    }
    item: UniversalCertificationV0 = {
        "source": source,
        "provider": provider,
        "id": raw.get("certificate_number")
        or "|".join(filter(None, [raw.get("brand"), raw.get("model")]))
        or (gtins[0] if gtins else ""),
        "certificate_number": raw.get("certificate_number"),
        "generation": raw.get("generation"),
        "category": raw.get("category"),
        "brand": raw.get("brand"),
        "model": raw.get("model"),
        "gtins": gtins,
        "validity": {k: v for k, v in validity.items() if v},
        "links": links,  # type: ignore[assignment]
        "attributes": raw.get("attributes", {}),
        "provenance": {
            "source_url": raw.get("source_url"),
            "fetched_at": raw.get("fetched_at") or iso_now(),
            "raw": sanitize_raw(raw.get("raw", {})),
        },
    }
    return item
