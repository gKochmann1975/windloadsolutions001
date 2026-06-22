"""
Open Signs / Single-Plane Open Frames engine verification harness — ASCE 7-22.

Engine: webapp/asce7_22_other_open_signs.py (ASCE7_OpenSignsCalculator)
Chapter 29, Section 29.4, Figure 29.4-2.

Every expected value comes from the VERIFIED-VALUES LEDGER (ASCE ledger Rule 4),
never from the engine's own output:
  reference_asce_7_22_verified_values.md

Checks:
  1. Ke (Table 26.9-1) — conservative <=1000 + Eq 26.9-1 above, w/ -2.0e-4 regression guard
  2. Kz (Table 26.10-1) — all 66 cells (B/C/D x 22 heights) + z_min clamps
  3. Terrain constants (Table 26.11-1) — alpha/zg/zmin for B/C/D
  4. Kd (Table 26.6-1) — open signs = 0.85
  5. qz convention — Kd folded in exactly once
  6. Cf (Fig 29.4-2) — 9 cells across epsilon bands x member regimes + band edges
  7. No GCpi method (Chapter 29 force-coefficient engine)

Run from repo root:
    C:/Python312/python.exe tests/test_engine_open_signs.py

Exit code 0 = all pass, 1 = at least one failure.
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

import asce7_22_other_open_signs as mod

PASS = "PASS"
FAIL = "FAIL"
results = []


def check(name, got, expected, tol):
    ok = abs(got - expected) <= tol
    results.append(ok)
    status = PASS if ok else FAIL
    print(f"  [{status}] {name}: got {got:.4f}, expected {expected:.4f} (tol {tol})")
    return ok


def check_bool(name, condition):
    results.append(bool(condition))
    status = PASS if condition else FAIL
    print(f"  [{status}] {name}")
    return bool(condition)


calc = mod.ASCE7_OpenSignsCalculator()

# ---------------------------------------------------------------------------
# TEST 1 — Ground Elevation Factor Ke vs ASCE 7-22 Table 26.9-1
# Engine policy: Ke = 1.0 for ze <= 1000 ft (conservative); above, Eq 26.9-1.
# Ledger Table 26.9-1: 0->1.00, 2000->0.93, 3000->0.90, 4000->0.86,
#                      5000->0.83, 6000->0.80.
# ---------------------------------------------------------------------------
print("\nTEST 1 — Ke vs Table 26.9-1 (Eq. 26.9-1: Ke = exp(-0.0000362*ze))")
for z, expected in [(0, 1.00), (500, 1.00), (1000, 1.00)]:
    check(f"Ke(z={z}) conservative", calc.calculate_ke(z), expected, 0.001)
for z, book in [(2000, 0.93), (3000, 0.90), (4000, 0.86), (5000, 0.83), (6000, 0.80)]:
    check(f"Ke(z={z}) formula", calc.calculate_ke(z), book, 0.01)
# Regression guard: old -2.0e-4 coefficient gave ~0.67 at 2000 ft.
check_bool("Ke(2000) NOT ~0.67 (old -2.0e-4 bug absent)",
           abs(calc.calculate_ke(2000) - 0.67) >= 0.02)

# ---------------------------------------------------------------------------
# TEST 2 — Kz vs ASCE 7-22 Table 26.10-1 (66 cells: B/C/D x 22 heights)
# ---------------------------------------------------------------------------
print("\nTEST 2 — Kz vs Table 26.10-1 (66 cells)")
# height -> (B, C, D) from the ledger. 15 ft tested as the 0-15 anchor.
kz_table = {
    15:  (0.57, 0.85, 1.03),
    20:  (0.62, 0.90, 1.08),
    25:  (0.66, 0.94, 1.12),
    30:  (0.70, 0.98, 1.16),
    40:  (0.74, 1.04, 1.22),
    50:  (0.79, 1.09, 1.27),
    60:  (0.83, 1.13, 1.31),
    70:  (0.86, 1.17, 1.34),
    80:  (0.90, 1.21, 1.38),
    90:  (0.92, 1.24, 1.40),
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
for h in sorted(kz_table):
    b, c, d = kz_table[h]
    # Exposure B has a z_min=30 clamp -> below 30 it returns 0.70, but at h>=30
    # the table cell should match. For h<30 (only h=15,20,25 here) B is clamped.
    if h < 30:
        check(f"Kz B h={h} (z_min clamp -> 0.70)", calc.calculate_kz(h, 'B'), 0.70, 0.001)
    else:
        check(f"Kz B h={h}", calc.calculate_kz(h, 'B'), b, 0.001)
    check(f"Kz C h={h}", calc.calculate_kz(h, 'C'), c, 0.001)
    check(f"Kz D h={h}", calc.calculate_kz(h, 'D'), d, 0.001)

# z_min clamps (Section 26.10.2)
print("  -- z_min clamps --")
check("Kz B h=10 (<30 -> 0.70)", calc.calculate_kz(10, 'B'), 0.70, 0.001)
check("Kz C h=10 (<15 -> 0.85)", calc.calculate_kz(10, 'C'), 0.85, 0.001)
check("Kz D h=5 (<7 -> 1.03)", calc.calculate_kz(5, 'D'), 1.03, 0.001)

# ---------------------------------------------------------------------------
# TEST 3 — Terrain constants vs Table 26.11-1
# ---------------------------------------------------------------------------
print("\nTEST 3 — Terrain constants vs Table 26.11-1")
terr_expected = {
    'B': {'alpha': 7.5,  'zg': 3280, 'zmin': 30},
    'C': {'alpha': 9.8,  'zg': 2460, 'zmin': 15},
    'D': {'alpha': 11.5, 'zg': 1935, 'zmin': 7},
}
for exp, vals in terr_expected.items():
    t = calc.get_terrain_constants(exp)
    check(f"alpha {exp}", t['alpha'], vals['alpha'], 0.001)
    check(f"zg {exp}", t['zg'], vals['zg'], 0.001)
    check(f"zmin {exp}", t['zmin'], vals['zmin'], 0.001)

# ---------------------------------------------------------------------------
# TEST 4 — Kd vs Table 26.6-1 (open signs & single-plane open frames = 0.85)
# ---------------------------------------------------------------------------
print("\nTEST 4 — Kd vs Table 26.6-1 (open signs = 0.85)")
check("Kd open signs", calc.Kd, 0.85, 0.001)

# ---------------------------------------------------------------------------
# TEST 5 — qz convention: Kd folded into qz exactly once.
# Eq 26.10-1 form used by engine: qz = 0.00256*Kz*Kzt*Kd*Ke*V^2.
# Manual reference with Kd present once: V=120, Kz=0.85, Kzt=1.0, Ke=1.0.
# 0.00256*0.85*1.0*0.85*1.0*120^2 = 26.62 psf.
# ---------------------------------------------------------------------------
print("\nTEST 5 — qz folds Kd in exactly once (Eq. 26.10-1)")
qz_with_kd = 0.00256 * 0.85 * 1.0 * 0.85 * 1.0 * (120 ** 2)
qz_engine = calc.calculate_velocity_pressure(120, 0.85, 1.0, 1.0)
check("qz includes Kd once", qz_engine, qz_with_kd, 0.01)
# Guard: NOT missing Kd (would be qz/0.85 higher) and NOT doubled (qz*0.85 lower).
check_bool("qz != Kd-missing value (Kd present)",
           abs(qz_engine - qz_with_kd / 0.85) > 0.5)
check_bool("qz != Kd-doubled value (Kd not squared)",
           abs(qz_engine - qz_with_kd * 0.85) > 0.5)

# ---------------------------------------------------------------------------
# TEST 6 — Cf vs Figure 29.4-2 (9 cells + band edges)
# Ledger:
#   epsilon       Flat   Rounded(D*sqrt(qz)<=2.5)   Rounded(D*sqrt(qz)>2.5)
#   < 0.1          2.0          1.2                       0.8
#   0.1 to 0.29    1.8          1.3                       0.9
#   0.3 to 0.7     1.6          1.5                       1.1
#
# Engine maps regime via D*sqrt(qz): <=2.5 -> subcritical (higher Cf).
# To force subcritical use small D*sqrt(qz); to force supercritical use large.
# ---------------------------------------------------------------------------
print("\nTEST 6 — Cf vs Figure 29.4-2 (9 cells)")

# Representative epsilon per band: 0.05 (<0.1), 0.2 (0.1-0.29), 0.5 (0.3-0.7).
flat_cells = {0.05: 2.0, 0.2: 1.8, 0.5: 1.6}
sub_cells  = {0.05: 1.2, 0.2: 1.3, 0.5: 1.5}   # D*sqrt(qz) <= 2.5
sup_cells  = {0.05: 0.8, 0.2: 0.9, 0.5: 1.1}   # D*sqrt(qz) >  2.5

# D and qz chosen so D*sqrt(qz) lands clearly on each side of 2.5.
# subcritical: D=0.1, qz=25 -> 0.1*5 = 0.5 <= 2.5
# supercritical: D=2.0, qz=25 -> 2.0*5 = 10 > 2.5
D_sub, qz_sub = 0.1, 25.0
D_sup, qz_sup = 2.0, 25.0

for eps, exp in flat_cells.items():
    check(f"Cf flat eps={eps}", calc.get_cf(eps, 'flat'), exp, 0.001)
for eps, exp in sub_cells.items():
    check(f"Cf rounded subcrit eps={eps}",
          calc.get_cf(eps, 'rounded', D=D_sub, qz=qz_sub), exp, 0.001)
for eps, exp in sup_cells.items():
    check(f"Cf rounded supercrit eps={eps}",
          calc.get_cf(eps, 'rounded', D=D_sup, qz=qz_sup), exp, 0.001)

# Band-edge behavior (engine: <0.1 LOW; 0.1<=e<0.3 MID; 0.3<=e<=0.7 HIGH).
print("  -- band edges (flat) --")
check("Cf flat eps=0.099 (LOW band)", calc.get_cf(0.099, 'flat'), 2.0, 0.001)
check("Cf flat eps=0.10 (MID band)",  calc.get_cf(0.10, 'flat'), 1.8, 0.001)
check("Cf flat eps=0.29 (MID band)",  calc.get_cf(0.29, 'flat'), 1.8, 0.001)
check("Cf flat eps=0.30 (HIGH band)", calc.get_cf(0.30, 'flat'), 1.6, 0.001)
check("Cf flat eps=0.70 (HIGH band)", calc.get_cf(0.70, 'flat'), 1.6, 0.001)

# epsilon > 0.7 is a solid sign -> engine must reject it.
print("  -- solid-sign guard (eps > 0.7 raises) --")
try:
    calc.get_cf(0.8, 'flat')
    check_bool("eps=0.8 raises (solid sign rejected)", False)
except ValueError:
    check_bool("eps=0.8 raises (solid sign rejected)", True)

# regime threshold itself (D*sqrt(qz) == 2.5 -> subcritical per engine '<=')
print("  -- round regime threshold --")
check_bool("D*sqrt(qz)=2.5 -> subcritical",
           calc.determine_round_regime(0.5, 25.0) == 'subcritical')  # 0.5*5=2.5
check_bool("D*sqrt(qz)=3.0 -> supercritical",
           calc.determine_round_regime(0.6, 25.0) == 'supercritical')  # 0.6*5=3.0

# ---------------------------------------------------------------------------
# TEST 7 — No GCpi (Chapter 29 force-coefficient engine has no internal pressure)
# ---------------------------------------------------------------------------
print("\nTEST 7 — No GCpi method (force-coefficient engine)")
check_bool("engine has no GCpi method", not hasattr(calc, 'calculate_gcpi'))
check_bool("engine has no get_gcpi method", not hasattr(calc, 'get_gcpi'))

# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
n_pass = sum(results)
n_total = len(results)
if all(results):
    print(f"ALL {n_total} CHECKS PASSED")
    sys.exit(0)
else:
    print(f"{n_pass}/{n_total} passed -- {n_total - n_pass} FAILED")
    sys.exit(1)
