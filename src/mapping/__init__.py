import json
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
        for p in dotted.split("."):
            if isinstance(cur, dict):
                cur = cur.get(p)
            else:
                return None
        return cur
    out: Dict[str, Any] = {}
    for uni_key, raw_path in overlay.items():
        value = get_path(raw, raw_path) if isinstance(raw_path, str) else None
        if isinstance(value, str) and "," in value:
            value = [v.strip() for v in value.split(",") if v.strip()]
        cur = out
        parts = uni_key.split(".")
        for part in parts[:-1]:
            if part not in cur or not isinstance(cur[part], dict):
                cur[part] = {}
            cur = cur[part]
        cur[parts[-1]] = value
    return out
