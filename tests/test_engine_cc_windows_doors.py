"""
C&C Windows/Doors engine verification harness — ASCE 7-22.

Runs asce7_22_cc_windows_doors.ASCE7_CC_WindCalculator against the VERIFIED-VALUES
LEDGER (reference_asce_7_22_verified_values.md). Every expected value below comes
from that ledger, NOT from the engine's own output (ASCE ledger Rule 4).

Coverage:
  1. Ke (Table 26.9-1 / Eq. 26.9-1) + regression guard against the old -2.0e-4 bug
  2. Kz (Table 26.10-1) — 66 cells (B/C/D x 22 heights) + z_min clamps
  3. Terrain constants (Table 26.11-1) — alpha / zg / zmin for B/C/D
  4. GCpi (Table 26.13-1)
  5. Kd (Table 26.6-1, buildings/C&C = 0.85)
  6. qz convention — Kd folded into qz exactly once
  7. Fig 30.3-1 walls (h <= 60): 6 cells (Z4 -1.1/-0.8, Z5 -1.4/-0.8, pos +1.0/+0.7)
  8. Fig 30.4-1 walls (h > 60): 6 wall cells (Z4 -1.0/-0.7, Z5 -1.8/-1.0, pos +0.9/+0.6)
  9. Effective-area clamp [10, 500] at BOTH ends (the Ian Mock bug) for both figures

Run from repo root:
    C:/Python312/python.exe tests/test_engine_cc_windows_doors.py

Exit code 0 = all pass, 1 = at least one failure.
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

import asce7_22_cc_windows_doors as cc_mod

PASS = "PASS"
FAIL = "FAIL"
results = []


def check(name, got, expected, tol):
    ok = abs(got - expected) <= tol
    results.append(ok)
    status = PASS if ok else FAIL
    print(f"  [{status}] {name}: got {got:.4f}, expected {expected:.4f} (tol {tol})")
    return ok


calc = cc_mod.ASCE7_CC_WindCalculator()

# ---------------------------------------------------------------------------
# TEST 1 — Ground Elevation Factor Ke vs ASCE 7-22 Table 26.9-1
# Engine policy: Ke = 1.0 for ze <= 1000 ft (conservative, keeps FL at 1.0);
# above 1000 ft, exact Eq. 26.9-1 = exp(-0.0000362*ze).
# ---------------------------------------------------------------------------
print("\nTEST 1 — Ke vs Table 26.9-1 (Eq. 26.9-1: Ke = exp(-0.0000362*ze))")
for z, expected in [(0, 1.00), (500, 1.00), (1000, 1.00)]:
    check(f"Ke(z={z}) conservative", calc.calculate_ke(z), expected, 0.001)
for z, book in [(2000, 0.93), (3000, 0.90), (4000, 0.86), (5000, 0.83), (6000, 0.80)]:
    check(f"Ke(z={z}) formula", calc.calculate_ke(z), book, 0.01)
# REGRESSION GUARD: old -2.0e-4 coefficient gave Ke(2000) ~0.67. Must NOT be that.
ke2000 = calc.calculate_ke(2000)
guard_ok = abs(ke2000 - 0.67) > 0.02
results.append(guard_ok)
print(f"  [{PASS if guard_ok else FAIL}] Ke(2000) NOT ~0.67 (old -2.0e-4 bug guard): "
      f"got {ke2000:.4f}")

# ---------------------------------------------------------------------------
# TEST 2 — Kz vs ASCE 7-22 Table 26.10-1 (66 cells: B/C/D x 22 heights)
# ---------------------------------------------------------------------------
print("\nTEST 2 — Kz vs Table 26.10-1 (66 cells)")
# (height, B, C, D) straight from the ledger Table 26.10-1.
kz_table = [
    (15, 0.57, 0.85, 1.03),
    (20, 0.62, 0.90, 1.08),
    (25, 0.66, 0.94, 1.12),
    (30, 0.70, 0.98, 1.16),
    (40, 0.74, 1.04, 1.22),
    (50, 0.79, 1.09, 1.27),
    (60, 0.83, 1.13, 1.31),
    (70, 0.86, 1.17, 1.34),
    (80, 0.90, 1.21, 1.38),
    (90, 0.92, 1.24, 1.40),
    (100, 0.95, 1.26, 1.43),
    (120, 1.00, 1.31, 1.48),
    (140, 1.04, 1.34, 1.52),
    (160, 1.08, 1.39, 1.55),
    (180, 1.11, 1.41, 1.58),
    (200, 1.14, 1.44, 1.61),
    (250, 1.21, 1.51, 1.68),
    (300, 1.27, 1.57, 1.73),
    (350, 1.33, 1.62, 1.78),
    (400, 1.38, 1.66, 1.82),
    (450, 1.42, 1.70, 1.86),
    (500, 1.46, 1.74, 1.89),
]
# NOTE (PENDING book confirmation): for Exposure B below z_min=30 ft the engine
# applies the Section 26.10.2 z_min FLOOR (Kz=0.70) rather than the raw Table
# 26.10-1 cells (0.57@15, 0.62@20, 0.66@25). Both are in the ledger; which one
# applies to a direct Kz(z) lookup is a table-vs-equation choice the user must
# confirm against the book footnote. The floor is conservative (safe). This
# baseline asserts the engine's current (ledger-stated) z_min-floor behavior.
# See ASCE 7-22/UNVERIFIED_FIGURE_VALUES_WORKLIST.md.
for h, b, c, d in kz_table:
    b_exp = 0.70 if h < 30 else b
    check(f"Kz(B,{h}){' [z_min floor]' if h < 30 else ''}", calc.calculate_kz(h, 'B'), b_exp, 0.001)
    check(f"Kz(C,{h})", calc.calculate_kz(h, 'C'), c, 0.001)
    check(f"Kz(D,{h})", calc.calculate_kz(h, 'D'), d, 0.001)

# z_min clamp (Section 26.10.2 per ledger): below z_min, Kz = value at z_min.
print("\nTEST 2b — Kz z_min clamp")
check("Kz(B, h<30 -> 0.70)", calc.calculate_kz(10, 'B'), 0.70, 0.001)
check("Kz(C, h<15 -> 0.85)", calc.calculate_kz(10, 'C'), 0.85, 0.001)
check("Kz(D, h<7  -> 1.03)", calc.calculate_kz(5, 'D'), 1.03, 0.001)

# ---------------------------------------------------------------------------
# TEST 3 — Terrain constants vs ASCE 7-22 Table 26.11-1
# ---------------------------------------------------------------------------
print("\nTEST 3 — Terrain constants (Table 26.11-1)")
terrain_expected = {
    'B': {'alpha': 7.5, 'zg': 3280, 'zmin': 30},
    'C': {'alpha': 9.8, 'zg': 2460, 'zmin': 15},
    'D': {'alpha': 11.5, 'zg': 1935, 'zmin': 7},
}
for exp, vals in terrain_expected.items():
    tc = calc.get_terrain_constants(exp)
    check(f"alpha({exp})", tc['alpha'], vals['alpha'], 0.001)
    check(f"zg({exp})", tc['zg'], vals['zg'], 0.001)
    check(f"zmin({exp})", tc['zmin'], vals['zmin'], 0.001)

# ---------------------------------------------------------------------------
# TEST 4 — GCpi vs ASCE 7-22 Table 26.13-1
# ---------------------------------------------------------------------------
print("\nTEST 4 — GCpi (Table 26.13-1)")
enc = calc.get_gcpi('enclosed')
check("GCpi enclosed (+)", max(enc), 0.18, 0.001)
check("GCpi enclosed (-)", min(enc), -0.18, 0.001)
pe = calc.get_gcpi('partially enclosed')
check("GCpi partially enclosed (+)", max(pe), 0.55, 0.001)
check("GCpi partially enclosed (-)", min(pe), -0.55, 0.001)
op = calc.get_gcpi('open')
check("GCpi open", op[0], 0.0, 0.001)

# ---------------------------------------------------------------------------
# TEST 5 — Kd vs ASCE 7-22 Table 26.6-1 (buildings / C&C = 0.85)
# ---------------------------------------------------------------------------
print("\nTEST 5 — Kd (Table 26.6-1, C&C = 0.85)")
check("Kd (C&C)", calc.Kd, 0.85, 0.001)

# ---------------------------------------------------------------------------
# TEST 6 — qz convention: Kd folded into qz exactly once.
# qz = 0.00256*Kz*Kzt*Kd*Ke*V^2. With V=115, Kz=1.0, Kzt=1.0, Ke=1.0:
#   WITH Kd once = 0.00256*1*1*0.85*1*115^2 = 28.78 psf
#   (without Kd it would be 33.86; doubled Kd would be 24.46)
# ---------------------------------------------------------------------------
print("\nTEST 6 — qz folds Kd in exactly once")
qz = calc.calculate_velocity_pressure(115, 1.0, 1.0, 1.0)
expected_qz = 0.00256 * 1.0 * 1.0 * 0.85 * 1.0 * 115 ** 2
check("qz = 0.00256*Kz*Kzt*Kd*Ke*V^2", qz, expected_qz, 0.01)
check("qz value (Kd present once)", qz, 28.78, 0.05)

# ---------------------------------------------------------------------------
# TEST 7 — Fig 30.3-1 walls (h <= 60 ft) anchor cells (ledger: 6 cells)
#   Zone 4: -1.1 (A=10) / -0.8 (A=500)
#   Zone 5: -1.4 (A=10) / -0.8 (A=500)
#   Positive (4 & 5): +1.0 (A=10) / +0.7 (A=500)
# ---------------------------------------------------------------------------
print("\nTEST 7 — Fig 30.3-1 walls h<=60 (6 cells)")
check("30.3-1 Z4 A=10 (neg)", calc.get_gcp_wall_figure_30_3_1(4, 10, "negative"), -1.1, 0.001)
check("30.3-1 Z4 A=500 (neg)", calc.get_gcp_wall_figure_30_3_1(4, 500, "negative"), -0.8, 0.001)
check("30.3-1 Z5 A=10 (neg)", calc.get_gcp_wall_figure_30_3_1(5, 10, "negative"), -1.4, 0.001)
check("30.3-1 Z5 A=500 (neg)", calc.get_gcp_wall_figure_30_3_1(5, 500, "negative"), -0.8, 0.001)
check("30.3-1 pos A=10", calc.get_gcp_wall_figure_30_3_1(4, 10, "positive"), 1.0, 0.001)
check("30.3-1 pos A=500", calc.get_gcp_wall_figure_30_3_1(4, 500, "positive"), 0.7, 0.001)

# ---------------------------------------------------------------------------
# TEST 7b — Fig 30.3-1 effective-area clamp [10, 500] BOTH ENDS (Ian Mock bug).
# A < 10 must use the A=10 anchor (STRONGEST), NOT fall through to A>500 (weakest).
# ---------------------------------------------------------------------------
print("\nTEST 7b — Fig 30.3-1 effective-area clamp [10,500] (Ian Mock bug)")
# A < 10 -> A=10 anchor
check("30.3-1 Z4 A=5 -> A=10 anchor (neg)", calc.get_gcp_wall_figure_30_3_1(4, 5, "negative"), -1.1, 0.001)
check("30.3-1 Z5 A=5 -> A=10 anchor (neg)", calc.get_gcp_wall_figure_30_3_1(5, 5, "negative"), -1.4, 0.001)
check("30.3-1 pos A=5 -> A=10 anchor", calc.get_gcp_wall_figure_30_3_1(4, 5, "positive"), 1.0, 0.001)
# A > 500 -> A=500 anchor
check("30.3-1 Z4 A=1000 -> A=500 anchor (neg)", calc.get_gcp_wall_figure_30_3_1(4, 1000, "negative"), -0.8, 0.001)
check("30.3-1 Z5 A=1000 -> A=500 anchor (neg)", calc.get_gcp_wall_figure_30_3_1(5, 1000, "negative"), -0.8, 0.001)
check("30.3-1 pos A=1000 -> A=500 anchor", calc.get_gcp_wall_figure_30_3_1(4, 1000, "positive"), 0.7, 0.001)

# ---------------------------------------------------------------------------
# TEST 8 — Fig 30.4-1 walls (h > 60 ft). Ledger wall cells (this engine
# implements only the WALL zones of Fig 30.4-1; roof zones 1/2/3 are in the
# roofs-flat engine, not here):
#   Zone 4: -1.0 (A=10) / -0.7 (A=500)
#   Zone 5: -1.8 (A=10) / -1.0 (A=500)
#   Positive (4 & 5): +0.9 (A=10) / +0.6 (A=500)
# ---------------------------------------------------------------------------
print("\nTEST 8 — Fig 30.4-1 walls h>60 (6 wall cells)")
check("30.4-1 Z4 A=10 (neg)", calc.get_gcp_wall_figure_30_4_1(4, 10, "negative"), -1.0, 0.001)
check("30.4-1 Z4 A=500 (neg)", calc.get_gcp_wall_figure_30_4_1(4, 500, "negative"), -0.7, 0.001)
check("30.4-1 Z5 A=10 (neg)", calc.get_gcp_wall_figure_30_4_1(5, 10, "negative"), -1.8, 0.001)
check("30.4-1 Z5 A=500 (neg)", calc.get_gcp_wall_figure_30_4_1(5, 500, "negative"), -1.0, 0.001)
check("30.4-1 pos A=10", calc.get_gcp_wall_figure_30_4_1(4, 10, "positive"), 0.9, 0.001)
check("30.4-1 pos A=500", calc.get_gcp_wall_figure_30_4_1(4, 500, "positive"), 0.6, 0.001)

# ---------------------------------------------------------------------------
# TEST 8b — Fig 30.4-1 effective-area clamp [10, 500] BOTH ENDS.
# ---------------------------------------------------------------------------
print("\nTEST 8b — Fig 30.4-1 effective-area clamp [10,500] (both ends)")
check("30.4-1 Z4 A=5 -> A=10 anchor (neg)", calc.get_gcp_wall_figure_30_4_1(4, 5, "negative"), -1.0, 0.001)
check("30.4-1 Z5 A=5 -> A=10 anchor (neg)", calc.get_gcp_wall_figure_30_4_1(5, 5, "negative"), -1.8, 0.001)
check("30.4-1 pos A=5 -> A=10 anchor", calc.get_gcp_wall_figure_30_4_1(4, 5, "positive"), 0.9, 0.001)
check("30.4-1 Z4 A=1000 -> A=500 anchor (neg)", calc.get_gcp_wall_figure_30_4_1(4, 1000, "negative"), -0.7, 0.001)
check("30.4-1 Z5 A=1000 -> A=500 anchor (neg)", calc.get_gcp_wall_figure_30_4_1(5, 1000, "negative"), -1.0, 0.001)
check("30.4-1 pos A=1000 -> A=500 anchor", calc.get_gcp_wall_figure_30_4_1(4, 1000, "positive"), 0.6, 0.001)

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
