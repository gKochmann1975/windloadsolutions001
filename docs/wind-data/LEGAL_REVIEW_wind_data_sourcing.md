# Legal Review — Wind-Speed Data Sourcing for WindLoadCalc

**Prepared for:** counsel review
**Prepared by:** WindLoad Solutions LLC (Gregory Kochmann, Owner)
**Date:** 2026-07-04

> This memo organizes facts and questions for counsel. It is **not** legal advice and reaches
> **no** legal conclusions. Every "our view" line is a layperson's framing only.

---

## 1. What the product does
WindLoadCalc is a commercial SaaS wind-load calculator. For a project location, it returns the
**design (ultimate) wind speed** required by the applicable building code, by ASCE 7 Risk Category
(I–IV), which the design professional uses to compute wind loads. In Florida, values reflect the
**Florida Building Code (FBC)** as enforced by the jurisdiction (incl. HVHZ).

**Data flow (FL):** ZIP → lat/long (public) → compute code wind speed at that point from **public
wind-speed contour data** → apply FBC/jurisdiction overrides → round up to 5 mph → store/serve in
the product. The crux: **we compute values from public map data and store/serve them commercially.**

## 2. What the product does NOT do (and why)
- **NOT** use/query/scrape/cache/redistribute the **ASCE Hazard Tool** or its API.
- **NOT** reproduce ASCE's copyrighted map images or standard text.
- **NOT** a subscriber to any ASCE online product; never accepted any ASCE license.

We read the ASCE Hazard Tool subscription license. It restricts output to the subscriber's
**"private use or research"** and prohibits **"Altering, recompiling, reselling, publishing or
republishing … of any … output … in any form or medium,"** asserts "database protection," and
permits only "non-systematic" use. Building its output into our product would breach that
**contract**, so we avoid it entirely and source elsewhere.
- *Q:* Confirm that because we never subscribe to/use the Hazard Tool, **its license does not bind us.**

## 3. Data sources actually used
| Source | What it is | Nature |
|---|---|---|
| **FBC** | Adopts ASCE 7-22 wind maps by reference (8th Ed. 2023, Fig 1609.3(1)–(4)) | **Public law** |
| **FGDL wind layers** (Univ. of FL GeoPlan Center; served via county GIS) | Vector contours of ASCE 7-22 FL design wind speed; metadata: *"NIST-WindMaps … = FBC Fig 1609.3(1)"*; author **ARA / Lauren Mudd, PhD, PE** | **Public / tax-funded FL GIS**; attribution required |
| **NIST-WindMaps** (NIST / ARA) | Federal digitization underlying the FGDL layers | **US Gov work — public domain** (17 U.S.C. §105) |
| **USPS/Census ZIP lat/long** | Coordinates | Public |

## 4. Our (lay) legal theory — for you to confirm or correct
1. **Facts aren't copyrightable** (*Feist*, 499 U.S. 340).
2. **Values adopted into a building code are public law** (FBC incorporates the maps).
3. **Public / public-domain sources** (FGDL, NIST) — not a proprietary product.
4. **No contract with ASCE.**
5. **We compute, we don't copy** — implementing the code, not reselling ASCE's output.

