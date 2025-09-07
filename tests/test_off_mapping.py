import json, subprocess, pathlib, os


def test_off_ingest_and_validate():
    root = pathlib.Path(__file__).resolve().parents[1]
    schema = root / "schemas" / "universal" / "product.schema.json"
    tool = root / "tools" / "ingest_and_map.py"

    # Run mapping
    out = subprocess.check_output([str(tool), "--source", "off", "--barcode", "737628064502"])
    mapped = json.loads(out)

    # Validate via ajv on stdin
    env = os.environ.copy()
    env["PATH"] = f"{root / 'node_modules' / '.bin'}{os.pathsep}" + env.get("PATH", "")
    proc = subprocess.run([
        "ajv", "validate", "--spec=draft2020", "-s", str(schema), "-d", "stdin"
    ], input=json.dumps(mapped).encode(), env=env, check=False)
    assert proc.returncode == 0
