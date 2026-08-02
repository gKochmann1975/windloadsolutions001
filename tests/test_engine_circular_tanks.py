"""
Circular bins/silos/tanks engine verification — ASCE 7-22 §29.4.2.

Guards `asce7_22_other_circular_tanks.py`. Expected values encode the BOOK
(Fig 29.4-5 roof Cp; §29.4.2.1 Cf=0.63; Table 26.6-1 Kd; Eq 29.4-1/29.4-4),
NOT the engine (Rule 4). Ch-26 base (Kz/Ke/qz) is inherited from the verified
chimneys/tanks engine.

Run from repo root:
    C:/Python312/python.exe tests/test_engine_circular_tanks.py
Exit 0 = all pass, 1 = at least one failure.
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

import asce7_22_other_circular_tanks as tank_mod

results = []


def check(name, got, expected, tol=0.01):
    ok = abs(got - expected) <= tol
    results.append(ok)
    print(f"  [{'PASS' if ok else 'FAIL'}] {name}: got {got:.4f}, expected {expected:.4f} (tol {tol})")


def check_true(name, cond):
    results.append(bool(cond))
    print(f"  [{'PASS' if cond else 'FAIL'}] {name}")


eng = tank_mod.ASCE7_CircularTanksCalculator()

# ---------------------------------------------------------------------------
print("TEST 1 — Kd (round, Table 26.6-1 = 1.0) + book coefficient constants")
check("Kd round = 1.0", eng.get_kd('round'), 1.0, 0.001)
check("simplified wall Cf = 0.63", eng.SIMPLIFIED_CF, 0.63, 0.001)
check("roof Cp Zone 1 = -0.8", eng.ROOF_CP[1], -0.8, 0.001)
check("roof Cp Zone 2 = -0.5", eng.ROOF_CP[2], -0.5, 0.001)

# ---------------------------------------------------------------------------
# TEST 2 — Roof pressure, Eq 29.4-4  p = qh·(G·Cp − GCpi), G=0.85, Kd in qh.
# Case: V=150 Ult, Exp C, enclosed, h=30, D=40, H=25, theta=5 (flat).
# qh = 0.00256*Kz(0.98)*1*Kd(1.0)*1*150^2 = 56.4480 psf
#   Zone1: G·Cp=0.85*-0.8=-0.68 -> neg=qh*(-0.68-0.18)=-48.55 ; pos=qh*(-0.68+0.18)=-28.22
#   Zone2: G·Cp=0.85*-0.5=-0.425-> neg=qh*(-0.425-0.18)=-34.15
# ---------------------------------------------------------------------------
print("\nTEST 2 — roof pressure Eq 29.4-4 (Exp C, h=30, enclosed)")
qh = 0.00256 * 0.98 * 1.0 * 1.0 * 1.0 * 150 ** 2
r = eng.calculate_roof_pressure(150, 'ultimate', 'C', 'enclosed', 30, 40, 25, 5.0)
check("qh (Kz=0.98, Kd=1.0 in qh)", r['velocity_pressure']['qh_psf'], round(qh, 2), 0.05)
check("Zone1 G·Cp = -0.68", r['zones']['zone_1']['G_Cp'], -0.68, 0.001)
check("Zone1 max_negative", r['zones']['zone_1']['max_negative_psf'], qh * (-0.68 - 0.18), 0.1)
check("Zone1 max_positive (least neg)", r['zones']['zone_1']['max_positive_psf'], qh * (-0.68 + 0.18), 0.1)
check("Zone2 max_negative", r['zones']['zone_2']['max_negative_psf'], qh * (-0.425 - 0.18), 0.1)

# ---------------------------------------------------------------------------
# TEST 3 — Roof zone boundary b (Fig 29.4-5). H/D=25/40=0.625, theta<10.
#   interp 0.5->0.5D(20) and 1.0->(0.1*30+0.6*40=27): at 0.625 -> 21.75
#   conical (theta>=10): Zone 1 = 0.6D = 24
# ---------------------------------------------------------------------------
print("\nTEST 3 — roof Zone-1 dimension b")
check("b (theta<10, H/D=0.625) = 21.75", eng.roof_zone_boundary_b(40, 25, 30, 5), 21.75, 0.01)
check("b (theta=20 conical) = 0.6D = 24", eng.roof_zone_boundary_b(40, 25, 30, 20), 24.0, 0.01)
check("b (H/D=0.25) = 0.2D = 8", eng.roof_zone_boundary_b(40, 10, 30, 5), 8.0, 0.01)

# ---------------------------------------------------------------------------
# TEST 4 — Wall drag, Eq 29.4-1  F = qz·G·Cf·Af, Cf=0.63, Af=D*H.
# Case: V=150 Ult, Exp C, D=40, H=25, Z=H/2=12.5 -> Kz(12.5<15,C)=0.85.
#   qz = 0.00256*0.85*22500 = 48.96 ; F = 48.96*0.85*0.63*1000 = 26218 lbs
# ---------------------------------------------------------------------------
print("\nTEST 4 — wall drag Eq 29.4-1 (Cf=0.63)")
qz = 0.00256 * 0.85 * 1.0 * 1.0 * 1.0 * 150 ** 2
w = eng.calculate_wall_force(150, 'ultimate', 'C', 40, 25)
check("qz at centroid (Kz=0.85)", w['velocity_pressure']['qz_psf'], round(qz, 2), 0.05)
check("Cf = 0.63", w['Cf'], 0.63, 0.001)
check("projected area Af = D*H = 1000", w['projected_area_Af_sqft'], 1000.0, 0.1)
check("wall drag F", w['result']['drag_force_F_lbs'], qz * 0.85 * 0.63 * 1000, 5.0)

# ---------------------------------------------------------------------------
print("\nTEST 5 — Cf=0.63 applicability gates (§29.4.2.1)")
check_true("D=40,H=25 (H/D=0.625) applicable", eng.check_wall_applicability(40, 25)[0])
check_true("D=130 NOT applicable (>120 ft)", not eng.check_wall_applicability(130, 25)[0])
check_true("H/D=5 NOT applicable (>=4.0)", not eng.check_wall_applicability(10, 50)[0])
check_true("H/D=0.2 NOT applicable (<0.25)", not eng.check_wall_applicability(50, 10)[0])
check_true("rough surface NOT applicable", not eng.check_wall_applicability(40, 25, moderately_smooth=False)[0])

# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
if all(results):
    print(f"ALL {len(results)} CHECKS PASSED")
    sys.exit(0)
else:
    print(f"{sum(results)}/{len(results)} passed — {len(results) - sum(results)} FAILED")
    sys.exit(1)
