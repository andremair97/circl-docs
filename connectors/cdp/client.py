"""Provider dispatcher and tiny CSV/HTTP helpers for CDP Scores."""

from __future__ import annotations

import csv
import io
import os
import random
import time
import urllib.error
import urllib.request
from typing import Dict, List

USER_AGENT = "circl-cdp-connector/0.1 (+https://github.com/andremair97/circl-docs)"


class ProviderNotAvailableError(Exception):
    """Raised when an unknown provider is requested."""


_tokens: float = 0.0
_last: float = time.monotonic()


def _throttle() -> None:
    """Simple token-bucket rate limiter for HTTP providers."""

    global _tokens, _last
    rate = float(os.getenv("CDP_REQUESTS_PER_SEC", "4"))
    capacity = max(rate, 1)
    now = time.monotonic()
    elapsed = now - _last
    _tokens = min(capacity, _tokens + elapsed * rate)
    if _tokens < 1:
        wait = (1 - _tokens) / rate
        time.sleep(wait + random.uniform(0, 0.1))
        now = time.monotonic()
        elapsed = now - _last
        _tokens = min(capacity, _tokens + elapsed * rate)
    _tokens -= 1
    _last = now


def http_get(url: str) -> tuple[bytes, str]:
    """Fetch ``url`` with a custom ``User-Agent`` and return ``(data, content_type)``."""

    _throttle()
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "text/csv, application/json",
    }
    req = urllib.request.Request(url, headers=headers)
    timeout = float(os.getenv("CDP_TIMEOUT_SECONDS", "10"))
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        status = getattr(resp, "status", resp.getcode())
        if status != 200:
            raise urllib.error.URLError(f"HTTP {status}")
        content_type = resp.headers.get("Content-Type", "")
        data = resp.read()
    return data, content_type


def read_csv(text: str) -> List[Dict[str, str]]:
    """Parse CSV ``text`` into a list of dict rows."""

    reader = csv.DictReader(io.StringIO(text))
    return list(reader)


def _get_provider(name: str):
    if name == "csv_local":
        from .providers import csv_local as mod
    elif name == "csv_http":
        from .providers import csv_http as mod
    else:
        raise ProviderNotAvailableError(name)
    return mod


def search_scores(
    provider: str,
    query: str,
    year: int | None = None,
    limit: int = 20,
    offset: int = 0,
    **kwargs,
) -> List[Dict]:
    """Dispatch ``search_scores`` to the chosen provider."""

    mod = _get_provider(provider)
    return mod.search_scores(query, year=year, limit=limit, offset=offset, **kwargs)


def get_org(
    provider: str,
    org_key: str,
    year: int | None = None,
    **kwargs,
) -> Dict | None:
    """Dispatch ``get_org`` to the chosen provider."""

    mod = _get_provider(provider)
    return mod.get_org(org_key, year=year, **kwargs)
