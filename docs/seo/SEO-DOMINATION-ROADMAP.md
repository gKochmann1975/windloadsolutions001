# WindLoadCalc SEO Domination Roadmap

> **Vision:** Make windloadcalc.com the #1 result for every wind load calculator query that matters — geographic, technical, and product-specific — by combining 24 years of Florida-specialist authority with modern UX, depth competitors can't match, and a tight conversion funnel.

**Maintained by:** Gregory + Claude sessions
**First drafted:** 2026-05-23
**Last meaningful update:** 2026-05-23

This is the master document. Every wave references the detail files below. Update this file when strategy shifts; update the detail files when content/tactics shift.

---

## Quick navigation

| File | What it answers |
|---|---|
| **[01-competitive-teardown-skyciv.md](./01-competitive-teardown-skyciv.md)** | Who we're competing against, where they're weak, top 15 pages to beat |
| **[02-differentiation-pillars.md](./02-differentiation-pillars.md)** | The 5 ways WLC wins (since 2002, FL specialist, explained better, customer service, looks better) |
| **[03-page-quality-standards.md](./03-page-quality-standards.md)** | 20 non-negotiables every new page must meet (anti-template, anti-Helpful-Content-penalty rules) |
| **[04-funnel-architecture.md](./04-funnel-architecture.md)** | How every page funnels to purchase (Google → TOFU → calc app → trial → paid) |
| **[wave-4-non-fl-states-DETAILED.md](./wave-4-non-fl-states-DETAILED.md)** | Ready-to-execute brief for the next ship (TX, NC, SC, CA, LA + 4 cleanup tasks) |
| **[waves-5-6-7-future-roadmap.md](./waves-5-6-7-future-roadmap.md)** | Stubs for cities (Wave 5), product-types (Wave 6), specialty (Wave 7) |

---

## Where we stand today (2026-05-23)

### What's live (8 commits across 4 repos in one session — 2026-05-22)

| Repo | Commit | What |
|---|---|---|
| windloadsolutions001 (WLC) | `3a07fd6` | Phase 1 SEO fixes (homepage title, canonicals, noindex hygiene, footer fix, schema founding date 2024→2002) |
| windload-co | `093bf6d` | pe.html scoped Florida-only ≤3 stories (closed legal exposure on "all 50 states" misrepresentation) |
| windload-co | `82b904c` | Mass noindex of 747 templated county pages + sitemap rewrite + www→non-www 301 (Helpful Content classifier recovery) |
| windload-solutions (WLS) | `b19616a` | Surgical SEO — 8 selective cannibal noindex (verified low/zero traffic), canonical cleanup on 100 city + 11 state pages, www→non-www 301 |
| windloadsolutions001 (WLC) | `246ca99` | New pages: `/asce-hazard-tool-alternative` (open lane, ATC Hazards dead 2024-12-31) + `/florida-wind-load-calculator` |
| windload-webapp | `46c9c8e` | `calc.windloadcalc.com/?zip=NNNNN` URL param support — verified live in incognito |
| windloadsolutions001 (WLC) | `bf5ffcd` | 4 county pages: Miami-Dade / Broward / Collier / Palm Beach — all 1,500+ unique words |
| windload-solutions (WLS) | `4efd873` | Wave 3 conversion engine — 8 WLS earner pages got 3 CTAs each + 16 WLS pages got exact-match keyword anchor links to new WLC county pages |

