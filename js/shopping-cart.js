/**
 * WindLoadCalc Unified Shopping Cart System
 * Allows users to add multiple subscriptions to cart and checkout once
 */

const CART_STORAGE_KEY = 'windloadcalc_cart';
const BUNDLE_DISCOUNT_PERCENT = 15;
const BUNDLE_DISCOUNT_MONTHS = 12;

// Product catalog with all available subscriptions
const PRODUCT_CATALOG = {
    // Building Intelligence Platform
    'bip_starter': {
        name: 'Building Intelligence Platform - Starter',
        shortName: 'BIP Starter',
        category: 'bip',
        monthlyPrice: 29,
        annualPrice: 300,
        features: ['1 user', '50 calculations/month', 'All 5 features', 'Email support']
    },
    'bip_pro': {
        name: 'Building Intelligence Platform - Pro',
        shortName: 'BIP Pro',
        category: 'bip',
        monthlyPrice: 79,
        annualPrice: 804,
        features: ['5 users', '250 calculations/month', 'Priority support', 'Team features']
    },
    'bip_premium': {
        name: 'Building Intelligence Platform - Premium',
        shortName: 'BIP Premium',
        category: 'bip',
        monthlyPrice: 149,
        annualPrice: 1524,
        features: ['15 users', 'Unlimited calculations', 'Hurricane Intelligence AI', 'API access']
    },

    // Wind Load Calculators
    'cc_walls_starter': {
        name: 'Windows, Doors & Shutters Calculator - Starter',
        shortName: 'Calculator Starter',
        category: 'calculator',
        monthlyPrice: 35,
        annualPrice: 336,
        features: ['1 user', '100 calculations/month', 'PDF exports', 'Email support']
    },
    'cc_walls_pro': {
        name: 'Windows, Doors & Shutters Calculator - Pro',
        shortName: 'Calculator Pro',
        category: 'calculator',
        monthlyPrice: 59,
        annualPrice: 564,
        features: ['5 users', '500 calculations/month', 'Priority support', 'Team features']
    },
    'cc_walls_premium': {
        name: 'Windows, Doors & Shutters Calculator - Premium',
        shortName: 'Calculator Premium',
        category: 'calculator',
        monthlyPrice: 149,
        annualPrice: 1428,
        features: ['10 users', 'Unlimited calculations', 'Priority support', 'API access']
    },

    // Future products (coming soon)
    'cc_roofs_starter': {
        name: 'Roofing Systems Calculator - Starter',
        shortName: 'Roofing Starter',
        category: 'calculator',
        monthlyPrice: 35,
        annualPrice: 336,
        comingSoon: true
    },
    'cc_solar_starter': {
        name: 'Solar Panels Calculator - Starter',
        shortName: 'Solar Starter',
        category: 'calculator',
        monthlyPrice: 35,
        annualPrice: 336,
        comingSoon: true
    },
    'mwfrs_starter': {
        name: 'MWFRS Calculator - Starter',
        shortName: 'MWFRS Starter',
        category: 'calculator',
        monthlyPrice: 49,
        annualPrice: 470,
        comingSoon: true
    }
};

