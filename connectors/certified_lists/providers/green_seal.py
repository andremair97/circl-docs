"""Green Seal provider.

Fixture-first; live HTTP requests require ``GS_API_KEY`` and follow the Green
Seal Certified Directory API. The API base can be overridden with
``GS_API_BASE``.
"""

from __future__ import annotations

import json
import os
import random
import time
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Dict, List

from .. import adapter

FIXTURES = Path(__file__).resolve().parents[1] / "fixtures"

API_BASE = os.getenv("GS_API_BASE", "https://certified.greenseal.org/api")
API_KEY = os.getenv("GS_API_KEY")
DEFAULT_TIMEOUT = int(os.getenv("GS_TIMEOUT_SECONDS", "10"))
RATE = float(os.getenv("GS_REQUESTS_PER_SEC", "4"))

_NEXT_REQUEST = 0.0


class GreenSealAuthError(Exception):
    pass


class GreenSealHttpError(Exception):
    pass


class GreenSealParseError(Exception):
    pass


def _throttle() -> None:
    global _NEXT_REQUEST
    now = time.time()
    wait = _NEXT_REQUEST - now
    if wait > 0:
        time.sleep(wait + random.uniform(0, 0.25))
    _NEXT_REQUEST = max(now, _NEXT_REQUEST) + 1 / RATE


def _request(path: str, params: Dict[str, str] | None = None) -> bytes:
    if not API_KEY:
        raise GreenSealAuthError(
            "GS_API_KEY required for live requests; obtain one per their terms"
        )
    _throttle()
    if params is None:
        params = {}
    params.setdefault("key", API_KEY)
    url = f"{API_BASE.rstrip('/')}/{path.lstrip('/')}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "circl-certified-gs/0.1 (+https://github.com/andremair97/circl-docs)",
            "Accept": "application/json",
            "Authorization": f"ApiKey {API_KEY}",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=DEFAULT_TIMEOUT) as resp:
            return resp.read()
    except urllib.error.HTTPError as exc:  # pragma: no cover - network branch
        if exc.code == 401:
            raise GreenSealAuthError("unauthorised") from exc
        raise GreenSealHttpError(f"HTTP error {exc.code}") from exc
    except urllib.error.URLError as exc:  # pragma: no cover - network branch
        raise GreenSealHttpError(str(exc)) from exc


def _load_fixture_search() -> List[Dict]:
    data = json.loads((FIXTURES / "gs_search.json").read_text())
    return [_normalise_item(item, f"file://{FIXTURES / 'gs_search.json'}") for item in data["results"]]


def _load_fixture_item() -> Dict:
    item = json.loads((FIXTURES / "gs_item.json").read_text())
    return _normalise_item(item, f"file://{FIXTURES / 'gs_item.json'}")


def _normalise_item(item: Dict, source_url: str) -> Dict:
    return {
        "source": "cert:green-seal",
        "provider": "green_seal",
        "certificate_id": item.get("id", ""),
        "product": {
            "brand": item.get("brand"),
            "name": item.get("name"),
            "model": item.get("model"),
            "gtin": item.get("gtin"),
            "categories": [c for c in [item.get("category")] if c],
        },
        "organization": {
            "name": item.get("company"),
            "country": item.get("country"),
            "website": item.get("website"),
        },
        "status": {
            "status": item.get("status", "unknown"),
            "issued": item.get("issued"),
            "expires": item.get("expires"),
            "standard": item.get("standard"),
        },
        "marketplace_badges": [],
        "urls": {"detail": item.get("detail_url", "")},
        "provenance": {
            "source_url": source_url,
            "fetched_at": adapter.iso_now(),
            "raw": adapter.sanitize_raw(item),
        },
    }


def search_certified(query: str, limit: int = 20, offset: int = 0, **kwargs) -> List[Dict]:
    """Search the Green Seal directory."""

    if not API_KEY:
        items = _load_fixture_search()
    else:  # pragma: no cover - live path
        params = {"query": query, "limit": str(limit), "offset": str(offset)}
        if "category" in kwargs and kwargs["category"]:
            params["category"] = kwargs["category"]
        if "standard" in kwargs and kwargs["standard"]:
            params["standard"] = kwargs["standard"]
        body = _request("products/search", params)
        try:
            raw = json.loads(body.decode("utf-8"))
        except json.JSONDecodeError as exc:
            raise GreenSealParseError(str(exc)) from exc
        items = [_normalise_item(item, f"{API_BASE}/products/search") for item in raw.get("results", [])]
    q = query.lower()
    filtered = [
        i
        for i in items
        if not q
        or q in (i["product"].get("name", "").lower())
        or q in (i["product"].get("brand", "").lower())
        or any(q in c.lower() for c in i["product"].get("categories", []))
    ]
    return filtered[offset : offset + limit]


def get_certificate(cert_id: str, **_) -> Dict | None:
    """Fetch a single certificate."""

    if not API_KEY:
        item = _load_fixture_item()
        return item if item.get("certificate_id") == cert_id else None
    # pragma: no cover - live path
    body = _request(f"products/{urllib.parse.quote(cert_id)}")
    try:
        raw = json.loads(body.decode("utf-8"))
    except json.JSONDecodeError as exc:
        raise GreenSealParseError(str(exc)) from exc
    return _normalise_item(raw, f"{API_BASE}/products/{cert_id}")
