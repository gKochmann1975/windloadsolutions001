# URL Redirect Map

## Old URLs → New URLs (for 301 redirects)

These redirects should be configured in your web server or via GitHub Pages _redirects file to preserve SEO value and prevent broken links.

### Primary Redirects

| Old URL | New URL | Purpose |
|---------|---------|---------|
| `/contact-us-wind-load-calculators-for-components-and-cladding-cc-wind-load-pressures-per-the-asce-7-16-and-asce-7-22-publication-windloads-made-easy.html` | `/contact.html` | Contact page |
| `/faqfor-wind-load-calculator-software-for-wind-load-pressures-per-asce-7.html` | `/faq.html` | FAQ page |
| `/free-online-wind-load-calculators-demos-free-excel-wind-load-calculator.html` | `/demo.html` | Demo page |
| `/services-asce7-wind-load-pressures.html` | `/services.html` | Services page |
| `/why-choose-windload-solutions.html` | `/why-us.html` | Why choose us page |

## Implementation Options

### Option 1: Jekyll/GitHub Pages _redirects file
Create a `_redirects` file in your root:
```
/contact-us-wind-load-calculators-for-components-and-cladding-cc-wind-load-pressures-per-the-asce-7-16-and-asce-7-22-publication-windloads-made-easy.html /contact.html 301
/faqfor-wind-load-calculator-software-for-wind-load-pressures-per-asce-7.html /faq.html 301
/free-online-wind-load-calculators-demos-free-excel-wind-load-calculator.html /demo.html 301
/services-asce7-wind-load-pressures.html /services.html 301
/why-choose-windload-solutions.html /why-us.html 301
```

### Option 2: HTML Meta Refresh (if server redirects not available)
Create placeholder files with the old names containing:
```html
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=/contact.html">
    <link rel="canonical" href="https://windloadcalc.com/contact.html">
</head>
<body>
    <p>Redirecting to <a href="/contact.html">new page</a>...</p>
</body>
</html>
```

### Option 3: Cloudflare Page Rules (if using Cloudflare)
Configure 301 redirects in Cloudflare dashboard under Page Rules.

## SEO Benefits of New URLs

- **Shorter URLs**: Easier to share and remember
- **Cleaner structure**: Better user experience
- **Keyword focused**: 3-5 relevant keywords max
- **Consistent branding**: Ready for windloadcalc.com domain
- **Mobile friendly**: Shorter URLs render better on mobile

## Migration Date
- **Date**: November 16, 2025
- **Files renamed**: 5
- **Internal references updated**: 417+ occurrences across 22 HTML files

## Notes
- All internal links have been updated to use new URLs
- Old URLs may still have external backlinks or bookmarks
- Monitor Google Search Console for 404 errors after deployment
- Submit updated sitemap to Google after deployment
