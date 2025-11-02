// velocity-finder-loader.js - FIXED: Dash-compatible asset paths
const VelocityFinderLoader = (function() {
    'use strict';

    const loadedModules = new Set();

    async function loadModule(moduleName) {
        if (loadedModules.has(moduleName)) {
            const globalName = moduleName.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).replace('-', '');
            return window[globalName];
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            // FIXED: Use Dash-compatible asset path instead of static js/ path
            script.src = `/assets/js/velocity-finder/${moduleName}.js`;
            script.onload = () => {
                loadedModules.add(moduleName);
                const globalName = moduleName.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).replace('-', '');
                resolve(window[globalName]);
            };
            script.onerror = () => reject(new Error(`Failed to load ${moduleName} from /assets/js/velocity-finder/${moduleName}.js`));
            document.head.appendChild(script);
        });
    }

    return { loadModule };
})();

// Attach to VelocityFinder when it's available
if (typeof VelocityFinder !== 'undefined') {
    VelocityFinder.loadModule = VelocityFinderLoader.loadModule;
} else {
    window.VelocityFinderLoader = VelocityFinderLoader;
}