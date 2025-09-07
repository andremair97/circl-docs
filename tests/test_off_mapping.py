import json, subprocess, pathlib, tempfile

def test_off_ingest_and_validate():
    root = pathlib.Path(__file__).resolve().parents[1]
    schema = root / "schemas" / "universal" / "product.schema.json"
    tool = root / "tools" / "ingest_and_map.py"

    # Run mapping
    out = subprocess.check_output([str(tool), "--source","off","--barcode","737628064502"])
    mapped = json.loads(out)

    # Validate via ajv on stdin
    with tempfile.NamedTemporaryFile("w+", suffix=".json") as tmp:
        json.dump(mapped, tmp)
        tmp.flush()
        proc = subprocess.run([
            "npx", "ajv", "validate", "--spec=draft2020", "--all-errors", "--strict=false", "--validate-formats=false",
            "-s", str(schema), "-d", tmp.name
        ], check=False)
        assert proc.returncode == 0
