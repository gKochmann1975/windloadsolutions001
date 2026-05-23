# Wave 4 — Non-FL State Calculator Pages + Cleanup + Homepage CTA

**Wave 4 scope:** 5 new state calculator pages on WLC + retool the 5 non-FL WLS state pages with CTAs + add exact-match anchor links from WLS state pages to WLC + fix cosmetic WLco dupe-noindex + add state/county quick-links section to WLC homepage.

**Why this wave:** WLS already ranks for these 5 non-FL states (combined 1,164 clicks/90d per GSC export 2026-05-22). Currently those clicks read educational content and leave. Building matching WLC calculator pages + retooling WLS earners to push there = direct conversion bridge for the existing organic traffic.

**Status:** Ready to execute. Estimated time: 7 parallel agents, ~30 min agent work + 30 min review/commit. Last updated 2026-05-23.

---

## Pre-execution requirements

Before launching the agents, confirm:
- [ ] [02-differentiation-pillars.md](./02-differentiation-pillars.md) reviewed
- [ ] [03-page-quality-standards.md](./03-page-quality-standards.md) reviewed
- [ ] [04-funnel-architecture.md](./04-funnel-architecture.md) reviewed
- [ ] FL template at `c:/tmp/state-city-page-template.md` still exists (or rebuild from FL prototype)
- [ ] User has confirmed pages should ship even though we can't PE-stamp out-of-state work
- [ ] User has reviewed [01-competitive-teardown-skyciv.md](./01-competitive-teardown-skyciv.md) to inform "how we beat them per state"

---

## Target queries + GSC baseline (per WLS GSC 2026-05-22)

| Target state | WLS earning page (clicks/90d) | Money query | Current top-3 competitor | Our WLC angle |
|---|---|---|---|---|
| **Texas** | `/texas-wind-load-requirements` (300 clicks) | "Texas wind load calculator" | SkyCiv, Engineering Express | Coastal Gulf depth (Galveston/Cameron/Nueces), Houston metro, hurricane-prone TX coast |
| **North Carolina** | `/north-carolina-wind-load-requirements` (337 clicks) | "North Carolina wind load calculator" | SkyCiv generic, state DOT PDF | Outer Banks (150+ mph), NC State Building Code, hurricane-prone Atlantic coast |
| **South Carolina** | `/south-carolina-wind-load-requirements` (295 clicks) | "South Carolina wind load calculator" | SkyCiv generic, state PDF | Charleston coast (150 mph), Hilton Head, hurricane corridor |
| **California** | `/california-wind-load-requirements` (240 clicks) | "California wind load calculator" | SkyCiv, omnicalculator | CBC 2022 + ASCE 7-16, seismic/wind interaction note, coastal vs Central Valley |
| **Louisiana** | `/louisiana-wind-load-requirements` (192 clicks) | "Louisiana wind load calculator" | SkyCiv, post-Katrina state PDFs | Post-Katrina + post-Ida code updates, New Orleans, coastal LA |

**Combined opportunity:** 1,364 clicks/90d of existing WLS organic traffic that currently doesn't convert. Even a 5% TOFU→trial conversion rate = 68 trials/quarter from these pages alone.

---

## Per-state data — research before building (DO NOT GUESS)

Each agent must verify the following data per state from authoritative sources before writing:

### Texas
- **Code:** IBC 2021 + ASCE 7-16 statewide (verify current adoption — Texas Department of Insurance is the authority on windstorm; TWIA region is a specific overlay)
- **Wind speed range:** Coastal counties (Cameron, Willacy, Kenedy, Kleberg, Nueces, San Patricio, Aransas, Refugio, Calhoun, Matagorda, Brazoria, Galveston, Chambers, Jefferson, Orange) at higher speeds per ASCE 7-16; inland TX at lower
- **Specific high-traffic regions:** Houston metro (Harris County), Galveston, Corpus Christi, San Antonio, Dallas-Fort Worth, Austin
- **Special notes:** TWIA (Texas Windstorm Insurance Association) windstorm building code is a separate overlay for coastal counties — mention it
- **Sample ZIPs:** 77002 (Houston downtown), 77550 (Galveston), 78401 (Corpus Christi), 78201 (San Antonio), 75201 (Dallas)
- **PE caveat:** We do NOT PE-stamp TX projects. Be explicit: "WindLoadCalc reports for Texas projects must be sealed by a Texas-licensed PE."

