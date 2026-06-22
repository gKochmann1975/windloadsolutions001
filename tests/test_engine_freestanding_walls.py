"""
Freestanding walls / signs engine verification harness — ASCE 7-22.

Engine: webapp/asce7_22_other_freestanding_walls.py
Class:  ASCE7_FreestandingWallsCalculator
Figure: 29.3-1 (Solid Freestanding Walls & Signs, force coefficient Cf)
Eq:     29.3-1  F = qh * G * Cf * As

Every expected value below comes from the VERIFIED ledger / reference, NEVER from
the engine's own output (ASCE ledger Rule 4):
  - Ch 26 universals: reference_asce_7_22_verified_values.md
      Table 26.10-1 Kz (66 cells), Table 26.9-1 Ke, Table 26.11-1 terrain,
      Table 26.6-1 Kd (freestanding walls = 0.85), Table 26.13-1 GCpi (N/A here).
  - Fig 29.3-1 Cf (Cases A/B and Case C): ASCE 7-22/SIGNS_FREESTANDING_WALLS_Cf_REFERENCE.md

This is a force-coefficient engine: it has NO GCpi method, so the GCpi check is
SKIPPED (engine genuinely lacks it).

Run from repo root:
    C:/Python312/python.exe tests/test_engine_freestanding_walls.py

Exit code 0 = all pass, 1 = at least one failure.
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

import asce7_22_other_freestanding_walls as fw_mod

PASS = "PASS"
FAIL = "FAIL"
results = []


def check(name, got, expected, tol):
    ok = abs(got - expected) <= tol
    results.append(ok)
    status = PASS if ok else FAIL
    print(f"  [{status}] {name}: got {got:.4f}, expected {expected:.4f} (tol {tol})")
    return ok


eng = fw_mod.ASCE7_FreestandingWallsCalculator()

# ---------------------------------------------------------------------------
# TEST 1 — Ground Elevation Factor Ke vs Table 26.9-1 (Eq. 26.9-1)
# ---------------------------------------------------------------------------
print("\nTEST 1 — Ke vs Table 26.9-1 (Eq. 26.9-1: Ke = exp(-0.0000362*ze))")
# Engine policy: Ke = 1.0 for ze <= 1000 (conservative, keeps Florida unchanged);
# above 1000 the exact formula applies. <=1000 tested vs 1.0; >1000 vs book.
for z, expected in [(0, 1.00), (500, 1.00), (1000, 1.00)]:
    check(f"Ke(z={z}) conservative", eng.calculate_ke(z), expected, 0.001)
for z, book in [(2000, 0.93), (3000, 0.90), (4000, 0.86), (5000, 0.83), (6000, 0.80)]:
    check(f"Ke(z={z}) formula", eng.calculate_ke(z), book, 0.01)
# REGRESSION GUARD: old buggy -2.0e-4 coefficient gave ~0.67 at 2000 ft.
if abs(eng.calculate_ke(2000) - 0.67) < 0.02:
    print("  [FAIL] Ke(2000) ~0.67 — old -2.0e-4 coefficient still present!")
    results.append(False)
else:
    print("  [PASS] Ke(2000) is NOT ~0.67 (old -2.0e-4 bug absent)")
    results.append(True)

# ---------------------------------------------------------------------------
# TEST 2 — Velocity pressure exposure coefficient Kz vs Table 26.10-1 (66 cells)
# ---------------------------------------------------------------------------
print("\nTEST 2 — Kz vs Table 26.10-1 (66 cells: B/C/D x 22 heights)")
# Ledger Table 26.10-1. Note the z_min clamp: Exposure B for h<30 -> 0.70.
# The engine hardcodes 0.70 for B when height<30, so the 0/15/20/25 B rows are
# tested against the clamped 0.70 (matching the engine's documented policy and
# the ledger's "h < z_min -> use value at z_min" rule). C and D rows use the raw
# table values from 0 ft up (their z_min clamps are tested separately below).
kz_table = {
    'B': {0: 0.70, 15: 0.70, 20: 0.70, 25: 0.70, 30: 0.70, 40: 0.74, 50: 0.79,
          60: 0.83, 70: 0.86, 80: 0.90, 90: 0.92, 100: 0.95, 120: 1.00,
          140: 1.04, 160: 1.08, 180: 1.11, 200: 1.14, 250: 1.21, 300: 1.27,
          350: 1.33, 400: 1.38, 450: 1.42, 500: 1.46},
    'C': {0: 0.85, 15: 0.85, 20: 0.90, 25: 0.94, 30: 0.98, 40: 1.04, 50: 1.09,
          60: 1.13, 70: 1.17, 80: 1.21, 90: 1.24, 100: 1.26, 120: 1.31,
          140: 1.34, 160: 1.39, 180: 1.41, 200: 1.44, 250: 1.51, 300: 1.57,
          350: 1.62, 400: 1.66, 450: 1.70, 500: 1.74},
    'D': {0: 1.03, 15: 1.03, 20: 1.08, 25: 1.12, 30: 1.16, 40: 1.22, 50: 1.27,
          60: 1.31, 70: 1.34, 80: 1.38, 90: 1.40, 100: 1.43, 120: 1.48,
          140: 1.52, 160: 1.55, 180: 1.58, 200: 1.61, 250: 1.68, 300: 1.73,
          350: 1.78, 400: 1.82, 450: 1.86, 500: 1.89},
}
for exp, rows in kz_table.items():
    for h, kz in rows.items():
        check(f"Kz[{exp}][{h}ft]", eng.calculate_kz(h, exp), kz, 0.001)

# z_min clamp checks (ledger Section 26.10.2): B(h<30)->0.70, C(h<15)->0.85, D(h<7)->1.03
print("\nTEST 2b — z_min clamp (Section 26.10.2)")
check("Kz B h=10 (<30) clamps to 0.70", eng.calculate_kz(10, 'B'), 0.70, 0.001)
check("Kz C h=10 (<15) clamps to 0.85", eng.calculate_kz(10, 'C'), 0.85, 0.001)
check("Kz D h=5  (<7)  clamps to 1.03", eng.calculate_kz(5, 'D'), 1.03, 0.001)

# ---------------------------------------------------------------------------
# TEST 3 — Terrain Exposure Constants vs Table 26.11-1
# ---------------------------------------------------------------------------
print("\nTEST 3 — Terrain constants vs Table 26.11-1 (alpha, zg, zmin)")
terrain_expected = {
    'B': {'alpha': 7.5, 'zg': 3280, 'zmin': 30},
    'C': {'alpha': 9.8, 'zg': 2460, 'zmin': 15},
    'D': {'alpha': 11.5, 'zg': 1935, 'zmin': 7},
}
for exp, vals in terrain_expected.items():
    tc = eng.get_terrain_constants(exp)
    check(f"alpha[{exp}]", tc['alpha'], vals['alpha'], 0.001)
    check(f"zg[{exp}]", tc['zg'], vals['zg'], 0.001)
    check(f"zmin[{exp}]", tc['zmin'], vals['zmin'], 0.001)

# ---------------------------------------------------------------------------
# TEST 4 — Kd for solid freestanding walls/signs vs Table 26.6-1 (= 0.85)
# ---------------------------------------------------------------------------
print("\nTEST 4 — Kd vs Table 26.6-1 (freestanding walls = 0.85)")
check("Kd", eng.Kd, 0.85, 0.001)

# ---------------------------------------------------------------------------
# TEST 5 — qz convention: Kd folded into qz exactly once
#   qz = 0.00256 * Kz * Kzt * Kd * Ke * V^2
# Hand-computed from the formula (NOT from the engine): V=115, Kz=1.0, Kzt=1.0,
# Kd=0.85, Ke=1.0 -> 0.00256*1.0*1.0*0.85*1.0*115^2 = 28.78 psf.
# Kd-missing would give 33.86; Kd-doubled would give 24.46.
# ---------------------------------------------------------------------------
print("\nTEST 5 — qz includes Kd exactly once (Eq. 26.10-1)")
qz = eng.calculate_velocity_pressure(115, 1.0, 1.0, 1.0)
check("qz with Kd once", qz, 0.00256 * 1.0 * 1.0 * 0.85 * 1.0 * 115 ** 2, 0.01)

# ---------------------------------------------------------------------------
# TEST 6 — GCpi: SKIPPED. This is a Chapter-29 force-coefficient engine; it has
# no internal pressure (no GCpi method). Confirm absence rather than assert.
# ---------------------------------------------------------------------------
print("\nTEST 6 — GCpi: SKIPPED (force-coefficient engine has no GCpi)")
if not hasattr(eng, 'get_gcpi') and 'GCpi' not in eng.__dict__:
    print("  [PASS] engine correctly has no GCpi method/attr")
    results.append(True)
else:
    print("  [WARN] unexpected GCpi present on a force-coefficient engine")

# ---------------------------------------------------------------------------
# TEST 7 — Fig 29.3-1 Case A/B Cf table (exact cells, from Cf_REFERENCE.md)
# get_cf_case_ab(s_over_h, B_over_s). Engine returns the raw table cell at an
# exact (s/h, B/s) breakpoint (no rounding). Spot-check full grid corners +
# representative interior cells across every s/h row.
# ---------------------------------------------------------------------------
print("\nTEST 7 — Fig 29.3-1 Case A/B Cf (exact table cells)")
# (s_over_h, B_over_s): Cf  — verified reference table
cf_ab_cells = {
    # s/h = 1.0 row (ground-mounted wall)
    (1.0, 0.05): 1.80, (1.0, 0.1): 1.70, (1.0, 0.2): 1.65, (1.0, 0.5): 1.55,
    (1.0, 1): 1.45, (1.0, 2): 1.40, (1.0, 4): 1.35, (1.0, 5): 1.35,
    (1.0, 10): 1.30, (1.0, 20): 1.30, (1.0, 30): 1.30, (1.0, 45): 1.30,
    # s/h = 0.9 row
    (0.9, 0.05): 1.85, (0.9, 1): 1.55, (0.9, 45): 1.40,
    # s/h = 0.7 row
    (0.7, 0.05): 1.90, (0.7, 5): 1.55, (0.7, 45): 1.55,
    # s/h = 0.5 row
    (0.5, 0.05): 1.95, (0.5, 1): 1.75, (0.5, 45): 1.75,
    # s/h = 0.3 row
    (0.3, 0.05): 1.95, (0.3, 10): 1.80, (0.3, 45): 1.85,
    # s/h = 0.2 row
    (0.2, 0.05): 1.95, (0.2, 10): 1.85, (0.2, 45): 1.95,
    # s/h = 0.16 row
    (0.16, 0.05): 1.95, (0.16, 1): 1.80, (0.16, 45): 1.95,
}
for (sh, bs), cf in cf_ab_cells.items():
    check(f"Cf_AB(s/h={sh}, B/s={bs})", eng.get_cf_case_ab(sh, bs), cf, 0.001)

# ---------------------------------------------------------------------------
# TEST 8 — Fig 29.3-1 Case C Cf, B/s = 2..10 (exact cells from reference)
# get_cf_case_c(B_over_s) -> dict {region: Cf}. Engine rounds to 4 decimals.
# ---------------------------------------------------------------------------
print("\nTEST 8 — Fig 29.3-1 Case C Cf (B/s = 2..10, exact cells)")
case_c_2_10 = {
    2:  {'0_to_s': 2.25, 's_to_2s': 1.50},
    3:  {'0_to_s': 2.60, 's_to_2s': 1.70, '2s_to_3s': 1.15},
    4:  {'0_to_s': 2.90, 's_to_2s': 1.90, '2s_to_3s': 1.30, '3s_to_10s': 1.10},
    5:  {'0_to_s': 3.10, 's_to_2s': 2.00, '2s_to_3s': 1.45, '3s_to_10s': 1.05},
    6:  {'0_to_s': 3.30, 's_to_2s': 2.15, '2s_to_3s': 1.55, '3s_to_10s': 1.05},
    7:  {'0_to_s': 3.40, 's_to_2s': 2.25, '2s_to_3s': 1.65, '3s_to_10s': 1.05},
    8:  {'0_to_s': 3.55, 's_to_2s': 2.30, '2s_to_3s': 1.70, '3s_to_10s': 1.05},
    9:  {'0_to_s': 3.65, 's_to_2s': 2.35, '2s_to_3s': 1.75, '3s_to_10s': 1.00},
    10: {'0_to_s': 3.75, 's_to_2s': 2.45, '2s_to_3s': 1.85, '3s_to_10s': 0.95},
}
for bs, regions in case_c_2_10.items():
    got = eng.get_cf_case_c(bs)
    for region, cf in regions.items():
        check(f"Cf_C(B/s={bs})[{region}]", got.get(region, float('nan')), cf, 0.001)

# ---------------------------------------------------------------------------
# TEST 9 — Fig 29.3-1 Case C Cf, B/s = 13 and 45 (subdivided regions)
# ---------------------------------------------------------------------------
print("\nTEST 9 — Fig 29.3-1 Case C Cf (B/s = 13, 45 subdivided)")
case_c_sub = {
    13: {'0_to_s': 4.00, 's_to_2s': 2.60, '2s_to_3s': 2.00,
         '3s_to_4s': 1.50, '4s_to_5s': 1.35, '5s_to_10s': 0.90, 'gt_10s': 0.55},
    45: {'0_to_s': 4.30, 's_to_2s': 2.55, '2s_to_3s': 1.95,
         '3s_to_4s': 1.85, '4s_to_5s': 1.85, '5s_to_10s': 1.10, 'gt_10s': 0.55},
}
for bs, regions in case_c_sub.items():
    got = eng.get_cf_case_c(bs)
    for region, cf in regions.items():
        check(f"Cf_C(B/s={bs})[{region}]", got.get(region, float('nan')), cf, 0.001)

# ---------------------------------------------------------------------------
# TEST 10 — Return-corner reduction factor (reference table)
#   Lr/s: 0.3 -> 0.90, 1.0 -> 0.75, >=2 -> 0.60. Applied to asterisked
#   Case C "0_to_s" values for B/s >= 5. Verify on B/s = 5 (0_to_s = 3.10):
#     Lr/s=1.0 -> 3.10*0.75 = 2.325
# ---------------------------------------------------------------------------
print("\nTEST 10 — Return-corner reduction (Fig 29.3-1 reduction table)")
check("reduction Lr/s=0.3", eng._get_return_corner_reduction(0.3), 0.90, 0.001)
check("reduction Lr/s=1.0", eng._get_return_corner_reduction(1.0), 0.75, 0.001)
check("reduction Lr/s=2.0", eng._get_return_corner_reduction(2.0), 0.60, 0.001)
got_rc = eng.get_cf_case_c(5, has_return_corner=True, Lr_over_s=1.0)
check("Cf_C(B/s=5) 0_to_s w/ return corner (3.10*0.75)",
      got_rc.get('0_to_s', float('nan')), 3.10 * 0.75, 0.001)

# ---------------------------------------------------------------------------
# TEST 11 — Openings reduction Note 1: factor = (1 - (1 - eps)^1.5)
#   eps=1.0 -> 1.0 ; eps=0.7 -> 1 - 0.3^1.5 = 0.8357...
# ---------------------------------------------------------------------------
print("\nTEST 11 — Openings reduction Note 1 (1 - (1-eps)^1.5)")
check("openings eps=1.0", eng.get_openings_reduction(1.0), 1.0, 0.001)
check("openings eps=0.7", eng.get_openings_reduction(0.7), 1 - 0.3 ** 1.5, 0.001)

# ---------------------------------------------------------------------------
# TEST 12 — End-to-end F = qh * G * Cf * As (Eq. 29.3-1), hand-computed
# Ground-mounted wall: s = h = 30 ft, B = 30 ft (B/s = 1.0, s/h = 1.0),
# Exposure C, V = 115 mph, sea level, fully solid.
#   Kz(h=30,C) = 0.98 (ledger), Kzt = 1.0, Ke = 1.0, Kd = 0.85, G = 0.85
#   qh = 0.00256*0.98*1.0*0.85*1.0*115^2 = 28.20 psf
#   Cf (s/h=1.0, B/s=1.0) = 1.45 (reference)
#   As = 30*30 = 900 ft^2
#   F  = 28.20 * 0.85 * 1.45 * 900 = 31283 lb  (compute exactly below)
# ---------------------------------------------------------------------------
print("\nTEST 12 — End-to-end F = qh*G*Cf*As (Eq. 29.3-1)")
qh_expected = 0.00256 * 0.98 * 1.0 * 0.85 * 1.0 * 115 ** 2
G = 0.85
cf_expected = 1.45
As_expected = 900.0
F_expected = qh_expected * G * cf_expected * As_expected
res = eng.calculate_wall_forces(
    wind_speed=115, speed_type='ultimate', exposure_category='C',
    wall_height=30, wall_length=30, clearance=0, elevation_ft=0,
    solidity_ratio=1.0,
)
check("qh_psf", res['velocity_pressure']['qh_psf'], round(qh_expected, 2), 0.05)
check("Case A Cf (s/h=1, B/s=1)", res['case_a']['Cf'], cf_expected, 0.001)
check("gross area As", res['input_parameters']['gross_area_sqft'], As_expected, 0.01)
check("Case A force F", res['case_a']['force_lbs'], F_expected, 5.0)

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
