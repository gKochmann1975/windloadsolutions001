"""
Pole / Light Pole engine verification harness — ASCE 7-22 Chapter 29, Fig 29.4-1.

Engine: webapp/asce7_22_other_pole.py (ASCE7_PoleCalculator), which SUBCLASSES the
book-verified chimneys/tanks engine. Every expected value below is derived from the
verified-values ledger (reference_asce_7_22_verified_values.md) — Table 26.10-1 Kz,
Table 26.6-1 Kd, Eq. 26.10-1 qz constant 0.00256, and Fig 29.4-1 Cf — never from the
engine's own output (ledger Rule 4/5). Structural invariants (the sum(F_i*z_i)=M
identity, detailed<=conservative) are checked directly.

Run from repo root:
    C:/Python312/python.exe tests/test_engine_pole.py
Exit code 0 = all pass, 1 = at least one failure.
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

import asce7_22_other_pole as mod

results = []


def check(name, got, expected, tol):
    ok = got is not None and abs(got - expected) <= tol
    results.append(ok)
    print(f"  [{'PASS' if ok else 'FAIL'}] {name}: got {got}, expected {expected} (tol {tol})")
    return ok


def check_true(name, cond):
    results.append(bool(cond))
    print(f"  [{'PASS' if cond else 'FAIL'}] {name}")
    return bool(cond)


eng = mod.ASCE7_PoleCalculator()

# Ledger constants used to build independent expected values
QCONST = 0.00256          # Eq. 26.10-1
G = 0.85                  # Section 26.11 rigid
KZ_25_C = 0.94            # Table 26.10-1, Exp C, 25 ft
KZ_20_C = 0.90            # Table 26.10-1, Exp C, 20 ft
V = 115.0                 # ultimate mph

# ---------------------------------------------------------------------------
# TEST 1 — Kd preserved by cross-section (Table 26.6-1), inherited unchanged
# ---------------------------------------------------------------------------
print("\nTEST 1 — Kd by cross-section (Table 26.6-1)")
for cs, kd in [('round', 1.0), ('square_normal', 0.90), ('square_diagonal', 0.90),
               ('hexagonal', 0.95), ('octagonal', 1.0)]:
    r = eng.calculate_pole_force(V, 'ultimate', 'C', 20, 0.5, cross_section=cs)
    check(f"Kd[{cs}]", r['velocity_pressure']['Kd'], kd, 0.0001)

# ---------------------------------------------------------------------------
# TEST 2 — Worked example: round tapered light pole
#   h=25, Db=0.667, Dt=0.333, V=115U, Exp C, flat, sea level
#   Kz(25,C)=0.94 -> qh = 0.00256*0.94*115^2 = 31.825 psf (Kd round=1.0)
#   D_tip*sqrt(qh)=0.333*5.64=1.88 <= 2.5 -> subcritical; h/D clamps to 25 -> Cf=1.2
# ---------------------------------------------------------------------------
print("\nTEST 2 — round tapered light pole (Fig 29.4-1 subcritical row)")
qh_exp = QCONST * KZ_25_C * (V ** 2)  # 31.825
r = eng.calculate_pole_force(V, 'ultimate', 'C', 25, 0.667, 0.333, 'round', surface_type='rough')
check("Kz@h", r['velocity_pressure']['Kz_at_h'], KZ_25_C, 0.0001)
check("qh", r['velocity_pressure']['qh_psf'], round(qh_exp, 2), 0.05)
check_true("regime@top subcritical", r['force_coefficient']['reynolds_regime_at_top'] == 'subcritical')
check("Cf@top (round subcritical, h/D>=25)", r['force_coefficient']['Cf_at_top'], 1.2, 0.0001)

# Conservative shaft force = qh*G*Cf*Af_total, Af_total=((0.667+0.333)/2)*25=12.5
Af_total = ((0.667 + 0.333) / 2.0) * 25.0
F_shaft_cons_exp = qh_exp * G * 1.2 * Af_total   # ~405.7 lb
check("conservative shaft force", r['conservative_result']['shaft_force_lbs'], round(F_shaft_cons_exp, 2), 1.0)

# ---------------------------------------------------------------------------
# TEST 3 — Structural invariants
# ---------------------------------------------------------------------------
print("\nTEST 3 — structural invariants")
seg_moment = sum(s['moment_ft_lbs'] for s in r['segments'])
check("sum(F_i*z_i) == shaft base moment", seg_moment, r['base_reactions']['shaft_moment_ft_lbs'], 1.0)
seg_force = sum(s['force_lbs'] for s in r['segments'])
check("sum(F_i) == shaft force", seg_force, r['base_reactions']['shaft_force_lbs'], 1.0)
check_true("detailed shaft <= conservative shaft",
           r['base_reactions']['shaft_force_lbs'] <= r['conservative_result']['shaft_force_lbs'] + 0.5)
check_true("resultant height within pole",
           0 < r['base_reactions']['resultant_height_ft'] <= 25)

# ---------------------------------------------------------------------------
# TEST 4 — Top fixture (EPA method): F_fix = qz(z_fix)*G*EPA, Kd_fix=1.0
#   qz_fix at 25 ft, Kd=1.0 = 31.825 -> F = 31.825*0.85*1.5 = 40.58 lb
# ---------------------------------------------------------------------------
print("\nTEST 4 — top fixture EPA term")
F_fix_exp = qh_exp * G * 1.5
rf = eng.calculate_pole_force(V, 'ultimate', 'C', 25, 0.667, 0.333, 'round', fixture_epa_sqft=1.5)
check("fixture force", rf['fixture']['force_lbs'], round(F_fix_exp, 2), 0.2)
check("base shear includes fixture",
      rf['base_reactions']['base_shear_V_lbs'],
      round(r['base_reactions']['shaft_force_lbs'] + F_fix_exp, 2), 1.0)

# ---------------------------------------------------------------------------
# TEST 5 — Uniform round pole in SUPERCRITICAL regime locks the roughness row
#   h=20, D=0.5 round, V=115U, Exp C: Kz=0.90 -> qh=0.00256*0.90*115^2=30.47
#   D*sqrt(qh)=0.5*5.52=2.76 > 2.5 -> supercritical; surface 'rough';
#   h/D=40 clamp 25 -> Cf(round supercritical rough, 25)=0.9
# ---------------------------------------------------------------------------
print("\nTEST 5 — uniform round pole supercritical (Fig 29.4-1 rough row)")
ru = eng.calculate_pole_force(V, 'ultimate', 'C', 20, 0.5, cross_section='round', surface_type='rough')
check("Cf@top (round supercritical rough, h/D>=25)", ru['force_coefficient']['Cf_at_top'], 0.9, 0.0001)
check_true("regime@top supercritical", ru['force_coefficient']['reynolds_regime_at_top'] == 'supercritical')
check_true("uniform pole not tapered", ru['taper']['is_tapered'] is False)

# ---------------------------------------------------------------------------
# TEST 6 — Square section Cf (Fig 29.4-1 square_normal row) + Kd
#   h=20,D=0.5 square_normal: h/D=40 clamp 25 -> Cf=2.0 ; Kd=0.90
# ---------------------------------------------------------------------------
print("\nTEST 6 — square_normal Cf row")
rs = eng.calculate_pole_force(V, 'ultimate', 'C', 20, 0.5, cross_section='square_normal')
check("Cf square_normal @ h/D>=25", rs['force_coefficient']['Cf_at_top'], 2.0, 0.0001)

# ---------------------------------------------------------------------------
# TEST 7 — Sign-post reuse: exposed post via base_z / hD override; nominal speed
# ---------------------------------------------------------------------------
print("\nTEST 7 — sign-post reuse (exposed length + hD override + nominal)")
rp = eng.calculate_pole_force(150, 'nominal', 'C', 12, 0.5, cross_section='round',
                              base_z=0.0, hD_for_cf=30.0)
import math
V_nom = 150 * math.sqrt(0.6)
check("nominal speed conversion", rp['input_parameters']['V_for_calculation_mph'], round(V_nom, 2), 0.02)
check_true("hD override applied", abs(rp['taper']['hD_used'] - 30.0) < 0.01)
check("exposed length", rp['input_parameters']['exposed_length_ft'], 12.0, 0.01)

# ---------------------------------------------------------------------------
# TEST 8 — Fails loud on bad input (no silent wrong answers)
# ---------------------------------------------------------------------------
print("\nTEST 8 — error handling")
error_cases = [
    ("reverse taper", dict(wind_speed=V, speed_type='ultimate', exposure_category='C',
                           pole_height_h=20, base_dimension_D=0.5, tip_dimension_D=0.9)),
    ("bad cross-section", dict(wind_speed=V, speed_type='ultimate', exposure_category='C',
                               pole_height_h=20, base_dimension_D=0.5, cross_section='triangle')),
    ("zero base D", dict(wind_speed=V, speed_type='ultimate', exposure_category='C',
                         pole_height_h=20, base_dimension_D=0)),
    ("base_z above top", dict(wind_speed=V, speed_type='ultimate', exposure_category='C',
                              pole_height_h=20, base_dimension_D=0.5, base_z=25)),
]
for label, kw in error_cases:
    try:
        eng.calculate_pole_force(**kw)
        check_true(f"raises on {label}", False)
    except ValueError:
        check_true(f"raises on {label}", True)

# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
n = len(results)
p = sum(1 for x in results if x)
print(f"POLE ENGINE: {p}/{n} checks passed")
sys.exit(0 if p == n else 1)
