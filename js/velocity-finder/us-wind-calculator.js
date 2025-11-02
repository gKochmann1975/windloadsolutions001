// us-wind-calculator.js - EXACTLY as specified, DO NOT modify
const USWindCalculator = (function() {
    'use strict';

    const stateWindData = {
        'FL': { base: 175, coastal: 20, special: 'Hurricane region - HVHZ requirements may apply' },
        'LA': { base: 150, coastal: 15, special: 'Hurricane region requirements' },
        'TX': { base: 130, coastal: 15, special: 'Hurricane-prone coastal areas' },
        'SC': { base: 140, coastal: 10, special: 'Coastal wind zone' },
        'NC': { base: 135, coastal: 10, special: 'Hurricane susceptible area' },
        'GA': { base: 120, coastal: 5, special: null },
        'AL': { base: 125, coastal: 10, special: null },
        'MS': { base: 130, coastal: 15, special: 'Hurricane region' },
        'CA': { base: 85, coastal: 5, special: 'Seismic design typically governs' },
        'NY': { base: 115, coastal: 10, special: null },
        'IL': { base: 90, coastal: 0, special: null },
        'PA': { base: 100, coastal: 0, special: null },
        'OH': { base: 95, coastal: 0, special: null },
        'MI': { base: 95, coastal: 5, special: null },
        'WA': { base: 85, coastal: 5, special: null },
        'OR': { base: 85, coastal: 5, special: null },
        'NV': { base: 85, coastal: 0, special: null },
        'AZ': { base: 90, coastal: 0, special: 'Desert wind considerations' },
        'CO': { base: 90, coastal: 0, special: 'High altitude effects' },
        'UT': { base: 90, coastal: 0, special: null },
        'NM': { base: 90, coastal: 0, special: null },
        'WY': { base: 95, coastal: 0, special: 'Mountain wind effects' },
        'MT': { base: 90, coastal: 0, special: 'Terrain considerations' },
        'ND': { base: 100, coastal: 0, special: null },
        'SD': { base: 100, coastal: 0, special: null },
        'NE': { base: 100, coastal: 0, special: null },
        'KS': { base: 105, coastal: 0, special: 'High wind region' },
        'OK': { base: 110, coastal: 0, special: 'Tornado considerations' },
        'AR': { base: 100, coastal: 0, special: null },
        'MO': { base: 95, coastal: 0, special: null },
        'IA': { base: 95, coastal: 0, special: null },
        'MN': { base: 95, coastal: 0, special: null },
        'WI': { base: 95, coastal: 5, special: null },
        'IN': { base: 90, coastal: 0, special: null },
        'KY': { base: 90, coastal: 0, special: null },
        'TN': { base: 90, coastal: 0, special: null },
        'VA': { base: 105, coastal: 10, special: null },
        'WV': { base: 95, coastal: 0, special: null },
        'MD': { base: 110, coastal: 10, special: null },
        'DE': { base: 115, coastal: 10, special: null },
        'NJ': { base: 115, coastal: 10, special: null },
        'CT': { base: 110, coastal: 10, special: null },
        'RI': { base: 115, coastal: 15, special: 'Coastal exposure' },
        'MA': { base: 110, coastal: 10, special: null },
        'VT': { base: 100, coastal: 0, special: null },
        'NH': { base: 105, coastal: 5, special: null },
        'ME': { base: 110, coastal: 10, special: 'Coastal exposure' },
        'AK': { base: 85, coastal: 10, special: 'Arctic conditions' },
        'HI': { base: 105, coastal: 15, special: 'Hurricane region' },
        'DEFAULT': { base: 95, coastal: 5, special: null }
    };

    function calculateWindSpeed(lat, lng, state, city) {
        const stateData = stateWindData[state] || stateWindData['DEFAULT'];
        
        const isCoastal = isCoastalLocation(lat, lng);
        const elevationFactor = getElevationFactor(lat, lng);
        const coastalBonus = isCoastal ? stateData.coastal : 0;
        
        const asceVelocity = Math.round((stateData.base + coastalBonus) * elevationFactor);
        
        return {
            asce: asceVelocity,
            local: asceVelocity,
            jurisdiction: `${city}, ${state}`,
            lat: lat,
            lng: lng,
            specialRequirement: stateData.special,
            ccRequirements: getCCRequirements(state, isCoastal)
        };
    }

    function isCoastalLocation(lat, lng) {
        const coastalBounds = [
            { minLat: 24, maxLat: 45, minLng: -85, maxLng: -75 }, // Atlantic
            { minLat: 24, maxLat: 31, minLng: -98, maxLng: -80 }, // Gulf
            { minLat: 32, maxLat: 49, minLng: -125, maxLng: -115 }, // Pacific
            { minLat: 41, maxLat: 49, minLng: -93, maxLng: -75 } // Great Lakes
        ];
        
        return coastalBounds.some(bounds => 
            lat >= bounds.minLat && lat <= bounds.maxLat && 
            lng >= bounds.minLng && lng <= bounds.maxLng
        );
    }

    function getElevationFactor(lat, lng) {
        if ((lat >= 37 && lat <= 49 && lng >= -115 && lng <= -102) || 
            (lat >= 35 && lat <= 45 && lng >= -85 && lng <= -75)) {
            return 1.1;
        }
        return 1.0;
    }

    function getCCRequirements(state, isCoastal) {
        const stateRequirements = {
            'FL': {
                allowsNominal: true,
                nominalFactor: 0.6,
                stormShuttersRequired: true,
                impactResistanceRequired: true,
                buildingCode: 'Florida Building Code',
                specialNotes: 'HVHZ requirements may apply. Impact-resistant openings required.'
            },
            'TX': {
                allowsNominal: true,
                nominalFactor: 0.6,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Texas Building Code',
                specialNotes: 'Hurricane considerations for coastal areas.'
            },
            'CA': {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'California Building Code',
                specialNotes: 'Seismic design typically governs over wind.'
            },
            'NY': {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'New York State Building Code',
                specialNotes: 'Ultimate wind pressures required for all applications.'
            }
        };
        
        return stateRequirements[state] || {
            allowsNominal: false,
            stormShuttersRequired: false,
            impactResistanceRequired: false,
            buildingCode: 'International Building Code',
            specialNotes: 'Standard IBC wind load provisions apply.'
        };
    }

    return {
        calculateWindSpeed: calculateWindSpeed
    };
})();

window.USWindCalculator = USWindCalculator;