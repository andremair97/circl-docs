"""Adapters turning raw OFF payloads into Circl's UniversalProduct v0 format."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict, List, Optional, TypedDict
from urllib.parse import urljoin

__all__ = [
    "UniversalProductV0",
    "map_off_search_result",
    "map_off_product",
]


class UniversalProductV0(TypedDict, total=False):
    source: str
    id: str
    title: Optional[str]
    brand: Optional[str]
    category: Optional[str]
    images: List[str]
    url: Optional[str]
    badges: List[str]
    sustainability: Dict[str, Any]
    provenance: Dict[str, Any]


def _first_non_empty(*values: Optional[str]) -> Optional[str]:
    for val in values:
        if val:
            return val
    return None


def _truncate(value: Any) -> Any:
    """Best effort to keep provenance payloads small."""
    if isinstance(value, str):
        return value[:200]
    if isinstance(value, list):
        return [_truncate(v) for v in value[:10]]
    if isinstance(value, dict):
        return {k: _truncate(v) for k, v in list(value.items())[:20]}
    return value


def map_off_search_result(raw: Dict[str, Any]) -> List[UniversalProductV0]:
    products = raw.get("products", [])
    mapped: List[UniversalProductV0] = []
    for prod in products:
        mapped_product = map_off_product(prod)
        if mapped_product:
            mapped.append(mapped_product)
    return mapped


def map_off_product(raw: Dict[str, Any]) -> Optional[UniversalProductV0]:
    # Handle endpoint wrapper that nests product under "product"
    if "product" in raw:
        if raw.get("status") != 1:
            return None
        raw_product = raw.get("product", {})
    else:
        raw_product = raw

    code = raw_product.get("code")
    if not code:
        return None

    product_name = _first_non_empty(
        raw_product.get("product_name"),
        raw_product.get("product_name_en"),
    )
    brands = (raw_product.get("brands") or "").split(",")
    brand = brands[0].strip() if brands and brands[0].strip() else None

    categories_tags = raw_product.get("categories_tags") or []
    category = None
    if categories_tags:
        first = categories_tags[0]
        category = first.split(":", 1)[-1] if ":" in first else first

    image_fields = [
        "image_url",
        "image_front_url",
        "image_small_url",
        "image_front_small_url",
    ]
    images = [raw_product[f] for f in image_fields if isinstance(raw_product.get(f), str)]

    labels = raw_product.get("labels_tags") or []
    ecoscore = raw_product.get("ecoscore_grade")
    nutriscore = raw_product.get("nutriscore_grade")
    badges = [*labels]
    for score in (ecoscore, nutriscore):
        if score:
            badges.append(score)

    source_url = raw_product.get("url") or f"https://world.openfoodfacts.org/product/{code}"
    provenance = {
        "source_url": source_url,
        "fetched_at": datetime.utcnow().isoformat() + "Z",
        "raw": _truncate(raw_product),
    }

    sustainability = {
        "eco_score": ecoscore,
        "nutri_score": nutriscore,
        "labels": labels,
    }

    return UniversalProductV0(
        source="openfoodfacts",
        id=code,
        title=product_name,
        brand=brand,
        category=category,
        images=images,
        url=source_url,
        badges=badges,
        sustainability=sustainability,
        provenance=provenance,
    )
