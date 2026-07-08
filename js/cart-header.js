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

    // After an item lands in the cart, confirm ON the button (turns green) and reveal a
    // "Go to checkout" link. Applies to EVERY [data-product-code] card on EVERY shop page.
    function markAdded(btn) {
        btn.classList.add('in-cart');
        btn.style.background = 'linear-gradient(135deg,#0a8f5b,#34D399)';   // brand "go/buy" green
        btn.style.boxShadow = '0 8px 25px rgba(16,185,129,.45)';
        btn.innerHTML = '✓ Added to Cart';
        if (btn.parentNode && !btn.parentNode.querySelector('.cart-jump')) {
            const jump = document.createElement('a');
            jump.className = 'cart-jump';
            jump.href = cartUrl;
            jump.innerHTML = 'Go to checkout →';
            jump.style.cssText = 'display:block;text-align:center;margin-top:8px;font-weight:800;color:#10b981;text-decoration:none';
            jump.addEventListener('mouseover', function () { this.style.textDecoration = 'underline'; });
            jump.addEventListener('mouseout', function () { this.style.textDecoration = 'none'; });
            btn.insertAdjacentElement('afterend', jump);
        }
    }

    // Replace "Subscribe Now" buttons with "Add to Cart" and wire them to the cart.
    document.addEventListener('DOMContentLoaded', function() {
        const subscribeButtons = document.querySelectorAll('[data-product-code]');

        subscribeButtons.forEach(btn => {
            btn.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
            btn.onclick = null;

            // Capturing listener reads data-* at CLICK time (the billing toggle updates them);
            // it also runs before stripe-checkout.js's direct-checkout handler and stops it.
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                // Already added -> the button doubles as a jump to checkout.
                if (this.classList.contains('in-cart')) { window.location.href = cartUrl; return; }
                if (typeof cart === 'undefined') { alert('Cart system loading... Please try again.'); return; }
                const code = this.dataset.productCode, cycle = this.dataset.billingCycle || 'annual';
                const added = cart.addItem(code, cycle);
                // addItem returns false for coming-soon / not-found; only confirm if it truly landed.
                if (added || cart.items.some(it => it.productCode === code)) markAdded(this);
            }, true);

            // Returning visitor: if this product is already in the cart, show the added state now.
            if (typeof cart !== 'undefined' && cart.items.some(it => it.productCode === btn.dataset.productCode)) {
                markAdded(btn);
            }
        });

        // Add cart icon to header if not already present, then sync the badge.
        addCartToHeader();
        if (typeof cart !== 'undefined') cart.updateCartBadge();
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
