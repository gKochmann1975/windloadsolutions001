"""
Attached-canopy engine verification harness — ASCE 7-22 §30.9.

Guards `asce7_22_cc_canopy.py` (LIVE / selling) against regressions of the
book-verified GCp / GCpn anchor values. Expected values are the BOOK anchors
(Figs 30.9-1A/1B for h<=60, 30.9-2A/2B for h>60), read from the physical ASCE
7-22 book — pages photographed & confirmed 2026-08-02, matching
ASCE 7-22/CANOPIES_PARAPETS_Cf_REFERENCE.md (Greg, 2026-07-18). NOT read from
the engine (Rule 4: tests encode the book, not the code).

Sign convention (Fig 30.9-* Note 3/4): negative = uplift (away from surface).

Run from repo root:
    C:/Python312/python.exe tests/test_engine_canopy.py
Exit code 0 = all pass, 1 = at least one failure.
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

import asce7_22_cc_canopy as canopy_mod

PASS = "PASS"
FAIL = "FAIL"
results = []


def check(name, got, expected, tol=0.002):
    ok = abs(got - expected) <= tol
    results.append(ok)
    status = PASS if ok else FAIL
    print(f"  [{status}] {name}: got {got:.4f}, expected {expected:.4f} (tol {tol})")
    return ok


eng = canopy_mod.ASCE7_AttachedCanopyCalculator()


def sep(h, A):
    """Separate-surface GCp: returns (upper_neg, lower_neg, pos)."""
    r = eng.calculate_canopy_pressure(150, 'ultimate', 'C', h, 9.0, 10.0, A,
                                      method='separate')
    c = r['coefficients']
    return (c['upper_surface']['GCp_neg'], c['lower_surface']['GCp_neg'],
            c['positive_both_surfaces']['GCp'])


def net(h, hc_he, A):
    """Net GCpn at a given hc/he band anchor: returns (pos, neg)."""
    he = 10.0
    r = eng.calculate_canopy_pressure(150, 'ultimate', 'C', h, hc_he * he, he, A,
                                      method='net')
    c = r['coefficients']
    return c['GCpn_positive'], c['GCpn_negative']


# ---------------------------------------------------------------------------
print("TEST A — Fig 30.9-1A SEPARATE surfaces, h<=60 (book anchors)")
# Upper: (10,-1.125)(100,-0.7) · Lower: (10,-0.8)(100,-0.625) · Pos: (10,0.8)(100,0.625)
for A, up, lo, po in [(10, -1.125, -0.8, 0.8), (100, -0.7, -0.625, 0.625)]:
    u, l, p = sep(30, A)
    check(f"1A upper_neg @A={A}", u, up)
    check(f"1A lower_neg @A={A}", l, lo)
    check(f"1A positive  @A={A}", p, po)

# ---------------------------------------------------------------------------
print("\nTEST B — Fig 30.9-1B NET GCpn, h<=60, THREE hc/he bands")
# pos_all: (10,0.875)(100,0.6667)
for A, po in [(10, 0.875), (100, 0.6667)]:
    p, _ = net(30, 0.95, A)
    check(f"1B pos_all @A={A}", p, po)
# band 0.9-1 (hc/he=0.95): (10,-1.375)(100,-1.125)
for A, ng in [(10, -1.375), (100, -1.125)]:
    _, n = net(30, 0.95, A)
    check(f"1B neg band 0.9-1 @A={A}", n, ng)
# band 0.5-0.9 (hc/he=0.70): (10,-0.875)(100,-0.6)
for A, ng in [(10, -0.875), (100, -0.6)]:
    _, n = net(30, 0.70, A)
    check(f"1B neg band 0.5-0.9 @A={A}", n, ng)
# band <=0.5 (hc/he=0.50): (10,-0.5625)(100,-0.45)
for A, ng in [(10, -0.5625), (100, -0.45)]:
    _, n = net(30, 0.50, A)
    check(f"1B neg band <=0.5 @A={A}", n, ng)

# ---------------------------------------------------------------------------
print("\nTEST C — Fig 30.9-2A SEPARATE surfaces, h>60 (printed book labels)")
# Upper: (10,-1.9)(100,-1.7)(1000,-1.0) · Lower: (10,-1.0)(100,-0.8)(1000,-0.5)
# Pos: (10,0.8)(100,0.6)
for A, up, lo in [(10, -1.9, -1.0), (100, -1.7, -0.8), (1000, -1.0, -0.5)]:
    u, l, p = sep(80, A)
    check(f"2A upper_neg @A={A}", u, up)
    check(f"2A lower_neg @A={A}", l, lo)
for A, po in [(10, 0.8), (100, 0.6)]:
    _, _, p = sep(80, A)
    check(f"2A positive  @A={A}", p, po)

# ---------------------------------------------------------------------------
print("\nTEST D — Fig 30.9-2B NET GCpn, h>60, TWO hc/he bands")
# pos_all: (10,0.9)(100,0.65)(1000,0.65)
for A, po in [(10, 0.9), (100, 0.65), (1000, 0.65)]:
    p, _ = net(80, 0.95, A)
    check(f"2B pos_all @A={A}", p, po)
# band 0.9-1 (hc/he=0.95): (10,-2.3)(100,-2.1)(1000,-1.2)
for A, ng in [(10, -2.3), (100, -2.1), (1000, -1.2)]:
    _, n = net(80, 0.95, A)
    check(f"2B neg band 0.9-1 @A={A}", n, ng)
# band 0.1-0.9 (hc/he=0.50): (10,-1.3)(100,-0.75)(1000,-0.75)
for A, ng in [(10, -1.3), (100, -0.75), (1000, -0.75)]:
    _, n = net(80, 0.50, A)
    check(f"2B neg band 0.1-0.9 @A={A}", n, ng)

# ---------------------------------------------------------------------------
print("\nTEST E — method / figure selection + qh(Kd folded in)")
r_le = eng.calculate_canopy_pressure(150, 'ultimate', 'C', 30, 9, 10, 10, method='net')
r_gt = eng.calculate_canopy_pressure(150, 'ultimate', 'C', 80, 9, 10, 10, method='net')
check("h=30 -> Fig 30.9-1B", 1.0 if r_le['figure'] == 'Fig 30.9-1B' else 0.0, 1.0, 0.001)
check("h=80 -> Fig 30.9-2B", 1.0 if r_gt['figure'] == 'Fig 30.9-2B' else 0.0, 1.0, 0.001)
# qh at h=30, Exp C: Kz=0.98, Kzt=1, Kd=0.85, Ke=1, V=150 -> 0.00256*0.98*0.85*1*150^2
qh_expected = 0.00256 * 0.98 * 1.0 * 0.85 * 1.0 * 150 ** 2
check("qh includes Kd (h=30, Exp C)", r_le['velocity_pressure']['qh_psf'],
      round(qh_expected, 2), 0.05)

# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
n_pass = sum(results)
n_total = len(results)
if all(results):
    print(f"ALL {n_total} CHECKS PASSED")
    sys.exit(0)
else:
    print(f"{n_pass}/{n_total} passed \u2014 {n_total - n_pass} FAILED")
    sys.exit(1)
