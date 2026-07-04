# Digitizing ASCE 7-22 Wind Maps → GeoJSON (do-it-yourself guide)

**Goal:** turn a published ASCE 7-22 wind-speed map figure into vector contour data (GeoJSON) that
plugs straight into our velocity engine — the same kind of data FGDL gave us for Florida.

**Division of labor:**
- **You** do the tracing (reading the contour lines — the one step Claude can't do reliably).
- **Claude** does everything after: interpolation, capping, rounding, FBC/jurisdiction overrides,
  and validation against known ASCE points (so tracing slips get caught before we trust it).

---

## Tools (all free)
- **QGIS** (free, open source): https://qgis.org/download/ — this is all you need. It has a built-in
  **Georeferencer** and line-digitizing tools.

## Source maps
- ASCE 7-22 **Figure 26.5-1A/B/C/D** (the four risk-category basic wind speed maps), or the same maps
  as reproduced in the adopted building code. Use the **highest-resolution** version you have.
- You can crop to just the state you're doing to make it easier.

---

## Step 1 — Georeference the map (≈10-20 min/map)
Pin the flat image to real-world coordinates so every pixel = a lat/long.
1. QGIS → **Raster → Georeferencer**.
2. Open your map image.
3. Add **Ground Control Points (GCPs)** — click a recognizable spot on the image and type its real
   lat/long. Use **4–10 points spread across the map**: state corners, distinct coastline points,
   or where the map's lat/long grid lines cross (easiest — the map prints the grid).
4. Transformation: **Polynomial 2** (or Thin Plate Spline if the map is warped). Target CRS: **EPSG:4326**.
5. Run. You now have a georeferenced raster.

*Tip:* the printed lat/long gridline intersections on the ASCE maps are the cleanest control points.

## Step 2 — Set up the contour layer (once)
1. **Layer → Create Layer → New GeoPackage/Shapefile Layer**, geometry type **LineString**, CRS **EPSG:4326**.
2. Add these attribute fields (exact names):
   - `contour` — **Integer** (the mph value, e.g. 150)
   - `risk_cat` — **Integer** (1, 2, 3, or 4)
3. (Optional) `source` — Text (e.g. "ASCE 7-22 Fig 26.5-1B").

## Step 3 — Trace each contour (the labor step)
1. Toggle **Editing** (pencil icon) → **Add Line Feature**.
2. Click along a contour line, following it; **double-click / right-click to finish**.
3. In the popup, enter its **contour** value and **risk_cat**.
4. Repeat for **every contour line** in that risk category.
5. Turn on **snapping/trace** (the magnet + "Trace" toggle) to follow lines faster and connect cleanly.
6. Save often.

*How many lines?* Inland states have few (often 2–5 contours, mostly one low value). Coastal states
(NC, SC, TX, LA) have more near the coast (~8–15). Do all four risk categories (repeat Steps 1–3 per map).

## Step 4 — Export to GeoJSON
Right-click the layer → **Export → Save Features As → GeoJSON**, CRS **EPSG:4326**.
Name it clearly, e.g. `NC_windzones_asce7_22.geojson`.

---

## GeoJSON spec (what Claude needs — match this exactly)
- A single `FeatureCollection` (per state) is fine; each feature is one traced contour line.
- Each feature:
  ```json
  { "type": "Feature",
    "properties": { "contour": 150, "risk_cat": 2, "source": "ASCE 7-22 Fig 26.5-1B" },
    "geometry": { "type": "LineString", "coordinates": [[-78.9,34.2],[-78.7,34.4], ...] } }
  ```
- Coordinates in **[longitude, latitude]**, decimal degrees, **EPSG:4326**.
- One file per state (all 4 risk categories in it, distinguished by `risk_cat`) — or one file per
  risk category, either works.

That's it. Hand Claude the `.geojson` and it runs the rest + validates.

---

## Labor estimate (honest)
- **Learning curve (first time):** budget ~half a day to a full day to get comfortable with QGIS
  georeferencing + line digitizing. Once it clicks, it's fast.
- **Per state after that:**
  - Inland / low-wind states (GA, VA interior, NY, CA-interior): **~1–2 hrs** (few contours).
  - Coastal states (NC, SC, TX, LA, HI): **~3–5 hrs** (more contours near the coast).
- **All 9 priority states:** roughly **20–35 hours total**, spread out however you like.
- **Recommended:** do **one state first** (North Carolina is a good test — inland+coastal mix).
  Trace it → Claude processes + validates against known cities → confirm the whole pipeline works →
  then roll through the rest at your own pace, easiest states first.

## Ways to cut the effort
- Start with the states that have the **most customer demand**; you don't have to do all 9 at once.
- Trace **Cat II first** (most-used); add I/III/IV after — but any state is only "done" with all 4.
- Use QGIS **Trace mode** + snapping to speed line-following.
- If a large inland region is a single uniform value, one big contour boundary covers it.
