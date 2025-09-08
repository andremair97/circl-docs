"""HTTP provider for CDP Scores (opt-in live CSV/JSON)."""

from __future__ import annotations

import json
import os
import urllib.error
from typing import Dict, List

from .. import adapter, client

__all__ = ["CDPHttpError", "CDPParseError", "search_scores", "get_org"]


class CDPHttpError(Exception):
    """Raised when the CSV URL cannot be fetched."""


class CDPParseError(Exception):
    """Raised when the payload cannot be parsed."""


def _load_rows(url: str) -> List[Dict[str, str]]:
    try:
        data, content_type = client.http_get(url)
    except urllib.error.URLError as exc:  # pragma: no cover - network errors
        raise CDPHttpError(str(exc)) from exc
    text = data.decode("utf-8")
    try:
        if "json" in content_type.lower() or text.lstrip().startswith("["):
            parsed = json.loads(text)
            if isinstance(parsed, dict):
                rows = [parsed]
            else:
                rows = list(parsed)
        else:
            rows = client.read_csv(text)
    except Exception as exc:
        raise CDPParseError(str(exc)) from exc
    return rows


def _resolve_url(url: str | None) -> str:
    src = url or os.getenv("CDP_SCORES_CSV_URL")
    if not src:
        raise CDPHttpError("CDP_SCORES_CSV_URL is not set; supply a CSV URL")
    return src


def search_scores(query, year=None, limit: int = 20, offset: int = 0, url: str | None = None, **_):
    """Search scores from a remote CSV/JSON source."""

    src = _resolve_url(url)
    rows = _load_rows(src)
    q = query.lower()
    matches = []
    for row in rows:
        if year and row.get("year") and int(row["year"]) != year:
            continue
        name = row.get("org_name", "")
        if q in name.lower():
            matches.append(adapter.map_row(row, "csv_http", src))
    return matches[offset : offset + limit]


def get_org(org_key, year=None, url: str | None = None, **_):
    """Fetch a single organisation by name or id from the remote source."""

    src = _resolve_url(url)
    rows = _load_rows(src)
    key = org_key.lower()
    for row in rows:
        if year and row.get("year") and int(row["year"]) != year:
            continue
        name = row.get("org_name", "").lower()
        oid = (row.get("org_id") or "").lower()
        if key == name or key == oid:
            return adapter.map_row(row, "csv_http", src)
    return None
