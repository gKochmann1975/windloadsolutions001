"""
Topographic multipliers verification harness — ASCE 7-22 Fig 26.8-1 / Table 26.8-1.

Runs the shared topographic module (webapp/asce7_22_topographic.py) against the
verified-values ledger for K_1, K_2, K_3 (escarpment / 2-D ridge / 3-D hill):
  1. K_1 anchors — 21 cells (7 H/Lh x 3 features)
  2. K_2 anchors — 27 cells (9 |x|/Lh x 3 features)
  3. K_3 anchors — 39 cells (13 z/Lh x 3 features)
  4. K_3 monotonicity — must DECREASE with height for every feature

This is a shared module with NO Chapter-26 velocity methods (no Ke/Kz/Kd/qz/GCpi),
so the universal Ch26 checks are intentionally skipped — only K1/K2/K3 + the
K3-decreasing-with-height guard are asserted.

Every expected value below is copied from the verified-values ledger
(reference_asce_7_22_verified_values.md, Figure 26.8-1 section), NOT from the
engine's own output (ASCE ledger Rule 4 / Rule 5).

Run from repo root:
    C:/Python312/python.exe tests/test_engine_topographic.py

Exit code 0 = all pass, 1 = at least one failure.
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

import asce7_22_topographic as topo

PASS = "PASS"
FAIL = "FAIL"
results = []


def check(name, got, expected, tol):
    ok = abs(got - expected) <= tol
    results.append(ok)
    status = PASS if ok else FAIL
    print(f"  [{status}] {name}: got {got:.4f}, expected {expected:.4f} (tol {tol})")
    return ok


# Feature keys as exposed by the engine's _FEATURE_TO_COL
ESC = 'escarpment'
RIDGE = '2d-ridge'
HILL = '3d-hill'

# Exact-table-cell tolerance: anchors are exact 2-decimal book values, the engine
# returns them verbatim at the anchor points, so tol 0.001 is appropriate.
TOL = 0.001

# ---------------------------------------------------------------------------
# TEST 1 — K_1 anchors vs ledger Table 26.8-1 (21 cells)
# Ledger rows: H/Lh -> (escarpment, ridge, hill)
# ---------------------------------------------------------------------------
print("\nTEST 1 — K_1 vs ledger Table 26.8-1 (21 cells)")
K1 = [
    # H/Lh,  escarp, ridge, hill
    (0.20, 0.29, 0.17, 0.21),
    (0.25, 0.36, 0.21, 0.26),
    (0.30, 0.43, 0.26, 0.32),
    (0.35, 0.51, 0.30, 0.37),
    (0.40, 0.58, 0.34, 0.42),
    (0.45, 0.65, 0.38, 0.47),
    (0.50, 0.72, 0.43, 0.53),
]
for h_lh, esc, ridge, hill in K1:
    check(f"K1 escarpment H/Lh={h_lh}", topo.get_K1(ESC, h_lh), esc, TOL)
    check(f"K1 ridge      H/Lh={h_lh}", topo.get_K1(RIDGE, h_lh), ridge, TOL)
    check(f"K1 hill       H/Lh={h_lh}", topo.get_K1(HILL, h_lh), hill, TOL)

# ---------------------------------------------------------------------------
# TEST 2 — K_2 anchors vs ledger Table 26.8-1 (27 cells)
# Ledger rows: |x|/Lh -> (escarpment, ridge, hill)
# (downwind side; engine uses abs(x_Lh) for ridge/hill symmetry)
# ---------------------------------------------------------------------------
print("\nTEST 2 — K_2 vs ledger Table 26.8-1 (27 cells)")
K2 = [
    # |x|/Lh, escarp, ridge, hill
    (0.00, 1.00, 1.00, 1.00),
    (0.50, 0.88, 0.67, 0.67),
    (1.00, 0.75, 0.33, 0.33),
    (1.50, 0.63, 0.00, 0.00),
    (2.00, 0.50, 0.00, 0.00),
    (2.50, 0.38, 0.00, 0.00),
    (3.00, 0.25, 0.00, 0.00),
    (3.50, 0.13, 0.00, 0.00),
    (4.00, 0.00, 0.00, 0.00),
]
for x_lh, esc, ridge, hill in K2:
    check(f"K2 escarpment x/Lh={x_lh}", topo.get_K2(ESC, x_lh), esc, TOL)
    check(f"K2 ridge      x/Lh={x_lh}", topo.get_K2(RIDGE, x_lh), ridge, TOL)
    check(f"K2 hill       x/Lh={x_lh}", topo.get_K2(HILL, x_lh), hill, TOL)

# ---------------------------------------------------------------------------
# TEST 3 — K_3 anchors vs ledger Table 26.8-1 (39 cells)
# Ledger rows: z/Lh -> (escarpment, ridge, hill)
# ---------------------------------------------------------------------------
print("\nTEST 3 — K_3 vs ledger Table 26.8-1 (39 cells)")
K3 = [
    # z/Lh,  escarp, ridge, hill
    (0.00, 1.00, 1.00, 1.00),
    (0.10, 0.74, 0.78, 0.67),
    (0.20, 0.55, 0.61, 0.45),
    (0.30, 0.41, 0.47, 0.30),
    (0.40, 0.30, 0.37, 0.20),
    (0.50, 0.22, 0.29, 0.14),
    (0.60, 0.17, 0.22, 0.09),
    (0.70, 0.12, 0.17, 0.06),
    (0.80, 0.09, 0.14, 0.04),
    (0.90, 0.07, 0.11, 0.03),
    (1.00, 0.05, 0.08, 0.02),
    (1.50, 0.01, 0.02, 0.00),
    (2.00, 0.00, 0.01, 0.00),
]
for z_lh, esc, ridge, hill in K3:
    check(f"K3 escarpment z/Lh={z_lh}", topo.get_K3(ESC, z_lh), esc, TOL)
    check(f"K3 ridge      z/Lh={z_lh}", topo.get_K3(RIDGE, z_lh), ridge, TOL)
    check(f"K3 hill       z/Lh={z_lh}", topo.get_K3(HILL, z_lh), hill, TOL)

# ---------------------------------------------------------------------------
# TEST 4 — K_3 MUST DECREASE with height (z/Lh) for every feature.
# Per ASCE 7-22 the topographic speed-up decays exponentially above terrain;
# the 2026-04-27 engine bug returned K3 INCREASING with height. This guard
# catches any regression to that inverted behavior.
# ---------------------------------------------------------------------------
print("\nTEST 4 — K_3 monotonic-decreasing with height (regression guard)")
heights = [a[0] for a in K3]  # 0.00 .. 2.00
for feature in (ESC, RIDGE, HILL):
    vals = [topo.get_K3(feature, z) for z in heights]
    non_increasing = all(vals[i + 1] <= vals[i] + 1e-9 for i in range(len(vals) - 1))
    strictly_lower_at_top = vals[-1] < vals[0]  # K3(2.0) < K3(0.0)=1.0
    ok = non_increasing and strictly_lower_at_top
    results.append(ok)
    status = PASS if ok else FAIL
    print(f"  [{status}] K3 {feature}: non-increasing={non_increasing}, "
          f"K3(0.0)={vals[0]:.3f} -> K3(2.0)={vals[-1]:.3f}")

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
