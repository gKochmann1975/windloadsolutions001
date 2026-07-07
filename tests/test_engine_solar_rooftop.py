"""
Rooftop-solar engine verification harness — ASCE 7-22 (Chapter 29, §29.4.3/.4).

Engine under test: webapp/asce7_22_other_solar_rooftop.py
  (class ASCE7_RooftopSolarCalculator)

Figure values for Fig 29.4-7 (GCrn)nom and Fig 29.4-8 gamma_a are UNVERIFIED
pending book-read (see "ASCE 7-22/UNVERIFIED_FIGURE_VALUES_WORKLIST.md"); this
harness covers Ch26 universals + structure only. Per the ASCE verified-values
ledger Rule 4, this harness does NOT assert ANY GCp/Cf/(GCrn)nom/gamma_a
MAGNITUDE — doing so would lock in unverified numbers. It asserts only:
  * Chapter-26 universals that ARE in the verified ledger (Ke, Kz table cells,
    terrain constants, Kd, qz Kd-in-qz convention). GCpi is intentionally NOT
    tested — this is a Chapter-29 net-pressure engine with no internal-pressure
    coefficient method.
  * Structural invariants that don't pin a book magnitude: effective-area clamp
    behavior, corner >= edge >= interior monotonicity, and finiteness across the
    full theta/zone range.

Run from repo root:
    C:/Python312/python.exe tests/test_engine_solar_rooftop.py

Exit code 0 = all pass, 1 = at least one failure.
"""
import sys
import os
import math

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

import asce7_22_other_solar_rooftop as solar_mod

PASS = "PASS"
FAIL = "FAIL"
results = []


def check(name, got, expected, tol):
    ok = abs(got - expected) <= tol
    results.append(ok)
    status = PASS if ok else FAIL
    print(f"  [{status}] {name}: got {got:.4f}, expected {expected:.4f} (tol {tol})")
    return ok


def check_true(name, cond):
    ok = bool(cond)
    results.append(ok)
    status = PASS if ok else FAIL
    print(f"  [{status}] {name}: {'OK' if ok else 'CONDITION FALSE'}")
    return ok


eng = solar_mod.ASCE7_RooftopSolarCalculator()

# ---------------------------------------------------------------------------
# TEST 1 — Ground Elevation Factor Ke vs ASCE 7-22 Table 26.9-1
# Engine policy: Ke = 1.0 for ze <= 1000 ft (conservative, keeps FL unchanged);
# above 1000 ft the exact Eq. 26.9-1 formula Ke = exp(-0.0000362*ze) applies.
# Book table tol 0.01 for 2-decimal rounding.
# ---------------------------------------------------------------------------
print("\nTEST 1 — Ke vs Table 26.9-1 (Eq. 26.9-1: Ke = exp(-0.0000362*ze))")
for z, expected in [(0, 1.00), (500, 1.00), (1000, 1.00)]:
    check(f"Ke(z={z}) conservative", eng.calculate_ke(z), expected, 0.001)
for z, book in [(2000, 0.93), (3000, 0.90), (4000, 0.86), (5000, 0.83), (6000, 0.80)]:
    check(f"Ke(z={z}) formula", eng.calculate_ke(z), book, 0.01)
# Regression guard: old buggy coefficient (-2.0e-4) gave ~0.67 at 2000 ft.
ke2000 = eng.calculate_ke(2000)
check_true("Ke(2000) is NOT ~0.67 (old -2.0e-4 bug)", abs(ke2000 - 0.67) > 0.02)

