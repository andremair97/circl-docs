"""Normalize iFixit responses to ``UniversalRepairV0``.

The mapping intentionally keeps only lightweight metadata so the connector
remains fast and avoids pulling entire guide contents unless required. Raw
payloads are truncated to keep provenance reasonable in size.
"""

from __future__ import annotations

import datetime as _dt
from typing import Dict, List, Optional, TypedDict


class UniversalRepairV0(TypedDict, total=False):
    source: str
    id: str
    device: Optional[str]
    title: Optional[str]
    summary: Optional[str]
    url: Optional[str]
    steps: List[Dict]
    parts: List[Dict]
    tools: List[Dict]
    images: List[str]
    tags: List[str]
    provenance: Dict


def _now() -> str:
    return _dt.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def _trim(value, max_items: int = 20):
    """Recursively trim large structures for provenance."""

    if isinstance(value, list):
        return [_trim(v, max_items) for v in value[:max_items]]
    if isinstance(value, dict):
        return {k: _trim(v, max_items) for k, v in list(value.items())[:max_items]}
    if isinstance(value, str) and len(value) > 1000:
        return value[:1000]
    return value


def map_device_search(raw: Dict) -> List[UniversalRepairV0]:
    """Turn search device hits into ``UniversalRepairV0`` items."""

    items: List[UniversalRepairV0] = []
    source_url = raw.get("_source_url", "")
    for result in raw.get("results", []):
        data = result.get("data") or {}
        item_type = (result.get("type") or data.get("type") or "").lower()
        if item_type != "device":
            continue
        title = data.get("title") or result.get("title")
        url = data.get("url") or result.get("url")
        slug = data.get("slug") or title
        if url and url.startswith("/"):
            url = f"https://www.ifixit.com{url}"
        items.append(
            {
                "source": "ifixit",
                "id": slug or title or "",
                "device": title,
                "title": title,
                "url": url,
                "provenance": {
                    "source_url": source_url,
                    "fetched_at": _now(),
                    "raw": _trim(result),
                },
            }
        )
    return items


def map_guides_list(raw: Dict, device: str) -> List[UniversalRepairV0]:
    """Map a list of guides for ``device``."""

    guides = raw.get("results") or raw.get("guides") or raw
    items: List[UniversalRepairV0] = []
    source_url = raw.get("_source_url", "")
    for guide in guides:
        guideid = guide.get("guideid") or guide.get("id")
        url = guide.get("url") or guide.get("web_url")
        if url and url.startswith("/"):
            url = f"https://www.ifixit.com{url}"
        images: List[str] = []
        image = guide.get("image") or {}
        if isinstance(image, dict):
            link = image.get("thumbnail") or image.get("standard") or image.get("original")
            if isinstance(link, str):
                images.append(link)
        items.append(
            {
                "source": "ifixit",
                "id": str(guideid),
                "device": device,
                "title": guide.get("title"),
                "summary": guide.get("summary"),
                "url": url,
                "images": images,
                "steps": _trim(guide.get("steps", [])),
                "parts": _trim(guide.get("parts", [])),
                "tools": _trim(guide.get("tools", [])),
                "provenance": {
                    "source_url": source_url,
                    "fetched_at": _now(),
                    "raw": _trim(guide),
                },
            }
        )
    return items


def map_device_wiki(raw: Dict, device: str) -> Optional[UniversalRepairV0]:
    """Normalize a device wiki payload."""

    if not raw:
        return None
    source_url = raw.get("_source_url", "")
    images: List[str] = []
    image = raw.get("image") or {}
    if isinstance(image, dict):
        link = image.get("thumbnail") or image.get("standard") or image.get("original")
        if isinstance(link, str):
            images.append(link)
    return {
        "source": "ifixit",
        "id": str(raw.get("wikiid") or raw.get("slug") or device),
        "device": device,
        "title": raw.get("title"),
        "summary": raw.get("summary"),
        "url": raw.get("url"),
        "images": images,
        "tags": _trim(raw.get("tags", [])),
        "provenance": {
            "source_url": source_url,
            "fetched_at": _now(),
            "raw": _trim(raw),
        },
    }
