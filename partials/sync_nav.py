#!/usr/bin/env python3
"""Single source of truth for the hamburger drawer (#fullMenu).

Canonical menu lives in partials/full-menu.html. This script replaces the
<aside ... id="fullMenu" ...> ... </aside> block in every served page with the
canonical one, so the menu can never silently drift across pages again.

Usage:
  python partials/sync_nav.py            # write canonical menu into all pages
  python partials/sync_nav.py --check    # exit 1 if any page differs (CI/QA gate)
"""
import os, re, sys, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # website/
CANON_PATH = os.path.join(ROOT, "partials", "full-menu.html")

# Matches the whole drawer: opening <aside ... id="fullMenu" ...> through the
# first </aside>. The menu contains no nested <aside>, so non-greedy is safe.
ASIDE_RE = re.compile(r'<aside\b[^>]*id="fullMenu".*?</aside>', re.DOTALL)

EXCLUDE_DIRS = {".backups", ".held-vs-pages", ".git", "new_env", "node_modules", "partials"}

def canonical():
    with open(CANON_PATH, encoding="utf-8") as f:
        return f.read().strip()

def target_files():
    out = []
    for path in glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True):
        rel = os.path.relpath(path, ROOT)
        parts = set(rel.replace("\\", "/").split("/"))
        if parts & EXCLUDE_DIRS:
            continue
        if rel.endswith("-old.html") or "index-old" in rel:
            continue
        with open(path, encoding="utf-8") as f:
            html = f.read()
        if 'id="fullMenu"' in html:
            out.append(path)
    return sorted(out)

def main():
    check = "--check" in sys.argv
    canon = canonical()
    files = target_files()
    drift, changed, multi = [], [], []
    for path in files:
        with open(path, encoding="utf-8") as f:
            html = f.read()
        matches = ASIDE_RE.findall(html)
        if len(matches) != 1:
            multi.append((path, len(matches)))
            continue
        current = matches[0].strip()
        rel = os.path.relpath(path, ROOT)
        if current == canon:
            continue
        if check:
            drift.append(rel)
        else:
            new_html = ASIDE_RE.sub(lambda m: canon, html, count=1)
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_html)
            changed.append(rel)

    if multi:
        print("WARNING: pages with !=1 #fullMenu block (skipped):")
        for p, n in multi:
            print(f"  {n}x  {os.path.relpath(p, ROOT)}")

    if check:
        if drift:
            print(f"DRIFT: {len(drift)} page(s) differ from partials/full-menu.html:")
            for r in drift:
                print(f"  {r}")
            sys.exit(1)
        print(f"OK: all {len(files)} pages match canonical menu.")
    else:
        print(f"Synced canonical menu into {len(changed)} page(s) "
              f"({len(files)-len(changed)-len(multi)} already current).")
        for r in changed:
            print(f"  updated  {r}")

if __name__ == "__main__":
    main()
