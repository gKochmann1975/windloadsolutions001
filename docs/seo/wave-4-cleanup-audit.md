# Wave 4 Cleanup Audit — Shared Body-Content Across 13 Sibling Landing Pages

**Audit date:** 2026-05-23
**Auditor:** Claude (deep template-text audit)
**Standard applied:** `feedback_zero_templated_body_content.md` — ZERO shared body-content sentences across sibling SEO pages, ≥10-word clauses flagged CRITICAL.
**Scope:** 13 wind load landing pages on windloadcalc.com.

---

## Section 1 — Executive Summary

### The headline number

This audit identified **~30 distinct ≥10-word body-content patterns repeated across 2+ sibling pages**, with the most pervasive boilerplate appearing on **all 12 state/county pages**. The ASCE Hazard Tool Alternative page is structurally different (comparison-table format) and shares almost no body text with the geographic pages, so it sits outside most of the overlap matrix.

### Headline pattern overlaps (≥10 words, appearing on 7+ pages)

| Shared phrase / pattern | Pages | Severity |
|---|---|---|
| `Free 7-day trial. No credit card required.` (hero ZIP form caption) | 12 (all geo) | CRITICAL chrome |
| `Risk Category I, II, III, IV` + `Risk Category II covers most occupancies (single-family, multifamily, retail, light commercial). Risk Category III adds assembly, schools, and substantial-hazard buildings. Risk Category IV is for essential facilities (hospitals, fire stations, EOCs).` | 7 state/county pages near-verbatim | CRITICAL |
| `The calculator returns MWFRS pressures (for the structural system) and C&C pressures` (process step #4 opener) | 10 pages | CRITICAL |
| `Pick your Risk Category` (process step #2 H4) | 12 geo pages | CRITICAL |
| `Set Exposure Category and building geometry` (process step #3 H4) | 9 pages | CRITICAL |
| `Review the calculated pressures` (process step #4 H4) | 10 pages | CRITICAL |
| `Then enter building dimensions: length, width, mean roof height, roof slope (X over 12), and roof shape.` | 7+ pages | CRITICAL |
| `corresponding roof zones for your roof type` | 7 pages | CRITICAL |
| `<h2>More Wind Load Resources</h2>` | 12 geo pages | CRITICAL (H2 wording) |
| `<h3>Related calculators and guides</h3>` | 10 pages | CRITICAL |
| `<h2>How to Calculate Your {LOCATION} Wind Load</h2>` (templated H2 pattern) | 12 geo pages | CRITICAL (template fingerprint) |
| `<h3>Get Pressures for Your {LOCATION} Project</h3>` (mid-body CTA H3) | 11 geo pages | CRITICAL (template fingerprint) |
| `<h3>Ready to Run Your {LOCATION} Numbers?</h3>` (bottom CTA H3) | 11 geo pages | CRITICAL (template fingerprint) |
| `Enter your ZIP, pick your risk category, and get a permit-ready C&C report in under 15 minutes.` | 7 pages near-verbatim | CRITICAL |
| `Start Free Trial` button text + `View Plans & Start Trial` (CTA buttons) | 12 pages | Allowed chrome |
| `7-day trial, no credit card.` (sidebar CTA) | 12 pages | CRITICAL chrome |
| `<h3>Try It Free</h3>` (sidebar CTA title) | 12 pages | CRITICAL chrome |
| `These are approximate — confirm via the calculator` (warning-box H4 + body opener) | 5 pages verbatim, 2 more near-verbatim | CRITICAL |
| Three-thing intro framing: `Three things have to be right for a {state}-ready wind load calculator to be useful: (1) ... ; (2) ... ; (3) ...` | 4 pages (FL, MD, TX, HI, LA) | CRITICAL pattern |
| `Reviewed by Bob, P.E. (Florida licensed)` (in body, not just trust block) | 6 pages have it inside main content area | WATCH — allowed in single footer trust block only |

### Pages ranked by cleanup effort (top 5)

| Rank | Page | Why |
|---|---|---|
| 1 | **florida-wind-load-calculator** | Source template — every templated sentence likely originated here. Wholesale rewrite required across hero, process steps, FAQ, CTAs. |
| 2 | **miami-dade-wind-load-calculator** | Shares H2/H3/process pattern with Florida + adopts the same "Three things have to be right" intro pattern. Has unique HVHZ content but the connective tissue is heavily templated. |
| 3 | **collier-county-wind-load-calculator** | Process step text near-identical to Florida; FAQ structure parallels Florida; shares "essential facilities (hospitals, fire stations, EOCs)" + the four-enclosure paragraph almost verbatim with FL. |
| 4 | **broward-wind-load-calculator** | Process steps copy/varied lightly from Florida pattern; bottom CTA + sidebar CTA H3s identical to other geo pages; FAQ wording diverges from FL but still has shared structural openers. |
| 5 | **palm-beach-wind-load-calculator** | All five process-step openers identical to Florida + FBC 8th paragraph opener identical. Same "These are approximate — confirm via the calculator" warning box text. |

State-only pages (Texas, NC, SC, CA, LA, VA, HI) share LESS body text with each other than the FL-family pages do, but they ALL share the process-step pattern, the "More Wind Load Resources" H2, the "Try It Free" sidebar block, and the "Ready to Run Your X Numbers?" bottom CTA pattern.

### Cleanup effort estimate

- **13 pages × 8-15 distinct fixes each = ~150 individual rewrites** to bring all pages to the "all pages not alike at all" standard.
- The cleanest path: spawn 13 parallel rewrite agents (one per page), each with a brief listing the page's specific shared-text instances + suggested location-specific framing. Per-agent runtime: ~15-25 min.
- ASCE Hazard Tool Alternative needs the LEAST cleanup (only ~2 shared items with geographic pages).
- Florida statewide page is the template source — it should be rewritten LAST so the sibling rewrites have a reference for divergence direction, OR rewritten FIRST so the others can be written knowing FL's new language.

---

## Section 2 — Cross-Page Overlap Matrix

### Pair-wise overlap counts (≥10-word body-content matches)

Pages abbreviated: **FL** = florida, **MD** = miami-dade, **BR** = broward, **CC** = collier, **PB** = palm-beach, **TX** = texas, **NC** = north-carolina, **SC** = south-carolina, **CA** = california, **LA** = louisiana, **VA** = virginia, **HI** = hawaii, **AHA** = asce-hazard-tool-alternative.

|     | FL | MD | BR | CC | PB | TX | NC | SC | CA | LA | VA | HI | AHA |
|-----|----|----|----|----|----|----|----|----|----|----|----|----|-----|
| FL  | —  | 14 | 12 | 14 | 13 | 9  | 9  | 9  | 9  | 9  | 9  | 9  | 1   |
| MD  |    | —  | 11 | 11 | 9  | 7  | 7  | 7  | 7  | 7  | 7  | 7  | 1   |
| BR  |    |    | —  | 9  | 9  | 7  | 7  | 7  | 7  | 7  | 7  | 7  | 1   |
| CC  |    |    |    | —  | 10 | 8  | 8  | 8  | 8  | 8  | 8  | 8  | 1   |
| PB  |    |    |    |    | —  | 8  | 8  | 8  | 8  | 8  | 8  | 8  | 1   |
| TX  |    |    |    |    |    | —  | 9  | 9  | 9  | 9  | 9  | 9  | 1   |
| NC  |    |    |    |    |    |    | —  | 9  | 9  | 9  | 9  | 9  | 1   |
| SC  |    |    |    |    |    |    |    | —  | 9  | 9  | 9  | 9  | 1   |
| CA  |    |    |    |    |    |    |    |    | —  | 8  | 8  | 8  | 1   |
| LA  |    |    |    |    |    |    |    |    |    | —  | 9  | 9  | 1   |
| VA  |    |    |    |    |    |    |    |    |    |    | —  | 9  | 1   |
| HI  |    |    |    |    |    |    |    |    |    |    |    | —  | 1   |
| AHA |    |    |    |    |    |    |    |    |    |    |    |    | —   |

### Worst offender pairs

1. **florida ↔ miami-dade** — 14 shared ≥10-word patterns. Same process-step structure, same FAQ topics with near-identical wording, same FBC 8th Edition paragraph opener, same Partially Open enclosure explanation, same edge strip "a" paragraph. Both share the "Three things have to be right" intro framing.
2. **florida ↔ collier-county** — 14 shared patterns. Process steps and table notes carry forward almost intact (Collier's are slightly re-framed but recognizable). Both share the four-enclosure paragraph and the FBC 8th + ASCE 7-22 explanation almost verbatim.
3. **florida ↔ palm-beach** — 13 shared patterns. Process steps nearly identical; "These are approximate — confirm via the calculator" warning box verbatim; FBC 8th paragraph opener verbatim.
4. **florida ↔ broward** — 12 shared patterns. Process step openers identical; FBC 8th paragraph + edge strip paragraph copy/light-edit from FL.
5. **miami-dade ↔ collier-county** — 11. Both have the "ASCE 7-22 recognizes four enclosure types" paragraph (only these two; FL has it framed slightly differently).

### Lower-overlap pairs (still ≥7 shared patterns)

All state-state pairs (TX↔NC, TX↔SC, TX↔CA, TX↔LA, TX↔VA, TX↔HI, NC↔SC, NC↔CA, NC↔LA, NC↔VA, NC↔HI, SC↔CA, SC↔LA, SC↔VA, SC↔HI, CA↔LA, CA↔VA, CA↔HI, LA↔VA, LA↔HI, VA↔HI) sit at **7-9 shared patterns** — driven by the universal process-step template, "More Wind Load Resources" H2, "Try It Free" sidebar, "Ready to Run Your X Numbers?" CTA, and "These are approximate" warning box.

### ASCE Hazard Tool Alternative

Almost completely independent. Shares only the copyright + trust-block + a CTA button text (`Start Free Trial` analog → `Open WindLoadCalc`). Different layout, different process-step style, comparison-table-driven content. **Lowest cleanup priority.**

---

## Section 3 — Per-Page Cleanup Briefs

> **Naming convention used below**: "FL-family" = {Florida, Miami-Dade, Broward, Collier, Palm Beach}. "State-only family" = {Texas, NC, SC, CA, LA, VA, HI}. "All-13" = every page including ASCE.

### Page 1: `c:/Dev/windload-solutions/website/florida-wind-load-calculator/index.html`

**Role:** This page is the *template parent* — most shared phrases originated here. Recommend rewriting LAST so siblings can be written knowing the desired divergence pattern, OR rewriting FIRST to establish the new voice for the family.

#### CRITICAL shared text (rewrite required)

1. **Location:** Hero ZIP form caption (line 765 `<p class="zip-note">`)
   **Shared text:** `Free 7-day trial. No credit card required.`
   **Also appears on:** all 12 other geo pages (MD, BR, CC, PB, TX, NC, SC, CA, LA, VA, HI; AHA uses different "No signup" variant)
   **Suggested rewrite:** `Includes 7-day free trial — Florida-permit-ready report on day one.` (then each sibling adopts its own location-specific caption: Texas → `7-day free trial — TWIA-aware reports included`; Hawaii → `7-day free trial — output ready for your Hawaii PE`; etc.)

2. **Location:** Process step #2 H4 (line 926)
   **Shared text:** `Pick your Risk Category`
   **Also appears on:** all 12 geo pages
   **Suggested rewrite:** `Select Risk Category (Florida occupancy guide)` and per-state variants: Texas → `Choose Risk Category for the Texas occupancy mix`; CA → `Pick Risk Category — and remember it doesn't replace your seismic case`.

3. **Location:** Process step #2 body (line 927)
   **Shared text:** `Risk Category II covers most occupancies (single-family, multifamily, retail, light commercial). Risk Category III adds assembly, schools, and substantial-hazard buildings. Risk Category IV is for essential facilities (hospitals, fire stations, EOCs).`
   **Also appears on:** NC, TX, VA, HI, CA (near-verbatim) and SC (with span tags). FL is the canonical source.
   **Suggested rewrite for FL:** Lead with Florida specifics — e.g. `For Florida, Risk Category II picks up single-family residences, condos, retail, and most lanai/pool-cage scopes; Cat III is the schools, assembly halls, and gulf-coast hotels above the 300-person trigger; Cat IV is the hospitals and EOCs that have to be operational the morning after a Cat 4 lands.`

4. **Location:** Process step #3 H4 (line 930)
   **Shared text:** `Set Exposure Category and building geometry`
   **Also appears on:** MD, BR, CC, PB, TX, NC, SC, LA (9 total)
   **Suggested rewrite:** `Set Florida exposure category (B/C/D) and building geometry`.

5. **Location:** Process step #3 body (line 931)
   **Shared text:** `Exposure C is the Florida default for most suburban and rural sites. Exposure B applies for projects shielded by surrounding buildings or dense trees on all sides. Exposure D applies for coastal sites within a mile of unobstructed open water. Then enter building dimensions: length, width, mean roof height, roof slope (X over 12), and roof shape.`
   **Also appears on:** NC, TX, LA, SC, CC, PB, BR, MD (all use the same "Then enter building dimensions:..." closer)
   **Suggested rewrite:** Tighten to Florida exposure realities: `Florida exposure category usually lands on C for inland suburban work and D for any Atlantic or Gulf parcel within a mile of open water — Pensacola Beach, Naples Gulf-front, and the Atlantic barrier islands all default to D. Exposure B is rare outside the densest Miami high-rise canyons and the mature Coral Gables canopy. Then key in building length, width, mean roof height, roof pitch (X-in-12), and roof shape — the report uses these to drop the right C&C zones.`

6. **Location:** Process step #4 H4 (line 934)
   **Shared text:** `Review the calculated pressures`
   **Also appears on:** all 10 geo pages
   **Suggested rewrite:** `Audit the Florida pressure output zone-by-zone`.

7. **Location:** Process step #4 body opener (line 935)
   **Shared text:** `The calculator returns MWFRS pressures (for the structural system) and C&C pressures (for individual windows, doors, shutters, and cladding elements). C&C output includes zone breakdowns: Zone 4 (wall field), Zone 5 (wall corner), and the corresponding roof zones for your roof type.`
   **Also appears on:** **all 10 geographic pages** (the exact pattern that triggered the rule).
   **Suggested rewrite:** Per Florida: `The output drops MWFRS pressures for the building's lateral spine plus C&C pressures for every Florida product line you have to spec — impact glass, lanai screen, hurricane shutter, roof tile. C&C numbers come back zone-broken so the Zone 5 wall corner (which almost always wins in Florida coastal projects) sits at the top of the table.`

8. **Location:** Mid-body CTA H3 (line 913)
   **Shared text:** `Get Pressures for Your {Florida|Miami-Dade|Broward|Collier|Palm Beach|Texas|NC|SC|CA|LA|VA|HI} Project`
   **Also appears on:** 11 geo pages (template fingerprint).
   **Suggested rewrite:** Vary the verb + framing per page. Florida → `See What Florida Wind Pressures Your Project Will Get Hit With`. Texas → `Pull the TWIA + ASCE 7-16 Numbers for Your Texas Address`. Hawaii → `Build Your Hawaii PE's Wind Load Analysis Basis`.

9. **Location:** Bottom CTA H3 (line 1000)
   **Shared text:** `Ready to Run Your {LOCATION} Numbers?`
   **Also appears on:** 11 geo pages.
   **Suggested rewrite:** Vary entirely. Florida → `From FL ZIP to FBC-Ready Report in Under 15 Minutes`. NC → `From Outer Banks to Asheville — One Tool, One ZIP, One Report`. CA → `Wind Done, Seismic Next — Run Your CA Project`.

10. **Location:** H2 (line 985)
    **Shared text:** `More Wind Load Resources`
    **Also appears on:** all 12 geo pages.
    **Suggested rewrite:** `Florida-adjacent calculators, code references, and deeper guides`. Per-state variants: NC → `North Carolina sister pages and ASCE 7 deep-dives`; CA → `California wind + seismic resources`.

11. **Location:** Related-links intro H3 (line 988)
    **Shared text:** `Related calculators and guides`
    **Also appears on:** FL, BR, CC, PB, MD, CA, LA, HI, SC, VA, NC, TX (10 pages).
    **Suggested rewrite:** Per-state framing. Florida → `Florida county deep-dives + ASCE 7 reference`; California → `Tools cross-referenced from a California wind/seismic workflow`.

12. **Location:** FAQ — all 8 questions and answers (lines 945-983)
    **Shared text:** Q1 "What is HVHZ and why does it matter..." → identical text on Florida + (the Q itself is FL-specific so it stays here; just check that no sibling repeats this exact answer). Verify Miami-Dade page does not duplicate the HVHZ definition answer verbatim. (Spot check: MD page has a *different* HVHZ-focused FAQ leading with "What is a Miami-Dade NOA" — good.)
    **Florida-specific FAQs to check against siblings:** Q3 "Why is Miami-Dade County wind speed 175 mph..." appears verbatim on the Miami-Dade page (line 957). This is a CRITICAL duplicate — pick one page to host the canonical answer, link the other.
    **Suggested rewrite:** Move the 175 mph deep-dive answer entirely to the Miami-Dade page; on FL replace with a shorter pointer ("Miami-Dade uses 175 mph as a county-level override above the ASCE map — see the dedicated [Miami-Dade page](/miami-dade-wind-load-calculator) for the full why.").
    **Also Q5 "What is the design wind speed in Naples or Marco Island?"** — that should live ON the Collier County page (verify) and be linked from FL, not duplicated.

13. **Location:** Sidebar CTA box (line 1021)
    **Shared text:** `<h3>Try It Free</h3>` + body `7-day trial, no credit card.`
    **Also appears on:** all 12 geo pages (CTA box wholesale templated).
    **Suggested rewrite:** Per-page variation: FL → `Try the FL Calculator Free`; TX → `Try It Free (TWIA-Aware)`; CA → `Try Both — Wind + Seismic-Aware`.

#### WATCH (5-9 words shared — track but lower priority)

- "permit-ready C&C report" (every page) — acceptable industry shorthand
- "in under 15 minutes" — every page; acceptable common claim but consider varying ("in 10 minutes" / "in a single sitting" / etc.)
- "Florida-licensed PE" — appropriately consistent terminology

---

### Page 2: `c:/Dev/windload-solutions/website/miami-dade-wind-load-calculator/index.html`

#### CRITICAL shared text (rewrite required)

1. **Location:** Hero ZIP form caption (line 771)
   **Shared text:** `Free 7-day trial. No credit card required.`
   **Also appears on:** all 12 geo pages.
   **Suggested rewrite:** `Free 7-day trial — every report includes Miami-Dade NOA references on every opening.`

2. **Location:** Process step #1 (line 936-937)
   **Shared text:** The pattern `The calculator looks up your ZIP, ...` (used on 9 pages)
   **Also appears on:** FL, BR, CC, PB, TX, NC, SC, CA, HI, VA
   **Suggested rewrite:** Lead with the unique Miami-Dade element: `Type any Miami-Dade ZIP from Aventura (33180) down to Florida City (33034) and the calculator stamps 175 mph HVHZ on the project header before you finish typing — no manual override, no "is this the right zone" check.`

3. **Location:** Process step #2 H4 (line 940) `Pick your Risk Category` — same as FL.
   **Suggested rewrite:** `Risk Category in Miami-Dade — what 175 mph really means at each tier`.

4. **Location:** Process step #3 H4 + body (lines 944-945)
   **Shared text:** `Set Exposure Category and building geometry` + the "Then enter length, width, mean roof height, roof slope (X over 12), and roof shape" closer.
   **Also appears on:** 9 geo pages.
   **Suggested rewrite:** `Set Miami-Dade exposure (D on the Atlantic strip, C suburban, B Brickell canyons) and key in building shape`. The MD page already has good location-specific lead text — the templated closer is what needs replacement: `Building length, width, mean roof height, X-in-12 pitch, and roof shape complete the input set; the calculator hands back zone-broken pressures next.`

5. **Location:** Process step #4 (line 949)
   **Shared text:** `The calculator returns MWFRS pressures (for the structural system) and C&C pressures (for individual openings...)`
   **Also appears on:** all 10 geo pages.
   **Suggested rewrite:** `The Miami-Dade output leads with the 175 mph-driven MWFRS frame demand, then drops the C&C table where Zone 5 wall corners and Zone 3 roof corners dominate — these are the values that decide whether an NOA-rated assembly clears or fails.`

6. **Location:** Mid-body CTA H3 (line 927) `Get Pressures for Your Miami-Dade Project`
   **Also appears on:** 11 geo pages (template).
   **Suggested rewrite:** `Open a Miami-Dade C&C Report Pre-Tagged for HVHZ`.

7. **Location:** Bottom CTA H3 (line 1016) `Ready to Run Your Miami-Dade Numbers?`
   **Also appears on:** 11 geo pages (template).
   **Suggested rewrite:** `From a Brickell condo to a Homestead remodel — one ZIP, one report.`

8. **Location:** "More Wind Load Resources" H2 (line 999)
   **Suggested rewrite:** `Adjacent HVHZ + Florida sister calculators`.

9. **Location:** Sidebar CTA `Try It Free` (line 1037)
   **Suggested rewrite:** `Try the Miami-Dade Calculator Free`.

10. **Location:** FAQ Q4 "Why is Miami-Dade 175 mph when the broader Florida baseline is around 170 mph?" (line 974-976)
    **Shared text:** Answer overlaps significantly with the Florida page's Q3 answer.
    **Suggested rewrite:** Keep this as the CANONICAL Miami-Dade answer (Miami-Dade is the right page for the deep dive). Rewrite the Florida page's Q3 to be a short pointer and pull more story-of-Hurricane-Andrew detail into the MD answer.

11. **Location:** Process steps as a block — every H4 (#2 through #5) shares wording with FL.
    **Suggested rewrite:** Re-title each step around the HVHZ specifics:
    - #1: `Confirm Miami-Dade jurisdiction + auto-apply 175 mph`
    - #2: `Pick Risk Category — and remember Cat III/IV scale above 175 mph`
    - #3: `Set Exposure (D oceanfront, B Brickell canyons, C everywhere else)`
    - #4: `Read the Zone 5 corner pressure — that's the NOA-match number`
    - #5: `Match each opening to an NOA, export the report`

#### WATCH

- "ASCE 7-22" mentioned same way across all FL-family pages — appropriate technical consistency
- "Florida Building Code 8th Edition (2023) took effect December 31, 2024" — appears on 5 FL-family pages; this is a *fact*, not a slogan, but vary the wording: FL says "took effect December 31, 2024," MD says "effective December 31, 2024," BR says "effective statewide on December 31, 2024" — already varied, OK.

---

### Page 3: `c:/Dev/windload-solutions/website/broward-wind-load-calculator/index.html`

#### CRITICAL shared text (rewrite required)

1. **Location:** Hero ZIP form caption (line 770) `Free 7-day trial. No credit card required.`
   **Also appears on:** 12 pages.
   **Suggested rewrite:** `7-day free trial — every report cross-references NOA + TAS 201/202/203 by opening.`

2. **Location:** Process step #1 (line 922) `Every Broward ZIP — 33301 Fort Lauderdale, ...` — Broward already has decent location-specific framing here. The H4 `Enter your Broward ZIP code` is templated though.
   **Suggested rewrite of H4:** `Type your Broward ZIP — auto-locks 170 mph + HVHZ flag`.

3. **Location:** Process step #2 (line 925-926)
   **Shared text:** Same Risk Category formula `single-family residences, townhouses, multifamily, retail, light commercial. Risk Category III applies to assembly buildings...`
   **Also appears on:** 7 state-only pages (CA, NC, SC, TX, VA, HI, LA) + FL family.
   **Suggested rewrite:** Lead with Broward: `Risk Category II picks up the single-family residences in Coral Springs, the rental condos along A1A, the strip retail in Davie, and the office mid-rises in Sunrise. Cat III bumps the speed for the schools, the BB&T Center type assembly buildings, and the Fort Lauderdale/Hollywood hotels above 300 occupants. Cat IV is Memorial Healthcare, Holy Cross, the fire stations, the EOCs — anything that must stay operational the morning after.`

4. **Location:** Process step #3 (line 930)
   **Shared text:** Closer "Then enter length, width, mean roof height, roof slope (X over 12), and roof shape."
   **Suggested rewrite:** Keep the location-specific opener (Exposure D on A1A — that's good) and replace the closer: `Punch in the building footprint, mean roof height, roof pitch as X-in-12, and roof type; the calculator handles every common Broward residential shape (gable, hip, monoslope) and the flat-roof commercial cases.`

5. **Location:** Process step #4 (line 933-934) `The calculator returns MWFRS pressures for the structural system and Components & Cladding pressures for each opening, broken down by zone: Zone 4 (wall field), Zone 5 (wall corner)...`
   **Also appears on:** 10 geo pages.
   **Suggested rewrite:** `What you get back: MWFRS pressures for the lateral system (the 170 mph drives a substantial Zone B/D corner pressure on any building over 30 ft mean roof) and C&C pressures broken into Zone 4 wall field, Zone 5 wall corner, and the roof zones for whichever geometry you selected. Zone 5 corner is almost always the value an HVHZ-rated assembly has to clear in Broward — note it first.`

6. **Location:** Mid-body CTA H3 (line 912) `Get Pressures for Your Broward Project`
   **Suggested rewrite:** `Generate a Broward HVHZ-Tagged C&C Report`.

7. **Location:** Bottom CTA H3 (line 1001) `Ready to Run Your Broward Numbers?`
   **Suggested rewrite:** `From A1A condo to a Pembroke Pines single-family — single tool, single report.`

8. **Location:** "More Wind Load Resources" H2 (line 984)
   **Suggested rewrite:** `Florida sibling counties + HVHZ-adjacent references`.

9. **Location:** Sidebar `Try It Free` block (line 1022-1025)
   **Suggested rewrite:** Custom heading + body: `Run a Broward Project Free` + `Broward HVHZ 170 mph wind loads, NOA references in the report, on a 7-day trial.`

10. **Location:** FAQ — verify Q4 "Why is Broward 170 mph when Miami-Dade is 175 mph?" answer (line 960-962) does not echo the parallel question on the Miami-Dade page (which has Q4 "Why is Miami-Dade 175 mph when the broader Florida baseline is around 170 mph?"). The two answers are different per spot-check (different angles) — OK.

11. **Location:** Edge strip "a" paragraph in FBC 8th section (line 871) — appears here AND on Florida page AND on Miami-Dade page AND on Collier page with near-identical wording.
    **Suggested rewrite:** Each county should frame the 4-ft minimum from its own permitting reality: BR → `Broward plan reviewers in particular look for the 4-ft FBC edge strip on every C&C zone calc — using 3 ft (the ASCE 7-22 elsewhere default) is one of the most common rejection reasons on first-time HVHZ submittals.`

#### WATCH
- "HVHZ" defined in similar terms across BR, MD, FL — acceptable terminology
- "NOA" + "TAS 201/202/203" — appropriate technical consistency

---

### Page 4: `c:/Dev/windload-solutions/website/collier-county-wind-load-calculator/index.html`

#### CRITICAL shared text (rewrite required)

1. **Location:** Hero ZIP form caption (line 784) `Free 7-day trial. No credit card required.`
   **Suggested rewrite:** `7-day free trial — every Collier report pre-stamps the 170 mph county wind speed.`

2. **Location:** Process step #2 H4 (line 960) `Pick your Risk Category`
   **Suggested rewrite:** `Risk Category — and what each tier means for Naples projects`.

3. **Location:** Process step #2 body (line 961) — opens with the same Risk-Cat-II formula appearing on 7+ pages.
   **Suggested rewrite:** Lead with Collier specifics: `For the bulk of Collier permits (custom homes in Pelican Bay, lanai expansions in Naples, multifamily in East Naples) the project is Risk Cat II. Cat III picks up the larger schools, the assembly halls, the larger Marco Island event spaces. Cat IV maps onto NCH Naples Hospital, Physicians Regional, the Collier EOC, and the fire stations. Each step up takes the 170 mph baseline higher.`

4. **Location:** Process step #3 H4 (line 964) `Set Exposure Category and building geometry`
   **Suggested rewrite:** `Set Naples/Marco exposure (D Gulf-front, C inland, B is rare) and building shape`.

5. **Location:** Process step #3 body (line 965) — has good Collier-specific opener but ends with the templated `Enter length, width, mean roof height, roof slope (X over 12), and roof shape, and the calculator does the rest.`
   **Suggested rewrite:** Replace closer: `Building footprint, mean roof height (lanais often calc out at 10-12 ft, custom homes 18-24 ft), roof pitch X-in-12, and roof shape complete the input — the calculator picks the right Chapter 30 procedure from there.`

6. **Location:** Process step #4 (line 968-969)
   **Shared text:** `The output includes both MWFRS pressures (for the building's structural system) and Components and Cladding pressures (for individual windows, doors, shutters, screen panels, and cladding elements). C&C output is broken down by zone — Zone 4 (wall field), Zone 5 (wall corner), plus the roof zones for your roof geometry.`
   **Also appears on:** 10 geo pages with similar wording.
   **Suggested rewrite:** Lead from the partially-open lanai angle (which IS specific to Collier already): `Output goes both ways: MWFRS pressures size the structural frame; C&C pressures size every screen panel, lanai column, window, and roof element. For Naples lanais (the most common Collier scope by volume) the report includes the ASCE 7-22 Partially Open enclosure pressures with GCpi=±0.18 baked into the screen-and-frame numbers. Zone 5 wall corner usually governs window selection; Zone 3 roof corner usually governs lanai roof panel pull-out.`

7. **Location:** Process step #5 (line 972-973) — H4 `Download the permit report and request a PE stamp` + body `For Collier County residential projects up to 3 stories — which covers essentially all single-family work, most multifamily, and the lanai/pool cage/window-replacement scopes...`
   **Shared "Most stamp requests are returned within 1 business day"** appears on FL too.
   **Suggested rewrite:** Keep the Collier-specific scope list (it's good), rewrite the PE turnaround: `Stamp requests on Collier projects are typically turned around inside one business day — most Naples lanai and window-replacement scopes come back same-day.`

8. **Location:** Mid-body CTA H3 (line 947) `Get Pressures for Your Collier Project`
   **Suggested rewrite:** `Pull 170 mph C&C Pressures for Your Naples or Marco Project`.

9. **Location:** Bottom CTA H3 (line 1036) `Ready to Run Your Collier County Numbers?`
   **Suggested rewrite:** `From Old Naples to Immokalee — the Collier Calculator in 15 Minutes`.

10. **Location:** "More Wind Load Resources" H2 (line 1019)
    **Suggested rewrite:** `Florida sibling-county and lanai-engineering resources`.

11. **Location:** Sidebar `Try It Free` (line 1058)
    **Suggested rewrite:** `Try the Collier Calculator Free`.

12. **Location:** Four-enclosure paragraph (line 893) `ASCE 7-22 recognizes four enclosure classifications (Enclosed, Partially Open, Partially Enclosed, Open) where ASCE 7-16 had three.`
    **Shared text:** Appears verbatim on the Florida page (line 869) and Miami-Dade (line 880). All three counties have it.
    **Suggested rewrite:** Frame the four-enclosure shift from a *lanai-engineering* angle (unique to Collier): `The single most consequential ASCE 7-22 change for Naples lanai design is the new Partially Open enclosure type. Pre-2022, a screened lanai got classified as Open or Partially Enclosed and the GCpi was either 0 or ±0.55 — neither of which fit the actual behavior. ASCE 7-22 introduced the fourth category, Partially Open, with GCpi=±0.18 — finally a coefficient that matches what a screen mesh actually does to internal pressure. Every Collier lanai we run on the new calculator uses this classification.`

#### WATCH
- Naples-specific FAQ "What is the design wind speed in Naples, Florida?" duplicates FL Q5 "What is the design wind speed in Naples or Marco Island?" — Collier should keep this one (it's the natural home); FL should remove or shorten.

---

### Page 5: `c:/Dev/windload-solutions/website/palm-beach-wind-load-calculator/index.html`

#### CRITICAL shared text (rewrite required)

1. **Location:** Hero ZIP caption (line 778) `Free 7-day trial. No credit card required.`
   **Suggested rewrite:** `7-day free trial — Palm Beach permit reports with ZIP-level wind speed precision.`

2. **Location:** Process step #2 (line 947-948)
   **Shared text:** `Risk Category II covers most Palm Beach occupancies: single-family homes, country club residential, mid-rise condos, retail, office, and light commercial.` Echoes the templated Risk Cat formula in tone even though the list is location-customized.
   **Also appears on:** 7 pages share the templated framing.
   **Suggested rewrite:** Lead from the Palm Beach scope distinctively: `Palm Beach's permit mix is Cat II-heavy: Boca single-family, Wellington equestrian estates, Delray Atlantic Avenue retail, West Palm office mid-rise. Cat III bumps in for the school districts (Palm Beach, Wellington), most of the major assembly facilities (Convention Center, iThink Amphitheatre), and any of the hotels above the occupancy trigger. Cat IV is Bethesda, Boca Regional, Good Sam, Jupiter Medical, the fire/EMS facilities, and the EOC.`

3. **Location:** Process step #3 H4 (line 951) `Set Exposure Category and building geometry`
   **Suggested rewrite:** `Set Palm Beach exposure (D barrier islands, C suburban, B in dense urban) + building shape`.

4. **Location:** Process step #3 body (line 952)
   **Shared text:** Closer `Then enter length, width, mean roof height, roof slope (rise over 12 run), and roof shape.`
   **Suggested rewrite:** `Building footprint, mean roof height, roof pitch X-in-12, and roof type complete the inputs; the calculator runs the right ASCE 7-22 procedure based on shape.`

5. **Location:** Process step #4 (line 955-956)
   **Shared text:** `The calculator returns MWFRS pressures (for the structural system) and C&C pressures...`
   **Suggested rewrite:** Lead with the Palm Beach coastal-gradient angle: `The output for a Palm Beach project leans heavily on getting the ZIP-level wind speed right (an east-Boca number is 5-10 mph above a Wellington number, and that shows up squared in the pressure). MWFRS frames the lateral spine; C&C delivers Zone 4 wall field, Zone 5 wall corner, and roof zones in a table you hand to your fenestration vendor for FL# matching.`

6. **Location:** Process step #5 — similar templated PE seal language to FL.

7. **Location:** Mid-body CTA H3 (line 934) `Get Pressures for Your Palm Beach Project` — template fingerprint.
   **Suggested rewrite:** `Pull ZIP-Precise Palm Beach Wind Pressures`.

8. **Location:** Bottom CTA H3 (line 1023) `Ready to Run Your Palm Beach Numbers?` — template fingerprint.
   **Suggested rewrite:** `From Manalapan oceanfront to Wellington Estates — one ZIP, one report.`

9. **Location:** "More Wind Load Resources" H2 (line 1006).

10. **Location:** Sidebar `Try It Free` (line 1044-1047) + `Palm Beach County ASCE 7-22 + FBC 8th Edition wind loads in 15 minutes. 7-day trial, no credit card.`
    **Suggested rewrite:** Heading: `Try the Palm Beach Calculator Free`. Body: `Per-ZIP ASCE 7-22 wind pressures for Palm Beach, generated to FBC 8th Edition. Trial includes the architectural-schedule .xlsx export.`

11. **Location:** Warning box `These are approximate — confirm via the calculator` (line 858)
    **Shared text:** Appears verbatim on FL, MD, BR, CC, PB and near-verbatim on NC, TX (7 pages).
    **Suggested rewrite:** Palm Beach version: `These numbers are starting points — the per-ZIP value is what matters in Palm Beach.` (Then short paragraph about gradient.)

#### WATCH
- "Approximately 170 mph for Risk Category II" appears on multiple FL-family pages — appropriate factual repetition
- FBC 8th Edition opening paragraph mirrors structure on other FL-family pages

---

### Page 6: `c:/Dev/windload-solutions/website/texas-wind-load-calculator/index.html`

#### CRITICAL shared text (rewrite required)

1. **Location:** Hero ZIP caption (line 774) `Free 7-day trial. No credit card required.`
   **Suggested rewrite:** `7-day free trial — Texas-permit-ready output with TWIA coastal flags built in.`

2. **Location:** Process step #2 H4 (line 969) `Pick your Risk Category`
   **Suggested rewrite:** `Texas Risk Category — and how it interacts with TWIA Cat-A/Cat-B coastal classification`.

3. **Location:** Process step #2 body (line 970)
   **Shared text:** The Risk-Cat-II formula opener `Risk Category II covers most occupancies (single-family, multifamily, retail, light commercial).`
   **Suggested rewrite:** `The Texas Cat II bucket is big: every Houston single-family, every Austin retail strip, every Dallas/Fort Worth multifamily, every Galveston vacation rental, every Corpus single-family. Cat III adds the assembly buildings and schools above the threshold (which in Texas often means the 6A football stadium that's also the storm shelter). Cat IV picks up MD Anderson, Memorial Hermann TMC, the major EOCs, and the fire stations.`

4. **Location:** Process step #3 (line 973-974)
   **Shared text:** "Then enter building dimensions: length, width, mean roof height, roof slope (X over 12), and roof shape."
   **Suggested rewrite:** Keep good Texas-specific exposure framing (already there) but replace the closer: `Building footprint, mean roof height, roof pitch X-in-12, and roof type drive the C&C zone calculation; the calculator passes the right ASCE 7-16 procedure based on geometry.`

5. **Location:** Process step #4 (line 977-978)
   **Shared text:** Templated `MWFRS pressures (for the structural system) and C&C pressures (for individual windows, doors, shutters, and cladding). C&C output includes the zone breakdown: Zone 4 wall field, Zone 5 wall corner...`
   **Suggested rewrite:** Lead with Texas-specific output: `For TWIA-region projects the report leads with the coastal flag (Galveston, Brazoria, Nueces ZIPs trigger this) so your WPI-8 inspector and your insurance underwriter both see it on page 1. MWFRS pressures size the lateral system; C&C pressures size every opening and cladding component, broken into Zone 4 wall field, Zone 5 corner, and the matching roof zones. For wind-borne debris region projects, that flag appears at the top so impact-rated specification gets prioritized.`

6. **Location:** Process step #5 (line 981-982) `Hand the report to a Texas-licensed PE for seal (where required)` — unique to Texas wording (good), but the body opener `Where your Texas jurisdiction requires a sealed wind load submittal, that seal must come from a PE licensed in Texas.` could be tightened. Less critical than other items.

7. **Location:** Mid-body CTA H3 (line 941) `Get Pressures for Your Texas Project` — template.
   **Suggested rewrite:** `Pull Texas Wind Pressures with TWIA Awareness Built In`.

8. **Location:** Bottom CTA H3 (line 1045) `Calculate Texas Wind Loads Instantly` — actually different from the templated "Ready to Run" pattern on other geo pages. Already good.

9. **Location:** "More Wind Load Resources" H2 (line 1028)
   **Suggested rewrite:** `Other state calculators and ASCE 7 reference material`.

10. **Location:** Sidebar `Try It Free` (line 1069)
    **Suggested rewrite:** `Try It Free (TWIA-Aware)`.

11. **Location:** Info-box framing at top (line 790): `Four things have to be right for a Texas wind load calculator to be useful: (1)...(2)...(3)...(4)...`
    **Shared pattern:** Florida uses 3-thing variant; Miami-Dade uses 3-thing; Hawaii uses 4-thing; Louisiana uses 3-thing. Same skeleton, different fill.
    **Suggested rewrite:** Drop the numbered-list framing entirely; write a single distinctive paragraph: `Texas wind load done right needs four things at once — the right ASCE 7-16 map for your ZIP, knowledge of which side of the TWIA boundary you're on, a clear wind-borne debris region flag if it applies, and a report a TDI Qualified Inspector will accept as the wind analysis underpinning a WPI-8. Anything less and your TWIA certification stalls.`

#### WATCH
- Glossary box (line 924-937) has unique-to-Texas content (TWIA, WPI-8, TDI) — keep as-is.
- "These are approximate — confirm via the calculator" warning box (line 886) — verbatim with FL, MD, PB. Rewrite the heading or body.

---

### Page 7: `c:/Dev/windload-solutions/website/north-carolina-wind-load-calculator/index.html`

#### CRITICAL shared text (rewrite required)

1. **Location:** Hero ZIP caption (line 816) `Free 7-day trial. No credit card required.`
   **Suggested rewrite:** `7-day free trial — output formatted for NC PE review + AHJ submittal.`

2. **Location:** Process step #1 (line 987) opens `The calculator looks up your ZIP, determines the correct North Carolina county, and pulls the ASCE 7 baseline wind speed.`
   **Shared text:** "The calculator looks up your ZIP" is on 9 pages.
   **Suggested rewrite:** `Type any NC ZIP — Manteo 27954 on the Outer Banks, Wilmington 28401 on the coast, Charlotte 28202 in the Piedmont, Asheville 28801 in the mountains — and the calculator drops the ASCE 7 baseline value plus an Exposure default tied to that ZIP's surroundings.`

3. **Location:** Process step #2 body (line 992)
   **Shared text:** Risk Category formula.
   **Suggested rewrite:** Per NC: `For NC, Cat II covers the bulk of permit volume — single-family on the Outer Banks, beachfront cottages in Wrightsville, multifamily in Raleigh, retail in Charlotte. Cat III adds the larger NC schools (above the occupancy threshold the NCBC sets), assembly buildings, and the substantial-hazard occupancies. Cat IV is the NC essential facilities — Duke Health, UNC Health, the hospital networks, the fire/EMS facilities, and the EOCs.`

4. **Location:** Process step #3 (line 995-996)
   **Shared text:** `Exposure C is the North Carolina default for most suburban and rural sites. Exposure B applies for projects shielded by surrounding buildings or dense trees on all sides... Then enter building dimensions: length, width, mean roof height, roof slope (X over 12), and roof shape.`
   **Suggested rewrite:** Keep the NC-specific examples (Outer Banks Exposure D — good), replace the closer: `Punch building length, width, mean roof height, roof pitch X-in-12, and roof shape. NC stock skews to gable and hip — both are first-class in the calculator.`

5. **Location:** Process step #4 (line 999-1000)
   **Shared text:** `The calculator returns MWFRS pressures (for the structural system) and C&C pressures (for individual windows, doors, shutters, and cladding elements). C&C output includes zone breakdowns: Zone 4 (wall field), Zone 5 (wall corner)...`
   **Suggested rewrite:** Lead from the NC mix angle: `Output covers MWFRS for the structural skeleton (which on an Outer Banks beachfront stilts an Exposure D / 145-150 mph project right up to the highest C&C numbers we see anywhere east of FL) and C&C zone-by-zone for the openings and cladding. Every pressure is annotated with the controlling factor so your NC PE can audit the math fast.`

6. **Location:** Mid-body CTA H3 (line 978) `Get Pressures for Your North Carolina Project` — template.
   **Suggested rewrite:** `Generate an NC Wind Load Report for Your AHJ`.

7. **Location:** Bottom CTA H3 (line 1069) `Ready to Run Your North Carolina Numbers?` — template.
   **Suggested rewrite:** `From Hatteras to the High Country — One NC Calculator`.

8. **Location:** "More Wind Load Resources" H2 (line 1050).

9. **Location:** Sidebar `Try It Free` (line 1092-1095) `NC-ready ASCE 7 wind loads in 15 minutes. 7-day trial, no credit card.`
   **Suggested rewrite:** Heading: `Try the NC Calculator Free`. Body: `ASCE 7 wind loads for any NC ZIP, formatted for state PE review and the Authority Having Jurisdiction.`

10. **Location:** Process step #5 PE-stamp paragraph (line 1003-1004) — has good NC-specific framing already; the templated `we do not provide North Carolina PE stamps directly` is appropriately scoped.

#### WATCH
- Hurricane context section (Matthew, Florence, Helene) is unique to NC — keep.
- Glossary block (line 918-929) is NC-only.

---

### Page 8: `c:/Dev/windload-solutions/website/south-carolina-wind-load-calculator/index.html`

#### CRITICAL shared text (rewrite required)

1. **Location:** Hero ZIP caption (line 814) `Free 7-day trial. No credit card required.`
   **Suggested rewrite:** `7-day free trial — Charleston-coast and Upstate SC ZIPs both supported.`

2. **Location:** Process step #2 (line 957-958)
   **Shared text:** `Risk Category II covers most occupancies (single-family, multifamily, retail, light commercial). Risk Category III adds assembly, schools, and substantial-hazard buildings. Risk Category IV is for essential facilities (hospitals, fire stations, EOCs).`
   **Suggested rewrite:** Per SC: `In SC, Cat II is most of what gets permitted: Mount Pleasant single-family, Charleston peninsula retrofits, Myrtle Beach condos, Greenville suburban multifamily. Cat III is the SC public school stock (above the occupancy trigger), assembly buildings, and the substantial-hazard category. Cat IV picks up MUSC, Roper, the Greenville Health network, the regional fire and EMS facilities, and the EOCs.`

3. **Location:** Process step #3 H4 + body (line 961-962)
   **Shared text:** `Set Exposure Category and building geometry` + the templated `Then enter the building dimensions: length, width, mean roof height, roof slope (X over 12), and roof shape.` closer.
   **Suggested rewrite:** `Pick SC Exposure (B in dense urban Charleston peninsula and shaded Upstate subdivisions, C suburban default, D oceanfront barrier islands and Hilton Head Atlantic-facing) and key in building shape: length, width, mean roof height, roof pitch X-in-12, and roof geometry.`

4. **Location:** Process step #4 (line 965-966)
   **Shared text:** Same templated MWFRS+C&C+Zone-4/5 paragraph.
   **Suggested rewrite:** SC version: `The output lays out MWFRS pressures for your lateral system plus C&C pressures broken into Zone 4 wall field, Zone 5 wall corner, and the corresponding roof zones for your shape. Each pressure ships with a plain-English note about what's driving it (wind speed, exposure category, GCp, gust factor), which makes the SC plan reviewer's job — and your PE's review — straightforward.`

5. **Location:** Mid-body CTA H3 (line 931) `Get Pressures for Your South Carolina Project`.
   **Suggested rewrite:** `Pull SC Wind Pressures from Charleston Coast to the Blue Ridge`.

6. **Location:** Bottom CTA H3 (line 1080) `Ready to Run Your South Carolina Numbers?`.
   **Suggested rewrite:** `From Hugo-rebuilt coast to Upstate — one SC calculator.`

7. **Location:** "More Wind Load Resources" H2 (line 1046).

8. **Location:** Sidebar `Try It Free` (line 1104) `SC-ready ASCE 7 wind loads in 15 minutes. 7-day trial, no credit card.`
   **Suggested rewrite:** Heading: `Try the SC Calculator Free`. Body: `ASCE 7-16 wind loads per the 2021 SC Building Code, ready to hand to a SC-licensed PE for seal.`

9. **Location:** Glossary-span pattern across process steps (the `<span class="glossary-term">` calls to MWFRS, C&C, Risk Cat II) is unique to SC — keep, it's a useful structural differentiator from sibling state pages.

10. **Location:** Differentiator cards (line 974-997) — generic "Since 2002 / Plain-English / Modern, mobile-first / Same-day support" — these are SaaS-generic. Consider replacing with SC-specific differentiators (Charleston BAR awareness, Hugo-derived code knowledge, etc.).

#### WATCH
- Hurricane Hugo section is unique to SC — keep.
- Charleston BAR section is unique to SC — keep.

---

### Page 9: `c:/Dev/windload-solutions/website/california-wind-load-calculator/index.html`

#### CRITICAL shared text (rewrite required)

1. **Location:** Hero ZIP caption (line 781) `Free 7-day trial. No credit card required.`
   **Suggested rewrite:** `7-day free trial — wind output you can compare against your seismic case.`

2. **Location:** Process step #1 (line 990) `The calculator looks up your ZIP, determines the correct California county, and pulls the ASCE 7-16 baseline basic wind speed for the location.`
   **Suggested rewrite:** `Drop any California ZIP — LA basin 90015, SF 94110, Palm Springs 92262, Tehachapi 93561 — and the calculator pulls the ASCE 7-16 baseline wind speed plus a flag if you've landed in or near a Special Wind Region.`

3. **Location:** Process step #2 (line 994-995) `Risk Category II covers most occupancies (single-family, multifamily, retail, light commercial). Risk Category III adds assembly and schools. Risk Category IV is for essential facilities (hospitals, fire stations, EOCs).`
   **Suggested rewrite:** Per CA: `In California, the Cat II default holds for single-family (still the residential bulk), multifamily, retail, and light commercial. Cat III bumps in for public schools (which go through DSA review), assembly buildings, and the substantial-hazard category. Cat IV picks up hospitals (under HCAI / former OSHPD review), fire stations, EOCs, and other essential facilities — and these projects often require a CA SE, not just a CA PE.`

4. **Location:** Process step #4 (line 1002-1003)
   **Shared text:** `The calculator returns MWFRS pressures (for the structural system) and C&C pressures (for individual cladding elements).`
   **Suggested rewrite:** `California output is two-handed by design: MWFRS pressures land alongside your seismic case so you can pick the governing envelope; C&C pressures get used regardless — wind C&C controls a curtain wall in San Francisco no matter what the SDC says. Output is broken into zone-level numbers so cladding selection happens fast.`

5. **Location:** Mid-body CTA H3 (line 981) `Run Your California Wind Numbers` — already non-templated. Good.

6. **Location:** Bottom CTA H3 (line 1072) `Ready to Run Your California Numbers?` — template.
   **Suggested rewrite:** `Compare CA Wind to Seismic — Free 7-Day Trial`.

7. **Location:** "More Wind Load Resources" H2 (line 1053).

8. **Location:** Sidebar `Try It Free` (line 1098-1101) `California-aware ASCE 7-16 + CBC 2022 wind loads in 15 minutes. 7-day trial, no credit card.`
   **Suggested rewrite:** Heading: `Try the CA Calculator Free`. Body: `ASCE 7-16 wind output formatted for CA PE/SE review and CBC 2022 submittal; complements your seismic workflow.`

9. **Location:** Glossary block (line 832-838) — Definitions of MWFRS, C&C, Risk Category, Exposure Category, Basic wind speed, Special Wind Region. The definitions are short and standard. They appear in similar form on other pages (SC has spans inline, NC has a full dl).
   **Suggested rewrite:** Rephrase definitions in CA-flavored terms: `MWFRS — the lateral force-resisting system that takes wind; in California, you're sizing this against the parallel seismic case and using the envelope.` Etc.

#### WATCH
- "Wind vs seismic in California" section is unique to CA and excellent — keep.
- Special Wind Regions section (Banning, Tehachapi, Altamont, Cajon) is unique to CA — keep.
- "California Permits, PE, SE, OSHPD, and DSA" section is unique — keep.

---

### Page 10: `c:/Dev/windload-solutions/website/louisiana-wind-load-calculator/index.html`

#### CRITICAL shared text (rewrite required)

1. **Location:** Hero ZIP caption (line 880) `Free 7-day trial. No credit card required.`
   **Suggested rewrite:** `7-day free trial — outputs are parish-aware (not "county") on every LA report.`

2. **Location:** Process step #1 (line 1063-1064) `The calculator looks up the ZIP, returns the correct Louisiana parish, and pulls the ASCE 7-16 design wind speed from the contour maps.` — Already location-specific (uses "parish"), good. The pattern is templated but the wording is differentiated.

3. **Location:** Process step #2 (line 1068)
   **Shared text:** `Risk Category II covers most occupancies (single-family, multifamily, retail, most commercial). Risk Category III covers assembly buildings, schools, and substantial-hazard facilities. Risk Category IV is for essential facilities (hospitals, fire stations, emergency operations centers).`
   **Suggested rewrite:** Per LA: `In LA, Cat II is the workhorse — Lafayette single-family, Baton Rouge multifamily, Shreveport retail, New Orleans Marigny rehabs. Cat III lifts the speed for the LSU and Tulane assembly buildings, the larger school districts (above the occupancy threshold), and the substantial-hazard category. Cat IV picks up Ochsner, LCMC Health, the regional medical centers, fire stations, and the parish EOCs — anything that has to keep operating after a Cat 4 like Ida or Laura.`

4. **Location:** Process step #3 (line 1072) `Exposure C is the Louisiana default for most suburban and rural sites — open terrain with scattered obstructions. Exposure B applies for sites shielded by surrounding buildings or dense trees on all sides... Then enter building length, width, mean roof height, roof slope (X over 12), and roof shape.`
   **Suggested rewrite:** Keep good LA-specific exposure examples, replace the closer: `Building length, width, mean roof height, roof pitch X-in-12, and roof shape complete the input set. The calculator uses these to drop the right ASCE 7-16 procedure — straightforward for the rectangular Acadiana ranch, more involved for the irregular New Orleans shotgun/double rebuild.`

5. **Location:** Process step #4 (line 1076)
   **Shared text:** `The calculator returns MWFRS pressures (for the lateral force-resisting system) and Components and Cladding pressures (for individual windows, doors, and cladding elements). C&C output includes zone breakdowns — Zone 4 (wall field), Zone 5 (wall corner), and the corresponding roof zones for your roof type.`
   **Suggested rewrite:** Per LA: `LA output leads with the parish-stamped MWFRS (Plaquemines 150-160 mph drives the highest LA Zone 5 corner C&C we generate) and the per-opening C&C table. Every pressure cites the specific ASCE 7-16 figure or equation so your LAPELS-licensed PE — and the parish plan reviewer — can audit the path with a single open code book.`

6. **Location:** Mid-body CTA H3 (line 1054) `Get Pressures for Your Louisiana Project` — template.
   **Suggested rewrite:** `Pull Parish-Aware LA Wind Pressures`.

7. **Location:** Bottom CTA H3 (line 1196) `Ready to Run Your Louisiana Numbers?` — template.
   **Suggested rewrite:** `From the Mississippi River delta to North LA — one parish-aware calculator.`

8. **Location:** "More Wind Load Resources" H2 (line 1137).

9. **Location:** Sidebar `Try It Free` (line 1220-1223) `Louisiana-ready LSUCC + ASCE 7-16 wind loads in 15 minutes. 7-day trial, no credit card.`
   **Suggested rewrite:** Heading: `Try the LA Calculator Free`. Body: `LSUCC-aligned ASCE 7-16 wind loads, parish-stamped, ready for LAPELS PE review.`

10. **Location:** Info-box framing at top (line 893): `Three things have to be right for a Louisiana wind load calculator to be useful: (1)...(2)...(3)...` — same skeleton as FL, MD, TX, HI.
    **Suggested rewrite:** Drop the numbered "three things" pattern, use a single distinctive paragraph: `A Louisiana wind load calculation has to honor three locally-loaded facts at once: the ASCE 7-16 contour for the parish (gradient is steep, 150 mph to 110 mph across the state), the parish-not-county nomenclature (anything else marks the work as out-of-state), and the LSUCC's young-but-aggressive enforcement posture (Katrina built the code; Ida and Francine tested it).`

#### WATCH
- Hurricane timeline (Laura, Delta, Ida, Francine) is LA-specific — keep.
- Post-Katrina LSUCC origin story is LA-specific — keep.
- Parish system explainer is LA-specific — keep.
- Glossary `<dl>` block (line 1085-1100) has some terms that overlap with other state pages' glossaries (MWFRS, C&C, Risk Category, Exposure Category). Consider differentiation: e.g., for LA define MWFRS specifically as "the shear walls and diaphragms a New Orleans shotgun renovation has to verify" rather than the generic definition.

---

### Page 11: `c:/Dev/windload-solutions/website/virginia-wind-load-calculator/index.html`

#### CRITICAL shared text (rewrite required)

1. **Location:** Hero ZIP caption (line 795) `Free 7-day trial. No credit card required.`
   **Suggested rewrite:** `7-day free trial — output formatted for VA PE review and VCC-aligned submittal.`

2. **Location:** Process step #1 (line 972-973) `The calculator looks up your ZIP, identifies the county or independent city (Virginia has 38 independent cities that operate outside any county, which often surprises out-of-state users)...` — Has good VA-specific framing already (independent cities). Keep.

3. **Location:** Process step #2 (line 977)
   **Shared text:** `Risk Category II covers most occupancies (single-family, multifamily, retail, light commercial). Risk Category III adds schools above a certain occupancy and assembly buildings. Risk Category IV is for essential facilities (hospitals, fire stations, EOCs, designated emergency shelters — which matters in coastal Hampton Roads where many schools are dual-designated).`
   **Suggested rewrite:** Per VA: `In VA, Cat II runs the gamut — Norfolk single-family, NoVA mid-rise, Richmond rowhouse rehab, Shenandoah agricultural. Cat III is the larger schools and the assembly buildings (the bumped category matters specifically in coastal Hampton Roads, where many schools double as emergency shelters and get Cat III by occupancy or Cat IV by use). Cat IV picks up the VCU/UVA/VA Tech medical centers, Sentara, Inova Fairfax, the fire/EMS facilities, and the state and federal EOCs.`

4. **Location:** Process step #3 (line 980-981) `For Hampton Roads waterfront and Eastern Shore projects, double-check whether Exposure D applies — within roughly one mile of unobstructed open water. For most of NoVA and Richmond, Exposure B (urban / suburban with closely-spaced buildings on all sides) is correct. Then enter length, width, mean roof height, roof slope (rise per 12 inches of run), and roof shape.`
   **Suggested rewrite:** Keep the VA-specific exposure framing (good), replace the closer: `Punch building length, width, mean roof height, roof pitch (rise-per-12-run, the VA permit standard), and roof type. The calculator drops the right Chapter 30 C&C procedure based on shape.`

5. **Location:** Process step #4 (line 984-985)
   **Shared text:** `The calculator returns MWFRS pressures for the structural system and C&C pressures for individual openings, cladding, and roofing elements. C&C output includes zone breakdowns: Zone 4 (wall field), Zone 5 (wall corner), Zone 1/2/3 for the roof depending on geometry.`
   **Suggested rewrite:** Per VA: `Output ships MWFRS for the structural frame plus C&C broken zone-by-zone — Zone 4 wall field, Zone 5 corner, plus the roof zones for whichever shape you selected (1/2/3 for gable/hip, the matching set for the other geometries). Every value is annotated with the controlling factor (wind speed, Kz, Kd, GCp) so your VA PE can audit the calculation path quickly.`

6. **Location:** Mid-body CTA H3 (line 926) `Get Pressures for Your Virginia Project` — template.
   **Suggested rewrite:** `Pull VA Wind Pressures for Your Hampton Roads, NoVA, or Mountain Project`.

7. **Location:** Bottom CTA H3 (line 1054) `Ready to Run Your Virginia Numbers?` — template.
   **Suggested rewrite:** `From the Eastern Shore to Wise County — one VA calculator.`

8. **Location:** "More Wind Load Resources" H2 (line 1035).

9. **Location:** Sidebar `Try It Free` (line 1078) `ASCE 7-16 + VCC-aligned wind loads for any Virginia ZIP in 15 minutes. 7-day trial, no credit card.`
   **Suggested rewrite:** Heading: `Try the VA Calculator Free`. Body: `Per-ZIP ASCE 7-16 wind loads aligned to the current 2021 VCC, formatted for VA PE review and locality submittal.`

#### WATCH
- Hampton Roads + Naval Station Norfolk section is unique to VA — keep.
- NoVA deep-dive section is unique to VA — keep.
- Five-region cards are appropriately VA-specific — keep.
- Hurricane Isabel 2003 reference is unique to VA — keep.

---

### Page 12: `c:/Dev/windload-solutions/website/hawaii-wind-load-calculator/index.html`

#### CRITICAL shared text (rewrite required)

1. **Location:** Hero ZIP caption (line 822) `Free 7-day trial. No credit card required.`
   **Suggested rewrite:** `7-day free trial — every Hawaii report is special-wind-region aware and built for HRS Chapter 464 PE review.`

2. **Location:** Process step #1 (line 992-993) `The calculator looks up your ZIP, determines which of the four Hawaii counties the site sits in, and pulls the ASCE 7-16 baseline wind speed.` — Good HI framing about four counties.

3. **Location:** Process step #2 (line 996-997)
   **Shared text:** `Risk Category II covers most occupancies (single-family, multifamily, retail, light commercial). Risk Category III adds assembly, schools, and substantial-hazard buildings. Risk Category IV is for essential facilities (hospitals, fire stations, emergency operations centers).`
   **Suggested rewrite:** Per HI: `In Hawaii, Cat II covers most of the four counties' permit volume — Honolulu single-family, Maui condos, Big Island custom homes, Kauai resort renovations. Cat III adds the larger DOE schools (above the occupancy threshold) and the assembly buildings (Hawaii Convention Center, the larger Waikiki venues). Cat IV picks up Queen's, Kapiolani, Maui Memorial, the fire/EMS facilities, and the county and state EOCs — every facility that has to remain functional through and after an Iniki-class hurricane.`

4. **Location:** Process step #4 (line 1004-1005)
   **Shared text:** `Length, width, mean roof height, roof slope (X over 12), and roof shape feed the C&C and MWFRS engines. The calculator returns MWFRS pressures (for the structural system) and C&C pressures...`
   **Suggested rewrite:** Per HI: `Building footprint, mean roof height, X-in-12 pitch, and roof shape drive both C&C and MWFRS engines. Output for Hawaii leads with MWFRS (and the connection schedule that the post-Iniki Hawaii engineering community treats as more important than member sizing) plus C&C broken into Zone 4 wall field, Zone 5 corner, and the appropriate roof zones — lanai screens read directly off the partially-open enclosure pressures.`

5. **Location:** Process step #5 (line 1008-1009) — has good HRS Chapter 464 framing already.

6. **Location:** Mid-body CTA H3 (line 1014) `Get Pressures for Your Hawaii Project` — template.
   **Suggested rewrite:** `Pull ASCE 7-16 Hawaii Wind Loads for Your PE`.

7. **Location:** Bottom CTA H3 (line 1079) `Ready to Run Your Hawaii Numbers?` — template.
   **Suggested rewrite:** `From Honolulu to Hilo to Hana — One Calculator, All Four Counties`.

8. **Location:** "More Wind Load Resources" H2 (line 1061).

9. **Location:** Sidebar `Try It Free` (line 1102) `ASCE 7-16 Hawaii wind loads in 15 minutes. 7-day trial, no credit card. Output ready for your Hawaii-licensed PE.`
   **Suggested rewrite:** Heading: `Try the HI Calculator Free`. Body: `ASCE 7-16 wind loads for all four Hawaii counties, SWR-aware, formatted for HI PE review under HRS Ch. 464.`

10. **Location:** Info-box `Four things have to be right for a Hawaii wind load calculator to be useful: (1)...(2)...(3)...(4)...` (line 840) — same skeleton pattern shared with TX, LA, FL, MD.
    **Suggested rewrite:** Replace with single paragraph: `Hawaii wind load done right reads the ASCE 7-16 island maps correctly, flags every Special Wind Region site (interior Maui isthmus, windward slopes, ridge sites) so you don't accept the standard map value where it doesn't apply, applies Exposure D along the windward open ocean coastline by default, and produces a report a Hawaii-licensed PE under HRS Chapter 464 will accept as the analysis basis for a sealed submittal.`

#### WATCH
- Hurricane Iniki section is unique to HI — keep.
- Four-county adoption section is unique to HI — keep.
- Tropical context section (trade winds, tsunami, volcano) is unique to HI — keep.

---

### Page 13: `c:/Dev/windload-solutions/website/asce-hazard-tool-alternative/index.html`

**Note:** This page is structurally different from the geographic pages. It uses a comparison-table approach, not the H2/process-step/FAQ template. Its body content overlaps with the geo pages in only minor ways.

#### CRITICAL shared text (rewrite required)

1. **Location:** "Pick Your Risk Category" process step #2 H4 (line 1057)
   **Shared text:** `Pick Your Risk Category`
   **Also appears on:** all 12 geo pages.
   **Suggested rewrite:** `Choose Your Risk Category (I through IV)`.

2. **Location:** Hero form note (line 886) `No signup. No ASCE membership. No credit card.`
   **Shared text:** "No credit card" overlaps with the "No credit card required" pattern on all geo pages (different wording, similar value prop).
   **Allowed-ish:** The AHA framing is distinctive ("No ASCE membership") so this likely passes. **WATCH** only.

3. **Location:** Trust block + last-updated (line 1188-1191)
   **Shared text:** `Reviewed by Bob, P.E. (Florida licensed). Serving wind load professionals since 2002.`
   **This is the allowed footer trust block** — keep as-is.

4. **Location:** Outgoing links to sibling calculators (`/wind-load-calculator-shop.html`, etc.) — these are navigation, not body content. Allowed.

#### WATCH
- "What replaced ATC Hazards by Location?" and the rest of the FAQ are unique to AHA.
- The 8-row comparison table (WindLoadCalc vs ATC vs ASCE Hazard Tool vs USGS) is unique to AHA.

**Total AHA cleanup:** 1 critical fix (the process step H4 wording) + 1 watch item.

---

## Section 4 — Boilerplate Confirmation (Appropriately Shared)

The following items are allowed shared chrome and **should NOT be rewritten** by the cleanup agents:

### Site navigation chrome
- `<header class="main-header">` block with logo + `<a class="header-cta">Start Free Trial</a>` button
- `<footer class="main-footer">` with the four columns (Contact, Calculators, Resources, Company)

### Footer-bottom trust block (allowed identical across all 13 pages)
- `© 2002–2026 WindLoadCalc. All rights reserved.`
- `Last updated: May 23, 2026 — Reviewed by Bob, P.E. (Florida licensed). Serving wind load professionals since 2002.` (or close variants — slight per-page variation allowed)

### Form HTML structure (the SEMANTICS can be shared; surrounding labels/headlines must differ)
- `<form class="zip-form">` element structure (input + submit button)
- 5-digit ZIP input pattern + JavaScript `launchCalc(e)` function

### JSON-LD schema TYPES (the data must be page-unique; type structure is shared)
- `SoftwareApplication` + `BreadcrumbList` + `FAQPage` schemas all use the same `@type` values — that is correct

### CSS classes
- All class names (`.main-header`, `.article-header`, `.zip-form`, `.wind-table`, `.faq-item`, `.process-step`, etc.) are shared design system — keep.

### Phone + email contact
- `info@windloadcalc.com`, `support@windloadcalc.com`, `(833) 272-3946` — appropriately consistent.

---

## Section 5 — Patterns Observed (for future agent briefs)

### Pattern 1: The "Three Things / Four Things" intro framing

**Where:** Florida, Miami-Dade, Texas, Louisiana, Hawaii (5 pages)

**Verbatim skeleton:** `[Three|Four] things have to be right for a {LOCATION} wind load calculator to be useful: (1)...(2)...(3)[(4)]... WindLoadCalc does [all three|all four].`

**Codify in agent brief:** "Do NOT open an info-box with `Three things have to be right for a {LOCATION} wind load calculator to be useful` or any variant. Write a single distinctive paragraph that names what the calculator does for that specific jurisdiction, without enumeration."

### Pattern 2: The 5-step process box

**Where:** all 12 geographic pages

**Verbatim skeleton:**
1. H4: `Enter your {LOCATION} ZIP code` → body opens `The calculator looks up your ZIP, determines the correct {LOCATION} county/parish, and pulls the ASCE 7-{XX} baseline wind speed.`
2. H4: `Pick your Risk Category` → body opens `Risk Category II covers most occupancies (single-family, multifamily, retail, light commercial). Risk Category III adds ... Risk Category IV is for essential facilities (hospitals, fire stations, EOCs).`
3. H4: `Set Exposure Category and building geometry` → body ends `Then enter [building dimensions: ]length, width, mean roof height, roof slope (X over 12), and roof shape.`
4. H4: `Review the calculated pressures` → body opens `The calculator returns MWFRS pressures (for the structural system) and C&C pressures (for individual windows, doors, shutters, and cladding elements). C&C output includes zone breakdowns: Zone 4 (wall field), Zone 5 (wall corner), and the corresponding roof zones for your roof type.`
5. H4: `Download the permit report — and optionally request a PE stamp` OR `Hand the report to a {STATE}-licensed PE for sign and seal` → body discusses PE service scope.

**Codify in agent brief:** "Rewrite all 5 process-step H4s to be jurisdiction-specific (do not use the generic verb forms 'Pick / Set / Review / Download'). Rewrite each step body to open with location-specific content; do NOT copy the templated Risk Category formula, the Exposure Category formula, the building-geometry closer, or the MWFRS+C&C+Zone-4/Zone-5 sentence."

### Pattern 3: The H2 fingerprints

**Where:** 12 geographic pages

**Templated H2s:**
- `{LOCATION} Wind Speed Quick Reference` (12 pages)
- `How to Calculate Your {LOCATION} Wind Load` (12 pages)
- `{LOCATION} Wind Load FAQ` (12 pages)
- `More Wind Load Resources` (12 pages, IDENTICAL)

**Codify in agent brief:** "Use distinct H2 wording per page. 'More Wind Load Resources' is a fingerprint and must be replaced. Examples: 'Florida-adjacent calculators and ASCE deep-dives', 'Tools cross-referenced from a CA wind+seismic workflow', 'Parish-aware sibling calculators (and FL HVHZ comparison)'."

### Pattern 4: The CTA H3 fingerprints

**Templated H3s shared by 11 pages each:**
- Mid-body CTA: `Get Pressures for Your {LOCATION} Project`
- Bottom CTA: `Ready to Run Your {LOCATION} Numbers?`
- Sidebar CTA: `Try It Free`

**Codify in agent brief:** "Replace all three CTA H3s with location-specific framing. Vary the verb (Pull / Generate / Open / Compute / See What / Audit) and the appeal (jurisdiction quirk / scope / output format / PE workflow)."

### Pattern 5: The sidebar CTA body

**Templated pattern:** `{LOCATION}-ready ASCE 7-{XX} [+ {CODE}] wind loads in 15 minutes. 7-day trial, no credit card.`

**Where:** all 12 geo pages with minor variations.

**Codify in agent brief:** "Replace the sidebar CTA body. Do not use the `in 15 minutes. 7-day trial, no credit card.` pattern. Write a one-line value prop unique to the page's jurisdiction."

### Pattern 6: The "These are approximate" warning box

**Templated heading:** `These are approximate — confirm via the calculator`
**Where:** FL, MD, BR, CC, PB (verbatim), NC, TX (near-verbatim) — 7 pages.

**Codify in agent brief:** "Replace the warning box heading + body. Don't open with 'These are approximate'. Give a jurisdiction-specific reason the table values shouldn't be used directly."

### Pattern 7: The FAQ topic overlap

**Topics shared across pages (acceptable to share topics, NOT acceptable to share Q+A wording):**
- "What is the wind speed in {CITY}?" — appears on every page (FL, MD, BR, CC, PB, TX, NC, SC, CA, LA, VA, HI)
- "Do I need a {STATE} PE to seal my wind load report?" — appears on every state-only page (TX, NC, SC, CA, LA, VA, HI) + indirectly on FL family
- "What ASCE edition does {STATE} use?" — appears on NC, SC, CA, TX, VA, HI

**Codify in agent brief:** "FAQ topic overlap is fine and expected — users in each location ask similar questions. But Q wording and A wording must be 100% page-unique. Write every FAQ as if no other state page exists. The Q itself should reference the specific location ('What's the wind speed on the Outer Banks?' not 'What is the wind speed on the coast?')."

### Pattern 8: The mass-shared 12-word opener

**The specific opener that triggered the rule** (per `feedback_zero_templated_body_content.md`):

`The calculator returns MWFRS pressures (for the structural system) and C&C pressures`

**Where:** 10 pages (FL, MD, BR, CC, PB, TX, NC, SC, LA, VA — basically every geo page that has a process-step section).

**Codify in agent brief:** "DO NOT use the clause 'The calculator returns MWFRS pressures (for the structural system) and C&C pressures' or any close paraphrase. Lead the process-step #4 body with a jurisdiction-specific framing of what the output is and what it's used for in that location."

### Pattern 9: The internal-link grid intro

**Templated H3:** `Related calculators and guides` (10 pages)

**Codify in agent brief:** "Replace the related-links H3 with a location-specific phrase. Examples: 'Florida sister calculators + ASCE deep-dives', 'Texas + Gulf-coast adjacent calculators', 'Pacific coast wind tools and CA-relevant references'."

### Pattern 10: The "Last updated" + reviewer line

**Acceptable** when in the single footer-bottom trust block (allowed boilerplate per the rule).
**NOT acceptable** when embedded in the main body content area as a separate `<p class="last-updated">` (this happens on TX, NC, CA, LA, SC, HI, VA — 7 pages) AND the footer-bottom trust block also has it (FL, MD, BR, CC, PB — 5 pages).

**Codify in agent brief:** "Keep ONE 'Last updated + Reviewed by' line per page. Either in the footer-bottom (preferred — matches the allowed boilerplate carve-out) or as the last paragraph in main content. Not both. Vary slightly per page."

---

## Closing notes

**Source pages cited above (absolute paths):**
- `c:/Dev/windload-solutions/website/florida-wind-load-calculator/index.html`
- `c:/Dev/windload-solutions/website/miami-dade-wind-load-calculator/index.html`
- `c:/Dev/windload-solutions/website/broward-wind-load-calculator/index.html`
- `c:/Dev/windload-solutions/website/collier-county-wind-load-calculator/index.html`
- `c:/Dev/windload-solutions/website/palm-beach-wind-load-calculator/index.html`
- `c:/Dev/windload-solutions/website/texas-wind-load-calculator/index.html`
- `c:/Dev/windload-solutions/website/north-carolina-wind-load-calculator/index.html`
- `c:/Dev/windload-solutions/website/south-carolina-wind-load-calculator/index.html`
- `c:/Dev/windload-solutions/website/california-wind-load-calculator/index.html`
- `c:/Dev/windload-solutions/website/louisiana-wind-load-calculator/index.html`
- `c:/Dev/windload-solutions/website/virginia-wind-load-calculator/index.html`
- `c:/Dev/windload-solutions/website/hawaii-wind-load-calculator/index.html`
- `c:/Dev/windload-solutions/website/asce-hazard-tool-alternative/index.html`

**Rules referenced:**
- `C:/Users/Owner/.claude/projects/c--Dev-windload-solutions/memory/feedback_zero_templated_body_content.md`
- `c:/Dev/windload-solutions/docs/seo/03-page-quality-standards.md`

**Recommendation for the 13-agent rewrite wave:**
- Give each agent a brief consisting of Section 3's per-page brief for its page, PLUS Section 5's "Patterns Observed" block.
- Recommend rewriting Florida LAST (after the other 12 are done) so it can be repositioned as the *hub* and pull DIFFERENT-from-siblings framing — or rewrite Florida FIRST and let the 12 siblings explicitly diverge from it.
- Post-rewrite QA: re-run the Grep patterns from Section 1 (e.g. `Grep "The calculator returns MWFRS pressures"`) and verify the hit count drops to 0 or 1 (only the canonical page if anywhere).
