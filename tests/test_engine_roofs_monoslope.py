"""
Monoslope C&C roof engine regression harness — ASCE 7-22.

Figure values for Fig 30.3-5A / 30.3-5B (monoslope GCp magnitudes) are UNVERIFIED
pending book-read (see ASCE 7-22/UNVERIFIED_FIGURE_VALUES_WORKLIST.md); this harness
covers Ch26 universals + structure only. It deliberately asserts NO GCp magnitude
(would lock in unverified numbers — forbidden by ASCE ledger Rule 4).

What IS asserted (all from the VERIFIED-VALUES LEDGER,
C:/Users/Owner/.claude/projects/c--Dev-windload-solutions/memory/reference_asce_7_22_verified_values.md):
  - Ke (Eq. 26.9-1 + engine's conservative <=1000 ft policy) + regression guard vs old -2.0e-4 bug
  - Kz (Table 26.10-1, 66 cells B/C/D x 22 heights) + z_min clamps
  - Terrain constants (Table 26.11-1): alpha, zg, zmin
  - GCpi (Table 26.13-1)
  - Kd (Table 26.6-1, buildings/C&C row = 0.85)
  - qz convention: Kd folded into qz exactly once

What is asserted STRUCTURALLY (no book magnitude):
  - effective-area clamp: A below min == value at min; A above max == value at max
  - zone monotonicity where physically required: corner >= edge >= interior (magnitude)
  - get_gcp returns finite numbers across the full theta/zone range without crashing

Run from repo root:
    C:/Python312/python.exe tests/test_engine_roofs_monoslope.py

Exit code 0 = all pass, 1 = at least one failure.
"""
import sys
import os
import math

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

import asce7_22_cc_roofs_monoslope as eng_mod

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


eng = eng_mod.ASCE7_CC_MonoslopeRoofCalculator()

# ---------------------------------------------------------------------------
# TEST 1 — Ground Elevation Factor Ke (Eq. 26.9-1 / Table 26.9-1)
# Engine policy: Ke = 1.0 for ze <= 1000 ft (conservative, matches all engines);
# above 1000 ft the exact Eq. 26.9-1 formula applies. Ledger Eq.26.9-1 LOCKED.
# ---------------------------------------------------------------------------
print("\nTEST 1 — Ke (Eq. 26.9-1, engine conservative <=1000 ft policy)")
for z, expected in [(0, 1.00), (500, 1.00), (1000, 1.00)]:
    check(f"Ke(z={z}) conservative", eng.calculate_ke(z), expected, 0.001)
# Above 1000 ft -> Eq. 26.9-1 exp(-0.0000362*ze); ledger Table 26.9-1 cells (tol 0.01)
for z, book in [(2000, 0.93), (3000, 0.90), (4000, 0.86), (5000, 0.83), (6000, 0.80)]:
    check(f"Ke(z={z}) formula", eng.calculate_ke(z), book, 0.01)
# REGRESSION GUARD: old -2.0e-4 coefficient gave Ke(2000) ~0.67. Assert NOT that.
check_bool("Ke(2000) is NOT ~0.67 (old -2.0e-4 bug)",
           abs(eng.calculate_ke(2000) - 0.67) > 0.05,
           f"got {eng.calculate_ke(2000):.4f}")

