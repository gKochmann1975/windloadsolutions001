"""
Gable-roof C&C engine regression harness — ASCE 7-22.

Figure values for Fig 30.3-2B/C/D (gable-roof GCp) are UNVERIFIED pending book-read
(see ASCE 7-22/UNVERIFIED_FIGURE_VALUES_WORKLIST.md); this harness covers Ch26
universals + structure only.

Per ASCE ledger Rule 4, every asserted MAGNITUDE comes from the verified-values
ledger (reference_asce_7_22_verified_values.md):
  - Ke (Table 26.9-1 / Eq. 26.9-1)
  - Kz (Table 26.10-1, 66 cells + z_min clamps)
  - Terrain constants (Table 26.11-1)
  - GCpi (Table 26.13-1)
  - Kd (Table 26.6-1, buildings/C&C row)
  - qz convention (Eq. 26.10-1, Kd folded in exactly once)

The gable GCp magnitudes (Fig 30.3-2B/C/D) are NOT in the ledger, so this harness
asserts NO GCp magnitude. It only checks structural invariants of get_gcp_gable_roof:
effective-area clamp behavior, corner>=edge>=interior monotonicity, and finiteness
across the engine's theta/zone range.

Run from repo root:
    C:/Python312/python.exe tests/test_engine_roofs_gable.py

Exit code 0 = all pass, 1 = at least one failure.
"""
import sys
import os
import math

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

import asce7_22_cc_roofs_gable as gable_mod

PASS = "PASS"
FAIL = "FAIL"
results = []


def check(name, got, expected, tol):
    ok = abs(got - expected) <= tol
    results.append(ok)
    status = PASS if ok else FAIL
    print(f"  [{status}] {name}: got {got:.4f}, expected {expected:.4f} (tol {tol})")
    return ok


def check_bool(name, ok, detail=""):
    results.append(bool(ok))
    status = PASS if ok else FAIL
    print(f"  [{status}] {name}{(' — ' + detail) if detail else ''}")
    return ok


eng = gable_mod.ASCE7_CC_GableRoofCalculator()

# ---------------------------------------------------------------------------
# TEST 1 — Ke vs Table 26.9-1 (Eq. 26.9-1: Ke = exp(-0.0000362*ze))
# Engine policy: Ke = 1.0 for ze <= 1000 ft; exact formula above 1000.
# ---------------------------------------------------------------------------
print("\nTEST 1 — Ground Elevation Factor Ke (Table 26.9-1 / Eq. 26.9-1)")
for z, expected in [(0, 1.00), (500, 1.00), (1000, 1.00)]:
    check(f"Ke(z={z}) conservative <=1000ft", eng.calculate_ke(z), expected, 0.001)
for z, book in [(2000, 0.93), (3000, 0.90), (4000, 0.86), (5000, 0.83), (6000, 0.80)]:
    check(f"Ke(z={z}) formula", eng.calculate_ke(z), book, 0.01)
# Regression guard: old -2.0e-4 coefficient gave ~0.67 at 2000 ft.
check_bool("Ke(2000) NOT ~0.67 (old -2.0e-4 bug)",
           abs(eng.calculate_ke(2000) - 0.67) >= 0.02,
           f"Ke(2000)={eng.calculate_ke(2000):.4f}")

# ---------------------------------------------------------------------------
# TEST 2 — Kz vs Table 26.10-1 (66 cells: B/C/D x 22 heights) + z_min clamps
# ---------------------------------------------------------------------------
print("\nTEST 2 — Kz vs Table 26.10-1 (66 ledger cells + z_min clamps)")
# Ledger Table 26.10-1 (height: [B, C, D])
kz_table = {
    15: [0.57, 0.85, 1.03],
    20: [0.62, 0.90, 1.08],
    25: [0.66, 0.94, 1.12],
    30: [0.70, 0.98, 1.16],
    40: [0.74, 1.04, 1.22],
    50: [0.79, 1.09, 1.27],
    60: [0.83, 1.13, 1.31],
    70: [0.86, 1.17, 1.34],
    80: [0.90, 1.21, 1.38],
    90: [0.92, 1.24, 1.40],
    100: [0.95, 1.26, 1.43],
    120: [1.00, 1.31, 1.48],
    140: [1.04, 1.34, 1.52],
    160: [1.08, 1.39, 1.55],
    180: [1.11, 1.41, 1.58],
    200: [1.14, 1.44, 1.61],
    250: [1.21, 1.51, 1.68],
    300: [1.27, 1.57, 1.73],
    350: [1.33, 1.62, 1.78],
    400: [1.38, 1.66, 1.82],
    450: [1.42, 1.70, 1.86],
    500: [1.46, 1.74, 1.89],
}
exposures = ['B', 'C', 'D']
for h in sorted(kz_table.keys()):
    for i, exp in enumerate(exposures):
        # Exposure B uses 0.70 for z < 30 per engine z_min policy; at h=15/20/25
        # the engine returns 0.70 (z_min clamp), not the bare table cell.
        if exp == 'B' and h < 30:
            expected = 0.70
        else:
            expected = kz_table[h][i]
        check(f"Kz(h={h}, Exp {exp})", eng.calculate_kz(h, exp), expected, 0.001)

