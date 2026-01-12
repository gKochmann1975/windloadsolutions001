"""
Generate comprehensive sitemap.xml for WindLoadCalc.com
Includes all pages with proper priorities and change frequencies
"""
from pathlib import Path
from datetime import datetime

# Configuration
BASE_URL = "https://windloadcalc.com"
today = datetime.now().strftime('%Y-%m-%d')

# Page priority and changefreq settings
page_settings = {
    # Homepage
    'index.html': ('1.0', 'weekly'),

    # Main product pages
    'wind-load-calculator-shop.html': ('0.9', 'weekly'),
    'building-intelligence-platform-shop.html': ('0.9', 'weekly'),
    'wind-load-calculator-landing.html': ('0.9', 'weekly'),
    'building-intelligence-platform-landing.html': ('0.9', 'weekly'),

    # Dashboard and account
    'dashboard.html': ('0.8', 'weekly'),
    'account.html': ('0.7', 'monthly'),
    'login.html': ('0.6', 'monthly'),

    # Calculator pages
    'contractors-wind-load-calculator.html': ('0.8', 'weekly'),
    'wind-load-calculator-for-engineers.html': ('0.8', 'weekly'),
    'wind-load-calculator-for-architects.html': ('0.8', 'weekly'),
    'wind-load-calculator-comparison.html': ('0.7', 'monthly'),

    # Service pages
    'services.html': ('0.7', 'monthly'),
    'wind-loads-for-consultants.html': ('0.7', 'monthly'),
    'why-us.html': ('0.7', 'monthly'),
    'contact.html': ('0.6', 'monthly'),
    'faq.html': ('0.6', 'monthly'),

    # Checkout/Success pages (low priority, don't need frequent crawling)
    'calc-shop-success.html': ('0.3', 'yearly'),
    'bip-shop-success.html': ('0.3', 'yearly'),
    'checkout-success.html': ('0.3', 'yearly'),
    'success.html': ('0.3', 'yearly'),

    # Cancel pages
    'calc-shop-cancel.html': ('0.2', 'yearly'),
    'bip-shop-cancel.html': ('0.2', 'yearly'),
    'checkout-cancelled.html': ('0.2', 'yearly'),

    # Cart and checkout
    'cart.html': ('0.4', 'monthly'),

    # Legal pages
    'privacy-policy.html': ('0.4', 'yearly'),
    'terms-of-service.html': ('0.4', 'yearly'),

    # Team management (noindex)
    'team-management.html': ('0.2', 'yearly'),
    'join-team.html': ('0.2', 'yearly'),

    # Migration page (noindex)
    'migrate.html': ('0.1', 'yearly'),

    # Password reset (noindex)
    'reset-password.html': ('0.2', 'yearly'),

    # Admin (should be blocked in robots.txt)
    'admin.html': ('0.1', 'yearly'),

    # Demo
    'demo.html': ('0.5', 'monthly'),
}

# Pages to exclude from sitemap (private/internal)
exclude_pages = [
    'admin.html',
    'team-management.html',
    'join-team.html',
    'migrate.html',
    'reset-password.html',
    'bip-test.html',
    'asce-7-wind-load-calculator.html.backup',
]

print("=" * 70)
print("GENERATING COMPREHENSIVE SITEMAP.XML")
print("=" * 70)
print()

# Get all HTML files
html_files = sorted([f.name for f in Path('.').glob('*.html')])

# Start XML
sitemap_lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '    <!-- Generated: ' + today + ' -->',
    '    <!-- WindLoadCalc.com Sitemap -->',
    ''
]

pages_added = 0

for filename in html_files:
    # Skip excluded pages
    if filename in exclude_pages:
        print(f"SKIP: {filename} (excluded)")
        continue

    # Get settings or use defaults
    priority, changefreq = page_settings.get(filename, ('0.5', 'monthly'))

    # Build URL
    url = f"{BASE_URL}/{filename}"

    # Add to sitemap
    sitemap_lines.extend([
        '    <!-- ' + filename.replace('.html', '').replace('-', ' ').title() + ' -->',
        '    <url>',
        f'        <loc>{url}</loc>',
        f'        <lastmod>{today}</lastmod>',
        f'        <changefreq>{changefreq}</changefreq>',
        f'        <priority>{priority}</priority>',
        '    </url>',
        ''
    ])

    pages_added += 1
    print(f"ADD: {filename} (priority: {priority})")

# Check for Landing Pages folder
landing_pages_dir = Path('Landing Pages')
if landing_pages_dir.exists() and landing_pages_dir.is_dir():
    landing_files = sorted(landing_pages_dir.glob('*.html'))
    for landing_file in landing_files:
        # URL encode spaces properly
        filename = landing_file.name
        url = f"{BASE_URL}/Landing Pages/{filename}".replace(' ', '%20')

        sitemap_lines.extend([
            '    <!-- Landing Page: ' + filename.replace('.html', '').replace('-', ' ').title() + ' -->',
            '    <url>',
            f'        <loc>{url}</loc>',
            f'        <lastmod>{today}</lastmod>',
            f'        <changefreq>weekly</changefreq>',
            f'        <priority>0.8</priority>',
            '    </url>',
            ''
        ])

        pages_added += 1
        print(f"ADD: Landing Pages/{filename}")

# Close XML
sitemap_lines.append('</urlset>')

# Write sitemap
sitemap_content = '\n'.join(sitemap_lines)

with open('sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(sitemap_content)

print()
print("=" * 70)
print(f"SITEMAP GENERATED: {pages_added} pages")
print("=" * 70)
print()
print("File saved: sitemap.xml")
print()
print("NEXT STEPS:")
print("1. Review sitemap.xml")
print("2. Commit to GitHub")
print("3. Submit to Google Search Console")
print("4. URL: https://search.google.com/search-console")
