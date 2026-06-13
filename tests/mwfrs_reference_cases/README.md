# MWFRS Reference Test Cases — ASCE 7-22

Reference numerical cases for verifying `webapp/asce7_22_mwfrs_directional.py` and
`webapp/asce7_22_mwfrs_envelope.py` against externally-published sources.

## Discipline rule

**Every case in this folder must be explicitly traceable to ASCE 7-22 — not
7-16, not 7-10.** A 7-16 example will mislead the harness because the wind
maps changed and (more subtly) the velocity-pressure equation Kd placement
changed (see "Open question" below). If a source's edition is unclear, do
NOT add it to this folder.

## Sources catalog

| Source | URL | Edition confirmed | Procedure | Status | Completeness |
|---|---|---|---|---|---|
| **CED Engineering S02-048** — *Calculating Wind Loads Using the Envelope Procedure of ASCE 7-22* | https://www.cedengineering.com/userfiles/S02-048%20-%20Calculating%20Wind%20Loads%20on%20Buildings%20Using%20the%20Envelope%20Procedure%20of%20ASCE%207-22%20Code%20-%20US.pdf | ✅ 7-22 (title + all section refs) | Envelope (Ch 28) | ⚠️ Partial — V=115/116 inconsistency + GCpf tables image-based, didn't extract from PDF | qh ✓ / GCpf ✗ / final p partial |
| **LittlePEng** — *Wind Load Calculation as per ASCE 7-22* | https://www.littlepeng.com/single-post/wind-load-calculation-as-per-asce-7-22 | ✅ 7-22 (explicit references) | Single-surface MWFRS check | ⚠️ Single-surface, no GCpi/leeward/side | qz ✓ / p (single surface) ✓ |
| **ASCE Press — Wind Loads: Guide to the Wind Load Provisions of ASCE 7-22** (Stafford & Reinhold, 2024) | https://www.amazon.com/Wind-Loads-Guide-Provisions-Press/dp/0784416141 | ✅ 7-22 (ASCE-published companion) | Both (Ch 27 + Ch 28), **19 worked examples** | 💰 Paid book ($120–150), not yet acquired | TBD when book obtained |
| **ENERCALC ASCE 7-22 Ch 27 page** | https://enercalc.com/asce-7-22-wind-forces-chapter-27-directional-procedure/ | ✅ 7-22 confirmed | Directional (Ch 27) | ❌ Product page only, no worked numbers | unusable |
| **NCSEA Wind Engineering Committee** *Wind Problems* | https://www.ncsea.com/app/uploads/2024/02/Wind-Problems.pdf | ⚠️ **Unverified** — PDF parse failed; cover suggests tornado-loads focus | TBD | ❌ Not yet analyzed | TBD |
| **Blueprint Calcs** — *MWFRS Directional ASCE 7-22* | https://blueprint.calcs.com/t/new-feature-mwfrs-directional-procedure-asce-7-22/702 | ✅ 7-22 confirmed (in product title) | Directional (Ch 27) | ❌ Software announcement, no worked numbers | unusable |

## Quick edition-sniff rules

When evaluating a new source for inclusion:
- ✅ Must say "ASCE 7-22" explicitly (not just "ASCE 7" or "current standard")
- ✅ Should reference section numbers in 7-22 numbering (e.g., 26.10 for velocity pressure, 26.6 for Kd, 28.3 for envelope p)
- ✅ Wind speeds should match the 7-22 maps (Figure 26.5-1A through D), not the 7-16 maps
- ❌ Reject if Kd appears INSIDE the qz equation as the source's primary formulation (see open question — this MAY be the 7-16 form, depending on resolution)

## ✅ RESOLVED — Kd placement in qz vs p (verified 2026-06-13, corrected)

**Triangulated from ASCE 7-22 pages 277 and 294:**

> Page 277 Eq. 26.10-1: `q_z = 0.00256 · K_z · K_zt · K_e · V²`  (Kd NOT here)
>
> Page 294 Eq. 28.3-1: `p = q_h · K_d · [(GC_pf) − (GC_pi)]`  (Kd HERE)

