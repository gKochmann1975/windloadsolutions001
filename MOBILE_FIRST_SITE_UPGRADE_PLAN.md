# Mobile‑First Upgrade — windload.solutions Authority Site
*Task spec (captured 2026‑06‑27, extracted from the calculator scope checklist where it had been
pasted). **Status: NOT STARTED — queued.** Per its own guardrails, step one is to propose a page
inventory + batch plan and wait for go before the first batch.*

---

GOAL
Upgrade the windload.solutions authority site (100+ pages) to be mobile-first —
phones are the primary target, desktop is the enhancement. Work page-by-page,
verify each on a 375px viewport, and never regress SEO or brand.

STEP 0 — DISCOVER BEFORE YOU TOUCH
- Map the repo: list every git-tracked *.html (root + subdir index pages),
  the shared CSS/JS, nav/footer partials, and the sitemap. Report the inventory
  and a proposed page-batch order before editing.
- Identify the shared nav/footer source of truth. If there's a sync script
  (e.g. sync_nav.py), use it — NEVER hand-edit one page's menu.
- Check for an existing mobile/SEO linter. If none exists, create one
  (see "BUILD A MOBILE LINTER" below) so the bug class is caught mechanically.

MOBILE-FIRST RULES (these are real failure modes already hit on the sister site —
treat each as a hard gate, CRITICAL = must fix before commit)
1. Never `display:none` a hero <h1>/subtitle on mobile — invisible headline +
   hides the indexable H1 from Google. CRITICAL.
2. Never `white-space:nowrap` on hero CTAs — long labels run off the right edge.
   Let them wrap. CRITICAL.
3. Hero CTA font-size must stay < 1.4rem on mobile — no oversized buttons. CRITICAL.
4. Never stack `.header-container` into a column such that the fixed header grows
   taller than the hero's top-padding (header overlaps hero content). CRITICAL.
5. Never `body{padding}` inside a mobile @media query — it creates an inset frame
   / double-gutter. Put horizontal gutters on an INNER `.wrap` container only.
   If a page does this, rebuild the section from the correct template — don't graft. CRITICAL.
6. No `transform:scale()` on a fixed-size hero box per breakpoint, and no scroll
   parallax that sets heroContent transform without a mobile guard — both overflow
   /jump on real phones. HIGH.
7. Tap targets >= 44px; body text >= ~16px on mobile; whole cards are a single
   <a> (clickable-card UX), title >= 1.1rem / body >= 0.95rem.
8. Card grids never orphan a lone card: fit one row, else 2 per row (4 -> 2x2,
   never 3+1); ALWAYS 1 column on mobile.
9. Contrast: never white-on-white or dark-on-dark. Whenever you change a
   background, set the text color in the SAME rule.

BRAND / CONTENT RULES (carry over from the company standard — do not violate)
- This is full-service wind-engineering authority content. Do NOT reposition it
  as "software-first" or mention unrelated businesses.
- Provide ASCE 7-22 only (the latest). NEVER claim "we calculate 7-16" or cite
  older editions as a product. Prefer evergreen "always the latest ASCE 7".
- ASCE 7 is a STANDARD; FBC/IBC/IRC are CODES — use that nomenclature precisely.
- This is an authority/education site — software output is an "Engineering Report /
  permit-ready export", NEVER call SaaS output "sealed" (sealing is a separate PE service).
- No fabricated stats and no fake review schema: never add aggregateRating/
  reviewCount unless backed by real, verifiable reviews. Approved claims only
  (e.g. "100% permit approval over 24 years", "thousands", "7 ASCE editions",
  "since 2002 / Naples FL").
- ZERO templated body content: every page's body copy must be UNIQUE. Only
  nav/footer/trust blocks may repeat. A shared >=10-word clause across pages is a
  CRITICAL finding — rewrite it.
- Keep the real navy logo on its proper backing; never invert it onto a clashing bg.

SEO (must not regress)
- robots meta and sitemap.xml MUST agree: a public page is `index,follow` AND in
  the sitemap; a gated/placeholder page is `noindex` AND out of the sitemap. Never both.
- Preserve canonical tags, titles, meta descriptions, and structured data on every
  page you touch. If you restructure a page, keep the H1 and the indexable copy.
- Don't change URLs. If a URL must die, leave the GitHub-Pages redirect stub pattern
  (noindex,follow + canonical + meta-refresh + JS replace + <a> fallback).

PER-PAGE WORKFLOW (repeat for each page; batch by section)
read -> analyze (what's broken on mobile + what's weak for SEO/GEO) -> improve
-> implement mobile-first (base styles = phone, @media min-width = enhancement)
-> verify at 375px AND ~1280px -> run the linter -> commit ONE focused page/section
per commit with a clear message. Show me a before/after note per page.

QA GATE BEFORE EVERY COMMIT
- Linter passes (0 CRITICAL).
- No body{padding} in any mobile @media; gutters on inner wrap.
- H1 visible on mobile; no horizontal scroll at 375px; no header/hero overlap.
- Contrast verified on changed rules; tap targets >= 44px.
- robots/sitemap agree; canonical + meta + schema intact; body copy still unique.

BUILD A MOBILE LINTER (if the repo lacks one)
Create scripts/check-mobile.js that scans git-tracked *.html and flags rules 1-6
above as single-pass regexes with media-query context awareness (a rule is only a
mobile violation if it's inside an active @media (max-width) block). CRITICAL exits 1.
Add a new rule in the SAME commit as any new mobile failure mode you discover.

SCOPE / GUARDRAILS
- Mobile-first restyle + per-page SEO/GEO polish ONLY. Do not change site
  architecture, pricing, checkout, or backend.
- Don't bulk-noindex anything before checking it isn't earning Search-Console
  impressions.
- Verify changes live/rendered before claiming a page is "fixed" — no "should work"
  on faith. Get the actual rendered result.
- Start by proposing the page inventory + batch plan and waiting for my go before
  the first batch.
