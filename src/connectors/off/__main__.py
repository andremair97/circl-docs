"""Command line interface for the OFF connector.

Usage::

    python -m src.connectors.off query "<barcode|name>"

The command prints a normalised JSON document conforming to the universal
product schema.  The feature is gated by the `USE_OFF_V1` environment variable
and will exit early if disabled.
"""

import argparse
import json
import sys
from typing import Any

from .adapter import fetch_off, normalize_off, _require_enabled


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="off")
    sub = parser.add_subparsers(dest="cmd", required=True)
    q = sub.add_parser("query", help="query OFF by barcode or name")
    q.add_argument("term", help="barcode or product name")
    args = parser.parse_args(argv)

    try:
        _require_enabled()
    except RuntimeError as exc:  # pragma: no cover - simple guard
        print(str(exc), file=sys.stderr)
        return 1

    if args.cmd == "query":
        payload: dict[str, Any] = fetch_off(args.term)
        norm = normalize_off(payload)
        json.dump(norm, sys.stdout, ensure_ascii=False)
        sys.stdout.write("\n")
    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
