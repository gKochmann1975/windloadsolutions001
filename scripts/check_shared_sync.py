#!/usr/bin/env python3
"""
check_shared_sync.py — guard against drift between the duplicated "shared" files
that live in BOTH the webapp/ (paid Dash app -> calc.windloadcalc.com) and
backend/ (public API -> api.windloadcalc.com) repos.

Why this exists
---------------
The wind-velocity engine + the C&C Windows/Doors pressure engine are physically
copied into both repos (they deploy as two independent Railway services). If a
fix lands in one copy but not the other, the FREE calculator and the PAID
calculator silently disagree on numbers — exactly the drift the project's
memory warns about. This script is the tripwire: it fails (exit 1) the moment
any shared file differs between the two repos, so a pre-commit hook can block
the commit before drift ships.

Usage
-----
    python scripts/check_shared_sync.py          # report + exit code
    python scripts/check_shared_sync.py --quiet   # only print on drift

Paths are resolved relative to THIS file, so it works from any working dir.
"""

import hashlib
import sys
from pathlib import Path

# These files are maintained as identical copies in webapp/ and backend/.
# Keep this list in sync with the project's "duplicated velocity engine" note.
SHARED_FILES = [
    "usps_zip_data.py",
    "velocity_finder_core.py",
    "usps_zip_codes.csv",
    "florida_data.py",
    "asce7_22_cc_windows_doors.py",
]

ROOT = Path(__file__).resolve().parent.parent
WEBAPP = ROOT / "webapp"
BACKEND = ROOT / "backend"


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def main() -> int:
    quiet = "--quiet" in sys.argv
    problems = []
    rows = []

    for name in SHARED_FILES:
        wp = WEBAPP / name
        bp = BACKEND / name
        if not wp.exists() or not bp.exists():
            problems.append(name)
            rows.append((name, "MISSING", f"webapp:{'y' if wp.exists() else 'n'} backend:{'y' if bp.exists() else 'n'}"))
            continue
        wh, bh = sha256(wp), sha256(bp)
        if wh == bh:
            rows.append((name, "ok", wh[:12]))
        else:
            problems.append(name)
            # Newer mtime is the likely source of truth — surface it so the
            # fix direction is obvious.
            newer = "webapp" if wp.stat().st_mtime >= bp.stat().st_mtime else "backend"
            rows.append((name, "DRIFT", f"newer={newer}"))

    if problems:
        print("SHARED-FILE SYNC CHECK: FAIL", file=sys.stderr)
        for name, status, detail in rows:
            if status != "ok":
                print(f"  [{status}] {name}  ({detail})", file=sys.stderr)
        print("", file=sys.stderr)
        print("  webapp/ and backend/ must hold byte-identical copies of these files.", file=sys.stderr)
        print("  Copy the correct version over the stale one, e.g.:", file=sys.stderr)
        for name in problems:
            print(f"    Copy-Item backend/{name} webapp/{name}   # or the reverse", file=sys.stderr)
        return 1

    if not quiet:
        print("SHARED-FILE SYNC CHECK: OK - webapp/ and backend/ copies match")
        for name, _status, detail in rows:
            print(f"  ok  {name}  ({detail})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
