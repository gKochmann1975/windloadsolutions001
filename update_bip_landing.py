"""
Script to update building-intelligence-platform-landing.html
- Remove pricing section and replace with CTAs to shop page
- Add distinctive colors to who-card SVG icons
"""
import re

# Read the file
with open('building-intelligence-platform-landing.html', 'r', encoding='utf-8') as f:
    content = f.read()

print("=" * 80)
print("UPDATING BIP LANDING PAGE")
print("=" * 80)

# 1. Replace the entire pricing section with a CTA section
print("\n1. Replacing pricing section with CTA section...")

# Find and replace the pricing section (from <section class="pricing-section" to </section>)
pricing_section_pattern = r'<section class="pricing-section" id="pricing">.*?</section>\s*(?=<!--\s*Testimonials Section\s*-->)'

new_cta_section = '''<section class="pricing-section" id="pricing">
            <div class="container">
                <div class="section-header">
                    <h2>Ready to Transform Your Workflow?</h2>
                    <p class="section-description">Explore our flexible plans designed to scale with your business needs.</p>
                </div>

                <!-- Value Framing -->
                <div class="math-box" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 3px solid #4ade80; border-radius: 20px; padding: 2.5rem; max-width: 800px; margin: 0 auto 3rem; text-align: center; position: relative; overflow: hidden; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 20px rgba(74, 222, 128, 0.15);">
                    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at top right, rgba(34, 197, 94, 0.1) 0%, transparent 60%); pointer-events: none;"></div>
                    <h3 style="font-size: 1.8rem; font-weight: 800; color: #16a34a; margin-bottom: 1.5rem; position: relative; z-index: 1;">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 0.75rem; filter: drop-shadow(0 0 10px rgba(22, 163, 74, 0.3));">
                            <line x1="12" y1="1" x2="12" y2="23"/>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                        The Value is Clear
                    </h3>
                    <div style="font-size: 1.1rem; color: #15803d; line-height: 2; position: relative; z-index: 1;">
                        <p style="transition: all 0.3s ease;"><strong>Average professional time saved:</strong> 2.5 hours per search</p>
                        <p style="transition: all 0.3s ease;"><strong>Average billable rate:</strong> $150/hour</p>
                        <p style="transition: all 0.3s ease;"><strong>Savings per search:</strong> $375</p>
                        <p style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid #4ade80; font-size: 1.3rem; font-weight: 700; color: #16a34a;">See how our plans deliver immediate ROI</p>
                    </div>
                </div>
                <style>
                    @keyframes roiPulse {
                        0%, 100% {
                            transform: scale(1);
                            text-shadow: 0 0 20px rgba(22, 163, 74, 0.3);
                        }
                        50% {
                            transform: scale(1.05);
                            text-shadow: 0 0 30px rgba(22, 163, 74, 0.5);
                        }
                    }
                    .math-box:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 12px 40px rgba(74, 222, 128, 0.25), 0 0 30px rgba(74, 222, 128, 0.15);
                        border-color: #22c55e;
                    }
                    .math-box:hover p {
                        color: #166534;
                    }
                    .cta-button-group {
                        display: flex;
                        gap: 1.5rem;
                        justify-content: center;
                        flex-wrap: wrap;
                        margin: 2rem 0;
                    }
                    .cta-button-primary, .cta-button-secondary {
                        padding: 1.25rem 2.5rem;
                        font-size: 1.1rem;
                        font-weight: 700;
                        text-decoration: none;
                        border-radius: 12px;
                        transition: all 0.3s ease;
                        display: inline-flex;
                        align-items: center;
                        gap: 0.75rem;
                    }
                    .cta-button-primary {
                        background: linear-gradient(135deg, #0018ff 0%, #00c3ff 100%);
                        color: white;
                        box-shadow: 0 4px 20px rgba(0, 24, 255, 0.3);
                    }
                    .cta-button-primary:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 8px 30px rgba(0, 24, 255, 0.4);
                    }
                    .cta-button-secondary {
                        background: white;
                        color: #0018ff;
                        border: 2px solid #0018ff;
                        box-shadow: 0 4px 20px rgba(0, 24, 255, 0.1);
                    }
                    .cta-button-secondary:hover {
                        transform: translateY(-3px);
                        background: #f0f9ff;
                        box-shadow: 0 8px 30px rgba(0, 24, 255, 0.2);
                    }
                </style>

                <div class="cta-button-group">
                    <a href="building-intelligence-platform-shop.html" class="cta-button-primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                            <line x1="12" y1="22.08" x2="12" y2="12"/>
                        </svg>
                        View All Plans & Pricing
                    </a>
                    <a href="building-intelligence-platform.html" class="cta-button-secondary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                        Start Free Trial
                    </a>
                </div>

                <p style="text-align: center; color: #6b7280; font-size: 0.95rem; margin-top: 1.5rem;">
                    Try all features for 7 days • No credit card required • Cancel anytime
                </p>
            </div>
        </section>

        '''

content = re.sub(pricing_section_pattern, new_cta_section, content, flags=re.DOTALL)
print("   [OK] Replaced pricing section with CTA section")

# 2. Add distinctive colors to who-card icons using CSS
print("\n2. Adding colorful styles for who-card icons...")

# Find the who-section styles and add icon coloring
# We'll add CSS right after the who-card-icon definition

icon_colors_css = '''
        /* Distinctive colors for each who-card icon */
        .who-card:nth-child(1) .who-card-icon {
            background: linear-gradient(135deg, #0018ff 0%, #4169ff 100%); /* Electric Blue - Engineers/Architects */
            box-shadow: 0 4px 15px rgba(0, 24, 255, 0.3);
        }

        .who-card:nth-child(2) .who-card-icon {
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); /* Yellow/Gold - Solar */
            box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
        }

        .who-card:nth-child(3) .who-card-icon {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%); /* Green - Insurance */
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .who-card:nth-child(4) .who-card-icon {
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); /* Orange - Real Estate */
            box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
        }

        .who-card:nth-child(5) .who-card-icon {
            background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%); /* Purple - Contractors */
            box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
        }

        .who-card:nth-child(6) .who-card-icon {
            background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); /* Cyan - Government */
            box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
        }

        .who-card:hover .who-card-icon {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
'''

# Find where to insert the icon color styles - after the who-card-icon svg definition
insert_pattern = r'(\.who-card:hover \.who-card-icon svg \{[^}]+\})'
content = re.sub(insert_pattern, r'\1\n' + icon_colors_css, content)
print("   [OK] Added colorful icon styles")

# Write the updated content
with open('building-intelligence-platform-landing.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n" + "=" * 80)
print("SUCCESS: BIP Landing Page Updated")
print("=" * 80)
print("\nChanges made:")
print("  ✓ Removed pricing cards")
print("  ✓ Replaced with CTAs to shop page and free trial")
print("  ✓ Kept value proposition (ROI calculation)")
print("  ✓ Added 6 distinctive icon colors:")
print("    - Engineers/Architects: Electric Blue")
print("    - Solar Developers: Yellow/Gold")
print("    - Insurance/Risk: Green")
print("    - Real Estate: Orange")
print("    - Contractors: Purple")
print("    - Government: Cyan")
print("\nPage now guides visitors to:")
print("  → building-intelligence-platform-shop.html (View Plans & Pricing)")
print("  → building-intelligence-platform.html (Start Free Trial)")
