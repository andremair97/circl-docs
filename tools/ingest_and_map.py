#!/usr/bin/env python
import argparse, json, sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))
from src.adapters.off import fetch_off_product
from src.mapping import load_overlay, apply_overlay

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--source", required=True, choices=["off"])
    p.add_argument("--barcode", help="OFF barcode when --source=off")
    p.add_argument("--overlay", default="overlays/off.product.overlay.json")
    p.add_argument("--out")
    args = p.parse_args()

    if args.source == "off":
        if not args.barcode:
            sys.exit("Provide --barcode for source=off")
        raw = fetch_off_product(args.barcode)
    else:
        sys.exit("Unknown source")

    overlay = load_overlay(args.overlay)
    mapped = apply_overlay(raw, overlay)

    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            json.dump(mapped, f, indent=2, ensure_ascii=False)
    else:
        print(json.dumps(mapped, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
