/**
 * Cross-Sell Upsell System for WindLoadCalc
 * Shows bundle offers when purchasing one product to encourage adding the other
 * Limited-time discount for bundling Calculator + BIP subscriptions
 */

// Bundle discount percentage for limited-time offer
const BUNDLE_DISCOUNT_PERCENT = 15;
const BUNDLE_OFFER_EXPIRY_DAYS = 30; // Offer expires in 30 days

// Product information for upsells
const PRODUCT_INFO = {
    bip: {
        name: 'Building Intelligence Platform',
        shortName: 'BIP',
        description: 'AI-powered building analysis, code compliance, and project management',
        monthlyPrice: 79,
        annualPrice: 804,
        icon: 'fa-brain',
        color: '#8b5cf6',
        shopUrl: 'https://windloadcalc.com/shop/building-intelligence-platform.html',
        features: [
            'AI Building Code Assistant',
            'Smart Project Management',
            'Regulatory Compliance Tracking',
            'Team Collaboration Tools'
        ]
    },
    calculators: {
        name: 'Wind Load Calculators',
        shortName: 'Calculators',
        categories: [
            {
                name: 'Windows, Doors & Shutters',
                code: 'cc_walls',
                icon: 'fa-door-open',
                price: 35
            },
            {
                name: 'Roofing Calculator',
                code: 'cc_roofs',
                icon: 'fa-home',
                price: 35,
                comingSoon: true
            },
            {
                name: 'Solar Panels',
                code: 'cc_solar',
                icon: 'fa-solar-panel',
                price: 35,
                comingSoon: true
            },
            {
                name: 'MWFRS',
                code: 'mwfrs',
                icon: 'fa-building',
                price: 49,
                comingSoon: true
            },
            {
                name: 'Specialty Structures',
                code: 'specialty',
                icon: 'fa-warehouse',
                price: 49,
                comingSoon: true
            }
        ],
        color: '#0018ff'
    }
};

/**
 * Calculate discounted price for bundle
 */
function calculateBundlePrice(basePrice) {
    const discount = basePrice * (BUNDLE_DISCOUNT_PERCENT / 100);
    return Math.round((basePrice - discount) * 100) / 100;
}

/**
 * Get days remaining for limited-time offer
 */
function getDaysRemaining() {
    // For demo, show 7 days remaining
    // In production, store offer start date in localStorage
    const offerStartKey = 'bundle_offer_start';
    let offerStart = localStorage.getItem(offerStartKey);

    if (!offerStart) {
        offerStart = Date.now();
        localStorage.setItem(offerStartKey, offerStart);
    }

    const daysPassed = Math.floor((Date.now() - offerStart) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, BUNDLE_OFFER_EXPIRY_DAYS - daysPassed);

    return daysRemaining;
}

/**
 * Create the upsell banner HTML for Calculator shop pages
 * Promotes adding BIP to their calculator subscription
 */
