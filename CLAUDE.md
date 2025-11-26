# WindLoad Solutions - Claude Memory

## IMPORTANT: Pre-Launch Checklist

### Before Going Live - MUST DO:
1. **Enable Email Normalization** - Prevent trial abuse
   - In Railway backend environment variables, ensure:
   - `NORMALIZE_EMAIL_ALIASES=true` (or remove the variable - defaults to true)
   - This prevents users from using `user+alias@gmail.com` for unlimited trials

2. **Switch Stripe to Production Mode**
   - Replace test API keys with live keys in Railway
   - Update webhook secret for production

---

## Project Overview

### Architecture:
- **Frontend**: windloadcalc.com (static HTML/CSS/JS hosted on GitHub Pages)
- **Backend**: Railway (Python/Flask API with PostgreSQL)
- **Payments**: Stripe (subscriptions)
- **Email**: SendGrid (transactional emails)
- **Auth**: Email/password + Google OAuth

### Key Products:
- **BIP** (Building Intelligence Platform) - HTML/JSON website tool
- **Wind Load Calculator** - Python/JSON calculation webapp

### Domain Strategy:
- windloadcalc.com - Main product site
- windload.solutions - 100+ page authority site
- windload.co - Marketing landing pages

---

## Current Testing Status

Testing email normalization is DISABLED to allow +alias testing.
Remember to RE-ENABLE before production launch!

Environment variable to check: `NORMALIZE_EMAIL_ALIASES`
- `false` = Testing mode (allows +alias emails)
- `true` = Production mode (blocks +alias abuse)

---

## Wind Velocity Data System - CRITICAL DOCUMENTATION

### Overview
The wind velocity lookup system uses **pre-calculated velocities stored in CSV** rather than external APIs. This ensures fast, accurate, and consistent results.

### Data Source: `usps_zip_codes.csv`
Located at: `webapp/usps_zip_codes.csv`
- Contains all ~33,000+ US ZIP codes
- Includes city, state, county, lat/lng for each ZIP
- **Pre-calculated wind velocities** for all 4 ASCE risk categories:
  - `velocity_risk_cat_1` - Risk Category I
  - `velocity_risk_cat_2` - Risk Category II
  - `velocity_risk_cat_3` - Risk Category III
  - `velocity_risk_cat_4` - Risk Category IV

### How Wind Velocities Were Determined

**The Problem (Before):**
- External APIs (ASCE Hazard Tool) were slow, rate-limited, inconsistent
- Runtime interpolation from contour lines gave inaccurate results
- Different sources disagreed on wind speeds

**The Solution:**
1. **Obtained official ASCE 7-22 wind speed maps** (PNG images for each risk category)
2. **Manually traced contour boundaries** from the maps
3. **Encoded boundaries as geographic rules** in `webapp/wind_velocity_assignment.py`
4. **Ran rules against all ZIP codes** to populate CSV with pre-verified velocities

### Key Files

| File | Purpose |
|------|---------|
| `webapp/usps_zip_codes.csv` | Master database with all ZIP codes and velocities |
| `webapp/usps_zip_data.py` | Python module to load/query CSV data |
| `webapp/wind_velocity_assignment.py` | Geographic rules for velocity assignment |
| `webapp/velocity_finder_core.py` | Main velocity lookup engine |
| `webapp/asce_wind_processor/` | Tools for processing ASCE map images |
| `website/building-intelligence-platform.js` | BIP frontend (loads same CSV) |

### How Lookups Work

```
User enters: ZIP code, City/State, or Address
            ↓
    Extract/Find ZIP Code
            ↓
    Look up in usps_zip_codes.csv
            ↓
    Return pre-calculated velocity from correct risk category column
```

### Geographic Rules Example (`wind_velocity_assignment.py`)

```python
# Florida - highest wind speeds on east coast
if state == 'FL':
    if lat < 26 and lng > -81:
        return 170  # Southeast Florida coast/Keys
    if lng > -80.5:
        return 160  # East coast
    if lat < 26.5 and lng < -82:
        return 150  # Southwest Florida
    ...
```

---

## UPDATING FOR NEW ASCE VERSIONS (e.g., ASCE 7-28)

When a new ASCE 7 version is published, follow this process:

### Step 1: Obtain Official Maps
- Get official ASCE 7-XX wind speed maps for all risk categories (I, II, III, IV)
- Maps should be high-resolution PNG or PDF
- Place in `webapp/asce_wind_processor/test_images/`

### Step 2: Trace Contour Boundaries
- Study each map and identify wind speed contour lines
- Note lat/lng boundaries where speeds change
- Document coastal vs inland transitions
- Pay special attention to:
  - Hurricane-prone regions (Florida, Gulf Coast, Atlantic Coast)
  - Special wind regions (Alaska, Hawaii, territories)
  - Local jurisdiction overrides

### Step 3: Update Geographic Rules
- Edit `webapp/wind_velocity_assignment.py`
- Create new functions: `get_wind_velocity_risk_cat_X_asce7_XX()`
- Encode the traced boundaries as lat/lng conditions
- Test with known locations to verify accuracy

### Step 4: Regenerate CSV
- Run the velocity assignment against all ZIP codes
- Update CSV columns or add new version-specific columns
- Verify sample locations match official ASCE values

### Step 5: Update Frontend/Backend
- Update `usps_zip_data.py` to read new columns
- Update `velocity_finder_core.py` for new version logic
- Update BIP JavaScript to use new data
- Add version selector if supporting multiple ASCE versions

### Step 6: Validate
- Test at least 20-30 locations across different regions
- Compare results with ASCE Hazard Tool for verification
- Document any discrepancies and their resolution

### Important Notes
- NEVER rely solely on external APIs for production
- Always maintain local CSV as primary data source
- Keep backups of previous ASCE version data
- The `asce_wind_processor/` folder has tools that may help with map analysis