### What this means in plain English
- **6 new high-intent SEO pages** live on windloadcalc.com (FL + 4 counties + ASCE-alt)
- **24 new conversion entry points** on WLS earner pages funnel traffic to WLC
- **24 exact-match keyword authority links** transfer ranking signal from WLS (6,500+ clicks/90d, ranks #1 on 6+ money queries) → WLC
- **WLco recovered** from the templated-content penalty (747 pages noindexed)
- **WLS surgical-cleaned** without losing the 1,044 clicks/90d of traffic the original blanket-noindex plan would have killed
- **Calc app deep-links work** — visitors entering a ZIP on any landing page land at the calculator with city/state/county/wind speed pre-populated

### What's NOT live yet (queued for Wave 4+)
- 5 non-FL state pages (TX, NC, SC, CA, LA) — high priority, **1,364 WLS clicks/90d** currently uncaptured by WLC
- 15-20 city pages within winning states (Wave 5)
- 10-12 product-type calculator pages (Wave 6)
- 5-8 specialty + audience pages (Wave 7)
- ~40-50 total pages over Waves 4-7
- Backlink/PR work, video, international codes (Waves 8+)

---

## The strategic frame

### The asymmetric insight that drives everything

**windload.solutions already ranks #1 for the queries that matter most.** Per GSC export 2026-05-22:
- ASCE 7-22 wind speed → WLS #1
- Florida wind load → WLS #1
- Miami-Dade wind load → WLS #1
- Wind speed by zip → WLS #1
- MWFRS calculator → WLS #1
- Wind load shutter → WLS #1

The "we're not ranking" complaint is a **conversion problem**, not a ranking problem. The wrong domain ranks, the right domain (WLC) doesn't have matching pages, the trip from WLS → WLC adds friction that craters trial signups.

**The entire roadmap is built around fixing this asymmetry**, not around chasing rankings WLS already owns. We:
1. Build matching calculator pages on WLC for every WLS-ranked query
2. Push WLS traffic directly into those WLC pages via exact-match anchor links + CTAs
3. Use the calc app's new `?zip=` deep-link to eliminate friction
4. Let WLS keep ranking (it's our authority engine); make WLC the conversion engine

### Why we beat SkyCiv (the actual #1 generalist competitor)

Per [01-competitive-teardown-skyciv.md](./01-competitive-teardown-skyciv.md):

| SkyCiv weakness | Our exploitation |
|---|---|
| Founded 2013 (Australian startup) | We've been Florida wind load since **2002** — 11 years longer. Schema'd, footer-stated, FAQ-cited. |
| Zero Florida / HVHZ / Miami-Dade / NOA content | We OWN this entire vertical — 4 county pages live + Florida hub page; competitors give Tennessee / Illinois examples |
| Free tier capped at 3 solves/week and 3 ZIP lookups/day | Our wind speed lookup is **truly free** — no daily limit; capture the long-tail "free wind load calculator" traffic |
| No PE stamping | Bob is **FL-licensed**, ≤3 stories — uncontested for FL residential market |
| ~1,200 words per docs page (shallow) | Our county pages are 1,500–3,700+ words with hand-validated local data |
| Uniform "April 13, 2026" timestamp = bulk re-publish | Real editorial freshness with dated "Reviewed by" PE bylines |
| Generic global tool feel | Florida-specific, hurricane-history-aware, locally-relevant examples (Naples lanai, Miami high-rise, Galveston coastal) |

We don't beat SkyCiv on multi-code breadth (they support 8 codes). We beat them on **depth in the codes/jurisdictions that drive permit revenue.**

---

## The 4-wave + cleanup playbook

| Wave | Scope | Page count | Trigger | Detail file |
|---|---|---|---|---|
| **Waves 1-3 (DONE)** | WLC technical SEO + WLco recovery + WLS surgical + 6 new WLC pages + webapp deep-link + Wave 3 conversion engine | 6 new + 24 retooled | Already shipped 2026-05-22 | See "What's live" above |
| **Wave 4 (NEXT)** | 5 non-FL state pages (TX/NC/SC/CA/LA) + retool 5 WLS state earners + WLco dupe-noindex cleanup + WLC homepage state quick-links | 5 new + 5 retooled + 2 cleanup | User greenlight | [wave-4-non-fl-states-DETAILED.md](./wave-4-non-fl-states-DETAILED.md) |
| **Wave 5** | City pages within winning states | 15-20 | Wave 4 state pages indexed 30+ days + at least 2 ranking page 1-3 | [waves-5-6-7-future-roadmap.md#wave-5](./waves-5-6-7-future-roadmap.md) |
| **Wave 6** | Product-type calculators (shutters, solar, lanai, garage door, etc.) | 10-12 | Wave 5 cities indexed + first trial-signup data available | [waves-5-6-7-future-roadmap.md#wave-6](./waves-5-6-7-future-roadmap.md) |
| **Wave 7** | Specialty + audience pages (code comparison, building officials, insurance adjusters, etc.) | 5-8 | Waves 4-6 indexing data shows formula works | [waves-5-6-7-future-roadmap.md#wave-7](./waves-5-6-7-future-roadmap.md) |
| **Wave 8+** | Backlinks, PR, video, international codes, free resources | n/a | Waves 4-7 ranking proves the page-quality formula | TBD |

**Total Wave 4-7 buildout:** ~35-50 new pages, 4-7 sessions of work spread across ~6-12 months as data informs each wave.

---

## The 5 differentiation pillars (every page activates ≥3)

Detail in [02-differentiation-pillars.md](./02-differentiation-pillars.md). Summary:

1. **Since 2002** — 24+ years of FL wind load expertise (vs SkyCiv's 13 years, founded 2013)
2. **Florida + HVHZ specialist depth** — Miami-Dade NOA, Broward HVHZ, Collier 170, FBC 8th Edition. SkyCiv has none of this.
3. **Better explained** — plain-English glossary inline; output explains WHY each pressure. "Need help?" affordance per step.
4. **Better customer service** — same-day support@windloadcalc.com responses; Bob, P.E. on call.
5. **Looks better** — modern brand palette, mobile-first, fast load. SkyCiv reads as engineering-tool-decade-old.

---

## Quality standards (every page passes all 20)

Detail in [03-page-quality-standards.md](./03-page-quality-standards.md). The short version:

- ≥1,500 unique words body content
- <30% chrome overlap with sibling pages (Helpful Content survival)
- No FAQ Q&A reused verbatim across pages
- Title ≤60 chars unique; meta ~155 chars unique; canonical clean URL
- SoftwareApplication + FAQPage (1:1) + BreadcrumbList schemas — NEVER fake aggregateRating
- Sitemap inclusion + robots tag must agree
- 3 CTAs per page (above-fold ZIP + mid + bottom)
- Wind speed numbers from VelocityFinderCore.get_wind_speed() — never raw CSV
- PE service claims FL-only ≤3 stories

---

## Funnel architecture (every page funnels to purchase)

Detail in [04-funnel-architecture.md](./04-funnel-architecture.md). The flow:

```
Google SERP (state/county/product query)
  → WLC TOFU landing page (with above-fold ZIP form)
  → calc.windloadcalc.com/?zip=NNNNN (auto-prefilled city/state/county/wind speed)
  → Trial signup (email + ZIP captured)
  → Paid subscription ($28+/mo)
  → PE stamp upsell (FL ≤3 stories, per project)
```

Every page must map cleanly to a funnel stage and have a designated primary + secondary CTA. Pages without a purchase path are wasted traffic.

---

## Success metrics

### Per-wave (measured 30/60/90 days post-ship)
- New pages indexed in GSC Coverage report (target: 100% within 30 days)
- New pages ranking somewhere on page 1-5 for primary keyword (target: ≥50% of pages by day 60)
- WLC organic clicks/impressions trend (GSC Performance) — should rise meaningfully
- Trial signups attributed to new pages (backend log analysis)
- Stripe conversion rate (trial → paid) on new-page-sourced trials

### Sitewide (quarterly review)
- Total WLC organic clicks 90d (baseline today; target: 2x by end of Wave 5, 5x by end of Wave 7)
- Number of money-query top-10 rankings on WLC (baseline today; target: 10+ by end of Wave 5, 30+ by end of Wave 7)
- WLS organic NOT degraded (Wave 3 retool should not have hurt WLS rankings; verify quarterly)
- Conversion funnel intact (Stripe trial signup volume should rise with traffic)

### Red flags that trigger course-correction
- WLS clicks drop >10% — investigate, possibly revert Wave 3 retool elements
- WLco re-flagged for Helpful Content — additional noindex pass needed
- Any WLC page indexed but ranked >page 5 after 90 days — content depth or backlink investigation
- Manual action notice in any GSC property — full audit immediately, halt all in-flight waves

---

## Hard rules (the "we got burned on this" list)

These exist because we have evidence each one hurts us. Never violate:

1. **NEVER fake aggregateRating, reviewCount, or ratingCount in schema.** (Caught + removed May 2026 before manual action.)
2. **NEVER claim PE service outside Florida or for >3 stories.** (Closed legal exposure on windload.co/pe.html, 2026-05-22.)
3. **NEVER mass-noindex without pulling GSC first** to verify the affected pages aren't earning traffic. (Two near-misses on 2026-05-22 — would have cost 16% of WLS traffic if blanket-noindexed.)
4. **NEVER add hreflang without real translated content.** (planofday.com phantom URL incident, April 2026.)
5. **NEVER read wind speeds from `usps_zip_codes.csv` directly** — always via `VelocityFinderCore.get_wind_speed()`. CSV has base values; jurisdiction overrides come from the velocity finder.
6. **NEVER template-paste content across sibling pages.** Helpful Content classifier hits the whole site. Atlanta vs Chicago sister-site disaster taught this.
7. **NEVER push to Railway (webapp) without incognito-first verification.** Post-deploy cache-induced revert incident, 2026-05-04.
8. **NEVER skip ASCE 7-22 Verified Values Ledger check** before writing any wind load number to a page or report.

These are codified in saved memory and quality-checked into every wave brief.

---

## Operating procedures

### Starting a new wave (any session, any future Claude)
1. Read this file (SEO-DOMINATION-ROADMAP.md) first
2. Read the relevant wave detail file
3. Check current state: `git log --oneline -10` on each repo to see what's actually shipped
4. Pull fresh GSC exports for windloadcalc.com, windload.solutions, windload.co (Performance → Pages tab → Last 3 months CSV)
5. Verify no breaking changes occurred between session (calc app still accepts `?zip=`? Sitemap intact? Robots agree?)
6. Brief agents per wave's per-page templates
7. Launch in parallel where possible
8. **MANDATORY: After build agents finish but BEFORE the final commit/push, spawn the post-batch QA agent (the 6-check audit per [03-page-quality-standards.md](./03-page-quality-standards.md#post-batch-qa-agent--the-6-mandatory-checks)). Fix any CRITICAL issues found before pushing.**
9. Review every agent's output before commit
10. Commit per-wave (not per-page); one logical commit per repo per wave
11. Push and verify on the live site
12. Update this file's "What's live" section + add the commit hash

### Reviewing an agent's page output (sanity checklist)
- [ ] Word count ≥1,500 (paste body into a counter)
- [ ] **Title ≤60 chars HARD** — count exactly; if over, drop the `| WindLoadCalc` suffix first (Google auto-appends from canonical)
- [ ] Canonical clean URL, matches sitemap entry
- [ ] Robots `index, follow` + sitemap includes the URL
- [ ] 3 JSON-LD blocks present (SoftwareApplication + FAQPage + BreadcrumbList)
- [ ] **NO aggregateRating** (grep `aggregateRating` should return zero hits)
- [ ] **NO out-of-FL PE claims** (grep "all 50" "nationwide" "any state" — flag any matches)
- [ ] 3 CTAs present (above-fold ZIP + mid + bottom)
- [ ] At least 3 differentiation pillars activated (per [02](./02-differentiation-pillars.md))
- [ ] Diff against sibling pages — body content must differ ≥70%
- [ ] **No 10+-word opening clause reused across 3+ sibling pages** (catches templating fingerprints before they scale)
- [ ] Wind speed numbers cite their source (ASCE 7-22 Fig X / FBC Section Y / county ordinance Z)
- [ ] **Visible "Last updated" date + Reviewed-by trust block** in footer-bottom (HARD requirement after Wave 4 QA lesson)
- [ ] No `aggregateRating` in any new schema (one more check — this is the big one)

### Handling a Helpful Content penalty warning (if it ever happens)
1. Don't panic — penalties are recoverable
2. Identify which pages are affected (GSC will surface specific URLs)
3. Audit those pages against [03-page-quality-standards.md](./03-page-quality-standards.md) — find what failed
4. Either rewrite to meet quality standards OR noindex the offending pages
5. After fix, request reconsideration via GSC
6. Pattern-match the failure across the site — rewrite/noindex any siblings with the same pattern
7. Add a memory note so the pattern doesn't recur

---

## Open questions (to refine over time)

- What's WLC's actual current trial→paid conversion rate? (Need Stripe data analysis)
- Which WLS earner pages have the highest conversion-rate-when-CTA'd? (Need post-Wave-3 measurement, ~30 days)
- Should WLC build a free downloadable wind-speed-map-by-state PDF as a backlink magnet? (Wave 10 candidate)
- Is there an opportunity to partner with FL building departments for official "calculator-approved-by" badges? (Trust signal, requires outreach)
- Should the calc app surface "Need PE stamp?" mid-flow for FL users to drive cross-sell? (Funnel optimization, Wave 8)
- What ranks #1 for "wind load calculator" once SkyCiv is dislodged? (Track who replaces them — there's always another competitor)

---

## See also (this folder)

- [01-competitive-teardown-skyciv.md](./01-competitive-teardown-skyciv.md)
- [02-differentiation-pillars.md](./02-differentiation-pillars.md)
- [03-page-quality-standards.md](./03-page-quality-standards.md)
- [04-funnel-architecture.md](./04-funnel-architecture.md)
- [wave-4-non-fl-states-DETAILED.md](./wave-4-non-fl-states-DETAILED.md)
- [waves-5-6-7-future-roadmap.md](./waves-5-6-7-future-roadmap.md)
