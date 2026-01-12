"""
SEO Audit Script for WindLoadCalc.com
Identifies and reports Google Search Console issues
"""
import os
import re
from pathlib import Path

print("=" * 70)
print("WINDLOADCALC.COM - SEO AUDIT")
print("=" * 70)
print()

# Get all HTML files
html_files = []
website_dir = Path('.')

for html_file in website_dir.glob('*.html'):
    if html_file.name not in ['.git', 'node_modules', 'archive', '.backups']:
        html_files.append(html_file)

print(f"Found {len(html_files)} HTML files in root directory")
print()

# Check for common issues
print("=" * 70)
print("CHECKING FOR COMMON SEO ISSUES:")
print("=" * 70)
print()

issues = {
    'missing_title': [],
    'missing_meta_description': [],
    'missing_canonical': [],
    'duplicate_canonical': [],
    'missing_robots': [],
    'broken_links': [],
    'no_h1': []
}

for html_file in html_files:
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        filename = html_file.name

        # Check for title tag
        if not re.search(r'<title>.*?</title>', content, re.IGNORECASE):
            issues['missing_title'].append(filename)

        # Check for meta description
        if not re.search(r'<meta\s+name=["\']description["\']', content, re.IGNORECASE):
            issues['missing_meta_description'].append(filename)

        # Check for canonical tag
        canonical_match = re.findall(r'<link\s+rel=["\']canonical["\']', content, re.IGNORECASE)
        if len(canonical_match) == 0:
            issues['missing_canonical'].append(filename)
        elif len(canonical_match) > 1:
            issues['duplicate_canonical'].append(filename)

        # Check for robots meta
        if not re.search(r'<meta\s+name=["\']robots["\']', content, re.IGNORECASE):
            issues['missing_robots'].append(filename)

        # Check for H1 tag
        if not re.search(r'<h1[^>]*>.*?</h1>', content, re.IGNORECASE | re.DOTALL):
            issues['no_h1'].append(filename)

    except Exception as e:
        print(f"Error reading {filename}: {e}")

# Print results
for issue_type, files in issues.items():
    if files:
        print(f"\n{issue_type.upper().replace('_', ' ')}:")
        print("-" * 70)
        for f in files:
            print(f"  - {f}")

print()
print("=" * 70)
print("RECOMMENDATIONS:")
print("=" * 70)
print()
print("1. FIX 404 ERRORS:")
print("   - Check Google Search Console for specific URLs")
print("   - Either create missing pages or add proper 301 redirects")
print()
print("2. FIX REDIRECTS:")
print("   - Update links to point directly to final destination")
print("   - Avoid redirect chains")
print()
print("3. FIX SOFT 404s:")
print("   - Add proper content to thin pages")
print("   - Or return proper 404 status code")
print()
print("4. FIX DUPLICATE CANONICALS:")
print("   - Ensure only ONE canonical tag per page")
print("   - Point to the preferred URL version")
print()
print("5. FIX NOT INDEXED PAGES:")
print("   - Add internal links to these pages")
print("   - Ensure robots.txt allows crawling")
print("   - Submit sitemap to Google")
print()
print("Next: I'll create an automated fix script for common issues.")
