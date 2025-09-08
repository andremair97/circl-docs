"""Provider dispatcher for the Fairtrade Product Finder connector."""

from __future__ import annotations

from typing import Dict, List

from .providers import csv_provider, fixtures_global, fixtures_uk

__all__ = [
    "ProviderNotAvailableError",
    "search_products",
    "get_product",
    "lookup_by_gtin",
]


class ProviderNotAvailableError(Exception):
    """Raised when a requested provider is not implemented."""


_PROVIDERS = {
    "fixtures_uk": fixtures_uk,
    "fixtures_global": fixtures_global,
    "csv": csv_provider,
}


def _get_provider(name: str):
    try:
        return _PROVIDERS[name]
    except KeyError as exc:
        raise ProviderNotAvailableError(name) from exc


def search_products(
    provider: str,
    query: str,
    *,
    brand: str | None = None,
    country: str | None = None,
    limit: int = 20,
    offset: int = 0,
    **kwargs,
) -> List[Dict]:
    """Search products via ``provider`` and return ``List[FairtradeProductV0]``."""

    module = _get_provider(provider)
    return module.search_products(
        query,
        brand=brand,
        country=country,
        limit=limit,
        offset=offset,
        **kwargs,
    )


def get_product(provider: str, product_id: str, **kwargs) -> Dict | None:
    """Fetch a product by ``product_id`` from ``provider``."""

    module = _get_provider(provider)
    return module.get_product(product_id, **kwargs)


def lookup_by_gtin(provider: str, gtin: str, **kwargs) -> Dict | None:
    """Return the first product matching ``gtin`` from ``provider``."""

    module = _get_provider(provider)
    return module.lookup_by_gtin(gtin, **kwargs)
