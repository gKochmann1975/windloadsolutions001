# Calculator Readiness Matrix — Single Source of Truth

**As of 2026-06-28.** Consolidated from BOTH parallel agent sessions (now merged into one).
This is the master status for "is each calculator done, verified, viewable/testable on
admin, and sellable." It is the data source for the future admin Readiness page.

## The four gates (a calc is only "ready to sell" when all four are green)

1. **Engine verified** — pure Python engine matches ASCE 7-22 (physical book / worked example).
2. **Functional on admin** — has a Flask route + UI; you can open it and run it end-to-end.
3. **Scope complete** — all required pieces present (e.g. Solar needs snow + foundation; Signs needs foundation).
4. **Sellable** — Workstream E billing plumbing done (per-calc gate, canonical calculator_file, Stripe product) + flipped customer-live.

Legend: ✅ done · ⚠️ partial/caveat · 🚫 not done

---

## A. Functional on admin TODAY (13 calculators)

| # | Calculator | ①Verified | ②On admin | ③Scope | ④Sellable | Notes |
|---|---|:--:|:--:|:--:|:--:|---|
| 1 | Windows / Doors / Shutters | ✅ | ✅ | ✅ | ✅ **LIVE** | only customer-facing calc today |
| 2 | MWFRS Directional | ✅ | ✅ | ✅ | 🚫 | admin-only; validated end-to-end |
| 3 | C&C Roof — Flat | ✅ | ✅ | ✅ | 🚫 | Guide-validated (exact) |
| 4 | C&C Roof — Gable | ✅ | ✅ | ✅ | 🚫 | Guide-validated (exact) |
| 5 | C&C Roof — Hip | ✅ | ✅ | ✅ | 🚫 | Guide-validated (2G Z2 A 50→100 fix) |
| 6 | C&C Roof — Monoslope | ✅ | ✅ | ✅ | 🚫 | Guide-validated (exact) |
| 7 | C&C Roof — Multispan | ✅ | ✅ | ✅ | 🚫 | figure+WE verified (no Guide example) |
| 8 | C&C Roof — Sawtooth | ✅ | ✅ | ✅ | 🚫 | figure+WE verified (no Guide example) |
| 9 | Signs & Billboards (solid) | ✅ | ✅ | ⚠️ | 🚫 | Cf verified; **needs IBC 1807.3 foundation** for deliverable |
| 10 | Rooftop Equipment | ✅ | ✅ | ✅ | 🚫 | Fv uplift bug FIXED (GCr 1.5, Eq 29.4-3) |
| 11 | Chimneys & Tanks | ✅ | ✅ | ✅ | 🚫 | Cf book-verified (WE-10) |
| 12 | Solar Rooftop | ✅ | ✅ | ⚠️ | 🚫 | §29.4 verified + snow wired; balanced snow only (drift/sliding/rain excluded); §29.4.3 two-load-case note pending |
| 13 | Solar Ground-Mount | ⚠️ | ✅ | ⚠️ | 🚫 | figure-verified + regression-tested (WE-15/WE-22); no independent published worked example exists (§29.4.5 is new in 7-22). Needs snow + foundation. **UI gap below.** |
| 14 | MWFRS Envelope | ✅ | ✅ | ✅ | 🚫 | wired 2026-06-28 (`/mwfrs/envelope`); Ch 28 Fig 28.3-1/2, all 4 load cases |
| 15 | Open Signs & Frames | ✅ | ✅ | ✅ | 🚫 | wired 2026-06-28 (`/structures/open-signs`); §29.4 Fig 29.4-2 (ε≤0.7) |
| 16 | Freestanding Walls | ✅ | ✅ | ✅ | 🚫 | wired 2026-06-28 (`/structures/walls`); §29.3 Fig 29.3-1, 3 load cases |
| 17 | Trussed Towers | ✅ | ✅ | ✅ | 🚫 | wired 2026-06-28 (`/structures/towers`); §29.4 Fig 29.4-3 |

## B. Engine VERIFIED but NOT on admin — just needs a route + UI (1)

| # | Calculator | ①Verified | ②On admin | Notes |
|---|---|:--:|:--:|---|
| 18 | Dome / Arched Roof | ✅ | 🚫 | engine fixed+verified this session (Fig 30.3-7 / 30.3-8); **unwired — next to wire** |

*(MWFRS Envelope, Open Signs, Freestanding Walls, Trussed Towers — wired 2026-06-28, now in section A.)*

## C. Engine-only, verification PENDING (3)

| # | Calculator | Notes |
|---|---|---|
| 19 | Attached Canopy (`asce7_22_cc_canopy.py`) | engine-only; not in WE suite — verify before wiring |
| 20 | Free Roof C&C (`asce7_22_cc_free_roof.py`) | engine-only; not in WE suite |
| 21 | Parapet C&C (`asce7_22_cc_parapet.py`) | engine-only; not in WE suite |