# ---------------------------------------------------------------------------
# TEST 2 — Velocity pressure exposure coefficient Kz vs Table 26.10-1 (66 cells)
# ---------------------------------------------------------------------------
print("\nTEST 2 — Kz vs Table 26.10-1 (66 cells, B/C/D x 22 heights)")
kz_table = {
    'B': {15: 0.57, 20: 0.62, 25: 0.66, 30: 0.70, 40: 0.74, 50: 0.79, 60: 0.83,
          70: 0.86, 80: 0.90, 90: 0.92, 100: 0.95, 120: 1.00, 140: 1.04, 160: 1.08,
          180: 1.11, 200: 1.14, 250: 1.21, 300: 1.27, 350: 1.33, 400: 1.38, 450: 1.42, 500: 1.46},
    'C': {15: 0.85, 20: 0.90, 25: 0.94, 30: 0.98, 40: 1.04, 50: 1.09, 60: 1.13,
          70: 1.17, 80: 1.21, 90: 1.24, 100: 1.26, 120: 1.31, 140: 1.34, 160: 1.39,
          180: 1.41, 200: 1.44, 250: 1.51, 300: 1.57, 350: 1.62, 400: 1.66, 450: 1.70, 500: 1.74},
    'D': {15: 1.03, 20: 1.08, 25: 1.12, 30: 1.16, 40: 1.22, 50: 1.27, 60: 1.31,
          70: 1.34, 80: 1.38, 90: 1.40, 100: 1.43, 120: 1.48, 140: 1.52, 160: 1.55,
          180: 1.58, 200: 1.61, 250: 1.68, 300: 1.73, 350: 1.78, 400: 1.82, 450: 1.86, 500: 1.89},
}
# NOTE (PENDING book confirmation): Exposure B below z_min=30 ft -> engine
# applies the Section 26.10.2 z_min FLOOR (0.70), not the raw Table 26.10-1
# cells (0.57/0.62/0.66). Table-vs-equation choice; floor is conservative.
# See ASCE 7-22/UNVERIFIED_FIGURE_VALUES_WORKLIST.md.
for exp_cat in ('B', 'C', 'D'):
    for h, expected in kz_table[exp_cat].items():
        exp_val = 0.70 if (exp_cat == 'B' and h < 30) else expected
        check(f"Kz({exp_cat}, z={h})", eng.calculate_kz(h, exp_cat), exp_val, 0.001)

# z_min clamp (Section 26.10.2)
print("\nTEST 2b — Kz z_min clamp")
check("Kz(B, h=10 < 30) -> 0.70", eng.calculate_kz(10, 'B'), 0.70, 0.001)
check("Kz(C, h=10 < 15) -> 0.85", eng.calculate_kz(10, 'C'), 0.85, 0.001)
check("Kz(D, h=5 < 7)   -> 1.03", eng.calculate_kz(5, 'D'), 1.03, 0.001)

# ---------------------------------------------------------------------------
# TEST 3 — Terrain Exposure Constants (Table 26.11-1)
# ---------------------------------------------------------------------------
print("\nTEST 3 — Terrain constants (Table 26.11-1)")
terrain_expected = {
    'B': {'alpha': 7.5, 'zg': 3280, 'zmin': 30},
    'C': {'alpha': 9.8, 'zg': 2460, 'zmin': 15},
    'D': {'alpha': 11.5, 'zg': 1935, 'zmin': 7},
}
for exp_cat, vals in terrain_expected.items():
    tc = eng.get_terrain_constants(exp_cat)
    check(f"alpha({exp_cat})", tc['alpha'], vals['alpha'], 0.001)
    check(f"zg({exp_cat})", tc['zg'], vals['zg'], 0.001)
    check(f"zmin({exp_cat})", tc['zmin'], vals['zmin'], 0.001)

# ---------------------------------------------------------------------------
# TEST 4 — Kd for this structure type (Table 26.6-1)
# Rooftop equipment / appurtenances row = 0.85.
# ---------------------------------------------------------------------------
print("\nTEST 4 — Kd (Table 26.6-1, rooftop appurtenances = 0.85)")
check("Kd", eng.Kd, 0.85, 0.001)

# ---------------------------------------------------------------------------
# TEST 5 — qz convention: Kd folded INTO qz exactly once (0.00256*Kz*Kzt*Kd*Ke*V^2)
# ---------------------------------------------------------------------------
print("\nTEST 5 — qz folds Kd in exactly once (engine convention)")
V, Kz, Kzt, Ke = 130, 0.98, 1.0, 1.0
qh = eng.calculate_velocity_pressure(V, Kz, Kzt, Ke)
expected_with_kd = 0.00256 * Kz * Kzt * 0.85 * Ke * V ** 2
check("qh = 0.00256*Kz*Kzt*Kd*Ke*V^2 (Kd present once)", qh, expected_with_kd, 0.01)
# Confirm Kd is NOT missing (would equal the no-Kd value) and NOT doubled.
no_kd = 0.00256 * Kz * Kzt * Ke * V ** 2
check_true("qh != no-Kd value (Kd not missing)", abs(qh - no_kd) > 0.1)
double_kd = no_kd * 0.85 * 0.85
check_true("qh != double-Kd value (Kd not doubled)", abs(qh - double_kd) > 0.1)

# ---------------------------------------------------------------------------
# TEST 6 — STRUCTURAL invariants for Fig 29.4-7 (GCrn)nom — NO magnitude asserted
# ---------------------------------------------------------------------------
print("\nTEST 6 — (GCrn)nom structural invariants (NO book magnitude asserted)")

