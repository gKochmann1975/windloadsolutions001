"""
Solid Freestanding Signs engine verification harness — ASCE 7-22.

Engine under test: webapp/asce7_22_other_signs.py
  class ASCE7_SignsCalculator  (Chapter 29, Section 29.3, Figure 29.3-1)

Every EXPECTED value below comes from the VERIFIED-VALUES LEDGER, never from the
engine's own output (ASCE ledger Rule 4):
  - Ch 26 universals: reference_asce_7_22_verified_values.md (Tables 26.6-1,
    26.9-1, 26.10-1, 26.11-1; Eq. 26.10-1 qz convention)
  - Fig 29.3-1 Cf (Cases A/B, Case C, return-corner reduction, opening reduction):
    ASCE 7-22/SIGNS_FREESTANDING_WALLS_Cf_REFERENCE.md (user-verified Feb 2026)

Run from repo root:
    C:/Python312/python.exe tests/test_engine_signs.py

Exit code 0 = all pass, 1 = at least one failure. A FAIL is a real engine-vs-ledger
finding, not something to paper over.
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

import asce7_22_other_signs as signs_mod

PASS = "PASS"
FAIL = "FAIL"
results = []


def check(name, got, expected, tol):
    ok = abs(got - expected) <= tol
    results.append(ok)
    status = PASS if ok else FAIL
    print(f"  [{status}] {name}: got {got:.4f}, expected {expected:.4f} (tol {tol})")
    return ok


def check_true(name, condition):
    ok = bool(condition)
    results.append(ok)
    status = PASS if ok else FAIL
    print(f"  [{status}] {name}")
    return ok


eng = signs_mod.ASCE7_SignsCalculator()

# ---------------------------------------------------------------------------
# TEST 1 — Kd (Table 26.6-1): solid freestanding signs/walls = 0.85
# ---------------------------------------------------------------------------
print("\nTEST 1 — Kd (Table 26.6-1, attached & freestanding signs = 0.85)")
check("Kd", eng.Kd, 0.85, 0.001)

# ---------------------------------------------------------------------------
# TEST 2 — G gust-effect factor, rigid structures (Section 26.11.1) = 0.85
# ---------------------------------------------------------------------------
print("\nTEST 2 — G gust-effect factor (Section 26.11.1, rigid = 0.85)")
check("G", eng.G, 0.85, 0.001)

# ---------------------------------------------------------------------------
# TEST 3 — Terrain Exposure Constants (Table 26.11-1)
# alpha B/C/D = 7.5/9.8/11.5; zg = 3280/2460/1935; zmin = 30/15/7
# ---------------------------------------------------------------------------
print("\nTEST 3 — Terrain constants (Table 26.11-1)")
terrain_expected = {
    'B': {'alpha': 7.5, 'zg': 3280, 'zmin': 30},
    'C': {'alpha': 9.8, 'zg': 2460, 'zmin': 15},
    'D': {'alpha': 11.5, 'zg': 1935, 'zmin': 7},
}
for exp, vals in terrain_expected.items():
    tc = eng.get_terrain_constants(exp)
    check(f"alpha[{exp}]", tc['alpha'], vals['alpha'], 0.001)
    check(f"zg[{exp}]", tc['zg'], vals['zg'], 0.5)
    check(f"zmin[{exp}]", tc['zmin'], vals['zmin'], 0.001)

# ---------------------------------------------------------------------------
# TEST 4 — Ground Elevation Factor Ke (Table 26.9-1 / Eq. 26.9-1)
# Engine policy: Ke = 1.0 for ze <= 1000 (conservative); above, exact formula.
# REGRESSION GUARD: Ke(2000) must NOT be ~0.67 (old -2.0e-4 coefficient bug).
# ---------------------------------------------------------------------------
print("\nTEST 4 — Ke vs Table 26.9-1 (Eq. 26.9-1: Ke = exp(-0.0000362*ze))")
for z, expected in [(0, 1.00), (500, 1.00), (1000, 1.00)]:
    check(f"Ke(z={z}) conservative", eng.calculate_ke(z), expected, 0.001)
for z, book in [(2000, 0.93), (3000, 0.90), (4000, 0.86), (5000, 0.83), (6000, 0.80)]:
    check(f"Ke(z={z}) formula", eng.calculate_ke(z), book, 0.01)
check_true("Ke(2000) NOT ~0.67 (old -2.0e-4 bug absent)",
           abs(eng.calculate_ke(2000) - 0.67) >= 0.02)

# ---------------------------------------------------------------------------
# TEST 5 — Kz velocity pressure exposure coefficient (Table 26.10-1)
# All 66 tabulated cells (22 heights x 3 exposures). For Exposure B, heights
# below z_min=30 are tested separately (TEST 6) because the engine returns the
# z_min clamp (0.70) there per Section 26.10.2, not the raw 0-15/20/25 table row.
# ---------------------------------------------------------------------------
print("\nTEST 5 — Kz vs Table 26.10-1 (tabulated heights >= z_min)")
kz_table = {
    'B': {30: 0.70, 40: 0.74, 50: 0.79, 60: 0.83, 70: 0.86, 80: 0.90, 90: 0.92,
          100: 0.95, 120: 1.00, 140: 1.04, 160: 1.08, 180: 1.11, 200: 1.14,
          250: 1.21, 300: 1.27, 350: 1.33, 400: 1.38, 450: 1.42, 500: 1.46},
    'C': {15: 0.85, 20: 0.90, 25: 0.94, 30: 0.98, 40: 1.04, 50: 1.09, 60: 1.13,
          70: 1.17, 80: 1.21, 90: 1.24, 100: 1.26, 120: 1.31, 140: 1.34,
          160: 1.39, 180: 1.41, 200: 1.44, 250: 1.51, 300: 1.57, 350: 1.62,
          400: 1.66, 450: 1.70, 500: 1.74},
    'D': {7: 1.03, 15: 1.03, 20: 1.08, 25: 1.12, 30: 1.16, 40: 1.22, 50: 1.27,
          60: 1.31, 70: 1.34, 80: 1.38, 90: 1.40, 100: 1.43, 120: 1.48,
          140: 1.52, 160: 1.55, 180: 1.58, 200: 1.61, 250: 1.68, 300: 1.73,
          350: 1.78, 400: 1.82, 450: 1.86, 500: 1.89},
}
for exp, cells in kz_table.items():
    for h, kz in cells.items():
        check(f"Kz[{exp}] z={h}", eng.calculate_kz(h, exp), kz, 0.001)

# ---------------------------------------------------------------------------
# TEST 6 — Kz z_min clamp (Section 26.10.2):
#   B (h<30) -> 0.70, C (h<15) -> 0.85, D (h<7) -> 1.03
# ---------------------------------------------------------------------------
print("\nTEST 6 — Kz z_min clamp (Section 26.10.2)")
check("Kz[B] z=15 (clamp -> 0.70)", eng.calculate_kz(15, 'B'), 0.70, 0.001)
check("Kz[B] z=25 (clamp -> 0.70)", eng.calculate_kz(25, 'B'), 0.70, 0.001)
check("Kz[C] z=10 (clamp -> 0.85)", eng.calculate_kz(10, 'C'), 0.85, 0.001)
check("Kz[D] z=5 (clamp -> 1.03)", eng.calculate_kz(5, 'D'), 1.03, 0.001)

# ---------------------------------------------------------------------------
# TEST 7 — qz convention (Eq. 26.10-1): qz = 0.00256*Kz*Kzt*Kd*Ke*V^2
# Confirm Kd folded in EXACTLY ONCE. With Kz=Kzt=Ke=1, V=100:
#   0.00256 * 1 * 1 * 0.85 * 1 * 100^2 = 21.76 psf  (Kd present once)
#   without Kd it would be 25.6; doubled Kd would be 18.496.
# ---------------------------------------------------------------------------
print("\nTEST 7 — qz folds Kd in exactly once (Eq. 26.10-1)")
qz = eng.calculate_velocity_pressure(100, 1.0, 1.0, 1.0)
check("qz(V=100,Kz=Kzt=Ke=1) = 0.00256*0.85*100^2", qz, 21.76, 0.01)

# ---------------------------------------------------------------------------
# TEST 8 — Figure 29.3-1 Cf, Cases A/B — exact tabulated cells.
# Source: SIGNS_FREESTANDING_WALLS_Cf_REFERENCE.md (rows = s/h, cols = B/s).
# Engine clamps s/h to [0.16,1.0] and B/s to [0.05,45], so corner/edge cells
# are exact table values.
# ---------------------------------------------------------------------------
print("\nTEST 8 — Fig 29.3-1 Cf Cases A/B (exact cells)")
cf_ab = {
    1.0:  {0.05: 1.80, 0.1: 1.70, 0.2: 1.65, 0.5: 1.55, 1: 1.45, 2: 1.40,
           4: 1.35, 5: 1.35, 10: 1.30, 20: 1.30, 30: 1.30, 45: 1.30},
    0.9:  {0.05: 1.85, 0.1: 1.75, 0.2: 1.70, 0.5: 1.60, 1: 1.55, 2: 1.50,
           4: 1.45, 5: 1.45, 10: 1.40, 20: 1.40, 30: 1.40, 45: 1.40},
    0.7:  {0.05: 1.90, 0.1: 1.85, 0.2: 1.75, 0.5: 1.70, 1: 1.65, 2: 1.60,
           4: 1.60, 5: 1.55, 10: 1.55, 20: 1.55, 30: 1.55, 45: 1.55},
    0.5:  {0.05: 1.95, 0.1: 1.85, 0.2: 1.80, 0.5: 1.75, 1: 1.75, 2: 1.70,
           4: 1.70, 5: 1.70, 10: 1.70, 20: 1.70, 30: 1.70, 45: 1.75},
    0.3:  {0.05: 1.95, 0.1: 1.90, 0.2: 1.85, 0.5: 1.80, 1: 1.80, 2: 1.80,
           4: 1.80, 5: 1.80, 10: 1.80, 20: 1.85, 30: 1.85, 45: 1.85},
    0.2:  {0.05: 1.95, 0.1: 1.90, 0.2: 1.85, 0.5: 1.80, 1: 1.80, 2: 1.80,
           4: 1.80, 5: 1.80, 10: 1.85, 20: 1.90, 30: 1.90, 45: 1.95},
    0.16: {0.05: 1.95, 0.1: 1.90, 0.2: 1.85, 0.5: 1.85, 1: 1.80, 2: 1.80,
           4: 1.85, 5: 1.85, 10: 1.85, 20: 1.90, 30: 1.90, 45: 1.95},
}
for s_h, row in cf_ab.items():
    for b_s, cf in row.items():
        check(f"Cf A/B s/h={s_h} B/s={b_s}", eng.get_cf_case_ab(s_h, b_s), cf, 0.001)

# ---------------------------------------------------------------------------
# TEST 9 — Figure 29.3-1 Cf, Case C — exact tabulated cells (B/s = 2..10).
# Regions present per B/s: 2 -> {0_to_s, s_to_2s}; 3 -> +2s_to_3s;
# 4..10 -> +3s_to_10s.
# ---------------------------------------------------------------------------
print("\nTEST 9 — Fig 29.3-1 Cf Case C (B/s 2..10)")
case_c = {
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
for b_s, regions in case_c.items():
    got = eng.get_cf_case_c(b_s)
    for region, cf in regions.items():
        check(f"Cf C B/s={b_s} [{region}]", got.get(region, -999), cf, 0.001)

# ---------------------------------------------------------------------------
# TEST 10 — Case C subdivided regions (B/s = 13 and >=45).
# ---------------------------------------------------------------------------
print("\nTEST 10 — Fig 29.3-1 Cf Case C subdivided (B/s 13 & 45)")
case_c_sub = {
    13: {'0_to_s': 4.00, 's_to_2s': 2.60, '2s_to_3s': 2.00,
         '3s_to_4s': 1.50, '4s_to_5s': 1.35, '5s_to_10s': 0.90, 'gt_10s': 0.55},
    45: {'0_to_s': 4.30, 's_to_2s': 2.55, '2s_to_3s': 1.95,
         '3s_to_4s': 1.85, '4s_to_5s': 1.85, '5s_to_10s': 1.10, 'gt_10s': 0.55},
}
for b_s, regions in case_c_sub.items():
    got = eng.get_cf_case_c(b_s)
    for region, cf in regions.items():
        check(f"Cf C B/s={b_s} [{region}]", got.get(region, -999), cf, 0.001)

# ---------------------------------------------------------------------------
# TEST 11 — Return-corner reduction factors (Fig 29.3-1).
# Lr/s: 0.3 -> 0.90, 1.0 -> 0.75, >=2 -> 0.60.
# ---------------------------------------------------------------------------
print("\nTEST 11 — Return-corner reduction factor (Fig 29.3-1)")
check("reduction Lr/s=0.3", eng._get_return_corner_reduction(0.3), 0.90, 0.001)
check("reduction Lr/s=1.0", eng._get_return_corner_reduction(1.0), 0.75, 0.001)
check("reduction Lr/s=2.0", eng._get_return_corner_reduction(2.0), 0.60, 0.001)
check("reduction Lr/s=3.0 (clamp 0.60)", eng._get_return_corner_reduction(3.0), 0.60, 0.001)

# ---------------------------------------------------------------------------
# TEST 12 — Opening reduction (Note 1): factor = 1 - (1 - eps)^1.5.
# eps=1.0 -> 1.0; eps=0.9 -> 1 - 0.1^1.5 = 0.968377; eps=0.7 -> 1 - 0.3^1.5 = 0.835718.
# ---------------------------------------------------------------------------
print("\nTEST 12 — Opening reduction factor (Note 1: 1-(1-eps)^1.5)")
check("opening eps=1.0", eng.get_openings_reduction(1.0), 1.0, 0.0001)
check("opening eps=0.9", eng.get_openings_reduction(0.9), 1 - 0.1 ** 1.5, 0.0001)
check("opening eps=0.7", eng.get_openings_reduction(0.7), 1 - 0.3 ** 1.5, 0.0001)

# ---------------------------------------------------------------------------
# TEST 13 — End-to-end force (Eq. 29.3-1: F = qh*G*Cf*As) cross-check.
# Wall on ground (s/h = 1) so Cf from the s/h=1 row. Inputs:
#   V=100 mph ultimate, Exposure C, h=30 ft, s=30 ft, B=30 ft -> s/h=1, B/s=1.
#   Ledger pieces: Kz[C,30]=0.98, Kzt=1.0, Ke=1.0, Kd=0.85, G=0.85,
#                  Cf(s/h=1,B/s=1)=1.45, As=900 ft^2.
#   qh = 0.00256*0.98*1.0*0.85*1.0*100^2 = 21.32 psf
#   F  = 21.32 * 0.85 * 1.45 * 900 = 23,651 lb  (Case A)
# Every factor is a ledger value; only the arithmetic is the engine's job.
# ---------------------------------------------------------------------------
print("\nTEST 13 — End-to-end F (Eq. 29.3-1) from ledger factors")
res = eng.calculate_sign_forces(
    wind_speed=100, speed_type='ultimate', exposure_category='C',
    sign_height_h=30, sign_vertical_s=30, sign_horizontal_B=30,
    elevation_ft=0,
)
qh_expected = 0.00256 * 0.98 * 1.0 * 0.85 * 1.0 * 100 ** 2
check("qh (ledger Kz[C,30]=0.98)", res['velocity_pressure']['qh_psf'], qh_expected, 0.05)
check("Cf Case A (s/h=1,B/s=1=1.45)", res['case_a']['Cf'], 1.45, 0.001)
F_expected = qh_expected * 0.85 * 1.45 * 900
check("F Case A (qh*G*Cf*As)", res['case_a']['force_lbs'], F_expected, 5.0)

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