### North Carolina
- **Code:** 2018 NC State Building Code + ASCE 7-10 base (verify current — NC tends to lag in ASCE adoption)
- **Wind speed range:** Coastal NC (Outer Banks: Dare, Hyde, Currituck, Carteret counties) at 130-150+ mph; Piedmont/Charlotte lower; mountains lowest
- **Specific high-traffic regions:** Charlotte, Raleigh, Wilmington, Outer Banks, Greensboro, Durham, Asheville
- **Special notes:** Hurricane Florence (2018) and Helene (2024 — verify) shaped recent code conversations
- **Sample ZIPs:** 28202 (Charlotte), 27601 (Raleigh), 28401 (Wilmington), 27954 (Manteo/Outer Banks)
- **PE caveat:** NC requires NC-licensed PE for sealed drawings. We do not stamp.

### South Carolina
- **Code:** 2018 IBC + ASCE 7-16
- **Wind speed range:** Coastal SC (Charleston, Beaufort, Horry counties) at 150 mph; inland lower
- **Specific high-traffic regions:** Charleston, Hilton Head, Myrtle Beach, Columbia, Greenville
- **Special notes:** Hurricane Hugo (1989) reshaped SC coastal code; modern post-Katrina amendments
- **Sample ZIPs:** 29401 (Charleston historic), 29577 (Myrtle Beach), 29928 (Hilton Head), 29201 (Columbia)
- **PE caveat:** SC requires SC-licensed PE for sealed drawings.

### California
- **Code:** 2022 California Building Code (CBC) + ASCE 7-16 (CBC adopts ASCE 7-16; verify any 7-22 amendments pending)
- **Wind speed range:** Most of CA at 85-115 mph baseline (lower than hurricane states); special wind regions (mountain passes like Banning, Tehachapi, Cajon, Altamont) at much higher
- **Specific high-traffic regions:** Bay Area, LA, San Diego, Sacramento, Central Valley, Inland Empire
- **Special notes:** **Seismic dominates CA structural design — wind is often secondary.** Frame the page accordingly: wind is one consideration among several. Mention CA's special wind regions explicitly.
- **Sample ZIPs:** 90001 (Los Angeles), 94102 (San Francisco), 92101 (San Diego), 95814 (Sacramento), 93001 (Ventura)
- **PE caveat:** CA requires CA-licensed PE for sealed drawings. We do not stamp.
- **Differentiator opportunity:** Acknowledge wind ≠ primary CA design driver. That honesty earns trust vs SkyCiv's generic "wind load calculator" treatment.

### Louisiana
- **Code:** 2018 IRC/IBC + ASCE 7-16 (verify post-Ida updates — LA has been actively revising)
- **Wind speed range:** Coastal LA (Cameron, Plaquemines, St. Bernard, Jefferson, Orleans, St. Tammany parishes) at 150+ mph; inland lower
- **Specific high-traffic regions:** New Orleans, Baton Rouge, Lafayette, Lake Charles, Shreveport
- **Special notes:** Post-Katrina (2005) and post-Ida (2021) code updates significant; LA Parish authorities vary widely
- **Sample ZIPs:** 70112 (New Orleans), 70801 (Baton Rouge), 70501 (Lafayette), 70601 (Lake Charles)
- **PE caveat:** LA requires LA-licensed PE for sealed drawings.

---

## Sub-task A — Build 5 state pages (5 parallel agents)

### Page-level requirements (apply to all 5 agents)

Per [03-page-quality-standards.md](./03-page-quality-standards.md):
- ≥1,500 unique words body content
- 9-section structure (hero / wind table / jurisdiction / hazard / how-to / FAQ / internal links / bottom CTA / last-updated)
- Title ≤60 chars, unique
- Meta ~155 chars
- Canonical clean URL
- Robots index,follow + sitemap inclusion
- 3 JSON-LD: SoftwareApplication + FAQPage (1:1) + BreadcrumbList
- No fake aggregateRating
- 3 CTAs: above-fold ZIP form (deep-links `calc.windloadcalc.com/?zip=NNNNN`) + mid-body inline + bottom converter
- 5-10 internal links to sister WLC pages
- Differentiation pillars (≥3): pillar 1 (since 2002) + pillar 3 (explained better) + pillar 5 (looks better) mandatory; 4 (customer service) recommended
- Anti-template: 8 FAQ questions per page, no repeats across siblings; each page reads distinctly

