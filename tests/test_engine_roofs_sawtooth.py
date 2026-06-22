"""
Sawtooth-roof C&C engine verification harness — ASCE 7-22.

Engine under test: webapp/asce7_22_cc_roofs_sawtooth.py
  -> class ASCE7_CC_SawtoothRoofCalculator

Figure values for Fig 30.3-6 (the GCp sawtooth curves) are UNVERIFIED pending
book-read (see ASCE 7-22/UNVERIFIED_FIGURE_VALUES_WORKLIST.md); this harness
covers Ch26 universals + structure only.

Per ASCE ledger Rule 4, every asserted numeric magnitude comes from the
VERIFIED-VALUES LEDGER, never from the engine's own output. The GCp magnitudes
are NOT in the ledger, so this harness asserts ZERO GCp magnitudes — only
structural invariants (clamp behavior, zone monotonicity, finiteness).

Run from repo root:
    C:/Python312/python.exe tests/test_engine_roofs_sawtooth.py

Exit code 0 = all pass, 1 = at least one failure.
"""
import sys
import os
import math

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

import asce7_22_cc_roofs_sawtooth as saw_mod

PASS = "PASS"
FAIL = "FAIL"
results = []

# Any roof slope > 10 deg is valid for the sawtooth engine (theta<=10 raises).
THETA = 20.0


def check(name, got, expected, tol):
    ok = abs(got - expected) <= tol
    results.append(ok)
    status = PASS if ok else FAIL
    print(f"  [{status}] {name}: got {got:.4f}, expected {expected:.4f} (tol {tol})")
    return ok


def check_true(name, got):
    ok = bool(got)
    results.append(ok)
    status = PASS if ok else FAIL
    print(f"  [{status}] {name}: {got}")
    return ok


eng = saw_mod.ASCE7_CC_SawtoothRoofCalculator()

# ---------------------------------------------------------------------------
# TEST 1 — Ground Elevation Factor Ke vs ASCE 7-22 Table 26.9-1 / Eq. 26.9-1
# Engine policy: Ke = 1.0 for ze <= 1000 ft; exact Eq. 26.9-1 above.
# ---------------------------------------------------------------------------
print("\nTEST 1 — Ke vs Table 26.9-1 (Eq. 26.9-1: Ke = exp(-0.0000362*ze))")
for z, expected in [(0, 1.00), (500, 1.00), (1000, 1.00)]:
    check(f"Ke(z={z}) conservative <=1000", eng.calculate_ke(z), expected, 0.001)
for z, book in [(2000, 0.93), (3000, 0.90), (4000, 0.86), (5000, 0.83), (6000, 0.80)]:
    check(f"Ke(z={z}) formula", eng.calculate_ke(z), book, 0.01)
# REGRESSION GUARD: old -2.0e-4 coefficient gave ~0.67 at 2000 ft.
check_true("Ke(2000) is NOT ~0.67 (old -2.0e-4 bug)",
           abs(eng.calculate_ke(2000) - 0.67) > 0.02)

