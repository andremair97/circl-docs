import json, subprocess, pathlib, os, sys, tempfile

root = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root))

from src.mapping import load_overlay, apply_overlay


def test_off_mapping_validates():
    schema = root / "schemas" / "universal" / "product.schema.json"
    raw_path = root / "tests" / "data" / "off-product.raw.json"
    overlay_path = root / "overlays" / "off.product.overlay.json"

    raw = json.loads(raw_path.read_text())
    overlay = load_overlay(str(overlay_path))
    mapped = apply_overlay(raw, overlay)

    env = os.environ.copy()
    env["PATH"] = f"{root / 'node_modules' / '.bin'}{os.pathsep}" + env.get("PATH", "")

    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as tmp:
        json.dump(mapped, tmp)
        tmp_path = tmp.name
    try:
        proc = subprocess.run([
            "ajv", "validate", "--spec=draft2020", "--validate-formats=false",
            "-s", str(schema), "-d", tmp_path
        ], env=env, check=False)
    finally:
        os.unlink(tmp_path)
    assert proc.returncode == 0
