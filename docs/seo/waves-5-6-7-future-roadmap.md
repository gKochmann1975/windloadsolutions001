# Waves 5, 6, 7 — Future SEO Roadmap

**Purpose:** Stub briefs for the next three waves of SEO buildout, sequenced AFTER Wave 4 ships and we have 30-60 days of indexing data. Each wave is a separate planning document at execution time — these are placeholders to capture intent and scope so they don't get lost between sessions.

**Status:** Living document. Refine each wave when it's time to execute (don't try to plan Wave 7 in detail before Wave 5 has shipped — the data we learn from earlier waves will reshape the later ones). Last updated 2026-05-23.

---

## Wave 5 — City pages within winning states (~15-20 pages)

**Trigger to execute:** Wave 4 state pages have been indexed for ≥30 days and at least 2 are ranking on page 1-3 for their primary keyword.

**Logic:** Once a state page proves it can rank, city pages within that state inherit topical authority and can rank for long-tail queries with much less effort. Conversely, building city pages for a state where the state page hasn't ranked = wasted effort.

**Page candidates (by priority — pull GSC for ranked WLS cities to refine):**

### Florida (already has 4 county pages — extend to cities within counties)
- Naples (within Collier — already strong)
- Marco Island (within Collier — different wind exposure, smaller market but specific)
- Fort Lauderdale (within Broward)
- Hollywood (within Broward)
- Coral Gables (within Miami-Dade — high-end residential market)
- Aventura (within Miami-Dade — condo dominated)
- Boca Raton (within Palm Beach — high-end residential)
- West Palm Beach (within Palm Beach)
- Tampa (Hillsborough — separate from existing FL county pages, large market)
- Orlando (Orange — inland but high traffic on WLS at 82 clicks/90d)
- Jacksonville (Duval — Atlantic coast)
- Key West (Monroe — Florida Keys, special wind region)

### Texas (if state page ranks)
- Houston (Harris)
- Galveston (coastal — TWIA region)
- Corpus Christi (coastal)
- San Antonio (inland)
- Dallas-Fort Worth metroplex (inland, large market)

### North Carolina (if state page ranks)
- Charlotte (largest market)
- Raleigh (state capital, growing)
- Wilmington (coastal)
- Outer Banks region (Dare County — unique high-wind market)

### South Carolina (if state page ranks)
- Charleston (coastal, historic, high-permit-volume)
- Myrtle Beach (coastal, vacation rental boom)
- Hilton Head (coastal, high-end residential)

### Louisiana (if state page ranks)
- New Orleans (post-Katrina rebuild ongoing)
- Baton Rouge (state capital, inland)
- Lake Charles (coastal, post-Laura/Ida rebuild)

**Per-page requirements:** Same as Wave 4 state pages per [03-page-quality-standards.md](./03-page-quality-standards.md) — ≥1,500 unique words, 9-section structure, 3 CTAs, schemas, etc.

**Differentiation focus:** Cities lean heavily into Pillar 2 (Florida specialist for FL cities, regional hurricane history for others) and Pillar 4 (local jurisdiction expertise). Each city page should mention the LOCAL building department by name (e.g., "City of Houston Permitting Center", "Charleston County Building Inspection Services").

**Estimated effort:** 15-20 pages × ~15 min/agent in parallel = ~30-45 min wall-clock for one batch of 10 agents.

**Anti-pattern reminder:** City pages within the SAME county must not paste from each other or from the county page. Naples ≠ Marco Island content. Coral Gables ≠ Aventura. Fort Lauderdale ≠ Hollywood. Each city has a different demographic, project mix, code amendment history.

---

## Wave 6 — Product-type calculator pages (~10-12 pages)

**Trigger to execute:** Wave 5 cities indexed + first trial-signup data available from state/county/city pages. We want to know which user types are converting before we build pages targeting product-specific queries.

