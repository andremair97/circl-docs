"""Provider dispatcher for certified lists."""

from __future__ import annotations

from typing import Dict, List

from .providers import eu_ecolabel, green_seal

PROVIDERS = {
    "eu_ecolabel": eu_ecolabel,
    "green_seal": green_seal,
}


class ProviderNotAvailableError(Exception):
    pass


def _get_provider(name: str):
    try:
        return PROVIDERS[name]
    except KeyError as exc:
        raise ProviderNotAvailableError(name) from exc


def search_certified(provider: str, query: str, limit: int = 20, offset: int = 0, **kwargs) -> List[Dict]:
    """Dispatch to provider search."""

    mod = _get_provider(provider)
    return mod.search_certified(query, limit=limit, offset=offset, **kwargs)


def get_certificate(provider: str, cert_id: str, **kwargs) -> Dict | None:
    """Dispatch to provider item fetch."""

    mod = _get_provider(provider)
    return mod.get_certificate(cert_id, **kwargs)
