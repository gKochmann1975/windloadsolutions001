# WindLoadCalc — Off-Page SEO & Backlink Strategy (GEO + Google)

**Started:** 2026-07-19 · **Owner:** Gregory Kochmann · **Executor:** Claude
**Status:** IN PROGRESS · **Companion to:** `SITE_REDESIGN_SEO_GEO_PLAN.md` (on-page) — this doc is the **off-page** half.

> Lives in the parent repo (`c:\Dev\windload-solutions\`), NOT in `website/`, so it is
> not published to GitHub Pages.

---

## Why this doc exists (the finding, 2026-07-19)

Greg asked why **Omni Calculator** and **CalcTool.org** out-rank us for "wind load calculator,"
and how to overtake them.

**Diagnosis (verified against the live pages):**
- Omni and CalcTool are the **same thin physics widget** — `q = ½ρV²`, `F = q·A·Cd`. No ASCE 7,
  no ZIP→windspeed, no risk category, no GCp/Kz, no code compliance. They serve the generic
  Physics-101 "wind load" query, not the engineering/permit query.
- Our free page `free-wind-load-calculator.html` is **already technically superior**: 10,611 words,
  full schema stack (FAQPage, HowTo, WebApplication, Dataset, Breadcrumb, Organization), real
  ASCE 7-22 + FL HVHZ, in sitemap, `index, follow`, canonical correct. **On-page has no gap left.**
- They still rank because of **domain authority (backlinks) + URL age** — nothing else. Google
  trusts a thin page on a DA-85–90 domain over a great page on a younger URL.

**Conclusion:** You cannot "push a competitor down." You climb above them, and against a
high-authority incumbent the ONLY remaining levers are **backlinks to the specific URL** and
**time/engagement**. More page edits change nothing. This doc is the backlink plan.

**Two separate battles (don't conflate):**
1. Generic "wind load calculator" → Omni/CalcTool (physics). Win with authority + funnel.
2. "wind load **software**" → SkyCiv / Dlubal / Meca (ASCE 7). This is the AI-Overview/GEO fight
   and where the buyers are. (Greg declined a dedicated comparison page 2026-07-19 — revisit later.)

---

## Target pages (what we are building links TO)
- `https://windloadcalc.com/free-wind-load-calculator.html` (free C&C — primary)
- `https://windloadcalc.com/free-mwfrs-wind-load-calculator.html` (free MWFRS)

Both are free SEO-funnel tools. Per `feedback_free_calc_seo_funnel_convention`: free anchors point
to the free page; trial CTAs go landing→app. Keep backlink anchors pointed at the **free** pages.

---

## TIER 1 — Links we control (own domains) — HIGHEST ROI, no outreach
Zero permission needed; we own these domains. **Biggest miss found:** the authority site
`windload.solutions/resources` links to `demo.html` + the shop but **NOT** to
`free-wind-load-calculator.html`.

Repos:
- windload.solutions → `c:\Dev\windload-solutions-parent` (remote `windload-solutions.git`, branch `main`)
- windload.co → `c:\Dev\windload-co` (remote `windload-co.git`, branch `master`)

| # | Action | Repo / page | Anchor text | Status |
|---|---|---|---|---|
| T1-1 | Repoint flagship card (was retired demo.html redirect) → free C&C calc | windload.solutions `resources.html` | "Free Wind Load Calculator" | ✅ DONE 2026-07-19 (pushed `main` 17bc054) |
| T1-2 | Inline links to free C&C + free MWFRS in closing CTA | windload.solutions `resources.html` | "free wind load calculator" / "free MWFRS calculator" | ✅ DONE 2026-07-19 (same commit) |
| T1-3 | Link from top wind-load guide pages | windload.solutions guide pages | descriptive, varied anchors | ◐ PARTIAL — all 11 state pages already link the free calc; broader guide-page linking still open (do NOT bulk-spray identical anchors) |
| T1-4 | Repoint comparison-page "Try Free Demo" CTAs (were → homepage) → free C&C calc | windload.co `vs-omni.html`, `vs-buildingsguide.html`, `compare.html` | "Try the Free ASCE 7-22 Calculator" | ✅ DONE 2026-07-19 (pushed `master` 8f3a7b72) |

Rules while executing: unique/contextual anchors (no bulk identical), surgical deltas, verify each
link resolves live before claiming done, never `git add -A`.

## TIER 2 — Free directory / listing submissions (we submit → they list)
Calculator aggregators that already list tools like Omni/CalcTool. Getting listed = a backlink.
| Target | URL | Status |
|---|---|---|
| Engineers Edge – Calculators | https://www.engineersedge.com/calculators.htm | ☐ |
| The Engineering ToolBox | https://www.engineeringtoolbox.com/ | ☐ |
| Jabacus – Engineering Calculators | https://jabacus.com/calculators.php | ☐ |
| BuildingsGuide – Structural Calculators | https://www.buildingsguide.com/calculators/structural/ | ☐ |
| CalcTree – Wind ASCE 7 resource | https://www.calctree.com/resources/wind-asce | ☐ |

## TIER 3 — Roundups / "best-of" listicles to get added to (outreach)
Pages that rank alongside Omni and list competitors but omit us. Pitch: "You list N free wind load
calculators; you're missing the only ASCE 7-22 one with real ZIP→windspeed + Florida HVHZ, no signup."
| Target | URL | Status |
|---|---|---|
| worktaps – "8+ Free ASCE Wind Load Calculators" | https://www.worktaps.com/asce-wind-load-calculator/ | ☐ |
| simulations4all – wind load calculator | https://simulations4all.com/simulations/wind-load-calculator | ☐ |
| steelcalculator.app – wind load | https://steelcalculator.app/tools/wind-load/ | ☐ |
| littlepeng – ASCE 7 wind load blog | https://www.littlepeng.com/single-post/wind-load-calculation-as-per-asce-7-16 | ☐ |

## TIER 4 — Community answers (referral + occasional links)
Answer the real question, link the free ASCE 7-22 calc as the code-correct option. Slow but this is
where Omni earns word-of-mouth.
- Eng-Tips structural forum threads ("free wind load calculator")
- Reddit r/StructuralEngineering, r/civilengineering
- FIRGELLI / CADDtools comment sections

---

## Competitive/authority context (for reference)
- Generic-physics competitors: Omni (`omnicalculator.com/physics/wind-load`), CalcTool (`calctool.org`).
- ASCE-7 software competitors (GEO fight): SkyCiv, Dlubal, MecaWind, CalcTree, BuildingsGuide,
  Simulations4All, SteelCalculator, CADDtools, Medeek.
- Our owned network: windloadcalc.com (product), windload.solutions (authority), windload.co (landing).

## Progress log
- **2026-07-19** — Doc created. Diagnosis logged. Confirmed `windload.solutions/resources` does not
  link to the free calc (the top Tier-1 miss). Beginning Tier 1 execution.
- **2026-07-19** — **Tier 1 executed & pushed live.** 6 owned-domain backlinks to the free calcs:
  - windload.solutions `resources.html` — card repointed off the retired `demo.html` redirect
    stub straight to `free-wind-load-calculator.html`, + 2 inline CTA links (C&C + MWFRS). `main` 17bc054.
  - windload.co `vs-omni.html` / `vs-buildingsguide.html` / `compare.html` — the "Try Free Demo"
    primary CTAs were pointing at the windloadcalc.com **homepage**; repointed to
    `free-wind-load-calculator.html`. `master` 8f3a7b72.
  - Side benefit: killed 4 stale/indirect links (1 redirect hop + 3 homepage-instead-of-calc).
  - **VERIFIED LIVE 2026-07-19.** windload.solutions auto-deployed on push. windload.co did NOT
    (its `daily-deploy.yml` is paused + no push→Vercel hook), so deployed manually via
    `vercel --prod` (CLI authed as gkochmann1975, project `windload-solutions/windload-co`).
    Confirmed all 6 links live. **Verify windload.co via CLEAN URLs (`/vs-omni`, not `/vs-omni.html`)**
    — `cleanUrls:true` 308-redirects the `.html` form, so a non-redirect-following curl reads a
    stub and falsely reports 0.
  - NEXT: Tier 2 directory submissions (Engineers Edge, BuildingsGuide, Jabacus). Give Tier-1 links
    a few weeks to be crawled before expecting rank movement.

## Flagged (not acted on — out of Tier-1 scope, needs Greg)
- **windload.co copy violates two locked rules.** Its schema/FAQ say "PE-**stampable** PDF reports"
  and "ASCE 7-**16** and 7-22". Per memory: software output is an **Engineering Report, never
  sealed/stampable** (`feedback_no_sealed_reports_in_software`), and positioning is **7-22 ONLY,
  never 7-16** (`feedback_asce_version_positioning`). Separate cleanup pass — flag, don't fix mid-task.