**K_d was moved from qz to p in ASCE 7-22** vs. ASCE 7-16. The engine HAS
this bug:
- `webapp/asce7_22_mwfrs_envelope.py:272` — Kd inside qz formula (WRONG for 7-22)
- `webapp/asce7_22_mwfrs_envelope.py:481` — Kd missing from p formula (WRONG)
- `webapp/asce7_22_mwfrs_directional.py:288` — same Kd-in-qz error
- `calculate_mwfrs_pressures` directional — same Kd-missing-from-p error

**Net mathematical effect:** Final p is correct (Kd is commutative). But every
reported intermediate qh / qz is 15% too high (= 1/0.85) vs. what a PE
hand-checking against Eq. 26.10-1 will compute. **Engine fix needed.**

**Implications for the CED reference case:**
- CED's `qh = 34.6 psf` IS the correct ASCE 7-22 value (CED got it right).
- Engine currently reports qh = 29.4 psf for these inputs (WRONG — has Kd applied).
- After the engine fix, engine qh = 34.6 psf (matching CED).
- Final p (20.6 psf) matches in both cases.

The investigation that produced this resolution is documented in
`feedback_verify_asce_claims_against_book_first.md` (memory).

## Engine fixes applied 2026-06-13 (verified by harness)

Two bugs found in both MWFRS engines and FIXED:

1. **Kd placement** (Eq. 26.10-1 vs 27.3-1/28.3-1). Kd removed from qz; applied
   in the design-pressure equations. Final pressures unchanged (commutative);
   reported qh/qz corrected (was 15% / factor-1/0.85 too high).
2. **Ke coefficient** (Eq. 26.9-1). Was `exp(-2.0e-4*z)` (5.5× too large) behind
   a `<=1000 → 1.0` guard. Now `exp(-0.0000362*z)`. Matches Table 26.9-1 at
   every elevation. Florida (sea level) was unaffected; >1000 ft was unconservative.

**Harness:** `tests/test_mwfrs_reference.py` — 16 checks, all pass.
**Before/after proof:** FL final pressures byte-for-byte unchanged across 52
envelope + 18 directional pressures; reported qh corrected 59.11 → 69.54 psf
(V=170, h=25, Exp C).

### ⚠️ WIDER FINDING — Ke bug is in EVERY engine, including LIVE C&C

The `-2.0e-4` Ke coefficient is NOT unique to MWFRS. Grep of `webapp/*.py`
(2026-06-13) shows it in ALL of these — only the two MWFRS engines are fixed:

- **`asce7_22_cc_windows_doors.py:196`** — ⛔ LIVE, paying customers since 2026-04-21
- `asce7_22_cc_roofs_flat.py:172`, `_gable.py:152`, `_hip.py:136`,
  `_monoslope.py:106`, `_multispan.py:207`, `_sawtooth.py:207` — roofs (not yet live)
- `asce7_22_other_*.py` (chimneys, freestanding walls, rooftop equip, signs,
  solar ground, solar rooftop, towers) — not live

**Impact:** any C&C calc for a site above 1,000 ft elevation produced
UNCONSERVATIVE (too-low) pressures. Florida/sea-level customers unaffected
(Ke=1.0 via guard). Mountain-state customers (CO, NM, AZ, UT, etc.) affected.
**Needs user decision + safe-deploy (branch, incognito test) before fixing live C&C.**

### Open: GCpf table (Fig 28.3-1) needs separate verification

Harness Test 3 shows engine GCpf for surface 1 at θ=18.4° = 0.5161 vs CED's
0.52 (final p 20.44/9.87 vs CED 20.6/10.0, ~1% off). Could be engine
interpolation vs CED rounding, or an engine GCpf-table value. Verify the
envelope GCpf tables against ASCE 7-22 Fig 28.3-1 (not yet in the ledger).

## Files in this folder

- `README.md` — this file
- `ced_envelope_warehouse.json` — Envelope Ch 28 case from CED PDF
- `littlepeng_qz_single_surface.json` — partial qz check from LittlePEng

## Copyright

These files contain only the **numerical inputs and expected outputs**
(facts/math, not copyrightable) plus citations to the original source.
Original PDFs / educational text are NOT redistributed in this repo.
