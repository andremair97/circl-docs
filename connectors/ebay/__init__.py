"""eBay Browse API connector.

This package provides a minimal client, adapter and CLI for interacting with
the eBay Browse API. It is intentionally self-contained and does not depend on
other modules in this repository to avoid cross-PR coupling.
"""

from .client import EbayClient, EbayHttpError, EbayParseError
from .adapter import (
    UniversalListingV0,
    map_item_detail,
    map_item_summary_search,
)

__all__ = [
    "EbayClient",
    "EbayHttpError",
    "EbayParseError",
    "UniversalListingV0",
    "map_item_detail",
    "map_item_summary_search",
]
