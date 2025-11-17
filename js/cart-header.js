/**
 * Cart Header Component
 * Adds floating cart button to shop pages
 */

(function() {
    // Determine cart URL based on current location
    const isInShopSubfolder = window.location.pathname.includes('/shop/');
    const cartUrl = isInShopSubfolder ? '../cart.html' : 'cart.html';

    // Create floating cart button
    const cartButton = document.createElement('div');
    cartButton.id = 'floating-cart-btn';
    cartButton.innerHTML = `
        <a href="${cartUrl}" style="
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #0018ff, #0080ff);
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 30px rgba(0, 24, 255, 0.4);
            text-decoration: none;
            z-index: 9999;
            transition: all 0.3s ease;
        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
            <i class="fas fa-shopping-cart" style="font-size: 1.5rem;"></i>
            <span id="cart-badge" style="
                position: absolute;
                top: -5px;
                right: -5px;
                background: #dc2626;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: none;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                font-weight: 700;
                border: 2px solid white;
            ">0</span>
        </a>
    `;
    document.body.appendChild(cartButton);

    // Replace "Subscribe Now" buttons with "Add to Cart" buttons
    document.addEventListener('DOMContentLoaded', function() {
        // Find all pricing buttons with product codes
        const subscribeButtons = document.querySelectorAll('[data-product-code]');

        subscribeButtons.forEach(btn => {
            const productCode = btn.dataset.productCode;
            const billingCycle = btn.dataset.billingCycle || 'annual';

            // Replace the button text and behavior
            btn.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';

            // Remove old click handlers
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (typeof cart !== 'undefined') {
                    cart.addItem(productCode, billingCycle);
                } else {
                    alert('Cart system loading... Please try again.');
                }
            });
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
