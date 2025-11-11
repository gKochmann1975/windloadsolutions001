"""
Script to remove outdated pricing from wind-load-calculator-landing.html
and replace with informative CTAs
"""
import re

# Read the file
with open('wind-load-calculator-landing.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern 1: Replace category pricing sections  (4 instances in category cards)
old_pricing_pattern = r'<div class="category-pricing">\s*<div class="category-price">\$\d+\.\d+<span>/month</span></div>\s*<div class="category-price-period">or \$\d+\.\d+/month billed annually</div>\s*</div>\s*<button class="category-btn" onclick="openCategoryPanel\(\'(\w+)\'\)">\s*See More Details\s*</button>'

new_cta_template = '''<div class="category-cta-group">
                                <a href="wind-load-calculator-shop.html" class="category-btn-primary">
                                    View Pricing & Plans
                                </a>
                                <a href="free-online-wind-load-calculators-demos-free-excel-wind-load-calculator.html" class="category-btn-secondary">
                                    Try Free Demo
                                </a>
                            </div>

                            <button class="category-btn" onclick="openCategoryPanel('\\1')">
                                Learn More About Features
                            </button>'''

content = re.sub(old_pricing_pattern, new_cta_template, content, flags=re.MULTILINE | re.DOTALL)

# Pattern 2: Replace panel pricing sections (in the detail panels)
panel_pricing_pattern = r'<div class="panel-price">\$\d+\.\d+<span>/month</span></div>\s*<div class="panel-price-annual">or \$\d+\.\d+/month billed annually</div>'

panel_cta = '''<div class="panel-cta-buttons">
                                <a href="wind-load-calculator-shop.html" class="panel-btn-primary">View All Plans & Pricing</a>
                            </div>'''

content = re.sub(panel_pricing_pattern, panel_cta, content, flags=re.MULTILINE | re.DOTALL)

# Pattern 3: Update schema.org pricing (remove specific prices)
schema_pattern = r'"offers": \{[^}]+\}'
schema_replacement = '''offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "url": "https://windload.solutions/wind-load-calculator-shop.html"
        }'''

content = re.sub(schema_pattern, schema_replacement, content)

# Pattern 4: Remove pricing from quick pricing section if it exists
quick_pricing_pattern = r'<span class="price">\$\d+\.\d+</span>'
content = re.sub(quick_pricing_pattern, '<span class="price-cta">See Pricing</span>', content)

# Write the updated content
with open('wind-load-calculator-landing.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated wind-load-calculator-landing.html")
print("- Removed all pricing information")
print("- Replaced with informative CTAs")
print("- Updated schema.org markup")
