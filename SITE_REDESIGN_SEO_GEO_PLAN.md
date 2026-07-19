# WindLoadCalc — Site Redesign + SEO/GEO Campaign

**Started:** 2026-06-26 · **Owner:** Gregory Kochmann · **Status:** IN PROGRESS

> Living document. Updated as each page ships. Lives in the **parent** repo
> (`c:\Dev\windload-solutions\`), NOT in `website/`, so it is not published to GitHub Pages.
>
> **This doc is on-page.** For the **off-page / backlink / authority** half of the SEO+GEO
> effort, see **`OFF_PAGE_SEO_BACKLINK_STRATEGY.md`** (Tier 1 owned-domain links → free calcs
> shipped 2026-07-19; Tiers 2–4 directory/roundup/community outreach still open).

---

## North Star
Make every public page (a) visually first-class in the dark-glass aesthetic of the
new homepage, (b) **#1 in Google** for its target wind-load query, and (c) the page
**AI answer-engines cite first** (GEO) for that topic. Preserve everything that already
works (content, calculators, checkout, SEO equity); improve the rest.

## Non-negotiable principles (from the owner, 2026-06-26)
1. **No cookie-cutter / bulk updates.** Each page is read → analyzed → improved →
   executed individually. NO two pages share body copy.
2. **Every page is UNIQUE.** To reference shared ideas, **link** to the canonical page
   (internal links help ranking) — do not duplicate sentences. (See memory
   `feedback_zero_templated_body_content` + `feedback_bespoke_pages_seo_geo`.)
3. **Preserve, then improve.** Keep the substance the owner values; upgrade the look,
   structure, SEO, and GEO around it. Same URL, SEO equity carried verbatim.
4. **Document everything** here as we go. At the end: deliver new-page recommendations
   and a list of any videos needed for new pages.
5. **Review cadence:** show each finished page (local preview) before it goes live,
   unless the owner says to batch.

## Per-page quality checklist (every page must pass)
- [ ] Read fully; unique content inventoried and preserved
- [ ] Dark-glass redesign (aurora bg, glass cards, shared full hamburger menu)
- [ ] Mobile-first, passes `node scripts/check-mobile.js`
- [ ] Same URL; title/desc/canonical/OG/Twitter carried over (or improved, not lost)
- [ ] **SEO:** unique H1, target keyword in title+H1+first 100 words, semantic headings,
      internal links out, descriptive alt text, fast (video `preload=metadata` + poster)
- [ ] **GEO:** FAQPage + BreadcrumbList schema, clean quotable Q&A, concrete factual
      claims (24-yr approval, ASCE 7-22, 40k ZIPs, FL overrides) — no fabricated stats
- [ ] No fake review schema (Google policy); real numbers only
- [ ] robots ⇄ sitemap agree
- [ ] Verified live after deploy (curl/behavior), rollback file kept

## SEO #1 strategy (per page)
- One page = one primary keyword cluster; map each page to its query (table below).
- Strong title (≤60 char) + meta desc (≤155) with the keyword + a differentiator.
- H1 unique to the page; H2/H3 cover sub-intents (PAA-style).
- Depth: each page answers the query more completely than competitors (SkyCiv etc.).
- Internal linking web: hubs (landing, shop) ↔ spokes (location, professional, guide).
- Technical: Core Web Vitals (lazy video, posters), valid schema, clean canonicals.

## GEO / AI-search strategy (per page)
- FAQPage schema with the literal questions users ask an AI ("what's the wind speed for
  ___", "is there a free wind load calculator", "does it cover Miami-Dade").
- Self-contained factual sentences AI can lift verbatim (no "see above").
- llms.txt already sitewide; ensure each page's key facts are crawlable as text.
- Entity clarity: name the standard (ASCE 7-22), codes (FBC/IBC), brand (WindLoadCalc).

## Uniqueness enforcement & QA gate (no cookie-cutter)
SHARED by design (correct, not cookie-cutter): the dark-glass design system, the shared
full hamburger menu (`js/site-nav.js` or inlined equivalent), footer, typography.
UNIQUE and enforced per page: ALL body copy, H1, section structure, FAQ, and the page's
angle. To reuse an idea, LINK to the canonical page — never repeat the sentence.

**QA gate before the campaign is declared done:**
1. Cross-page duplicate-content scan — flag any shared ≥10-word clause in `<body>` text
   across the redesigned pages (excluding nav/footer/schema). Any hit = rewrite. (This is
   the owner's "≥10-word-clause overlap = CRITICAL" standard.)
2. Per-page: unique `<title>`, unique H1, unique meta description, target keyword in
   first 100 words.
3. Highest-risk cluster = the 21 location/SEO pages — each must be written around its
   real jurisdiction facts (e.g. Miami-Dade 175 mph HVHZ, Broward/Collier overrides,
   Texas Gulf coast, Hawaii CCPR). These get the strictest overlap check.
4. Tooling: `node scripts/check-seo.js` + `node scripts/check-mobile.js` per page; a
   dedicated overlap scan (agent or script) across the cluster before sign-off.

---

## Page inventory (real deployed pages only)
Excludes `.backups/`, `.archive/`, `new_env/` (venv), `Landing Pages/` (noindex sources),
`email/`, and the `service-area/…idaho` redirect stub.

### ✅ Done — dark-glass (3)
`index.html` · `building-intelligence-platform-shop.html` · `wind-load-calculator-shop.html`
(cleanup: noindex/remove `*-shop-new.html` source dups)

### Group A — old `.main-header` → bespoke dark-glass redesign + shared nav
**Top-level content (14)** — `services.html` nav piloted:
building-intelligence-platform-landing · building-intelligence-platform · contact ·
contractors-wind-load-calculator · demo · faq · services · why-us ·
wind-load-calculator-comparison · wind-load-calculator-for-architects ·
wind-load-calculator-for-engineers · wind-load-calculator-landing · wind-load-software ·
wind-loads-for-consultants

**Location / SEO subfolder pages (15):**
asce-7-wind-load-calculator/ · asce-hazard-tool-alternative/ · broward- · california- ·
collier-county- · components-and-cladding-wind-loads/ · florida- · hawaii- · louisiana- ·
miami-dade- · north-carolina- · palm-beach- · south-carolina- · texas- ·
virginia-wind-load-calculator/

**Shop category pages (5):** shop/windows-doors-shutters (live) ·
shop/mwfrs · roofing · solar-panels · specialty (noindex, coming-soon)

### Group B — indexed but no nav → redesign + add nav (2)
privacy-policy.html · terms-of-service.html

### Group C — custom `<nav>` → bespoke redesign (custom-nav handling) (~8)
free-wind-load-calculator.html *(first — also resolves PRO-gating + daily limit)* ·
vs-skyciv.html · florida-wind-speed/ {index, broward, collier, lee, miami-dade, monroe} ·
account.html (app)

### Group D — app / Stripe / utility (noindex) → mostly skip
login · cart · dashboard · admin · reset-password · join-team · download · success ·
checkout-success · checkout-cancelled · bip-shop-success/cancel · calc-shop-success/cancel ·
payment-thank-you · migrate · batch-entry-alt · bip-test · 404 *(404 worth a nav)*

---

## Execution phases (updated for bespoke craft)
Each page = read → analyze → redesign (preserve+improve) → SEO/GEO pass → local preview →
push → verify live → log here. Sequenced for impact:

- **Phase 0 — Foundation (DONE):** homepage + both shop pages live; shared nav component
  `js/site-nav.js` built; `services.html` nav piloted.
- **Phase 1 — Top-of-funnel & money pages:** `free-wind-load-calculator.html` (highest
  search volume), `wind-load-calculator-landing.html`, `building-intelligence-platform-landing.html`,
  `wind-load-calculator-comparison.html`, `vs-skyciv.html`, `demo.html`.
- **Phase 2 — Professional intent pages:** for-engineers · for-architects · for-consultants ·
  contractors · services · wind-load-software.
- **Phase 3 — Trust / company:** why-us · contact · faq · privacy-policy · terms-of-service · 404.
- **Phase 4 — Location/SEO cluster (15) + florida-wind-speed (6):** each county/state page
  uniquely written around its jurisdiction (Miami-Dade 175 mph, HVHZ, etc.).
- **Phase 5 — Reference guides:** asce-7-wind-load-calculator/ · components-and-cladding-wind-loads/ ·
  asce-hazard-tool-alternative/.
- **Phase 6 — Shop category pages (5)** + app pages that warrant nav.
- **Phase 7 — Cleanup + final documentation + new-page recommendations + video list.**

---

## Per-page tracker
| Page | Group | Analyzed | Redesigned | SEO | GEO | Live | Notes |
|---|---|---|---|---|---|---|---|
| index.html | done | ✓ | ✓ | ✓ | ✓ | ✓ | dark-glass homepage |
| building-intelligence-platform-shop.html | done | ✓ | ✓ | ✓ | ✓ | ✓ | checkout preserved |
| wind-load-calculator-shop.html | done | ✓ | ✓ | ✓ | ✓ | ✓ | category hub |
| services.html | A | — | nav pilot | — | — | local | nav component piloted |
| free-wind-load-calculator.html | C | ✓ | ✓ | ✓ | ✓ | ✓ | LIVE 2026-06-26 (commit 74611f4). Shipped Exposure-B + Enclosed gating that was never pushed; default enclosure → Partially Open; "Pro"→"Paid" labels; +Breadcrumb/quick-answer (GEO); dark-glass nav. Rollback: free-wind-load-calculator-old.html |
| wind-load-calculator-landing.html | A | ✓ | ✓ | ✓ | ✓ | ✓ | LIVE 2026-06-26 (commit 1dd685a). Testimonials→real-proof band; "42,000"→"every U.S. ZIP"; scrubbed 10,000-permits/<0.1%/85-90%; +FAQPage/Breadcrumb; simplified category panel + killed 3 dead handlers; fixed footer links. Rollback: wind-load-calculator-landing-old.html |
| building-intelligence-platform-landing.html | A | ✓ | ✓ | ✓ | ✓ | ✓ | LIVE 2026-06-26 (commit cafe7fa). GTM angle (Search+Compare lead); removed 3 fake testimonials→real-proof; "40,000"→33,783; scrubbed invented ROI $; fixed 6 dead #demo-video anchors + footer + OG slash; +FAQPage/Breadcrumb. Rollback: building-intelligence-platform-landing-old.html |
| wind-load-calculator-comparison.html | A | ✓ | ✓ | ✓ | ✓ | ✓ | LIVE 2026-06-26 (commit 61cc781). 98-feature matrix kept light inside dark-glass chrome (nav+menu+Inter+dark FAQ/CTA). Fixed $46k/95%/"3 enclosure types"→4/"PE stamps"; +FAQPage/Breadcrumb/SoftwareApplication; fixed footer mislinks. Rollback: wind-load-calculator-comparison-old.html |
| _…remaining pages added as started…_ | | | | | | | |

---

## GSC indexing snapshot (2026-06-26) — validates the campaign
29 indexed / 54 not indexed. Triage of "not indexed":
- **Healthy / intentional (~16) — LEAVE:** Page-with-redirect (6: http→https, www→non-www,
  index.html→/, slug→slug/), Excluded-by-noindex (login, legacy slugs), Blocked-by-robots
  (calc./api. subdomains), 4xx (api admin endpoint), 404 (fake /index.php), Alternate-canonical (NC).
- **components-and-cladding-wind-loads/** flagged "noindex" was a STALE 5/22 crawl — file is now
  index,follow + canonical + in sitemap. → Request re-index/Validate Fix.
- **The real opportunity = Crawled-not-indexed (28) + Discovered-not-indexed (10):** strip the
  utility/subdomain noise and what's left is the **location/SEO cluster + main pages**. PROVEN cause:
  Florida vs California location pages are **~64% byte-identical** — Google declines to index the
  near-duplicate cluster. **The bespoke-uniqueness redesign (Phase 4) is the fix.** After each
  redesign, use GSC URL Inspection → Request Indexing.
- **Quick wins (already redesigned, sitting in Discovered/Crawled-not-indexed):** request indexing for
  free-wind-load-calculator.html, wind-load-calculator-landing.html, components-and-cladding-wind-loads/.
- **Slash/no-slash dupes** (e.g. /florida-wind-load-calculator vs .../) are handled by self-canonical → ok.

## New-page recommendations (seed — finalize at end)
Initial high-opportunity ideas (validate with GSC/keyword data before building):
- **Competitor comparison cluster** (high buy-intent): expand beyond `vs-skyciv.html` +
  `asce-hazard-tool-alternative/` to `vs-mecawind`, `vs-clearcalcs`, `vs-risa`, `vs-enercalc`.
  RULES: each researched (WebSearch) for the competitor's REAL features/pricing — no fabricated
  competitor claims (comparative advertising must be truthful); each uniquely written (a templated
  "vs" cluster won't index — same GSC lesson); frame around our verifiable strengths.
- **State pages to match the FL depth** for high-wind states already partially covered
  (Georgia, Alabama, Mississippi, New York coastal) — mirror the location-page pattern, unique copy.
- **"ASCE 7-22 vs 7-16 changes"** explainer (captures version-migration searches; strong GEO).
- **"Wind load calculator for [solar / signs / rooftop equipment]"** topical pages feeding
  the Chapter 29 standalone calculators.
- **Risk Category explainer** (I–IV) — common AI question, few good pages rank.
- **"How to read an ASCE wind speed map"** — informational, links to the tools.

## Competitor intel (verified via WebSearch 2026-06-26) — for the vs- cluster
**CRITICAL:** do NOT claim competitors "ignore Florida/FBC" — MecaWind & ENERCALC explicitly
support FBC/ASCE 7-22. The SkyCiv "FBC override" angle works only because SkyCiv reads the ASCE
map; it does NOT transfer to MecaWind. **Universal honest differentiators** (all competitors are
software/SaaS — none offer sealing): (a) **PE sign-and-seal service in ALL 50 STATES** via the
firm's licensed-PE network (NOT just FL — competitors offer NO sealing anywhere), (b) **truly
free public calc, no signup/no meter**, (c) **.xlsx Architectural Schedule for AutoCAD**, (d)
**per-coefficient ASCE citations** in output, (e) wind-load specialist since 2002 (online 2006).
NOTE: supersedes the old "FL-only ≤3 stories" framing for Bob — Bob is the in-house FL PE, but
the firm seals nationwide via its PE network/brokerage. See memory [[feedback_pe_stamp_scope]].

- **SkyCiv** — web app; ASCE 7-10/16/22 + intl codes; free = 3 map lookups/day + 3 solves/week
  (gable/open-pitched only, signup required). No FBC overrides. **Price not public → link out, don't state.**
- **MecaWind** (Meca Enterprises) — Windows **desktop**; ASCE 7-22/16/10/05 + tornado; **supports FBC
  2023/2020/2017**. Price (confirmed): Standard **$28/mo** ($252/yr), Pro **$45/mo** ($405/yr),
  Ultimate **$57/mo** ($513/yr), +$30 setup. Angle: web vs install, free public calc, FL P.E. seal, .xlsx.
- **ClearCalcs** — web; ASCE 7-22/16; ~**$79–$149/mo** (third-party listing — label as such). General
  calc library vs wind specialist.
- **RISA** — RISA-3D desktop (7-22) + RISACalc web (7-10/16; 7-22 TBD — don't assert). Price not public.
- **ENERCALC** (SEL) — desktop+cloud; 7-22/16/10; **$199/mo or $1,699/yr** (2-user). Broad library; high entry cost for wind-only users.

**vs-skyciv.html corrections** (existing page is otherwise clean): soften evidence-card "169 mph"→
"~170 mph (ASCE map)" + mark "1234 Brickell Ave" illustrative; qualify "derivation not shown" to free
tier; confirm/soften "9 codes"; verify Broward/Collier 170 vs `/florida-wind-speed/`; add link to it.
RULES: never state unverified competitor prices; reuse nominative-fair-use boilerplate; no rating schema.

## WINNING PLAN (competitor-strategy workflow, 2026-06-26, 12 agents, all sourced)
**⚠️ CRITICAL HONESTY FIX:** do NOT claim "the only nationwide PE sealing service" — standalone
stamp brokers (pestamping.com, pepermit.com, etc.) demonstrably exist. The real, defensible moat is
the **INTEGRATION**: *calculate AND get it sealed in one workflow.* Stamp brokers have no wind engine;
wind software has no seal. WLC is the only one with both. Frame it that way every time.

**5 universal "why we win" pillars (ranked):**
1. **Calculate + seal in one place** — every wind-software rival (SkyCiv, MecaWind, ClearCalcs, RISA,
   ENERCALC, Struware, Tedds, Digital Canal, IES) is software-only, seals nothing.
2. **Legally enforceable Florida value** — auto FBC HVHZ override (Miami-Dade 175 mph). Wedge =
   AUTOMATION of the code value, NOT "they ignore Florida" (MecaWind & ENERCALC support FBC).
3. **Genuinely free public calculator** — no signup/card (rivals gate behind trial/paywall).
4. **Wind-specialist depth** — 33,783 pre-verified ZIPs, .xlsx AutoCAD schedule, per-coeff citations.
   NOTE: ClearCalcs is at PARITY on coefficient traceability — call it a tie (honesty).
5. **Zero-install SaaS, since 2002, from $35/mo.**

**VERIFIED origin wedge (WebSearch 2026-06-26):** SkyCiv = **Australian** co. (SkyCiv Pty Ltd, Sydney
NSW), founded **2013** — markets as "Australian Structural Design Software" (later opened a Chicago
office). ClearCalcs also Australian-founded. **WindLoadCalc = American, born Naples FL 2002** — the year
Florida's first statewide building code took effect (March 1, 2002; post-Hurricane-Andrew, nation's
toughest wind/hurricane code). → vs SkyCiv/ClearCalcs lead with "US/Florida wind since the law was
written (2002), 11 yrs before SkyCiv existed, from the actual ground zero of US wind engineering."
NOTE: MecaWind = American (Meca Enterprises, founded 2001, Broken Arrow OK) — do NOT use the
"American/older" angle vs MecaWind; win there on web-vs-desktop / free calc / seal / HVHZ automation / .xlsx.

**Sharpest wedge per competitor (sourced):** SkyCiv = Australian (2013) + seals nothing + free tier dies at 3/day ·
MecaWind = Windows-only, demo locked to 80mph/ExpB/RiskI, you still source speed+HVHZ+stamp ·
ClearCalcs = parity on coeffs but stops at ASCE map + seals nothing; wind needs Pro $99/mo (Basic $66
excludes wind) · **RISACalc wind generator = ASCE 7-16/7-10 ONLY — can't produce 7-22** (their own
docs) · ENERCALC = links OUT to ASCE Hazard Tool for wind speed + seals nothing ($199/mo, $1,699/yr).

**Positioning line:** "Every other wind tool calculates. We calculate, enforce the code, and seal it —
the only ASCE 7-22/FBC wind platform that takes you from a ZIP code to a PE-stamped, permit-ready
deliverable." Tagline: **"The wind calc that doesn't stop at the math."**

**Build order:** Wave 1 (evidence ready): SkyCiv → ClearCalcs → ENERCALC → MecaWind → RISA. Wave 2
(market scan): **ASCE Hazard Tool** (top-of-funnel, complimentary framing, build early) · Struware ·
Digital Canal (VERIFY 7-22 absence on live site first). Wave 3: a "wind load software landscape"
roundup hub absorbing RISA/IES/Tedds/free-Excel + anchoring internal links.

## Video needs (seed — owner to provide for NEW pages)
Existing hero videos reused: homepage, BIP, wind-load shop. Will list any NEW video needs
here as new pages are designed. (Owner: you said just flag them — I will.)

---

## Documentation & rollback
- Every flipped page keeps a `*-old.html` (noindex) rollback OR is recoverable via git.
- Shared nav = single source of truth (`website/js/site-nav.js`).
- This file is the campaign record; memory pointers in `MEMORY.md`.
