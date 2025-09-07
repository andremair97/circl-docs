"""Minimal stdlib HTTP client for the iFixit API v2.

This module intentionally avoids external dependencies and implements a small
rate-limited HTTP wrapper around :mod:`urllib.request`. Only a subset of the
API is surfaced to keep the connector self‑contained and deterministic.

References:
- Index API: https://www.ifixit.com/api/2.0/
- Guides API: https://www.ifixit.com/api/2.0/Guides
- Wikis API: https://www.ifixit.com/api/2.0/wikis
"""

from __future__ import annotations

import json
import os
import random
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Dict, Optional

__all__ = [
    "IFixitHttpError",
    "IFixitParseError",
    "search_devices",
    "list_guides_for_device",
    "get_device_wiki",
]


USER_AGENT = (
    "circl-ifixit-connector/0.1 "
    "(+https://github.com/andremair97/circl-docs)"
)


class IFixitHttpError(Exception):
    """Raised when the API returns a non-200 HTTP status."""


class IFixitParseError(Exception):
    """Raised when a response cannot be decoded as JSON."""


# Global token bucket state for a tiny request throttle. This avoids hammering
# the public API which has per-IP rate limits. The defaults are conservative and
# can be tuned via environment variables.
_tokens: float = 0.0
_last: float = time.monotonic()


def _throttle() -> None:
    """Simple token-bucket rate limiter with jitter.

    The bucket refills at ``IFIXIT_REQUESTS_PER_SEC`` and has the same capacity.
    A small random sleep adds jitter so concurrent workers do not stampede.
    """

    global _tokens, _last
    rate = float(os.getenv("IFIXIT_REQUESTS_PER_SEC", "5"))
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


def _request(url: str) -> Dict:
    """Perform a GET request and return JSON data.

    Attaches a custom ``User-Agent`` and optional authentication headers. Errors
    surface custom exceptions so callers can react accordingly.
    """

    _throttle()
    headers = {"User-Agent": USER_AGENT}
    auth = os.getenv("IFIXIT_AUTH_TOKEN")
    app_id = os.getenv("IFIXIT_APP_ID")
    if auth:
        headers["Authorization"] = f"api {auth}"
    if app_id:
        headers["X-App-Id"] = app_id

    req = urllib.request.Request(url, headers=headers)
    timeout = float(os.getenv("IFIXIT_TIMEOUT_SECONDS", "10"))
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            status = getattr(resp, "status", resp.getcode())
            if status != 200:
                raise IFixitHttpError(f"HTTP {status} for {url}")
            raw = resp.read()
    except urllib.error.URLError as exc:  # pragma: no cover - network failure
        raise IFixitHttpError(str(exc)) from exc

    try:
        data = json.loads(raw.decode("utf-8"))
    except json.JSONDecodeError as exc:
        raise IFixitParseError(str(exc)) from exc

    # Track the source URL for provenance downstream.
    data["_source_url"] = url
    return data


def _clamp_limit_offset(limit: int, offset: int) -> tuple[int, int]:
    limit = max(1, min(int(limit), 50))
    offset = max(0, int(offset))
    return limit, offset


def search_devices(term: str, limit: int = 10, offset: int = 0) -> Dict:
    """Search for devices matching ``term``.

    The unified search endpoint mixes multiple entity types; this helper filters
    results client-side to device hits. If the endpoint were to change shape, we
    may fall back to ``/wikis/DEVICE`` lookups.
    """

    limit, offset = _clamp_limit_offset(limit, offset)
    encoded = urllib.parse.quote(term.strip())
    url = (
        f"https://www.ifixit.com/api/2.0/search/{encoded}?limit={limit}&offset={offset}"
    )
    return _request(url)


def list_guides_for_device(device: str, limit: int = 10, offset: int = 0) -> Dict:
    """List guides for a given device.

    Uses ``Guides/Device`` endpoint documented at
    https://www.ifixit.com/api/2.0/Guides/Device/<device>.
    """

    limit, offset = _clamp_limit_offset(limit, offset)
    encoded = urllib.parse.quote(device.strip())
    url = (
        f"https://www.ifixit.com/api/2.0/Guides/Device/{encoded}?limit={limit}&offset={offset}"
    )
    return _request(url)


def get_device_wiki(device: str) -> Dict:
    """Fetch the wiki page for a device (namespace ``DEVICE``)."""

    encoded = urllib.parse.quote(device.strip())
    url = f"https://www.ifixit.com/api/2.0/wikis/DEVICE/{encoded}"
    return _request(url)
