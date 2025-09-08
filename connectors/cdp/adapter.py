"""Normalize CDP corporate scores to ``UniversalESGScoreV0``.

The adapter keeps the mapping intentionally small so the connector remains
self-contained and avoids pulling in global schemas. Raw payloads are trimmed to
keep provenance lightweight.
"""

from __future__ import annotations

import datetime as _dt
import json
from typing import Any, Dict, Optional, TypedDict


class Scores(TypedDict, total=False):
    climate_change: Optional[str]
    water_security: Optional[str]
    forests: Optional[str]


class Links(TypedDict, total=False):
    company: Optional[str]
    cdp_profile: Optional[str]
    source_csv: Optional[str]


class UniversalESGScoreV0(TypedDict, total=False):
    source: str
    provider: str
    org_name: str
    org_id: Optional[str]
    year: Optional[int]
    country: Optional[str]
    sector: Optional[str]
    scores: Scores
    disclosure_status: Optional[str]
    links: Links
    provenance: Dict[str, Any]


def iso_now() -> str:
    """Return current UTC time in ISO8601 with ``Z``."""

    return _dt.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def _truncate(value):
    """Shallowly trim long strings/lists for provenance."""

    if isinstance(value, str) and len(value) > 1000:
        return value[:1000]
    if isinstance(value, list) and len(value) > 50:
        return value[:50]
    return value


def sanitize_raw(raw: dict, max_bytes: int = 30000) -> dict:
    """Trim ``raw`` so its serialized form stays under ``max_bytes``."""

    trimmed = {k: _truncate(v) for k, v in raw.items()}
    blob = json.dumps(trimmed, ensure_ascii=False).encode("utf-8")
    if len(blob) > max_bytes:
        return {}
    return trimmed


def map_row(row: dict, provider: str, source_url: str | None) -> UniversalESGScoreV0:
    """Map a raw score row into ``UniversalESGScoreV0``."""

    scores: Scores = {}
    if row.get("score_climate"):
        scores["climate_change"] = row.get("score_climate")
    if row.get("score_water"):
        scores["water_security"] = row.get("score_water")
    if row.get("score_forests"):
        scores["forests"] = row.get("score_forests")

    links: Links = {}
    if row.get("company_url"):
        links["company"] = row.get("company_url")
    if row.get("cdp_profile"):
        links["cdp_profile"] = row.get("cdp_profile")
    if source_url:
        links["source_csv"] = source_url

    year: Optional[int] = None
    if row.get("year"):
        try:
            year = int(row["year"])  # type: ignore[assignment]
        except ValueError:
            year = None

    item: UniversalESGScoreV0 = {
        "source": "cdp:scores",
        "provider": provider,
        "org_name": row.get("org_name") or row.get("organization") or "",
        "org_id": row.get("org_id") or row.get("cdp_id") or row.get("lei"),
        "year": year,
        "country": row.get("country"),
        "sector": row.get("sector"),
        "scores": scores,
        "disclosure_status": row.get("disclosure_status"),
        "links": links,
        "provenance": {
            "source_url": source_url,
            "fetched_at": iso_now(),
            "raw": sanitize_raw(row),
        },
    }
    return item
