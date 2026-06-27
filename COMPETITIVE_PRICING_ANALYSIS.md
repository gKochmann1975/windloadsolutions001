# Competitive Pricing Analysis — WindLoadCalc vs. the Market
*Researched 2026-06-27 (live competitor pages, sources below). Feeds the multi-calculator pricing decision.*

## Verified competitor pricing

| Competitor | Billing model | Wind editions | Solar? | Full-suite price | Notes |
|---|---|---|---|---|---|
| **MecaWind** (Meca Enterprises) | Subscription, tiered (reverts to demo on lapse) | 7-22/16/10/05 | ✅ rooftop+ground in **cheapest** tier | **Std $252/yr, Pro $405/yr, Ultimate $513/yr** (+$30 setup on monthly) | Desktop. Cheap. The budget benchmark. Sister: MecaStack $2,023–4,725/yr. No published cross-product bundle. |
| **RISACalc** | Per-seat cloud sub | **7-16/10 ONLY** (no 7-22) | — | ~$1,000/yr (headline; exact tier in-portal) | Code-currency wedge for us. |
| **SkyCiv** | All-modules bundle, per-seat | 7-10/16/22 | quote-only ("Custom Solutions") | Basic $69/mo, **Pro $109/user/mo (~$1,250/yr)**, Enterprise $5,000/yr | Wind = module inside Load Generator, not standalone. Solar gated behind sales. |
| **ClearCalcs** (calcs.com) | All-modules bundle, floating | 7-22 (Pro+) | not specified | Basic $79/mo, **Pro $119/mo ($1,190/yr)**, Ultimate $149/mo ($1,490/yr) | Wind not in Basic. |
| **ENERCALC** (SEL) | All 64 modules, one price, concurrent-seat | 7-22/16/10 | ❌ **NONE** | **$199/mo or $1,699/yr** (2 seats); +$1,150/seat/yr | No solar module = real gap. |
| **TECSI Solar** | Free web tool | **7-16 only** | ✅ (7-16) | Free | Lead-gen, capped. |
| **SteelSolver** | Free web tool | 7-22 | — | Free | Anchors bottom of market. |

> SkyCiv's exact subscription $ is JS-gated on their own site; the $69/$109/$5,000 figures are corroborated across Capterra + GetApp. SkyCiv standalone-wind and solar prices are **quote-only / unconfirmed** — do not cite a number.

## Three strategic findings

**1. The entire market BUNDLES — none sell per-calculator.** SkyCiv / ENERCALC / ClearCalcs = "one big subscription, all modules." MecaWind = tiered-but-bundled. So WindLoadCalc's **à-la-carte per-calculator model is genuinely differentiated** for single-purpose buyers who don't want to rent a whole structural library. Keep it.

**2. All-access must UNDERCUT the full-suite tier (~$1,000–1,700/yr).** Pricing "all wind" above ENERCALC's entire 64-module library is a non-starter. Target **~$129/mo / ~$1,295/yr** for WindLoad Complete — under ClearCalcs Ultimate ($1,490), SkyCiv Pro (~$1,250), ENERCALC ($1,699) — while being **ASCE 7-22 native + integrated PE sealing**, which none combine. (This corrects an earlier $241/mo model that was too high.)

**3. Solar = win on the wedge, not price.** MecaWind bundles solar into $252/yr; don't chase that (race-to-bottom kills brand/margin). But **ENERCALC has no solar module; RISACalc and TECSI's solar tool are 7-16 only.** A dedicated **ASCE 7-22 §29.4 solar calc + web + one-click sealing** is a true differentiator → price Solar as a **premium** product ($79/mo) and compete on capability.

## Margin reality (answers "don't lose money")

SaaS COGS ≈ Stripe (2.9% + $0.30) + passthrough tax + negligible hosting. **Gross margin ~97% at every price point ($39→$149/mo).** You cannot lose money on a cost basis at any competitive price. Bundling **BIP Premium (a $1,524/yr product) free** into all-access costs **~$0 marginal**. The only real risk is mispricing *vs. the market*, not cost.

| Charge | Stripe fee | Keep | Margin |
|--:|--:|--:|--:|
| $59/mo | ~$2.01 | $56.99 | 96.6% |
| $99/mo | ~$3.17 | $95.83 | 96.8% |
| $129/mo | ~$4.04 | $124.96 | 96.9% |
| $149/mo | ~$4.62 | $144.38 | 96.9% |

## Recommended structure

- **À la carte** (tier-priced): Solar **$79**, W/D / MWFRS / Roofs **$59**, Other Structures **$49**, Signs & Walls **$39** per month.
- **Count discount** on multiples, **capped ~30%** (1→0, 2→10, 3→18, 4→24, 5+→30%). Keeps the à-la-carte ramp gentle and monotonic.
- **"WindLoad Complete"** bundle: **~$129/mo / ~$1,295/yr**, **includes BIP Premium free.** Unlocks only once all 6 wind products ship (honors incremental release). Because à-la-carte reaches ~$130 at **3 calcs**, anyone needing 3+ is naturally pulled to Complete — clean upsell, no cannibalization, and the BIP freebie makes it the obvious "best value."

