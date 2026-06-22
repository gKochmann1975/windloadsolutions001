"""
Ground-mounted-solar engine verification harness — ASCE 7-22 (Chapter 29, §29.4.5).

Engine under test: webapp/asce7_22_other_solar_ground.py
  (class ASCE7_GroundMountedSolarCalculator)

Figure values for Fig 29.4-9/29.4-10/29.4-11 (GCgn/GCgm static + dynamic) are
UNVERIFIED pending book-read (see "ASCE 7-22/UNVERIFIED_FIGURE_VALUES_WORKLIST.md");
this harness covers Ch26 universals + structure only. Per the ASCE verified-values
ledger Rule 4, this harness does NOT assert ANY GCp/GCgn/GCgm MAGNITUDE — doing so
would lock in unverified numbers. It asserts only:
  * Chapter-26 universals that ARE in the verified ledger (Ke, Kz table cells,
    terrain constants, Kd, qz Kd-in-qz convention). GCpi is intentionally NOT
    tested — this is a Chapter-29 net-pressure engine with no internal-pressure
    coefficient method.
  * Structural invariants that don't pin a book magnitude: effective-area clamp
    behavior, edge(Zone 2) >= interior(Zone 1) monotonicity, and finiteness across
    the full omega/zone/area range (static + dynamic).

Run from repo root:
    C:/Python312/python.exe tests/test_engine_solar_ground.py

Exit code 0 = all pass, 1 = at least one failure.
"""
import sys
import os
import math

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

import asce7_22_other_solar_ground as solar_mod

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


eng = solar_mod.ASCE7_GroundMountedSolarCalculator()

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
# Ground-mounted solar = "rooftop equipment, attached & freestanding signs"-type
# appurtenance row = 0.85 (engine hardcodes self.Kd).
# ---------------------------------------------------------------------------
print("\nTEST 4 — Kd (Table 26.6-1 = 0.85)")
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
# TEST 6 — STRUCTURAL invariants for Fig 29.4-10 STATIC coeffs — NO magnitude asserted
# Engine clamps effective area A into [1, 10000] (see _get_static_coefficient).
# Two zones only: 1 (interior) and 2 (edge).
# ---------------------------------------------------------------------------
print("\nTEST 6 — static (GCgn/GCgm) structural invariants (NO book magnitude asserted)")

# 6a — effective-area clamp behavior (below min == at min; above max == at max).
for getter_name, getter in (('GCgn_static', eng.get_gcgn_static),
                            ('GCgm_static', eng.get_gcgm_static)):
    for omega in (3, 10, 20, 45):
        for zone in (1, 2):
            below = getter(zone, omega, 0.5)      # below A_min=1 -> same as A=1
            at_min = getter(zone, omega, 1)
            above = getter(zone, omega, 50000)    # above A_max=10000 -> same as 10000
            at_max = getter(zone, omega, 10000)
            check(f"{getter_name} clamp below-min==at-min (w={omega},z={zone})",
                  below, at_min, 1e-9)
            check(f"{getter_name} clamp above-max==at-max (w={omega},z={zone})",
                  above, at_max, 1e-9)

# 6b — zone monotonicity: edge (Zone 2) >= interior (Zone 1) magnitude, fixed A & omega.
print("\nTEST 6b — static zone monotonicity: edge(Z2) >= interior(Z1)")
for getter_name, getter in (('GCgn_static', eng.get_gcgn_static),
                            ('GCgm_static', eng.get_gcgm_static)):
    for A in (1, 10, 100, 1000, 10000):
        for omega in (3, 10, 20, 45):
            z1 = getter(1, omega, A)
            z2 = getter(2, omega, A)
            check_true(f"{getter_name} edge>=interior (A={A},w={omega}): "
                       f"{z2:.3f}>={z1:.3f}", z2 >= z1 - 1e-9)

# 6c — finiteness across the full omega/zone/area range (no crash, no NaN/inf).
print("\nTEST 6c — static coeffs finite across omega/zone/area range")
static_finite = True
static_count = 0
for getter in (eng.get_gcgn_static, eng.get_gcgm_static):
    for A in (0.5, 1, 10, 100, 500, 1000, 5000, 10000, 50000):
        for omega in (1, 3, 5, 8, 10, 12, 15, 20, 30, 45, 60):
            for zone in (1, 2):
                try:
                    v = getter(zone, omega, A)
                except Exception as e:  # noqa
                    static_finite = False
                    print(f"    crash at A={A},w={omega},z={zone}: {e}")
                    break
                static_count += 1
                if not math.isfinite(v):
                    static_finite = False
                    print(f"    non-finite at A={A},w={omega},z={zone}: {v}")
check_true(f"static coeffs finite for all {static_count} (A,omega,zone) combos",
           static_finite)

