"""
C&C Hip Roof engine regression harness — ASCE 7-22 (asce7_22_cc_roofs_hip.py).

Figure values for Figs 30.3-2E / 30.3-2F / 30.3-2G (hip-roof GCp) are UNVERIFIED
pending book-read (see ASCE 7-22/UNVERIFIED_FIGURE_VALUES_WORKLIST.md); this
harness covers Ch26 universals + structure only.

Per ASCE ledger Rule 4, every numeric EXPECTED value below comes from the
VERIFIED-VALUES LEDGER (reference_asce_7_22_verified_values.md), never from the
engine's own output. NO GCp/Cf magnitude is asserted for this engine because
Figs 30.3-2E/F/G are not in the ledger. The GCp tests here check only structural
invariants (effective-area clamp, zone monotonicity, finiteness) that hold
regardless of the (unverified) book magnitudes.

Run from repo root:
    C:/Python312/python.exe tests/test_engine_roofs_hip.py

Exit code 0 = all pass, 1 = at least one failure.
"""
import sys
import os
import math

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

import asce7_22_cc_roofs_hip as hip_mod

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
    print(f"  [{status}] {name}: {'OK' if ok else 'FALSE'}")
    return ok


calc = hip_mod.ASCE7_CC_HipRoofCalculator()

# ---------------------------------------------------------------------------
# TEST 1 — Ground Elevation Factor Ke vs ASCE 7-22 Table 26.9-1
# Engine policy: Ke = 1.0 for ze <= 1000 ft (conservative); above 1000 ft the
# exact Eq. 26.9-1 (exp(-0.0000362*ze)) applies.
# ---------------------------------------------------------------------------
print("\nTEST 1 - Ke vs Table 26.9-1 (Eq. 26.9-1: Ke = exp(-0.0000362*ze))")
for z, exp in [(0, 1.00), (500, 1.00), (1000, 1.00)]:
    check(f"Ke(z={z}) conservative", calc.calculate_ke(z), exp, 0.001)
for z, book in [(2000, 0.93), (3000, 0.90), (4000, 0.86), (5000, 0.83), (6000, 0.80)]:
    check(f"Ke(z={z}) formula", calc.calculate_ke(z), book, 0.01)
# REGRESSION GUARD against old buggy coefficient (-2.0e-4 gave ~0.67 at 2000 ft)
check_true("Ke(2000) NOT ~0.67 (old -2.0e-4 bug)",
           abs(calc.calculate_ke(2000) - 0.67) > 0.05)

