"""Fixture-only stub mimicking TCO Certified Product Finder exports."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Optional

from .. import adapter
from ..adapter import UniversalCertificationV0

_FIXTURE = Path(__file__).resolve().parents[1] / "fixtures/productfinder_stub_inventory.json"


def _load_inventory(path: str | None = None) -> List[Dict[str, Any]]:
    p = Path(path) if path else _FIXTURE
    text = p.read_text(encoding="utf-8")
    return json.loads(text)


def _match(item: Dict[str, Any], q: str | None, brand: str | None, model: str | None, category: str | None, gtin: str | None) -> bool:
    if q:
        hay = " ".join([
            item.get("brand", ""),
            item.get("model", ""),
            item.get("category", ""),
        ]).lower()
        if q.lower() not in hay:
            return False
    if brand and brand.lower() not in str(item.get("brand", "")).lower():
        return False
    if model and model.lower() not in str(item.get("model", "")).lower():
        return False
    if category and category.lower() not in str(item.get("category", "")).lower():
        return False
    if gtin and gtin not in adapter.listify_gtins(item.get("gtins")):
        return False
    return True


def search(
    q: str | None = None,
    brand: str | None = None,
    model: str | None = None,
    category: str | None = None,
    gtin: str | None = None,
    limit: int = 20,
    offset: int = 0,
    path: str | None = None,
    **_: Any,
) -> List[UniversalCertificationV0]:
    inventory = _load_inventory(path)
    matches: List[UniversalCertificationV0] = []
    for raw in inventory:
        if not _match(raw, q, brand, model, category, gtin):
            continue
        item = adapter.normalize(
            raw | {"raw": raw, "source_url": "https://productfinder.tco"},
            "productfinder-stub",
            "tco:productfinder-stub",
        )
        matches.append(item)
    return matches[offset : offset + limit]


def get_by_certificate(
    certificate_number: str,
    path: str | None = None,
    **_: Any,
) -> Optional[UniversalCertificationV0]:
    inventory = _load_inventory(path)
    for raw in inventory:
        if str(raw.get("certificate_number")) == certificate_number:
            return adapter.normalize(
                raw | {"raw": raw, "source_url": "https://productfinder.tco"},
                "productfinder-stub",
                "tco:productfinder-stub",
            )
    return None
