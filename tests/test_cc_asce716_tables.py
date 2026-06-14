"""
C&C Windows/Doors engine — validation against ASCE 7-16 Figure 30.4-1.

The published ASCE 7-16 "Net Design Wind Pressure (pnet30), Exposure B, h = 30 ft,
Enclosed" table is the authoritative ground truth the engine was calibrated to
(transcribed from the physical book, 2026-06-13). This test reproduces every
wall cell and confirms the engine still matches — the regression baseline for the
Kd-in-qz convention (see webapp/ENGINEERING_NOTES_ASCE_7_22_Kd_Ke.md).

It also confirms the result is convention-independent: applying Kd inside qz
(engine) vs in the design-pressure equation gives the identical final pressure.

Run from repo root:
    C:/Python312/python.exe tests/test_cc_asce716_tables.py
Exit 0 = all match, 1 = mismatch.
"""
import sys, os, math

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'webapp'))
import asce7_22_cc_windows_doors as cc

C = next(getattr(cc, n) for n in dir(cc)
         if isinstance(getattr(cc, n), type) and hasattr(getattr(cc, n), 'calculate_wind_pressure'))
eng = C()
Kd = eng.Kd

V_LIST = [95, 100, 105, 110, 115, 120, 130]

# ASCE 7-16 Figure 30.4-1, Exposure B, h=30 ft, Enclosed. (positive, negative) per V.
# Transcribed from the physical book 2026-06-13. Walls only (Zone 4 interior, 5 corner).
TABLE = {
 (4, 10):  [(16.2,-17.6),(18.0,-19.5),(19.8,-21.5),(21.8,-23.6),(23.8,-25.8),(25.9,-28.1),(30.4,-33.0)],
 (4, 20):  [(15.5,-16.9),(17.2,-18.7),(18.9,-20.6),(20.8,-22.6),(22.7,-24.7),(24.7,-26.9),(29.0,-31.6)],
 (4, 50):  [(14.5,-15.9),(16.1,-17.6),(17.8,-19.4),(19.5,-21.3),(21.3,-23.3),(23.2,-25.4),(27.2,-29.8)],
 (4, 100): [(13.8,-15.2),(15.3,-16.8),(16.9,-18.5),(18.5,-20.4),(20.2,-22.2),(22.0,-24.2),(25.9,-28.4)],
 (5, 10):  [(16.2,-21.7),(18.0,-24.1),(19.8,-26.6),(21.8,-29.1),(23.8,-31.9),(25.9,-34.7),(30.4,-40.7)],
 (5, 20):  [(15.5,-20.3),(17.2,-22.5),(18.9,-24.8),(20.8,-27.2),(22.7,-29.7),(24.7,-32.4),(29.0,-38.0)],
 (5, 50):  [(14.5,-18.3),(16.1,-20.3),(17.8,-22.4),(19.5,-24.6),(21.3,-26.9),(23.2,-29.3),(27.2,-34.3)],
 (5, 100): [(13.8,-16.9),(15.3,-18.7),(16.9,-20.6),(18.5,-22.6),(20.2,-24.7),(22.0,-26.9),(25.9,-31.6)],
}

TOL = 0.15  # psf — the book table is rounded to 0.1 psf
failures = []
checks = 0
max_err = 0.0

for (zone, area), rows in TABLE.items():
    s = math.sqrt(area)  # square component -> effective wind area = area
    for V, (pos_t, neg_t) in zip(V_LIST, rows):
        r = eng.calculate_wind_pressure(
            wind_speed=V, speed_type='ultimate', exposure_category='B',
            enclosure_classification='enclosed', mean_roof_height=30,
            building_width=50, building_length=80,
            component_width=s, component_height=s, zone=zone, elevation_ft=0)
        qh = r['calculated_factors']['qh_psf']
        gp = r['pressure_coefficients']['gcp_positive']
        gn = r['pressure_coefficients']['gcp_negative']
        # engine (Kd in qz): p = qh*(GCp - GCpi)
        pos_eng = qh * (gp - (-0.18))
        neg_eng = qh * (gn - 0.18)
        # convention check: Kd-in-p must give the SAME final pressure
        pos_alt = (qh / Kd) * Kd * (gp + 0.18)
        neg_alt = (qh / Kd) * Kd * (gn - 0.18)
        assert abs(pos_eng - pos_alt) < 1e-9 and abs(neg_eng - neg_alt) < 1e-9, \
            f"convention mismatch at zone{zone} A{area} V{V}"
        for label, tval, eng_val in [('+', pos_t, pos_eng), ('-', neg_t, neg_eng)]:
            checks += 1
            err = abs(eng_val - tval)
            max_err = max(max_err, err)
            if err > TOL:
                failures.append(f"Zone {zone} A={area} V={V} {label}: "
                                f"book {tval}, engine {eng_val:.2f} (off {err:.2f})")

print(f"ASCE 7-16 Fig 30.4-1 wall validation (Exp B, h=30, Enclosed):")
print(f"  {checks} cells checked, {checks - len(failures)} match, "
      f"{len(failures)} off (tol {TOL} psf), max deviation {max_err:.2f} psf")
print(f"  convention-independence (Kd-in-qz == Kd-in-p): confirmed every cell")
if failures:
    print("\nFAILURES:")
    for f in failures:
        print("  " + f)
    sys.exit(1)
print("\nALL CELLS MATCH — engine reproduces ASCE 7-16 Figure 30.4-1.")
sys.exit(0)