**Logic:** State/county pages target geographic intent ("Florida wind load calculator"). Product-type pages target task intent ("hurricane shutter wind load calculator", "solar panel wind load calculator"). Different visitor, different conversion path — usually a contractor or product manufacturer rather than an engineer or architect.

**Page candidates:**

| Page | Primary query | Audience | Existing WLC product alignment |
|---|---|---|---|
| `/hurricane-shutter-wind-load-calculator` | "hurricane shutter wind load calculator" | FL contractors, shutter installers | `/shop/windows-doors-shutters.html` |
| `/impact-window-wind-load-calculator` | "impact window wind load calculator" | window installers, replacement remodelers | `/shop/windows-doors-shutters.html` |
| `/storm-door-wind-load-calculator` | "storm door wind load calculator" | door installers | future product |
| `/solar-panel-wind-load-calculator` | "solar panel wind load calculator" | solar installers (huge growth market) | planned `/shop/solar-panels.html` (currently coming-soon) |
| `/screen-enclosure-wind-load-calculator` | "screen enclosure wind load FL" | FL contractors, lanai builders | new lane |
| `/pool-cage-wind-load-calculator` | "pool cage wind load Florida" | FL lanai/pool contractors | new lane (high-volume FL niche) |
| `/lanai-wind-load-calculator` | "lanai wind load Naples" / "raised lanai" | FL screen contractors (Collier focus) | new lane (the user has personal expertise here) |
| `/garage-door-wind-load-calculator` | "garage door wind load calculator" | garage door installers (Amarr/Clopay traffic) | new lane |
| `/parapet-wall-wind-load-calculator` | "parapet wind load ASCE 7-22" | commercial roofers, parapet designers | Chapter 29 calculator (planned per roadmap) |
| `/sign-wind-load-calculator` | "sign wind load calculator" | sign manufacturers, billboard companies | Chapter 29 calculator (planned) |
| `/roofing-wind-load-calculator` | "roofing wind load calculator" | roof contractors | planned `/shop/roofing.html` (currently coming-soon) |
| `/awning-canopy-wind-load-calculator` | "awning wind load Florida" | FL awning installers | new lane |

**Critical alignment:** Several of these (solar panels, roofing, lanai, sign, parapet) align with PLANNED WLC products (per memory: "Chapter 29 = SEPARATE calculators — Signs, freestanding walls, rooftop equipment, parapets are planned standalone products"). Build these pages AHEAD of the product so when the product ships, the SEO is already indexed and ranking.

**Anti-pattern:** Don't build a product-type page that has nowhere to convert. Each page must funnel to EITHER a live shop page OR a "Get notified when [product] launches" email capture. No dead ends.

**Estimated effort:** 10-12 pages × ~15 min/agent in parallel = ~30-40 min wall-clock for one batch.

---

## Wave 7 — Specialty + audience pages (~5-8 pages)

**Trigger to execute:** Waves 4-6 indexing data shows the formula works. Wave 7 is the "long tail of long tail" — lower-volume queries but high-intent, often missed by competitors.

**Page candidates:**

### Code-version comparison / education
- `/asce-7-16-vs-asce-7-22-comparison` — "what changed" guide for engineers transitioning
- `/ibc-2024-wind-load` — for code-aware contractors/officials
- `/irc-residential-wind-load` — residential code track

### Audience pages (extending the existing for-architects / for-engineers / for-contractors set)
- `/wind-load-calculator-for-building-officials` — municipal plan reviewers
- `/wind-load-calculator-for-insurance-adjusters` — post-hurricane claim assessment
- `/wind-load-calculator-for-window-manufacturers` — product certification / FL approval
- `/wind-load-calculator-for-home-inspectors` — pre-purchase / 4-point inspection market

### Topical authority pages
- `/wind-load-vs-seismic` — for CA users (acknowledges seismic dominance)
- `/wind-load-vs-snow-load` — for northern states
- `/wind-load-for-additions-and-remodels` — high-volume FL niche (lanai, addition, room addition)
- `/wind-load-for-mobile-homes-manufactured-housing` — separate market (HUD code)