# ---------------------------------------------------------------------------
# TEST 7 — STRUCTURAL invariants for Fig 29.4-11 DYNAMIC coeffs — NO magnitude asserted
# Dynamic getters: get_gcgn_dynamic(zone, omega, Ns, area, Lc, beta).
# Area is selected between A1=min(4Lc^2,500) and A2=min(15Lc^2,1000) curves.
# ---------------------------------------------------------------------------
print("\nTEST 7 — dynamic (GCgn/GCgm) structural invariants (NO book magnitude asserted)")
Lc = 8.0
A1, A2 = eng.calculate_area_thresholds(Lc)  # for Lc=8: A1=min(256,500)=256, A2=min(960,1000)=960

# 7a — area clamp: A <= A1 == evaluated at A1; A >= A2 == evaluated at A2.
for getter_name, getter in (('GCgn_dynamic', eng.get_gcgn_dynamic),
                            ('GCgm_dynamic', eng.get_gcgm_dynamic)):
    for omega in (5, 20):
        for zone in (1, 2):
            for Ns in (0.0, 0.3):
                below = getter(zone, omega, Ns, A1 * 0.1, Lc)   # well below A1
                at_A1 = getter(zone, omega, Ns, A1, Lc)
                above = getter(zone, omega, Ns, A2 * 5, Lc)     # well above A2
                at_A2 = getter(zone, omega, Ns, A2, Lc)
                check(f"{getter_name} A<=A1 clamp (w={omega},z={zone},Ns={Ns})",
                      below, at_A1, 1e-9)
                check(f"{getter_name} A>=A2 clamp (w={omega},z={zone},Ns={Ns})",
                      above, at_A2, 1e-9)

# 7b — zone monotonicity: edge (Zone 2) >= interior (Zone 1) at fixed omega/Ns/A.
print("\nTEST 7b — dynamic zone monotonicity: edge(Z2) >= interior(Z1)")
for getter_name, getter in (('GCgn_dynamic', eng.get_gcgn_dynamic),
                            ('GCgm_dynamic', eng.get_gcgm_dynamic)):
    for A in (A1, (A1 + A2) / 2, A2):
        for omega in (5, 20):
            for Ns in (0.0, 0.2, 0.5):
                z1 = getter(1, omega, Ns, A, Lc)
                z2 = getter(2, omega, Ns, A, Lc)
                check_true(f"{getter_name} edge>=interior (A={A:.0f},w={omega},Ns={Ns}): "
                           f"{z2:.3f}>={z1:.3f}", z2 >= z1 - 1e-9)

# 7c — finiteness across the full omega/zone/Ns/area range (no crash, no NaN/inf).
print("\nTEST 7c — dynamic coeffs finite across omega/zone/Ns/area range")
dyn_finite = True
dyn_count = 0
for getter in (eng.get_gcgn_dynamic, eng.get_gcgm_dynamic):
    for A in (10, A1, (A1 + A2) / 2, A2, 2000):
        for omega in (1, 5, 10, 14, 15, 20, 45, 60):
            for zone in (1, 2):
                for Ns in (0.0, 0.1, 0.3, 0.5, 0.8, 1.0):
                    try:
                        v = getter(zone, omega, Ns, A, Lc)
                    except Exception as e:  # noqa
                        dyn_finite = False
                        print(f"    crash at A={A},w={omega},z={zone},Ns={Ns}: {e}")
                        break
                    dyn_count += 1
                    if not math.isfinite(v):
                        dyn_finite = False
                        print(f"    non-finite at A={A},w={omega},z={zone},Ns={Ns}: {v}")
check_true(f"dynamic coeffs finite for all {dyn_count} combos", dyn_finite)

# 7d — damping adjustment direction: lower beta (<1%) increases dynamic magnitude
# via sqrt(0.01/beta). Structural sanity (formula), not a book magnitude.
print("\nTEST 7d — damping adjustment scales dynamic coeff by sqrt(0.01/beta)")
base = eng.get_gcgn_dynamic(2, 20, 0.2, A1, Lc, beta=0.01)
half = eng.get_gcgn_dynamic(2, 20, 0.2, A1, Lc, beta=0.0025)  # sqrt(0.01/0.0025)=2.0
check("beta=0.0025 doubles dynamic coeff vs beta=0.01", half, base * 2.0, 1e-6)

# ---------------------------------------------------------------------------
# TEST 8 — supporting formula sanity (no book magnitudes)
# ---------------------------------------------------------------------------
print("\nTEST 8 — supporting formula sanity")
# Reduced frequency Ns = 0.682 * n * Lc / V (Section 29.4.5.4)
Ns = eng.calculate_reduced_frequency(2.0, 8.0, 130.0)
check("Ns = 0.682*n*Lc/V", Ns, 0.682 * 2.0 * 8.0 / 130.0, 1e-9)
check_true("Ns(V<=0) -> 0 (guard)", eng.calculate_reduced_frequency(2.0, 8.0, 0) == 0.0)
# Area thresholds
A1b, A2b = eng.calculate_area_thresholds(8.0)
check("A1 = min(4*Lc^2, 500)", A1b, min(4 * 64, 500), 1e-9)
check("A2 = min(15*Lc^2, 1000)", A2b, min(15 * 64, 1000), 1e-9)

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
