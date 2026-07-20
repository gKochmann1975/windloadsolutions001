# Hub-and-Spoke Plan — Dominate "wind load pressure calculator"

**Created 2026-07-20 · Owner: Gregory Kochmann · Executor: Claude**
Companion to `OFF_PAGE_SEO_BACKLINK_STRATEGY.md` (off-page) + `SITE_REDESIGN_SEO_GEO_PLAN.md` (on-page).

## The goal (and the honest timeline)
Own the topic cluster around **"wind load pressure calculator"** on **windloadcalc.com** via a topic-cluster
(hub-and-spoke) architecture: one authoritative **hub** page targets the head term, and many focused
**spoke** pages target long-tails and all link back to the hub. This is how you build the *topical
authority* Google rewards — and it's the thing currently missing (today you have spoke material but **no hub**,
and **no page** targets the exact phrase, so you don't rank for it at all).

**Timeline: weeks-to-months, not days.** The hub makes ranking *possible* (today it's impossible); topical
authority + the Tier-1/2 backlinks + time do the climbing. Anyone promising #1 fast is lying. Incumbents to
beat: SkyCiv, Omni, CalcTool, CADDTools (DA 80-90).

## ⚑ GSC DATA FINDINGS — 2026-07-20 (this reshapes the plan)
Pulled real Search Console data for BOTH properties. Key facts:
- **windload.solutions is the ranking powerhouse** (avg pos ~5.9, ~1.4M impr/yr) — **3× stronger** than
  windloadcalc.com (avg pos ~16, ~14.6k impr/3mo). The product site's core tool pages rank *poorly*
  (`wind-load-software` #46, `-for-engineers` #45, `-landing` #32).
- **For "wind load pressure calculator":** windload.solutions ranks **#19.7** (100 impr) vs windloadcalc.com
  **#24.4** (26 impr). windload.solutions ALSO already has `ultimate-nominal-asce-7-wind-load-pressure-calculator`
  at **#13.2 (4,167 impr)** and `components-cladding-...pressure-analysis` at **#6.5 (77k impr, 595 clicks)**.
- **The exact phrase is low-volume; the CLUSTER is the prize.** Real, close-to-ranking demand:
  "components and cladding wind load calculator" (#14.5), "window design pressure calculator" (#21.7),
  "design wind pressure" (#12.7), pressure **converters** ("wind speed to pressure", "psf to wind load",
  "wind load to psf" — repeated), "roof/wind uplift calculator" (#28–44, wide open).

**DECISION (Greg, 2026-07-20): BOTH, IN SEQUENCE.**
- **P1 (now) — windload.solutions hub** on the strong domain (ranks fast): optimize/expand its existing
  `ultimate-nominal-...pressure-calculator` page (#13.2, 4,167 impr) into the authoritative pressure hub,
  funneling hard to the windloadcalc.com free tool. Extends the Tier-1 cross-link model.
- **P2 (parallel/after) — windloadcalc.com product hub** `/wind-load-pressure-calculator.html` so the product
  domain also climbs and searchers can land directly on the tool. Longer play.
- Both obey the QUALITY BAR (no thin/templated, on-brand per *each site's own* design system, show Greg before live).

### Striking-distance quick wins (optimize existing pages FIRST — faster than new pages)
- **windload.solutions:** its `...pressure-calculator` page (#13) + C&C page (#6.5) → sharpen toward
  "wind load pressure calculator" / "wind pressure calculator" + add the tool CTA. Fastest movement available.
- **windloadcalc.com:** homepage (#23.6 on 5,883 impr — huge) + free calc for "wind pressure calculator" (#18).
- **New spokes to match real demand (build after the hub):** pressure **converter** (wind speed↔psf↔pressure),
  **window design pressure calculator**, **roof/wind uplift calculator**. These target proven queries, not guesses.

## Why this and not "just optimize the free calc"
The free calc already ranks-targets "free **wind load calculator**" — your bigger head term. Retargeting it to
"wind load **pressure** calculator" risks weakening that. Instead: a **new hub** owns the pressure phrase, and the
free calc stays as the #1 tool-spoke. No cannibalization; two terms covered instead of one.

---

## Architecture
```
                    ┌─────────────────────────────────────────┐
                    │  HUB (pillar)  /wind-load-pressure-       │
                    │  calculator.html  → "wind load pressure   │
                    │  calculator"  (tool CTA + full topic)     │
                    └───────────────┬─────────────────────────┘
        ┌───────────────┬───────────┼───────────────┬──────────────────┐
   TOOL SPOKES     TOOL SPOKES   NEW SPOKES     EDUCATIONAL SPOKES (windload.solutions,
   (windloadcalc.com, transactional)           link UP to hub — external authority)
```
Every spoke links **up** to the hub with a "wind load pressure calculator" anchor. The hub links **down** to
every spoke. Same-domain spokes (windloadcalc.com) carry the most weight; windload.solutions educational pages
are supporting authority links.

---

## THE HUB — spec  *(NEW page — URL confirmed free)*
- **URL:** `https://windloadcalc.com/wind-load-pressure-calculator.html`
- **Title:** `Wind Load Pressure Calculator — ASCE 7-22 Design Pressures by ZIP | WindLoadCalc`
- **H1:** `Wind Load Pressure Calculator`
- **Intent:** transactional + informational. Answer "what/how" AND put the free tool one click away.
- **Sections (bespoke copy — NO templated body, per `feedback_zero_templated_body_content`):**
  1. Above-fold: one-line definition + **prominent CTA to the free calculator(s)** (C&C + MWFRS).
  2. What wind load pressure is: `q_z = 0.00256·K_z·K_zt·K_e·V²`; design pressure `p = q·G·C_p − q_i(GC_pi)`
     (Kd in the pressure eq per 7-22 — `reference_kd_convention_and_asce716_validation`). **Book-verified values only.**
  3. C&C vs MWFRS (the two pressure types) → links to each tool + each windload.solutions guide.
  4. Zones (1/2/3 field/edge/corner) + why corners are highest.
  5. By surface: walls, roofs, windows/doors → links to those spokes.
  6. FL HVHZ note (Miami-Dade 175 / Broward 170) → your differentiator, links HVHZ spoke.
  7. FAQ (targets "people also ask": how is wind pressure calculated, what is design wind pressure, etc.).
- **Schema:** `WebApplication` (the calculator) + `FAQPage` + `HowTo` (4-step) + `BreadcrumbList` + Org/WebSite @graph
  (mirror `free-wind-load-calculator.html`'s proven stack).
- **SEO:** `index, follow`, canonical self, **add to sitemap.xml** in the SAME commit it ships.
- **CTA routing:** free tool → free calc pages; buy → the correct product shop (per the CTA-routing rule).
- **Rules:** software output = "Engineering Report", never "sealed"; ASCE **7-22 only**; run `/check-report-copy`.

---

## SPOKES — map (existing assets first; build only the gaps)

### A. Tool spokes — windloadcalc.com (transactional; strongest link weight)
| Spoke page | Target long-tail | Status | Action |
|---|---|---|---|
| `free-wind-load-calculator.html` | components & cladding wind pressure calculator | EXISTS | Add "wind load pressure" to a subhead + link UP to hub |
| `free-mwfrs-wind-load-calculator.html` | MWFRS wind pressure calculator | EXISTS | Same: link UP to hub, ensure "pressure" phrasing |
| `wind-load-software.html` | ASCE 7-22 wind pressure software | EXISTS | Link to hub |

### B. NEW tool/landing spokes — windloadcalc.com (fill the gaps)
| Spoke (new) | Target long-tail | Notes |
|---|---|---|
| `roof-wind-pressure-calculator.html` | roof wind pressure / uplift calculator | Roof C&C uplift; CTA → Roofing shop + free calc. Big search intent (re-roofing/fasteners). |
| `wall-wind-pressure-calculator.html` | wall / window wind pressure calculator | Wall C&C + DP for windows/doors; CTA → W/D shop. |
| `velocity-pressure-calculator.html` | velocity pressure (qz) calculator ASCE 7 | The `q_z` sub-calc; highly specific, low competition, feeds the hub. |
*(Build these only after the hub + existing-spoke wiring land; each must be bespoke, not templated.)*

### C. Educational spokes — windload.solutions (authority; link UP to hub)
| Existing page | Role |
|---|---|
| `components-cladding-wind-load-calculation-asce-7-pressure-analysis-building-design.html` | C&C pressure explainer |
| `mwfrs-wind-load-calculator-asce-wind-pressure-analysis-building-design.html` | MWFRS pressure explainer |
| `cc-vs-mwfrs-guide.html` | the two pressure types |
| `ultimate-nominal-asce-7-wind-load-pressure-calculator.html` | ultimate vs nominal pressure |
| `hvhz-high-velocity-hurricane-zone-guide.html` | HVHZ pressures (FL differentiator) |
| `asce-7-wind-load-velocity-finder-wind-speed-by-zip-code.html` | wind speed → pressure input |
*(Each gets ONE contextual link to the hub with a "wind load pressure calculator" anchor — varied, not identical.)*

---

## Internal-linking rules (the engine of the cluster)
1. **Spoke → Hub:** every spoke links to the hub once, contextually, anchor ≈ "wind load pressure calculator."
2. **Hub → Spoke:** the hub links to every spoke in its relevant section.
3. **Spoke ↔ Spoke:** related spokes cross-link (C&C ↔ MWFRS ↔ zones) — reinforces the cluster.
4. **No orphans; varied anchors** (identical anchors sitewide look manipulative — `feedback_zero_templated_body_content`).
5. windload.solutions → windloadcalc.com hub links are the owned-domain authority boost (Tier-1 pattern).

## Phased execution (priority order)
- **P1 — Build the HUB** (highest impact; unblocks everything). Ship + sitemap + schema + verify live.
- **P2 — Wire existing spokes** (A + C): add the up-links + light "pressure" phrasing. Cheap, fast, compounding.
- **P3 — Build gap spokes** (B): roof, wall, velocity-pressure — one at a time, bespoke.
- **P4 — Off-page** (already in motion): point Tier-2/3 backlinks at the HUB, not just the free calc.
- **P5 — Measure** (below), prune/expand.

## Measurement (GSC — `feedback_gsc_before_mass_noindex`)
Track in Google Search Console: impressions/position for "wind load pressure calculator" + spoke terms;
Request-Index the hub on publish. Expect movement over **4–12 weeks**, not days. Re-evaluate the cluster monthly.

## THE QUALITY BAR — non-negotiable (this is what makes it a moat, not a penalty)
> We already survived a **Scaled Content Abuse** penalty (windload.co — its auto-deploy is *still paused* from
> that recovery). We do NOT repeat it. Volume is not the strategy; **being genuinely the best page on the
> internet for each phrase** is the strategy. One great page beats ten thin ones — and beats a penalty that
> tanks the whole domain.

Every page in this cluster MUST clear ALL of these before it ships:
1. **NOT thin.** Real depth: worked examples, actual ASCE 7-22 method, real numbers, a *working tool or
   genuinely useful reference* — not 300 words wrapped around a keyword. If it wouldn't help a real engineer,
   it doesn't ship.
2. **NOT templated.** Zero ≥10-word overlap between any two pages (`feedback_zero_templated_body_content`).
   Each page is read → analyzed → written individually (`feedback_bespoke_pages_seo_geo`). No spun variants,
   no "swap the city name" clones — that IS Scaled Content Abuse.
3. **Uniquely ours.** Lean into the differentiator on EVERY page: real ZIP→ASCE 7-22 wind speed, FL HVHZ
   overrides, the platform others don't have. This is *why* we deserve to outrank SkyCiv/Omni — say it, show it.
4. **On-brand.** Match the current dark-glass aesthetic + exact brand patterns (px, breakpoints, class names)
   verbatim (`feedback_copy_brand_patterns_verbatim`, `project_homepage_redesign_dark_glass`). It must look
   like it belongs on the site, first-class, not a bolted-on SEO page.
5. **Pace, don't spray.** Build **one page at a time, fully realized, reviewed before the next.** No batch
   generation, ever. If it feels fast, it's wrong. Google reads *pattern of behavior* — slow + excellent reads
   as a real site; fast + uniform reads as abuse.
6. **Real value = real rankings.** The whole bet: if each page is actually the most useful answer for its
   phrase, links + authority + rankings follow honestly and *durably*. Shortcuts are fragile; quality compounds.

## Guardrails (mechanical)
- 7-22 only. Never "sealed" (Engineering Report). Real ASCE values only — verify against book or ASK, never guess.
- Public pages: `index, follow` + in sitemap (agree, never contradict). No fake schema ratings. Mobile-first.
- Before each page ships: run `/check-report-copy` + `/lint-marketing-copy` + the 6-check post-page QA
  (`feedback_post_page_qa_standard`). Show Greg each finished page before it goes live.

## Progress log
- **2026-07-20** — Plan created. Confirmed: exact phrase currently targeted by ZERO pages; windloadcalc.com not
  in top SERP for it; hub URL free; spoke assets inventoried. Awaiting go to build P1 (the hub).
