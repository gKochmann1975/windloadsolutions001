# Competitive Teardown: SkyCiv vs WindLoadCalc

**Date:** 2026-05-23
**Author:** Research agent (Claude Opus 4.7)
**Purpose:** Deep intel on SkyCiv (skyciv.com) — the #1 ranker for "wind load calculator" head term — so WindLoadCalc.com can systematically out-rank them in Waves 4-7.
**Confidence levels:** Stated inline. Most findings are HIGH confidence (verified via WebFetch of SkyCiv's own pages); pricing and team-size figures are MEDIUM (third-party listings). Florida-coverage gap is HIGH (verified by `site:` searches returning zero HVHZ results).

---

## 1. SkyCiv Company Facts

| Fact | Value | Source / Confidence |
|---|---|---|
| Founded | **2013** (officially 2014-2015 as a company) | HIGH — [SkyCiv About page](https://skyciv.com/about/) confirms Paul Comino + Sam Carigliano started with "BendingMomentDiagram.com" in July 2013 |
| Founders | Paul Comino, Sam Carigliano | HIGH |
| HQ | **Sydney, Australia** (with Chicago office) | HIGH — [About page](https://skyciv.com/about/) |
| Team size | **~19-23 employees** | MEDIUM — [PitchBook](https://pitchbook.com/profiles/company/304678-99), [RocketReach](https://rocketreach.co/skyciv-cloud-engineering-software-profile_b5a4bb7df64ecac8) |
| Funding | None publicly disclosed; bootstrapped | MEDIUM |
| Target market | Structural engineers globally — buildings, signs, solar, oil & gas, mechanical, marine, scaffolding, residential, industrial sheds | HIGH — [About](https://skyciv.com/about/) |
| Geographic claim | "Engineers in over 160 countries" / "8 million+ projects solved" | HIGH (their claim) |
| Codes supported | ASCE 7-10/16/22, AS/NZS 1170.2, NBCC 2015/2020, EN 1991-1-4, IS 875, NSCP 2015, CTE DB SE-AE, CFE Viento | HIGH — [Wind Speed Map](https://skyciv.com/docs/load-generator/wind/wind-speed-map/) |

**WLC age advantage:** WindLoadCalc.com / WLS = 2002 founding → **~11 years older than SkyCiv** (24 yrs vs 13 yrs). This is a real, defensible claim: "Building Florida wind load tools since 2002 — a decade before SkyCiv existed."

---

## 2. SkyCiv Pricing (verified May 2026)

| Plan | Price | Notes |
|---|---|---|
| Free | $0 | 3 solves/week (gable + pitched roofs only); 3 wind-speed map searches/day; account required after first 3 |
| Student (Contract) | $10/mo | Verified `.edu` only |
| Student (Flex) | $14/mo | |
| Basic | **$79/mo** | Structural Analysis only — no design modules |
| Professional | **$199/mo** | Full design + Load Generator (wind/snow/seismic) |
| Enterprise | $5,000/yr | Custom |
| Money-back | 30 days on Pro | |

Source: HIGH — [SpotSaas pricing](https://www.spotsaas.com/product/skyciv/pricing) confirmed against [SkyCiv pricing landing](https://skyciv.com/pricing/basic-account/).

**Critical takeaway:** Their wind load calculator is **paywalled at $199/mo for full detailed reports**. Free users get 3 solves per week. This is our biggest pricing weapon — anyone googling "wind load calculator" hits a wall fast.

---

## 3. SkyCiv Top Wind-Related Pages (Inventory)

Verified via `site:skyciv.com wind` searches and WebFetch.

| # | URL | Target Query | Word Count | Calc Embedded? | Florida Mentions |
|---|---|---|---|---|---|
| 1 | [/wind-load-calculator/](https://skyciv.com/wind-load-calculator/) | "wind load calculator" head term | ~2,100 | Yes (above fold, with paywall) | **ZERO** |
| 2 | [/docs/load-generator/wind/asce-7-22-wind-load-calculations/](https://skyciv.com/docs/load-generator/wind/asce-7-22-wind-load-calculations/) | "ASCE 7-22 wind load" | ~1,200 | Yes (embedded Load Generator) | **ZERO** |
| 3 | [/docs/load-generator/wind/asce-7-10-wind-load-calculations/](https://skyciv.com/docs/load-generator/wind/asce-7-10-wind-load-calculations/) | "ASCE 7 wind load calculations buildings" | ~2,100 | Yes | **ZERO** |
| 4 | [/docs/load-generator/wind/wind-speed-map/](https://skyciv.com/docs/load-generator/wind/wind-speed-map/) | "wind speed map" | ~1,200 | Placeholder images only; link out to tool | **ZERO** |
| 5 | [/docs/load-generator/wind/wind-speed-map-by-zip-code/](https://skyciv.com/docs/load-generator/wind/wind-speed-map-by-zip-code/) | "wind speed map by zip code" | ~350 | Google Maps embed | **ZERO** (uses Illinois 61820 example) |
| 6 | [/structural-software/wind-design-module/](https://skyciv.com/structural-software/wind-design-module/) | "wind design software" | ~2,100 | No (sales page) | **ZERO** |
| 7 | [/docs/tech-notes/loading/wind-loading-example-asce-7-10/](https://skyciv.com/docs/tech-notes/loading/wind-loading-example-asce-7-10/) | "ASCE 7-10 wind load example" | ~3,000+ | No (worked example) | **ZERO** (uses warehouse example) |
| 8 | [/docs/tech-notes/loading/asce-7-16-wind-load-calculation-example-for-l-shaped-building/](https://skyciv.com/docs/tech-notes/loading/asce-7-16-wind-load-calculation-example-for-l-shaped-building/) | "ASCE 7-16 wind L-shaped" | ~2,500 | No | **ZERO** (Cordova, TN example) |
| 9 | [/docs/load-generator/wind/asce-7-wind-load-calculations-solar-panels/](https://skyciv.com/docs/load-generator/wind/asce-7-wind-load-calculations-solar-panels/) | "solar panel wind load" | ~1,200 | Yes | **ZERO** |
| 10 | [/docs/tech-notes/loading/solar-panel-wind-load-calculation-asce-7-16/](https://skyciv.com/docs/tech-notes/loading/solar-panel-wind-load-calculation-asce-7-16/) | "solar panel wind load ASCE 7-16" | ~4,200 | No | **ZERO** (Memphis, TN example) |
| 11 | [/docs/load-generator/wind/asce-7-wind-load-calculations-freestanding-wall-solid-signs/](https://skyciv.com/docs/load-generator/wind/asce-7-wind-load-calculations-freestanding-wall-solid-signs/) | "wind load freestanding sign" | ~1,200 | Yes | **ZERO** |
| 12 | [/docs/load-generator/wind/asce-7-wind-load-calculations-open-signs-frames/](https://skyciv.com/docs/load-generator/wind/asce-7-wind-load-calculations-open-signs-frames/) | "wind load open frame sign" | ~1,200 | Yes | **ZERO** |
| 13 | [/docs/load-generator/wind/asce-7-wind-load-calculations-circular-bins-tanks-silos/](https://skyciv.com/docs/load-generator/wind/asce-7-wind-load-calculations-circular-bins-tanks-silos/) | "wind load tank silo" | ~1,200 | Yes | **ZERO** |
| 14 | [/docs/load-generator/wind/effects-of-topography-on-wind-load/](https://skyciv.com/docs/load-generator/wind/effects-of-topography-on-wind-load/) | "Kzt topographic factor" | unknown | Yes | **ZERO** |
| 15 | [/quick-calculators/as4055-residential-wind-load-calculator/](https://skyciv.com/quick-calculators/as4055-residential-wind-load-calculator/) | "AS 4055 wind load housing" (Australia) | unknown | Yes | N/A (AU code) |

**Schema markup:** WebFetch did not surface JSON-LD on any page. Best guess: minimal/none. (Confidence: MEDIUM — would need view-source confirmation.)

**Last updated stamps:** Most docs pages show "Updated on April 13, 2026" (HIGH confidence — appears uniform across `/docs/` tree, suggesting a bulk re-publish, not individual page maintenance).

---

## 4. SkyCiv WEAKNESSES (Where to Strike)

### 4.1 ZERO Florida / HVHZ / Miami-Dade Coverage — MASSIVE GAP

This is the single biggest opportunity. **Confirmed via `site:skyciv.com Florida HVHZ Miami-Dade NOA wind` returning zero meaningful results.**

- `/wind-load-calculator/` (~2,100 words): does not mention Florida, FBC, HVHZ, Miami-Dade, Broward, Collier, NOA, TAS, or hurricane once.
- `/docs/load-generator/wind/asce-7-22-wind-load-calculations/` (~1,200 words): does not mention HVHZ, Miami-Dade NOA, FBC 8th Edition, or any FL county override.
- Their example pages use **Cordova/Memphis Tennessee** and **Illinois 61820** — they actively avoid Florida examples.
- They have **no county-by-county wind speed pages**.
- They have **no FBC 8th Edition page**.
- They have **no NOA / Florida Product Approval lookup**.
- They have **no Collier 170 mph / Miami-Dade 175 mph / Broward 170 mph override documentation**.

**This is uncontested ground.** Our `windload.solutions/florida-wind-load-requirements` and `windload.solutions/hvhz-high-velocity-hurricane-zone-guide` already rank for these queries (verified in earlier search). Wave 4-7 should hammer this.

### 4.2 No PE Stamp / Sign-and-Seal Service

Confirmed: SkyCiv is a software company. They do not offer PE stamping. Their only "certification" is a [student certificate](https://skyciv.com/education/student-certification-for-skyciv/) for software proficiency.

**Our advantage:** Bob (FL PE, ≤3 stories) — we sell stamped reports. SkyCiv cannot. Every "Florida engineer stamp wind load" query is ours by default.

### 4.3 Aggressive Free-Tier Paywall

- **3 solves per week** on the free wind calculator (gable + pitched only).
- **3 wind speed lookups per day** before forced signup.
- **Detailed calculation report locked behind Pro ($199/mo).**
- Most building types (open structures, signs, tanks, solar) locked for free users.

This is hostile UX. WLC's competitive angle: offer a more generous free demo (e.g., one full free C&C report per user, no signup wall on basic lookup), and emphasize "subscription includes unlimited calcs + reports."

### 4.4 Thin Educational Content per Page

- Most `/docs/load-generator/wind/*` pages are **1,200 words** — shallow.
- Heavy focus on "click this button, then this dropdown" workflow rather than code explanation.
- Their longer pieces (the worked examples at 3,000-4,200 words) are actually decent — that's a strength to acknowledge — but they have only a handful.

Our angle: 2,500-4,000 word definitive guides per topic (per state, per county, per ASCE chapter), with worked examples, formulas, and FBC cross-references.

### 4.5 Lazy Localization

Every example in their US-focused docs uses Tennessee or Illinois. No state landing pages. No "[State] Wind Load Calculator" pages. We're shipping FL + 4 counties — they can't respond fast.

### 4.6 Foreign HQ for US Market

Sydney-based company writing for the US ASCE 7 audience. Their docs read like translated material. Customers calling support hit Sydney hours (worst-case AU business day = US overnight). **Our angle:** "US-based support, Eastern Time hours, Florida PE on staff."

### 4.7 No Local Code Authority

ASCE 7 is the floor — Florida, California, Texas all layer their own codes (FBC, CBC, IBC adoptions, county overrides). SkyCiv treats ASCE 7 as the whole world. They have no:
- FBC 8th Edition page
- CBC wind / California overlay
- TDLR/Texas wind hurricane provisions for Galveston/coastal TX
- NYC Building Code wind
- HVHZ enforcement detail

### 4.8 Schema/Freshness Signals Weak

All `/docs/` pages stamp "April 13, 2026" — suggests bulk re-publish, not real editorial maintenance. No reviewer bylines. No "Reviewed by [PE name]" trust signal. Our PE-byline approach will trump this for E-E-A-T.

### 4.9 Customer Logo / Case Study Weakness

[Wind Design Module page](https://skyciv.com/structural-software/wind-design-module/) shows 3 testimonials (Kipcon CEO, Texas A&M professor, Struct-Sure NZ). No Florida engineering firm. No HVHZ permit case study. No "Miami-Dade approved" badge — because they can't claim it.

### 4.10 Trustpilot Footprint Tiny

Only **10 Trustpilot reviews** (4.4 stars). Small sample. WLC with 24 years of customers should be able to win a long-tail review battle if we prioritize it.

---

## 5. SkyCiv STRENGTHS (Be Honest)

### 5.1 Multi-Code Breadth

Genuinely impressive: ASCE 7-10/16/22 + AS/NZS 1170.2 + EN 1991-1-4 + NBCC 2015/2020 + IS 875 + NSCP 2015 + CTE DB SE-AE + CFE Viento. We cannot match this in a year. **Don't try.** Cede international, dominate US + FL.

### 5.2 Worked Examples (Tech-Notes Library)

Their [`/docs/tech-notes/loading/`](https://skyciv.com/docs/tech-notes/loading/) section has long-form worked examples (3,000-4,200 words) per code. The [Solar panel ASCE 7-16](https://skyciv.com/docs/tech-notes/loading/solar-panel-wind-load-calculation-asce-7-16/) one is genuinely useful pedagogy. We should match this format with FL-specific worked examples.

### 5.3 Embedded Live Calculator Above the Fold

Most wind doc pages embed the Load Generator UI directly, even if features are gated. Users see a working tool, not just marketing copy. UX learning: our SEO landing pages should embed a live (gated-feature) calculator iframe, not just CTAs.

### 5.4 Integrated Structural Stack

Wind loads → applied to S3D model → drives beam/frame/connection/foundation design. This integration story is hard for us to beat. Counter-position: "We're not a structural analysis suite. We're the Florida wind-load specialist — and that's the only thing you need us for."

### 5.5 Customer Service (Trustpilot Signal)

Reviews mention founder Sam personally answering within hours. That's a high bar. WLC must match: <2 hr email response, US business hours minimum.

### 5.6 Brand Recognition / Domain Authority

10+ years of SEO compounding. Capterra, G2, SoftwareAdvice listings. We're outranked on the head term today — that won't flip overnight. Strategy: dominate long-tail FL queries first, climb head term over 12-18 months via topical authority.

---

## 6. WLC Positioning Angles SkyCiv Cannot Match

| Claim | Proof | Use On |
|---|---|---|
| "Florida wind load calculator since 2002" | Brand history | Every homepage hero, every FL page |
| "Built for the FBC 8th Edition" | Code-specific UI | FBC landing page, every FL county page |
| "PE-stamped reports available in Florida (≤3 stories)" | Bob's license | Pricing page, FL state page, every HVHZ page |
| "HVHZ-aware: Miami-Dade 175 mph, Broward 170 mph, Collier 170 mph built into the engine" | velocity_finder_core.py override logic | HVHZ guide, county landing pages |
| "Miami-Dade NOA / Florida Product Approval workflow integrated" | Product certification feature | FL state page, future FL# lookup tool |
| "US-based, Eastern Time support" | Operational | Footer, pricing page |
| "Independent SaaS — no upsell to a $200/mo structural suite" | Pricing transparency | Pricing page |

---

## 7. TOP 15 SkyCiv Pages WLC Should Beat — Priority Attack List

Ranked by combined query-volume opportunity + our defensible advantage.

| Priority | SkyCiv URL | WLC Angle | WLC Page (to build / extend) |
|---|---|---|---|
| 1 | [/wind-load-calculator/](https://skyciv.com/wind-load-calculator/) | Free calculator with no 3-week solve cap; PE-stamp upsell; FBC awareness | `/wind-load-calculator/` (homepage — already exists; refresh copy + add embedded demo) |
| 2 | [/docs/load-generator/wind/asce-7-22-wind-load-calculations/](https://skyciv.com/docs/load-generator/wind/asce-7-22-wind-load-calculations/) | 3,500-word ASCE 7-22 deep dive WITH HVHZ section, FBC 8th Edition section, Miami-Dade county callout | `/asce-7-22-wind-load-calculator` (likely already shipped — extend with HVHZ block) |
| 3 | [/docs/load-generator/wind/wind-speed-map/](https://skyciv.com/docs/load-generator/wind/wind-speed-map/) | Live interactive map (no paywall); county overrides shown; Florida-zoom CTA | `/wind-speed-map` (new) |
| 4 | [/docs/load-generator/wind/wind-speed-map-by-zip-code/](https://skyciv.com/docs/load-generator/wind/wind-speed-map-by-zip-code/) | ZIP lookup with FL county override note shown inline | `/wind-speed-by-zip-code` (new) |
| 5 | [/structural-software/wind-design-module/](https://skyciv.com/structural-software/wind-design-module/) | "Wind-only specialist vs $199/mo structural suite" comparison | `/vs-skyciv` comparison page (new) |
| 6 | [/docs/tech-notes/loading/wind-loading-example-asce-7-10/](https://skyciv.com/docs/tech-notes/loading/wind-loading-example-asce-7-10/) | Worked FL example: Miami warehouse @ 175 mph | `/asce-7-22-worked-example-florida` (new) |
| 7 | [/docs/load-generator/wind/asce-7-wind-load-calculations-solar-panels/](https://skyciv.com/docs/load-generator/wind/asce-7-wind-load-calculations-solar-panels/) | FL HVHZ solar panel wind load (Miami-Dade NOA referenced) | `/solar-panel-wind-load-florida` (new — pre-launch product hook) |
| 8 | [/docs/tech-notes/loading/solar-panel-wind-load-calculation-asce-7-16/](https://skyciv.com/docs/tech-notes/loading/solar-panel-wind-load-calculation-asce-7-16/) | Same as #7 but worked-example format | `/solar-panel-asce-7-22-worked-example` (new) |
| 9 | [/docs/load-generator/wind/asce-7-wind-load-calculations-freestanding-wall-solid-signs/](https://skyciv.com/docs/load-generator/wind/asce-7-wind-load-calculations-freestanding-wall-solid-signs/) | FL sign wind load with FDOT/county sign permit context | `/sign-wind-load-florida` (new — Ch 29 standalone product) |
| 10 | [/docs/load-generator/wind/asce-7-wind-load-calculations-open-signs-frames/](https://skyciv.com/docs/load-generator/wind/asce-7-wind-load-calculations-open-signs-frames/) | Bus-stop / kiosk / open frame worked example (cite Dynamic Trackers case-shape) | `/open-frame-sign-wind-load` (new) |
| 11 | [/docs/load-generator/wind/effects-of-topography-on-wind-load/](https://skyciv.com/docs/load-generator/wind/effects-of-topography-on-wind-load/) | Kzt explainer with FL coastal exposure D + hurricane terrain | `/kzt-topographic-factor-florida` (new) |
| 12 | [/docs/load-generator/wind/asce-7-wind-load-calculations-circular-bins-tanks-silos/](https://skyciv.com/docs/load-generator/wind/asce-7-wind-load-calculations-circular-bins-tanks-silos/) | FL agricultural / industrial tank wind load | `/tank-silo-wind-load-florida` (new — lower priority) |
| 13 | [/docs/tech-notes/loading/asce-7-16-wind-load-calculation-example-for-l-shaped-building/](https://skyciv.com/docs/tech-notes/loading/asce-7-16-wind-load-calculation-example-for-l-shaped-building/) | L-shaped FL home worked example (Manuel Roubicek shape pattern) | `/asce-7-22-l-shaped-building-florida` (new) |
| 14 | [/about/](https://skyciv.com/about/) | "About — 2002 founding story, FL roots, PE on staff" | `/about` (refresh — lean into age) |
| 15 | [/pricing/basic-account/](https://skyciv.com/pricing/basic-account/) | Transparent pricing, no $200/mo upsell, PE-stamp add-on | `/pricing` (refresh — comparison row vs SkyCiv) |

---

## 8. Strategic Recommendations

### Wave 4 (Next): County depth
Ship `/wind-speed-map-florida`, `/miami-dade-wind-load-calculator`, `/broward-wind-load-calculator`, `/collier-wind-load-calculator`, `/palm-beach-wind-load-calculator`. Each: 2,500+ words, embedded live map, county override callout box, "PE stamp available" CTA, schema (LocalBusiness + FAQPage + HowTo).

### Wave 5: Code-specific authority pages
- `/fbc-8th-edition-wind-load-guide` (vs SkyCiv: nonexistent)
- `/florida-product-approval-fl-number-lookup` (vs SkyCiv: nonexistent)
- `/miami-dade-noa-wind-load-guide` (vs SkyCiv: nonexistent)
- `/tas-201-202-203-impact-test-guide` (vs SkyCiv: nonexistent)

### Wave 6: Worked examples in WLC format
Match SkyCiv's `/docs/tech-notes/loading/*` long-form depth but with FL-specific buildings. Format: problem statement → site data → step-by-step ASCE 7-22 calculation → result → "verify with WLC calculator" CTA → "get PE stamp" upsell.

### Wave 7: Comparison + brand pages
`/vs-skyciv`, `/vs-asce-hazard-tool`, `/vs-omni-wind-calculator`. Honest comparisons with "we're better at X, they're better at Y, here's when each fits." Comparison pages drive bottom-funnel conversion and earn backlinks.

### Trust signal infrastructure (cross-cutting)
- Add "Reviewed by [PE name], FL PE #XXXXX" byline to every wind-load technical page (E-E-A-T weapon SkyCiv cannot match).
- Add JSON-LD: `Article` + `Person` (author) + `Organization` + `FAQPage` to every guide.
- Trustpilot push: aim for 50+ reviews in 2026 (5x SkyCiv's footprint).

---

## 9. Open Questions / Future Research

- **Backlink profile:** Need Ahrefs/SEMrush data on SkyCiv's referring domains — likely strong from `.edu` student-license footprint. Counter via Florida industry pubs (Florida Engineer, FBC training providers).
- **Schema markup verification:** WebFetch can't see raw HTML reliably. Confirm via view-source whether SkyCiv has JSON-LD on `/wind-load-calculator/`. If they don't, that's another easy win.
- **AdWords spend:** Unknown. If SkyCiv is bidding on "wind load calculator," organic + paid will need joint strategy.
- **Internal link graph:** SkyCiv heavily cross-links `/docs/*` to `/structural-software/*`. We should mirror with `/wind-load-calculator/` → `/florida-counties/*` → `/pricing` siloing.

---

## 10. TL;DR for Future Agents

> SkyCiv is a Sydney-based structural analysis suite vendor (2013) with broad international code support but **zero meaningful Florida / HVHZ / Miami-Dade / FBC / PE-stamp coverage**. Their wind calculator is paywalled at $199/mo for serious use. Their educational pages average 1,200 words and use Tennessee/Illinois examples. **WindLoadCalc's defensible moat = (1) 2002 founding, (2) FL-specialist depth, (3) PE-stamped reports, (4) HVHZ engine overrides, (5) transparent pricing with no structural-suite upsell.** Attack via Florida county pages, FBC 8th Edition authority pages, NOA/FL# lookup tools, and side-by-side `/vs-skyciv` comparison.

---

### Sources cited

- [SkyCiv Free Online Wind Load Calculator](https://skyciv.com/wind-load-calculator/)
- [SkyCiv ASCE 7-22 Wind Load Calculations docs](https://skyciv.com/docs/load-generator/wind/asce-7-22-wind-load-calculations/)
- [SkyCiv ASCE 7-10 Wind Load Calculations docs](https://skyciv.com/docs/load-generator/wind/asce-7-10-wind-load-calculations/)
- [SkyCiv Wind Speed Map](https://skyciv.com/docs/load-generator/wind/wind-speed-map/)
- [SkyCiv Wind Speed Map by ZIP](https://skyciv.com/docs/load-generator/wind/wind-speed-map-by-zip-code/)
- [SkyCiv Wind Design Module](https://skyciv.com/structural-software/wind-design-module/)
- [SkyCiv Solar Panel ASCE 7-16 worked example](https://skyciv.com/docs/tech-notes/loading/solar-panel-wind-load-calculation-asce-7-16/)
- [SkyCiv L-shaped building worked example](https://skyciv.com/docs/tech-notes/loading/asce-7-16-wind-load-calculation-example-for-l-shaped-building/)
- [SkyCiv ASCE 7-10 warehouse worked example](https://skyciv.com/docs/tech-notes/loading/wind-loading-example-asce-7-10/)
- [SkyCiv Freestanding wall/solid signs](https://skyciv.com/docs/load-generator/wind/asce-7-wind-load-calculations-freestanding-wall-solid-signs/)
- [SkyCiv About page](https://skyciv.com/about/)
- [SkyCiv Pricing checkout](https://skyciv.com/checkout/)
- [SpotSaas SkyCiv pricing detail](https://www.spotsaas.com/product/skyciv/pricing)
- [PitchBook SkyCiv profile](https://pitchbook.com/profiles/company/304678-99)
- [RocketReach SkyCiv profile](https://rocketreach.co/skyciv-cloud-engineering-software-profile_b5a4bb7df64ecac8)
- [SkyCiv Trustpilot reviews](https://www.trustpilot.com/review/skyciv.com)
- [G2 SkyCiv reviews](https://www.g2.com/products/skyciv-structural-3d/reviews)
- [Capterra SkyCiv profile](https://www.capterra.com/p/147474/SkyCiv-Structural-3D/)
- [SkyCiv Professional Engineering Licensure article](https://skyciv.com/education/professional-engineering-licensure-around-the-world/)
