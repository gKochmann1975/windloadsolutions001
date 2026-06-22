"""
MWFRS Directional (Chapter 27) engine regression harness — ASCE 7-22.

Asserts the engine in webapp/asce7_22_mwfrs_directional.py against the
VERIFIED-VALUES LEDGER only (never against the engine's own output):
  - Universal Ch 26: Ke (Table 26.9-1), Kz (Table 26.10-1, 66 cells + z_min
    clamps), terrain constants (Table 26.11-1), GCpi (Table 26.13-1),
    Kd (Table 26.6-1), qz convention (Eq. 26.10-1, Kd folded in once).
  - Figure 27.3-1: walls (5 cells), windward roof Cp1 (21 cells),
    windward roof Cp2 (24 cells incl. h/L=1.0 row), leeward roof Cp (9 cells),
    normal-θ<10°/parallel distance zones, high-θ rules
    (θ>80 -> 0.8, 60<θ<=80 -> 0.01*θ).

Every expected value comes from:
  C:/Users/Owner/.claude/projects/c--Dev-windload-solutions/memory/
      reference_asce_7_22_verified_values.md   (ASCE ledger Rule 4)

Run from repo root:
    C:/Python312/python.exe tests/test_engine_mwfrs_directional.py

Exit code 0 = all pass, 1 = at least one failure (a failure is a real
engine-vs-ledger finding, not something to paper over).
"""
import sys
import os

# Make non-ASCII output (em-dashes, theta) safe on Windows cp1252 consoles.
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

import asce7_22_mwfrs_directional as dir_mod

PASS = "PASS"
FAIL = "FAIL"
results = []


def check(name, got, expected, tol):
    ok = abs(got - expected) <= tol
    results.append(ok)
    status = PASS if ok else FAIL
    print(f"  [{status}] {name}: got {got:.4f}, expected {expected:.4f} (tol {tol})")
    return ok


dir_ = dir_mod.ASCE7_MWFRS_DirectionalCalculator()

# ---------------------------------------------------------------------------
# TEST 1 — Ground Elevation Factor Ke vs ASCE 7-22 Table 26.9-1 / Eq. 26.9-1
# Engine policy: Ke = 1.0 for ze <= 1000 ft (conservative, keeps FL = 1.0);
# above 1000 ft the exact Eq. 26.9-1 exp(-0.0000362*ze) applies (book 2-dec).
# ---------------------------------------------------------------------------
print("\nTEST 1 — Ke vs Table 26.9-1 (ledger)")
ke_conservative = [(0, 1.00), (500, 1.00), (1000, 1.00)]
ke_formula = [(2000, 0.93), (3000, 0.90), (4000, 0.86), (5000, 0.83), (6000, 0.80)]
for z, expected in ke_conservative:
    check(f"Ke(z={z}) conservative <=1000 ft", dir_.calculate_ke(z), expected, 0.001)
for z, book in ke_formula:
    check(f"Ke(z={z}) formula", dir_.calculate_ke(z), book, 0.01)
# REGRESSION GUARD: old -2.0e-4 bug gave Ke(2000) ~ 0.67; ledger demands ~0.93.
ke2000 = dir_.calculate_ke(2000)
guard_ok = abs(ke2000 - 0.67) >= 0.02
results.append(guard_ok)
print(f"  [{PASS if guard_ok else FAIL}] Ke(2000) NOT ~0.67 (old -2.0e-4 bug guard): "
      f"got {ke2000:.4f}")

