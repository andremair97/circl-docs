"""Socrata provider for ENERGY STAR datasets."""

from __future__ import annotations

import json
import os
import random
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, List

from .. import adapter

__all__ = [
    "SocrataHttpError",
    "SocrataParseError",
    "search_items",
    "get_item",
]

USER_AGENT = "circl-energystar/0.1 (+https://github.com/andremair97/circl-docs)"


class SocrataHttpError(Exception):
    """Raised when the API returns a non-200 HTTP status."""


class SocrataParseError(Exception):
    """Raised when a response cannot be decoded as JSON."""


_tokens: float = 0.0
_last: float = time.monotonic()


def _throttle() -> None:
    """Tiny token bucket to avoid hammering the public API."""

    global _tokens, _last
    rate = float(os.getenv("ENERGY_STAR_RPS", "4"))
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


def _request(url: str) -> List[Dict[str, Any]]:
    """Perform a GET request and parse JSON."""

    _throttle()
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "application/json",
    }
    token = os.getenv("ENERGY_STAR_APP_TOKEN")
    if token:
        headers["X-App-Token"] = token
    req = urllib.request.Request(url, headers=headers)
    timeout = float(os.getenv("ENERGY_STAR_TIMEOUT_SECONDS", "10"))
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            status = getattr(resp, "status", resp.getcode())
            if status != 200:
                raise SocrataHttpError(f"HTTP {status} for {url}")
            raw = resp.read()
    except urllib.error.URLError as exc:  # pragma: no cover - network issues
        raise SocrataHttpError(str(exc)) from exc
    try:
        data = json.loads(raw.decode("utf-8"))
    except json.JSONDecodeError as exc:
        raise SocrataParseError(str(exc)) from exc
    if isinstance(data, dict):
        return [data]
    return data


def search_items(
    category: str,
    dataset_id: str,
    dataset_url: str,
    q: str | None = None,
    limit: int = 20,
    offset: int = 0,
) -> List[dict]:
    """Search a dataset and return normalized items."""

    base = os.getenv("ENERGY_STAR_BASE", "https://data.energystar.gov")
    params = {
        "$limit": str(max(1, min(int(limit), 100))),
        "$offset": str(max(0, int(offset))),
    }
    if q:
        params["$q"] = q
    query = urllib.parse.urlencode(params)
    url = f"{base}/resource/{dataset_id}.json?{query}"
    rows = _request(url)
    return [
        adapter.normalize_item(category, dataset_id, dataset_url, row, url)
        for row in rows
    ]


def get_item(
    category: str,
    dataset_id: str,
    dataset_url: str,
    item_id: str,
) -> dict | None:
    """Fetch a single item by ESUID or internal row id."""

    base = os.getenv("ENERGY_STAR_BASE", "https://data.energystar.gov")
    params = {"$limit": "1"}
    if ":" in item_id:
        _, row_id = item_id.split(":", 1)
        params["$where"] = f":id='{row_id}'"
    else:
        params["$q"] = item_id
    query = urllib.parse.urlencode(params)
    url = f"{base}/resource/{dataset_id}.json?{query}"
    rows = _request(url)
    if not rows:
        return None
    return adapter.normalize_item(category, dataset_id, dataset_url, rows[0], url)
