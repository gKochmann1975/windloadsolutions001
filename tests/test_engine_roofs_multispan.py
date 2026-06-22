"""
Multispan gabled roof C&C engine verification harness — ASCE 7-22.

Engine: webapp/asce7_22_cc_roofs_multispan.py
        (ASCE7_CC_MultispanRoofCalculator)

Figure values for Fig 30.3-4 (multispan gabled roof GCp) are UNVERIFIED pending
book-read (see ASCE 7-22/UNVERIFIED_FIGURE_VALUES_WORKLIST.md); this harness
covers Ch26 universals + structure only.

Per ASCE ledger Rule 4, EVERY asserted magnitude comes from the verified-values
ledger (reference_asce_7_22_verified_values.md). NO GCp magnitude is asserted for
this engine because Fig 30.3-4 is NOT in the ledger — asserting one would lock in
an unverified number. The GCp checks here are STRUCTURAL invariants only (clamp
behavior, zone monotonicity, finiteness) that hold regardless of the book value.

Run from repo root:
    C:/Python312/python.exe tests/test_engine_roofs_multispan.py

Exit code 0 = all pass, 1 = at least one failure.
"""
import sys
import os
import math

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

import asce7_22_cc_roofs_multispan as multispan_mod

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
    print(f"  [{status}] {name}: {'OK' if ok else 'FAILED'}")
    return ok


calc = multispan_mod.ASCE7_CC_MultispanRoofCalculator()

# ---------------------------------------------------------------------------
# TEST 1 — Ground Elevation Factor Ke vs ASCE 7-22 Table 26.9-1 / Eq. 26.9-1
# Engine policy: Ke = 1.0 for ze <= 1000 ft; above, exact Eq. 26.9-1.
# ---------------------------------------------------------------------------
print("\nTEST 1 — Ke vs Table 26.9-1 (Eq. 26.9-1: Ke = exp(-0.0000362*ze))")
ke_conservative = [(0, 1.00), (500, 1.00), (1000, 1.00)]
ke_formula = [(2000, 0.93), (3000, 0.90), (4000, 0.86), (5000, 0.83), (6000, 0.80)]
for z, expected in ke_conservative:
    check(f"Ke(z={z}) conservative", calc.calculate_ke(z), expected, 0.001)
for z, book in ke_formula:
    check(f"Ke(z={z}) formula", calc.calculate_ke(z), book, 0.01)
# REGRESSION GUARD: old -2.0e-4 coefficient gave Ke(2000) ~0.67.
guard_ke2000 = calc.calculate_ke(2000)
check_true("Ke(2000) NOT ~0.67 (old -2.0e-4 bug absent)",
           abs(guard_ke2000 - 0.67) > 0.02)

# ---------------------------------------------------------------------------
# TEST 2 — Velocity pressure coefficient Kz vs Table 26.10-1 (66 cells)
# ---------------------------------------------------------------------------
print("\nTEST 2 — Kz vs Table 26.10-1 (66 ledger cells, B/C/D x 22 heights)")
# Ledger Table 26.10-1 (height ft -> Kz) for B, C, D.
kz_table = {
    'B': {15: 0.57, 20: 0.62, 25: 0.66, 30: 0.70, 40: 0.74, 50: 0.79, 60: 0.83,
          70: 0.86, 80: 0.90, 90: 0.92, 100: 0.95, 120: 1.00, 140: 1.04,
          160: 1.08, 180: 1.11, 200: 1.14, 250: 1.21, 300: 1.27, 350: 1.33,
          400: 1.38, 450: 1.42, 500: 1.46},
    'C': {15: 0.85, 20: 0.90, 25: 0.94, 30: 0.98, 40: 1.04, 50: 1.09, 60: 1.13,
          70: 1.17, 80: 1.21, 90: 1.24, 100: 1.26, 120: 1.31, 140: 1.34,
          160: 1.39, 180: 1.41, 200: 1.44, 250: 1.51, 300: 1.57, 350: 1.62,
          400: 1.66, 450: 1.70, 500: 1.74},
    'D': {15: 1.03, 20: 1.08, 25: 1.12, 30: 1.16, 40: 1.22, 50: 1.27, 60: 1.31,
          70: 1.34, 80: 1.38, 90: 1.40, 100: 1.43, 120: 1.48, 140: 1.52,
          160: 1.55, 180: 1.58, 200: 1.61, 250: 1.68, 300: 1.73, 350: 1.78,
          400: 1.82, 450: 1.86, 500: 1.89},
}
# NOTE (PENDING book confirmation): Exposure B below z_min=30 ft -> engine
# applies the Section 26.10.2 z_min FLOOR (0.70), not the raw Table 26.10-1
# cells (0.57/0.62/0.66). Table-vs-equation choice; floor is conservative.
# See ASCE 7-22/UNVERIFIED_FIGURE_VALUES_WORKLIST.md.
for exp_cat in ('B', 'C', 'D'):
    for h in sorted(kz_table[exp_cat]):
        exp_val = 0.70 if (exp_cat == 'B' and h < 30) else kz_table[exp_cat][h]
        check(f"Kz[{exp_cat}] @ {h}ft", calc.calculate_kz(h, exp_cat), exp_val, 0.001)

