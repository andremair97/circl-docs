"""Open Food Facts HTTP client.

Uses standard library ``urllib`` to talk to OFF endpoints while respecting
basic rate limiting. A custom User-Agent is required by OFF's usage policy:
https://support.openfoodfacts.org/help/en/.

Endpoints documented:
- Search API v2: https://world.openfoodfacts.org/api/v2/search
- Product API v0: https://world.openfoodfacts.org/api/v0/product/{barcode}.json
"""

from __future__ import annotations

import json
import os
import random
import time
import urllib.parse
import urllib.request
from typing import Dict, Any, List, Optional

__all__ = ["search_off", "get_product", "OFFHttpError", "OFFParseError"]

USER_AGENT = "circl-off-connector/0.1 (+https://github.com/andremair97/circl-docs)"


class OFFHttpError(Exception):
    """Raised when an HTTP error occurs communicating with OFF."""


class OFFParseError(Exception):
    """Raised when the OFF response body cannot be parsed as JSON."""


_RATE_LIMIT_PER_SEC = float(os.getenv("OFF_RATE_LIMIT_PER_SEC", "5"))
_TIMEOUT = float(os.getenv("OFF_TIMEOUT_SECONDS", "10"))
_tokens = _RATE_LIMIT_PER_SEC
_last_refill = time.monotonic()


def _acquire_token() -> None:
    """Simple token bucket to respect OFF rate limits with jitter."""
    global _tokens, _last_refill
    now = time.monotonic()
    elapsed = now - _last_refill
    _last_refill = now
    _tokens = min(_RATE_LIMIT_PER_SEC, _tokens + elapsed * _RATE_LIMIT_PER_SEC)
    if _tokens < 1:
        sleep_for = (1 - _tokens) / _RATE_LIMIT_PER_SEC
        time.sleep(sleep_for + random.uniform(0, 0.1))
        _tokens = 0
        _last_refill = time.monotonic()
    else:
        _tokens -= 1


def _request_json(url: str) -> Dict[str, Any]:
    """Perform a GET request and parse JSON.

    Raises:
        OFFHttpError: if the request fails or returns non-200.
        OFFParseError: if the body is not valid JSON.
    """

    _acquire_token()
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=_TIMEOUT) as resp:
            if resp.status != 200:
                raise OFFHttpError(f"OFF HTTP {resp.status}: {url}")
            body = resp.read()
    except Exception as exc:  # urllib only exposes URLError/HTTPError
        raise OFFHttpError(str(exc)) from exc
    try:
        return json.loads(body.decode("utf-8"))
    except json.JSONDecodeError as exc:
        raise OFFParseError(str(exc)) from exc


def search_off(
    query: str,
    page_size: int = 20,
    page: int = 1,
    fields: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """Search for products on OFF.

    Args:
        query: Search term.
        page_size: Number of results per page (default 20).
        page: Page number starting from 1.
        fields: Optional list of OFF fields to request.
    """

    if page < 1:
        page = 1
    params = {
        "search_terms": query,
        "page_size": str(page_size),
        "page": str(page),
        "sort_by": "popularity_key",
        "locale": "en",
        "json": "true",
    }
    if fields:
        params["fields"] = ",".join(fields)
    encoded = urllib.parse.urlencode(params, doseq=True, safe=",")
    url = f"https://world.openfoodfacts.org/api/v2/search?{encoded}"
    return _request_json(url)


def get_product(barcode: str, fields: Optional[List[str]] = None) -> Dict[str, Any]:
    """Fetch a product by barcode from OFF."""

    params = {}
    if fields:
        params["fields"] = ",".join(fields)
    query = f"?{urllib.parse.urlencode(params)}" if params else ""
    encoded_barcode = urllib.parse.quote(barcode)
    url = f"https://world.openfoodfacts.org/api/v0/product/{encoded_barcode}.json{query}"
    return _request_json(url)
