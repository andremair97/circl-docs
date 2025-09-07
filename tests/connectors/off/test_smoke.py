"""Pytest wrapper to execute smoke tests stored in `smoke.test.py`.

This allows maintaining the `*.test.py` naming convention while
still leveraging pytest's discovery (which requires `test_*.py`).
"""
import importlib.util
import pathlib
import types

path = pathlib.Path(__file__).with_name("smoke.test.py")
module_name = "off_smoke"
spec = importlib.util.spec_from_file_location(module_name, path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

for name in dir(mod):
    if name.startswith("test_"):
        globals()[name] = getattr(mod, name)
