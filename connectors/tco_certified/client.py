"""Provider dispatcher for the TCO Certified connector.

This thin layer routes calls to individual provider modules. New providers can
be added without touching the public interface. The dispatcher validates that a
requested provider is available and exposes a uniform API that returns
``UniversalCertificationV0`` items.
"""

from __future__ import annotations

from importlib import import_module
from typing import Any, Callable, Dict, List

from .adapter import UniversalCertificationV0

__all__ = [
    "ProviderNotAvailableError",
    "search",
    "get_by_certificate",
]


class ProviderNotAvailableError(Exception):
    """Raised when a provider is not known to the dispatcher."""


# Map provider names to import paths within this package.
_PROVIDERS: Dict[str, str] = {
    "gtin-api": "connectors.tco_certified.providers.gtin_api",
    "csv": "connectors.tco_certified.providers.csv_loader",
    "productfinder-stub": "connectors.tco_certified.providers.productfinder_stub",
}


def _get_provider(name: str) -> Any:
    module_path = _PROVIDERS.get(name)
    if not module_path:
        raise ProviderNotAvailableError(name)
    return import_module(module_path)


def search(
    provider: str,
    q: str | None = None,
    brand: str | None = None,
    model: str | None = None,
    category: str | None = None,
    gtin: str | None = None,
    limit: int = 20,
    offset: int = 0,
    **kwargs: Any,
) -> List[UniversalCertificationV0]:
    """Dispatch ``search`` calls to a provider.

    Additional ``kwargs`` are forwarded verbatim. Providers are expected to be
    forgiving and return best-effort normalised objects even when some optional
    fields are missing.
    """

    module = _get_provider(provider)
    func: Callable[..., List[UniversalCertificationV0]] = getattr(module, "search")
    return func(
        q=q,
        brand=brand,
        model=model,
        category=category,
        gtin=gtin,
        limit=limit,
        offset=offset,
        **kwargs,
    )


def get_by_certificate(
    provider: str,
    certificate_number: str,
    **kwargs: Any,
) -> UniversalCertificationV0 | None:
    """Dispatch ``get_by_certificate`` calls to a provider."""

    module = _get_provider(provider)
    func: Callable[..., UniversalCertificationV0 | None] = getattr(
        module, "get_by_certificate"
    )
    return func(certificate_number=certificate_number, **kwargs)
