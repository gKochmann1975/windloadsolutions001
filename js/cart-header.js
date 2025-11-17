/**
 * Cart Header Component
 * Adds floating cart button to shop pages
 */

(function() {
    // Create floating cart button
    const cartButton = document.createElement('div');
    cartButton.id = 'floating-cart-btn';
    cartButton.innerHTML = `
        <a href="/cart.html" style="
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

    // Add "Add to Cart" buttons alongside existing "Subscribe Now" buttons
    document.addEventListener('DOMContentLoaded', function() {
        // Find all pricing buttons
        const subscribeButtons = document.querySelectorAll('[data-product-code]');

        subscribeButtons.forEach(btn => {
            const productCode = btn.dataset.productCode;
            const billingCycle = btn.dataset.billingCycle || 'annual';

            // Create "Add to Cart" button
            const addToCartBtn = document.createElement('button');
            addToCartBtn.className = btn.className.replace('primary', 'secondary');
            addToCartBtn.style.cssText = `
                margin-top: 8px;
                background: transparent;
                border: 2px solid #0018ff;
                color: #0018ff;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                width: 100%;
            `;
            addToCartBtn.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';

            addToCartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (typeof cart !== 'undefined') {
                    cart.addItem(productCode, billingCycle);
                } else {
                    alert('Cart system loading... Please try again.');
                }
            });

            addToCartBtn.addEventListener('mouseover', function() {
                this.style.background = '#0018ff';
                this.style.color = 'white';
            });

            addToCartBtn.addEventListener('mouseout', function() {
                this.style.background = 'transparent';
                this.style.color = '#0018ff';
            });

            // Insert after the subscribe button
            btn.parentNode.insertBefore(addToCartBtn, btn.nextSibling);
        });

        // Update cart badge
        if (typeof cart !== 'undefined') {
            cart.updateCartBadge();
        }
    });
})();
