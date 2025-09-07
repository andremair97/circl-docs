import json, subprocess, pathlib, tempfile

def test_off_ingest_and_validate():
    root = pathlib.Path(__file__).resolve().parents[1]
    schema = root / "schemas" / "universal" / "product.schema.json"
    tool = root / "tools" / "ingest_and_map.py"

    # Run mapping
    out = subprocess.check_output([str(tool), "--source","off","--barcode","737628064502"])
    mapped = json.loads(out)

    with tempfile.NamedTemporaryFile('w', suffix='.json', delete=False) as tmp:
        json.dump(mapped, tmp)
        tmp.flush()
        data_path = tmp.name

    proc = subprocess.run([
        "npx","ajv","validate","--spec=draft2020","--validate-formats=false","-s", str(schema), "-d", data_path
    ], check=False)
    assert proc.returncode == 0