# z_min clamps (ledger Section 26.10.2)
print("\n  -- z_min clamps --")
check("Kz B (h<30) -> 0.70", eng.calculate_kz(10, 'B'), 0.70, 0.001)
check("Kz C (h<15) -> 0.85", eng.calculate_kz(10, 'C'), 0.85, 0.001)
check("Kz D (h<7)  -> 1.03", eng.calculate_kz(5, 'D'), 1.03, 0.001)

# ---------------------------------------------------------------------------
# TEST 3 — Terrain constants vs Table 26.11-1
# ---------------------------------------------------------------------------
print("\nTEST 3 — Terrain Exposure Constants (Table 26.11-1)")
terrain_expected = {
    'B': {'alpha': 7.5, 'zg': 3280, 'zmin': 30},
    'C': {'alpha': 9.8, 'zg': 2460, 'zmin': 15},
    'D': {'alpha': 11.5, 'zg': 1935, 'zmin': 7},
}
for exp, vals in terrain_expected.items():
    tc = eng.get_terrain_constants(exp)
    check(f"alpha {exp}", tc['alpha'], vals['alpha'], 0.001)
    check(f"zg {exp}", tc['zg'], vals['zg'], 0.001)
    check(f"zmin {exp}", tc['zmin'], vals['zmin'], 0.001)

# ---------------------------------------------------------------------------
# TEST 4 — GCpi vs Table 26.13-1
# ---------------------------------------------------------------------------
print("\nTEST 4 — Internal Pressure Coefficient GCpi (Table 26.13-1)")
enc = eng.get_gcpi('enclosed')
check("Enclosed +GCpi", max(enc), 0.18, 0.001)
check("Enclosed -GCpi", min(enc), -0.18, 0.001)
pe = eng.get_gcpi('partially enclosed')
check("Partially Enclosed +GCpi", max(pe), 0.55, 0.001)
check("Partially Enclosed -GCpi", min(pe), -0.55, 0.001)
op = eng.get_gcpi('open')
check("Open GCpi", op[0], 0.0, 0.001)

# ---------------------------------------------------------------------------
# TEST 5 — Kd vs Table 26.6-1 (buildings / C&C row = 0.85)
# ---------------------------------------------------------------------------
print("\nTEST 5 — Wind Directionality Factor Kd (Table 26.6-1, C&C row)")
check("Kd (C&C)", eng.Kd, 0.85, 0.001)

# ---------------------------------------------------------------------------
# TEST 6 — qz convention: Kd folded into qz exactly once
# qz = 0.00256 * Kz * Kzt * Kd * Ke * V^2
# ---------------------------------------------------------------------------
print("\nTEST 6 — qz convention (Eq. 26.10-1, Kd present exactly once)")
V, Kz, Kzt, Ke = 150.0, 1.00, 1.0, 1.0
qz = eng.calculate_velocity_pressure(V, Kz, Kzt, Ke)
expected_with_kd = 0.00256 * Kz * Kzt * 0.85 * Ke * V * V
expected_without_kd = 0.00256 * Kz * Kzt * Ke * V * V  # Kd missing
expected_doubled_kd = 0.00256 * Kz * Kzt * 0.85 * 0.85 * Ke * V * V  # Kd^2
check("qz folds Kd in exactly once", qz, expected_with_kd, 0.001)
check_bool("qz is NOT missing Kd", abs(qz - expected_without_kd) > 0.5,
           f"with-Kd={expected_with_kd:.2f} vs no-Kd={expected_without_kd:.2f}")
check_bool("qz does NOT double Kd", abs(qz - expected_doubled_kd) > 0.5,
           f"with-Kd={expected_with_kd:.2f} vs Kd^2={expected_doubled_kd:.2f}")

# ---------------------------------------------------------------------------
# TEST 7 — STRUCTURAL invariants for get_gcp_gable_roof (NO magnitude asserted)
# Fig 30.3-2B/C/D GCp values are UNVERIFIED — assert only shape/behavior.
# ---------------------------------------------------------------------------
print("\nTEST 7 — Structural invariants (no GCp magnitude asserted)")
# Representative theta in each band the engine handles internally.
thetas = [10.0, 18.0, 20.0, 25.0, 27.0, 35.0, 45.0]
zones = [1, 2, 3]

