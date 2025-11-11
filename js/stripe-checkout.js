/**
 * Wind Load Solutions - Stripe Checkout Integration
 * Handles guest checkout flow for all subscription products
 */

const API_URL = 'https://windload-api.onrender.com';

/**
 * Product code mapping for all Wind Load Calculator products
 */
const PRODUCT_CODES = {
    // C&C Bundles
    'cc_walls': 'C&C Walls Bundle',
    'cc_roofs': 'C&C Roofs Bundle',
    'cc_solar': 'C&C Solar Bundle',
    'cc_projections': 'C&C Projections Bundle',

    // MWFRS
    'mwfrs': 'MWFRS Complete',

    // Individual Calculators
    'signs': 'Signs & Billboards',
    'towers': 'Communication Towers',
    'industrial': 'Industrial Structures',
    'rooftop': 'Rooftop Equipment',
    'fencing': 'Fencing & Barriers',
    'elevated': 'Elevated Buildings',

    // Packages
    'cc_complete': 'C&C Complete Package',
    'professional': 'Professional Package',
    'enterprise': 'Enterprise Package'
};

/**
 * Initialize checkout for a specific product
 * @param {string} productCode - Product code from PRODUCT_CODES
 * @param {string} billingCycle - 'monthly' or 'annual'
 * @param {HTMLButtonElement} button - The button that triggered checkout
 */
async function startCheckout(productCode, billingCycle = 'monthly', button = null) {
    try {
        // Validate product code
        if (!PRODUCT_CODES[productCode]) {
            throw new Error(`Invalid product code: ${productCode}`);
        }

        // Show loading state
        if (button) {
            const originalText = button.textContent;
            button.textContent = 'Loading...';
            button.disabled = true;
            button.dataset.originalText = originalText;
        }

        console.log(`Creating checkout session for ${productCode} (${billingCycle})`);

        // Call API to create checkout session
        const response = await fetch(`${API_URL}/api/subscriptions/checkout-guest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_code: productCode,
                billing_cycle: billingCycle
            })
        });

        const data = await response.json();

        if (data.success && data.checkout_url) {
            console.log('Redirecting to Stripe checkout...');
            // Redirect to Stripe checkout
            window.location.href = data.checkout_url;
        } else {
            throw new Error(data.error || data.message || 'Failed to create checkout session');
        }

    } catch (error) {
        console.error('Checkout error:', error);

        // Show error to user
        alert(`Failed to start checkout: ${error.message}\n\nPlease try again or contact support.`);

        // Reset button state
        if (button) {
            button.textContent = button.dataset.originalText || 'Get Started';
            button.disabled = false;
        }
    }
}

/**
 * Attach checkout handlers to all buttons with data-product-code attribute
 * Call this after DOM is loaded
 */
function initializeCheckoutButtons() {
    // Find all buttons with data-product-code
    const buttons = document.querySelectorAll('[data-product-code]');

    buttons.forEach(button => {
        const productCode = button.dataset.productCode;
        const billingCycle = button.dataset.billingCycle || 'monthly';

        // Remove any existing click handlers
        button.onclick = null;

        // Add new click handler
        button.addEventListener('click', (e) => {
            e.preventDefault();
            startCheckout(productCode, billingCycle, button);
        });

        console.log(`Initialized checkout button: ${productCode} (${billingCycle})`);
    });

    console.log(`Initialized ${buttons.length} checkout buttons`);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCheckoutButtons);
} else {
    initializeCheckoutButtons();
}

// Export for manual usage
window.WindLoadCheckout = {
    startCheckout,
    initializeCheckoutButtons,
    PRODUCT_CODES
};
