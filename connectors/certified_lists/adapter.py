"""Normalisation helpers for certified lists connectors.

Defines a minimal UniversalCertificationV0 shape used by provider modules so we
avoid coupling to global schemas. Only standard library types are used.
"""

from __future__ import annotations

import json
from typing import Dict, List, Optional, TypedDict
from datetime import datetime, timezone


class Organization(TypedDict, total=False):
    name: Optional[str]
    country: Optional[str]
    website: Optional[str]


class CertificateStatus(TypedDict, total=False):
    status: Optional[str]  # "active" | "expired" | "suspended" | "unknown"
    issued: Optional[str]
    expires: Optional[str]
    standard: Optional[str]


class Product(TypedDict, total=False):
    brand: Optional[str]
    name: Optional[str]
    model: Optional[str]
    gtin: Optional[str]
    categories: List[str]


class UniversalCertificationV0(TypedDict, total=False):
    source: str
    provider: str
    certificate_id: str
    product: Product
    organization: Organization
    status: CertificateStatus
    marketplace_badges: List[str]
    urls: Dict[str, str]
    provenance: Dict


def iso_now() -> str:
    """Return current UTC time in ISO8601 format."""

    return datetime.utcnow().replace(tzinfo=timezone.utc).isoformat().replace("+00:00", "Z")


def _sanitize(obj, max_bytes: int) -> object:
    """Recursively trim objects so their JSON representation stays within bounds."""

    if isinstance(obj, str):
        return obj[:max_bytes] + ("..." if len(obj) > max_bytes else "")
    if isinstance(obj, list):
        out = []
        for item in obj:
            out.append(_sanitize(item, max_bytes))
            if len(json.dumps(out, ensure_ascii=False)) > max_bytes:
                out[-1] = "..."
                break
        return out
    if isinstance(obj, dict):
        out = {}
        for k, v in obj.items():
            out[k] = _sanitize(v, max_bytes)
            if len(json.dumps(out, ensure_ascii=False)) > max_bytes:
                out[k] = "..."
                break
        return out
    return obj


def sanitize_raw(raw: Dict, max_bytes: int = 30000) -> Dict:
    """Return a copy of *raw* with large fields truncated.

    This helps keep provenance blobs manageable. The function best-effort trims
    very large strings and arrays; if the final payload still exceeds the
    threshold, it returns a tiny fallback blob with a truncated JSON string.
    """

    sanitized = _sanitize(raw, max_bytes)
    text = json.dumps(sanitized, ensure_ascii=False)
    if len(text) > max_bytes:
        return {"truncated": text[:max_bytes] + "..."}
    return sanitized
