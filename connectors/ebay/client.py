"""Minimal HTTP client for the eBay Browse API.

This client uses the Python standard library only. It performs GET requests to
search listings or retrieve item details from the eBay Browse API.

References
---------
Browse API overview: https://developer.ebay.com/api-docs/buy/browse/resources/item_summary/methods/search
Request components (OAuth token & marketplace header):
https://developer.ebay.com/api-docs/buy/static/api-browse.html
"""

from __future__ import annotations

import json
import os
import random
import time
from collections import deque
from dataclasses import dataclass
from typing import Dict, Optional, Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen


class EbayHttpError(Exception):
    """Raised when eBay returns a non-200 HTTP response."""

    def __init__(self, status: int, body: str):
        super().__init__(f"HTTP {status}: {body}")
        self.status = status
        self.body = body


class EbayParseError(Exception):
    """Raised when response payload cannot be parsed as JSON."""


@dataclass
class EbayClient:
    """Minimal client for eBay Browse API.

    Parameters are primarily driven by environment variables so the client can
    be used in scripts without additional configuration.
    """

    marketplace: Optional[str] = None
    env: Optional[str] = None

    def __post_init__(self) -> None:
        self.token = os.getenv("EBAY_OAUTH_TOKEN")
        self.marketplace = self.marketplace or os.getenv("EBAY_MARKETPLACE", "EBAY_GB")
        self.env = (self.env or os.getenv("EBAY_ENV", "prod")).lower()
        self.base_url = (
            "https://api.sandbox.ebay.com/buy/browse/v1"
            if self.env == "sandbox"
            else "https://api.ebay.com/buy/browse/v1"
        )
        self.requests_per_sec = int(os.getenv("EBAY_REQUESTS_PER_SEC", "4"))
        self.timeout = int(os.getenv("EBAY_TIMEOUT_SECONDS", "10"))
        self._request_times: deque[float] = deque()

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------
    def _throttle(self) -> None:
        """Simple token bucket limiter based on a sliding one-second window."""

        now = time.monotonic()
        while self._request_times and now - self._request_times[0] > 1:
            self._request_times.popleft()
        if len(self._request_times) >= self.requests_per_sec:
            sleep_for = 1 - (now - self._request_times[0])
            sleep_for += random.uniform(0, 0.1)  # jitter
            if sleep_for > 0:
                time.sleep(sleep_for)
        self._request_times.append(time.monotonic())

    def _encode_params(self, params: Dict[str, str]) -> str:
        parts = [f"{quote(str(k))}={quote(str(v), safe=':,{}')}" for k, v in params.items()]
        return "&".join(parts)

    def _request(self, path: str, params: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        if not self.token:
            raise RuntimeError("EBAY_OAUTH_TOKEN is required for live calls")
        self._throttle()
        url = f"{self.base_url}{path}"
        if params:
            qs = self._encode_params({k: v for k, v in params.items() if v is not None})
            if qs:
                url = f"{url}?{qs}"
        headers = {
            "Authorization": f"Bearer {self.token}",
            "X-EBAY-C-MARKETPLACE-ID": self.marketplace,
            "User-Agent": "circl-ebay-connector/0.1 (+https://github.com/andremair97/circl-docs)",
            "Accept": "application/json",
        }
        req = Request(url, headers=headers, method="GET")
        try:
            with urlopen(req, timeout=self.timeout) as resp:
                status = resp.getcode()
                body = resp.read().decode("utf-8")
        except HTTPError as e:  # pragma: no cover - network errors
            raise EbayHttpError(e.code, e.read().decode("utf-8"))
        except URLError as e:  # pragma: no cover - network errors
            raise EbayHttpError(0, str(e))
        if status != 200:
            raise EbayHttpError(status, body)
        try:
            return json.loads(body)
        except json.JSONDecodeError as exc:
            raise EbayParseError(str(exc))

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def search_items(
        self,
        keyword: str,
        limit: int = 20,
        offset: int = 0,
        buying_options: Optional[str] = None,
        category_id: Optional[str] = None,
        field_groups: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Search for items using the Browse API.

        Parameters mirror the Browse API; see eBay documentation for details.
        """

        params: Dict[str, str] = {
            "q": keyword,
            "limit": str(limit),
            "offset": str(offset),
        }
        filters = []
        if buying_options:
            filters.append(f"buyingOptions:{buying_options}")
        if filters:
            params["filter"] = ",".join(filters)
        if category_id:
            params["category_ids"] = category_id
        if field_groups:
            params["field_groups"] = field_groups
        return self._request("/item_summary/search", params)

    def get_item(self, item_id: str, field_groups: Optional[str] = None) -> Dict[str, Any]:
        """Retrieve item details from the Browse API."""

        params: Dict[str, str] = {}
        if field_groups:
            params["field_groups"] = field_groups
        return self._request(f"/item/{quote(item_id)}", params)
