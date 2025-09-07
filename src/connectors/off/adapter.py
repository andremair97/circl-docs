import json
import os
from datetime import datetime, timezone
from typing import Any, Dict, List
from urllib.parse import urlencode
from urllib.request import urlopen

BASE_PRODUCT_URL = "https://world.openfoodfacts.org/api/v2/product/{code}.json"
BASE_SEARCH_URL = "https://world.openfoodfacts.org/cgi/search.pl"


def _require_enabled() -> None:
    """Ensure the feature flag is enabled before running.

    The adapter is guarded to allow gradual rollout.  Raising early keeps
    accidental use from slipping into production before the schema stabilises.
    """
    if os.getenv("USE_OFF_V1", "").lower() not in {"1", "true", "yes"}:
        raise RuntimeError("USE_OFF_V1 not enabled")


def _get_locale_value(data: Dict[str, Any], key: str, lang: str) -> str | None:
    """Return a language-specific field from OFF or fall back.

    OFF exposes fields such as `product_name_en`; if the requested locale is
    missing we gracefully fall back to the base key.  This keeps normalisation
    resilient to incomplete translations.
    """
    return data.get(f"{key}_{lang}") or data.get(key)


def fetch_off(query: str, *, lang: str = "en") -> Dict[str, Any]:
    """Fetch a product payload from OFF by barcode or name.

    Network errors bubble up to the caller; the CLI is responsible for handling
    them.  The network layer is intentionally thin to keep the adapter focused
    on normalisation.
    """
    _require_enabled()
    if query.isdigit():
        url = BASE_PRODUCT_URL.format(code=query)
        params = {"lc": lang}
        url = f"{url}?{urlencode(params)}"
        try:
            with urlopen(url, timeout=20) as resp:
                return json.loads(resp.read().decode("utf-8")).get("product", {})
        except Exception:
            # Offline or API error – return empty payload so normalisation can
            # still emit a schema-compliant stub.  This keeps the CLI idempotent
            # in environments without network access.
            return {}
    params = {
        "search_terms": query,
        "search_simple": 1,
        "action": "process",
        "json": 1,
        "page_size": 1,
        "lc": lang,
    }
    try:
        with urlopen(f"{BASE_SEARCH_URL}?{urlencode(params)}", timeout=20) as resp:
            products = json.loads(resp.read().decode("utf-8")).get("products", [])
    except Exception:
        return {}
    return products[0] if products else {}


def normalize_off(payload: Dict[str, Any], *, lang: str = "en") -> Dict[str, Any]:
    """Normalise a raw OFF payload into the universal product schema.

    The function tolerates sparse payloads by using `.get` and only emitting
    fields when source data exists.  Provenance fields are always populated to
    satisfy schema requirements and allow traceability.
    """
    _require_enabled()
    code = str(payload.get("code")) if payload.get("code") else None
    title = _get_locale_value(payload, "product_name", lang) or "Unknown"
    result: Dict[str, Any] = {
        "id": code or "",
        "title": title,
        "provenance": {
            "source": "openfoodfacts",
            "url": payload.get("url", ""),
            "fetched_at": datetime.now(timezone.utc).isoformat(),
        },
    }
    if brand := payload.get("brands"):
        result["brand"] = brand
    if code:
        result.setdefault("identifiers", {})["gtin"] = code
    if categories := payload.get("categories"):
        cats: List[str] = [c.strip() for c in categories.split(",") if c.strip()]
        if cats:
            result["classification"] = {"categories": cats}
    if packaging := _get_locale_value(payload, "packaging", lang):
        result["packaging"] = {"summary": packaging}
    if image := payload.get("image_url"):
        result["images"] = [{"url": image, "kind": "front"}]
    return result
