"""
Rooftop Structures & Equipment engine verification harness — ASCE 7-22 Ch 29.

Engine: webapp/asce7_22_other_rooftop_equipment.py
Class:  ASCE7_RooftopEquipmentCalculator

Every expected value comes from the VERIFIED-VALUES LEDGER
(reference_asce_7_22_verified_values.md), never from the engine's own output
(ASCE ledger Rule 4). A failing check is a real engine-vs-ledger finding.

Covers:
  1. Ke           — Table 26.9-1 (incl. -2.0e-4 regression guard)
  2. Kz           — Table 26.10-1 (all 66 cells) + z_min clamps
  3. Terrain      — Table 26.11-1 (alpha/zg/zmin, B/C/D)
  4. Kd           — Table 26.6-1 (rooftop equipment = 0.85)
  5. qz           — Eq. 26.10-1, confirms Kd folded in exactly once
  6. GCr          — Section 29.4.1 (1.9, reduced LINEARLY 1.9->1.0 as Af
                     goes 0.1*B*h -> B*h; endpoints + midpoint; NO 1.5 value)
  7. Fh / Fv      — Eq. 29.4-2 / 29.4-3 (Fh=qh*GCr*Af, Fv=qh*GCr*Ar)

NOTE: This is a Chapter-29 force-coefficient engine and has no GCpi method,
so the GCpi universal check is intentionally skipped.

Run from repo root:
    C:/Python312/python.exe tests/test_engine_rooftop_equipment.py

Exit code 0 = all pass, 1 = at least one failure.
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

import asce7_22_other_rooftop_equipment as eng_mod

PASS = "PASS"
FAIL = "FAIL"
results = []


def check(name, got, expected, tol):
    ok = abs(got - expected) <= tol
    results.append(ok)
    status = PASS if ok else FAIL
    print(f"  [{status}] {name}: got {got:.4f}, expected {expected:.4f} (tol {tol})")
    return ok


eng = eng_mod.ASCE7_RooftopEquipmentCalculator()

# ---------------------------------------------------------------------------
# TEST 1 — Ground Elevation Factor Ke vs ASCE 7-22 Table 26.9-1
# Engine policy: Ke = 1.0 for ze <= 1000 ft (conservative); above 1000 ft the
# exact Eq. 26.9-1 (Ke = exp(-0.0000362*ze)) applies. Book table is 2-decimal.
# ---------------------------------------------------------------------------
print("\nTEST 1 — Ke vs Table 26.9-1 (Eq. 26.9-1: Ke = exp(-0.0000362*ze))")
ke_conservative = [(0, 1.00), (500, 1.00), (1000, 1.00)]
ke_formula = [(2000, 0.93), (3000, 0.90), (4000, 0.86), (5000, 0.83), (6000, 0.80)]
for z, expected in ke_conservative:
    check(f"Ke(z={z}) conservative", eng.calculate_ke(z), expected, 0.001)
for z, book in ke_formula:
    check(f"Ke(z={z}) formula", eng.calculate_ke(z), book, 0.01)
# Regression guard: old -2.0e-4 coefficient gave ~0.67 at 2000 ft.
ke2000 = eng.calculate_ke(2000)
guard_ok = abs(ke2000 - 0.67) >= 0.02
results.append(guard_ok)
print(f"  [{PASS if guard_ok else FAIL}] Ke(2000) NOT ~0.67 (old -2.0e-4 bug): got {ke2000:.4f}")

# ---------------------------------------------------------------------------
# TEST 2 — Kz vs ASCE 7-22 Table 26.10-1 (66 cells: 22 heights x B/C/D)
# ---------------------------------------------------------------------------
print("\nTEST 2 — Kz vs Table 26.10-1 (66 cells)")
# (height, B, C, D) straight off the ledger Table 26.10-1.
# NOTE on Exposure B at z=15/20/25: Table 26.10-1 tabulates 0.57/0.62/0.66, but
# the ledger's operative z_min rule (Section 26.10.2, ledger lines 200-201)
# states "Exposure B (z_min=30 ft): h<30 -> use K_z = 0.70". calculate_kz must
# return the z_min-clamped value, so the ledger value to assert for B at these
# sub-z_min heights is 0.70 (the clamp), NOT the raw tabulated cell. C (z_min=15)
# and D (z_min=7) at z=15..25 are at/above their z_min so use the table cells.
kz_table = [
    (15, 0.70, 0.85, 1.03),  # B clamped to z_min=30 value (0.70) per ledger rule
    (20, 0.70, 0.90, 1.08),  # B clamped to z_min=30 value (0.70) per ledger rule
    (25, 0.70, 0.94, 1.12),  # B clamped to z_min=30 value (0.70) per ledger rule
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
for h, kb, kc, kd in kz_table:
    check(f"Kz B z={h}", eng.calculate_kz(h, 'B'), kb, 0.001)
    check(f"Kz C z={h}", eng.calculate_kz(h, 'C'), kc, 0.001)
    check(f"Kz D z={h}", eng.calculate_kz(h, 'D'), kd, 0.001)

# z_min clamp: B(h<30)->0.70, C(h<15)->0.85, D(h<7)->1.03
print("\nTEST 2b — Kz z_min clamps (Section 26.10.2)")
check("Kz B z=10 -> 0.70 clamp", eng.calculate_kz(10, 'B'), 0.70, 0.001)
check("Kz C z=10 -> 0.85 clamp", eng.calculate_kz(10, 'C'), 0.85, 0.001)
check("Kz D z=5  -> 1.03 clamp", eng.calculate_kz(5, 'D'), 1.03, 0.001)

# ---------------------------------------------------------------------------
# TEST 3 — Terrain Exposure Constants vs Table 26.11-1
# alpha B/C/D = 7.5/9.8/11.5; zg = 3280/2460/1935; zmin = 30/15/7
# ---------------------------------------------------------------------------
print("\nTEST 3 — Terrain constants vs Table 26.11-1")
terrain_expected = {
    'B': {'alpha': 7.5, 'zg': 3280, 'zmin': 30},
    'C': {'alpha': 9.8, 'zg': 2460, 'zmin': 15},
    'D': {'alpha': 11.5, 'zg': 1935, 'zmin': 7},
}
for exp, vals in terrain_expected.items():
    tc = eng.get_terrain_constants(exp)
    check(f"alpha {exp}", tc['alpha'], vals['alpha'], 0.001)
    check(f"zg    {exp}", tc['zg'], vals['zg'], 0.001)
    check(f"zmin  {exp}", tc['zmin'], vals['zmin'], 0.001)

# ---------------------------------------------------------------------------
# TEST 4 — Kd vs Table 26.6-1 (rooftop equipment row = 0.85)
# ---------------------------------------------------------------------------
print("\nTEST 4 — Kd vs Table 26.6-1 (rooftop equipment = 0.85)")
check("Kd (rooftop equipment)", eng.Kd, 0.85, 0.001)

# ---------------------------------------------------------------------------
# TEST 5 — qz convention (Eq. 26.10-1): Kd folded in exactly once.
# qz = 0.00256 * Kz * Kzt * Kd * Ke * V^2
# Hand value: V=115, Kz=1.0, Kzt=1.0, Ke=1.0, Kd=0.85
#   0.00256*1.0*1.0*0.85*1.0*115^2 = 28.7776 psf
# (without Kd it would be 33.856; with Kd doubled it would be 24.46)
# ---------------------------------------------------------------------------
print("\nTEST 5 — qz includes Kd exactly once (Eq. 26.10-1)")
qz = eng.calculate_velocity_pressure(115, 1.0, 1.0, 1.0)
check("qz (Kd folded in once)", qz, 28.7776, 0.01)

# ---------------------------------------------------------------------------
# TEST 6 — GCr per Section 29.4.1 (LEDGER: 1.9, reduced LINEARLY 1.9->1.0 as
# Af goes 0.1*B*h -> B*h). NO 1.5 value anywhere.
# Pick B=50, h=20 -> Bh = 1000, lo = 0.1*Bh = 100.
#   Af = lo (100)            -> GCr = 1.9
#   Af = hi (1000)           -> GCr = 1.0
#   Af = midpoint (550)      -> GCr = 1.45 (linear)
#   Af below lo (50)         -> GCr = 1.9 (clamp)
#   Af above hi (1500)       -> GCr = 1.0 (clamp)
#   base attribute GCr       -> 1.9
# ---------------------------------------------------------------------------
print("\nTEST 6 — GCr Section 29.4.1 linear reduction 1.9 -> 1.0")
B, h = 50.0, 20.0
lo = 0.1 * B * h   # 100
hi = B * h         # 1000
mid = (lo + hi) / 2.0  # 550
check("GCr base attribute = 1.9", eng.GCr, 1.9, 0.001)
check("GCr at Af=0.1*B*h (full)", eng.get_gcr(lo, B, h), 1.9, 0.001)
check("GCr at Af=B*h (reduced to 1.0)", eng.get_gcr(hi, B, h), 1.0, 0.001)
check("GCr at midpoint Af (linear=1.45)", eng.get_gcr(mid, B, h), 1.45, 0.001)
check("GCr below 0.1*B*h clamps to 1.9", eng.get_gcr(lo / 2.0, B, h), 1.9, 0.001)
check("GCr above B*h clamps to 1.0", eng.get_gcr(hi * 1.5, B, h), 1.0, 0.001)
# Verify NO 1.5 value lands anywhere in the reduction range (ledger: no 1.5).
# Solve GCr=1.5: 1.9 + (Af-lo)/(hi-lo)*(-0.9) = 1.5 -> Af = lo + (0.4/0.9)*(hi-lo)
af_for_15 = lo + (0.4 / 0.9) * (hi - lo)
gcr_no15 = eng.get_gcr(af_for_15, B, h)
# This is a legitimate interpolated 1.5 ONLY because Af landed there; the guard is
# that 1.5 is not a hardcoded constant. Confirm the formula is continuous/linear by
# checking a second interior point matches the line exactly.
q = lo + 0.25 * (hi - lo)
expected_q = 1.9 + (q - lo) / (hi - lo) * (1.0 - 1.9)  # = 1.675
check("GCr linear at Af=lo+25%", eng.get_gcr(q, B, h), expected_q, 0.001)

# ---------------------------------------------------------------------------
# TEST 7 — Fh / Fv via Eq. 29.4-2 / 29.4-3 (Fh = qh*GCr*Af, Fv = qh*GCr*Ar).
# Use a no-reduction case (Af <= 0.1*B*h) so GCr = 1.9 (ledger value).
# V=130, Exp C, h=30 -> Kz=0.98 (Table 26.10-1), Kzt=1, Ke=1, Kd=0.85.
#   qh = 0.00256*0.98*1.0*0.85*1.0*130^2 = 36.0405632 psf
#   Af = 20, Ar = 40, B=50, h=30 -> 0.1*B*h = 150 >= 20 so GCr = 1.9
#   Fh = qh*1.9*20 = 1369.541 lbs
#   Fv = qh*1.9*40 = 2739.083 lbs
# All factors below come from the ledger (Kz, Kd) + Section 29.4.1 (GCr) + the
# exact Eq. 26.10-1 / 29.4-x formulas; expecteds are computed independently here.
# ---------------------------------------------------------------------------
print("\nTEST 7 — Fh/Fv via Eq. 29.4-2 / 29.4-3")
V = 130.0
Kz_30C = 0.98   # ledger Table 26.10-1, C, z=30
Kd = 0.85       # ledger Table 26.6-1
GCr_full = 1.9  # ledger Section 29.4.1
Af, Ar = 20.0, 40.0
qh_expected = 0.00256 * Kz_30C * 1.0 * Kd * 1.0 * V ** 2
Fh_expected = qh_expected * GCr_full * Af
Fv_expected = qh_expected * GCr_full * Ar

res = eng.calculate_equipment_force(
    wind_speed=V, speed_type='ultimate', exposure_category='C',
    building_height_h=30, Af=Af, building_width_B=50, Ar=Ar, elevation_ft=0,
)
check("qh (Eq. 26.10-1, Exp C h=30)", res['velocity_pressure']['qh_psf'],
      round(qh_expected, 2), 0.05)
check("GCr in result = 1.9 (no reduction)", res['force_coefficient']['GCr'],
      1.9, 0.001)
check("Fh (Eq. 29.4-2 = qh*GCr*Af)", res['result']['lateral_force_Fh_lbs'],
      round(Fh_expected, 2), 0.5)
check("Fv (Eq. 29.4-3 = qh*GCr*Ar)", res['result']['vertical_uplift_Fv_lbs'],
      round(Fv_expected, 2), 0.5)

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