**The pitch:** *"Every ASCE 7-22 wind calculator + the Building Intelligence Platform, free — for less than ENERCALC's library costs, and with solar + one-click PE sealing they don't offer."*

## All-access ceiling options (pick one)

| | Monthly | Annual | vs market |
|---|--:|--:|---|
| Aggressive | $99 | ~$950 | undercuts even RISACalc; max volume |
| **Balanced (rec.)** | **$129** | **~$1,295** | just under ENERCALC/ClearCalcs; healthy |
| Premium | $149 | ~$1,425 | at/just-above ENERCALC; justified by BIP+sealing |

## Platform, device & security (verified 2026-06-27, sourced)

| Tool | Platform | Mobile / tablet | Platform age | Security (only what's published) |
|---|---|---|---|---|
| **WindLoadCalc** | **Modern browser-native web** (Flask + HTML/JS), no install | **✅ any device** (desktop/tablet/phone) | New (2025–26 web build) | TLS in transit, modern auth (httpOnly JWT, Google OAuth), continuously patched |
| MecaWind | **Desktop Windows .exe** | **❌ none — desktop only** (Mac via emulation) | Legacy desktop | None published (local app) |
| RISA-3D | **Desktop Windows** (.NET) | ❌ none | Legacy desktop | License-validation only |
| RISACalc | Web browser (Chrome/FF/Edge) | ~ browser/iPad shown; no confirmed native app | Newer (RISA's web entrant) | ISO 27001 badge on their page — **unverified**; Nemetschek-owned |
| **ENERCALC** | **Windows desktop**; "Cloud" = the *same desktop app streamed* from an AWS VM via **Nutanix Frame** (NOT a web app) | ❌ tablet runs the full desktop UI (needs 1682×933) — **not touch-usable** | **~43-yr codebase** (Lotus 1-2-3 origins; last full rewrite 2007) | TLS in transit, US-AWS storage; **self-states at-rest encryption "should not be considered secure by any modern definition"; NO SSO/SAML, NO SOC 2, NO ISO 27001** (their own questionnaire) |
| SkyCiv | Web (cloud) + **desktop Revit plugin**; heavy 3D/FEA | ~ **native app** for light tasks; full S3D wants desktop | Modern | TLS, MFA, Microsoft SSO; **SOC 2 inherited from hosting provider, not an own audit**; ISO not mentioned |
| ClearCalcs | **Fully web, form-based** | ✅ web, plausibly tablet-usable; no native app | Modern | TLS, AWS-hosted; no named SOC 2 / ISO 27001 |

**Defensible platform wedges (factual):**
1. **Modern, browser-native, works on ANY device with no install** — a clean win vs **MecaWind & RISA-3D (Windows desktop, no mobile at all)** and vs **ENERCALC (a ~40-year-old desktop app *streamed* to your browser — not touch-usable on a tablet)**.
2. The only genuine any-device peers are **ClearCalcs** (web, form-based, like us) and **SkyCiv** (but heavy 3D, steers mobile to a separate native app, and carries desktop CAD plugins). Claim *parity of access*, not necessarily a clean sweep, vs those two.
3. **Future-proofed / always-secure modern stack** — and ENERCALC *itself publishes* that its at-rest encryption "should not be considered secure by any modern definition" (their words, quotable).

**⚠️ Security-claim guardrail (do NOT overclaim):** WLC does **not** hold an audited **SOC 2 Type II / ISO 27001** certificate either, and SkyCiv advertises MFA + SSO. So **do NOT claim "most secure."** Use the approved framing: **"always secure, future-proofed for the AI age"** — a *modern, continuously-patched web platform* — and let ENERCALC's own admission + the legacy-desktop facts speak for themselves. Per the security-framing rule, never say "more secure than X." Re-verify any security wording at publish time (these pages change).

## Sources (accessed 2026-06-27)
- MecaWind: https://www.mecaenterprises.com/downloads-and-pricing/ · https://www.mecaenterprises.com/meca-software/mecawind-software-wind-load-calculator/
- ENERCALC: https://enercalc.com/pricing/ · https://enercalc.com/structural-engineering-library-sel/
- SkyCiv: https://skyciv.com/checkout/ · https://skyciv.com/industries/solar/ · Capterra/GetApp pricing tiers
- ClearCalcs: https://calcs.com/pricing
- RISACalc: https://risa.com/products/risacalc · https://risa.com/specifications/risacalc
- TECSI Solar: https://tecsisolar.com/tecsis-asce7-16-online-load-calculator/ · SteelSolver: https://www.steelsolver.com/p/wind-load-calculator.html
