"""Provider dispatcher and category registry for ENERGY STAR."""

from __future__ import annotations

import os
from typing import Dict

from .providers import socrata

__all__ = [
    "CategoryNotSupportedError",
    "CATEGORIES",
    "search_items",
    "get_item",
]


class CategoryNotSupportedError(Exception):
    """Raised when a requested category is not in the registry."""


_REGISTRY: Dict[str, Dict[str, str]] = {
    "televisions": {
        "dataset_id": "pd96-rr3d",
        "name": "ENERGY STAR Certified Televisions",
    },
    "computers": {
        "dataset_id": "j7nq-iepp",
        "name": "ENERGY STAR Certified Computers",
    },
    "dehumidifiers": {
        "dataset_id": "mgiu-hu4z",
        "name": "ENERGY STAR Certified Dehumidifiers",
    },
    "heat_pumps": {
        "dataset_id": "w7cv-9xjt",
        "name": "ENERGY STAR Certified Air-Source Heat Pumps",
    },
}

CATEGORIES = sorted(_REGISTRY)


def _category_info(category: str) -> Dict[str, str]:
    try:
        info = _REGISTRY[category]
    except KeyError:  # pragma: no cover - exercised in unit tests
        raise CategoryNotSupportedError(category)
    base = os.getenv("ENERGY_STAR_BASE", "https://data.energystar.gov")
    dataset_url = f"{base}/d/{info['dataset_id']}"
    return {**info, "dataset_url": dataset_url}


def search_items(
    category: str,
    q: str | None = None,
    limit: int = 20,
    offset: int = 0,
    **kwargs,
) -> list[dict]:
    """Search within ``category`` and return normalized items."""

    info = _category_info(category)
    return socrata.search_items(
        category,
        info["dataset_id"],
        info["dataset_url"],
        q=q,
        limit=limit,
        offset=offset,
        **kwargs,
    )


def get_item(category: str, item_id: str, **kwargs) -> dict | None:
    """Fetch a single item by ``item_id`` within ``category``."""

    info = _category_info(category)
    return socrata.get_item(
        category,
        info["dataset_id"],
        info["dataset_url"],
        item_id,
        **kwargs,
    )
