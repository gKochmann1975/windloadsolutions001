// dash-velocity-finder-integration.js - Dash-compatible Velocity Finder
// This file bridges the JavaScript Velocity Finder with Dash's component system

(function() {
    'use strict';

    // Wait for DOM and all dependencies to be ready
    function waitForDependencies() {
        return new Promise((resolve) => {
            const checkDependencies = () => {
                // Check if Leaflet is loaded
                if (typeof L === 'undefined') {
                    console.log('Waiting for Leaflet to load...');
                    setTimeout(checkDependencies, 100);
                    return;
                }
                
                // Check if VelocityFinder is loaded
                if (typeof VelocityFinder === 'undefined') {
                    console.log('Waiting for VelocityFinder to load...');
                    setTimeout(checkDependencies, 100);
                    return;
                }
                
                // Check if the DOM element exists
                const mapElement = document.getElementById('velocity-map');
                if (!mapElement) {
                    console.log('Waiting for velocity-map element...');
                    setTimeout(checkDependencies, 100);
                    return;
                }
                
                console.log('All dependencies ready, initializing Velocity Finder...');
                resolve();
            };
            
            checkDependencies();
        });
    }

    // Initialize Velocity Finder when everything is ready
    async function initializeDashVelocityFinder() {
        try {
            await waitForDependencies();
            
            // Initialize the Velocity Finder interface
            if (typeof VelocityFinder !== 'undefined' && VelocityFinder.init) {
                console.log('Initializing Velocity Finder with container: velocity-finder-container');
                VelocityFinder.init('velocity-finder-container');
                console.log('Velocity Finder initialized successfully');
            } else {
                console.error('VelocityFinder.init not found');
            }
            
        } catch (error) {
            console.error('Error initializing Dash Velocity Finder:', error);
            
            // Fallback: Try again after a longer delay
            setTimeout(() => {
                console.log('Retrying Velocity Finder initialization...');
                if (typeof VelocityFinder !== 'undefined' && VelocityFinder.init) {
                    try {
                        VelocityFinder.init('velocity-finder-container');
                        console.log('Velocity Finder initialized on retry');
                    } catch (retryError) {
                        console.error('Retry failed:', retryError);
                    }
                }
            }, 2000);
        }
    }

    // Dash-specific initialization - wait for Dash to be ready
    function initializeWhenDashReady() {
        // Method 1: DOMContentLoaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeDashVelocityFinder);
        } else {
            // Method 2: Already loaded, but wait for Dash components
            setTimeout(initializeDashVelocityFinder, 1000);
        }
        
        // Method 3: Also try when window loads (backup)
        window.addEventListener('load', () => {
            setTimeout(initializeDashVelocityFinder, 1500);
        });
        
        // Method 4: Mutation observer to detect when velocity-finder-container is added
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const container = document.getElementById('velocity-finder-container');
                    if (container && !container.hasAttribute('data-velocity-finder-initialized')) {
                        container.setAttribute('data-velocity-finder-initialized', 'true');
                        console.log('Detected velocity-finder-container, initializing...');
                        setTimeout(initializeDashVelocityFinder, 500);
                    }
                }
            });
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Enhanced error handling for Dash environment
    window.addEventListener('error', (event) => {
        if (event.message && event.message.includes('velocity') || event.message.includes('leaflet')) {
            console.error('Velocity Finder Error:', event.error);
            console.log('Attempting recovery...');
            
            // Try to reinitialize after error
            setTimeout(() => {
                const container = document.getElementById('velocity-finder-container');
                if (container && typeof VelocityFinder !== 'undefined') {
                    try {
                        VelocityFinder.init('velocity-finder-container');
                        console.log('Recovery successful');
                    } catch (recoveryError) {
                        console.error('Recovery failed:', recoveryError);
                    }
                }
            }, 3000);
        }
    });

    // Handle Dash callback conflicts by creating a safe namespace
    if (window.dash_clientside && window.dash_clientside.no_update) {
        // We're in a Dash environment, set up safe mode
        console.log('Dash environment detected, setting up safe mode');
        
        // Prevent conflicts with Dash callbacks
        const originalAddEventListener = Element.prototype.addEventListener;
        Element.prototype.addEventListener = function(type, listener, options) {
            // Add a wrapper to prevent event propagation conflicts
            if (this.id && this.id.includes('velocity')) {
                const wrappedListener = function(event) {
                    try {
                        // Stop propagation for velocity finder events to prevent Dash conflicts
                        if (event.target && event.target.closest('#velocity-finder-container')) {
                            event.stopPropagation();
                        }
                        return listener.call(this, event);
                    } catch (error) {
                        console.error('Event listener error:', error);
                    }
                };
                return originalAddEventListener.call(this, type, wrappedListener, options);
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
    }

    // Start the initialization process
    initializeWhenDashReady();

    // Export for debugging
    window.DashVelocityFinderIntegration = {
        initialize: initializeDashVelocityFinder,
        waitForDependencies: waitForDependencies
    };

})();

// Additional Dash-specific fixes
document.addEventListener('DOMContentLoaded', function() {
    // Fix for Dash component lifecycle
    const checkAndInitialize = () => {
        const container = document.getElementById('velocity-finder-container');
        if (container && !container.hasAttribute('data-initialized')) {
            container.setAttribute('data-initialized', 'true');
            
            // Ensure all scripts are loaded
            const requiredScripts = [
                'velocity-finder-core.js',
                'location-service.js', 
                'velocity-finder-loader.js',
                'curated-locations.js'
            ];
            
            let scriptsLoaded = 0;
            const checkScript = (scriptName) => {
                const scripts = document.querySelectorAll('script');
                return Array.from(scripts).some(script => 
                    script.src && script.src.includes(scriptName)
                );
            };
            
            requiredScripts.forEach(scriptName => {
                if (checkScript(scriptName)) {
                    scriptsLoaded++;
                }
            });
            
            console.log(`Scripts loaded: ${scriptsLoaded}/${requiredScripts.length}`);
            
            if (scriptsLoaded === requiredScripts.length) {
                // All scripts loaded, safe to initialize
                setTimeout(() => {
                    if (typeof VelocityFinder !== 'undefined') {
                        VelocityFinder.init('velocity-finder-container');
                    }
                }, 1000);
            } else {
                console.log('Not all scripts loaded yet, will retry...');
                setTimeout(checkAndInitialize, 2000);
            }
        }
    };
    
    // Initial check
    checkAndInitialize();
    
    // Also check periodically for dynamic loading
    const intervalId = setInterval(() => {
        if (document.getElementById('velocity-finder-container') && 
            typeof VelocityFinder !== 'undefined') {
            clearInterval(intervalId);
            checkAndInitialize();
        }
    }, 1000);
    
    // Stop checking after 30 seconds
    setTimeout(() => clearInterval(intervalId), 30000);
});