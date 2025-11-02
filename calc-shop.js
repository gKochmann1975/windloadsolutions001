/**
 * =================================================================
 * CALC-SHOP.JS - REFERENCE ONLY
 * =================================================================
 * This file is NO LONGER LINKED in wind-load-calculator-shop.html
 * All scripts are now inline in the HTML file.
 * 
 * Header-related functions have been REMOVED:
 * - initializeHeaderScroll() function
 * - Smooth scrolling code
 * 
 * Only shop-specific functionality remains below for reference:
 * - Billing toggle (monthly/annual)
 * - Stripe checkout integration
 * - Waitlist modal
 * - Analytics tracking
 * 
 * Last Updated: Header Update Script
 * =================================================================
 */

/**
 * CALCULATOR SHOP PAGE - JAVASCRIPT
 * Handles pricing toggle, Stripe checkout, waitlist, and header scroll effect
 */

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Calculator Shop Page Loaded');
    initializeBillingToggle();
    initializeStripeCheckout();
});

// ============================================
// ============================================

// ============================================
// BILLING TOGGLE (Monthly/Annual)
// ============================================

let isAnnualBilling = false;

function initializeBillingToggle() {
    const toggleButton = document.getElementById('billing-toggle');
    const monthlyLabel = document.getElementById('monthly-label');
    const annualLabel = document.getElementById('annual-label');
    
    if (!toggleButton) {
        console.warn('Billing toggle not found');
        return;
    }
    
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
    // Windows Category Button (LIVE)
    const windowsBtn = document.getElementById('subscribe-windows');
    if (windowsBtn) {
        windowsBtn.addEventListener('click', () => {
            const billing = isAnnualBilling ? 'annual' : 'monthly';
            createStripeCheckout('windows', billing);
        });
    }
    
    // Waitlist buttons
    const waitlistButtons = document.querySelectorAll('.waitlist-btn');
    waitlistButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            openWaitlistModal(category);
        });
    });
}

/**
 * Create Stripe Checkout Session
 * @param {string} category - 'windows', 'roofs', 'solar', 'mwfrs', 'specialized'
 * @param {string} billing - 'monthly' or 'annual'
 */
async function createStripeCheckout(category, billing) {
    console.log(`Creating checkout for ${category} ${billing}`);
    
    // Show loading state
    const buttonId = 'subscribe-' + category;
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
                product: 'calculator',
                category: category,
                billing: billing,
                success_url: window.location.origin + '/calc-shop-success.html',
                cancel_url: window.location.origin + '/calc-shop-cancel.html'
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
// WAITLIST MODAL
// ============================================

function openWaitlistModal(category) {
    const modal = document.getElementById('waitlist-modal');
    const categoryName = document.getElementById('category-name');
    const categoryInput = document.getElementById('waitlist-category');
    
    categoryName.textContent = category;
    categoryInput.value = category;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeWaitlistModal() {
    const modal = document.getElementById('waitlist-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    document.getElementById('waitlist-form').reset();
    document.getElementById('waitlist-form').style.display = 'block';
    document.getElementById('waitlist-success').style.display = 'none';
}

async function submitWaitlist(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch('https://api.windload.solutions/api/waitlist/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Failed to join waitlist');
        }
        
        // Show success message
        form.style.display = 'none';
        document.getElementById('waitlist-success').style.display = 'block';
        
        // Close modal after 3 seconds
        setTimeout(() => {
            closeWaitlistModal();
        }, 3000);
        
    } catch (error) {
        console.error('Waitlist error:', error);
        alert('Unable to join waitlist. Please try again or contact us at support@windload.solutions');
    }
}

// ============================================
// ============================================

// ============================================
// ANALYTICS TRACKING
// ============================================

function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    console.log('Analytics Event:', category, action, label);
}

// Track billing toggle
const billingToggle = document.getElementById('billing-toggle');
if (billingToggle) {
    billingToggle.addEventListener('click', () => {
        trackEvent('Pricing', 'Toggle Billing', isAnnualBilling ? 'Annual' : 'Monthly');
    });
}

// Track category clicks
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function() {
        const action = this.classList.contains('waitlist-btn') ? 'Waitlist' : 'Subscribe';
        const category = this.getAttribute('data-category') || this.id.replace('subscribe-', '');
        trackEvent('Calculator', action, category);
    });
});