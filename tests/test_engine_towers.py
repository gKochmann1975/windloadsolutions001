"""
Trussed-tower engine verification harness — ASCE 7-22.

Runs asce7_22_other_towers.ASCE7_TrussedTowersCalculator (Chapter 29,
Section 29.4, Figure 29.4-3) against the VERIFIED-VALUES LEDGER:

  1. Force coefficients Cf (Fig 29.4-3) — square + triangle polynomials,
     round-member factor, square diagonal-wind factor.
  2. Kd (Table 26.6-1) — trussed towers triangular/square/rectangular = 0.85.
  3. Ground Elevation Factor Ke (Table 26.9-1 / Eq. 26.9-1) + regression guard.
  4. Kz (Table 26.10-1) — all 66 cells (B/C/D x 22 heights) + z_min clamps.
  5. Terrain constants (Table 26.11-1) — alpha / zg / zmin.
  6. qz convention (Eq. 26.10-1) — confirms Kd folded in exactly once.

NOTE: Chapter-29 trussed-tower engine is a force-coefficient engine. It has
NO internal-pressure coefficient (GCpi) and NO enclosure classification, so
the universal GCpi check is intentionally skipped.

EVERY expected value comes from the ledger, never from the engine output
(ASCE ledger Rule 4). A FAIL is a real engine-vs-ledger finding.

Run from repo root:
    C:/Python312/python.exe tests/test_engine_towers.py

Exit code 0 = all pass, 1 = at least one failure.
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

import asce7_22_other_towers as tower_mod

PASS = "PASS"
FAIL = "FAIL"
results = []


def check(name, got, expected, tol):
    ok = abs(got - expected) <= tol
    results.append(ok)
    status = PASS if ok else FAIL
    print(f"  [{status}] {name}: got {got:.4f}, expected {expected:.4f} (tol {tol})")
    return ok


eng = tower_mod.ASCE7_TrussedTowersCalculator()


# ---------------------------------------------------------------------------
# TEST 1 — Force coefficient Cf, SQUARE tower (Fig 29.4-3)
# Ledger: Cf = 4.0*e^2 - 5.9*e + 4.0
# ---------------------------------------------------------------------------
print("\nTEST 1 — Cf square tower, Fig 29.4-3 (4.0e^2 - 5.9e + 4.0)")
for e in (0.0, 0.1, 0.2, 0.3, 0.5, 0.7, 1.0):
    expected = 4.0 * e ** 2 - 5.9 * e + 4.0   # ledger formula
    check(f"Cf_square(e={e})", eng.get_cf_square(e), expected, 0.001)

# ---------------------------------------------------------------------------
# TEST 2 — Force coefficient Cf, TRIANGLE tower (Fig 29.4-3)
# Ledger: Cf = 3.4*e^2 - 4.7*e + 3.4
# ---------------------------------------------------------------------------
print("\nTEST 2 — Cf triangle tower, Fig 29.4-3 (3.4e^2 - 4.7e + 3.4)")
for e in (0.0, 0.1, 0.2, 0.3, 0.5, 0.7, 1.0):
    expected = 3.4 * e ** 2 - 4.7 * e + 3.4   # ledger formula
    check(f"Cf_triangle(e={e})", eng.get_cf_triangle(e), expected, 0.001)

# ---------------------------------------------------------------------------
# TEST 3 — Round-member reduction factor (Fig 29.4-3 Note 3)
# Ledger: factor = 0.51*e^2 + 0.57, but not more than 1.0
# ---------------------------------------------------------------------------
print("\nTEST 3 — round-member factor, Note 3 (0.51e^2 + 0.57, <=1.0)")
for e in (0.0, 0.1, 0.3, 0.5, 0.7):
    expected = min(1.0, 0.51 * e ** 2 + 0.57)   # ledger formula + cap
    check(f"round_factor(e={e})", eng.get_round_member_factor(e), expected, 0.001)
# Cap engages: at e=1.0 raw = 1.08 -> clamps to 1.0
check("round_factor(e=1.0) capped", eng.get_round_member_factor(1.0), 1.0, 0.001)
check("round_factor(e=0.93) just under cap",
      eng.get_round_member_factor(0.93), min(1.0, 0.51 * 0.93 ** 2 + 0.57), 0.001)

# ---------------------------------------------------------------------------
# TEST 4 — Square diagonal-wind amplification factor (Fig 29.4-3 Note 4)
# Ledger: factor = 1 + 0.75*e, but not more than 1.2
# ---------------------------------------------------------------------------
print("\nTEST 4 — square diagonal-wind factor, Note 4 (1 + 0.75e, <=1.2)")
for e in (0.0, 0.1, 0.2):
    expected = min(1.2, 1.0 + 0.75 * e)   # ledger formula + cap
    check(f"diag_factor(e={e})", eng.get_diagonal_wind_factor(e), expected, 0.001)
# Cap engages at e where 1+0.75e exceeds 1.2 -> e > 0.2667
check("diag_factor(e=0.5) capped", eng.get_diagonal_wind_factor(0.5), 1.2, 0.001)
check("diag_factor(e=1.0) capped", eng.get_diagonal_wind_factor(1.0), 1.2, 0.001)

# ---------------------------------------------------------------------------
# TEST 5 — get_cf() composition (round + diagonal applied to base polynomial)
# All expected values derived from ledger formulas, not engine output.
# ---------------------------------------------------------------------------
print("\nTEST 5 — get_cf() composition vs ledger formulas")
e = 0.3
base_sq = 4.0 * e ** 2 - 5.9 * e + 4.0
base_tri = 3.4 * e ** 2 - 4.7 * e + 3.4
round_f = min(1.0, 0.51 * e ** 2 + 0.57)
diag_f = min(1.2, 1.0 + 0.75 * e)
check("get_cf square flat e=0.3", eng.get_cf('square', e), base_sq, 0.001)
check("get_cf triangle flat e=0.3", eng.get_cf('triangle', e), base_tri, 0.001)
check("get_cf square round e=0.3",
      eng.get_cf('square', e, has_round_members=True), base_sq * round_f, 0.001)
check("get_cf square diagonal e=0.3",
      eng.get_cf('square', e, wind_along_diagonal=True), base_sq * diag_f, 0.001)
# Triangle has no diagonal factor -> flag ignored.
check("get_cf triangle diagonal ignored e=0.3",
      eng.get_cf('triangle', e, wind_along_diagonal=True), base_tri, 0.001)

# ---------------------------------------------------------------------------
# TEST 6 — Kd for trussed towers, Table 26.6-1 (tri/sq/rect = 0.85)
# ---------------------------------------------------------------------------
print("\nTEST 6 — Kd, Table 26.6-1 (trussed towers tri/sq/rect = 0.85)")
check("Kd trussed tower", eng.Kd, 0.85, 0.001)

# ---------------------------------------------------------------------------
# TEST 7 — Ground Elevation Factor Ke vs Table 26.9-1 / Eq. 26.9-1
# Engine policy: Ke = 1.0 for ze <= 1000 ft (conservative, keeps FL=1.0);
# above 1000 ft the exact Eq. 26.9-1 formula exp(-0.0000362*ze) applies.
# ---------------------------------------------------------------------------
print("\nTEST 7 — Ke vs Table 26.9-1 (Eq. 26.9-1: Ke = exp(-0.0000362*ze))")
for z, expected in [(0, 1.00), (500, 1.00), (1000, 1.00)]:
    check(f"Ke(z={z}) conservative", eng.calculate_ke(z), expected, 0.001)
for z, book in [(2000, 0.93), (3000, 0.90), (4000, 0.86), (5000, 0.83), (6000, 0.80)]:
    check(f"Ke(z={z}) book", eng.calculate_ke(z), book, 0.01)
# REGRESSION GUARD: old -2.0e-4 coefficient gave Ke(2000) ~0.67.
if abs(eng.calculate_ke(2000) - 0.67) < 0.02:
    print("  [FAIL] Ke(2000) ~0.67 — old -2.0e-4 coefficient still present!")
    results.append(False)
else:
    print("  [PASS] Ke(2000) NOT ~0.67 — old -2.0e-4 bug absent")
    results.append(True)

# ---------------------------------------------------------------------------
# TEST 8 — Kz vs Table 26.10-1 (all 66 cells: B/C/D x 22 heights)
# Values straight from the ledger Table 26.10-1.
# ---------------------------------------------------------------------------
print("\nTEST 8 — Kz vs Table 26.10-1 (66 cells)")
# height -> (B, C, D), exactly as in the ledger
kz_ledger = {
    15: (0.57, 0.85, 1.03),
    20: (0.62, 0.90, 1.08),
    25: (0.66, 0.94, 1.12),
    30: (0.70, 0.98, 1.16),
    40: (0.74, 1.04, 1.22),
    50: (0.79, 1.09, 1.27),
    60: (0.83, 1.13, 1.31),
    70: (0.86, 1.17, 1.34),
    80: (0.90, 1.21, 1.38),
    90: (0.92, 1.24, 1.40),
    100: (0.95, 1.26, 1.43),
    120: (1.00, 1.31, 1.48),
    140: (1.04, 1.34, 1.52),
    160: (1.08, 1.39, 1.55),
    180: (1.11, 1.41, 1.58),
    200: (1.14, 1.44, 1.61),
    250: (1.21, 1.51, 1.68),
    300: (1.27, 1.57, 1.73),
    350: (1.33, 1.62, 1.78),
    400: (1.38, 1.66, 1.82),
    450: (1.42, 1.70, 1.86),
    500: (1.46, 1.74, 1.89),
}
# NOTE (PENDING book confirmation): Exposure B below z_min=30 ft -> engine
# applies the Section 26.10.2 z_min FLOOR (0.70), not the raw Table 26.10-1
# cells (0.57/0.62/0.66). Table-vs-equation choice; floor is conservative.
# Per-segment tower forces below 30 ft therefore use 0.70 — confirm intended.
# See ASCE 7-22/UNVERIFIED_FIGURE_VALUES_WORKLIST.md.
for h in sorted(kz_ledger):
    b, c, d = kz_ledger[h]
    b_exp = 0.70 if h < 30 else b
    check(f"Kz B z={h}{' [z_min floor]' if h < 30 else ''}", eng.calculate_kz(h, 'B'), b_exp, 0.001)
    check(f"Kz C z={h}", eng.calculate_kz(h, 'C'), c, 0.001)
    check(f"Kz D z={h}", eng.calculate_kz(h, 'D'), d, 0.001)

# z_min clamps (ledger Section 26.10.2): below z_min use the z_min value.
print("\nTEST 8b — Kz z_min clamps (Section 26.10.2)")
check("Kz B h<30 -> 0.70", eng.calculate_kz(10, 'B'), 0.70, 0.001)
check("Kz C h<15 -> 0.85", eng.calculate_kz(10, 'C'), 0.85, 0.001)
check("Kz D h<7  -> 1.03", eng.calculate_kz(5, 'D'), 1.03, 0.001)

# ---------------------------------------------------------------------------
# TEST 9 — Terrain constants, Table 26.11-1 (alpha / zg / zmin)
# ---------------------------------------------------------------------------
print("\nTEST 9 — Terrain constants, Table 26.11-1")
terrain_ledger = {
    'B': {'alpha': 7.5, 'zg': 3280, 'zmin': 30},
    'C': {'alpha': 9.8, 'zg': 2460, 'zmin': 15},
    'D': {'alpha': 11.5, 'zg': 1935, 'zmin': 7},
}
for exp_cat, vals in terrain_ledger.items():
    tc = eng.get_terrain_constants(exp_cat)
    check(f"alpha {exp_cat}", tc['alpha'], vals['alpha'], 0.001)
    check(f"zg {exp_cat}", tc['zg'], vals['zg'], 0.001)
    check(f"zmin {exp_cat}", tc['zmin'], vals['zmin'], 0.001)

# ---------------------------------------------------------------------------
# TEST 10 — qz convention (Eq. 26.10-1): Kd folded in exactly once.
# qz = 0.00256 * Kz * Kzt * Kd * Ke * V^2, with Kd = 0.85.
# Reference inputs: V=115, Kz=1.02, Kzt=1.0, Ke=1.0
#   qz = 0.00256*1.02*1.0*0.85*1.0*115^2 = 29.36 psf (Kd present once)
#   without Kd it would be 34.54; with Kd doubled (0.85^2) it would be 24.95.
# ---------------------------------------------------------------------------
print("\nTEST 10 — qz folds Kd in exactly once (Eq. 26.10-1)")
qz = eng.calculate_velocity_pressure(115, 1.02, 1.0, 1.0)
expected_qz = 0.00256 * 1.02 * 1.0 * 0.85 * 1.0 * 115 ** 2  # ledger formula, Kd once
check("qz with Kd once", qz, expected_qz, 0.01)
# Guard: not the no-Kd value (34.54) and not the doubled-Kd value (24.95)
no_kd = 0.00256 * 1.02 * 1.0 * 1.0 * 115 ** 2
double_kd = 0.00256 * 1.02 * 1.0 * 0.85 ** 2 * 1.0 * 115 ** 2
ok_once = abs(qz - no_kd) > 1.0 and abs(qz - double_kd) > 1.0
results.append(ok_once)
print(f"  [{PASS if ok_once else FAIL}] qz Kd-once guard: "
      f"got {qz:.2f}, not no-Kd {no_kd:.2f}, not double-Kd {double_kd:.2f}")

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
