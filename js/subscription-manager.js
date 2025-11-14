/**
 * Wind Load Solutions - Subscription Manager
 * Replaces trial-manager.js with backend-authenticated subscription verification
 * For Building Intelligence Platform
 */

const SubscriptionManager = (function() {
    'use strict';

    const API_URL = 'https://windload-api.onrender.com';
    const AUTH_LOGIN_URL = 'https://windload-auth.onrender.com';

    // Configuration
    const STORAGE_KEY = 'windload_auth_token';
    const USER_STORAGE_KEY = 'windload_user_data';

    // User state
    let currentUser = null;
    let userSubscriptions = null;
    let isAuthenticated = false;

    // ================================================================
    // INITIALIZATION
    // ================================================================

    async function init() {
        console.log('🔐 Subscription Manager: Initializing...');

        // Check for token in URL (from auto-login)
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');

        if (urlToken) {
            console.log('✅ Found token in URL - auto-login flow');
            localStorage.setItem(STORAGE_KEY, urlToken);

            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Check for existing token
        const token = getToken();
        if (!token) {
            console.log('❌ No token found - redirecting to login');
            redirectToLogin();
            return;
        }

        // Verify token and load user data
        const valid = await verifyToken(token);
        if (!valid) {
            console.log('❌ Invalid token - redirecting to login');
            clearAuth();
            redirectToLogin();
            return;
        }

        // Load subscriptions
        await loadSubscriptions();

        // Verify user has BIP access
        if (!hasBIPAccess()) {
            console.log('❌ No BIP subscription - redirecting to shop');
            showNoAccessMessage();
            return;
        }

        console.log('✅ User authenticated with BIP access');

        // Initialize UI
        updateUI();
        enableFeatures();
    }

    // ================================================================
    // AUTHENTICATION
    // ================================================================

    function getToken() {
        return localStorage.getItem(STORAGE_KEY);
    }

    function clearAuth() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        currentUser = null;
        userSubscriptions = null;
        isAuthenticated = false;
    }

    function redirectToLogin() {
        const returnUrl = encodeURIComponent(window.location.href);
        window.location.href = `${AUTH_LOGIN_URL}?return_url=${returnUrl}`;
    }

    async function verifyToken(token) {
        try {
            // Decode JWT to get user info (basic validation)
            const payload = JSON.parse(atob(token.split('.')[1]));

            // Check expiration
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < now) {
                console.log('Token expired');
                return false;
            }

            currentUser = {
                id: payload.user_id,
                email: payload.email,
                role: payload.role || 'user'
            };

            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
            isAuthenticated = true;

            return true;

        } catch (error) {
            console.error('Error verifying token:', error);
            return false;
        }
    }

    async function loadSubscriptions() {
        if (!currentUser) return null;

        try {
            const response = await fetch(`${API_URL}/api/auth/user-subscriptions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    user_id: currentUser.id
                })
            });

            const data = await response.json();

            if (data.success) {
                userSubscriptions = data;
                console.log('✅ Subscriptions loaded:', data.subscriptions);
                return data;
            } else {
                console.error('Failed to load subscriptions:', data.error);
                return null;
            }

        } catch (error) {
            console.error('Error loading subscriptions:', error);
            return null;
        }
    }

    // ================================================================
    // SUBSCRIPTION CHECKS
    // ================================================================

    function hasBIPAccess() {
        if (!userSubscriptions) return false;
        return userSubscriptions.has_bip === true;
    }

    function hasCalculatorAccess() {
        if (!userSubscriptions) return false;
        return userSubscriptions.has_calculator === true;
    }

    function getBIPTier() {
        if (!userSubscriptions || !userSubscriptions.subscriptions) return null;

        for (const sub of userSubscriptions.subscriptions) {
            if (sub.product_code === 'bip_premium') return 'premium';
            if (sub.product_code === 'bip_pro') return 'pro';
            if (sub.product_code === 'bip_starter') return 'starter';
        }

        return null;
    }

    function canAccessFeature(featureName) {
        const tier = getBIPTier();

        // Feature access by tier
        const featureAccess = {
            'starter': ['windVelocity', 'hurricaneRisk', 'solarFinder', 'basicExport'],
            'pro': ['windVelocity', 'hurricaneRisk', 'solarFinder', 'basicExport',
                   'multiZipComparison', 'enhancedExport', 'apiAccess'],
            'premium': ['windVelocity', 'hurricaneRisk', 'solarFinder', 'basicExport',
                       'multiZipComparison', 'enhancedExport', 'apiAccess',
                       'aiReports', 'unlimitedExports', 'prioritySupport']
        };

        if (!tier) return false;
        return featureAccess[tier]?.includes(featureName) || false;
    }

    // ================================================================
    // UI UPDATES
    // ================================================================

    function updateUI() {
        // Update user info display
        const userEmailElement = document.getElementById('user-email');
        if (userEmailElement && currentUser) {
            userEmailElement.textContent = currentUser.email;
        }

        // Update subscription tier display
        const tierElement = document.getElementById('subscription-tier');
        if (tierElement) {
            const tier = getBIPTier();
            tierElement.textContent = tier ? tier.toUpperCase() : 'NO SUBSCRIPTION';
            tierElement.className = `tier-badge tier-${tier}`;
        }

        // Show "Launch Calculators" button if user has calculator access
        if (hasCalculatorAccess()) {
            showCalculatorButton();
        }

        // Remove trial watermarks
        document.querySelectorAll('.trial-watermark').forEach(el => el.remove());

        // Update banner
        updateBanner();
    }

    function updateBanner() {
        const bannerElement = document.getElementById('subscription-banner-content');
        if (!bannerElement) return;

        const tier = getBIPTier();
        const tierLabels = {
            'starter': '🌟 Starter',
            'pro': '⚡ Pro',
            'premium': '👑 Premium'
        };

        bannerElement.innerHTML = `
            <span style="font-weight: 600;">${tierLabels[tier] || '✅ Active'} Plan</span>
            <span style="margin-left: 12px; opacity: 0.9;">${currentUser.email}</span>
            <button onclick="SubscriptionManager.logout()" style="margin-left: auto; padding: 6px 16px; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; color: white; cursor: pointer; font-size: 0.9rem;">
                Logout
            </button>
        `;
    }

    function showCalculatorButton() {
        // Check if button already exists
        if (document.getElementById('launch-calculators-btn')) return;

        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
        `;

        const button = document.createElement('button');
        button.id = 'launch-calculators-btn';
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
                <rect x="4" y="2" width="16" height="20" rx="2"></rect>
                <line x1="8" y1="6" x2="16" y2="6"></line>
                <line x1="8" y1="10" x2="16" y2="10"></line>
                <line x1="8" y1="14" x2="12" y2="14"></line>
            </svg>
            Launch Wind Load Calculators
        `;
        button.style.cssText = `
            background: linear-gradient(135deg, #0018ff 0%, #181E57 100%);
            color: white;
            border: none;
            padding: 14px 24px;
            border-radius: 50px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 8px 24px rgba(0, 24, 255, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;

        button.addEventListener('click', () => {
            window.open('https://windload-webapp.onrender.com', '_blank');
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 12px 32px rgba(0, 24, 255, 0.5)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 8px 24px rgba(0, 24, 255, 0.4)';
        });

        container.appendChild(button);
        document.body.appendChild(container);
    }

    function showNoAccessMessage() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 16px;
            padding: 48px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        `;

        modal.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 16px;">🔒</div>
            <h2 style="font-size: 1.8rem; margin-bottom: 16px; color: #1e293b;">BIP Subscription Required</h2>
            <p style="color: #64748b; font-size: 1.1rem; margin-bottom: 32px; line-height: 1.6;">
                You don't have an active Building Intelligence Platform subscription.<br>
                Upgrade now to unlock all BIP features!
            </p>
            <div style="display: flex; gap: 16px; justify-content: center;">
                <a href="/building-intelligence-platform-shop.html" style="background: linear-gradient(135deg, #0018ff 0%, #181E57 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                    View Plans
                </a>
                <button onclick="window.location.href='${AUTH_LOGIN_URL}'" style="background: white; color: #0018ff; border: 2px solid #0018ff; padding: 14px 32px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    Back to Login
                </button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    // ================================================================
    // FEATURE MANAGEMENT
    // ================================================================

    function enableFeatures() {
        // Enable export buttons based on tier
        const tier = getBIPTier();

        if (tier === 'starter') {
            enableBasicExports();
        } else if (tier === 'pro' || tier === 'premium') {
            enableAllExports();
        }

        // Enable printing for all paid tiers
        enablePrinting();
    }

    function enableBasicExports() {
        // Enable PDF export only
        const exportButtons = document.querySelectorAll('[data-export-type]');
        exportButtons.forEach(btn => {
            const exportType = btn.dataset.exportType;
            if (exportType === 'pdf') {
                btn.disabled = false;
                btn.classList.remove('disabled-trial');
            }
        });
    }

    function enableAllExports() {
        // Enable all export types
        const exportButtons = document.querySelectorAll('[data-export-type]');
        exportButtons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('disabled-trial');
        });
    }

    function enablePrinting() {
        // Remove print prevention
        // (trial-manager.js blocks Ctrl+P - we don't add that here)
        console.log('✅ Printing enabled for subscribed user');
    }

    // ================================================================
    // PUBLIC API
    // ================================================================

    function logout() {
        if (confirm('Are you sure you want to log out?')) {
            clearAuth();
            redirectToLogin();
        }
    }

    function getUserInfo() {
        return {
            user: currentUser,
            subscriptions: userSubscriptions,
            tier: getBIPTier(),
            isAuthenticated: isAuthenticated
        };
    }

    return {
        init: init,
        hasBIPAccess: hasBIPAccess,
        hasCalculatorAccess: hasCalculatorAccess,
        canAccessFeature: canAccessFeature,
        getBIPTier: getBIPTier,
        getUserInfo: getUserInfo,
        logout: logout
    };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        SubscriptionManager.init();
    });
} else {
    SubscriptionManager.init();
}
