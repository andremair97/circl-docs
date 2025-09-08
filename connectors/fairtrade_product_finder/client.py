"""Provider dispatcher for the Fairtrade Product Finder connector."""

from __future__ import annotations

from typing import List, Dict, Optional

from .providers import fixtures_uk, fixtures_global, csv_provider

__all__ = [
    "ProviderNotAvailableError",
    "search_products",
    "get_product",
    "lookup_by_gtin",
]


class ProviderNotAvailableError(Exception):
    """Raised when a provider is not available."""


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
    """Dispatch ``search_products`` to ``providers.{provider}``."""

    mod = _get_provider(provider)
    return mod.search_products(
        query, brand=brand, country=country, limit=limit, offset=offset, **kwargs
    )


def get_product(provider: str, product_id: str, **kwargs) -> Optional[Dict]:
    """Dispatch ``get_product`` to ``providers.{provider}``."""

    mod = _get_provider(provider)
    return mod.get_product(product_id, **kwargs)


def lookup_by_gtin(provider: str, gtin: str, **kwargs) -> Optional[Dict]:
    """Convenience lookup by GTIN for ``provider``."""

    mod = _get_provider(provider)
    func = getattr(mod, "lookup_by_gtin", None)
    if func is None:
        return None
    return func(gtin, **kwargs)
