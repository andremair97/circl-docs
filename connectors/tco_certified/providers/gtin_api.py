"""Provider for the experimental TCO Certified GTIN API.

The API is opt-in and requires a base URL via ``TCO_GTIN_API_BASE``. When the
base is missing, a fixture path can be supplied for offline tests. Networking is
implemented via :mod:`urllib.request` with a tiny token-bucket throttle to stay
polite.
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
from typing import Any, Dict, List, Optional

from .. import adapter
from ..adapter import UniversalCertificationV0

USER_AGENT = (
    "circl-tco-gtin/0.1 "
    "(+https://github.com/andremair97/circl-docs)"
)

__all__ = [
    "TcoGtinHttpError",
    "TcoGtinParseError",
    "search",
    "get_by_certificate",
]


class TcoGtinHttpError(Exception):
    """Raised when the GTIN API returns an HTTP error or is unreachable."""


class TcoGtinParseError(Exception):
    """Raised when a response cannot be decoded as JSON."""


_tokens: float = 0.0
_last: float = time.monotonic()


def _throttle() -> None:
    global _tokens, _last
    rate = float(os.getenv("TCO_GTIN_REQUESTS_PER_SEC", "4"))
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


def _request(path: str) -> Dict[str, Any]:
    base = os.getenv("TCO_GTIN_API_BASE")
    if not base:
        raise TcoGtinHttpError("TCO_GTIN_API_BASE not set")
    url = base.rstrip("/") + "/" + path.lstrip("/")
    _throttle()
    headers = {"User-Agent": USER_AGENT, "Accept": "application/json"}
    token = os.getenv("TCO_GTIN_API_KEY")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers)
    timeout = float(os.getenv("TCO_GTIN_TIMEOUT_SECONDS", "10"))
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            status = getattr(resp, "status", resp.getcode())
            if status != 200:
                raise TcoGtinHttpError(f"HTTP {status} for {url}")
            raw = resp.read()
    except urllib.error.URLError as exc:  # pragma: no cover - network failure
        raise TcoGtinHttpError(str(exc)) from exc
    try:
        data = json.loads(raw.decode("utf-8"))
    except json.JSONDecodeError as exc:
        raise TcoGtinParseError(str(exc)) from exc
    data["_source_url"] = url
    return data


def _from_fixture(path: Path) -> Dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    return json.loads(text)


def _map_lookup(raw: Dict[str, Any]) -> Optional[UniversalCertificationV0]:
    certificate = raw.get("certificate_number") or raw.get("certificate")
    if not certificate and not raw.get("brand"):
        return None
    return adapter.normalize(
        {
            "certificate_number": certificate,
            "brand": raw.get("brand"),
            "model": raw.get("model"),
            "category": raw.get("category"),
            "generation": raw.get("generation"),
            "valid_from": raw.get("valid_from"),
            "valid_to": raw.get("valid_to"),
            "status": raw.get("status"),
            "gtins": raw.get("gtins") or [raw.get("gtin")],
            "product_finder": raw.get("links", {}).get("product_finder"),
            "certificate_pdf": raw.get("links", {}).get("certificate_pdf"),
            "product_page": raw.get("links", {}).get("product_page"),
            "attributes": raw.get("attributes", {}),
            "source_url": raw.get("_source_url"),
            "fetched_at": adapter.iso_now(),
            "raw": raw,
        },
        provider="gtin-api",
        source="tco:gtin-api",
    )


def search(
    q: str | None = None,
    brand: str | None = None,
    model: str | None = None,
    category: str | None = None,
    gtin: str | None = None,
    limit: int = 20,
    offset: int = 0,
    path: str | None = None,
    fixture_path: str | None = None,
    **_: Any,
) -> List[UniversalCertificationV0]:
    """Search by GTIN. Other parameters are ignored for now."""

    if not gtin:
        return []
    data: Dict[str, Any]
    if fixture_path or (path and not os.getenv("TCO_GTIN_API_BASE")):
        p = Path(fixture_path or path)
        data = _from_fixture(p)
    else:
        encoded = urllib.parse.quote(gtin)
        data = _request(f"lookup?gtin={encoded}")
    item = _map_lookup(data)
    return [item] if item else []


def get_by_certificate(certificate_number: str, **_: Any) -> Optional[UniversalCertificationV0]:
    """Lookup by certificate number if the API exposes it.

    The pilot API currently focuses on GTIN lookups, so this helper returns
    ``None`` to signal that the capability is unavailable.
    """

    return None