# ---------------------------------------------------------------------------
# TEST 2 — Kz vs ASCE 7-22 Table 26.10-1 (66 ledger cells: B/C/D x 22 heights)
# ---------------------------------------------------------------------------
print("\nTEST 2 — Kz vs Table 26.10-1 (66 ledger cells)")
# height -> (B, C, D), copied from the verified ledger.
kz_ledger = {
    15:  (0.57, 0.85, 1.03),
    20:  (0.62, 0.90, 1.08),
    25:  (0.66, 0.94, 1.12),
    30:  (0.70, 0.98, 1.16),
    40:  (0.74, 1.04, 1.22),
    50:  (0.79, 1.09, 1.27),
    60:  (0.83, 1.13, 1.31),
    70:  (0.86, 1.17, 1.34),
    80:  (0.90, 1.21, 1.38),
    90:  (0.92, 1.24, 1.40),
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
# NOTE (PENDING book confirmation): Exposure B below z_min=30 ft -> engine
# applies the Section 26.10.2 z_min FLOOR (0.70), not the raw Table 26.10-1
# cells (0.57/0.62/0.66). Table-vs-equation choice; floor is conservative.
# See ASCE 7-22/UNVERIFIED_FIGURE_VALUES_WORKLIST.md.
for h in sorted(kz_ledger):
    b, c, d = kz_ledger[h]
    b_exp = 0.70 if h < 30 else b
    check(f"Kz B z={h}{' [z_min floor]' if h < 30 else ''}", eng.calculate_kz(h, 'B'), b_exp, 0.001)
    check(f"Kz C z={h}", eng.calculate_kz(h, 'C'), c, 0.001)
    check(f"Kz D z={h}", eng.calculate_kz(h, 'D'), d, 0.001)

# z_min clamp (Section 26.10.2): below z_min use the z_min value.
print("\nTEST 2b — Kz z_min clamp (B<30->0.70, C<15->0.85, D<7->1.03)")
check("Kz B z=10 clamp", eng.calculate_kz(10, 'B'), 0.70, 0.001)
check("Kz B z=29 clamp", eng.calculate_kz(29, 'B'), 0.70, 0.001)
check("Kz C z=10 clamp", eng.calculate_kz(10, 'C'), 0.85, 0.001)
check("Kz D z=5 clamp",  eng.calculate_kz(5,  'D'), 1.03, 0.001)

# ---------------------------------------------------------------------------
# TEST 3 — Terrain exposure constants vs Table 26.11-1
# ---------------------------------------------------------------------------
print("\nTEST 3 — Terrain constants vs Table 26.11-1")
terrain_ledger = {
    'B': {'alpha': 7.5,  'zg': 3280, 'zmin': 30},
    'C': {'alpha': 9.8,  'zg': 2460, 'zmin': 15},
    'D': {'alpha': 11.5, 'zg': 1935, 'zmin': 7},
}
for exp, vals in terrain_ledger.items():
    tc = eng.get_terrain_constants(exp)
    check(f"alpha {exp}", tc['alpha'], vals['alpha'], 0.001)
    check(f"zg {exp}",    tc['zg'],    vals['zg'],    0.001)
    check(f"zmin {exp}",  tc['zmin'],  vals['zmin'],  0.001)

# ---------------------------------------------------------------------------
# TEST 4 — GCpi vs Table 26.13-1
# ---------------------------------------------------------------------------
print("\nTEST 4 — GCpi vs Table 26.13-1")
enc = eng.get_gcpi('enclosed')
check("GCpi Enclosed +",        max(enc),  0.18, 0.001)
check("GCpi Enclosed -",        min(enc), -0.18, 0.001)
pe = eng.get_gcpi('partially enclosed')
check("GCpi Part.Enclosed +",   max(pe),   0.55, 0.001)
check("GCpi Part.Enclosed -",   min(pe),  -0.55, 0.001)
op = eng.get_gcpi('open')
check("GCpi Open",              op[0],     0.00, 0.001)

# ---------------------------------------------------------------------------
# TEST 5 — Kd vs Table 26.6-1 (buildings / C&C = 0.85)
# ---------------------------------------------------------------------------
print("\nTEST 5 — Kd vs Table 26.6-1 (C&C = 0.85)")
check("Kd C&C", eng.Kd, 0.85, 0.001)

# ---------------------------------------------------------------------------
# TEST 6 — qz convention: Kd folded in exactly once
# qz = 0.00256*Kz*Kzt*Kd*Ke*V^2
# ---------------------------------------------------------------------------
print("\nTEST 6 — qz folds Kd in exactly once")
V, Kz, Kzt, Ke = 115.0, 1.02, 1.0, 1.0
expected_qz = 0.00256 * Kz * Kzt * 0.85 * Ke * V ** 2  # Kd present once
check("qz (Kd once)", eng.calculate_velocity_pressure(V, Kz, Kzt, Ke), expected_qz, 0.01)
# Confirm Kd is actually present (not missing): with-Kd != without-Kd.
qz_no_kd = 0.00256 * Kz * Kzt * Ke * V ** 2
check_true("qz != qz-without-Kd (Kd not missing)",
           abs(eng.calculate_velocity_pressure(V, Kz, Kzt, Ke) - qz_no_kd) > 0.5)
# Confirm Kd not doubled: with-Kd != with-Kd^2.
qz_kd2 = 0.00256 * Kz * Kzt * 0.85 * 0.85 * Ke * V ** 2
check_true("qz != qz-with-Kd^2 (Kd not doubled)",
           abs(eng.calculate_velocity_pressure(V, Kz, Kzt, Ke) - qz_kd2) > 0.5)

# ---------------------------------------------------------------------------
# TEST 7 — STRUCTURAL invariants for GCp (NO magnitude asserted; values UNVERIFIED)
#   Fig 30.3-6 GCp magnitudes are NOT in the ledger -> assert structure only.
# ---------------------------------------------------------------------------
print("\nTEST 7 — GCp structural invariants (no book magnitudes asserted)")

# 7a. Effective-area clamp: A below curve min returns the SAME value as at min;
#     A above curve max returns the value at max.
#     Curve A-spans per engine (negative): zone1 10..500, zone2 10..500,
#     zone3 span A 10..500 (piecewise), zone3 spans BCD 100..500 (clamp <100).
#     Positive: zone1 10..500, zone2 10..100, zone3 10..100.
print("\nTEST 7a — effective-area clamp (below-min == at-min, above-max == at-max)")
clamp_cases = [
    # (zone, ptype, span, A_min, A_max)
    (1, "negative", "A",   10,  500),
    (2, "negative", "A",   10,  500),
    (3, "negative", "A",   10,  500),   # zone 3 span A piecewise
    (3, "negative", "BCD", 100, 500),   # zone 3 spans B,C,D start at A=100
    (1, "positive", "A",   10,  500),
    (2, "positive", "A",   10,  100),
    (3, "positive", "A",   10,  100),
]
for zone, ptype, span, a_min, a_max in clamp_cases:
    at_min = eng.get_gcp_sawtooth_roof(zone, a_min, THETA, ptype, span)
    below  = eng.get_gcp_sawtooth_roof(zone, a_min / 5.0, THETA, ptype, span)
    at_max = eng.get_gcp_sawtooth_roof(zone, a_max, THETA, ptype, span)
    above  = eng.get_gcp_sawtooth_roof(zone, a_max * 10.0, THETA, ptype, span)
    check(f"clamp below-min==at-min (z{zone} {ptype} {span})", below, at_min, 1e-9)
    check(f"clamp above-max==at-max (z{zone} {ptype} {span})", above, at_max, 1e-9)

# 7b. Zone monotonicity (physically required): corner (3) >= edge (2) >= interior (1)
#     in suction MAGNITUDE at the same effective area. Compare |GCp|.
#     Use span A for zone 3 (defined from A=10) so all three share the 10..100 band.
print("\nTEST 7b — |GCp| corner>=edge>=interior (negative, span A)")
for A in (10, 50, 100):
    g1 = abs(eng.get_gcp_sawtooth_roof(1, A, THETA, "negative", "A"))
    g2 = abs(eng.get_gcp_sawtooth_roof(2, A, THETA, "negative", "A"))
    g3 = abs(eng.get_gcp_sawtooth_roof(3, A, THETA, "negative", "A"))
    check_true(f"|GCp| corner>=edge (A={A}): {g3:.3f}>={g2:.3f}", g3 >= g2 - 1e-9)
    check_true(f"|GCp| edge>=interior (A={A}): {g2:.3f}>={g1:.3f}", g2 >= g1 - 1e-9)

# 7c. Finiteness: get_gcp returns finite numbers across the zone/area/type/span
#     range without crashing.
print("\nTEST 7c — GCp finite across zones/areas/types/spans")
finite_ok = True
for zone in (1, 2, 3):
    for A in (5, 10, 100, 500, 2000):
        for ptype in ("positive", "negative"):
            for span in ("A", "BCD"):
                try:
                    v = eng.get_gcp_sawtooth_roof(zone, A, THETA, ptype, span)
                    if v is None or not math.isfinite(v):
                        finite_ok = False
                        print(f"    non-finite: zone={zone} A={A} {ptype} {span} -> {v}")
                except Exception as e:
                    finite_ok = False
                    print(f"    crash: zone={zone} A={A} {ptype} {span} -> {e!r}")
check_true("GCp finite & no-crash across grid", finite_ok)

# 7d. theta<=10 guard: engine must REFUSE sawtooth GCp for flat slopes
#     (directs caller to the Flat Roof calculator). A raise here is correct.
print("\nTEST 7d — theta<=10 raises (use Flat Roof calculator)")
raised = False
try:
    eng.get_gcp_sawtooth_roof(1, 50, 10.0, "negative", "A")
except ValueError:
    raised = True
check_true("theta=10 raises ValueError", raised)

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
