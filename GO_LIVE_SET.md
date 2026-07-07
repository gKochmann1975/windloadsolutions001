# Go-Live Set — what we sell, and in what order

*Decision doc, 2026-06-29. "Ready to go live" = a COMPLETE, validated deliverable a paying
engineer can stake a permit on — not merely "it runs in admin." Pairs with
`CALCULATOR_READINESS_MATRIX.md` (status) and `ROADMAP_CALCULATOR_RELEASE_AND_TESTING.md`
(per-program release checklist). Selling happens per **program**, not per individual calc.*

> **Gate for "go-live":** ① engine validated (Guide worked example OR solid book-figure
> verification), ② scope-complete (no missing foundation/snow piece the deliverable needs),
> ③ billing wired (Workstream E). A program ships only when EVERY calc in it clears ①+②, and
> ③ is done. Today only **Windows/Doors** is live.

---

## ✅ Wave 1 — MWFRS (the first second-product to sell)
**Calcs:** MWFRS **Directional** (Ch 27) + **Envelope** (Ch 28).
- ① Both **Guide-validated** end-to-end (Directional Ch 27 E-Book; Envelope Guide Ex 4.1) — 30/30 published answers at report level.
- ② **No scope gaps** — pure wind pressures, no foundation/snow dependency.
- ③ Stripe tier products **already created** (Starter/Pro/Premium — `reference_stripe_mwfrs_products`), catalog-only.
- **Why first:** cleanest possible second product — fully validated, zero scope gaps, Stripe catalog already exists. We **prove the entire commerce pipeline here** (gate → buy → webhook → unlock → run → report) before building anything fancier.

## 🟡 Wave 2 — C&C Roofs
**Calcs:** Flat, Gable, Hip, Monoslope (✅ Guide-validated: Ex 6.1/6.2/6.3/6.5) + Sawtooth, Multispan.
- **Decision needed:** Sawtooth + Multispan are **book-figure verified (WE-7/WE-8)** but have **no published worked example** (the Guide has none). Two options:
  - **(a) ship all 6** — book-figure verification is the same standard we hold elsewhere; the "no example" is a Guide gap, not a quality gap. *(Recommended — keeps the "Roofs" program whole.)*
  - **(b) hold Sawtooth + Multispan** until an independent example surfaces; ship the 4 validated shapes only.
- ② No scope gaps. ③ Needs Stripe "Roofs" product + the same billing wiring as MWFRS.

## ⏸ Hold — not in the first go-live
| Program / calc | Why held |
|---|---|
| **Signs (solid)** | ❌ **no foundation module** — the wind force isn't a complete permit deliverable without IBC §1807.3 post embedment. Build the foundation first. |
| **Solar — Rooftop** | Close (Ex 5.3 validated, snow wired), but `/api/report/solar` runs the tilted method while the validated case is parallel; §29.4.3 two-load-case note pending. **Wave 3 candidate** once those close. |
| **Solar — Ground-mount** | ❌ not ready: unconservative `row_spacing_S` gap + needs snow + footings. |
| **Other Structures** (Chimneys, Trussed Towers, Open Signs, Freestanding Walls) | Book-figure verified but **no worked example tested them**. Also: Rooftop **Equipment** IS Guide-validated (Ex 5.2) but is currently bundled in this program with the book-only calcs — so the program can't ship clean until either all are example-validated or Equipment is split out. |
| **Arched & Dome** | Dome validated (Ex 6.7); arched has no example; niche demand. Later. |

---

## The order of operations (why MWFRS first)
1. **Pick the tight set** (this doc) — Wave 1 = MWFRS only.
2. **Fix the billing foundation (Workstream E / B1–B4)** — per-calc permission gate, canonical `calculator_file`, Stripe↔DB taxonomy, deploy the B4 webhook idempotency fix. *Money-correctness layer; must precede any picker wiring.*
3. **Make MWFRS transact end-to-end** using the proven W/D checkout pattern — one clean sale.
4. **THEN** build the dynamic in-account à-la-carte picker + proration + owner seat-assignment, and flip the customer-facing nav menu (the one-time milestone when program #2 goes live).
5. **Foundations (signs/solar) + ground-solar fix = parallel tracks**, not blockers for first revenue.

**Constraint:** Workstream E touches `windload-backend` = **api.windloadcalc.com (production payments)**; GitHub is capped until **July 1**, so build/stage now, deploy carefully after.