## 5. Specific questions for counsel
**(a) Copyright in the ASCE 7-22 maps** — does deriving numeric values from public FGDL/NIST data
and storing them commercially create ASCE copyright exposure despite (1)–(5)?
**(b) Building-code adoption / "law isn't copyrightable"** — does *Veeck* / *Georgia v.
Public.Resource* (2020) support using the code-required values? How far for a *commercial* product?
**(c) Facts vs. compilation/database rights** — is our stored table safe under *Feist*, or is there
compilation/database exposure?
**(d) FGDL use terms + attribution** — review the specific layer's "Use & Access Constraints"; is
commercial derivation permitted; is our attribution sufficient; any ASCE pass-through restriction?
**(e) NIST public-domain status** — does the NIST origin (17 U.S.C. §105) place the underlying data
in the public domain and largely resolve the copyright concern?
**(f) ASCE Hazard Tool contract** — confirm it does not bind us; any risk ASCE *argues* we used it
(defense: documented public-source provenance, §6)?
**(g) Commercial / competitor posture** — does our commercial, competitor-adjacent use raise risk
even if the theory is sound? Value of attribution + provenance + "FBC-adopted" framing? Seek a
license/written comfort from ASCE?
**(h) Customer-facing liability** — review/approve an as-is disclaimer/ToS (design professional of
record responsible; verify against jurisdiction's adopted code).
**(i) National expansion** — any state-specific issues when extending beyond FL via each state's
public data / national NIST-ARA public-domain dataset?

## 5A. Research findings on the open questions (2026-07-04) — for counsel to weigh
**(d) FGDL — mostly resolved.** Layer metadata confirms: *"NIST-WindMaps: ASCE/SEI 7-22 … **FBC 8th
Ed (2023) FIGURE 1609.3(1) ULTIMATE DESIGN WIND SPEEDS.**"* Author/copyrightText: **Lauren Mudd,
PhD, PE — Applied Research Associates (ARA).** So the data **is** the adopted FBC code figure.
Still open: the exact FGDL "Use & Access Constraints" sentence (their metadata endpoint was
access-restricted/404). Attribution target: **ARA + NIST-WindMaps + FGDL.**

**(b) Commercial use — the leading case does NOT cleanly cover us.** *ASTM v. Public.Resource.Org*,
82 F.4th 1262 (D.C. Cir. 2023): held **non-commercial** posting of standards incorporated into law
is **fair use** — but rested on the nonprofit/educational/transformative purpose. Does not squarely
bless a **commercial** product's use. **However**, we don't republish standard text; we extract
**numeric facts** (uncopyrightable under *Feist*, commercial or not) that **are** the FBC code
figure. So our stronger basis is facts-not-copyrightable + public-law, not the *ASTM* holding.

**(g) ASCE-litigation risk — lower than assumed; correcting an earlier overstatement.** The
incorporated-standards suit was brought by **ASTM, NFPA, ASHRAE — NOT ASCE.** No documented case
found of ASCE suing a wind-load software company. Commercial competitors (SkyCiv, MecaWind,
Standards Design Group) openly publish ASCE 7 design wind speeds with no evident ASCE enforcement.
Caveat: absence of found litigation ≠ zero risk.

## 6. Our provenance / defense file (available on request)
Internal documentation records, per dataset: exact public source URL, that it is ASCE 7-22 as
adopted by FBC (Fig 1609.3), pull date, required attribution, and computation method — evidence our
values were computed from public sources, **not** taken from the ASCE Hazard Tool.

## 7. Key references
- ASCE Hazard Tool subscription license: `ascehazardtool.org/HazardTool_ASCE_MultiUser_Subscription_051017_FINAL.pdf`
- ASCE Hazard Tool ToU: https://www.asce.org/publications-and-news/asce-hazard-tool/terms
- FGDL data use policy: https://fgdl.org/ (per-layer metadata "Use & Access Constraints")
- FGDL wind layer (Osceola County ArcGIS REST): `gis.osceola.org/hosting/rest/services/Hosted/Ultimate_Design_Wind_Speeds_Risk_Category_2/FeatureServer` (metadata: "NIST-WindMaps: ASCE/SEI 7-22 = FBC Fig 1609.3(1)"; author ARA / Lauren Mudd, PhD, PE)
- 17 U.S.C. §105 (US Government works — public domain)
- *Feist Publ'ns v. Rural Tel. Serv. Co.*, 499 U.S. 340 (1991)
- *Veeck v. S. Bldg. Code Cong. Int'l*, 293 F.3d 791 (5th Cir. 2002)
- *Am. Soc'y for Testing & Materials v. Public.Resource.Org*, 82 F.4th 1262 (D.C. Cir. 2023)
- *Georgia v. Public.Resource.Org, Inc.*, 590 U.S. ___ (2020)
