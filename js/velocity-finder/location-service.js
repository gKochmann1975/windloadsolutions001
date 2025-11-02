// location-service.js - FIXED: Self-contained with internal dependencies
const LocationService = (function() {
    'use strict';

    const cache = new Map();
    
    // Internal US wind calculator - replaces external us-wind-calculator module
    const USWindCalculator = {
        calculateWindSpeed: function(lat, lng, state, city) {
            // Use default calculations based on location
            // This mirrors the logic from velocity-finder-core.js
            let baseVelocity = 115; // Default ASCE 7 velocity
            let localVelocity = 115;
            let jurisdiction = `${city}, ${state}`;
            
            // Enhanced regional calculations based on geographic zones
            if (state === 'FL' || (lat >= 24.5 && lat <= 31.0 && lng >= -87.0 && lng <= -79.0)) {
                // Florida - hurricane prone region
                if (lat <= 27.0 && lng >= -82.0) {
                    // South Florida HVHZ
                    baseVelocity = 180;
                    localVelocity = 175;
                    jurisdiction = 'South Florida HVHZ';
                } else {
                    // Rest of Florida
                    baseVelocity = 150;
                    localVelocity = 160;
                    jurisdiction = 'Florida Hurricane Region';
                }
            } else if (state === 'TX' || (lat >= 25.0 && lat <= 36.0 && lng >= -106.0 && lng <= -93.0)) {
                // Texas - Gulf Coast hurricane region
                if (lat <= 30.0 && lng >= -97.0) {
                    baseVelocity = 130;
                    localVelocity = 130;
                    jurisdiction = 'Texas Gulf Coast';
                } else {
                    baseVelocity = 90;
                    localVelocity = 95;
                    jurisdiction = 'Texas Inland';
                }
            } else if (state === 'LA' || state === 'MS' || state === 'AL' || 
                      (lat >= 29.0 && lat <= 33.0 && lng >= -94.0 && lng <= -87.0)) {
                // Gulf Coast states
                baseVelocity = 120;
                localVelocity = 135;
                jurisdiction = 'Gulf Coast Region';
            } else if (state === 'SC' || state === 'NC' || state === 'GA' ||
                      (lat >= 32.0 && lat <= 36.0 && lng >= -84.0 && lng <= -75.0)) {
                // Atlantic Coast states
                baseVelocity = 110;
                localVelocity = 140;
                jurisdiction = 'Atlantic Coast Region';
            } else if (state === 'CA' || (lat >= 32.0 && lat <= 42.0 && lng >= -125.0 && lng <= -114.0)) {
                // California - low wind speeds
                baseVelocity = 85;
                localVelocity = 85;
                jurisdiction = 'California Low Wind Zone';
            } else if (state === 'NY' || state === 'NJ' || state === 'CT' || state === 'MA' ||
                      (lat >= 40.0 && lat <= 45.0 && lng >= -80.0 && lng <= -69.0)) {
                // Northeast states
                baseVelocity = 110;
                localVelocity = 115;
                jurisdiction = 'Northeast Region';
            } else if (lat >= 40.0 && lng >= -90.0 && lng <= -80.0) {
                // Midwest region
                baseVelocity = 90;
                localVelocity = 90;
                jurisdiction = 'Midwest Region';
            } else if (lng <= -100.0 && lat >= 35.0) {
                // Mountain/Western region
                baseVelocity = 90;
                localVelocity = 90;
                jurisdiction = 'Mountain/Western Region';
            }
            
            return {
                asce: baseVelocity,
                local: localVelocity,
                jurisdiction: jurisdiction,
                lat: lat,
                lng: lng,
                ccRequirements: {
                    allowsNominal: baseVelocity >= 130, // Hurricane regions allow nominal
                    stormShuttersRequired: baseVelocity >= 150, // HVHZ requirements
                    impactResistanceRequired: baseVelocity >= 150,
                    buildingCode: state === 'FL' ? 'Florida Building Code' : 
                                 state === 'CA' ? 'California Building Code' :
                                 state === 'TX' ? 'Texas Building Code' : 'International Building Code',
                    nominalFactor: baseVelocity >= 130 ? 0.6 : null,
                    specialNotes: baseVelocity >= 150 ? 'Hurricane region - Enhanced requirements apply' :
                                 'Standard ASCE 7 requirements apply'
                }
            };
        }
    };
    
    async function getLocationData(input) {
        if (cache.has(input)) {
            return cache.get(input);
        }

        let locationData = null;

        // 1. Check curated database first - use global CuratedLocations if available
        if (typeof window !== 'undefined' && window.CuratedLocations && window.CuratedLocations.locations[input]) {
            locationData = window.CuratedLocations.locations[input];
        }
        // 2. US ZIP codes
        else if (/^\d{5}(-\d{4})?$/.test(input)) {
            locationData = await getUSLocationData(input);
        }
        // 3. Fallback to geocoding
        else {
            locationData = await geocodeLocation(input);
        }

        if (locationData) {
            cache.set(input, locationData);
        }

        return locationData;
    }

    async function getUSLocationData(zipCode) {
        try {
            const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
            const zipData = await response.json();

            // Use internal calculator instead of external module
            return USWindCalculator.calculateWindSpeed(
                parseFloat(zipData.lat),
                parseFloat(zipData.lng),
                zipData.places[0].state_abbreviation,
                zipData.places[0]['place name']
            );
        } catch (error) {
            console.error('US location lookup failed:', error);
            return null;
        }
    }

    async function geocodeLocation(location) {
        try {
            const cleanLocation = location.trim();
            let response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanLocation + ', United States')}&countrycodes=us&limit=3`);
            let data = await response.json();
            
            if (!data || data.length === 0) {
                response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanLocation)}&countrycodes=us&limit=3`);
                data = await response.json();
            }
            
            if (data && data.length > 0) {
                const bestMatch = data[0];
                
                // Use internal calculator instead of external module
                const windData = USWindCalculator.calculateWindSpeed(
                    parseFloat(bestMatch.lat),
                    parseFloat(bestMatch.lon),
                    'DEFAULT',
                    'Unknown Location'
                );

                return {
                    ...windData,
                    lat: parseFloat(bestMatch.lat),
                    lng: parseFloat(bestMatch.lon),
                    jurisdiction: bestMatch.display_name
                };
            }
            
            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    }

    return {
        getLocationData: getLocationData
    };
})();

window.LocationService = LocationService;