# Wind Speed Data — Sources, Methodology & Legal Basis
### Shareable version (establishes legitimacy; excludes proprietary implementation)

_Last updated: 2026-07-04_

## 1. Purpose
Describes, at a transparency level, **where our design wind-speed values come from, how we
determine them, and the legal basis for providing them.** Intended for customers, reviewers,
permitting officials, and data-rights inquiries. It deliberately does **not** include internal
implementation details.

## 2. What we provide
The **design (ultimate) wind speed required by the applicable building code** for a project
location, by ASCE 7 Risk Category (I–IV), so a design professional can determine wind loads. In
Florida, values reflect the **Florida Building Code (FBC)** as enforced by the governing
jurisdiction, including High-Velocity Hurricane Zone (HVHZ) requirements.

## 3. Data sources — all public
- **Florida Building Code (FBC)** — public law. FBC adopts the ASCE/SEI 7-22 basic wind-speed
  maps by reference (FBC 8th Ed. 2023, Figure 1609.3(1)–(4)); those speeds are the building
  requirements.
- **FGDL — Florida Geographic Data Library** (Univ. of Florida GeoPlan Center) — public,
  tax-funded FL GIS. We use the ultimate-design-wind-speed layers (Risk Cat I–IV), which the
  layer metadata identifies as **"NIST-WindMaps: ASCE/SEI 7-22 … = FBC Figure 1609.3(1)."**
- **NIST-WindMaps** (National Institute of Standards and Technology / ARA) — the federal
  digitization underlying the FGDL layers; US Government works are public domain.
- **USPS/Census ZIP coordinates** — public.

## 4. What we do NOT use
We do **not** use, query, scrape, cache, or redistribute output from the **ASCE Hazard Tool** or
its API, and we do **not** reproduce ASCE's copyrighted map images or standard text. Our values
are computed independently from the public sources above.

## 5. Methodology (high level)
1. Determine the code-adopted design wind speed for a location by **geometric analysis of public
   wind-speed contour data**, by ASCE 7 risk category.
2. Apply **jurisdiction / building-code overrides** on top, so the result reflects the value **as
   the governing authority enforces it** (e.g., HVHZ).
3. Present in **5-mph increments, rounded up** (conservative — never below the code value),
   consistent with permit-office convention.
4. **Validate** against known published code values before use.

## 6. Legal basis
- **Facts aren't copyrightable** (*Feist*). A design wind speed at a location is a factual value.
- **Code-adopted values are public law.** The wind speeds are incorporated into the FBC.
- **Public / public-domain sources** (FGDL public GIS; NIST federal public domain).
- **No contract** with any ASCE online product governs our use.
- **Attribution** to FGDL + data originator (ARA / NIST-WindMaps) per FGDL's public-use terms.

## 7. Accuracy & professional-responsibility statement
Values assist a licensed design professional and are derived from public code data. The design
professional of record is responsible for confirming the design wind speed with the authority
having jurisdiction. Values are provided **as-is, without warranty**; the user is responsible for
verifying against the adopted code for the project's jurisdiction.

## 8. Attribution
Wind-speed base data: **Florida Geographic Data Library (FGDL)**, University of Florida GeoPlan
Center, and the data originators (**Applied Research Associates / NIST-WindMaps**), representing
ASCE/SEI 7-22 wind speeds as adopted by the Florida Building Code, Figure 1609.3(1)–(4).