# 7a — effective-area clamp. Negative anchors: A_min=10; A_max varies by band/zone.
# Below A_min returns SAME value as at A_min; above the largest A_max returns the
# value at that A_max (clamped). Use A=1 (< any min) and A=10000 (> any max).
print("\n  -- 7a effective-area clamp (negative pressure) --")
for theta in thetas:
    for zone in zones:
        g_min = eng.get_gcp_gable_roof(zone, 10, theta, "negative")
        g_below = eng.get_gcp_gable_roof(zone, 1, theta, "negative")
        check_bool(f"clamp@min neg theta={theta} z{zone} (A=1 == A=10)",
                   abs(g_below - g_min) < 1e-9,
                   f"A1={g_below:.4f} A10={g_min:.4f}")
        # above the band's A_max the value must be flat: A=10000 == A=1e6
        g_hi1 = eng.get_gcp_gable_roof(zone, 10000, theta, "negative")
        g_hi2 = eng.get_gcp_gable_roof(zone, 1_000_000, theta, "negative")
        check_bool(f"clamp@max neg theta={theta} z{zone} (A=1e4 == A=1e6)",
                   abs(g_hi1 - g_hi2) < 1e-9,
                   f"A1e4={g_hi1:.4f} A1e6={g_hi2:.4f}")

print("\n  -- 7a effective-area clamp (positive pressure) --")
for theta in thetas:
    g_min = eng.get_gcp_gable_roof(1, 10, theta, "positive")
    g_below = eng.get_gcp_gable_roof(1, 1, theta, "positive")
    check_bool(f"clamp@min pos theta={theta} (A=1 == A=10)",
               abs(g_below - g_min) < 1e-9,
               f"A1={g_below:.4f} A10={g_min:.4f}")
    g_hi1 = eng.get_gcp_gable_roof(1, 10000, theta, "positive")
    g_hi2 = eng.get_gcp_gable_roof(1, 1_000_000, theta, "positive")
    check_bool(f"clamp@max pos theta={theta} (A=1e4 == A=1e6)",
               abs(g_hi1 - g_hi2) < 1e-9,
               f"A1e4={g_hi1:.4f} A1e6={g_hi2:.4f}")

# 7b — zone monotonicity: corner (Z3) >= edge (Z2) >= interior (Z1) in MAGNITUDE
# for negative pressures, at fixed theta + effective area.
print("\n  -- 7b zone monotonicity |Z3| >= |Z2| >= |Z1| (negative) --")
for theta in thetas:
    for A in [10, 50, 100]:
        z1 = abs(eng.get_gcp_gable_roof(1, A, theta, "negative"))
        z2 = abs(eng.get_gcp_gable_roof(2, A, theta, "negative"))
        z3 = abs(eng.get_gcp_gable_roof(3, A, theta, "negative"))
        check_bool(f"|Z3|>=|Z2|>=|Z1| theta={theta} A={A}",
                   z3 >= z2 - 1e-9 and z2 >= z1 - 1e-9,
                   f"Z1={z1:.3f} Z2={z2:.3f} Z3={z3:.3f}")

# 7c — finiteness across full theta/zone range, both pressure types, no crash.
print("\n  -- 7c finiteness across theta/zone range (no crash) --")
finite_ok = True
crash_detail = ""
for theta in [7.5, 10, 15, 18.4, 20, 22, 25, 27, 30, 35, 40, 45]:
    for zone in zones:
        for ptype in ["negative", "positive"]:
            for A in [1, 10, 75, 200, 1000]:
                try:
                    v = eng.get_gcp_gable_roof(zone, A, theta, ptype)
                    if not math.isfinite(v):
                        finite_ok = False
                        crash_detail = f"non-finite at theta={theta} z{zone} {ptype} A={A}"
                except Exception as e:
                    finite_ok = False
                    crash_detail = f"exception at theta={theta} z{zone} {ptype} A={A}: {e}"
check_bool("get_gcp_gable_roof finite over full range", finite_ok, crash_detail)

# 7d — out-of-range slope gates raise (theta <= 7 and theta > 45)
print("\n  -- 7d slope-range gates raise --")
raised_low = False
try:
    eng.get_gcp_gable_roof(1, 10, 5.0, "negative")
except ValueError:
    raised_low = True
except Exception:
    raised_low = False
check_bool("theta<=7 raises ValueError (flat-roof gate)", raised_low)

raised_high = False
try:
    eng.get_gcp_gable_roof(1, 10, 50.0, "negative")
except ValueError:
    raised_high = True
except Exception:
    raised_high = False
check_bool("theta>45 raises ValueError (out-of-range gate)", raised_high)

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
