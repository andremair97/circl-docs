"""CSV-local provider using bundled fixtures for CDP Scores."""

from __future__ import annotations

from pathlib import Path
from typing import Dict, List

from .. import adapter, client

FIXTURE = Path(__file__).resolve().parents[1] / "fixtures" / "sample_scores_2024.csv"


def _load_rows(path: str | None) -> List[Dict[str, str]]:
    p = Path(path or FIXTURE)
    text = p.read_text(encoding="utf-8")
    return client.read_csv(text)


def search_scores(query, year=None, limit: int = 20, offset: int = 0, path: str | None = None, **_):
    """Search scores via substring match on ``org_name``."""

    rows = _load_rows(path)
    q = query.lower()
    matches = []
    for row in rows:
        if year and row.get("year") and int(row["year"]) != year:
            continue
        name = row.get("org_name", "")
        if q in name.lower():
            matches.append(adapter.map_row(row, "csv_local", str(Path(path or FIXTURE))))
    return matches[offset : offset + limit]


def get_org(org_key, year=None, path: str | None = None, **_):
    """Fetch a single organisation by name or id."""

    rows = _load_rows(path)
    key = org_key.lower()
    for row in rows:
        if year and row.get("year") and int(row["year"]) != year:
            continue
        name = row.get("org_name", "").lower()
        oid = (row.get("org_id") or "").lower()
        if key == name or key == oid:
            return adapter.map_row(row, "csv_local", str(Path(path or FIXTURE)))
    return None
