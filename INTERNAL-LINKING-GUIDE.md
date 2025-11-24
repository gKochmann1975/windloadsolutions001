# Internal Linking Guide for SEO Pages

## Quick Reference: How to Link to New SEO Pages

### New Pages Created:
1. **free-wind-load-calculator.html** - Primary money page
2. **asce-7-wind-load-calculator.html** - ASCE 7 comprehensive guide
3. **components-and-cladding-wind-loads.html** - C&C detailed resource

---

## Recommended Internal Links to Add

### From Homepage (index.html):

Add these links in the main content area:

```html
<!-- Add to homepage content -->
<section class="resources-section">
    <h2>Comprehensive Wind Load Resources</h2>
    <div class="resource-cards">
        <div class="resource-card">
            <h3><a href="/free-wind-load-calculator">Free Wind Load Calculator Guide</a></h3>
            <p>Complete guide to calculating wind loads per ASCE 7. Learn step-by-step methodology, formulas, and best practices.</p>
        </div>

        <div class="resource-card">
            <h3><a href="/asce-7-wind-load-calculator">ASCE 7 Wind Load Calculator</a></h3>
            <p>Professional ASCE 7 calculator supporting editions 7-10, 7-16, and 7-22. Complete comparison and methodology guide.</p>
        </div>

        <div class="resource-card">
            <h3><a href="/components-and-cladding-wind-loads">Components and Cladding Wind Loads</a></h3>
            <p>Detailed guide to C&C calculations for windows, doors, roofing, and wall cladding with real-world examples.</p>
        </div>
    </div>
</section>
```

### From Existing Demo Page (demo.html):

Add contextual links within content:

```html
<!-- Add near calculator section -->
<p>Our professional <a href="/free-wind-load-calculator">free wind load calculator</a> implements
complete <a href="/asce-7-wind-load-calculator">ASCE 7 methodology</a> for both MWFRS and
<a href="/components-and-cladding-wind-loads">components and cladding</a> calculations.</p>
```

### From FAQ Page (faq.html):

Link relevant questions to detailed pages:

```html
<div class="faq-answer">
    For detailed step-by-step instructions, see our complete guide:
    <a href="/free-wind-load-calculator#how-to-calculate">How to Calculate Wind Load</a>
</div>

<div class="faq-answer">
    Learn more about <a href="/components-and-cladding-wind-loads">components and cladding wind loads</a>
    and why they differ from MWFRS pressures.
</div>
```

### Navigation Menu Updates:

Add dropdown menu for resources:

```html
<nav class="main-nav">
    <div class="nav-dropdown">
        <span class="nav-dropdown-toggle">Resources <span class="dropdown-arrow">▼</span></span>
        <div class="nav-dropdown-menu">
            <a href="/free-wind-load-calculator">Free Wind Load Calculator Guide</a>
            <a href="/asce-7-wind-load-calculator">ASCE 7 Calculator</a>
            <a href="/components-and-cladding-wind-loads">Components & Cladding</a>
            <a href="/demo">Free Demo</a>
            <a href="/faq">FAQ</a>
        </div>
    </div>
</nav>
```

---

## Footer Links to Add

Update site footer on all pages:

```html
<footer>
    <div class="footer-section">
        <h4>Wind Load Resources</h4>
        <ul>
            <li><a href="/free-wind-load-calculator">Free Wind Load Calculator</a></li>
            <li><a href="/asce-7-wind-load-calculator">ASCE 7 Calculator</a></li>
            <li><a href="/components-and-cladding-wind-loads">Components & Cladding</a></li>
            <li><a href="/demo">Free Demo</a></li>
        </ul>
    </div>
</footer>
```

---

## Contextual Link Opportunities

### When mentioning "ASCE 7" anywhere on site:
```html
Calculate per <a href="/asce-7-wind-load-calculator">ASCE 7 standards</a>
```

### When mentioning "components and cladding" or "C&C":
```html
Analyze <a href="/components-and-cladding-wind-loads">components and cladding loads</a>
```

### When mentioning "free calculator" or "free trial":
```html
Try our <a href="/free-wind-load-calculator">free wind load calculator</a>
```

### When mentioning "wind pressure" or "wind loads":
```html
Calculate <a href="/free-wind-load-calculator#pressure-formulas">wind pressure</a>
```

