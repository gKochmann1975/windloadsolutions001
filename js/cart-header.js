/**
 * Cart Header Component
 * Adds floating cart button to shop pages
 */

(function() {
    // Determine cart URL based on current location
    const isInShopSubfolder = window.location.pathname.includes('/shop/');
    const cartUrl = isInShopSubfolder ? '../cart.html' : 'cart.html';

    // NOTE: The floating bottom-right cart bubble was removed (2026-06-11) because it
    // duplicated the cart link injected into the header below and overlapped content
    // on mobile. The header cart (addCartToHeader) is now the single cart entry point.

    // Replace "Subscribe Now" buttons with "Add to Cart" buttons
    document.addEventListener('DOMContentLoaded', function() {
        // Find all pricing buttons with product codes
        const subscribeButtons = document.querySelectorAll('[data-product-code]');

        subscribeButtons.forEach(btn => {
            // Replace the button text
            btn.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';

            // Remove old click handlers by setting onclick to null
            btn.onclick = null;

            // IMPORTANT: Don't clone the button! Cloning breaks the billing toggle
            // because updatePricing() updates the original button, not the clone.
            // Instead, add a capturing event listener that reads attributes at click time.
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const productCode = this.dataset.productCode;
                const billingCycle = this.dataset.billingCycle || 'annual';
                console.log(`Cart add: ${productCode} (${billingCycle})`);
                if (typeof cart !== 'undefined') {
                    cart.addItem(productCode, billingCycle);
                } else {
                    alert('Cart system loading... Please try again.');
                }
            }, true);  // Use capture phase to run before other handlers
        });

        // Add cart icon to header if not already present
        addCartToHeader();

        // Update cart badge
        if (typeof cart !== 'undefined') {
            cart.updateCartBadge();
        }
    });

    // Add cart icon to page header
    function addCartToHeader() {
        // Look for header navigation areas
        const headerRight = document.querySelector('.header-right, .header-actions, .nav-links, .main-nav');

        if (headerRight && !document.getElementById('header-cart-link')) {
            const cartLink = document.createElement('a');
            cartLink.id = 'header-cart-link';
            cartLink.href = cartUrl;
            cartLink.style.cssText = `
                position: relative;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                color: inherit;
                text-decoration: none;
                font-weight: 600;
                padding: 8px 16px;
                border-radius: 8px;
                transition: all 0.3s;
            `;
            cartLink.innerHTML = `
                <i class="fas fa-shopping-cart"></i>
                <span>Cart</span>
                <span id="header-cart-badge" style="
                    background: #dc2626;
                    color: white;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                ">0</span>
            `;

            cartLink.addEventListener('mouseover', function() {
                this.style.background = 'rgba(0, 24, 255, 0.1)';
            });
            cartLink.addEventListener('mouseout', function() {
                this.style.background = 'transparent';
            });

            headerRight.appendChild(cartLink);
        }
    }

    // Override cart badge update to also update header badge
    if (typeof cart !== 'undefined') {
        const originalUpdateBadge = cart.updateCartBadge.bind(cart);
        cart.updateCartBadge = function() {
            originalUpdateBadge();
            const headerBadge = document.getElementById('header-cart-badge');
            const count = this.getItemCount();
            if (headerBadge) {
                headerBadge.textContent = count;
                headerBadge.style.display = count > 0 ? 'inline-flex' : 'none';
            }
        };
    }
})();
