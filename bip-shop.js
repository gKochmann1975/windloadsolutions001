/**
 * NOTE: ALL HEADER JAVASCRIPT NOW INLINE IN HTML
 * ============================================
 * 
 * This JavaScript file is no longer linked in building-intelligence-platform-shop.html
 * 
 * REMOVED FROM THIS FILE:
 * - initializeHeaderScroll() function
 * - Smooth scrolling for anchor links
 * - Any header-related event listeners
 * 
 * All header JavaScript is now inline in the HTML file, copied from index.html
 * to ensure consistency across all pages.
 * 
 * This file now contains ONLY shop-specific JavaScript:
 * - Billing toggle (monthly/annual)
 * - Stripe checkout integration
 * - Price update animations
 * - Analytics tracking
 * 
 * This file is kept for reference only.
 * 
 * ============================================
 */

/**
 * BIP SHOP PAGE - JAVASCRIPT
 * Handles pricing toggle and Stripe checkout
 */

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeBillingToggle();
    initializeStripeCheckout();
    // initializeHeaderScroll(); // REMOVED - now inline in HTML
});

// ============================================
// HEADER SCROLL FUNCTION REMOVED - Now inline in HTML from index.html reference

// ============================================
// BILLING TOGGLE (Monthly/Annual)
// ============================================

let isAnnualBilling = false;

function initializeBillingToggle() {
    const toggleButton = document.getElementById('billing-toggle');
    const monthlyLabel = document.getElementById('monthly-label');
    const annualLabel = document.getElementById('annual-label');
    
    if (!toggleButton) return;
    
    // Click handlers
    toggleButton.addEventListener('click', toggleBilling);
    monthlyLabel.addEventListener('click', () => {
        if (isAnnualBilling) toggleBilling();
    });
    annualLabel.addEventListener('click', () => {
        if (!isAnnualBilling) toggleBilling();
    });
}

function toggleBilling() {
    isAnnualBilling = !isAnnualBilling;
    
    const toggleButton = document.getElementById('billing-toggle');
    const monthlyLabel = document.getElementById('monthly-label');
    const annualLabel = document.getElementById('annual-label');
    
    // Update toggle switch
    toggleButton.classList.toggle('active');
    
    // Update labels
    if (isAnnualBilling) {
        monthlyLabel.classList.remove('active');
        annualLabel.classList.add('active');
    } else {
        monthlyLabel.classList.add('active');
        annualLabel.classList.remove('active');
    }
    
    // Update prices
    updatePrices();
}

function updatePrices() {
    // Get all price elements
    const priceElements = document.querySelectorAll('.price-amount[data-monthly]');
    const annualNotes = document.querySelectorAll('.annual-note');
    
    priceElements.forEach(priceElement => {
        const monthlyPrice = priceElement.getAttribute('data-monthly');
        const annualPrice = priceElement.getAttribute('data-annual');
        
        // Add animation class
        priceElement.classList.add('changing');
        
        // Update price
        setTimeout(() => {
            if (isAnnualBilling) {
                priceElement.textContent = '$' + annualPrice;
            } else {
                priceElement.textContent = '$' + monthlyPrice;
            }
            
            // Remove animation class
            setTimeout(() => {
                priceElement.classList.remove('changing');
            }, 300);
        }, 150);
    });
    
    // Show/hide annual notes
    annualNotes.forEach(note => {
        if (isAnnualBilling) {
            note.classList.add('show');
        } else {
            note.classList.remove('show');
        }
    });
}

// ============================================
// STRIPE CHECKOUT INTEGRATION
// ============================================

function initializeStripeCheckout() {
    // Professional Plan Button
    const professionalBtn = document.getElementById('subscribe-professional');
    if (professionalBtn) {
        professionalBtn.addEventListener('click', () => {
            const billing = isAnnualBilling ? 'annual' : 'monthly';
            createStripeCheckout('professional', billing);
        });
    }
    
    // Unlimited Plan Button
    const unlimitedBtn = document.getElementById('subscribe-unlimited');
    if (unlimitedBtn) {
        unlimitedBtn.addEventListener('click', () => {
            const billing = isAnnualBilling ? 'annual' : 'monthly';
            createStripeCheckout('unlimited', billing);
        });
    }
}

/**
 * Create Stripe Checkout Session
 * @param {string} plan - 'professional' or 'unlimited'
 * @param {string} billing - 'monthly' or 'annual'
 */
async function createStripeCheckout(plan, billing) {
    console.log(`Creating checkout for ${plan} ${billing}`);
    
    // Show loading state
    const buttonId = plan === 'professional' ? 'subscribe-professional' : 'subscribe-unlimited';
    const button = document.getElementById(buttonId);
    const originalText = button.textContent;
    button.textContent = 'Loading...';
    button.disabled = true;
    
    try {
        // Call backend API to create Stripe Checkout session
        const response = await fetch('https://api.windload.solutions/api/stripe/create-checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                plan: plan,
                billing: billing,
                success_url: window.location.origin + '/bip-shop-success.html',
                cancel_url: window.location.origin + '/bip-shop-cancel.html'
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to create checkout session');
        }
        
        const data = await response.json();
        
        // Redirect to Stripe Checkout
        if (data.url) {
            window.location.href = data.url;
        } else {
            throw new Error('No checkout URL returned');
        }
        
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Unable to start checkout. Please try again or contact support at support@windload.solutions');
        
        // Restore button state
        button.textContent = originalText;
        button.disabled = false;
    }
}

// ============================================
// SMOOTH SCROLLING REMOVED - Now inline in HTML from index.html reference

// ============================================
// ANALYTICS TRACKING (Optional)
// ============================================

/**
 * Track user interactions for analytics
 * Can be integrated with Google Analytics, Mixpanel, etc.
 */
function trackEvent(category, action, label) {
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    
    // Console log for debugging
    console.log('Analytics Event:', category, action, label);
}

// Track billing toggle
const billingToggle = document.getElementById('billing-toggle');
if (billingToggle) {
    billingToggle.addEventListener('click', () => {
        trackEvent('Pricing', 'Toggle Billing', isAnnualBilling ? 'Annual' : 'Monthly');
    });
}

// Track plan clicks
document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('click', function() {
        const planName = this.id.replace('subscribe-', '');
        const billing = isAnnualBilling ? 'annual' : 'monthly';
        trackEvent('Pricing', 'Click Subscribe', `${planName}-${billing}`);
    });
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get current plan and billing period
 * Useful for passing to backend
 */
function getCurrentSelection() {
    return {
        billing: isAnnualBilling ? 'annual' : 'monthly',
        timestamp: new Date().toISOString()
    };
}

/**
 * Format price display
 */
function formatPrice(amount, period = 'month') {
    return `$${amount}/${period}`;
}

// ============================================
// ERROR HANDLING
// ============================================

// Global error handler for fetch requests
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    // Could show user-friendly error message here
});

// ============================================
// EXPORTS (for testing)
// ============================================

// Export functions for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleBilling,
        createStripeCheckout,
        getCurrentSelection,
        formatPrice
    };
}