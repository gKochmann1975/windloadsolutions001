"""
Script to update category CTA buttons to link to category-specific shop pages
"""
import re

# Read the file
with open('wind-load-calculator-landing.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Category mappings: class name -> shop URL
category_urls = {
    'windows': 'shop/windows-doors-shutters.html',
    'roofs': 'shop/roofing.html',
    'solar': 'shop/solar-panels.html',
    'mwfrs': 'shop/mwfrs.html',
    'specialized': 'shop/specialty.html'
}

# Find each category card and update its shop URL
for category_class, shop_url in category_urls.items():
    # Pattern to match the category card and its CTA group
    pattern = rf'(<div class="category-card {category_class}">.*?<div class="category-cta-group">\s*<a href=")wind-load-calculator-shop\.html(" class="category-btn-primary">)'

    # Replace with category-specific URL
    replacement = rf'\1{shop_url}\2'
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    print(f"Updated {category_class} -> {shop_url}")

# Write the updated content
with open('wind-load-calculator-landing.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nSuccessfully updated all category shop links")
