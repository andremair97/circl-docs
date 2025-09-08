"""Normalize ENERGY STAR Socrata rows to ``UniversalEnergyProductV0``."""

from __future__ import annotations

import datetime as _dt
import json
from typing import Any, Dict, List, Optional, TypedDict


class Identifiers(TypedDict, total=False):
    esuid: Optional[str]
    model_number: Optional[str]
    upcs: List[str]
    sku: Optional[str]


class Links(TypedDict, total=False):
    product_page: Optional[str]
    dataset_url: Optional[str]
    image: Optional[str]
    spec_sheet: Optional[str]


class Metrics(TypedDict, total=False):
    annual_kwh: Optional[float]
    capacity: Optional[str]
    efficiency: Optional[str]
    other: Dict[str, Any]


class UniversalEnergyProductV0(TypedDict, total=False):
    source: str
    provider: str
    category: str
    id: str
    title: Optional[str]
    brand: Optional[str]
    model: Optional[str]
    product_type: Optional[str]
    identifiers: Identifiers
    labels: List[str]
    links: Links
    metrics: Metrics
    dates: Dict[str, Optional[str]]
    provenance: Dict[str, Any]


def iso_now() -> str:
    """Return current UTC time in ISO8601 format."""

    return _dt.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def sanitize_raw(raw: Dict[str, Any], max_bytes: int = 30000) -> Dict[str, Any]:
    """Trim large structures while keeping shape for provenance."""

    def _trim(value: Any) -> Any:
        if isinstance(value, dict):
            out: Dict[str, Any] = {}
            for k, v in value.items():
                out[k] = _trim(v)
                if len(json.dumps(out)) > max_bytes:
                    del out[k]
                    break
            return out
        if isinstance(value, list):
            out_list = []
            for v in value:
                out_list.append(_trim(v))
                if len(json.dumps(out_list)) > max_bytes:
                    out_list.pop()
                    break
            return out_list
        if isinstance(value, str):
            enc = value.encode("utf-8")
            if len(enc) > max_bytes:
                enc = enc[:max_bytes]
                return enc.decode("utf-8", "ignore")
        return value
    return _trim(raw)


def _string(value: Any) -> Optional[str]:
    if isinstance(value, str) and value.strip():
        return value.strip()
    return None


def _float(value: Any) -> Optional[float]:
    try:
        if value is None or value == "":
            return None
        return float(value)
    except Exception:
        return None


def _list(value: Any) -> List[str]:
    if isinstance(value, list):
        return [str(v).strip() for v in value if str(v).strip()]
    if isinstance(value, str):
        return [v.strip() for v in value.split(",") if v.strip()]
    return []


def normalize_item(
    category: str,
    dataset_id: str,
    dataset_url: str,
    row: Dict[str, Any],
    source_url: str,
) -> UniversalEnergyProductV0:
    """Map a single Socrata row to ``UniversalEnergyProductV0``."""

    brand = _string(
        row.get("brand_name")
        or row.get("brand")
        or row.get("manufacturer")
        or row.get("brandname")
    )
    model = _string(row.get("model_number") or row.get("model") or row.get("model_name"))
    product_type = _string(
        row.get("product_type")
        or row.get("product_types")
        or row.get("computer_type")
        or row.get("category")
        or row.get("type")
    )

    esuid = _string(row.get("esuid") or row.get("es_uid") or row.get("es_unique_id"))
    row_id = _string(row.get(":id") or row.get("_id") or row.get("id"))
    item_id = esuid or f"{dataset_id}:{row_id}" if row_id else dataset_id

    title_parts = [p for p in [brand, model] if p]
    title = " ".join(title_parts) if title_parts else _string(row.get("model_name"))

    identifiers: Identifiers = {
        "esuid": esuid,
        "model_number": model,
        "upcs": _list(row.get("upc") or row.get("upcs") or row.get("upc_code")),
    }
    sku = _string(row.get("sku") or row.get("sku_number"))
    if sku:
        identifiers["sku"] = sku

    labels: List[str] = ["ENERGY STAR"]
    most = row.get("most_efficient") or row.get("meets_most_efficient")
    if isinstance(most, str) and most.strip():
        label = most if most.lower().startswith("most") else f"Most Efficient {most}".strip()
        labels.append(label)
    elif most:
        labels.append("Most Efficient")

    links: Links = {
        "product_page": _string(
            row.get("product_url") or row.get("product_page") or row.get("url")
        ),
        "dataset_url": dataset_url,
        "image": _string(row.get("image_url") or row.get("image")),
        "spec_sheet": _string(row.get("spec_sheet") or row.get("spec_sheet_url")),
    }

    annual_kwh = _float(
        row.get("annual_energy_use_kwh")
        or row.get("annual_kwh")
        or row.get("annual_energy")
        or row.get("kwh_year")
    )
    capacity = _string(
        row.get("capacity")
        or row.get("size_class")
        or row.get("capacity_pints_per_day")
        or row.get("cooling_capacity_btu_hr")
    )
    efficiency = _string(
        row.get("ceer")
        or row.get("uef")
        or row.get("hspf2")
        or row.get("hspf")
        or row.get("seer2")
        or row.get("seer")
    )
    other: Dict[str, Any] = {}
    for key in [
        "ceer",
        "uef",
        "hspf2",
        "hspf",
        "seer2",
        "seer",
        "cooling_capacity_btu_hr",
        "capacity_pints_per_day",
    ]:
        if key in row:
            other[key] = row[key]
    metrics: Metrics = {
        "annual_kwh": annual_kwh,
        "capacity": capacity,
        "efficiency": efficiency,
        "other": other,
    }

    dates = {
        "labeled": _string(
            row.get("date_available_on_market")
            or row.get("effective_date")
            or row.get("availability_date")
        ),
        "updated": _string(row.get("updated") or row.get("date_last_modified") or row.get(":updated_at")),
    }

    return {
        "source": "energystar:socrata",
        "provider": "socrata",
        "category": category,
        "id": item_id,
        "title": title,
        "brand": brand,
        "model": model,
        "product_type": product_type,
        "identifiers": identifiers,
        "labels": labels,
        "links": links,
        "metrics": metrics,
        "dates": dates,
        "provenance": {
            "source_url": source_url,
            "fetched_at": iso_now(),
            "raw": sanitize_raw(row),
        },
    }
