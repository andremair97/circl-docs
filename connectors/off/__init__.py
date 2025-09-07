"""Open Food Facts connector.

This package provides a minimal client and adapter for interacting with
Open Food Facts (OFF). It is deliberately self-contained and avoids
external dependencies.
"""

from .client import (
    search_off,
    get_product,
    OFFHttpError,
    OFFParseError,
)
from .adapter import (
    UniversalProductV0,
    map_off_product,
    map_off_search_result,
)

__all__ = [
    "search_off",
    "get_product",
    "OFFHttpError",
    "OFFParseError",
    "UniversalProductV0",
    "map_off_product",
    "map_off_search_result",
]