---

## Engine-math status: essentially COMPLETE
- Validation suite `webapp/testing/validate_asce7_22.py`: **22 WE tests, 360 assertions, all pass.** Next free = WE-23.
- All wired calcs verified against the physical book / ASCE Guide. Two real conformance bugs
  found and fixed this session (Rooftop Equipment Fv, Dome vs Arched figures) — both regression-locked.

### ⚠️ Ground-solar Zone-2 override NOT reachable from UI (potential unconservative — BLOCKS ground solar)
- §29.4.5.1 forces Zone 2 when **Lc/S < 0.25** OR **Kzt > 1.0** (WE-21). The engine implements both,
  but the ground-solar UI **does not collect `row_spacing_S`**, so the Lc/S branch can never fire —
  only the Kzt branch does. Closely-spaced ground rows (0.20 ≤ Lc/S < 0.25) would receive Zone-1
  (lower) pressure when the code mandates Zone-2 (higher) → **under-design**. Must add an `S` input
  (and thread it to the engine) before ground solar is shipped/sold. Source: other-session hand-off 2026-06-28.

### Open engineering items (none block the verified+wired core)
- **Load Combinations (Ch 2)** — arithmetic locked (WE-19); factor lists still want one physical-book
  read (`asce7_22_load_combinations.py:22` `PENDING_BOOK_CONFIRM=True`, p.7-10). Hygiene, non-blocking.
- **Ground snow pg** — by design, manual entry via embedded ASCE Hazard Tool (required input);
  `ground_snow_finder.py` scaffold ready if a ZIP dataset is added later.
- **Snow scope** — balanced snow only; drift §7.7 / sliding §7.9 / rain-on-snow §7.10 excluded (documented in report).
- **§29.4.3 two-load-case note** (panels present / removed) — 1 line to add to solar report applicability.
- **Kz Exposure-B z_min** — engine uses conservative floor (0.70); study-only, no safety risk.
- **Signs/walls Note 3** (double-faced reduction) — left off = conservative; opt-in pending.

---

## Sellability (Workstream E) — MY lane; mostly NOT done
- Only **Windows/Doors** is customer-sellable today. Everything else is admin-only.
- **B1** per-calc permission gate — not wired. **B2** canonical calculator_file — stale. **B3** Stripe↔DB taxonomy — broken.
- **B4** webhook idempotency — DONE on `backend/fix/webhook-idempotency-b4` (pushed), **not yet test-replayed or merged to main, not deployed.**
- Stripe products: W/D + BIP live; MWFRS created-not-live; all others not created.

---

## Lane coordination (single session going forward)
- **WE-test numbering:** WE-16 = Dome/Arched (this session). Ground-Solar-Dynamic renumbered WE-16→**WE-22**. Snow=WE-18, Combos=WE-19, pg=WE-20, Zone-2 overrides=WE-21.
- **Shared file:** `webapp/testing/validate_asce7_22.py` — both sessions appended near the `RESULT:` tail. Currently clean.
- Other agent owned: snow, load-combos, solar engines/report/UI, §29.4 verification, signs/walls reductions.
- This session owned: equipment Fv fix, dome/arched split, IBC foundation reference, commerce/Workstream E, admin Readiness page.

## Wiring pattern (established by the solar work — reuse for the unwired engines)
A calc is wired additively, mirroring `signs.html`, with **zero impact on other calcs**:
static `config` object (incl. opt-in `config.snow`, `config.reportEndpoint`, `config.reportMount`)
+ a `/api/calc/<name>` endpoint that calls the engine + an admin Flask route + a `*.html` UI page
+ a `shell.js` nav entry. The snow inputs + Hazard-Tool iframe modal live in `calc-workflow.js`
(gated on `config.snow`, with an "open in new tab" fallback for X-Frame-Options blocks).

## Recommended next actions (other-session order, adopted)
1. ✅ **DONE 2026-06-28** — wired Trussed Towers, Open Signs, Freestanding Walls, MWFRS Envelope
   (endpoint + admin route + UI + nav, mirroring signs.html). Commit `d72fb70`. 17 calcs now on admin.
2. **Wire Dome/Arched** (last unwired engine; this session's fix) — same pattern.
3. **Ground-solar `row_spacing_S` input** so the Lc/S Zone-2 override is reachable (see ⚠️ above).
4. **Admin Readiness page** rendering this matrix with a Test link per calc.
5. **Workstream E** to make verified+wired calcs sellable (start MWFRS — no scope gaps).
6. Hygiene: §29.4.3 two-load-case report note; load-combos p.7-10 book confirm;
   `solar_report.py:2` stale "scaffold" docstring; signs/walls Note-3 reductions (unblocks signs-foundation).
