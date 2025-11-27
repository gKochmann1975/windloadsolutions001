// ================================================================
// FREE TRIAL MANAGEMENT SYSTEM
// For Building Intelligence Platform by WindLoad Solutions
// ================================================================

const TrialManager = (function() {
    'use strict';

    // Configuration
    const TRIAL_STORAGE_KEY = 'windload_trial_data';
    const TRIAL_DURATION_DAYS = 7;
    const HOURLY_LIMIT = 3;
    const DAILY_LIMIT = 10;

    // Initialize or get trial data
    function initializeTrial() {
        let trialData = getTrialData();

        if (!trialData) {
            // First time user - create new trial
            const now = new Date();
            const expiryDate = new Date(now.getTime() + (TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000));

            trialData = {
                userId: 'trial_' + generateUserId(),
                startDate: now.toISOString(),
                expiryDate: expiryDate.toISOString(),
                lookups: [],
                exportAttempts: 0,
                featureAccess: {
                    windVelocity: true,
                    hurricaneRisk: true,
                    solarFinder: true,
                    multiZipComparison: false,
                    exports: false,
                    aiReports: false
                }
            };

            saveTrialData(trialData);
        }
        // If trial exists (even if expired), keep it - user already used their trial

        console.log('✅ Trial Manager: Trial initialized', {
            userId: trialData.userId,
            expiryDate: trialData.expiryDate,
            lookups: trialData.lookups.length
        });

        return trialData;
    }

    // Generate unique user ID
    function generateUserId() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    // Get trial data from localStorage
    function getTrialData() {
        try {
            const data = localStorage.getItem(TRIAL_STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error reading trial data:', e);
            return null;
        }
    }

    // Save trial data to localStorage
    function saveTrialData(data) {
        try {
            localStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving trial data:', e);
        }
    }

    // Check trial status
    function getTrialStatus() {
        const trialData = initializeTrial();
        const now = new Date();
        const expiryDate = new Date(trialData.expiryDate);
        
        if (now > expiryDate) {
            return {
                active: false,
                expired: true,
                message: 'Your trial has expired. Upgrade to continue using the platform.'
            };
        }
        
        const timeRemaining = expiryDate - now;
        const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        return {
            active: true,
            expired: false,
            expiryDate: expiryDate,
            daysRemaining: daysRemaining,
            hoursRemaining: hoursRemaining,
            message: `Trial expires in ${daysRemaining} days, ${hoursRemaining} hours`
        };
    }

    // Check if lookup is allowed
    function canPerformLookup() {
        const trialData = initializeTrial();
        const status = getTrialStatus();
        
        // Check if trial expired
        if (status.expired) {
            return {
                allowed: false,
                reason: 'expired',
                message: 'Your trial has expired. Upgrade to continue using the platform.'
            };
        }
        
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // Filter lookups from last hour
        const recentLookups = trialData.lookups.filter(lookup => {
            const lookupTime = new Date(lookup.timestamp);
            return lookupTime > oneHourAgo;
        });
        
        // Filter lookups from today
        const todayLookups = trialData.lookups.filter(lookup => {
            const lookupTime = new Date(lookup.timestamp);
            return lookupTime > todayStart;
        });
        
        // Check hourly limit
        if (recentLookups.length >= HOURLY_LIMIT) {
            const oldestRecent = new Date(recentLookups[0].timestamp);
            const resetTime = new Date(oldestRecent.getTime() + (60 * 60 * 1000));
            const minutesUntilReset = Math.ceil((resetTime - now) / (1000 * 60));
            
            
        console.warn('🚫 Trial Manager: Hourly limit reached!');
        
        return {
                allowed: false,
                reason: 'hourly_limit',
                message: `Hourly limit reached (${HOURLY_LIMIT} lookups per hour). Resets in ${minutesUntilReset} minutes.`
            };
        }
        
        // Check daily limit
        if (todayLookups.length >= DAILY_LIMIT) {
            return {
                allowed: false,
                reason: 'daily_limit',
                message: `Daily limit reached (${DAILY_LIMIT} lookups per day). Resets at midnight.`
            };
        }
        
        
        console.log('✅ Trial Manager: Lookup allowed', {
            hourlyRemaining: HOURLY_LIMIT - recentLookups.length,
            dailyRemaining: DAILY_LIMIT - todayLookups.length
        });
        
        return {
            allowed: true,
            remaining: {
                hourly: HOURLY_LIMIT - recentLookups.length,
                daily: DAILY_LIMIT - todayLookups.length
            }
        };
    }

    // Record a lookup
    function recordLookup(type, location) {
        const trialData = initializeTrial();
        
        trialData.lookups.push({
            timestamp: new Date().toISOString(),
            type: type,
            location: location,
            success: true
        });
        
        saveTrialData(trialData);
        console.log('📝 Trial Manager: Lookup recorded', {
            type: type,
            location: location,
            totalLookups: trialData.lookups.length
        });
        updateLookupCounter();
        updateTrialBanner();
    }

    // Check if feature is allowed
    function canAccessFeature(featureName) {
        const trialData = initializeTrial();
        const status = getTrialStatus();
        
        if (status.expired) {
            return false;
        }
        
        return trialData.featureAccess[featureName] === true;
    }

    // Record export attempt
    function recordExportAttempt(type) {
        const trialData = initializeTrial();
        trialData.exportAttempts++;
        saveTrialData(trialData);
    }

    // Update lookup counter display
    function updateLookupCounter() {
        const counterElement = document.getElementById('trial-lookup-counter');
        if (!counterElement) return;
        
        const check = canPerformLookup();
        if (check.allowed) {
            counterElement.innerHTML = `
                <div style="font-size: 0.85rem; color: #059669;">
                    <strong>${check.remaining.hourly}</strong> lookups remaining this hour<br>
                    <strong>${check.remaining.daily}</strong> lookups remaining today
                </div>
            `;
        } else {
            counterElement.innerHTML = `
                <div style="font-size: 0.85rem; color: #dc2626;">
                    ${check.message}
                </div>
            `;
        }
    }

    // Update trial banner
    function updateTrialBanner() {
        const bannerElement = document.getElementById('trial-banner-content');
        if (!bannerElement) return;

        const status = getTrialStatus();
        if (status.expired) {
            bannerElement.innerHTML = `
                <svg class="trial-clock-icon"><use href="#icon-trial-alert"></use></svg>
                <span>Trial Expired - <a href="#" onclick="showUpgradeModal('Your trial has expired'); return false;" class="trial-banner-link">Upgrade Now</a></span>
            `;
        } else {
            // Show trial countdown - clicking just shows the status, not upgrade modal
            bannerElement.innerHTML = `
                <svg class="trial-clock-icon trial-icon-animated"><use href="#icon-trial-clock"></use></svg>
                <span>${status.message}</span>
                <span style="margin-left: 10px;">-</span>
                <a href="#" onclick="showUpgradeModal('Upgrade to unlock all features'); return false;" class="trial-banner-link" style="margin-left: 10px;">Upgrade Now</a>
            `;
        }
    }

    // Add trial watermarks
    function addTrialWatermark() {
        // Remove existing watermarks first
        document.querySelectorAll('.trial-watermark').forEach(el => el.remove());
        
        const positions = [
            { top: '25%', left: '25%' },
            { top: '25%', left: '75%' },
            { top: '50%', left: '50%' },
            { top: '75%', left: '25%' },
            { top: '75%', left: '75%' }
        ];
        
        positions.forEach(pos => {
            const watermark = document.createElement('div');
            watermark.className = 'trial-watermark';
            watermark.textContent = 'TRIAL VERSION - NOT FOR PROFESSIONAL USE';
            watermark.style.top = pos.top;
            watermark.style.left = pos.left;
            document.body.appendChild(watermark);
        });
    }

    // ================================================================
    // SUBSCRIPTION TIER DEFINITIONS
    // Defines features and limits for each subscription tier
    // ================================================================
    const TIER_CONFIG = {
        free: {
            name: 'Free Trial',
            hourlyLimit: HOURLY_LIMIT,
            dailyLimit: DAILY_LIMIT,
            features: {
                windVelocity: true,
                hurricaneRisk: true,
                solarFinder: true,
                multiZipComparison: false,
                exports: false,
                aiReports: false
            },
            restrictions: {
                watermark: true,
                blockExport: true,
                blockPrint: true,
                blockCopy: true
            }
        },
        starter: {
            name: 'Starter',
            hourlyLimit: 20,
            dailyLimit: 100,
            features: {
                windVelocity: true,
                hurricaneRisk: true,
                solarFinder: true,
                multiZipComparison: false,
                exports: true,  // PDF only
                aiReports: false
            },
            restrictions: {
                watermark: false,
                blockExport: false,
                blockPrint: false,
                blockCopy: false
            }
        },
        pro: {
            name: 'Pro',
            hourlyLimit: 100,
            dailyLimit: 500,
            features: {
                windVelocity: true,
                hurricaneRisk: true,
                solarFinder: true,
                multiZipComparison: true,
                exports: true,  // PDF + Excel
                aiReports: false
            },
            restrictions: {
                watermark: false,
                blockExport: false,
                blockPrint: false,
                blockCopy: false
            }
        },
        premium: {
            name: 'Premium',
            hourlyLimit: 500,
            dailyLimit: 2000,
            features: {
                windVelocity: true,
                hurricaneRisk: true,
                solarFinder: true,
                multiZipComparison: true,
                exports: true,
                aiReports: true
            },
            restrictions: {
                watermark: false,
                blockExport: false,
                blockPrint: false,
                blockCopy: false
            }
        },
        enterprise: {
            name: 'Enterprise',
            hourlyLimit: Infinity,
            dailyLimit: Infinity,
            features: {
                windVelocity: true,
                hurricaneRisk: true,
                solarFinder: true,
                multiZipComparison: true,
                exports: true,
                aiReports: true,
                apiAccess: true,
                whiteLabel: true
            },
            restrictions: {
                watermark: false,
                blockExport: false,
                blockPrint: false,
                blockCopy: false
            }
        },
        admin: {
            name: 'Admin',
            hourlyLimit: Infinity,
            dailyLimit: Infinity,
            features: {
                windVelocity: true,
                hurricaneRisk: true,
                solarFinder: true,
                multiZipComparison: true,
                exports: true,
                aiReports: true,
                apiAccess: true,
                whiteLabel: true
            },
            restrictions: {
                watermark: false,
                blockExport: false,
                blockPrint: false,
                blockCopy: false
            }
        }
    };

    // Current active tier (for testing modes)
    let activeTier = null;

    // Get active tier config
    function getActiveTierConfig() {
        return activeTier ? TIER_CONFIG[activeTier] : TIER_CONFIG.free;
    }

    // Show testing mode banner
    function showTestingBanner(tier, tierConfig) {
        const banner = document.createElement('div');
        banner.id = 'testing-mode-banner';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(90deg, #7c3aed, #a855f7);
            color: white;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 600;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;

        const restrictions = [];
        if (tierConfig.restrictions.watermark) restrictions.push('watermark');
        if (tierConfig.restrictions.blockExport) restrictions.push('no-export');
        if (tierConfig.restrictions.blockPrint) restrictions.push('no-print');
        if (tierConfig.restrictions.blockCopy) restrictions.push('no-copy');

        const restrictionText = restrictions.length > 0
            ? ` | Restrictions: ${restrictions.join(', ')}`
            : ' | No restrictions';

        const limitText = tierConfig.hourlyLimit === Infinity
            ? 'Unlimited'
            : `${tierConfig.hourlyLimit}/hr, ${tierConfig.dailyLimit}/day`;

        banner.innerHTML = `
            🧪 TESTING MODE: <strong>${tierConfig.name.toUpperCase()}</strong>
            | Limits: ${limitText}${restrictionText}
            <button onclick="this.parentElement.remove()" style="
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 2px 10px;
                margin-left: 15px;
                border-radius: 4px;
                cursor: pointer;
            ">✕</button>
        `;
        document.body.insertBefore(banner, document.body.firstChild);

        // Add padding to body so content isn't hidden
        document.body.style.paddingTop = '40px';
    }

    // Apply tier-specific restrictions
    function applyTierRestrictions(tierConfig) {
        if (tierConfig.restrictions.watermark) {
            addTrialWatermark();
        }
        if (tierConfig.restrictions.blockExport) {
            disableExportButtons();
        }
        if (tierConfig.restrictions.blockPrint) {
            preventPrinting();
        }
        if (tierConfig.restrictions.blockCopy) {
            preventContentCopy();
        }
    }

    // Hide ALL trial UI elements (for admin/paid tiers)
    function hideAllTrialUI() {
        // Wait for DOM to be ready
        const hide = () => {
            // Hide trial banner
            const trialBanner = document.querySelector('.trial-banner');
            if (trialBanner) trialBanner.style.display = 'none';

            // Hide upgrade modal
            const upgradeModal = document.getElementById('upgrade-modal');
            if (upgradeModal) upgradeModal.style.display = 'none';

            // Hide trial counter
            const trialCounter = document.getElementById('trial-lookup-counter');
            if (trialCounter) trialCounter.style.display = 'none';

            // Remove watermarks
            document.querySelectorAll('.trial-watermark').forEach(el => el.remove());

            // Remove trial-mode class from body
            document.body.classList.remove('trial-mode');
            document.body.classList.remove('trial-active');

            // Re-enable any disabled buttons
            document.querySelectorAll('.disabled-trial').forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('disabled-trial');
                btn.title = '';
            });

            // Remove print blocking styles
            const printBlocker = document.getElementById('trial-print-blocker');
            if (printBlocker) printBlocker.remove();

            console.log('🔧 Admin Mode: All trial UI hidden');
        };

        // Run now and after DOM loads
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', hide);
        } else {
            hide();
        }

        // Also run after a short delay to catch late-loaded elements
        setTimeout(hide, 100);
        setTimeout(hide, 500);
    }

    // Initialize trial system on page load
    function init() {
        console.log('🔒 Trial Manager: Initializing...');

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userId = urlParams.get('user_id');
        const tierParam = urlParams.get('tier');

        // ================================================================
        // TESTING MODES - Use URL parameters to simulate subscription tiers
        // ================================================================
        //
        // USAGE:
        //   ?tier=free      - Free trial (watermark, no export, limited lookups)
        //   ?tier=starter   - Starter subscription
        //   ?tier=pro       - Pro subscription
        //   ?tier=premium   - Premium subscription
        //   ?tier=enterprise - Enterprise subscription
        //   ?admin=true     - Admin full access (same as ?tier=admin)
        //   ?trial=true     - Alias for ?tier=free
        //
        // These modes DO NOT persist to localStorage - refresh to reset
        // ================================================================

        // Handle ?admin=true (alias for ?tier=admin)
        if (urlParams.get('admin') === 'true') {
            activeTier = 'admin';
            const tierConfig = TIER_CONFIG.admin;
            console.log('🔧 Trial Manager: ADMIN MODE - Full access enabled');

            // Hide ALL trial UI elements
            hideAllTrialUI();

            // Override showUpgradeModal to do nothing in admin mode
            window.showUpgradeModal = function() {
                console.log('🔧 Admin Mode: Upgrade modal suppressed');
            };

            showTestingBanner('admin', tierConfig);
            return;
        }

        // Handle ?trial=true (alias for ?tier=free)
        if (urlParams.get('trial') === 'true') {
            activeTier = 'free';
            const tierConfig = TIER_CONFIG.free;
            console.log('🧪 Trial Manager: FREE TRIAL MODE - All restrictions enabled');

            // Clear any existing auth for clean test
            localStorage.removeItem('windload_token');
            localStorage.removeItem('windload_user_id');
            localStorage.removeItem(TRIAL_STORAGE_KEY);

            initializeTrial();
            showTestingBanner('free', tierConfig);
            updateLookupCounter();
            updateTrialBanner();
            applyTierRestrictions(tierConfig);
            return;
        }

        // Handle ?tier=xxx parameter
        if (tierParam && TIER_CONFIG[tierParam]) {
            activeTier = tierParam;
            const tierConfig = TIER_CONFIG[tierParam];
            console.log(`🧪 Trial Manager: Testing ${tierConfig.name.toUpperCase()} tier`);

            // For free tier, clear auth and apply restrictions
            if (tierParam === 'free') {
                localStorage.removeItem('windload_token');
                localStorage.removeItem('windload_user_id');
                localStorage.removeItem(TRIAL_STORAGE_KEY);
                initializeTrial();
                updateLookupCounter();
                updateTrialBanner();
            } else {
                // For PAID tiers (starter, pro, premium, enterprise), hide all trial UI
                hideAllTrialUI();
                window.showUpgradeModal = function() {
                    console.log(`🔧 ${tierConfig.name} Mode: Upgrade modal suppressed`);
                };
            }

            showTestingBanner(tierParam, tierConfig);
            applyTierRestrictions(tierConfig);
            return;
        }

        // ============================================
        // NORMAL MODE: Check actual authentication state
        // ============================================

        // Check if user is authenticated via URL token (coming from login/signup)
        if (token && userId) {
            console.log('✅ Trial Manager: Authenticated user detected, skipping local trial');
            localStorage.setItem('windload_token', token);
            localStorage.setItem('windload_user_id', userId);

            const now = new Date();
            const expiryDate = new Date(now.getTime() + (TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000));
            const trialData = {
                userId: userId,
                startDate: now.toISOString(),
                expiryDate: expiryDate.toISOString(),
                lookups: [],
                exportAttempts: 0,
                authenticated: true,
                featureAccess: {
                    windVelocity: true,
                    hurricaneRisk: true,
                    solarFinder: true,
                    multiZipComparison: true,
                    exports: true,
                    aiReports: true
                }
            };
            saveTrialData(trialData);

            // Clean URL without reloading
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            return;
        }

        // Check if user was previously authenticated
        const savedToken = localStorage.getItem('windload_token');
        const savedTrialData = getTrialData();
        if (savedToken && savedTrialData && savedTrialData.authenticated) {
            console.log('✅ Trial Manager: Previously authenticated user, skipping trial restrictions');
            return;
        }

        // ============================================
        // TRIAL USER: Apply all restrictions
        // ============================================
        activeTier = 'free';
        initializeTrial();

        const status = getTrialStatus();
        if (status.expired) {
            console.log('⚠️ Trial Manager: Trial expired, features will be restricted');
        }

        // Update UI elements
        updateLookupCounter();
        updateTrialBanner();
        addTrialWatermark();

        // Update counters periodically (but not banner to avoid modal triggers)
        setInterval(() => {
            updateLookupCounter();
        }, 30000); // Every 30 seconds

        // Disable export buttons
        disableExportButtons();

        // Prevent printing
        preventPrinting();

        // Prevent content selection and copying
        preventContentCopy();
    }

    // Disable export buttons
    function disableExportButtons() {
        const exportButtons = document.querySelectorAll(
            '[onclick*="exportToPDF"], [onclick*="exportToExcel"], [onclick*="export"]'
        );
        
        exportButtons.forEach(btn => {
            if (btn.textContent.toLowerCase().includes('export') || 
                btn.textContent.toLowerCase().includes('pdf') ||
                btn.textContent.toLowerCase().includes('excel')) {
                btn.disabled = true;
                btn.classList.add('disabled-trial');
                btn.title = 'Upgrade to enable exports';
                
                // Remove original onclick and add new one
                const originalOnclick = btn.getAttribute('onclick');
                btn.removeAttribute('onclick');
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showUpgradeModal('Export features require a paid subscription');
                });
            }
        });
    }

    // Prevent printing
    function preventPrinting() {
        // Disable Ctrl+P and Command+P
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                showUpgradeModal('Print functionality requires a paid subscription');
                return false;
            }
        });

        // Override window.print()
        const originalPrint = window.print;
        window.print = function() {
            showUpgradeModal('Print functionality requires a paid subscription');
        };
    }

    // Prevent content selection/copying for trial users
    function preventContentCopy() {
        // Disable text selection via CSS
        const style = document.createElement('style');
        style.textContent = `
            body.trial-mode {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
            }
            body.trial-mode input,
            body.trial-mode textarea,
            body.trial-mode [contenteditable="true"] {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
        `;
        document.head.appendChild(style);
        document.body.classList.add('trial-mode');

        // Disable copy event
        document.addEventListener('copy', function(e) {
            e.preventDefault();
            showUpgradeModal('Copy functionality requires a paid subscription');
            return false;
        });

        // Disable cut event
        document.addEventListener('cut', function(e) {
            e.preventDefault();
            showUpgradeModal('Cut functionality requires a paid subscription');
            return false;
        });

        // Disable right-click context menu
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            showUpgradeModal('Right-click is disabled during trial. Upgrade to unlock all features!');
            return false;
        });

        // Disable Ctrl+C, Ctrl+A, Ctrl+X
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'a' || e.key === 'x')) {
                // Allow in input fields
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    return true;
                }
                e.preventDefault();
                showUpgradeModal('Copy/Select functionality requires a paid subscription');
                return false;
            }
        });

        console.log('🔒 Trial Manager: Content copy protection enabled');
    }

    // Public API
    return {
        init: init,
        canPerformLookup: canPerformLookup,
        recordLookup: recordLookup,
        canAccessFeature: canAccessFeature,
        recordExportAttempt: recordExportAttempt,
        getTrialStatus: getTrialStatus,
        addTrialWatermark: addTrialWatermark
    };
})();

// Show upgrade modal (will be defined in HTML)
function showUpgradeModal(message) {
    const modal = document.getElementById('upgrade-modal');
    const messageEl = document.getElementById('upgrade-message');
    
    if (modal && messageEl) {
        messageEl.textContent = message;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Close upgrade modal
function closeUpgradeModal() {
    const modal = document.getElementById('upgrade-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Upgrade to plan (redirect to pricing)
function upgradeToPlan(plan) {
    // Track the conversion attempt
    console.log('Upgrade to plan:', plan);
    // Redirect to pricing or Stripe checkout
    window.location.href = '/pricing?plan=' + plan;
}

// Initialize trial manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        TrialManager.init();
    });
} else {
    TrialManager.init();
}