### When mentioning "windows" or "window design":
```html
Design <a href="/components-and-cladding-wind-loads#window-wind-load">windows for wind loads</a>
```

---

## Anchor Text Variations

Use diverse, natural anchor text (avoid over-optimization):

### For free-wind-load-calculator.html:
- "free wind load calculator"
- "wind load calculation guide"
- "how to calculate wind loads"
- "wind pressure calculator"
- "complete wind load guide"
- "step-by-step wind load calculations"

### For asce-7-wind-load-calculator.html:
- "ASCE 7 calculator"
- "ASCE 7 wind load standards"
- "ASCE 7-16 and 7-22"
- "ASCE 7 methodology"
- "ASCE 7 compliance"

### For components-and-cladding-wind-loads.html:
- "components and cladding"
- "C&C wind loads"
- "window wind loads"
- "cladding pressure calculations"
- "components and cladding guide"
- "C&C pressure zones"

---

## Sitemap.xml Update

Add these URLs to sitemap (create if doesn't exist):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://windloadcalc.com/</loc>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://windloadcalc.com/free-wind-load-calculator</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://windloadcalc.com/asce-7-wind-load-calculator</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://windloadcalc.com/components-and-cladding-wind-loads</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://windloadcalc.com/demo</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <!-- Add other pages -->
</urlset>
```

---

## Cross-Linking Between New Pages

Each new page already links to the others in footers. Additional contextual links:

### In free-wind-load-calculator.html:
- Link to ASCE 7 page when mentioning specific editions
- Link to C&C page in Components & Cladding section
- Link to demo page in CTAs

### In asce-7-wind-load-calculator.html:
- Link to free calculator page for general information
- Link to C&C page when discussing Chapter 30
- Link to demo page in CTAs

### In components-and-cladding-wind-loads.html:
- Link to ASCE 7 page when referencing code provisions
- Link to free calculator page for methodology
- Link to demo page in CTAs

---

## Image Alt Text Guidelines

When adding images to these pages:

### For free-wind-load-calculator.html:
- "Free wind load calculator interface showing ASCE 7 calculations"
- "Wind pressure formula diagram for building design"
- "Step-by-step wind load calculation process"

### For asce-7-wind-load-calculator.html:
- "ASCE 7 wind load calculator with directional procedure"
- "ASCE 7-22 wind speed map comparison"
- "MWFRS pressure coefficient diagram"

### For components-and-cladding-wind-loads.html:
- "Components and cladding wind pressure zones diagram"
- "Window wind load calculation example"
- "Roof pressure zones showing corner, edge, and interior areas"

---

## Robots.txt Verification

Ensure these pages are crawlable:

```
User-agent: *
Allow: /free-wind-load-calculator
Allow: /asce-7-wind-load-calculator
Allow: /components-and-cladding-wind-loads
Sitemap: https://windloadcalc.com/sitemap.xml
```

---

## Google Search Console Setup

1. Submit new sitemap
2. Request indexing for new pages:
   - free-wind-load-calculator.html
   - asce-7-wind-load-calculator.html
   - components-and-cladding-wind-loads.html
3. Monitor coverage reports
4. Track keyword performance

---

## Social Media Sharing

Use these Open Graph titles when sharing:

- "Free Wind Load Calculator | Complete ASCE 7 Guide"
- "ASCE 7 Wind Load Calculator | Professional Compliance Software"
- "Components and Cladding Wind Loads | C&C Pressure Guide"

---

## Email Signature Links

Add to team email signatures:

```
Free Resources:
- Wind Load Calculator Guide: https://windloadcalc.com/free-wind-load-calculator
- ASCE 7 Calculator: https://windloadcalc.com/asce-7-wind-load-calculator
```

---

## Priority Implementation Checklist

- [ ] Add navigation menu dropdown for resources
- [ ] Add resource cards to homepage
- [ ] Update footer links on all pages
- [ ] Add contextual links from demo page
- [ ] Add contextual links from FAQ page
- [ ] Create/update sitemap.xml
- [ ] Submit sitemap to Google Search Console
- [ ] Request indexing for new pages
- [ ] Add images with proper alt text
- [ ] Set up conversion tracking
- [ ] Monitor rankings in Google Search Console
- [ ] Create supporting blog content linking to pillar pages

---

**Remember:** Natural linking is key. Don't force links everywhere. Link when it genuinely helps the user navigate to relevant, helpful content.
