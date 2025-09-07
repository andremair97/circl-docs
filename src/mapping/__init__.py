import json
import re
from datetime import datetime
from typing import Any, Dict

def load_overlay(path: str) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def apply_overlay(raw: Dict[str, Any], overlay: Dict[str, Any]) -> Dict[str, Any]:
    """
    Very simple placeholder mapping:
    Overlay format example:
    { "title": "product_name",
      "brand": "brands",
      "barcode": "code" }
    Keys = universal fields; values = dotted path in raw.
    """
    def get_path(obj, dotted):
        cur = obj
        for p in dotted.split('.'):
            if isinstance(cur, dict):
                cur = cur.get(p)
            else:
                return None
        return cur

    flat: Dict[str, Any] = {}
    for uni_key, raw_path in overlay.items():
        val = get_path(raw, raw_path) if isinstance(raw_path, str) else None
        if uni_key == "provenance.source":
            val = "OpenFoodFacts"
        elif uni_key == "brand.name" and isinstance(val, str):
            val = val.split(',')[0].strip()
        elif uni_key == "classification.categories" and isinstance(val, str):
            val = [s.strip() for s in val.split(',') if s.strip()]
        elif uni_key == "packaging.materials" and isinstance(val, str):
            val = list({s.strip().lower() for s in re.split(r",| and ", val) if s.strip()})
        elif uni_key == "provenance.fetched_at" and isinstance(val, (int, float)):
            val = datetime.utcfromtimestamp(val).isoformat() + "Z"
        if val is not None:
            flat[uni_key] = val

    out: Dict[str, Any] = {}
    for key, val in flat.items():
        cur = out
        parts = key.split('.')
        for p in parts[:-1]:
            cur = cur.setdefault(p, {})
        cur[parts[-1]] = val
    for k in ("classification", "packaging", "provenance", "brand", "identifiers", "scores"):
        out.setdefault(k, {})
    return out
