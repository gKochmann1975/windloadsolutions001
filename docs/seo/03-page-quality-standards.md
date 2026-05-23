# Page Quality Standards — Anti-Template, Anti-Helpful-Content-Penalty

**Purpose:** Every new SEO landing page on windloadcalc.com (and edits to existing ones) must meet these standards. They exist because we got burned twice — once with a 5,000-page templated experiment that triggered Google's wrath, once with windload.co's county-page Helpful Content classifier hit. Volume without quality = penalty. Quality with focus = ranking.

**Status:** Living document. Update when new patterns emerge. Last updated 2026-05-23.

---

## The non-negotiables (every page must pass all of these)

### Content
1. **≥1,500 unique words of body content.** Boilerplate header/nav/footer doesn't count. Inline calculator UI doesn't count. Schema markup doesn't count. The actual prose a human reads — that's what we measure.
2. **<30% chrome overlap with sibling pages.** Atlanta page and Chicago page on a sister site share 80%+ identical body text — that's the pattern Google's Helpful Content classifier flags. Test: paste two sibling page bodies into a diff tool. If less than 30% differs, rewrite.
3. **No FAQ Q&A reused verbatim.** Every state/county/product page has its own FAQ section. The questions should be different even if the underlying topic overlaps (e.g., "What is HVHZ?" on Miami-Dade page → "Is Palm Beach in the HVHZ?" on Palm Beach page).
4. **Unique image alt text per page.** No "wind load calculator screenshot" repeated 50 times. Each alt text describes what's actually in THAT image in context of THAT page.
5. **"Last updated" date visible on the page.** Freshness signal Google reads. Update it whenever the page changes meaningfully (not on every typo fix).
6. **Cite authority.** Every wind load number must reference its source (ASCE 7-22 Figure X, FBC 8th Edition Section Y, county jurisdiction ordinance Z). Vague "professional" claims without backing = E-E-A-T fail.

### Technical SEO
7. **Title tag**: ≤60 chars, unique sitewide, includes primary keyword. Pattern: `{Specific Topic} — {Differentiator} | WindLoadCalc`
8. **Meta description**: ~155 chars, unique sitewide, includes a value prop (not just keyword stuffing)
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
- **30 days post-publish:** Pull GSC Performance + Page Indexing reports. Confirm the page is indexed. If not, diagnose (canonical issue? content too thin? sitemap miss?).
- **90 days post-publish:** Review ranking position trend. If still page 5+ after 90 days for the target query, the page needs an attack-plan revision — likely content depth or backlink work.
- **Quarterly sitewide:** Re-pull GSC Performance for all 3 domains. Identify pages losing rank. Cross-reference against recent edits. Roll back changes that hurt ranking.

---

## See also

- [SEO-DOMINATION-ROADMAP.md](./SEO-DOMINATION-ROADMAP.md) — Main strategy
- [01-competitive-teardown-skyciv.md](./01-competitive-teardown-skyciv.md) — Competitor we're beating
- [02-differentiation-pillars.md](./02-differentiation-pillars.md) — How we win
- [04-funnel-architecture.md](./04-funnel-architecture.md) — Page → purchase path