# ---------------------------------------------------------------------------
# TEST 2 — Kz vs ASCE 7-22 Table 26.10-1 (66 cells) + z_min clamps
# ---------------------------------------------------------------------------
print("\nTEST 2 — Kz vs Table 26.10-1 (ledger, 66 cells)")
# (height, B, C, D) — book rounded 2-dec. NOTE: Exposure B z<30 ft is governed
# by the z_min rule (ledger Section 26.10.2: B h<30 -> Kz=0.70), which legitimately
# supersedes the raw table cells at B/15/20/25. The engine implements that rule, so
# the raw B table cells at z=15/20/25 are unreachable as Kz values and are NOT
# asserted here (they are covered as a separate z_min check below). C and D have
# z_min=15/7, so every listed height >=15 is a directly-reachable table cell.
kz_table = [
    (15, None, 0.85, 1.03),
    (20, None, 0.90, 1.08),
    (25, None, 0.94, 1.12),
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
    if kb is not None:
        check(f"Kz B z={h}", dir_.calculate_kz(h, 'B'), kb, 0.001)
    check(f"Kz C z={h}", dir_.calculate_kz(h, 'C'), kc, 0.001)
    check(f"Kz D z={h}", dir_.calculate_kz(h, 'D'), kd, 0.001)

# z_min clamps (ledger Section 26.10.2): B(h<30)->0.70, C(h<15)->0.85, D(h<7)->1.03
print("  -- z_min clamps --")
check("Kz B z=10 -> z_min 0.70", dir_.calculate_kz(10, 'B'), 0.70, 0.001)
check("Kz B z=29 -> z_min 0.70", dir_.calculate_kz(29, 'B'), 0.70, 0.001)
check("Kz C z=10 -> z_min 0.85", dir_.calculate_kz(10, 'C'), 0.85, 0.001)
check("Kz D z=5  -> z_min 1.03", dir_.calculate_kz(5, 'D'), 1.03, 0.001)

# ---------------------------------------------------------------------------
# TEST 3 — Terrain Exposure Constants vs Table 26.11-1 (ledger)
# alpha B/C/D = 7.5/9.8/11.5 ; zg = 3280/2460/1935 ; zmin = 30/15/7
# ---------------------------------------------------------------------------
print("\nTEST 3 — Terrain constants vs Table 26.11-1 (ledger)")
terrain_expected = {
    'B': {'alpha': 7.5, 'zg': 3280, 'zmin': 30},
    'C': {'alpha': 9.8, 'zg': 2460, 'zmin': 15},
    'D': {'alpha': 11.5, 'zg': 1935, 'zmin': 7},
}
for exp, vals in terrain_expected.items():
    tc = dir_.get_terrain_constants(exp)
    check(f"alpha {exp}", tc['alpha'], vals['alpha'], 0.001)
    check(f"zg {exp}", tc['zg'], vals['zg'], 0.001)
    check(f"zmin {exp}", tc['zmin'], vals['zmin'], 0.001)

# ---------------------------------------------------------------------------
# TEST 4 — GCpi vs Table 26.13-1 (ledger)
# Enclosed +/-0.18 ; Partially Enclosed +/-0.55 ; Open 0.0
# ---------------------------------------------------------------------------
print("\nTEST 4 — GCpi vs Table 26.13-1 (ledger)")
enc = dir_.get_gcpi('enclosed')
check("GCpi enclosed +", max(enc), 0.18, 0.001)
check("GCpi enclosed -", min(enc), -0.18, 0.001)
pe = dir_.get_gcpi('partially enclosed')
check("GCpi partially enclosed +", max(pe), 0.55, 0.001)
check("GCpi partially enclosed -", min(pe), -0.55, 0.001)
op = dir_.get_gcpi('open')
check("GCpi open", op[0], 0.0, 0.001)

# ---------------------------------------------------------------------------
# TEST 5 — Kd vs Table 26.6-1 (ledger): buildings MWFRS = 0.85
# ---------------------------------------------------------------------------
print("\nTEST 5 — Kd vs Table 26.6-1 (ledger)")
check("Kd buildings MWFRS", dir_.Kd, 0.85, 0.001)
# Gust effect factor G = 0.85 (Section 26.11.1, ledger-verified)
check("G rigid (Section 26.11.1)", dir_.G, 0.85, 0.001)

# ---------------------------------------------------------------------------
# TEST 6 — qz convention (Eq. 26.10-1): Kd folded in EXACTLY ONCE.
# qz = 0.00256 * Kz * Kzt * Kd * Ke * V^2. Confirm Kd present once by
# comparing engine qz to the hand value WITH one Kd, and confirming it
# is NOT the no-Kd value (would mean Kd missing) nor the Kd^2 value (doubled).
# ---------------------------------------------------------------------------
print("\nTEST 6 — qz folds Kd in exactly once (Eq. 26.10-1)")
V, Kz, Kzt, Ke = 115.0, 1.02, 1.0, 1.0
qz_engine = dir_.calculate_velocity_pressure(V, Kz, Kzt, Ke)
qz_one_kd = 0.00256 * Kz * Kzt * 0.85 * Ke * V ** 2          # ledger Kd=0.85 once
check("qz = 0.00256*Kz*Kzt*Kd*Ke*V^2 (one Kd)", qz_engine, qz_one_kd, 0.01)
qz_no_kd = 0.00256 * Kz * Kzt * Ke * V ** 2
qz_two_kd = 0.00256 * Kz * Kzt * 0.85 * 0.85 * Ke * V ** 2
guard_missing = abs(qz_engine - qz_no_kd) > 0.5
guard_doubled = abs(qz_engine - qz_two_kd) > 0.5
results.append(guard_missing)
print(f"  [{PASS if guard_missing else FAIL}] qz Kd NOT missing "
      f"(engine {qz_engine:.2f} vs no-Kd {qz_no_kd:.2f})")
results.append(guard_doubled)
print(f"  [{PASS if guard_doubled else FAIL}] qz Kd NOT doubled "
      f"(engine {qz_engine:.2f} vs Kd^2 {qz_two_kd:.2f})")

# ---------------------------------------------------------------------------
# TEST 7 — Figure 27.3-1 WALL Cp (ledger, 5 cells)
# Windward +0.8 (all L/B); Side -0.7 (all L/B);
# Leeward -0.5 @ L/B 1, -0.3 @ L/B 2, -0.2 @ L/B 4.
# ---------------------------------------------------------------------------
print("\nTEST 7 — Fig 27.3-1 wall Cp (ledger, 5 cells)")
check("windward wall Cp", dir_.windward_wall_cp, 0.8, 0.001)
check("side wall Cp", dir_.sidewall_cp, -0.7, 0.001)
check("leeward wall Cp L/B=1", dir_.get_leeward_wall_cp(1.0), -0.5, 0.001)
check("leeward wall Cp L/B=2", dir_.get_leeward_wall_cp(2.0), -0.3, 0.001)
check("leeward wall Cp L/B=4", dir_.get_leeward_wall_cp(4.0), -0.2, 0.001)

# ---------------------------------------------------------------------------
# TEST 8 — Figure 27.3-1 WINDWARD ROOF Cp1 (ledger, 21 cells)
# get_windward_roof_cp returns [Cp1, Cp2]; Cp1 is index 0 for theta 10-45.
# ---------------------------------------------------------------------------
print("\nTEST 8 — Fig 27.3-1 windward roof Cp1 (ledger, 21 cells)")
cp1_table = {
    0.25: {10: -0.7, 15: -0.5, 20: -0.3, 25: -0.2, 30: -0.2, 35: 0.0, 45: 0.0},
    0.50: {10: -0.9, 15: -0.7, 20: -0.4, 25: -0.3, 30: -0.2, 35: -0.2, 45: 0.0},
    1.00: {10: -1.3, 15: -1.0, 20: -0.7, 25: -0.5, 30: -0.3, 35: -0.2, 45: 0.0},
}
for hL, row in cp1_table.items():
    for theta, cp in row.items():
        got = dir_.get_windward_roof_cp(hL, theta)[0]
        check(f"Cp1 h/L={hL} theta={theta}", got, cp, 0.001)

# ---------------------------------------------------------------------------
# TEST 9 — Figure 27.3-1 WINDWARD ROOF Cp2 (ledger, 24 cells incl h/L=1.0 row)
# Cp2 is index 1 of get_windward_roof_cp for theta 10-45; theta 60 returns
# a single Cp2 (high-theta), so index 0 there.
# ---------------------------------------------------------------------------
print("\nTEST 9 — Fig 27.3-1 windward roof Cp2 (ledger, 24 cells)")
cp2_table = {
    0.25: {10: -0.18, 15: 0.0,   20: 0.2,   25: 0.3, 30: 0.3, 35: 0.4, 45: 0.4, 60: 0.6},
    0.50: {10: -0.18, 15: -0.18, 20: 0.0,   25: 0.2, 30: 0.2, 35: 0.3, 45: 0.4, 60: 0.6},
    1.00: {10: -0.18, 15: -0.18, 20: -0.18, 25: 0.0, 30: 0.2, 35: 0.2, 45: 0.3, 60: 0.6},
}
for hL, row in cp2_table.items():
    for theta, cp in row.items():
        res = dir_.get_windward_roof_cp(hL, theta)
        # theta<=45 -> [Cp1, Cp2]; theta=60 -> [Cp2] (only Cp2 applies)
        got = res[1] if theta <= 45 else res[0]
        check(f"Cp2 h/L={hL} theta={theta}", got, cp, 0.001)

# ---------------------------------------------------------------------------
# TEST 10 — Figure 27.3-1 LEEWARD ROOF Cp (ledger, 9 cells)
# theta columns 10, 15, >=20 (use 20). Single Cp per cell.
# ---------------------------------------------------------------------------
print("\nTEST 10 — Fig 27.3-1 leeward roof Cp (ledger, 9 cells)")
lee_table = {
    0.25: {10: -0.3, 15: -0.5, 20: -0.6},
    0.50: {10: -0.5, 15: -0.5, 20: -0.6},
    1.00: {10: -0.7, 15: -0.6, 20: -0.6},
}
for hL, row in lee_table.items():
    for theta, cp in row.items():
        check(f"leeward roof Cp h/L={hL} theta={theta}",
              dir_.get_leeward_roof_cp(hL, theta), cp, 0.001)

# ---------------------------------------------------------------------------
# TEST 11 — Figure 27.3-1 high-theta rules (ledger)
# 60 < theta <= 80 -> Cp = 0.01*theta ; theta > 80 -> Cp = +0.8.
# ---------------------------------------------------------------------------
print("\nTEST 11 — Fig 27.3-1 high-theta rules (ledger)")
check("theta=70 -> 0.01*theta = 0.70", dir_.get_windward_roof_cp(0.5, 70)[0], 0.70, 0.001)
check("theta=80 -> 0.01*theta = 0.80", dir_.get_windward_roof_cp(0.5, 80)[0], 0.80, 0.001)
check("theta=85 -> +0.8 (>80 rule)", dir_.get_windward_roof_cp(0.5, 85)[0], 0.80, 0.001)
check("theta=90 -> +0.8 (>80 rule)", dir_.get_windward_roof_cp(1.0, 90)[0], 0.80, 0.001)

# ---------------------------------------------------------------------------
# TEST 12 — Figure 27.3-1 Normal (theta<10) / Parallel roof distance zones
# (ledger). Returns [Cp1, Cp2]. h chosen so dist = ratio*h hits each zone.
#   h/L<=0.5: 0..h/2 -> -0.9/-0.18 ; h/2..h -> -0.9/-0.18 ;
#             h..2h -> -0.5/-0.18 ; >2h -> -0.3/-0.18
#   h/L>=1.0: 0..h/2 -> -1.3/-0.18 ; >h/2 -> -0.7/-0.18
# ---------------------------------------------------------------------------
print("\nTEST 12 — Fig 27.3-1 normal-theta<10 / parallel distance zones (ledger)")
h = 100.0
# h/L <= 0.5 table
for dist_ratio, cp1, cp2, label in [
    (0.25, -0.9, -0.18, '0 to h/2'),
    (0.75, -0.9, -0.18, 'h/2 to h'),
    (1.50, -0.5, -0.18, 'h to 2h'),
    (3.00, -0.3, -0.18, '> 2h'),
]:
    res = dir_.get_roof_cp_normal_parallel(0.5, dist_ratio * h, h)
    check(f"h/L=0.5 {label} Cp1", res[0], cp1, 0.001)
    check(f"h/L=0.5 {label} Cp2", res[1], cp2, 0.001)
# h/L >= 1.0 table (no area -> no reduction factor on -1.3)
for dist_ratio, cp1, cp2, label in [
    (0.25, -1.3, -0.18, '0 to h/2'),
    (1.00, -0.7, -0.18, '> h/2'),
]:
    res = dir_.get_roof_cp_normal_parallel(1.0, dist_ratio * h, h)
    check(f"h/L=1.0 {label} Cp1", res[0], cp1, 0.001)
    check(f"h/L=1.0 {label} Cp2", res[1], cp2, 0.001)

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