**Estimated effort:** 5-8 pages × ~15 min/agent in parallel = ~15-30 min wall-clock for one batch.

---

## Cross-wave principles

These apply to every wave regardless of content type:

1. **GSC review before each wave** — pull WLC + WLS GSC exports, identify what's ranking and what isn't. Adjust wave priorities based on data, not on the original plan if it's stale.
2. **Differentiation pillars activated** — each page must activate ≥3 of the 5 pillars per [02-differentiation-pillars.md](./02-differentiation-pillars.md).
3. **Quality standards enforced** — each page must pass the 20 non-negotiables in [03-page-quality-standards.md](./03-page-quality-standards.md).
4. **Funnel role mapped** — each page has a designated funnel stage and primary CTA target per [04-funnel-architecture.md](./04-funnel-architecture.md).
5. **Internal link map updated** — each new page adds backlinks from sister pages and gets backlinks from existing pages. No orphan pages.
6. **Sitemap discipline** — every new indexed page added to `sitemap.xml`; no `noindex` in sitemap; verify on push.
7. **No fake aggregateRating, no fake reviews, no out-of-state PE claims, no hreflang without translations** — the four "we got burned on this" patterns.
8. **Commit per wave, not per page** — one coherent commit per wave for cleaner git history and easier rollback.

---

## Capacity reality check

If we ship every wave at the maximum scope:

| Wave | Pages | Estimated agent time | Commit/review time | Total wall-clock |
|---|---|---|---|---|
| Wave 4 | 5 state + retool 5 WLS + 2 misc tasks | ~30 min | ~30 min | ~60 min |
| Wave 5 | 15-20 cities | ~30-45 min | ~30 min | ~60-75 min |
| Wave 6 | 10-12 product-type | ~30-40 min | ~30 min | ~60-70 min |
| Wave 7 | 5-8 specialty | ~15-30 min | ~20 min | ~35-50 min |

**Total across waves 4-7:** ~35-50 pages, ~4-5 hours of session time.

**Realistic cadence:** One wave per session (or two if energy is high). Don't batch all 4 in one session — the cognitive load on review/coordination is real, and waves 5-7 benefit from learning waves 4-5 indexing data first.

---

## Beyond Wave 7 — speculative future waves

If waves 4-7 succeed (measured: WLC primary money keywords ranked top-10, conversion lift measurable in Stripe), the next moves:

- **Wave 8 — Backlink building:** Real PR, guest posts on AEC publications, ASCE chapter sponsorships, Florida AGC partnerships. Backlinks are the missing ingredient for head-term ranking (`"wind load calculator"` solo).
- **Wave 9 — International:** AS/NZS (Australia), NBCC (Canada), Eurocode (EU). Match SkyCiv's multi-code breadth from a position of US authority strength.
- **Wave 10 — Tools & free resources:** Free downloadable wind speed maps, free permit submittal templates, free contractor educational PDFs. Lead-magnet engine that builds email list AND backlinks (educational PDFs get linked by .edu sites if they're good).
- **Wave 11 — Video content:** YouTube channel for "How to calculate wind load for X" + embed videos on landing pages (YouTube ranks separately + video schema can hit SERP).

These are all speculative and require waves 4-7 to validate the playbook first.

---

## See also

- [SEO-DOMINATION-ROADMAP.md](./SEO-DOMINATION-ROADMAP.md)
- [01-competitive-teardown-skyciv.md](./01-competitive-teardown-skyciv.md)
- [02-differentiation-pillars.md](./02-differentiation-pillars.md)
- [03-page-quality-standards.md](./03-page-quality-standards.md)
- [04-funnel-architecture.md](./04-funnel-architecture.md)
- [wave-4-non-fl-states-DETAILED.md](./wave-4-non-fl-states-DETAILED.md)
