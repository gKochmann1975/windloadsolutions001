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
| 13 | Solar Ground-Mount | ⚠️ | ✅ | ⚠️ | 🚫 | figure values verified, but **no worked-example confirmation**; needs snow + foundation |

## B. Engine VERIFIED but NOT on admin — just needs a route + UI (5)

| # | Calculator | ①Verified | ②On admin | Notes |
|---|---|:--:|:--:|---|
| 14 | MWFRS Envelope | ✅ | 🚫 | verified; **unwired** — most important visibility gap |
| 15 | Dome / Arched Roof | ✅ | 🚫 | engine fixed+verified this session (Fig 30.3-7 / 30.3-8); unwired |
| 16 | Open Signs & Frames | ✅ | 🚫 | Cf verified (WE-12); unwired |
| 17 | Trussed Towers | ✅ | 🚫 | Cf verified (WE-11); unwired |
| 18 | Freestanding Walls | ✅ | 🚫 | Cf verified (WE-13); unwired |

## C. Engine-only, verification PENDING (3)

| # | Calculator | Notes |
|---|---|---|
| 19 | Attached Canopy (`asce7_22_cc_canopy.py`) | engine-only; not in WE suite — verify before wiring |
| 20 | Free Roof C&C (`asce7_22_cc_free_roof.py`) | engine-only; not in WE suite |
| 21 | Parapet C&C (`asce7_22_cc_parapet.py`) | engine-only; not in WE suite |

---

## Engine-math status: essentially COMPLETE
- Validation suite `webapp/testing/validate_asce7_22.py`: **22 WE tests, 201 assertions, all pass.**
- All wired calcs verified against the physical book / ASCE Guide. Two real conformance bugs
  found and fixed this session (Rooftop Equipment Fv, Dome vs Arched figures) — both regression-locked.

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

## Recommended next actions
1. **Wire the 5 verified-but-invisible engines** (MWFRS Envelope, Dome/Arched, Open Signs, Trussed Towers, Freestanding Walls) → route + UI so they're testable on admin.
2. **Build the admin Readiness page** rendering this matrix with a Test link per calc.
3. **Workstream E** to make the verified+wired calcs sellable (start with MWFRS — no scope gaps).
4. Quick hygiene: load-combos p.7-10 book confirm; §29.4.3 two-load-case report note.