# 6a — effective-area (An) clamp behavior. Engine clamps An into [1, 5000]
# (corrected 2026-06-27: Fig 29.4-7 has an An<=1 plateau; the old [10,5000] clamp
# skipped it and under-read small panels -> unconservative). See WE-14.
for omega in (0, 4, 10, 20, 35):
    for zone in (1, 2, 3):
        below = eng.get_gcrn_nom(0.5, omega, zone)    # below An=1 min -> same as min (plateau)
        at_min = eng.get_gcrn_nom(1, omega, zone)
        above = eng.get_gcrn_nom(10000, omega, zone)  # above max -> same as max
        at_max = eng.get_gcrn_nom(5000, omega, zone)
        check(f"An clamp below-min == at-min (w={omega},z={zone})", below, at_min, 1e-9)
        check(f"An clamp above-max == at-max (w={omega},z={zone})", above, at_max, 1e-9)

# 6b — zone monotonicity: corner (3) >= edge (2) >= interior (1) magnitude,
# at fixed An and omega. (GCrn)nom returned as positive magnitude.
print("\nTEST 6b — zone monotonicity: corner >= edge >= interior")
for An in (10, 100, 1000, 5000):
    for omega in (0, 4, 10, 20, 35):
        z1 = eng.get_gcrn_nom(An, omega, 1)
        z2 = eng.get_gcrn_nom(An, omega, 2)
        z3 = eng.get_gcrn_nom(An, omega, 3)
        check_true(f"corner>=edge (An={An},w={omega}): {z3:.3f}>={z2:.3f}", z3 >= z2 - 1e-9)
        check_true(f"edge>=interior (An={An},w={omega}): {z2:.3f}>={z1:.3f}", z2 >= z1 - 1e-9)

# 6c — finiteness across the full theta/zone/An range (no crash, no NaN/inf).
print("\nTEST 6c — (GCrn)nom finite across theta/zone/An range")
all_finite = True
count = 0
for An in (5, 10, 50, 100, 500, 1000, 5000, 10000):
    for omega in (0, 1, 2, 3, 5, 8, 10, 12, 15, 20, 30, 35, 45):
        for zone in (1, 2, 3):
            try:
                v = eng.get_gcrn_nom(An, omega, zone)
            except Exception as e:  # noqa
                all_finite = False
                print(f"    crash at An={An},w={omega},z={zone}: {e}")
                break
            count += 1
            if not math.isfinite(v):
                all_finite = False
                print(f"    non-finite at An={An},w={omega},z={zone}: {v}")
check_true(f"(GCrn)nom finite for all {count} (An,omega,zone) combos", all_finite)

# ---------------------------------------------------------------------------
# TEST 7 — STRUCTURAL invariants for Fig 29.4-8 gamma_a — NO magnitude asserted
# ---------------------------------------------------------------------------
print("\nTEST 7 — gamma_a structural invariants (NO book magnitude asserted)")
for gap in ('standard', 'wide_gap'):
    below = eng.get_gamma_a(5, gap)        # below min A -> same as A=10 anchor
    at_min = eng.get_gamma_a(10, gap)
    above = eng.get_gamma_a(10000, gap)    # above max A -> same as A=5000 anchor
    at_max = eng.get_gamma_a(5000, gap)
    check(f"gamma_a clamp below-min == at-min ({gap})", below, at_min, 1e-9)
    check(f"gamma_a clamp above-max == at-max ({gap})", above, at_max, 1e-9)
    # finiteness across area range
    finite = all(math.isfinite(eng.get_gamma_a(A, gap))
                 for A in (5, 10, 50, 100, 500, 1000, 5000, 10000))
    check_true(f"gamma_a finite across area range ({gap})", finite)

# ---------------------------------------------------------------------------
# TEST 8 — Normalized wind area An is finite/positive and uses Lb floor of 15
# (structural sanity only — formula, not a book magnitude)
# ---------------------------------------------------------------------------
print("\nTEST 8 — normalized wind area An sanity")
An = eng.calculate_normalized_wind_area(effective_wind_area=20, h=15, WL=40, WS=30)
check_true("An finite and positive", math.isfinite(An) and An > 0)
# Lb is clamped to >= 15, so An <= (1000/15^2)*A = 4.444*A. With A=20 -> <= 88.9.
check_true("An respects Lb>=15 floor (An <= 4.4445*A)", An <= (1000 / 15 ** 2) * 20 + 1e-6)

# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
n_pass = sum(results)
n_total = len(results)
if all(results):
    print(f"ALL {n_total} CHECKS PASSED")
    sys.exit(0)
else:
    print(f"{n_pass}/{n_total} passed — {n_total - n_pass} FAILED")
    sys.exit(1)
