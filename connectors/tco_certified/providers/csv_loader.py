"""Local CSV loader for TCO Certified certificates."""

from __future__ import annotations

import csv
import os
from pathlib import Path
from typing import Any, Dict, List, Optional

from .. import adapter
from ..adapter import UniversalCertificationV0

_HEADERS = [
    "certificate_number",
    "brand",
    "model",
    "category",
    "generation",
    "valid_from",
    "valid_to",
    "status",
    "gtins",
    "product_finder",
    "certificate_pdf",
    "product_page",
    "recycled_content_pct",
]


def _load_rows(path: str | None = None) -> List[Dict[str, str]]:
    p = Path(path or os.getenv("CSV_PATH", ""))
    if not p.exists():
        raise FileNotFoundError("CSV file not found; set --path or CSV_PATH env")
    rows: List[Dict[str, str]] = []
    with p.open(newline="", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            rows.append(row)
    return rows


def _row_to_item(row: Dict[str, str]) -> UniversalCertificationV0:
    attrs: Dict[str, Any] = {}
    if row.get("recycled_content_pct"):
        try:
            attrs["recycled_content_pct"] = float(row["recycled_content_pct"])
        except ValueError:
            attrs["recycled_content_pct"] = row["recycled_content_pct"]
    return adapter.normalize(
        {
            "certificate_number": row.get("certificate_number"),
            "brand": row.get("brand"),
            "model": row.get("model"),
            "category": row.get("category"),
            "generation": row.get("generation"),
            "valid_from": row.get("valid_from"),
            "valid_to": row.get("valid_to"),
            "status": row.get("status"),
            "gtins": row.get("gtins"),
            "product_finder": row.get("product_finder"),
            "certificate_pdf": row.get("certificate_pdf"),
            "product_page": row.get("product_page"),
            "attributes": attrs,
            "raw": row,
            "source_url": None,
        },
        provider="csv",
        source="tco:csv",
    )


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
    rows = _load_rows(path)
    matches: List[UniversalCertificationV0] = []
    for row in rows:
        hay = " ".join([row.get("brand", ""), row.get("model", ""), row.get("category", "")]).lower()
        if q and q.lower() not in hay:
            continue
        if brand and brand.lower() not in row.get("brand", "").lower():
            continue
        if model and model.lower() not in row.get("model", "").lower():
            continue
        if category and category.lower() not in row.get("category", "").lower():
            continue
        if gtin and gtin not in adapter.listify_gtins(row.get("gtins")):
            continue
        matches.append(_row_to_item(row))
    return matches[offset : offset + limit]


def get_by_certificate(
    certificate_number: str,
    path: str | None = None,
    **_: Any,
) -> Optional[UniversalCertificationV0]:
    rows = _load_rows(path)
    for row in rows:
        if str(row.get("certificate_number")) == certificate_number:
            return _row_to_item(row)
    return None