# z_min clamp (ledger Section 26.10.2): B(<30)->0.70, C(<15)->0.85, D(<7)->1.03
print("\nTEST 2b — Kz z_min clamp")
check("Kz[B] @ 10ft (z<30 clamp)", calc.calculate_kz(10, 'B'), 0.70, 0.001)
check("Kz[C] @ 10ft (z<15 clamp)", calc.calculate_kz(10, 'C'), 0.85, 0.001)
check("Kz[D] @ 5ft (z<7 clamp)", calc.calculate_kz(5, 'D'), 1.03, 0.001)

# ---------------------------------------------------------------------------
# TEST 3 — Terrain exposure constants vs Table 26.11-1
# ---------------------------------------------------------------------------
print("\nTEST 3 — Terrain constants vs Table 26.11-1")
terrain_expected = {
    'B': {'alpha': 7.5, 'zg': 3280, 'zmin': 30},
    'C': {'alpha': 9.8, 'zg': 2460, 'zmin': 15},
    'D': {'alpha': 11.5, 'zg': 1935, 'zmin': 7},
}
for exp_cat, vals in terrain_expected.items():
    tc = calc.get_terrain_constants(exp_cat)
    check(f"alpha[{exp_cat}]", tc['alpha'], vals['alpha'], 0.001)
    check(f"zg[{exp_cat}]", tc['zg'], vals['zg'], 0.001)
    check(f"zmin[{exp_cat}]", tc['zmin'], vals['zmin'], 0.001)

# ---------------------------------------------------------------------------
# TEST 4 — Internal pressure coefficient GCpi vs Table 26.13-1
# ---------------------------------------------------------------------------
print("\nTEST 4 — GCpi vs Table 26.13-1")
gcpi_enc = calc.get_gcpi('enclosed')
check("GCpi enclosed (+)", max(gcpi_enc), 0.18, 0.001)
check("GCpi enclosed (-)", min(gcpi_enc), -0.18, 0.001)
gcpi_pe = calc.get_gcpi('partially enclosed')
check("GCpi partially enclosed (+)", max(gcpi_pe), 0.55, 0.001)
check("GCpi partially enclosed (-)", min(gcpi_pe), -0.55, 0.001)
gcpi_open = calc.get_gcpi('open')
check("GCpi open", gcpi_open[0], 0.0, 0.001)

# ---------------------------------------------------------------------------
# TEST 5 — Kd for C&C buildings vs Table 26.6-1 (= 0.85)
# ---------------------------------------------------------------------------
print("\nTEST 5 — Kd vs Table 26.6-1 (C&C buildings = 0.85)")
check("Kd (C&C buildings)", calc.Kd, 0.85, 0.001)

# ---------------------------------------------------------------------------
# TEST 6 — qz convention: Kd folded into qz exactly once.
# qz = 0.00256 * Kz * Kzt * Kd * Ke * V^2. Confirm Kd present once.
# ---------------------------------------------------------------------------
print("\nTEST 6 — qz folds Kd in exactly once (0.00256*Kz*Kzt*Kd*Ke*V^2)")
Kz_t, Kzt_t, Ke_t, V_t = 1.02, 1.0, 1.0, 115.0
qh_engine = calc.calculate_velocity_pressure(V_t, Kz_t, Kzt_t, Ke_t)
qh_with_kd = 0.00256 * Kz_t * Kzt_t * calc.Kd * Ke_t * V_t ** 2
check("qh = 0.00256*Kz*Kzt*Kd*Ke*V^2 (Kd once)", qh_engine, qh_with_kd, 0.001)
# Sanity: confirm Kd is actually present (not missing -> would be higher).
qh_no_kd = 0.00256 * Kz_t * Kzt_t * Ke_t * V_t ** 2
check_true("qh != no-Kd value (Kd present, not missing)",
           abs(qh_engine - qh_no_kd) > 0.5)
