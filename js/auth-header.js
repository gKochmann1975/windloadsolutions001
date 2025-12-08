/**
 * Wind Load Solutions - Auth Header Manager
 * Dynamically swaps "Member Login" with "Member Account" when user is logged in
 * Works across all website pages
 */

const AuthHeader = (function() {
    'use strict';

    const STORAGE_KEY = 'windload_auth_token';
    const USER_STORAGE_KEY = 'windload_user_data';

    // ================================================================
    // INITIALIZATION
    // ================================================================

    function init() {
        // Run on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', updateHeaderState);
        } else {
            updateHeaderState();
        }

        // Also listen for storage changes (if user logs in/out in another tab)
        window.addEventListener('storage', function(e) {
            if (e.key === STORAGE_KEY || e.key === USER_STORAGE_KEY) {
                updateHeaderState();
            }
        });
    }

    // ================================================================
    // HEADER STATE MANAGEMENT
    // ================================================================

    function updateHeaderState() {
        const isLoggedIn = checkLoginStatus();
        const memberLoginBtn = document.querySelector('.header-cta[href="login.html"]');

        if (!memberLoginBtn) {
            // Button not found on this page, try alternative selectors
            const altBtn = document.querySelector('a.header-cta:not(.primary)');
            if (altBtn && altBtn.textContent.includes('Member Login')) {
                transformButton(altBtn, isLoggedIn);
            }
            return;
        }

        transformButton(memberLoginBtn, isLoggedIn);
    }

    function transformButton(button, isLoggedIn) {
        if (isLoggedIn) {
            // Transform to Member Account button
            button.href = 'account.html';
            button.textContent = 'Member Account';
            button.classList.add('member-account-btn');
            button.classList.remove('header-cta');

            // Add user icon
            const icon = document.createElement('i');
            icon.className = 'fas fa-user-circle';
            icon.style.marginRight = '8px';
            button.prepend(icon);
        } else {
            // Ensure it's the login button
            button.href = 'login.html';
            button.textContent = 'Member Login';
            button.classList.remove('member-account-btn');
            if (!button.classList.contains('header-cta')) {
                button.classList.add('header-cta');
            }
        }
    }

    // ================================================================
    // AUTH CHECK
    // ================================================================

    function checkLoginStatus() {
        const token = localStorage.getItem(STORAGE_KEY);

        if (!token) {
            return false;
        }

        // Basic JWT expiration check
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000; // Convert to milliseconds

            if (Date.now() >= exp) {
                // Token expired - clear it
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(USER_STORAGE_KEY);
                return false;
            }

            return true;
        } catch (e) {
            // Invalid token format
            console.warn('Invalid auth token format');
            return false;
        }
    }

    function getUserData() {
        try {
            const userData = localStorage.getItem(USER_STORAGE_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (e) {
            return null;
        }
    }

    function getUserName() {
        const userData = getUserData();
        if (userData && userData.full_name) {
            return userData.full_name.split(' ')[0]; // First name only
        }
        return null;
    }

    // ================================================================
    // PUBLIC API
    // ================================================================

    return {
        init: init,
        isLoggedIn: checkLoginStatus,
        getUserData: getUserData,
        getUserName: getUserName,
        refresh: updateHeaderState
    };

})();

// Auto-initialize
AuthHeader.init();
