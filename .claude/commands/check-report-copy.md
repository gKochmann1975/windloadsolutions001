---
description: Lint page copy for the forbidden "sealed report" claim — the software produces an Engineering Report, it is NEVER sealed
argument-hint: "[optional: file or glob to scan; defaults to all tracked *.html]"
allowed-tools: Bash, Read
---

Guardrail for a hard content rule (see memory `feedback_no_sealed_reports_in_software`):
**the software/subscription produces an "Engineering Report" — it does NOT produce a "sealed" or
"PE-stamped" report.** PE sign-and-seal is a SEPARATE professional service (in-house FL P.E. ≤ 3 stories;
PE network elsewhere). Copy that says the calculator/subscription/download is "sealed" or "PE-stamped"
is a violation and must be reworded.

Scan `$ARGUMENTS` (default: all tracked `*.html`) and report suspicious lines, then classify by hand.

```bash
cd "c:/Dev/windload-solutions"
FILES="${ARGUMENTS:-$(git ls-files '*.html')}"
for f in $FILES; do
  grep -inE "sealed (engineering |wind load )?report|sealed (deliverable|document|pdf|set)|PE-?stampable|PE stamps|stamped (report|document|pdf|deliverable)" "$f" 2>/dev/null \
    | sed "s|^|$f:|"
done
```

**VIOLATION (reword):** the *software / subscription / calculator / download* described as producing a
"sealed report", "sealed deliverable", "PE-stampable PDF", "PE stamps", or "stamped document."
→ Fix to "Engineering Report" / "full engineering report" / "permit-ready Engineering Report PDF", and
if the seal matters, frame it as a **separate service** ("PE sign-and-seal is a separate service…").

**ALLOWED (leave):** copy that already separates them correctly, e.g.
- "The software produces an Engineering Report, **not a sealed document**."
- "**PE sign-and-seal is a separate service** … our PE network signs and seals in all 50 states."
- "24 years of Florida **PE-stamped projects**" (a track-record stat about the sealing *service*).
- `.held-vs-pages/*` competitor drafts using "sealed deliverable" for the PE-network *service* (moat).

Run this before committing any page copy that mentions reports, permits, or sealing. The canonical
correct wording lives in `faq.html` ("Is the software output a sealed report? No…").
