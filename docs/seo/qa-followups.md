# QA Follow-ups — Tracked Issues from Post-Batch Audits

**Purpose:** Hold the WARNING and COSMETIC issues found by post-batch QA agent runs. Each issue stays here until fixed in a future polish pass. Aged items (>90 days) get escalated or accepted as permanent.

**Status:** Living document. Updated after every wave's QA agent run. Last updated 2026-05-23.

---

## Open follow-ups

### W4-QA-1: Templated process-step #4 opener across 7 state/county pages

**Severity:** WARNING (below 30-word verbatim threshold — clears Helpful Content rule today, but a templating fingerprint to clean before more sibling pages are added at scale)
**Found:** 2026-05-23 post-Wave-4 QA audit
**Affected files (all `c:/Dev/windload-solutions/website/`):**
- `florida-wind-load-calculator/index.html`
- `miami-dade-wind-load-calculator/index.html`
- `broward-wind-load-calculator/index.html`
- `palm-beach-wind-load-calculator/index.html`
- `collier-county-wind-load-calculator/index.html`
- `north-carolina-wind-load-calculator/index.html`
- `texas-wind-load-calculator/index.html`

**Issue:** The 12-word opening clause `The calculator returns MWFRS pressures (for the structural system) and C&C pressures` begins process-step #4 ("Review the calculated pressures") on all 7 pages. Each continues with location-specific text after that opener, so the full paragraphs differ — but the lead-in is templated. Below the 30-word verbatim threshold for Helpful Content classification, so today this is fine. But if we scale to 20+ sibling pages with the same opener, that's a pattern Google would notice.

**Fix:** Vary the opening clause per page. Suggested per-page rewrites:
- FL: "Both MWFRS and C&C pressures come back from the engine — MWFRS for the structure, C&C for individual openings."
- Miami-Dade: "The engine returns Florida HVHZ-aware pressures, including NOA-relevant C&C zones for impact products."
- Broward: "Output covers Broward's HVHZ 170 mph baseline plus zone-specific C&C pressures matched to typical openings."
- Palm Beach: "You'll see both the coastal-gradient design wind speed and the corresponding MWFRS and C&C pressures."
- Collier: "Your output includes Collier County's 170 mph override and pressure zones tailored to Naples lanai, pool cage, and residential geometry."
- NC: "Your report includes Main Wind Force Resisting System pressures and zone-by-zone Components and Cladding pressures."
- TX: "Output covers MWFRS pressures for the lateral system plus C&C for envelope elements — including TWIA windstorm zones where applicable."

**Estimated effort:** ~5 min per file × 7 files = 35 min. Single agent could do it in one pass.

**When to fix:** Next session that touches these files, OR before Wave 5 ships (city pages will share this opener pattern if we don't break it first).

---

## Closed follow-ups (archived after fix)

(Move items here when fixed, with date + commit hash for traceability.)

### CLOSED W4-QA-A: Title tags exceeded 60-char standard on 10 of 13 pages
- **Closed:** 2026-05-23 commit `<pending>` (immediate fix during the Wave 4 QA cycle)
- **Action taken:** Trimmed trailing `| WindLoadCalc` brand suffix on 11 pages (Google auto-appends site name from canonical/OG). All titles now ≤60 chars.

### CLOSED W4-QA-B: 6 Wave 1-2 pages lacked visible "Last updated" trust signal
- **Closed:** 2026-05-23 commit `<pending>`
- **Action taken:** Added `<p class="last-updated">Last updated: May 23, 2026 — Reviewed by Bob, P.E. (Florida licensed). Serving wind load professionals since 2002.</p>` to footer-bottom of `florida-`, `miami-dade-`, `broward-`, `collier-county-`, `palm-beach-wind-load-calculator/index.html` and `asce-hazard-tool-alternative/index.html`. Also bumped copyright on those 6 to "2002–2026" range.

### CLOSED W4-QA-C: NC Outer Banks wind speed range slightly understated
- **Closed:** 2026-05-23 commit `<pending>`
- **Action taken:** Updated "140-150 mph" → "140-155 mph" across `north-carolina-wind-load-calculator/index.html` (meta, OG, JSON-LD description, article subtitle, table cell, 3 county cards, FAQ answer, TOC) to match actual ASCE 7-16 Risk Cat II peak at Cape Hatteras / Dare County barrier islands.

---

## See also

- [03-page-quality-standards.md](./03-page-quality-standards.md) — the 20 non-negotiables + post-batch QA agent definition
- [SEO-DOMINATION-ROADMAP.md](./SEO-DOMINATION-ROADMAP.md) — operating procedures including mandatory post-batch QA step