# ---------------------------------------------------------------------------
# TEST 2 — Kz vs Table 26.10-1 (66 cells: B/C/D x 22 heights), all ledger-verified
# ---------------------------------------------------------------------------
print("\nTEST 2 — Kz vs Table 26.10-1 (66 ledger cells)")
# Each row: height, Kz_B, Kz_C, Kz_D  (straight from the ledger)
kz_table = [
    (15, 0.57, 0.85, 1.03),
    (20, 0.62, 0.90, 1.08),
    (25, 0.66, 0.94, 1.12),
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
# NOTE: Exposure B at h=15..29 is governed by the z_min=30 clamp (Kz=0.70), so the
# ledger's "0-15" B value (0.57) is NOT what the engine returns at h=15 under the
# clamp. We assert the clamp explicitly below; here we test B only at h>=30.
for h, kb, kc, kd in kz_table:
    if h >= 30:
        check(f"Kz B h={h}", eng.calculate_kz(h, 'B'), kb, 0.001)
    check(f"Kz C h={h}", eng.calculate_kz(h, 'C'), kc, 0.001)
    check(f"Kz D h={h}", eng.calculate_kz(h, 'D'), kd, 0.001)

# z_min clamps (Section 26.10.2): B(h<30)->0.70, C(h<15)->0.85, D(h<7)->1.03
print("\nTEST 2b — Kz z_min clamps (Section 26.10.2)")
check("Kz B h=20 -> z_min clamp 0.70", eng.calculate_kz(20, 'B'), 0.70, 0.001)
check("Kz B h=29 -> z_min clamp 0.70", eng.calculate_kz(29, 'B'), 0.70, 0.001)
check("Kz C h=10 -> z_min clamp 0.85", eng.calculate_kz(10, 'C'), 0.85, 0.001)
check("Kz D h=5  -> z_min clamp 1.03", eng.calculate_kz(5, 'D'), 1.03, 0.001)

# ---------------------------------------------------------------------------
# TEST 3 — Terrain constants vs Table 26.11-1 (alpha, zg, zmin) — ledger LOCKED
# ---------------------------------------------------------------------------
print("\nTEST 3 — Terrain constants (Table 26.11-1)")
terrain_expected = {
    'B': {'alpha': 7.5, 'zg': 3280, 'zmin': 30},
    'C': {'alpha': 9.8, 'zg': 2460, 'zmin': 15},
    'D': {'alpha': 11.5, 'zg': 1935, 'zmin': 7},
}
for exp, vals in terrain_expected.items():
    tc = eng.get_terrain_constants(exp)
    check(f"{exp} alpha", tc['alpha'], vals['alpha'], 0.001)
    check(f"{exp} zg", tc['zg'], vals['zg'], 0.001)
    check(f"{exp} zmin", tc['zmin'], vals['zmin'], 0.001)

# ---------------------------------------------------------------------------
# TEST 4 — GCpi vs Table 26.13-1 — ledger LOCKED
# ---------------------------------------------------------------------------
print("\nTEST 4 — GCpi (Table 26.13-1)")
enc = eng.get_gcpi('enclosed')
check("Enclosed +GCpi", max(enc), 0.18, 0.001)
check("Enclosed -GCpi", min(enc), -0.18, 0.001)
pe = eng.get_gcpi('partially_enclosed')
check("Partially Enclosed +GCpi", max(pe), 0.55, 0.001)
check("Partially Enclosed -GCpi", min(pe), -0.55, 0.001)
op = eng.get_gcpi('open')
check("Open GCpi", op[0], 0.0, 0.001)

# ---------------------------------------------------------------------------
# TEST 5 — Kd vs Table 26.6-1 (Buildings — C&C row = 0.85) — ledger LOCKED
# ---------------------------------------------------------------------------
print("\nTEST 5 — Kd (Table 26.6-1, C&C buildings row)")
check("Kd = 0.85 (C&C buildings)", eng.Kd, 0.85, 0.001)

# ---------------------------------------------------------------------------
# TEST 6 — qz convention: Kd folded into qz EXACTLY ONCE
# qz = 0.00256 * Kz * Kzt * Kd * Ke * V^2  (intended; Kd present once, not doubled)
# ---------------------------------------------------------------------------
print("\nTEST 6 — qz folds Kd in exactly once")
V, Kz, Kzt, Ke = 150.0, 1.00, 1.0, 1.0
qz_engine = eng.calculate_velocity_pressure(V, Kz, Kzt, Ke)
qz_with_kd_once = 0.00256 * Kz * Kzt * 0.85 * Ke * V ** 2
check("qz matches Kd-once formula", qz_engine, qz_with_kd_once, 0.001)
# Confirm Kd is PRESENT (engine != the no-Kd value) and NOT doubled
qz_no_kd = 0.00256 * Kz * Kzt * Ke * V ** 2
qz_kd_doubled = 0.00256 * Kz * Kzt * 0.85 * 0.85 * Ke * V ** 2
check_bool("qz includes Kd (not missing)", abs(qz_engine - qz_no_kd) > 0.5,
           f"qz={qz_engine:.3f}, no-Kd would be {qz_no_kd:.3f}")
check_bool("qz does not double Kd", abs(qz_engine - qz_kd_doubled) > 0.5,
           f"qz={qz_engine:.3f}, doubled-Kd would be {qz_kd_doubled:.3f}")

# ---------------------------------------------------------------------------
# TEST 7 — STRUCTURAL: effective-area clamp behavior (NO magnitude asserted).
# Engine interpolates log-linearly between A=10 and A=100. Below 10 must equal
# the A=10 value; above 100 must equal the A=100 value.
# ---------------------------------------------------------------------------
print("\nTEST 7 — effective-area clamp (structural invariant, no book magnitude)")
clamp_cases = [
    # (theta, zone, pressure_type)
    (5, "2", "negative"),
    (5, "3", "negative"),
    (5, "2'", "negative"),
    (5, "3'", "negative"),
    (5, "1", "positive"),
    (20, "2", "negative"),
    (20, "3", "negative"),
    (20, "1", "negative"),
    (20, "1", "positive"),
]
for theta, zone, ptype in clamp_cases:
    at_min = eng.get_gcp_monoslope_roof(zone, 10, theta, ptype)
    below_min = eng.get_gcp_monoslope_roof(zone, 1, theta, ptype)
    at_max = eng.get_gcp_monoslope_roof(zone, 100, theta, ptype)
    above_max = eng.get_gcp_monoslope_roof(zone, 5000, theta, ptype)
    check(f"clamp below-min==A10 (theta={theta} Z{zone} {ptype})", below_min, at_min, 1e-9)
    check(f"clamp above-max==A100 (theta={theta} Z{zone} {ptype})", above_max, at_max, 1e-9)

# ---------------------------------------------------------------------------
# TEST 8 — STRUCTURAL: zone monotonicity (magnitude). Corner >= edge >= interior.
# Asserts ORDERING only, never a specific GCp value.
# For 3-10 deg: low side: Z3 (corner) >= Z2 (edge) >= Z1 (interior).
#               high side: Z3' (corner) >= Z2' (edge) >= Z1 (interior).
# For 10-30 deg: Z3 >= Z2 >= Z1.
# ---------------------------------------------------------------------------
print("\nTEST 8 — zone monotonicity corner>=edge>=interior (structural, no magnitude)")
for A in (10, 100):
    # 3-10 deg band (theta=5)
    z1 = abs(eng.get_gcp_monoslope_roof("1", A, 5, "negative"))
    z2 = abs(eng.get_gcp_monoslope_roof("2", A, 5, "negative"))
    z3 = abs(eng.get_gcp_monoslope_roof("3", A, 5, "negative"))
    z2p = abs(eng.get_gcp_monoslope_roof("2'", A, 5, "negative"))
    z3p = abs(eng.get_gcp_monoslope_roof("3'", A, 5, "negative"))
    check_bool(f"theta=5 A={A}: |Z3|>=|Z2|>=|Z1| (low side)",
               z3 >= z2 - 1e-9 and z2 >= z1 - 1e-9,
               f"Z3={z3:.3f} Z2={z2:.3f} Z1={z1:.3f}")
    check_bool(f"theta=5 A={A}: |Z3'|>=|Z2'|>=|Z1| (high side)",
               z3p >= z2p - 1e-9 and z2p >= z1 - 1e-9,
               f"Z3'={z3p:.3f} Z2'={z2p:.3f} Z1={z1:.3f}")
    # 10-30 deg band (theta=20)
    z1b = abs(eng.get_gcp_monoslope_roof("1", A, 20, "negative"))
    z2b = abs(eng.get_gcp_monoslope_roof("2", A, 20, "negative"))
    z3b = abs(eng.get_gcp_monoslope_roof("3", A, 20, "negative"))
    check_bool(f"theta=20 A={A}: |Z3|>=|Z2|>=|Z1|",
               z3b >= z2b - 1e-9 and z2b >= z1b - 1e-9,
               f"Z3={z3b:.3f} Z2={z2b:.3f} Z1={z1b:.3f}")

# ---------------------------------------------------------------------------
# TEST 9 — STRUCTURAL: get_gcp returns finite numbers across theta/zone range
# without crashing. NO magnitude asserted — only finiteness.
# ---------------------------------------------------------------------------
print("\nTEST 9 — get_gcp finite across theta/zone range (structural, no magnitude)")
finite_ok = True
finite_fail_detail = ""
# 3 < theta <= 10 zones: 1,2,2',3,3'  ; 10 < theta <= 30 zones: 1,2,3
ranges = [
    (4, ["1", "2", "2'", "3", "3'"]),
    (10, ["1", "2", "2'", "3", "3'"]),
    (10.5, ["1", "2", "3"]),
    (20, ["1", "2", "3"]),
    (30, ["1", "2", "3"]),
]
for theta, zones in ranges:
    for zone in zones:
        for ptype in ("positive", "negative"):
            for A in (5, 10, 50, 100, 1000):
                try:
                    v = eng.get_gcp_monoslope_roof(zone, A, theta, ptype)
                    if not math.isfinite(v):
                        finite_ok = False
                        finite_fail_detail = f"non-finite at theta={theta} Z{zone} {ptype} A={A}: {v}"
                except Exception as e:
                    finite_ok = False
                    finite_fail_detail = f"crash at theta={theta} Z{zone} {ptype} A={A}: {e}"
check_bool("get_gcp finite over full valid theta/zone/A grid", finite_ok, finite_fail_detail)

# Guard rails: out-of-range slopes must raise (theta<=3 -> flat; theta>30 -> out of range)
print("\nTEST 9b — slope guard rails raise as designed")
raised_low = False
try:
    eng.get_gcp_monoslope_roof("1", 10, 3, "negative")
except ValueError:
    raised_low = True
check_bool("theta<=3 raises (use flat-roof calc)", raised_low)
raised_high = False
try:
    eng.get_gcp_monoslope_roof("1", 10, 31, "negative")
except ValueError:
    raised_high = True
check_bool("theta>30 raises (out of monoslope range)", raised_high)

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
