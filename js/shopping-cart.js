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
     * Now allows same product with different billing cycles
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

        // Check if EXACT same item (same product AND same billing cycle) already in cart
        const existingIndex = this.items.findIndex(
            item => item.productCode === productCode && item.billingCycle === billingCycle
        );

        if (existingIndex >= 0) {
            // Already have this exact item, notify user
            alert(`${product.shortName} (${billingCycle}) is already in your cart.`);
            return false;
        }

        // Check if same product with DIFFERENT billing cycle exists
        const differentCycleIndex = this.items.findIndex(
            item => item.productCode === productCode && item.billingCycle !== billingCycle
        );

        if (differentCycleIndex >= 0) {
            // Ask user if they want to replace or add both
            const existingCycle = this.items[differentCycleIndex].billingCycle;
            const replace = confirm(
                `You already have ${product.shortName} (${existingCycle}) in your cart.\n\n` +
                `Do you want to REPLACE it with ${billingCycle} billing?\n\n` +
                `Click OK to replace, or Cancel to keep both.`
            );

            if (replace) {
                this.items[differentCycleIndex].billingCycle = billingCycle;
                this.saveCart();
                this.showAddedNotification(`${product.shortName} updated to ${billingCycle}`);
                return true;
            }
            // Otherwise fall through and add both
        }

        // Add new item
        this.items.push({
            productCode: productCode,
            billingCycle: billingCycle,
            addedAt: Date.now()
        });

        this.saveCart();
        this.showAddedNotification(product.shortName);
        return true;
    }

    /**
     * Remove item from cart by product code AND billing cycle
     */
    removeItem(productCode, billingCycle = null) {
        if (billingCycle) {
            // Remove specific billing cycle
            this.items = this.items.filter(
                item => !(item.productCode === productCode && item.billingCycle === billingCycle)
            );
        } else {
            // Remove all instances of this product (legacy behavior)
            this.items = this.items.filter(item => item.productCode !== productCode);
        }
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
     * Calculate cart totals - separates monthly and annual items
     */
    calculateTotals() {
        const monthlyItems = [];
        const annualItems = [];
        let monthlySubtotal = 0;
        let annualSubtotal = 0;

        this.items.forEach(item => {
            const product = PRODUCT_CATALOG[item.productCode];
            if (!product) return;

            const itemDetail = {
                productCode: item.productCode,
                name: product.shortName,
                fullName: product.name,
                category: product.category,
                billingCycle: item.billingCycle,
                monthlyPrice: product.monthlyPrice,
                annualPrice: product.annualPrice,
                features: product.features || []
            };

            if (item.billingCycle === 'annual') {
                annualItems.push(itemDetail);
                annualSubtotal += product.annualPrice;
            } else {
                monthlyItems.push(itemDetail);
                monthlySubtotal += product.monthlyPrice;
            }
        });

        // Bundle discount only applies if both BIP and Calculator in same billing cycle
        // For simplicity, we'll skip bundle discount on mixed carts
        const bundleDiscount = 0;

        // Calculate totals
        const hasMonthly = monthlyItems.length > 0;
        const hasAnnual = annualItems.length > 0;
        const isMixed = hasMonthly && hasAnnual;

        // Total due today = annual upfront + first month
        const totalDueToday = annualSubtotal + monthlySubtotal;

        return {
            monthlyItems: monthlyItems,
            annualItems: annualItems,
            monthlySubtotal: monthlySubtotal,
            annualSubtotal: annualSubtotal,
            totalDueToday: totalDueToday,
            hasMonthly: hasMonthly,
            hasAnnual: hasAnnual,
            isMixed: isMixed,
            bundleDiscount: bundleDiscount,
            bundleDiscountPercent: this.hasBundleDiscount() ? BUNDLE_DISCOUNT_PERCENT : 0,
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
     * Shows separate sections for monthly and annual items
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

        let html = '';

        // Helper function to render a single cart item
        const renderCartItem = (item, billingType) => {
            const price = billingType === 'annual' ? item.annualPrice : item.monthlyPrice;
            const priceLabel = billingType === 'annual' ? '/year' : '/month';

            return `
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
                        <div style="margin-top: 8px;">
                            ${(item.features || []).slice(0, 2).map(f => `
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
                            $${price.toFixed(2)}
                        </div>
                        <div style="font-size: 0.8rem; color: #64748b;">${priceLabel}</div>
                        <button onclick="cart.removeItem('${item.productCode}', '${item.billingCycle}')" style="
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
        };

        // ANNUAL SECTION (if any annual items)
        if (totals.hasAnnual) {
            html += `
                <div class="cart-section annual-section" style="margin-bottom: 24px;">
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 12px;
                        padding-bottom: 8px;
                        border-bottom: 2px solid #10b981;
                    ">
                        <i class="fas fa-calendar-check" style="color: #10b981;"></i>
                        <h3 style="margin: 0; font-size: 1rem; color: #1f2937;">Annual Subscriptions</h3>
                        <span style="
                            background: #d1fae5;
                            color: #065f46;
                            padding: 2px 8px;
                            border-radius: 4px;
                            font-size: 0.75rem;
                            font-weight: 600;
                        ">Save ~15%</span>
                    </div>
                    <div class="cart-items">
            `;

            totals.annualItems.forEach(item => {
                html += renderCartItem(item, 'annual');
            });

            html += `
                    </div>
                    <div style="
                        background: #f0fdf4;
                        border-radius: 8px;
                        padding: 12px 16px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <span style="color: #166534; font-weight: 500;">Annual Total (paid upfront)</span>
                        <span style="color: #166534; font-size: 1.2rem; font-weight: 700;">$${totals.annualSubtotal.toFixed(2)}</span>
                    </div>
                </div>
            `;
        }

        // MONTHLY SECTION (if any monthly items)
        if (totals.hasMonthly) {
            html += `
                <div class="cart-section monthly-section" style="margin-bottom: 24px;">
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 12px;
                        padding-bottom: 8px;
                        border-bottom: 2px solid #3b82f6;
                    ">
                        <i class="fas fa-sync-alt" style="color: #3b82f6;"></i>
                        <h3 style="margin: 0; font-size: 1rem; color: #1f2937;">Monthly Subscriptions</h3>
                        <span style="
                            background: #dbeafe;
                            color: #1e40af;
                            padding: 2px 8px;
                            border-radius: 4px;
                            font-size: 0.75rem;
                            font-weight: 600;
                        ">Flexible</span>
                    </div>
                    <div class="cart-items">
            `;

            totals.monthlyItems.forEach(item => {
                html += renderCartItem(item, 'monthly');
            });

            html += `
                    </div>
                    <div style="
                        background: #eff6ff;
                        border-radius: 8px;
                        padding: 12px 16px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <span style="color: #1e40af; font-weight: 500;">Monthly Total (recurring)</span>
                        <span style="color: #1e40af; font-size: 1.2rem; font-weight: 700;">$${totals.monthlySubtotal.toFixed(2)}/mo</span>
                    </div>
                </div>
            `;
        }

        // TOTAL DUE TODAY SECTION
        html += `
            <div class="cart-summary" style="
                background: linear-gradient(135deg, #1e3a5f, #0f172a);
                border-radius: 12px;
                padding: 24px;
                margin-top: 20px;
                color: white;
            ">
                <h3 style="margin: 0 0 16px 0; font-size: 1.1rem; color: #94a3b8;">
                    <i class="fas fa-receipt"></i> Order Summary
                </h3>
        `;

        // Show breakdown if mixed cart
        if (totals.isMixed) {
            html += `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #94a3b8;">
                    <span>Annual subscriptions (upfront)</span>
                    <span>$${totals.annualSubtotal.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 16px; color: #94a3b8;">
                    <span>Monthly subscriptions (first month)</span>
                    <span>$${totals.monthlySubtotal.toFixed(2)}</span>
                </div>
            `;
        }

        html += `
                <div style="
                    display: flex;
                    justify-content: space-between;
                    padding-top: 16px;
                    border-top: 1px solid rgba(255,255,255,0.2);
                    font-size: 1.4rem;
                    font-weight: 700;
                ">
                    <span>Total Due Today</span>
                    <span style="color: #4ade80;">$${totals.totalDueToday.toFixed(2)}</span>
                </div>
        `;

        // Add note about recurring charges
        if (totals.hasMonthly) {
            html += `
                <p style="margin: 12px 0 0 0; font-size: 0.85rem; color: #94a3b8;">
                    <i class="fas fa-info-circle"></i>
                    Monthly subscriptions will renew at $${totals.monthlySubtotal.toFixed(2)}/month
                </p>
            `;
        }

        html += `
            </div>

            <button onclick="cart.proceedToCheckout()" style="
                width: 100%;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                border: none;
                padding: 18px;
                border-radius: 8px;
                font-size: 1.2rem;
                font-weight: 600;
                cursor: pointer;
                margin-top: 20px;
                transition: all 0.3s;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(16, 185, 129, 0.5)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(16, 185, 129, 0.4)'">
                <i class="fas fa-lock"></i> Pay $${totals.totalDueToday.toFixed(2)} Securely
            </button>

            <p style="text-align: center; color: #64748b; font-size: 0.85rem; margin-top: 12px;">
                <i class="fas fa-shield-alt"></i> Secured by Stripe &bull; Cancel anytime
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
     * Uses cart checkout endpoint to send ALL items to Stripe
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
            const API_URL = 'https://api.windloadcalc.com';

            // Use cart checkout endpoint for ALL items
            const response = await fetch(`${API_URL}/api/subscriptions/checkout-cart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cart_items: this.items,  // Send ALL cart items
                    email: null  // Will be entered in Stripe checkout
                })
            });

            const data = await response.json();

            console.log('Cart checkout response:', data);
            console.log('Items sent:', this.items.length);
            console.log('Expected total:', totals.totalDueToday);

            if (data.success && data.checkout_url) {
                console.log(`✅ Checkout created for ${data.item_count} items, total: $${data.total_amount}`);
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
                checkoutBtn.innerHTML = `<i class="fas fa-lock"></i> Pay $${totals.totalDueToday.toFixed(2)} Securely`;
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