function createBIPUpsellBanner() {
    const bip = PRODUCT_INFO.bip;
    const discountedPrice = calculateBundlePrice(bip.monthlyPrice);
    const daysRemaining = getDaysRemaining();
    const savings = (bip.monthlyPrice - discountedPrice).toFixed(0);

    return `
    <div class="upsell-banner" style="
        background: linear-gradient(135deg, ${bip.color}15 0%, ${bip.color}25 100%);
        border: 2px solid ${bip.color};
        border-radius: 16px;
        padding: 24px;
        margin: 32px 0;
        position: relative;
        overflow: hidden;
    ">
        <!-- Limited Time Badge -->
        <div style="
            position: absolute;
            top: -5px;
            right: 20px;
            background: #dc2626;
            color: white;
            padding: 8px 16px;
            border-radius: 0 0 8px 8px;
            font-weight: 700;
            font-size: 0.85rem;
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        ">
            <i class="fas fa-clock"></i> LIMITED TIME - ${daysRemaining} days left
        </div>

        <div style="display: flex; align-items: center; gap: 24px; flex-wrap: wrap;">
            <!-- Icon -->
            <div style="
                width: 80px;
                height: 80px;
                background: ${bip.color};
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            ">
                <i class="fas ${bip.icon}" style="font-size: 2rem; color: white;"></i>
            </div>

            <!-- Content -->
            <div style="flex: 1; min-width: 280px;">
                <h3 style="color: #1e293b; margin: 0 0 8px 0; font-size: 1.3rem;">
                    Bundle & Save ${BUNDLE_DISCOUNT_PERCENT}%!
                </h3>
                <p style="color: #475569; margin: 0 0 12px 0; line-height: 1.5;">
                    Add <strong>${bip.name}</strong> to your calculator subscription and get
                    <strong style="color: ${bip.color};">$${savings}/month off</strong> your BIP subscription!
                </p>
                <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 12px;">
                    ${bip.features.map(f => `
                        <span style="
                            background: white;
                            padding: 4px 10px;
                            border-radius: 20px;
                            font-size: 0.85rem;
                            color: #374151;
                            border: 1px solid #e5e7eb;
                        ">
                            <i class="fas fa-check" style="color: #10b981; margin-right: 4px;"></i>${f}
                        </span>
                    `).join('')}
                </div>
            </div>

            <!-- Price & CTA -->
            <div style="text-align: center; min-width: 180px;">
                <div style="margin-bottom: 12px;">
                    <span style="text-decoration: line-through; color: #94a3b8; font-size: 1rem;">$${bip.monthlyPrice}/mo</span>
                    <div style="font-size: 2rem; font-weight: 700; color: ${bip.color};">
                        $${discountedPrice}<span style="font-size: 1rem; color: #64748b;">/mo</span>
                    </div>
                    <span style="color: #10b981; font-weight: 600; font-size: 0.9rem;">
                        Save $${savings}/month
                    </span>
                </div>
                <button onclick="addBIPToCart()" style="
                    background: ${bip.color};
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: all 0.2s;
                    box-shadow: 0 4px 12px ${bip.color}50;
                " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    <i class="fas fa-plus"></i> Add BIP to Bundle
                </button>
            </div>
        </div>
    </div>
    `;
}

/**
 * Create the upsell banner HTML for BIP shop page
 * Promotes adding Calculator subscriptions to BIP
 */
function createCalculatorUpsellBanner() {
    const calcs = PRODUCT_INFO.calculators;
    const daysRemaining = getDaysRemaining();

    return `
    <div class="upsell-banner" style="
        background: linear-gradient(135deg, ${calcs.color}10 0%, ${calcs.color}20 100%);
        border: 2px solid ${calcs.color};
        border-radius: 16px;
        padding: 24px;
        margin: 32px 0;
        position: relative;
        overflow: hidden;
    ">
        <!-- Limited Time Badge -->
        <div style="
            position: absolute;
            top: -5px;
            right: 20px;
            background: #dc2626;
            color: white;
            padding: 8px 16px;
            border-radius: 0 0 8px 8px;
            font-weight: 700;
            font-size: 0.85rem;
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        ">
            <i class="fas fa-clock"></i> LIMITED TIME - ${daysRemaining} days left
        </div>

        <div style="text-align: center; margin-bottom: 20px; margin-top: 10px;">
            <h3 style="color: #1e293b; margin: 0 0 8px 0; font-size: 1.3rem;">
                <i class="fas fa-calculator" style="color: ${calcs.color}; margin-right: 8px;"></i>
                Complete Your Toolkit - Save ${BUNDLE_DISCOUNT_PERCENT}%!
            </h3>
            <p style="color: #475569; margin: 0; line-height: 1.5;">
                Add ASCE 7-22 compliant wind load calculators to your BIP subscription
            </p>
        </div>

        <!-- Calculator Categories Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
            ${calcs.categories.map(cat => {
                const discountedPrice = calculateBundlePrice(cat.price);
                const savings = (cat.price - discountedPrice).toFixed(0);
                return `
                <div style="
                    background: white;
                    border-radius: 12px;
                    padding: 16px;
                    text-align: center;
                    border: 1px solid #e5e7eb;
                    ${cat.comingSoon ? 'opacity: 0.7;' : ''}
                    position: relative;
                ">
                    ${cat.comingSoon ? `
                        <span style="
                            position: absolute;
                            top: 8px;
                            right: 8px;
                            background: #f59e0b;
                            color: white;
                            padding: 2px 8px;
                            border-radius: 4px;
                            font-size: 0.7rem;
                            font-weight: 600;
                        ">COMING SOON</span>
                    ` : ''}
                    <i class="fas ${cat.icon}" style="font-size: 1.8rem; color: ${calcs.color}; margin-bottom: 8px;"></i>
                    <h4 style="color: #1e293b; margin: 0 0 8px 0; font-size: 0.95rem;">${cat.name}</h4>
                    <div>
                        <span style="text-decoration: line-through; color: #94a3b8; font-size: 0.85rem;">$${cat.price}/mo</span>
                        <div style="font-size: 1.3rem; font-weight: 700; color: ${calcs.color};">$${discountedPrice}</div>
                        <span style="color: #10b981; font-size: 0.8rem; font-weight: 600;">Save $${savings}/mo</span>
                    </div>
                    ${!cat.comingSoon ? `
                        <button
                            onclick="addCalculatorToCart('${cat.code}')"
                            style="
                                margin-top: 12px;
                                background: ${calcs.color};
                                color: white;
                                border: none;
                                padding: 8px 16px;
                                border-radius: 6px;
                                font-weight: 600;
                                cursor: pointer;
                                font-size: 0.85rem;
                                width: 100%;
                                transition: all 0.2s;
                            "
                            onmouseover="this.style.opacity='0.9'"
                            onmouseout="this.style.opacity='1'"
                        >
                            <i class="fas fa-plus"></i> Add to Bundle
                        </button>
                    ` : `
                        <button disabled style="
                            margin-top: 12px;
                            background: #94a3b8;
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 6px;
                            font-weight: 600;
                            font-size: 0.85rem;
                            width: 100%;
                            cursor: not-allowed;
                        ">
                            <i class="fas fa-bell"></i> Notify Me
                        </button>
                    `}
                </div>
            `;
            }).join('')}
        </div>

        <!-- Billing Toggle for Calculators -->
        <div style="text-align: center; background: #f8fafc; padding: 12px; border-radius: 8px;">
            <label style="color: #475569; font-size: 0.9rem; cursor: pointer;">
                <input type="checkbox" id="calc-annual-toggle" style="margin-right: 8px;" checked>
                <strong>Annual billing</strong> - Additional 20% off (total ${BUNDLE_DISCOUNT_PERCENT + 20}% savings!)
            </label>
        </div>
    </div>
    `;
}

