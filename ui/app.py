import io
import os
import json
import shlex
import tempfile
import subprocess
from pathlib import Path
from typing import Any, Dict, Tuple, Optional, List

import streamlit as st
import requests
from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_PATH = ROOT / "schemas" / "universal" / "product.schema.json"
OVERLAY_PATH = ROOT / "overlays" / "off.product.overlay.json"
MAP_TOOL = ROOT / "scripts" / "off-map.mjs"
SAMPLE_RAW = ROOT / "examples" / "off" / "product.sample.json"

# -----------------------------------------
# Utilities
# -----------------------------------------
def load_json(path: Path) -> Dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)

def validate_all(schema: Dict[str, Any], instance: Dict[str, Any]) -> Tuple[bool, str]:
    v = Draft202012Validator(schema)
    errors = sorted(v.iter_errors(instance), key=lambda e: e.path)
    if not errors:
        return True, "Valid"
    msgs = []
    for e in errors:
        loc = "$" + "".join([f"[{repr(p)}]" if isinstance(p, int) else f".{p}" for p in e.path])
        msgs.append(f"{loc}: {e.message}")
    return False, "\n".join(msgs)

def _run_mapper_with_args(args: list[str]) -> Tuple[Optional[Dict[str, Any]], Dict[str, str]]:
    """
    Run node mapper with an explicit --out temp file, capture stdout/stderr/rc.
    Returns (mapped_json_or_None, diagnostics_dict)
    """
    with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as tmp:
        out_path = Path(tmp.name)

    # Ensure schema/overlay paths exist
    if not SCHEMA_PATH.exists():
        return None, {
            "error": f"Schema not found: {SCHEMA_PATH}",
            "stdout": "",
            "stderr": "",
            "cmd": "",
            "outfile": str(out_path),
        }
    if not OVERLAY_PATH.exists():
        return None, {
            "error": f"Overlay not found: {OVERLAY_PATH}",
            "stdout": "",
            "stderr": "",
            "cmd": "",
            "outfile": str(out_path),
        }

    cmd = [
        "node", str(MAP_TOOL),
        "--schema", str(SCHEMA_PATH),
        "--overlay", str(OVERLAY_PATH),
        "--out", str(out_path),
        *args,
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    stdout = (proc.stdout or "").strip()
    stderr = (proc.stderr or "").strip()

    mapped = None
    diag = {
        "cmd": " ".join(shlex.quote(x) for x in cmd),
        "rc": str(proc.returncode),
        "stdout": stdout[:2000],
        "stderr": stderr[:4000],
        "outfile": str(out_path),
    }

    if out_path.exists() and out_path.stat().st_size > 0:
        try:
            with out_path.open("r", encoding="utf-8") as f:
                mapped = json.load(f)
        except Exception as ex:
            diag["error"] = f"Failed to parse outfile: {ex}"
    if proc.returncode != 0 and mapped is None:
        diag.setdefault("error", "Mapper exited with non-zero return code.")

    return mapped, diag

def run_map_off_with_barcode(barcode: str) -> Tuple[Optional[Dict[str, Any]], Dict[str, str]]:
    return _run_mapper_with_args(["--barcode", barcode])

def run_map_off_with_file(raw_path: Path) -> Tuple[Optional[Dict[str, Any]], Dict[str, str]]:
    return _run_mapper_with_args(["--in", str(raw_path)])

def off_live_probe(barcode: str, timeout: int = 8) -> Tuple[bool, str]:
    """Quick check to confirm OFF is reachable and product exists."""
    url = (
        "https://world.openfoodfacts.org/api/v2/product/"
        f"{barcode}.json?lc=en&fields=product_name,brands,code"
    )
    try:
        r = requests.get(url, timeout=timeout)
        if r.status_code != 200:
            return False, f"HTTP {r.status_code} from OFF"
        data = r.json()
        if data.get("status") == 1:
            name = data.get("product", {}).get("product_name") or "(no name)"
            return True, f"Found on OFF: {name}"
        return False, data.get("status_verbose", "Not found")
    except Exception as e:
        return False, f"Probe error: {e}"

def off_name_search(query: str, timeout: int = 8) -> List[Dict[str, Any]]:
    url = "https://world.openfoodfacts.org/api/v2/search"
    params = {
        "page_size": 20,
        "fields": "product_name,brands,code,image_url",
        "sort_by": "unique_scans_n",
        "lc": "en",
        "search_terms": query,
    }
    try:
        r = requests.get(url, params=params, timeout=timeout)
        if r.status_code != 200:
            return []
        data = r.json()
        return data.get("products", [])
    except Exception:
        return []

# --- UI shell (keep your existing header)
st.set_page_config(page_title="Universal Mapping – Local Playground", layout="wide")
st.title("\U0001F9EA Universal Mapping – Local Playground")
st.caption("Isolated UI: fetch/upload → map → validate (no CI, no docs, no conflicts)")

schema = load_json(SCHEMA_PATH)

with st.sidebar:
    st.header("Open Food Facts")
    barcode = st.text_input("Barcode", value="5449000000996")
    run_fetch = st.button("Fetch + Map + Validate (barcode)", type="primary")

    st.subheader("Search by product name")
    if "search_results" not in st.session_state:
        st.session_state["search_results"] = []
    query = st.text_input("Name query", value="")
    if st.button("Search") and query:
        st.session_state["search_results"] = off_name_search(query)
    results = st.session_state.get("search_results", [])
    selected_code = None
    if results:
        labels = [f"{p.get('product_name','?')} — {p.get('brands','?')} — {p.get('code','?')}" for p in results]
        choice = st.selectbox("product_name — brands — code", labels)
        idx = labels.index(choice)
        selected_code = results[idx].get("code")
    run_search = st.button("Map + Validate (search result)")

    st.divider()
    st.subheader("Or upload raw OFF JSON")
    uploaded = st.file_uploader("Upload .json", type=["json"])
    run_upload = st.button("Map + Validate (uploaded raw)")

col_raw, col_mapped, col_status = st.columns([4, 4, 3])

def show_diag(diag: Dict[str, str]):
    with st.expander("Diagnostics", expanded=False):
        st.code(f"$ {diag.get('cmd','')}")
        st.text(f"exit code: {diag.get('rc','')}")
        if diag.get("error"):
            st.error(diag["error"])
        if diag.get("stdout"):
            st.subheader("stdout (truncated)")
            st.code(diag["stdout"])
        if diag.get("stderr"):
            st.subheader("stderr (truncated)")
            st.code(diag["stderr"])
        if diag.get("outfile"):
            st.text(f"outfile: {diag['outfile']}")

if run_fetch or (run_search and selected_code):
    code = barcode if run_fetch else selected_code
    with st.spinner("Fetching from OFF → mapping → validating…"):
        mapped, diag = run_map_off_with_barcode(code)
        ok_probe, probe_msg = off_live_probe(code)

    with col_status:
        st.subheader("Live probe")
        (st.success if ok_probe else st.warning)(probe_msg)

    if mapped is not None:
        ok, msg = validate_all(schema, mapped)
        with col_mapped:
            st.subheader("Mapped (Universal)")
            st.json(mapped)
            st.download_button(
                "⬇️ Download mapped.json",
                data=json.dumps(mapped, indent=2).encode("utf-8"),
                file_name=f"{code}-mapped.json",
                mime="application/json",
            )
        with col_status:
            st.subheader("Validation")
            st.success("✅ Valid") if ok else st.error(f"❌ Invalid\n\n{msg}")
        show_diag(diag)
    else:
        st.error("Failed to map via Node mapper.")
        show_diag(diag)
        st.info("Trying fallback: local sample mapped inline…")
        try:
            raw = load_json(SAMPLE_RAW)
            mapped2 = {
                "title": raw.get("product_name") or raw.get("title", ""),
                "brand": (raw.get("brands") or raw.get("brand", "")).split(",")[0].strip(),
                "barcode": raw.get("code") or raw.get("barcode", ""),
            }
            if raw.get("quantity"):
                mapped2["quantity"] = raw.get("quantity")
            if raw.get("categories"):
                mapped2["categories"] = raw.get("categories")
            if raw.get("image_url"):
                mapped2["image_url"] = raw.get("image_url")
            if raw.get("ingredients_text"):
                mapped2["ingredients_text"] = raw.get("ingredients_text")
            if raw.get("nutriscore_grade"):
                mapped2["nutriscore_grade"] = raw.get("nutriscore_grade")
            if raw.get("ecoscore_grade"):
                mapped2["ecoscore_grade"] = raw.get("ecoscore_grade")
            if raw.get("url"):
                mapped2["provenance_source"] = raw.get("url")

            ok2, msg2 = validate_all(schema, mapped2)
            with col_raw:
                st.subheader("Raw (Fallback sample)")
                st.json(raw)
            with col_mapped:
                st.subheader("Mapped (Fallback)")
                st.json(mapped2)
            with col_status:
                st.subheader("Validation (Fallback)")
                st.success("✅ Valid") if ok2 else st.error(f"❌ Invalid\n\n{msg2}")
        except Exception as e:
            st.error(f"Fallback failed: {e}")

elif run_upload and uploaded:
    try:
        raw = json.load(io.TextIOWrapper(uploaded, encoding="utf-8"))
        with st.spinner("Mapping uploaded raw via Node mapper…"):
            # Write upload to a temp file and run mapper to keep parity with pipeline
            with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as tmpu:
                json.dump(raw, tmpu, ensure_ascii=False)
                temp_in = Path(tmpu.name)
            mapped, diag = run_map_off_with_file(temp_in)
            try:
                os.unlink(temp_in)
            except OSError:
                pass
        if mapped is None:
            st.error("Mapper failed to process uploaded raw JSON.")
            show_diag(diag)
        else:
            ok, msg = validate_all(schema, mapped)
            with col_raw:
                st.subheader("Raw (Uploaded)")
                st.json(raw)
            with col_mapped:
                st.subheader("Mapped (Universal)")
                st.json(mapped)
            with col_status:
                st.subheader("Validation")
                st.success("✅ Valid") if ok else st.error(f"❌ Invalid\n\n{msg}")
            show_diag(diag)
    except Exception as e:
        st.error(f"Error processing upload: {e}")
else:
    with col_status:
        st.info("Use the sidebar to fetch by barcode or upload raw JSON.")

