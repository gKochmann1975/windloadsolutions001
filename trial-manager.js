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
            bannerElement.innerHTML = `
                <svg class="trial-clock-icon trial-icon-animated"><use href="#icon-trial-clock"></use></svg>
                <span>${status.message} - <a href="#" onclick="showUpgradeModal('Upgrade to unlock all features'); return false;" class="trial-banner-link">Upgrade Now</a></span>
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

    // Initialize trial system on page load
    function init() {
        console.log('🔒 Trial Manager: Initializing...');

        // Initialize trial data
        initializeTrial();
        
        // Update UI elements
        updateLookupCounter();
        updateTrialBanner();
        addTrialWatermark();
        
        // Update counters periodically
        setInterval(() => {
            updateLookupCounter();
            updateTrialBanner();
        }, 30000); // Every 30 seconds
        
        // Disable export buttons
        disableExportButtons();
        
        // Prevent printing
        preventPrinting();
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