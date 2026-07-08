/**
 * cart-header.js — shop-page Add-to-Cart wiring + confirm UX.
 *
 * Binds every [data-product-code] "buy" button to the cart (capture phase, so it runs
 * before stripe-checkout.js's direct-checkout handler and stops it). On a successful add
 * the button turns green ("✓ Added to Cart") and reveals a "Go to checkout" link.
 *
 * The site-wide header cart ICON + count is owned by js/cart-indicator.js (loaded on EVERY
 * page via the synced full-menu partial). shopping-cart.js fires `wlc-cart-updated` on every
 * cart change so that indicator refreshes instantly. This file no longer injects its own
 * header cart (that duplicated the site-wide one and only showed on shop pages).
 */
(function () {
    const isInShopSubfolder = window.location.pathname.includes('/shop/');
    const cartUrl = isInShopSubfolder ? '../cart.html' : 'cart.html';

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
    document.addEventListener('DOMContentLoaded', function () {
        const subscribeButtons = document.querySelectorAll('[data-product-code]');

        subscribeButtons.forEach(btn => {
            btn.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
            btn.onclick = null;

            // Capturing listener reads data-* at CLICK time (the billing toggle updates them).
            btn.addEventListener('click', function (e) {
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

        // Header cart icon/count is site-wide (cart-indicator.js). Sync it once on load.
        if (typeof cart !== 'undefined') cart.updateCartBadge();
        if (window.WLCCartIndicator) window.WLCCartIndicator.refresh();
    });
})();