### Per-state agent briefs (template)

```
Build [STATE] Wind Load Calculator landing page on windloadcalc.com.

Working directory: c:/Dev/windload-solutions/website/

Read first:
- c:/Dev/windload-solutions/docs/seo/03-page-quality-standards.md
- c:/Dev/windload-solutions/docs/seo/02-differentiation-pillars.md
- c:/Dev/windload-solutions/docs/seo/04-funnel-architecture.md
- c:/Dev/windload-solutions/docs/seo/wave-4-non-fl-states-DETAILED.md (this file — find your state's data above)
- c:/Dev/windload-solutions/website/florida-wind-load-calculator/index.html (design reference)
- c:/tmp/state-city-page-template.md (if exists)

Use the per-state data above for [STATE]. Verify any code adoption date you cite (don't hallucinate).

File: website/[state-slug]-wind-load-calculator/index.html
URL: /[state-slug]-wind-load-calculator
Sitemap: add at priority 0.8, changefreq weekly, lastmod 2026-05-23

Differentiation: 
- Activate pillar 1 (since 2002) with a trust line
- Activate pillar 3 (explained better) by including plain-English glossary inline
- Activate pillar 5 (looks better) by matching the FL prototype design quality
- PE caveat: cannot stamp [STATE] projects (be explicit)

Anti-patterns: don't paste from FL or sibling state pages; don't fake ratings; don't claim PE service for out-of-state.

Deliverable: page + sitemap entry + ≤200 word report.
DO NOT commit or push.
```

### Specific agent assignments

| Agent | State | URL | Priority |
|---|---|---|---|
| W4-A1 | Texas | `/texas-wind-load-calculator` | 0.8 |
| W4-A2 | North Carolina | `/north-carolina-wind-load-calculator` | 0.8 |
| W4-A3 | South Carolina | `/south-carolina-wind-load-calculator` | 0.8 |
| W4-A4 | California | `/california-wind-load-calculator` | 0.8 |
| W4-A5 | Louisiana | `/louisiana-wind-load-calculator` | 0.8 |

---

## Sub-task B — Retool 5 non-FL WLS state pages with WLC CTAs (1 agent)

Same pattern as Wave 3 (sister WLC CTAs on the 8 FL earner pages).

**Agent: W4-B**

Files to retool (in `C:/Dev/windload-solutions-parent/`):
1. `texas-wind-load-requirements.html` (or `states/texas-wind-load-requirements.html` — verify) — 300 clicks/90d
2. `north-carolina-wind-load-requirements.html` — 337 clicks
3. `south-carolina-wind-load-requirements.html` — 295 clicks
4. `california-wind-load-requirements.html` — 240 clicks
5. `louisiana-wind-load-requirements.html` — 192 clicks

For each, add:
- Above-fold ZIP form CTA (deep-links to `calc.windloadcalc.com/?zip=NNNNN`)
- Mid-body inline CTA box (link to corresponding new WLC state page with exact-match anchor: e.g., "Texas Wind Load Calculator")
- Bottom converter CTA (link to `windloadcalc.com/wind-load-calculator-shop.html` or the new state page)
- Internal contextual links: 2-3 in-prose links to the new WLC state page using exact-match anchor text

Reuse the `.wlc-cta-banner`, `.wlc-inline-cta`, `.wlc-final-cta` classes from Wave 3 commit `4efd873`. Preserve all existing prose. No schema changes.

---

## Sub-task C — Cosmetic dupe-noindex fix on ~40 WLco Broward pages (1 agent or me directly)

Per Wave 1 (commit `82b904c`) cleanup note: ~40 broward county pages have duplicate `<meta name="robots" content="noindex, follow">` tags (one from original template, one from my noindex pass). Harmless but cosmetically messy.

**Agent: W4-C**

Working directory: `C:/Dev/windload-co/florida/broward/`

For each `.html` file: if the file has TWO `<meta name="robots">` tags (both with `noindex, follow`), remove one. Keep the other.

Trivial scripted edit. Could be done with sed but Edit is safer.

Deliverable: count of files modified + ≤100 word report.

---

## Sub-task D — Add state/county quick-links section to WLC homepage (1 agent or me directly)