/**
 * Handle adding BIP to cart with bundle discount
 */
function addBIPToCart() {
    // Store bundle flag in sessionStorage
    sessionStorage.setItem('bundle_discount', 'true');
    sessionStorage.setItem('bundle_product', 'bip');
    sessionStorage.setItem('bundle_discount_percent', BUNDLE_DISCOUNT_PERCENT);

    // Show confirmation
    alert(`Great choice! ${BUNDLE_DISCOUNT_PERCENT}% bundle discount will be applied to your BIP subscription.`);

    // Redirect to BIP checkout or add to cart
    // For now, redirect to BIP shop page
    window.open('https://windloadcalc.com/shop/building-intelligence-platform.html?bundle=true', '_blank');
}

/**
 * Handle adding Calculator to cart with bundle discount
 */
function addCalculatorToCart(calculatorCode) {
    sessionStorage.setItem('bundle_discount', 'true');
    sessionStorage.setItem('bundle_product', calculatorCode);
    sessionStorage.setItem('bundle_discount_percent', BUNDLE_DISCOUNT_PERCENT);

    const calcInfo = PRODUCT_INFO.calculators.categories.find(c => c.code === calculatorCode);

    alert(`Great choice! ${BUNDLE_DISCOUNT_PERCENT}% bundle discount will be applied to your ${calcInfo.name} subscription.`);

    // Redirect to calculator shop page
    window.open('https://windloadcalc.com/wind-load-calculator-shop.html?bundle=true', '_blank');
}

/**
 * Initialize upsell banners on page load
 * Call this function from your shop page
 */
function initUpsellBanners(productType, targetElementId) {
    const targetElement = document.getElementById(targetElementId);
    if (!targetElement) {
        console.error(`Target element ${targetElementId} not found`);
        return;
    }

    let bannerHTML = '';

    if (productType === 'calculator') {
        // On calculator shop page, show BIP upsell
        bannerHTML = createBIPUpsellBanner();
    } else if (productType === 'bip') {
        // On BIP shop page, show calculator upsells
        bannerHTML = createCalculatorUpsellBanner();
    }

    targetElement.innerHTML = bannerHTML;
}

// Export functions for use
window.WindLoadUpsell = {
    initUpsellBanners,
    addBIPToCart,
    addCalculatorToCart,
    createBIPUpsellBanner,
    createCalculatorUpsellBanner,
    BUNDLE_DISCOUNT_PERCENT
};
