"""
Parapet engine verification harness — ASCE 7-22 §30.6 (Fig 30.6-1).

Guards `asce7_22_cc_parapet.py` (LIVE / selling). The parapet reuses the
already-verified WALL GCp (Fig 30.3-1 h<=60 / Fig 30.4-1 h>60) and ROOF GCp
(Fig 30.3-2A h<=60 / Fig 30.4-1 h>60, Zones 2/3), so this harness checks:
  1. the correct wall/roof anchors are pulled (incl. the h>60 roof Zone-2 -1.6
     value that differs from h<=60),
  2. the §30.6 COMBINATION rule (book-confirmed 2026-07-13):
       Windward:  GCp = wall_pos - roof_neg   (= |wall_pos| + |roof_neg|)
       Leeward:   GCp = wall_pos - wall_neg   (= |wall_pos| + |wall_neg|)
  3. qp is taken at the TOP of the parapet (z = h + hp).

Expected values are the BOOK anchors (verified-values ledger), not the engine.

Run from repo root:
    C:/Python312/python.exe tests/test_engine_parapet.py
Exit code 0 = all pass, 1 = at least one failure.
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))

import asce7_22_cc_parapet as parapet_mod

PASS = "PASS"
FAIL = "FAIL"
results = []


def check(name, got, expected, tol=0.002):
    ok = abs(got - expected) <= tol
    results.append(ok)
    status = PASS if ok else FAIL
    print(f"  [{status}] {name}: got {got:.4f}, expected {expected:.4f} (tol {tol})")
    return ok


eng = parapet_mod.ASCE7_ParapetCalculator()


def par(h, hp, A, corner):
    return eng.calculate_parapet_pressure(150, 'ultimate', 'C', h, hp, A, corner=corner)


# ---------------------------------------------------------------------------
# Book anchors (verified-values ledger):
#   Wall Fig 30.3-1 (h<=60): pos 1.0@10/0.7@500 · Z4 -1.1@10/-0.8@500 · Z5 -1.4@10/-0.8@500
#   Wall Fig 30.4-1 (h>60):  pos 0.9@10/0.6@500 · Z4 -1.0@10/-0.7@500 · Z5 -1.8@10/-1.0@500
#   Roof Fig 30.3-2A (h<=60): Z2 -2.3@10/-1.4@500 · Z3 -3.2@10/-1.4@500
#   Roof Fig 30.4-1  (h>60):  Z2 -2.3@10/-1.6@500 · Z3 -3.2@10/-2.3@500
# ---------------------------------------------------------------------------
print("TEST A — h<=60, A=10: interior (wall Z4 + roof Z2) & corner (wall Z5 + roof Z3)")
r = par(30, 3, 10, corner=False)
c = r['coefficients']
check("interior wall_pos", c['GCp_wall_positive'], 1.0)
check("interior wall_neg (Z4)", c['GCp_wall_negative'], -1.1)
check("interior roof_neg (Z2)", c['GCp_roof_negative'], -2.3)
check("interior windward = wall_pos - roof_neg", c['GCp_windward_combined'], 1.0 - (-2.3))  # 3.3
check("interior leeward  = wall_pos - wall_neg", c['GCp_leeward_combined'], 1.0 - (-1.1))   # 2.1

r = par(30, 3, 10, corner=True)
c = r['coefficients']
check("corner wall_neg (Z5)", c['GCp_wall_negative'], -1.4)
check("corner roof_neg (Z3)", c['GCp_roof_negative'], -3.2)
check("corner windward = wall_pos - roof_neg", c['GCp_windward_combined'], 1.0 - (-3.2))    # 4.2
check("corner leeward  = wall_pos - wall_neg", c['GCp_leeward_combined'], 1.0 - (-1.4))      # 2.4

# ---------------------------------------------------------------------------
print("\nTEST B — h<=60, A=500 interior (large-area anchors)")
r = par(30, 3, 500, corner=False)
c = r['coefficients']
check("wall_pos @500", c['GCp_wall_positive'], 0.7)
check("wall_neg Z4 @500", c['GCp_wall_negative'], -0.8)
check("roof_neg Z2 @500", c['GCp_roof_negative'], -1.4)
check("windward @500", c['GCp_windward_combined'], 0.7 - (-1.4))  # 2.1
check("leeward  @500", c['GCp_leeward_combined'], 0.7 - (-0.8))   # 1.5

# ---------------------------------------------------------------------------
print("\nTEST C — h>60 sources correct figures (Fig 30.4-1 wall + roof)")
r = par(80, 4, 10, corner=False)
c = r['coefficients']
check("h>60 wall_pos @10", c['GCp_wall_positive'], 0.9)
check("h>60 wall_neg Z4 @10", c['GCp_wall_negative'], -1.0)
check("h>60 roof_neg Z2 @10", c['GCp_roof_negative'], -2.3)
# The tell-tale h>60 value: roof Zone 2 at A=500 is -1.6 (Fig 30.4-1), NOT -1.4 (Fig 30.3-2A)
r5 = par(80, 4, 500, corner=False)
check("h>60 roof_neg Z2 @500 = -1.6 (Fig 30.4-1, NOT -1.4)",
      r5['coefficients']['GCp_roof_negative'], -1.6)

# ---------------------------------------------------------------------------
print("\nTEST D — qp taken at TOP of parapet (z = h + hp)")
r = par(30, 3, 10, corner=False)
check("z_parapet_top = h + hp", r['velocity_pressure']['z_parapet_top_ft'], 33.0, 0.001)
# Taller parapet -> higher qp (Kz increases with height)
q_low = par(30, 3, 10, corner=False)['velocity_pressure']['qp_psf']
q_high = par(30, 20, 10, corner=False)['velocity_pressure']['qp_psf']
check("taller parapet -> higher qp (monotone)", 1.0 if q_high > q_low else 0.0, 1.0, 0.001)

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
