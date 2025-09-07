import io
import json
import shlex
import subprocess
from pathlib import Path
from typing import Any, Dict, Tuple

import streamlit as st
from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_PATH = ROOT / "schemas" / "universal" / "product.json"
OVERLAY_PATH = ROOT / "schemas" / "overlays" / "off" / "product.overlay.json"
MAP_TOOL = ROOT / "scripts" / "off-map.mjs"

def load_json(path: Path) -> Dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)

def validate(schema: Dict[str, Any], instance: Dict[str, Any]) -> Tuple[bool, str]:
    try:
        Draft202012Validator(schema).validate(instance)
        return True, "Valid"
    except Exception as e:
        return False, str(e)

def run_map_off_with_barcode(barcode: str) -> Dict[str, Any]:
    cmd = f'node {shlex.quote(str(MAP_TOOL))} --barcode {shlex.quote(barcode)} --schema {shlex.quote(str(SCHEMA_PATH))} --overlay {shlex.quote(str(OVERLAY_PATH))}'
    out = subprocess.check_output(cmd, shell=True, text=True)
    return json.loads(out)

def run_map_off_with_file(raw_path: Path) -> Dict[str, Any]:
    cmd = f'node {shlex.quote(str(MAP_TOOL))} --in {shlex.quote(str(raw_path))} --schema {shlex.quote(str(SCHEMA_PATH))} --overlay {shlex.quote(str(OVERLAY_PATH))}'
    out = subprocess.check_output(cmd, shell=True, text=True)
    return json.loads(out)

def apply_overlay_inline(raw: Dict[str, Any], overlay: Dict[str, Any]) -> Dict[str, Any]:
    def get_path(obj, dotted):
        cur = obj
        for p in dotted.split("."):
            if isinstance(cur, dict):
                cur = cur.get(p)
            else:
                return None
        return cur
    mapped = {}
    for k, v in overlay.items():
        mapped[k] = get_path(raw, v) if isinstance(v, str) else None
    return mapped

st.set_page_config(page_title="Universal Mapping – Local Playground", layout="wide")
st.title("\U0001F9EA Universal Mapping – Local Playground")
st.caption("Isolated UI: fetch/upload → map → validate (no CI, no docs, no conflicts)")

schema = load_json(SCHEMA_PATH)
overlay = load_json(OVERLAY_PATH)

with st.sidebar:
    st.header("Open Food Facts")
    barcode = st.text_input("Barcode", value="737628064502")
    run_fetch = st.button("Fetch + Map + Validate (barcode)", type="primary")

    st.divider()
    st.subheader("Or upload raw OFF JSON")
    uploaded = st.file_uploader("Upload .json", type=["json"])
    run_upload = st.button("Map + Validate (uploaded raw)")

col_raw, col_mapped, col_status = st.columns([4, 4, 3])

if run_fetch:
    try:
        mapped = run_map_off_with_barcode(barcode)
        ok, msg = validate(schema, mapped)
        with col_mapped:
            st.subheader("Mapped (Universal)")
            st.json(mapped)
            st.download_button("\u2B07\uFE0F Download mapped.json",
                               data=json.dumps(mapped, indent=2).encode("utf-8"),
                               file_name=f"{barcode}-mapped.json",
                               mime="application/json")
        with col_status:
            st.subheader("Validation")
            st.success("\u2705 Valid") if ok else st.error(f"\u274C Invalid\n\n{msg}")
        with col_raw:
            st.subheader("Raw")
            st.info("Raw not displayed for barcode fetch. Use file upload to inspect raw.")
    except Exception as e:
        st.error(f"Error: {e}")

elif run_upload and uploaded:
    try:
        raw = json.load(io.TextIOWrapper(uploaded, encoding="utf-8"))
        # Prefer using the CLI for consistency; fallback inline mapping if needed:
        # mapped = apply_overlay_inline(raw, overlay)
        # For strict parity with pipeline, write to a temp file and call CLI:
        import tempfile, os
        with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as tmp:
            json.dump(raw, tmp, ensure_ascii=False)
            tmp_path = Path(tmp.name)
        try:
            mapped = run_map_off_with_file(tmp_path)
        finally:
            try:
                os.unlink(tmp_path)
            except OSError:
                pass

        ok, msg = validate(schema, mapped)
        with col_raw:
            st.subheader("Raw (Uploaded)")
            st.json(raw)
        with col_mapped:
            st.subheader("Mapped (Universal)")
            st.json(mapped)
        with col_status:
            st.subheader("Validation")
            st.success("\u2705 Valid") if ok else st.error(f"\u274C Invalid\n\n{msg}")
    except Exception as e:
        st.error(f"Error: {e}")
else:
    with col_status:
        st.info("Use the sidebar to fetch by barcode or upload raw JSON.")
