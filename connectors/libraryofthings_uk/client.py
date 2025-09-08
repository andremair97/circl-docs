"""Provider dispatcher for Library of Things (UK) connectors.

A thin wrapper that routes calls to the appropriate provider module. Keeping the
logic here avoids leaking provider-specific behaviour to callers and makes the
connector pluggable.
"""

from __future__ import annotations

from typing import List

from .adapter import UniversalBorrowV0
from .providers import lendengine_stub, lot_stub, myturn

__all__ = ["ProviderNotAvailableError", "search_items", "get_item"]


class ProviderNotAvailableError(Exception):
    """Raised when a requested provider is not implemented."""


_PROVIDERS = {
    "myturn": myturn,
    "lendengine": lendengine_stub,
    "lot": lot_stub,
}


def search_items(
    provider: str,
    query: str,
    limit: int = 20,
    offset: int = 0,
    **kwargs,
) -> List[UniversalBorrowV0]:
    """Dispatch to ``provider.search_items`` and return normalized items."""

    if provider not in _PROVIDERS:
        raise ProviderNotAvailableError(provider)
    mod = _PROVIDERS[provider]
    return mod.search_items(query, limit=limit, offset=offset, **kwargs)


def get_item(provider: str, item_id: str, **kwargs) -> UniversalBorrowV0 | None:
    """Dispatch to ``provider.get_item`` and return a normalized item."""

    if provider not in _PROVIDERS:
        raise ProviderNotAvailableError(provider)
    mod = _PROVIDERS[provider]
    return mod.get_item(item_id, **kwargs)
