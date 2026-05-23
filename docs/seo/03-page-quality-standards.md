# Page Quality Standards — Anti-Template, Anti-Helpful-Content-Penalty

**Purpose:** Every new SEO landing page on windloadcalc.com (and edits to existing ones) must meet these standards. They exist because we got burned twice — once with a 5,000-page templated experiment that triggered Google's wrath, once with windload.co's county-page Helpful Content classifier hit. Volume without quality = penalty. Quality with focus = ranking.

**Status:** Living document. Update when new patterns emerge. Last updated 2026-05-23.

---

## The non-negotiables (every page must pass all of these)

### Content
1. **≥1,500 unique words of body content.** Boilerplate header/nav/footer doesn't count. Inline calculator UI doesn't count. Schema markup doesn't count. The actual prose a human reads — that's what we measure.
2. **ZERO shared sentences in main body content across sibling pages — NOT "below Google's threshold."** The project standard is "all pages not alike at all," higher than Google's measurable Helpful Content classifier bar. ANY ≥10-word clause or paragraph opener repeated across 2+ sibling pages = CRITICAL violation requiring rewrite. Only boilerplate (nav, footer, copyright, single-paragraph trust block in footer-bottom) may be shared. See [[feedback_zero_templated_body_content]] in memory.
3. **No FAQ Q&A reused verbatim.** Every state/county/product page has its own FAQ section. The questions should be different even if the underlying topic overlaps (e.g., "What is HVHZ?" on Miami-Dade page → "Is Palm Beach in the HVHZ?" on Palm Beach page).
4. **Unique image alt text per page.** No "wind load calculator screenshot" repeated 50 times. Each alt text describes what's actually in THAT image in context of THAT page.
5. **"Last updated" date visible on the page — HARD CHECKLIST ITEM.** Freshness signal Google reads + E-E-A-T trust signal. Pattern: `<p class="last-updated">Last updated: {MMM DD, YYYY} — Reviewed by Bob, P.E. (Florida licensed). Serving wind load professionals since 2002.</p>` placed in the footer-bottom block. Update the date whenever the page changes meaningfully (not on every typo fix). Wave 1-2 pages shipped without this and had to be patched — never again.
6. **Cite authority.** Every wind load number must reference its source (ASCE 7-22 Figure X, FBC 8th Edition Section Y, county jurisdiction ordinance Z). Vague "professional" claims without backing = E-E-A-T fail.