/**
 * Shopping Cart Class
 */
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.billingCycle = 'annual'; // default to annual for savings
        this.updateCartBadge();
    }

    /**
     * Load cart from localStorage
     */
    loadCart() {
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Error loading cart:', e);
            return [];
        }
    }

    /**
     * Save cart to localStorage
     */
    saveCart() {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
        this.updateCartBadge();
        this.updateCartDisplay();
    }

    /**
     * Add item to cart
     */
    addItem(productCode, billingCycle = 'annual') {
        const product = PRODUCT_CATALOG[productCode];
        if (!product) {
            console.error('Product not found:', productCode);
            return false;
        }

        if (product.comingSoon) {
            alert('This product is coming soon! Sign up for notifications.');
            return false;
        }

        // Check if already in cart
        const existingIndex = this.items.findIndex(item => item.productCode === productCode);
        if (existingIndex >= 0) {
            // Update billing cycle if different
            this.items[existingIndex].billingCycle = billingCycle;
        } else {
            this.items.push({
                productCode: productCode,
                billingCycle: billingCycle,
                addedAt: Date.now()
            });
        }

        this.saveCart();
        this.showAddedNotification(product.shortName);
        return true;
    }

    /**
     * Remove item from cart
     */
    removeItem(productCode) {
        this.items = this.items.filter(item => item.productCode !== productCode);
        this.saveCart();
    }

    /**
     * Clear entire cart
     */
    clearCart() {
        this.items = [];
        this.saveCart();
    }

    /**
     * Get cart item count
     */
    getItemCount() {
        return this.items.length;
    }

    /**
     * Check if bundle discount applies (BIP + Calculator)
     */
    hasBundleDiscount() {
        const hasBIP = this.items.some(item => PRODUCT_CATALOG[item.productCode]?.category === 'bip');
        const hasCalc = this.items.some(item => PRODUCT_CATALOG[item.productCode]?.category === 'calculator');
        return hasBIP && hasCalc;
    }

    /**
     * Calculate cart totals
     */
    calculateTotals() {
        let subtotal = 0;
        let bundleDiscount = 0;
        const itemDetails = [];

        this.items.forEach(item => {
            const product = PRODUCT_CATALOG[item.productCode];
            if (!product) return;

            const price = item.billingCycle === 'annual'
                ? product.annualPrice / 12
                : product.monthlyPrice;

            subtotal += price;

            itemDetails.push({
                productCode: item.productCode,
                name: product.shortName,
                fullName: product.name,
                category: product.category,
                billingCycle: item.billingCycle,
                monthlyPrice: price,
                annualTotal: item.billingCycle === 'annual' ? product.annualPrice : product.monthlyPrice * 12,
                features: product.features || []
            });
        });

        // Apply bundle discount if both BIP and Calculator
        if (this.hasBundleDiscount()) {
            bundleDiscount = subtotal * (BUNDLE_DISCOUNT_PERCENT / 100);
        }

        const total = subtotal - bundleDiscount;

        // Determine if ALL items are annual or monthly (or mixed)
        const allAnnual = itemDetails.length > 0 && itemDetails.every(item => item.billingCycle === 'annual');
        const allMonthly = itemDetails.length > 0 && itemDetails.every(item => item.billingCycle === 'monthly');

        // Calculate the actual charge amount
        let chargeTotal, chargePeriod;
        if (allAnnual) {
            // All annual: charge annual total upfront
            chargeTotal = itemDetails.reduce((sum, item) => sum + item.annualTotal, 0);
            if (this.hasBundleDiscount()) {
                chargeTotal = chargeTotal * (1 - BUNDLE_DISCOUNT_PERCENT / 100);
            }
            chargePeriod = 'year';
        } else {
            // Monthly or mixed: charge monthly
            chargeTotal = total;
            chargePeriod = 'month';
        }

        return {
            items: itemDetails,
            subtotal: subtotal,
            bundleDiscount: bundleDiscount,
            bundleDiscountPercent: this.hasBundleDiscount() ? BUNDLE_DISCOUNT_PERCENT : 0,
            total: total,
            chargeTotal: chargeTotal,
            chargePeriod: chargePeriod,
            isAllAnnual: allAnnual,
            isAllMonthly: allMonthly,
            itemCount: this.items.length,
            hasBundleDiscount: this.hasBundleDiscount()
        };
    }

    /**
     * Update cart badge in header
     */
    updateCartBadge() {
        const badge = document.getElementById('cart-badge');
        const count = this.getItemCount();

        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }

        // Update any cart count displays
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
        });
    }

    /**
     * Update cart display (for cart page or sidebar)
     */
    updateCartDisplay() {
        const cartContainer = document.getElementById('cart-items-container');
        if (!cartContainer) return;

        const totals = this.calculateTotals();

        if (totals.itemCount === 0) {
            cartContainer.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: #64748b;">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p style="font-size: 1.1rem; margin-bottom: 1rem;">Your cart is empty</p>
                    <a href="wind-load-calculator-shop.html" style="color: #0018ff; font-weight: 600;">Browse Products</a>
                </div>
            `;
            return;
        }

        let html = '<div class="cart-items">';

        totals.items.forEach(item => {
            html += `
                <div class="cart-item" style="
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 4px 0; color: #1f2937; font-size: 1rem;">${item.name}</h4>
                        <p style="margin: 0; color: #64748b; font-size: 0.85rem;">
                            ${item.billingCycle === 'annual' ? 'Annual billing' : 'Monthly billing'}
                        </p>
                        <div style="margin-top: 8px;">
                            ${item.features.slice(0, 2).map(f => `
                                <span style="
                                    display: inline-block;
                                    background: #f0f9ff;
                                    color: #0369a1;
                                    padding: 2px 8px;
                                    border-radius: 4px;
                                    font-size: 0.75rem;
                                    margin-right: 4px;
                                    margin-bottom: 4px;
                                ">${f}</span>
                            `).join('')}
                        </div>
                    </div>
                    <div style="text-align: right; min-width: 100px;">
                        <div style="font-size: 1.2rem; font-weight: 700; color: #0018ff;">
                            $${item.monthlyPrice.toFixed(2)}
                        </div>
                        <div style="font-size: 0.8rem; color: #64748b;">/month</div>
                        <button onclick="cart.removeItem('${item.productCode}')" style="
                            background: none;
                            border: none;
                            color: #dc2626;
                            cursor: pointer;
                            font-size: 0.85rem;
                            margin-top: 8px;
                            padding: 4px 8px;
                        ">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `;
        });

        html += '</div>';

        // Cart summary
        html += `
            <div class="cart-summary" style="
                background: #f8fafc;
                border-radius: 12px;
                padding: 20px;
                margin-top: 20px;
            ">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #64748b;">Subtotal (${totals.itemCount} item${totals.itemCount > 1 ? 's' : ''})</span>
                    <span style="color: #1f2937;">$${totals.subtotal.toFixed(2)}/mo</span>
                </div>
        `;

        if (totals.hasBundleDiscount) {
            html += `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #10b981;">
                    <span>
                        <i class="fas fa-gift"></i> Bundle Discount (${totals.bundleDiscountPercent}% off)
                    </span>
                    <span>-$${totals.bundleDiscount.toFixed(2)}/mo</span>
                </div>
                <div style="
                    background: #d1fae5;
                    color: #065f46;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    margin-bottom: 12px;
                ">
                    <i class="fas fa-check-circle"></i>
                    You're saving $${(totals.bundleDiscount * 12).toFixed(0)}/year with the bundle discount!
                </div>
            `;
        }

        // Show clear total based on billing cycle
        const billingLabel = totals.isAllAnnual ? 'Billed annually' : 'Billed monthly';
        const periodLabel = totals.chargePeriod === 'year' ? '/year' : '/month';

        html += `
                <div style="
                    display: flex;
                    justify-content: space-between;
                    padding-top: 12px;
                    border-top: 2px solid #e5e7eb;
                    font-size: 1.2rem;
                    font-weight: 700;
                ">
                    <span style="color: #1f2937;">Total</span>
                    <div style="text-align: right;">
                        <div style="color: #0018ff;">$${totals.chargeTotal.toFixed(2)}${periodLabel}</div>
                        <div style="font-size: 0.85rem; color: #64748b; font-weight: normal;">
                            ${billingLabel}
                        </div>
                    </div>
                </div>
            </div>

            <button onclick="cart.proceedToCheckout()" style="
                width: 100%;
                background: linear-gradient(135deg, #0018ff, #0080ff);
                color: white;
                border: none;
                padding: 16px;
                border-radius: 8px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                margin-top: 20px;
                transition: all 0.3s;
                box-shadow: 0 4px 12px rgba(0, 24, 255, 0.3);
            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                <i class="fas fa-lock"></i> Proceed to Secure Checkout
            </button>

            <p style="text-align: center; color: #64748b; font-size: 0.85rem; margin-top: 12px;">
                <i class="fas fa-shield-alt"></i> Secured by Stripe
            </p>
        `;

        cartContainer.innerHTML = html;
    }

    /**
     * Show notification when item added
     */
    showAddedNotification(productName) {
        // Remove existing notification
        const existing = document.getElementById('cart-notification');
        if (existing) existing.remove();

        // Determine cart URL based on current location
        const isInShopSubfolder = window.location.pathname.includes('/shop/');
        const cartUrl = isInShopSubfolder ? '../cart.html' : 'cart.html';

        const notification = document.createElement('div');
        notification.id = 'cart-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 16px 24px;
                border-radius: 8px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
                display: flex;
                align-items: center;
                gap: 12px;
            ">
                <i class="fas fa-check-circle" style="font-size: 1.5rem;"></i>
                <div>
                    <div style="font-weight: 600;">${productName} added to cart!</div>
                    <div style="font-size: 0.85rem; opacity: 0.9;">
                        ${this.getItemCount()} item${this.getItemCount() > 1 ? 's' : ''} in cart
                        ${this.hasBundleDiscount() ? ' - Bundle discount applied!' : ''}
                    </div>
                </div>
                <a href="${cartUrl}" style="
                    background: white;
                    color: #10b981;
                    padding: 6px 12px;
                    border-radius: 4px;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 0.85rem;
                ">View Cart</a>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    /**
     * Proceed to checkout with all items
     */
    async proceedToCheckout() {
        if (this.items.length === 0) {
            alert('Your cart is empty. Please add products first.');
            return;
        }

        const totals = this.calculateTotals();

        // Show loading state
        const checkoutBtn = document.querySelector('button[onclick="cart.proceedToCheckout()"]');
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
            checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating checkout...';
        }

        try {
            // For now, redirect to Stripe with the first item
            // In future, this will create a multi-item checkout session
            const API_URL = 'https://api.windloadcalc.com';

            // If multiple items, we need to handle this differently
            // For MVP, we'll create separate sessions or use Stripe's multi-line-item feature

            const response = await fetch(`${API_URL}/api/subscriptions/checkout-guest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_code: this.items[0].productCode,
                    billing_cycle: this.items[0].billingCycle,
                    bundle_discount: totals.hasBundleDiscount,
                    // Pass all items for future multi-product support
                    cart_items: this.items,
                    success_url: 'https://windloadcalc.com/checkout-success.html',
                    cancel_url: 'https://windloadcalc.com/cart.html'
                })
            });

            const data = await response.json();

            console.log('Checkout response:', data);
            console.log('Response status:', response.status);

            if (data.success && data.checkout_url) {
                // Clear cart on successful checkout initiation
                // this.clearCart(); // Don't clear yet - clear after success
                window.location.href = data.checkout_url;
            } else {
                throw new Error(data.error || data.message || 'Failed to create checkout');
            }

        } catch (error) {
            console.error('Checkout error:', error);
            console.error('Full error details:', error.stack);
            alert(`Checkout failed: ${error.message}\n\nPlease try again or contact support.`);

            if (checkoutBtn) {
                checkoutBtn.disabled = false;
                checkoutBtn.innerHTML = '<i class="fas fa-lock"></i> Proceed to Secure Checkout';
            }
        }
    }
}

// Initialize cart globally
const cart = new ShoppingCart();

// Add animation styles
const cartStyles = document.createElement('style');
cartStyles.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .cart-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #dc2626;
        color: white;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 700;
    }
`;
document.head.appendChild(cartStyles);

// Export for global use
window.WindLoadCart = cart;
window.cart = cart;