Homepage (`c:/Dev/windload-solutions/website/index.html`) currently has no surface for the new state/county calculator pages. Add a dedicated section:

**Placement:** After hero, before main feature grid. Or as a horizontal scroll module in the existing "Calculators" section. Designer's call based on existing layout.

**Content:**
- H2: "Calculate Wind Loads by State"
- 6-8 large clickable cards:
  - Florida (FL) → `/florida-wind-load-calculator`
  - Miami-Dade County → `/miami-dade-wind-load-calculator`
  - Broward County → `/broward-wind-load-calculator`
  - Collier County → `/collier-county-wind-load-calculator`
  - Palm Beach County → `/palm-beach-wind-load-calculator`
  - Texas → `/texas-wind-load-calculator` (NEW from Wave 4)
  - North Carolina → `/north-carolina-wind-load-calculator` (NEW)
  - More states → link to a future state directory page (placeholder for now)
- Each card: state/county name, "Wind Load Calculator" subtext, key stat (e.g., "175 mph HVHZ", "170 mph", "150 mph Coast")
- "Don't see your state? [Find your wind speed by ZIP →](https://calc.windloadcalc.com/)" as fallback CTA

**Agent: W4-D**

Working directory: `c:/Dev/windload-solutions/website/`
Edit: `index.html`

Match existing design language. Preserve hero video, do NOT touch other sections. Mobile-responsive.

Deliverable: edited `index.html` + ≤200 word report describing where in the page the new section was inserted.

---

## Execution order

1. **Parallel wave** (run all simultaneously since file sets don't overlap):
   - W4-A1 (Texas page)
   - W4-A2 (North Carolina page)
   - W4-A3 (South Carolina page)
   - W4-A4 (California page)
   - W4-A5 (Louisiana page)
   - W4-B (WLS earner retool)
   - W4-C (WLco dupe-noindex cleanup)
   - W4-D (WLC homepage state/county section)
2. **Review** all 8 agent reports
3. **Commit + push** in three commits:
   - WLC: 5 new state pages + sitemap (one commit to `windloadsolutions001`)
   - WLC: homepage state/county section (separate commit if substantive enough; else fold into the 5-pages commit)
   - WLS: 5 retooled state pages (one commit to `windload-solutions`)
   - WLco: dupe-noindex cleanup (one commit to `windload-co`)

---

## Success criteria (measure 30 days post-push)

- All 5 new state pages indexed by Google (check GSC Coverage)
- TX/NC/SC/CA/LA pages on WLC start appearing for `"[state] wind load calculator"` queries (position 30+ acceptable at day 30; aim for position 20 at day 60; position 10 at day 90)
- WLS state pages show CTR uptick on Google (the new CTAs may slightly improve dwell time)
- WLC organic clicks increase measurably from the 5 new state pages
- No drop in WLS state-page ranking (we didn't noindex anything; only added CTAs)

---

## Rollback plan

Each sub-task is a separate commit. If any one ships and breaks something:
- New state page broken: noindex that single page via meta tag, file an issue, fix offline, redeploy
- WLS retool broken: `git revert <commit>` and push — reverts the CTAs only, keeps the page
- WLco dupe-noindex: cosmetic only — no rollback needed even if "broken"
- Homepage section breaks: revert that single commit; homepage returns to pre-Wave-4 state

---

## Future work this wave informs

After Wave 4 ships and indexes:
- **30 days:** Pull WLC GSC for the 5 new pages. Confirm indexed + ranking somewhere on page 1-5.
- **60 days:** Review which state pages are climbing. Add Wave 5 city pages within the winning states first.
- **90 days:** First conversion data. If state pages drive trial signups, double down. If not, diagnose (above-fold CTA? page-to-app fall-off?).

---

## See also

- [SEO-DOMINATION-ROADMAP.md](./SEO-DOMINATION-ROADMAP.md)
- [01-competitive-teardown-skyciv.md](./01-competitive-teardown-skyciv.md)
- [02-differentiation-pillars.md](./02-differentiation-pillars.md)
- [03-page-quality-standards.md](./03-page-quality-standards.md)
- [04-funnel-architecture.md](./04-funnel-architecture.md)
- [waves-5-6-7-future-roadmap.md](./waves-5-6-7-future-roadmap.md)
