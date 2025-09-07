#!/usr/bin/env python3
"""Compile changelog fragments into PROJECT_CHANGELOG.md.

Why: keep a single canonical changelog that is automatically generated on
merge while preserving existing history. This script prepends today's
fragments to the existing log without touching prior sections."""

import argparse
import datetime
import glob
import os
import io


def main() -> None:
    """Build the changelog from fragments and preserve prior entries."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--fragments", default="changelog")
    parser.add_argument("--out", default="PROJECT_CHANGELOG.md")
    args = parser.parse_args()

    today = datetime.date.today().isoformat()
    frags = sorted(glob.glob(os.path.join(args.fragments, "*.md")))
    if not frags:
        # Nothing to compile; exiting keeps history untouched.
        raise SystemExit(0)

    # Read existing changelog content if present.
    previous = ""
    if os.path.exists(args.out):
        with open(args.out, "r", encoding="utf-8") as fh:
            previous = fh.read().strip()

    # Normalise the header so we can safely prepend a new section.
    header = "# PROJECT_CHANGELOG"
    if previous.startswith(header):
        previous = previous[len(header):].lstrip()

    buf = io.StringIO()
    buf.write(header + "\n\n")
    buf.write(f"## {today}\n\n")
    for frag in frags:
        with open(frag, "r", encoding="utf-8") as fh:
            buf.write(fh.read().strip() + "\n\n")

    # Append prior changelog content (if any) to preserve history.
    if previous:
        buf.write(previous.strip() + "\n")

    with open(args.out, "w", encoding="utf-8") as out_fh:
        out_fh.write(buf.getvalue())


if __name__ == "__main__":  # pragma: no cover - script entry point
    main()