# ---------------------------------------------------------------------------
# TEST 2 — Kz vs ASCE 7-22 Table 26.10-1 (66 cells: 22 heights x B/C/D)
# ---------------------------------------------------------------------------
print("\nTEST 2 - Kz vs Table 26.10-1 (66 ledger cells)")
# Ledger Table 26.10-1 (rows are z ft -> [B, C, D])
kz_table = {
    15: (0.57, 0.85, 1.03),
    20: (0.62, 0.90, 1.08),
    25: (0.66, 0.94, 1.12),
    30: (0.70, 0.98, 1.16),
    40: (0.74, 1.04, 1.22),
    50: (0.79, 1.09, 1.27),
    60: (0.83, 1.13, 1.31),
    70: (0.86, 1.17, 1.34),
    80: (0.90, 1.21, 1.38),
    90: (0.92, 1.24, 1.40),
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
# Note: at z=15, Exposure B clamps to z_min=30 -> Kz=0.70 (engine returns 0.70
# for any h<30 in B). So the B-column at z=15 is the z_min clamp, not 0.57.
# Test the table at z>=30 for B (where no clamp applies), and full range for C/D.
for z in sorted(kz_table.keys()):
    b, c, d = kz_table[z]
    if z >= 30:
        check(f"Kz B z={z}", calc.calculate_kz(z, 'B'), b, 0.001)
    check(f"Kz C z={z}", calc.calculate_kz(z, 'C'), c, 0.001)
    check(f"Kz D z={z}", calc.calculate_kz(z, 'D'), d, 0.001)

# z_min clamp (ledger Section 26.10.2): B(h<30)->0.70, C(h<15)->0.85, D(h<7)->1.03
print("\nTEST 2b - z_min clamp")
check("Kz B h=10 (clamp 0.70)", calc.calculate_kz(10, 'B'), 0.70, 0.001)
check("Kz B h=29 (clamp 0.70)", calc.calculate_kz(29, 'B'), 0.70, 0.001)
check("Kz C h=10 (clamp 0.85)", calc.calculate_kz(10, 'C'), 0.85, 0.001)
check("Kz D h=5  (clamp 1.03)", calc.calculate_kz(5, 'D'), 1.03, 0.001)

# ---------------------------------------------------------------------------
# TEST 3 — Terrain exposure constants vs ASCE 7-22 Table 26.11-1
# ---------------------------------------------------------------------------
print("\nTEST 3 - Terrain constants vs Table 26.11-1")
terrain_expected = {
    'B': {'alpha': 7.5, 'zg': 3280, 'zmin': 30},
    'C': {'alpha': 9.8, 'zg': 2460, 'zmin': 15},
    'D': {'alpha': 11.5, 'zg': 1935, 'zmin': 7},
}
for exp_cat, vals in terrain_expected.items():
    tc = calc.get_terrain_constants(exp_cat)
    check(f"alpha {exp_cat}", tc['alpha'], vals['alpha'], 0.001)
    check(f"zg    {exp_cat}", tc['zg'], vals['zg'], 0.001)
    check(f"zmin  {exp_cat}", tc['zmin'], vals['zmin'], 0.001)

# ---------------------------------------------------------------------------
# TEST 4 — GCpi vs ASCE 7-22 Table 26.13-1
# Enclosed +/-0.18, Partially Enclosed +/-0.55, Open 0.0
# ---------------------------------------------------------------------------
print("\nTEST 4 - GCpi vs Table 26.13-1")
enc = calc.get_gcpi('enclosed')
check("GCpi enclosed +", max(enc), 0.18, 0.001)
check("GCpi enclosed -", min(enc), -0.18, 0.001)
pe = calc.get_gcpi('partially_enclosed')
check("GCpi part-encl +", max(pe), 0.55, 0.001)
check("GCpi part-encl -", min(pe), -0.55, 0.001)
opn = calc.get_gcpi('open')
check("GCpi open", opn[0], 0.0, 0.001)

# ---------------------------------------------------------------------------
# TEST 5 — Kd for buildings/C&C vs Table 26.6-1 = 0.85
# ---------------------------------------------------------------------------
print("\nTEST 5 - Kd vs Table 26.6-1 (buildings/C&C = 0.85)")
check("Kd (C&C buildings)", calc.Kd, 0.85, 0.001)

# ---------------------------------------------------------------------------
# TEST 6 — qz convention: qz folds Kd in exactly once
# 0.00256*Kz*Kzt*Kd*Ke*V^2. Confirm Kd present once (not missing, not doubled).
# ---------------------------------------------------------------------------
print("\nTEST 6 - qz convention (Kd in qz exactly once)")
V, Kz, Kzt, Ke = 150.0, 0.98, 1.0, 1.0
qz = calc.calculate_velocity_pressure(V, Kz, Kzt, Ke)
expected_with_kd = 0.00256 * Kz * Kzt * 0.85 * Ke * V ** 2
check("qz = 0.00256*Kz*Kzt*Kd*Ke*V^2", qz, expected_with_kd, 0.01)
# Kd present (NOT missing): qz must differ from the no-Kd value
no_kd = 0.00256 * Kz * Kzt * Ke * V ** 2
check_true("qz != no-Kd value (Kd present)", abs(qz - no_kd) > 0.5)
# Kd NOT doubled: qz must differ from the Kd^2 value
double_kd = 0.00256 * Kz * Kzt * 0.85 * 0.85 * Ke * V ** 2
check_true("qz != Kd^2 value (Kd not doubled)", abs(qz - double_kd) > 0.5)

# ---------------------------------------------------------------------------
# TEST 7 — STRUCTURAL invariants for get_gcp_hip_roof (NO magnitude assertions).
# Figs 30.3-2E/F/G are UNVERIFIED; we only test structural behavior.
# ---------------------------------------------------------------------------
print("\nTEST 7 - GCp structural invariants (no book magnitudes asserted)")

# Sample thetas across the three figure bands: <=20 (2E), <=27 (2F), <=45 (2G/interp)
thetas = [10.0, 18.0, 25.0, 30.0, 40.0, 45.0]
zones = [1, 2, 3]

# 7a — finiteness: get_gcp returns finite numbers across theta/zone/pressure range
print("  -- 7a finiteness across theta/zone/pressure --")
all_finite = True
for th in thetas:
    for z in zones:
        for ptype in ('negative', 'positive'):
            try:
                v = calc.get_gcp_hip_roof(z, 50.0, th, ptype)
                if not math.isfinite(v):
                    all_finite = False
                    print(f"      non-finite at theta={th} zone={z} {ptype}: {v}")
            except Exception as e:
                all_finite = False
                print(f"      crashed at theta={th} zone={z} {ptype}: {e}")
check_true("get_gcp finite over theta/zone/pressure grid", all_finite)

# 7b — effective-area clamp: A below A_min returns SAME as at A_min;
#      A above A_max returns SAME as at A_max. (Anchors per figure: A_min=10.)
# Use negative pressure for each zone/theta. A=1 should equal A=10 (low clamp).
# A_max varies by figure/zone; pick a value well above any A_max (e.g. 10000)
# and compare to a value at the published max for theta<=20 zone1 (A_max=200).
print("  -- 7b effective-area clamp behavior --")
clamp_ok = True
for th in thetas:
    for z in zones:
        v_below = calc.get_gcp_hip_roof(z, 1.0, th, 'negative')     # A < A_min(10)
        v_at_min = calc.get_gcp_hip_roof(z, 10.0, th, 'negative')   # A = A_min
        if abs(v_below - v_at_min) > 1e-9:
            clamp_ok = False
            print(f"      low-clamp mismatch theta={th} zone={z}: "
                  f"A=1 -> {v_below}, A=10 -> {v_at_min}")
        v_above = calc.get_gcp_hip_roof(z, 1e6, th, 'negative')     # A >> A_max
        v_huge = calc.get_gcp_hip_roof(z, 1e7, th, 'negative')      # even bigger
        if abs(v_above - v_huge) > 1e-9:
            clamp_ok = False
            print(f"      high-clamp mismatch theta={th} zone={z}: "
                  f"A=1e6 -> {v_above}, A=1e7 -> {v_huge}")
check_true("EWA clamp: A<min==at-min and A>max==at-max", clamp_ok)

# 7c — zone monotonicity (negative/suction magnitude): corner(3) >= edge(2) >= interior(1).
# Physically required for C&C uplift suction. Tested at the A=10 anchor (A_min),
# which every figure/zone shares, so the relationship does not depend on the
# (UNVERIFIED) per-zone A_max breakpoints. NOTE: at larger A the engine's
# unverified Fig 30.3-2G anchors give Zone-2 A_max=50 vs Zone-1 A_max=100, so the
# edge zone fully clamps before the interior and monotonicity can invert at A=50,
# theta~45 — that is a property of the unverified magnitudes, not asserted here.
print("  -- 7c zone monotonicity |corner| >= |edge| >= |interior| (at A=10 anchor) --")
mono_ok = True
for th in thetas:
    g1 = abs(calc.get_gcp_hip_roof(1, 10.0, th, 'negative'))
    g2 = abs(calc.get_gcp_hip_roof(2, 10.0, th, 'negative'))
    g3 = abs(calc.get_gcp_hip_roof(3, 10.0, th, 'negative'))
    if not (g3 >= g2 - 1e-9 and g2 >= g1 - 1e-9):
        mono_ok = False
        print(f"      monotonicity broke at theta={th}: "
              f"interior={g1:.3f} edge={g2:.3f} corner={g3:.3f}")
check_true("zone suction magnitude monotonic at A=10 (corner>=edge>=interior)", mono_ok)

# 7d — overhang delegates to roof zone GCp (Section 30.7): equals negative roof GCp
print("  -- 7d overhang == adjacent roof zone (negative) --")
oh_ok = True
for th in thetas:
    for z in zones:
        oh = calc.get_gcp_overhang(z, 50.0, th)
        roof_neg = calc.get_gcp_hip_roof(z, 50.0, th, 'negative')
        if abs(oh - roof_neg) > 1e-9:
            oh_ok = False
            print(f"      overhang mismatch theta={th} zone={z}: "
                  f"{oh} vs {roof_neg}")
check_true("overhang GCp == adjacent roof zone negative GCp", oh_ok)

# 7e — slope-range guards: theta<=7 and theta>45 must raise (flat/out-of-range)
print("  -- 7e slope-range guards raise --")
raised_low = False
try:
    calc.get_gcp_hip_roof(1, 50.0, 5.0, 'negative')
except ValueError:
    raised_low = True
check_true("theta<=7 raises (use flat-roof calc)", raised_low)
raised_high = False
try:
    calc.get_gcp_hip_roof(1, 50.0, 50.0, 'negative')
except ValueError:
    raised_high = True
check_true("theta>45 raises (out of hip-roof range)", raised_high)

# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
n_pass = sum(results)
n_total = len(results)
if all(results):
    print(f"ALL {n_total} CHECKS PASSED")
    sys.exit(0)
else:
    print(f"{n_pass}/{n_total} passed - {n_total - n_pass} FAILED")
    sys.exit(1)