### Technical SEO
7. **Title tag**: **≤60 chars HARD LIMIT**, unique sitewide, includes primary keyword. Pattern: `{Specific Topic} — {Differentiator}`. **Drop the trailing site-name (`| WindLoadCalc`) before dropping the keyword or differentiator** — Google auto-appends site name from canonical/OG, so the trailing brand is wasted SERP real estate when titles run long. Lesson learned from Wave 4 QA: 10 of 13 pages shipped with titles 62-73 chars and had to be patched in a follow-up pass.
8. **Meta description**: ~155 chars (hard limit ~160), unique sitewide, includes a value prop (not just keyword stuffing)
9. **Canonical**: clean URL, no `.html`, single self-canonical (or to a hub if it's a variant). NEVER two `<link rel="canonical">` tags.
10. **Robots meta + sitemap.xml must agree.** A page in sitemap.xml MUST be `index, follow`. A `noindex` page MUST be out of sitemap. Pre-launch checklist: grep the sitemap for the URL, grep the file for the robots tag, confirm consistency.
11. **JSON-LD**: minimum three schemas — `SoftwareApplication` + `FAQPage` (1:1 with visible FAQ, exact text match) + `BreadcrumbList`. NEVER `aggregateRating` / `reviewCount` / `ratingCount` unless we have a real third-party feed (Google Business, G2, Capterra). Self-asserted ratings = Google manual action risk.
12. **No URL-encoded spaces.** Folder names must be kebab-case (e.g., `/florida-wind-load-calculator/`, never `/Florida Pages/`). Spaces force `%20` in URLs which is a SERP weakness.

### Conversion architecture
13. **3 CTAs per page** — above-fold, mid-body, end-of-page. Above-fold MUST be a ZIP input form deep-linking to `calc.windloadcalc.com/?zip=NNNNN`. (The webapp supports this URL param as of commit `46c9c8e`.)
14. **5-10 internal links** to sister WLC pages with varied keyword-rich anchor text. NEVER "click here", "our product", "this page".
15. **1-2 outbound links** to authoritative sources (ASCE, FBC, FEMA, USGS) — these are E-E-A-T signals, not authority leaks, when done in moderation.
16. **No `target="_blank"` on internal links.** Keep users in the ecosystem.

### Data accuracy (project-specific)
17. **NEVER read wind speeds from `usps_zip_codes.csv` directly.** Always use `VelocityFinderCore.get_wind_speed(zip, risk_category)`. The CSV has base ASCE 7-22 values only; jurisdiction overrides (Miami-Dade 175, Broward 170, Collier 170) come from the velocity finder.
18. **Florida county wind speeds quoted on a page must match the live calculator output for representative ZIPs in that county.** Pre-publish test: pick 3 ZIPs in the county, run them through `calc.windloadcalc.com`, confirm the page's reference matches.
19. **PE service claims are FL-only, ≤3 stories.** Per Bob's licensure. Out-of-state PE claims = legal exposure (the pe.html incident on windload.co is the lesson).
20. **State building code references must reflect the CURRENT adoption.** Check `webapp/state_building_codes.py` for the 54-jurisdiction tracker before claiming "Texas uses ASCE 7-16" or similar. Adoption shifts over time.

---

## Anti-patterns (NEVER do these)

| Anti-pattern | Why it fails |
|---|---|
| Copy a sibling page and find-replace location name | Google's Helpful Content classifier reads HTML similarity at scale. Two pages with 90% identical chrome = entire site flagged. |
| Reuse any 10+-word opening clause across 3+ sibling pages, even if the surrounding paragraph differs | The 30-word verbatim threshold catches obvious paste-jobs, but templating fingerprints often start at the opening clause. If "The calculator returns MWFRS pressures (for the structural system) and C&C pressures" opens process-step #4 on 7 pages, that's a pattern Google can detect at scale. Vary opening clauses per page from the start. Lesson learned from Wave 4 QA. |
| Generate FAQ from a template ("What is wind load in {LOCATION}?") | Reads as machine-generated. Real FAQs answer real questions users ask. |
| Stuff the primary keyword 20+ times | Keyword stuffing penalty. Modern Google is content-meaning aware. Use the keyword 2-4 times naturally. |
| Use fake testimonials, fake reviews, fake aggregateRating | Schema spam violation. Manual action risk. The May 2026 incident on windloadcalc.com (fake 4.9 stars / 127 reviews) was caught and removed before Google manual-actioned us. Never again. |
| Claim "all 50 states" PE service | Misrepresentation. Bob is FL-licensed ≤3 stories. The windload.co/pe.html incident corrected this. |
| Skip the GSC check before mass-noindexing pages | The WLco + WLS near-misses both saved us. Always pull GSC Performance for the affected property and cross-reference ≥10 imp/90d URLs before noindexing in bulk. |
| Link to noindex pages without `rel="nofollow"` | Wastes PageRank into dead-ends. Use nofollow when linking to noindex placeholders. |
| Add hreflang without real translated content | The planofday.com April 2026 incident — 4,000+ phantom URLs from hreflang pointing nowhere. Never add language alternates without actual translated pages. |
| Use `<meta http-equiv="refresh">` for redirects on indexed pages | OK only for legacy URL stubs that are noindex,follow with a canonical to the destination. For live pages, never. |

---

## The Helpful Content classifier survival test

Before shipping a new page, ask:
1. **Would this page exist if Google didn't?** (If no, it's SEO bait — risky)
2. **Does it answer a question a real user would type?** (If no, it's keyword stuffing — risky)
3. **Could a competing engineer read it and learn something specific about THIS jurisdiction?** (If no, it's templated — risky)
4. **Does it have a unique data point or insight not on the first 10 SERP results today?** (If no, why would Google rank it above them?)
5. **If I removed the calculator widget, would there still be a reason to visit?** (If no, the page has no informational value — risky)

If ANY answer is "no" — rewrite or don't publish.

---

## Per-section content guardrails (state/county/city pages)

A well-built state/county/city calculator page has these 9 sections, in order. Each section must contain unique-to-this-location content:

| Section | Must include (unique to location) | Cannot be templated |
|---|---|---|
| 1. Hero | H1 exact match for primary keyword + location-specific subhead | Subhead text differs per location |
| 2. Wind speed quick-reference | Real ZIP-level data from `velocity_finder_core.py` for THIS location's representative ZIPs | The ZIPs differ per location |
| 3. Jurisdiction explainer | THIS location's specific code adoption, amendments, permit authority | Different code references / amendments / authority per state |
| 4. Local hazard context | THIS location's hurricanes, special wind regions, topography | Different historical context per location |
| 5. How-to walkthrough | Worked example for a representative project type in THIS location (e.g., Naples lanai, Miami high-rise condo, Houston single-family) | Different example per location |
| 6. FAQ | 6-10 questions actual users in THIS location ask | Different questions per location |
| 7. Internal links | To sister calculator pages + the relevant WLS educational page | Different sibling-page set per location |
| 8. Bottom CTA | Conversion offer tailored to project type common in THIS location | Different CTA framing per location |
| 9. "Last updated" + author trust signal | Date + reference to our 24+ year history | Same trust signal across pages (only this section may be shared) |

If you find yourself writing identical paragraphs across sections 1-8 of two different pages, you're in the templated zone. Stop and rewrite.

---

## Audit cadence

- **Pre-publish (every new page):** Manual review against this checklist. No exceptions.
- **Post-batch (MANDATORY — every wave that ships ≥3 new pages):** QA agent runs the 6-check audit (see below) BEFORE the final commit/push. CRITICAL issues fix immediately, WARNING issues track for next session.
- **30 days post-publish:** Pull GSC Performance + Page Indexing reports. Confirm the page is indexed. If not, diagnose (canonical issue? content too thin? sitemap miss?).
- **90 days post-publish:** Review ranking position trend. If still page 5+ after 90 days for the target query, the page needs an attack-plan revision — likely content depth or backlink work.
- **Quarterly sitewide:** Re-pull GSC Performance for all 3 domains. Identify pages losing rank. Cross-reference against recent edits. Roll back changes that hurt ranking.

---

## Post-batch QA agent — the 6 mandatory checks

Codified 2026-05-23 after Wave 4 ship. Spawn one QA agent in background immediately after build agents finish, BEFORE the final commit/push.

### Check 1 — FAQPage JSON-LD ↔ visible FAQ HTML must match 1:1
Parse the `FAQPage` JSON-LD block, extract every Question + Answer text, compare against visible HTML (`<details>` / `<summary>` / `<div class="faq-item">` etc.). ANY divergence = Google Rich Results policy violation risk. Manual action exposure.

### Check 2 — NO `aggregateRating` anywhere
Grep all new pages for: `aggregateRating`, `reviewCount`, `ratingCount`, `ratingValue`, `bestRating`, `worstRating`, `Review` (as schema type). Zero hits expected. Per the May 2026 near-incident on windloadcalc.com.

### Check 3 — Cross-sibling body-text overlap (HARDENED 2026-05-23)
**Threshold: ≥10 words shared = CRITICAL violation (was ≥30 words / WARNING in earlier version — tightened after Wave 4 templated process-step opener incident).**

For each pair of new sibling pages, strip HTML/CSS/schema, extract body prose, identify ANY ≥10-word clause appearing verbatim or near-verbatim in both.

Acceptable shared content (boilerplate only — universally classifier-safe):
- Site navigation, footer link lists, copyright text
- Single short-paragraph trust block in footer-bottom (e.g., "Reviewed by Bob, P.E. — serving since 2002")
- CSS classes + JSON-LD schema types (data inside must still differ per page)
- HTML structural patterns (form structure, list structure)

Unacceptable (any ≥10-word match = CRITICAL, must rewrite before push):
- Section H2 / H3 headings shared across pages
- Opening clauses of paragraphs (first 10+ words)
- Process-step text (every page's "how to calculate" walkthrough must be uniquely worded)
- FAQ questions OR answers
- Table column descriptions / cell prose
- ZIP form headlines / subheads / placeholder text
- Internal-link block intro sentences
- Bottom CTA headlines + value-prop bullets
- Any in-body explainer paragraph

If QA Check 3 finds shared body content: FIX BEFORE PUSHING. Never carry templated text forward to next session.

### Check 4 — PE service scope claims
Grep for "all 50 states", "nationwide" + PE/seal/stamp context. Verify all uses comply with FL-only ≤3 stories per Bob's licensure. Acceptable: nationwide users. Unacceptable: nationwide PE stamps.

### Check 5 — Wind speed numerical accuracy
For each state/county page, verify the quoted wind speed numbers against ASCE 7-16/7-22 + (for FL counties) `webapp/velocity_finder_core.py` for jurisdiction overrides. Framing as "approximate" acceptable; authoritative-sounding wrong numbers not.

### Check 6 — Technical SEO consistency
Per page verify: title ≤60 chars, meta ≤160 chars, exactly one `<link rel="canonical">` (clean URL, no `.html`), `<meta name="robots" content="index, follow">` present, URL in `sitemap.xml`, no duplicate meta/canonical tags.

### Reporting format
Structured Markdown with: executive summary (pass/fail counts) → per-check findings → CRITICAL/WARNING/COSMETIC tiered fix recommendations with file path + line range → recommended changes to this standards file → suggested additional checks for next audit.

### When QA finds issues
- **CRITICAL** (FAQ schema mismatch, fake aggregateRating, PE service scope drift, materially-wrong wind speed): fix BEFORE final push. If already pushed, revert and re-push the fix.
- **WARNING** (minor cross-sibling overlap, title 61-65 chars, etc.): track in `docs/seo/qa-followups.md` (create if needed) for next session.
- **COSMETIC** (subjective polish, optional improvement): note but don't block ship.

See [[feedback_post_page_qa_standard]] in memory.

---

## See also

- [SEO-DOMINATION-ROADMAP.md](./SEO-DOMINATION-ROADMAP.md) — Main strategy
- [01-competitive-teardown-skyciv.md](./01-competitive-teardown-skyciv.md) — Competitor we're beating
- [02-differentiation-pillars.md](./02-differentiation-pillars.md) — How we win
- [04-funnel-architecture.md](./04-funnel-architecture.md) — Page → purchase path