# And not doubled.
qh_double_kd = qh_no_kd * calc.Kd * calc.Kd
check_true("qh != double-Kd value (Kd not applied twice)",
           abs(qh_engine - qh_double_kd) > 0.5)

# ---------------------------------------------------------------------------
# TEST 7 — STRUCTURAL invariants for GCp (NO magnitude asserted — Fig 30.3-4
# is UNVERIFIED). Effective-area clamp, zone monotonicity, finiteness.
# ---------------------------------------------------------------------------
print("\nTEST 7 — GCp structural invariants (Fig 30.3-4 magnitudes UNVERIFIED)")

# Engine anchors are A=10 (min) and A=100 (max), log interp between.
A_MIN, A_MAX = 10.0, 100.0

for theta in (20.0, 40.0):       # one slope in each band (10-30, 30-45)
    for ptype in ('negative', 'positive'):
        for zone in (1, 2, 3):
            # Clamp below min: A < A_MIN returns SAME value as at A_MIN.
            v_below = calc.get_gcp_multispan_roof(zone, 1.0, theta, ptype)
            v_at_min = calc.get_gcp_multispan_roof(zone, A_MIN, theta, ptype)
            check_true(
                f"clamp<min same as @min (theta={theta},z{zone},{ptype})",
                math.isclose(v_below, v_at_min, rel_tol=0, abs_tol=1e-9))

            # Clamp above max: A > A_MAX returns SAME value as at A_MAX.
            v_above = calc.get_gcp_multispan_roof(zone, 10000.0, theta, ptype)
            v_at_max = calc.get_gcp_multispan_roof(zone, A_MAX, theta, ptype)
            check_true(
                f"clamp>max same as @max (theta={theta},z{zone},{ptype})",
                math.isclose(v_above, v_at_max, rel_tol=0, abs_tol=1e-9))

            # Finiteness across the range (no crash, real numbers).
            for A in (10, 25, 50, 100):
                val = calc.get_gcp_multispan_roof(zone, A, theta, ptype)
                check_true(
                    f"finite GCp (theta={theta},z{zone},{ptype},A={A})",
                    isinstance(val, (int, float)) and math.isfinite(val))

    # Negative-zone monotonicity (suction magnitude): corner(3) >= edge(2) >= interior(1)
    for A in (10, 50, 100):
        z1 = abs(calc.get_gcp_multispan_roof(1, A, theta, 'negative'))
        z2 = abs(calc.get_gcp_multispan_roof(2, A, theta, 'negative'))
        z3 = abs(calc.get_gcp_multispan_roof(3, A, theta, 'negative'))
        check_true(
            f"|GCp| zone3>=zone2 (theta={theta},A={A},neg)", z3 >= z2 - 1e-9)
        check_true(
            f"|GCp| zone2>=zone1 (theta={theta},A={A},neg)", z2 >= z1 - 1e-9)

# Larger effective area should not increase suction magnitude (interp decreases).
for theta in (20.0, 40.0):
    for zone in (1, 2, 3):
        mag_small = abs(calc.get_gcp_multispan_roof(zone, 10, theta, 'negative'))
        mag_large = abs(calc.get_gcp_multispan_roof(zone, 100, theta, 'negative'))
        check_true(
            f"|GCp| non-increasing w/ area (theta={theta},z{zone},neg)",
            mag_small >= mag_large - 1e-9)

# ---------------------------------------------------------------------------
# TEST 8 — Slope-range guards raise outside Fig 30.3-4 applicability.
# ---------------------------------------------------------------------------
print("\nTEST 8 — slope guards (theta<=10 and theta>45 raise)")
raised_low = False
try:
    calc.get_gcp_multispan_roof(1, 10, 10.0, 'negative')
except ValueError:
    raised_low = True
check_true("theta<=10 raises ValueError", raised_low)

raised_high = False
try:
    calc.get_gcp_multispan_roof(1, 10, 50.0, 'negative')
except ValueError:
    raised_high = True
check_true("theta>45 raises ValueError", raised_high)

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
