# Georeference Control Points — ASCE 7-22 Velocity Maps (master, reusable)

**Purpose:** the ground-control points (GCPs) used to georeference the ASCE 7-22 basic
wind-speed maps in QGIS. **These lat/longs are identical for all four risk-category maps**
(Figure 26.5-1A / 1B / 1C / 1D) and for future editions — the maps share the same base
geography, only the drawn contours differ. Place them **once**, reuse **forever**.

Built 2026-07-04 while georeferencing **Figure 26.5-1B (Risk Cat. II)**. Thin Plate Spline
transform, EPSG:4326. All enabled points fit with ~0 residual.

---

## The reusable files (two forms)
1. **QGIS-loadable:** `docs/wind-data/georeference_control_points_ASCE722.points`
   (backup copy of the QGIS `.points` sidecar; original sits next to the RC II map image).
2. **Human-readable:** the table below (rebuild by hand if the `.points` file ever won't load).

## How to reuse on the OTHER velocity maps (RC I / III / IV)
1. Open the next map image in **Raster → Georeferencer**.
2. **File → Load GCP Points** → pick `georeference_control_points_ASCE722.points`.
3. **If the other map image is framed/sized like RC II** (usually true — same base figure),
   the source pixels line up and you're basically done — spot-check 3–4 points, nudge if any drifted.
   **If the image is a different scan/crop,** the source pixels won't match; use the lat/long
   table below to re-place each point (the lat/longs never change — only the pixel targets do).
4. Set **Thin Plate Spline**, CRS **EPSG:4326**, run.

> Naming: save each project/output per map, e.g. `Figure_26.5-1B_RiskCatII_digitize.qgz`,
> `..._1A_RiskCatI_...`, `..._1C_RiskCatIII_...`, `..._1D_RiskCatIV_...`.

---

## Control points (34 active + 3 disabled = 37)

Coordinates are **decimal degrees, WGS84**. X = longitude (East, negative in US),
Y = latitude (North). Interior tri-state corners are **surveyed monuments** (exact);
coastal/border points are **From-Map-Canvas approximations** (fine — georef tolerates ~1 mi).

### Verified interior tri-state corners (surveyed monuments — exact)
| # | Corner (states meet) | X / East (lng) | Y / North (lat) |
|---|---|---|---|
| 1 | Four Corners (AZ/CO/NM/UT) | -109.0452 | 36.9990 |
| 2 | CO/UT/WY | -109.0450 | 41.0118 |
| 3 | CO/KS/NE | -102.0518 | 40.0031 |
| 4 | AZ/NV/UT | -114.0497 | 37.0000 |
| 5 | NM/OK/TX (TX panhandle NW) | -103.0025 | 36.5003 |
| 6 | AR/OK/TX | -94.4858 | 33.6378 |
| 7 | MN/ND/SD | -96.5636 | 45.9353 |
| 8 | KY/TN/VA (Cumberland Gap) | -83.6756 | 36.6008 |
| 9 | CT/MA/NY | -73.4872 | 42.0497 |
| 10 | MA/NH/VT | -72.4583 | 42.7269 |
| 11 | IA/IL/WI | -90.6408 | 42.5083 |
| 12 | IN/MI/OH | -84.8061 | 41.6961 |
| 13 | ID/OR/WA | -116.9161 | 45.9953 |
| 14 | CA/NV/OR | -119.9992 | 41.9944 |
| 15 | MT/ND/SD | -104.0456 | 45.9453 |
| 16 | KY/OH/WV (Big Sandy) | -82.5958 | 38.4217 |
| 17 | AL/FL/GA | -85.0022 | 31.0006 |
| 18 | AL/MS/TN | -88.2000 | 34.9956 |
| 19 | NJ/NY/PA | -74.6950 | 41.3575 |
| 20 | DE/NJ/PA | -75.4150 | 39.8019 |
| 21 | DE/MD/PA (the Wedge) | -75.7886 | 39.7222 |
| 22 | MD/PA/WV | -79.4767 | 39.7211 |
| 23 | MD/VA/WV | -77.7189 | 39.3214 |
| 24 | KS/MO/NE | -95.3083 | 40.0000 |
| 25 | KS/MO/OK | -94.6181 | 36.9989 |

### Coastal / border points (From Map Canvas — approximate, ~1 mi is fine)
| # | Where | X / East (lng) | Y / North (lat) |
|---|---|---|---|
| 26 | AL/MS at Gulf coast | -88.4000 | 30.3000 |
| 27 | Sabine Pass (TX/LA at Gulf) | -93.8400 | 29.6800 |
| 28 | VA/NC at Atlantic | -75.8700 | 36.5500 |
| 29 | SC/GA at Atlantic (Savannah R.) | -80.8800 | 32.0300 |
| 30 | NC/SC at Atlantic (Little River) | -78.5400 | 33.8500 |
| 31 | CA/OR at Pacific | -124.2100 | 42.0000 |
| 32 | San Diego (CA/Mexico at Pacific) | -117.1200 | 32.5300 |
| 33 | AZ/NM/Mexico (NM bootheel SW) | -109.0500 | 31.3300 |
| 34 | TX/NM/Mexico (El Paso) | -106.5300 | 31.7800 |

### DISABLED — do not re-enable (mis-clicks / no crisp target)
| Corner | X / East | Y / North | Why disabled |
|---|---|---|---|
| AR/LA/TX | -94.0431 | 33.0192 | mis-click (residual 52 px); AR/OK/TX (#6) covers area |
| AR/MS/TN | -90.3092 | 34.9956 | mis-click (residual 85 px); AL/MS/TN (#18) covers area |
| NY/VT/Canada (Lake Champlain) | -73.3400 | 45.0130 | water point, no crisp target; NE already anchored by #9/#10 |

---

## Notes
- ~34 well-spread active points blanket CONUS + its whole perimeter → TPS fits with ~0 residual.
- The ASCE figure's **inset boxes** (Alaska, Hawaii, PR, Guam, legend) warp into the ocean
  corners after georeferencing — **ignore them; trace only the continental US contours.**
- Contour tracing does **not** need to be precise: the engine interpolates between contours,
  adds a conservative margin, and rounds **up** to 5 mph — small tracing wiggles change nothing.
- Related: [DIGITIZATION_GUIDE_maps_to_geojson.md](DIGITIZATION_GUIDE_maps_to_geojson.md),
  [WIND_DATA_SOURCES_METHODOLOGY_LEGAL_BASIS.md](WIND_DATA_SOURCES_METHODOLOGY_LEGAL_BASIS.md).
