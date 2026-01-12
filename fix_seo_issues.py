"""
Automated SEO Fix Script for WindLoadCalc.com
Fixes Google Search Console issues
"""
import os
import re
from pathlib import Path
from datetime import datetime

print("=" * 70)
print("WINDLOADCALC.COM - AUTOMATED SEO FIX")
print("=" * 70)
print()

# Configuration
BASE_URL = "https://windloadcalc.com"
fixes_applied = {
    'canonical_added': [],
    'robots_added': [],
    'meta_description_added': [],
}

def add_canonical_tag(content, filename):
    """Add canonical tag to <head> if missing"""
    # Determine the URL based on filename
    url = f"{BASE_URL}/{filename}"

    canonical_tag = f'    <link rel="canonical" href="{url}">\n'

    # Check if canonical already exists
    if re.search(r'<link\s+rel=["\']canonical["\']', content, re.IGNORECASE):
        return content, False

    # Add canonical tag before </head>
    if '</head>' in content.lower():
        content = re.sub(
            r'(</head>)',
            f'{canonical_tag}\\1',
            content,
            count=1,
            flags=re.IGNORECASE
        )
        return content, True

    return content, False

def add_robots_meta(content):
    """Add robots meta tag if missing"""
    robots_tag = '    <meta name="robots" content="index, follow">\n'

    # Check if robots meta already exists
    if re.search(r'<meta\s+name=["\']robots["\']', content, re.IGNORECASE):
        return content, False

    # Add after charset or viewport meta tag
    if re.search(r'<meta\s+charset=', content, re.IGNORECASE):
        content = re.sub(
            r'(<meta\s+charset=[^>]+>)',
            f'\\1\n{robots_tag}',
            content,
            count=1,
            flags=re.IGNORECASE
        )
        return content, True
    elif re.search(r'<meta\s+name=["\']viewport["\']', content, re.IGNORECASE):
        content = re.sub(
            r'(<meta\s+name=["\']viewport["\'][^>]+>)',
            f'\\1\n{robots_tag}',
            content,
            count=1,
            flags=re.IGNORECASE
        )
        return content, True

    return content, False

def add_meta_description(content, filename):
    """Add basic meta description if missing"""
    # Check if meta description already exists
    if re.search(r'<meta\s+name=["\']description["\']', content, re.IGNORECASE):
        return content, False

    # Generate description based on filename
    page_name = filename.replace('.html', '').replace('-', ' ').title()
    description = f"WindLoadCalc.com - {page_name}. Professional wind load calculations and building intelligence platform for engineers and architects."

    meta_desc = f'    <meta name="description" content="{description}">\n'

    # Add after charset or viewport meta tag
    if re.search(r'<meta\s+charset=', content, re.IGNORECASE):
        content = re.sub(
            r'(<meta\s+charset=[^>]+>)',
            f'\\1\n{meta_desc}',
            content,
            count=1,
            flags=re.IGNORECASE
        )
        return content, True

    return content, False

# Get all HTML files
html_files = list(Path('.').glob('*.html'))

print(f"Processing {len(html_files)} HTML files...")
print()

for html_file in html_files:
    filename = html_file.name

    # Skip test files
    if 'test' in filename.lower():
        continue

    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        modified = False

        # Add canonical tag
        content, canon_added = add_canonical_tag(content, filename)
        if canon_added:
            fixes_applied['canonical_added'].append(filename)
            modified = True

        # Add robots meta
        content, robots_added = add_robots_meta(content)
        if robots_added:
            fixes_applied['robots_added'].append(filename)
            modified = True

        # Add meta description if missing (only for key pages)
        if any(keyword in filename for keyword in ['shop', 'cancel', 'success', 'privacy', 'terms', 'cart']):
            content, desc_added = add_meta_description(content, filename)
            if desc_added:
                fixes_applied['meta_description_added'].append(filename)
                modified = True

        # Write back if modified
        if modified:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"FIXED: {filename}")

    except Exception as e:
        print(f"ERROR processing {filename}: {e}")

# Print summary
print()
print("=" * 70)
print("FIX SUMMARY:")
print("=" * 70)
print(f"Canonical tags added: {len(fixes_applied['canonical_added'])}")
print(f"Robots meta added: {len(fixes_applied['robots_added'])}")
print(f"Meta descriptions added: {len(fixes_applied['meta_description_added'])}")
print()

if fixes_applied['canonical_added']:
    print("Files with canonical tags added:")
    for f in fixes_applied['canonical_added'][:10]:
        print(f"  - {f}")
    if len(fixes_applied['canonical_added']) > 10:
        print(f"  ... and {len(fixes_applied['canonical_added']) - 10} more")

print()
print("=" * 70)
print("NEXT STEPS:")
print("=" * 70)
print("1. Update sitemap.xml (remove Landing%20Pages URLs)")
print("2. Test a few pages manually")
print("3. Commit and push to GitHub")
print("4. Wait 24-48 hours for Google to recrawl")
print("5. Verify fixes in Google Search Console")
