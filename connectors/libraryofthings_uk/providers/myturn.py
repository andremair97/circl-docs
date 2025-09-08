"""myTurn provider for Library of Things (UK).

Uses fixtures by default and only performs live HTTP when ``MYTURN_BASE_URL`` is
configured. This keeps tests deterministic while allowing maintainers with API
access to opt in to live requests.
"""

from __future__ import annotations

import json
import os
import random
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Dict, List, Optional

from ..adapter import (
    Availability,
    Location,
    Price,
    UniversalBorrowV0,
    iso_now,
    sanitize_raw,
)

__all__ = ["MyTurnHttpError", "MyTurnParseError", "search_items", "get_item"]

USER_AGENT = "circl-lot-myturn/0.1 (+https://github.com/andremair97/circl-docs)"


class MyTurnHttpError(Exception):
    """Raised when the myTurn endpoint cannot be reached or returns an error."""


class MyTurnParseError(Exception):
    """Raised when a myTurn response cannot be parsed as JSON."""


_tokens: float = 0.0
_last: float = time.monotonic()


def _throttle() -> None:
    """Naive token bucket so we do not overwhelm small deployments."""

    global _tokens, _last
    rate = float(os.getenv("MYTURN_REQUESTS_PER_SEC", "4"))
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
    """Perform a GET request and return JSON payload."""

    _throttle()
    headers = {"User-Agent": USER_AGENT, "Accept": "application/json"}
    token = os.getenv("MYTURN_API_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers)
    timeout = float(os.getenv("MYTURN_TIMEOUT_SECONDS", "10"))
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            status = getattr(resp, "status", resp.getcode())
            if status != 200:
                raise MyTurnHttpError(f"HTTP {status} for {url}")
            raw = resp.read()
    except urllib.error.URLError as exc:  # pragma: no cover - network failure
        raise MyTurnHttpError(str(exc)) from exc

    try:
        data = json.loads(raw.decode("utf-8"))
    except json.JSONDecodeError as exc:
        raise MyTurnParseError(str(exc)) from exc
    data["_source_url"] = url
    return data


def _fixture_path(name: str) -> Path:
    return Path(__file__).resolve().parent.parent / "fixtures" / name


def _map_item(raw: Dict, source_url: str) -> UniversalBorrowV0:
    images: List[str] = []
    photo = raw.get("photo") or raw.get("image")
    if isinstance(photo, str):
        images.append(photo)

    price: Price = {}
    daily = raw.get("dailyCharge") or raw.get("price")
    if daily is not None:
        try:
            price["value"] = float(daily)
        except (TypeError, ValueError):
            pass
        price["currency"] = "GBP"
        price["per"] = "day"

    deposit: Price = {}
    dep = raw.get("deposit") or raw.get("depositAmount")
    if dep is not None:
        try:
            deposit["value"] = float(dep)
        except (TypeError, ValueError):
            pass
        deposit["currency"] = "GBP"

    availability: Availability = {}
    status = raw.get("status") or raw.get("availability")
    if status:
        availability["status"] = str(status)
    nxt = raw.get("nextAvailable") or raw.get("next")
    if nxt:
        availability["nextAvailable"] = str(nxt)

    location: Location = {}
    branch = raw.get("branch") or raw.get("location")
    if branch:
        location["name"] = branch
    postcode = raw.get("postcode") or raw.get("postal")
    if postcode:
        location["postcode"] = postcode

    url = raw.get("itemUrl") or raw.get("url")

    return {
        "source": "lot-uk:myturn",
        "provider": "myturn",
        "id": str(raw.get("id")),
        "title": raw.get("name"),
        "category": raw.get("category"),
        "images": images,
        "url": url,
        "price": price,
        "deposit": deposit,
        "availability": availability,
        "location": location,
        "badges": [],
        "provenance": {
            "source_url": source_url,
            "fetched_at": iso_now(),
            "raw": sanitize_raw(raw),
        },
    }


def search_items(
    query: str,
    limit: int = 20,
    offset: int = 0,
    category: Optional[str] = None,
    use_fixture: bool = False,
) -> List[UniversalBorrowV0]:
    """Search items via myTurn.

    When ``use_fixture`` is True or ``MYTURN_BASE_URL`` is unset the function
    reads from bundled fixtures. Otherwise it attempts a live HTTP call to a
    tenant's self-service API.
    """

    if use_fixture or not os.getenv("MYTURN_BASE_URL"):
        path = _fixture_path("myturn_search.json")
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    else:
        base = os.getenv("MYTURN_BASE_URL")
        assert base  # for type checkers
        encoded = urllib.parse.quote(query.strip())
        url = f"{base.rstrip('/')}/api/search/items?q={encoded}&limit={limit}&offset={offset}"
        if category:
            url += f"&category={urllib.parse.quote(category)}"
        data = _request(url)

    source_url = data.get("_source_url", "")
    results = data.get("results") or data.get("items") or []
    if use_fixture or not os.getenv("MYTURN_BASE_URL"):
        filtered = [r for r in results if query.lower() in str(r.get("name", "")).lower()]
    else:
        filtered = results
    sliced = filtered[offset : offset + limit]
    return [_map_item(r, source_url) for r in sliced]


def get_item(item_id: str, use_fixture: bool = False) -> Optional[UniversalBorrowV0]:
    """Fetch a single item by ``item_id``."""

    if use_fixture or not os.getenv("MYTURN_BASE_URL"):
        path = _fixture_path("myturn_item.json")
        with open(path, "r", encoding="utf-8") as f:
            raw = json.load(f)
    else:
        base = os.getenv("MYTURN_BASE_URL")
        if not base:
            raise MyTurnHttpError("MYTURN_BASE_URL not set; cannot fetch item")
        url = f"{base.rstrip('/')}/api/items/{urllib.parse.quote(item_id)}"
        raw = _request(url)

    source_url = raw.get("_source_url", "")
    return _map_item(raw, source_url)
