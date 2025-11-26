// ================================================================
// BUILDING INTELLIGENCE PLATFORM - ENHANCED WITH HURRICANE RISK INTELLIGENCE
// ✅ ASCE 7-22 (updated from 7-16)
// ✅ Complete Hurricane Risk Intelligence standalone feature
// ✅ LOCAL AI-powered hurricane analysis (NO API required!)
// ✅ Hurricane risk scoring and location-based analysis
// ✅ Interactive hurricane path animator
// ✅ Statistics dashboard and heatmap
// ✅ Insurance intelligence and cost analysis
// ✅ All original features preserved and enhanced
// ✅ NEW: Open/Close toggle system for all features
// ✅ All sections collapsed by default
// 
// 🌀 HURRICANE AI INTEGRATION:
//    This file works with hurricane-ai-complete.js which provides:
//    - Natural language question processing (NO external API!)
//    - Intelligent hurricane data analysis
//    - All AI features work 100% locally in the browser
//    
//    IMPORTANT: Include both files in your HTML:
//    <script src="building-intelligence-platform.js"></script>
//    <script src="hurricane-ai-complete.js"></script>
// ================================================================

window.VelocityFinder = (function() {
    'use strict';

    // ================================================================
    // CONFIGURATION
    // ================================================================
    const CONFIG = {
        // Try multiple possible CSV paths
        csvPaths: [
            window.VELOCITY_FINDER_CONFIG?.csvPath,
            '../data/usps_zip_codes.csv',
            './data/usps_zip_codes.csv',
            'data/usps_zip_codes.csv',
            '/data/usps_zip_codes.csv',
            '../usps_zip_codes.csv',
            './usps_zip_codes.csv',
            'usps_zip_codes.csv'
        ].filter(path => path), // Remove undefined/null values
        geocodingDelay: 1000,
        maxComparisons: 10,
        maxResults: 500,
        sampleMarkersCount: 15
    };

    // ================================================================
    // SVG ICON LIBRARY
    // ================================================================
    const SVG_ICONS = {
        wind: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
        </svg>`,
        
        sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>`,
        
        filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
        </svg>`,
        
        chart: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>`,
        
        map: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
            <line x1="8" y1="2" x2="8" y2="18"/>
            <line x1="16" y1="6" x2="16" y2="22"/>
        </svg>`,
        
        hurricane: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.3"/>
            <path d="M12 4 C10 4, 8 5, 7 7 C6 9, 6 11, 7.5 12.5" stroke-width="2"/>
            <path d="M20 12 C20 10, 19 8, 17 7 C15 6, 13 6, 11.5 7.5" stroke-width="2"/>
            <path d="M12 20 C14 20, 16 19, 17 17 C18 15, 18 13, 16.5 11.5" stroke-width="2"/>
            <path d="M4 12 C4 14, 5 16, 7 17 C9 18, 11 18, 12.5 16.5" stroke-width="2"/>
            <path d="M9 6 C7.5 6.5, 6.5 7.5, 6 9" stroke-width="1.2" opacity="0.6"/>
            <path d="M18 9 C17.5 7.5, 16.5 6.5, 15 6" stroke-width="1.2" opacity="0.6"/>
            <path d="M15 18 C16.5 17.5, 17.5 16.5, 18 15" stroke-width="1.2" opacity="0.6"/>
            <path d="M6 15 C6.5 16.5, 7.5 17.5, 9 18" stroke-width="1.2" opacity="0.6"/>
        </svg>`,
        
        document: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
        </svg>`,
        
        spreadsheet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="3" y1="15" x2="21" y2="15"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
            <line x1="15" y1="3" x2="15" y2="21"/>
        </svg>`,
        
        search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
        </svg>`,
        
        trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>`,
        
        location: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
        </svg>`,
        
        tornado: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 4H3M20 8H4M19 12H5M18 16H6M17 20h-4"/>
        </svg>`,
        
        building: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
            <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>
        </svg>`,
        
        alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>`,
        
        lightning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>`,
        
        plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>`,
        
        x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>`,
        
        download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>`,
        
        chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
        </svg>`,
        
        play: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>`,
        
        pause: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="6" y="4" width="4" height="16"/>
            <rect x="14" y="4" width="4" height="16"/>
        </svg>`,
        
        brain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
        </svg>`,
        
        shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>`,
        
        dollarSign: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>`
    };

    // ================================================================
    // CONSTANTS
    // ================================================================
    const WIND_PRESSURE_CONSTANTS = {
        VELOCITY_PRESSURE_COEFFICIENT: 0.00256,
        CC_PRESSURE_COEFFICIENT: 1.2,
        NOMINAL_PRESSURE_FACTOR: 0.6,
        FUTURE_VELOCITY_FACTOR: 1.15
    };

    const RISK_CATEGORY_MULTIPLIERS = {
        'category-1': 0.87,
        'category-2': 1.0,
        'category-3': 1.15,
        'category-4': 1.15
    };

    const FLORIDA_OVERRIDES = {
        'Miami-Dade': { 
            cat1: 165, cat2: 175, cat3: 186, cat4: 195,
            authority: 'FBC 2023',
            authorityFull: '2023 Florida Building Code',
            zipCount: 80,
            fips: '12086'
        },
        'Broward': { 
            cat1: 156, cat2: 170, cat3: 180, cat4: 185,
            authority: 'FBC 2023',
            authorityFull: '2023 Florida Building Code',
            zipCount: 55,
            fips: '12011'
        },
        'Collier': { 
            cat1: 151, cat2: 170, cat3: 180, cat4: 190,
            authority: 'Local Jurisdiction',
            authorityFull: 'Collier County Building Department',
            zipCount: 22,
            fips: '12021'
        }
    };

    // ================================================================
    // COMPREHENSIVE HURRICANE DATABASE
    // ================================================================
    const HURRICANE_DATABASE = [
        // 1950s
        { name: 'Hurricane Hazel', year: 1954, category: 4, windSpeed: 140, path: [[33.5, -78.0], [35.0, -79.0], [37.0, -80.0]], color: '#dc2626', landfall: 'North Carolina', damage: 281, casualties: 95, states: ['NC', 'SC', 'VA'] },
        { name: 'Hurricane Donna', year: 1960, category: 4, windSpeed: 145, path: [[25.0, -80.5], [27.0, -81.0], [29.0, -82.0]], color: '#dc2626', landfall: 'Florida Keys', damage: 900, casualties: 364, states: ['FL', 'GA', 'SC', 'NC'] },
        { name: 'Hurricane Camille', year: 1969, category: 5, windSpeed: 175, path: [[29.0, -89.5], [30.5, -89.0], [32.0, -88.5]], color: '#7f1d1d', landfall: 'Mississippi', damage: 1420, casualties: 256, states: ['MS', 'LA', 'AL'] },
        
        // 1970s
        { name: 'Hurricane Carmen', year: 1974, category: 3, windSpeed: 115, path: [[29.5, -90.0], [30.0, -89.5], [31.0, -89.0]], color: '#f59e0b', landfall: 'Louisiana', damage: 162, casualties: 8, states: ['LA'] },
        { name: 'Hurricane Frederic', year: 1979, category: 3, windSpeed: 120, path: [[30.0, -88.0], [31.0, -87.5], [32.5, -87.0]], color: '#f59e0b', landfall: 'Alabama', damage: 2300, casualties: 12, states: ['AL', 'MS', 'FL'] },
        
        // 1980s
        { name: 'Hurricane Alicia', year: 1983, category: 3, windSpeed: 115, path: [[29.0, -95.0], [29.5, -95.5], [30.0, -96.0]], color: '#f59e0b', landfall: 'Texas', damage: 3000, casualties: 21, states: ['TX'] },
        { name: 'Hurricane Elena', year: 1985, category: 3, windSpeed: 125, path: [[27.5, -82.5], [28.5, -83.0], [29.5, -84.0]], color: '#f59e0b', landfall: 'Florida', damage: 1300, casualties: 4, states: ['FL', 'MS', 'AL'] },
        { name: 'Hurricane Hugo', year: 1989, category: 4, windSpeed: 140, path: [[32.5, -79.5], [33.5, -80.0], [34.5, -80.5]], color: '#dc2626', landfall: 'South Carolina', damage: 10000, casualties: 60, states: ['SC', 'NC', 'VA'] },
        
        // 1990s
        { name: 'Hurricane Andrew', year: 1992, category: 5, windSpeed: 165, path: [[25.5, -80.5], [25.7, -80.3], [25.9, -80.1], [26.1, -79.9]], color: '#7f1d1d', landfall: 'Florida', damage: 27300, casualties: 65, states: ['FL', 'LA'] },
        { name: 'Hurricane Opal', year: 1995, category: 3, windSpeed: 115, path: [[30.0, -87.0], [31.0, -86.5], [32.0, -86.0]], color: '#f59e0b', landfall: 'Florida Panhandle', damage: 3000, casualties: 9, states: ['FL', 'AL', 'GA'] },
        { name: 'Hurricane Fran', year: 1996, category: 3, windSpeed: 120, path: [[34.0, -78.0], [35.0, -78.5], [36.0, -79.0]], color: '#f59e0b', landfall: 'North Carolina', damage: 3200, casualties: 26, states: ['NC', 'VA', 'SC'] },
        
        // 2000s
        { name: 'Hurricane Isabel', year: 2003, category: 2, windSpeed: 105, path: [[35.5, -76.0], [36.5, -76.5], [37.5, -77.0]], color: '#eab308', landfall: 'North Carolina', damage: 5500, casualties: 51, states: ['NC', 'VA', 'MD'] },
        { name: 'Hurricane Charley', year: 2004, category: 4, windSpeed: 150, path: [[26.5, -82.0], [27.0, -81.5], [27.5, -81.0]], color: '#dc2626', landfall: 'Florida', damage: 16300, casualties: 35, states: ['FL', 'SC'] },
        { name: 'Hurricane Frances', year: 2004, category: 2, windSpeed: 105, path: [[27.0, -80.0], [27.5, -80.5], [28.0, -81.0]], color: '#eab308', landfall: 'Florida', damage: 10000, casualties: 48, states: ['FL', 'GA', 'SC', 'NC'] },
        { name: 'Hurricane Ivan', year: 2004, category: 3, windSpeed: 120, path: [[30.0, -87.5], [30.5, -88.0], [31.0, -88.5]], color: '#f59e0b', landfall: 'Alabama', damage: 20500, casualties: 92, states: ['AL', 'FL', 'MS', 'LA'] },
        { name: 'Hurricane Jeanne', year: 2004, category: 3, windSpeed: 120, path: [[27.0, -80.0], [27.5, -80.5], [28.0, -81.0]], color: '#f59e0b', landfall: 'Florida', damage: 7500, casualties: 28, states: ['FL', 'SC', 'NC', 'VA'] },
        { name: 'Hurricane Katrina', year: 2005, category: 3, windSpeed: 125, path: [[25.0, -89.0], [28.0, -90.0], [30.0, -89.5], [32.0, -89.0]], color: '#f59e0b', landfall: 'Louisiana', damage: 125000, casualties: 1833, states: ['LA', 'MS', 'AL', 'FL'] },
        { name: 'Hurricane Rita', year: 2005, category: 3, windSpeed: 115, path: [[25.5, -93.0], [29.0, -94.0], [30.5, -93.5], [32.0, -93.0]], color: '#f59e0b', landfall: 'Texas/Louisiana', damage: 18500, casualties: 120, states: ['TX', 'LA'] },
        { name: 'Hurricane Wilma', year: 2005, category: 3, windSpeed: 120, path: [[25.5, -81.5], [26.0, -81.0], [26.5, -80.5]], color: '#f59e0b', landfall: 'Florida', damage: 21000, casualties: 35, states: ['FL'] },
        
        // 2010s
        { name: 'Hurricane Irene', year: 2011, category: 1, windSpeed: 85, path: [[35.5, -75.5], [36.5, -76.0], [37.5, -76.5]], color: '#22c55e', landfall: 'North Carolina', damage: 15800, casualties: 45, states: ['NC', 'VA', 'MD', 'NJ', 'NY'] },
        { name: 'Hurricane Sandy', year: 2012, category: 1, windSpeed: 80, path: [[39.5, -74.0], [40.0, -74.5], [40.5, -75.0]], color: '#22c55e', landfall: 'New Jersey', damage: 70200, casualties: 233, states: ['NJ', 'NY', 'CT', 'PA'] },
        { name: 'Hurricane Arthur', year: 2014, category: 2, windSpeed: 100, path: [[35.0, -76.0], [36.0, -76.5], [37.0, -77.0]], color: '#eab308', landfall: 'North Carolina', damage: 110, casualties: 1, states: ['NC'] },
        { name: 'Hurricane Matthew', year: 2016, category: 4, windSpeed: 145, path: [[29.5, -81.0], [30.5, -81.5], [32.0, -80.5]], color: '#dc2626', landfall: 'South Carolina', damage: 10000, casualties: 49, states: ['FL', 'GA', 'SC', 'NC'] },
        { name: 'Hurricane Harvey', year: 2017, category: 4, windSpeed: 130, path: [[27.5, -97.0], [28.5, -96.5], [29.5, -95.5], [30.0, -94.5]], color: '#dc2626', landfall: 'Texas', damage: 125000, casualties: 107, states: ['TX', 'LA'] },
        { name: 'Hurricane Irma', year: 2017, category: 4, windSpeed: 155, path: [[25.0, -80.5], [26.0, -81.0], [27.5, -82.5], [29.0, -83.0]], color: '#dc2626', landfall: 'Florida', damage: 50000, casualties: 134, states: ['FL', 'GA', 'SC'] },
        { name: 'Hurricane Maria', year: 2017, category: 4, windSpeed: 155, path: [[18.0, -66.0], [19.0, -67.0], [20.0, -68.0]], color: '#dc2626', landfall: 'Puerto Rico', damage: 90000, casualties: 2975, states: ['PR', 'VI'] },
        { name: 'Hurricane Florence', year: 2018, category: 1, windSpeed: 90, path: [[34.0, -78.0], [35.0, -78.5], [36.0, -79.0]], color: '#22c55e', landfall: 'North Carolina', damage: 24200, casualties: 53, states: ['NC', 'SC', 'VA'] },
        { name: 'Hurricane Michael', year: 2018, category: 5, windSpeed: 160, path: [[30.0, -85.5], [31.0, -85.0], [32.0, -84.5]], color: '#7f1d1d', landfall: 'Florida Panhandle', damage: 25100, casualties: 74, states: ['FL', 'GA', 'AL'] },
        { name: 'Hurricane Dorian', year: 2019, category: 2, windSpeed: 110, path: [[35.0, -75.5], [36.0, -76.0], [37.0, -76.5]], color: '#eab308', landfall: 'North Carolina', damage: 5100, casualties: 84, states: ['NC', 'SC'] },
        
        // 2020s
        { name: 'Hurricane Laura', year: 2020, category: 4, windSpeed: 150, path: [[29.5, -93.5], [30.0, -93.0], [30.5, -92.5]], color: '#dc2626', landfall: 'Louisiana', damage: 19000, casualties: 77, states: ['LA', 'TX'] },
        { name: 'Hurricane Sally', year: 2020, category: 2, windSpeed: 105, path: [[30.5, -87.5], [31.0, -87.0], [31.5, -86.5]], color: '#eab308', landfall: 'Alabama', damage: 7300, casualties: 8, states: ['AL', 'FL'] },
        { name: 'Hurricane Ida', year: 2021, category: 4, windSpeed: 150, path: [[28.5, -89.5], [29.5, -90.0], [30.5, -89.5], [32.0, -89.0]], color: '#dc2626', landfall: 'Louisiana', damage: 75000, casualties: 115, states: ['LA', 'MS', 'NY', 'NJ', 'PA'] },
        { name: 'Hurricane Ian', year: 2022, category: 4, windSpeed: 155, path: [[24.5, -82.5], [26.5, -82.0], [27.5, -82.5], [28.0, -83.0]], color: '#dc2626', landfall: 'Florida', damage: 112900, casualties: 156, states: ['FL', 'SC', 'NC'] },
        { name: 'Hurricane Nicole', year: 2022, category: 1, windSpeed: 75, path: [[27.0, -80.0], [28.0, -80.5], [29.0, -81.0]], color: '#22c55e', landfall: 'Florida', damage: 1000, casualties: 5, states: ['FL'] },
        { name: 'Hurricane Idalia', year: 2023, category: 3, windSpeed: 125, path: [[29.0, -83.0], [30.0, -84.0], [31.0, -84.5]], color: '#f59e0b', landfall: 'Florida', damage: 3600, casualties: 12, states: ['FL', 'GA', 'SC'] }
    ];

    // ================================================================
    // STATE
    // ================================================================
    let state = {
        map: null,
        currentMarkers: [],
        activeLayer: 'velocity',
        selectedRiskCategory: 'category-2',
        layerGroups: {},
        timelineControl: null,
        csvVelocityData: {},
        csvLoaded: false,
        comparisonZIPs: [],
        currentLocationData: null,
        currentLocationZip: null,
        lastGeocodingCall: 0,
        solarResults: [],
        filterResults: [],
        hurricaneRiskResults: null,
        hurricaneAnimator: {
            isPlaying: false,
            currentFrame: 0,
            selectedHurricane: null,
            animationSpeed: 500
        },
        hurricaneFilters: {
            category: 'all',
            yearStart: 1950,
            yearEnd: 2024,
            state: 'all',
            name: ''
        },
        openSection: null // Track which section is currently open
    };

    // ================================================================
    // DOM ELEMENTS CACHE
    // ================================================================
    let DOM = {};

    function cacheDOMElements() {
        DOM = {
            locationInput: document.getElementById('location-input'),
            velocityResults: document.getElementById('velocity-results'),
            analysisBlock: document.getElementById('analysis-block'),
            asceVelocity: document.getElementById('asce-velocity'),
            localVelocity: document.getElementById('local-velocity'),
            requiredVelocity: document.getElementById('required-velocity'),
            futureVelocity: document.getElementById('future-velocity'),
            localAlert: document.getElementById('local-alert'),
            alertText: document.getElementById('alert-text'),
            solarResultsContainer: document.getElementById('solar-results-container'),
            filterResultsContainer: document.getElementById('filter-results-container'),
            comparisonList: document.getElementById('comparison-list'),
            comparisonTableContainer: document.getElementById('comparison-table-container'),
            compareZipInput: document.getElementById('compare-zip-input'),
            hurricaneZipInput: document.getElementById('hurricane-zip-input'),
            hurricaneNLSearch: document.getElementById('hurricane-nl-search'),
            hurricaneRiskResults: document.getElementById('hurricane-risk-results')
        };
    }

    // ================================================================
    // NEW: TOGGLE SWITCH HTML GENERATOR
    // ================================================================
    function createToggleSwitch(sectionId) {
        return `
            <div class="feature-toggle-container">
                <span class="toggle-label">Close</span>
                <label class="toggle-switch">
                    <input type="checkbox" id="${sectionId}-toggle" onchange="VelocityFinder.toggleFeatureSection('${sectionId}', this.checked)">
                    <span class="toggle-slider"></span>
                </label>
                <span class="toggle-label">Open</span>
            </div>
        `;
    }

    // ================================================================
    // HTML GENERATION (UPDATED WITH TOGGLE SYSTEM)
    // ================================================================
    function generateBuildingIntelligencePlatformHTML() {
        return `
        <style>
            /* Toggle Switch Styles */
            .feature-toggle-container {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                margin-top: 1.5rem;
            }
            
            .toggle-label {
                font-size: 0.95rem;
                font-weight: 600;
                color: #64748b;
                transition: color 0.3s ease;
            }
            
            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 34px;
                cursor: pointer;
            }
            
            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .toggle-slider {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
                border-radius: 34px;
                transition: all 0.3s ease;
                border: 2px solid #cbd5e1;
            }
            
            .toggle-slider:before {
                position: absolute;
                content: "";
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 2px;
                background-color: white;
                border-radius: 50%;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            
            .toggle-switch input:checked + .toggle-slider {
                background: linear-gradient(135deg, #0018ff 0%, #181E57 100%);
                border-color: #0018ff;
            }
            
            .toggle-switch input:checked + .toggle-slider:before {
                transform: translateX(26px);
            }
            
            /* Highlight active label */
            .toggle-switch input:checked ~ .toggle-label:last-child,
            .feature-toggle-container:has(input:checked) .toggle-label:last-child {
                color: #0018ff;
                font-weight: 700;
            }
            
            .feature-toggle-container:has(input:not(:checked)) .toggle-label:first-child {
                color: #0018ff;
                font-weight: 700;
            }
            
            /* Hide feature content by default */
            .feature-content-hidden {
                display: none !important;
            }
            
            /* Smooth transitions */
            .feature-content-card {
                transition: all 0.3s ease;
            }
        </style>
        
        <div class="building-intelligence-platform">
            <div class="platform-container">
                <!-- Platform Header -->
                <div class="platform-header">
                    <h1 class="platform-title">
                        <div class="platform-icon">
                            ${SVG_ICONS.lightning}
                        </div>
                        Building Intelligence Platform
                    </h1>
                    <p class="platform-subtitle">
                        Advanced location intelligence, demographics, wind velocity analysis, and comprehensive hurricane risk assessment for professional building design.
                    </p>
                </div>

                <!-- Top Navigation Cards -->
                <div class="top-navigation">
                    <a href="#velocity-finder" class="nav-card" onclick="VelocityFinder.scrollToSection('velocity-finder'); return false;">
                        <div class="nav-card-icon velocity-icon">
                            ${SVG_ICONS.wind}
                        </div>
                        <div class="nav-card-content">
                            <div class="nav-card-title">Velocity Finder</div>
                            <div class="nav-card-tagline">Calculate wind speeds for any location</div>
                        </div>
                    </a>
                    
                    <a href="#hurricane-risk" class="nav-card" onclick="VelocityFinder.scrollToSection('hurricane-risk'); return false;">
                        <div class="nav-card-icon hurricane-icon">
                            ${SVG_ICONS.hurricane}
                        </div>
                        <div class="nav-card-content">
                            <div class="nav-card-title">Hurricane Risk Intelligence</div>
                            <div class="nav-card-tagline">AI-powered hurricane history & risk analysis</div>
                        </div>
                    </a>
                    
                    <a href="#solar-finder" class="nav-card" onclick="VelocityFinder.scrollToSection('solar-finder'); return false;">
                        <div class="nav-card-icon solar-icon">
                            ${SVG_ICONS.sun}
                        </div>
                        <div class="nav-card-content">
                            <div class="nav-card-title">Solar Site Finder</div>
                            <div class="nav-card-tagline">Find ideal locations for solar development</div>
                        </div>
                    </a>
                    
                    <a href="#advanced-search" class="nav-card" onclick="VelocityFinder.scrollToSection('advanced-search'); return false;">
                        <div class="nav-card-icon filter-icon">
                            ${SVG_ICONS.filter}
                        </div>
                        <div class="nav-card-content">
                            <div class="nav-card-title">Advanced Search</div>
                            <div class="nav-card-tagline">Filter by wind, population & demographics</div>
                        </div>
                    </a>
                    
                    <a href="#multi-compare" class="nav-card" onclick="VelocityFinder.scrollToSection('multi-compare'); return false;">
                        <div class="nav-card-icon compare-icon">
                            ${SVG_ICONS.chart}
                        </div>
                        <div class="nav-card-content">
                            <div class="nav-card-title">Multi-ZIP Compare</div>
                            <div class="nav-card-tagline">Compare multiple locations side-by-side</div>
                        </div>
                    </a>
                </div>

                <!-- ================================================================
                     VELOCITY FINDER SECTION
                     ================================================================ -->
                <div id="velocity-finder" class="feature-section">
                    <div class="feature-header-row">
                        <div class="feature-icon-card">
                            <div class="feature-large-icon velocity-icon">
                                ${SVG_ICONS.wind}
                            </div>
                            <h2 class="feature-icon-title">Velocity Finder</h2>
                            <p class="feature-icon-tagline">Professional Wind Load Calculator</p>
                            ${createToggleSwitch('velocity-finder')}
                        </div>
                        
                        <div class="feature-description-card">
                            <h3 class="feature-description-title">What This Tool Does</h3>
                            <p class="feature-description-text">
                                Calculate precise wind velocities for any U.S. location based on ASCE 7-22 standards, 
                                Florida Building Code 2023, and local jurisdiction requirements. Essential for structural 
                                engineers, architects, and building professionals.
                            </p>
                            <ul class="feature-description-list">
                                <li>Enter any ZIP code, city, or address to get instant wind velocity calculations</li>
                                <li>Select from 4 Risk Categories (I-IV) based on your building type and occupancy</li>
                                <li>View ASCE 7, local jurisdiction velocities, and future climate projections</li>
                                <li>Get complete demographics, market intelligence, and county information</li>
                                <li>Click anywhere on the interactive map for instant calculations</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="feature-content-card feature-content-hidden" id="velocity-finder-content">
                        <div class="search-container">
                            <input type="text" id="location-input" class="location-input" placeholder="Enter ZIP Code, City, or Address...">
                            <button class="btn-primary" onclick="VelocityFinder.findVelocity()">
                                ${SVG_ICONS.search}
                                FIND VELOCITY
                            </button>
                        </div>
                        
                        <!-- Risk Categories -->
                        <div class="risk-categories">
                            <div class="risk-option" id="risk-category-1" onclick="VelocityFinder.selectRisk('category-1', event)">
                                <div class="risk-category-name">Category I</div>
                                <div class="risk-category-desc">Agricultural, Temporary</div>
                            </div>
                            <div class="risk-option selected" id="risk-category-2" onclick="VelocityFinder.selectRisk('category-2', event)">
                                <div class="risk-category-name">Category II</div>
                                <div class="risk-category-desc">Standard Buildings</div>
                            </div>
                            <div class="risk-option" id="risk-category-3" onclick="VelocityFinder.selectRisk('category-3', event)">
                                <div class="risk-category-name">Category III</div>
                                <div class="risk-category-desc">Schools, Hospitals</div>
                            </div>
                            <div class="risk-option" id="risk-category-4" onclick="VelocityFinder.selectRisk('category-4', event)">
                                <div class="risk-category-name">Category IV</div>
                                <div class="risk-category-desc">Essential Facilities</div>
                            </div>
                        </div>
                        
                        <!-- Results Section -->
                        <div id="velocity-results" class="velocity-results">
                            <div id="local-alert" class="local-alert" style="display: none;">
                                <span class="alert-icon">${SVG_ICONS.alert}</span>
                                <span id="alert-text"></span>
                            </div>
                            
                            <div class="results-grid">
                                <div class="result-card">
                                    <div class="result-label">ASCE 7 Velocity</div>
                                    <div class="result-value" id="asce-velocity">---</div>
                                    <div class="result-unit">mph</div>
                                </div>
                                <div class="result-card">
                                    <div class="result-label">Local Velocity</div>
                                    <div class="result-value" id="local-velocity">---</div>
                                    <div class="result-unit">mph</div>
                                </div>
                                <div class="result-card">
                                    <div class="result-label">Required Velocity</div>
                                    <div class="result-value" id="required-velocity">---</div>
                                    <div class="result-unit">mph</div>
                                </div>
                                <div class="result-card">
                                    <div class="result-label">Future Velocity</div>
                                    <div class="result-value" id="future-velocity">---</div>
                                    <div class="result-unit">mph</div>
                                </div>
                            </div>
                            
                            <div class="flex-center">
                                <button class="btn-success" onclick="VelocityFinder.exportToPDF()">
                                    ${SVG_ICONS.document}
                                    Export Report
                                </button>
                                <button class="btn-success" onclick="VelocityFinder.exportToExcel()">
                                    ${SVG_ICONS.spreadsheet}
                                    Export Data
                                </button>
                            </div>
                        </div>
                        
                        <!-- Professional Analysis Block -->
                        <div id="analysis-block" style="display: none; margin-top: 2rem;">
                            <div id="location-intelligence-card" style="display: none; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 20px; padding: 2rem; margin-bottom: 2rem; border: 2px solid rgba(59, 130, 246, 0.1);">
                                <h3 style="color: #181E57; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                    ${SVG_ICONS.location} Location Intelligence
                                </h3>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                                    <div><strong>Coordinates:</strong> <span id="location-coords">N/A</span></div>
                                    <div><strong>Timezone:</strong> <span id="location-timezone">N/A</span></div>
                                    <div><strong>County FIPS:</strong> <span id="location-fips">N/A</span></div>
                                    <div><strong>ZIP Code:</strong> <span id="location-zip">N/A</span></div>
                                </div>
                                <div id="building-code-section" style="margin-top: 1rem; display: none;">
                                    <strong>Building Code Authority:</strong> <span id="building-code-authority">N/A</span>
                                </div>
                            </div>

                            <div id="velocity-comparison-card" style="display: none; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 20px; padding: 2rem; margin-bottom: 2rem; border: 2px solid rgba(0, 24, 255, 0.1);">
                                <h3 style="color: #181E57; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                    ${SVG_ICONS.tornado} All Risk Categories <span id="velocity-card-authority-badge"></span>
                                </h3>
                                <div class="table-wrapper">
                                    <table class="results-table">
                                        <thead>
                                            <tr>
                                                <th>Risk Category</th>
                                                <th>Wind Speed</th>
                                                <th>Design Pressure</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr id="cat1-row">
                                                <td>Category I</td>
                                                <td id="cat1-velocity">N/A</td>
                                                <td id="cat1-pressure">N/A</td>
                                            </tr>
                                            <tr id="cat2-row">
                                                <td>Category II</td>
                                                <td id="cat2-velocity">N/A</td>
                                                <td id="cat2-pressure">N/A</td>
                                            </tr>
                                            <tr id="cat3-row">
                                                <td>Category III</td>
                                                <td id="cat3-velocity">N/A</td>
                                                <td id="cat3-pressure">N/A</td>
                                            </tr>
                                            <tr id="cat4-row">
                                                <td>Category IV</td>
                                                <td id="cat4-velocity">N/A</td>
                                                <td id="cat4-pressure">N/A</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div id="market-intelligence-card" style="display: none; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 20px; padding: 2rem; margin-bottom: 2rem; border: 2px solid rgba(34, 197, 94, 0.1);">
                                <h3 style="color: #181E57; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                    ${SVG_ICONS.chart} Market Intelligence
                                </h3>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                                    <div><strong>Population:</strong> <span id="market-population">N/A</span></div>
                                    <div><strong>Density:</strong> <span id="market-density">N/A</span></div>
                                    <div><strong>Market Class:</strong> <span id="market-class">N/A</span></div>
                                    <div><strong>Construction Score:</strong> <span id="construction-score">N/A</span>/100</div>
                                </div>
                                <div>
                                    <strong>Market Insights:</strong>
                                    <ul id="market-insights-list" style="margin-top: 0.5rem; padding-left: 1.5rem;"></ul>
                                </div>
                            </div>

                            <div id="county-details-card" style="display: none; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 20px; padding: 2rem; margin-bottom: 2rem; border: 2px solid rgba(168, 85, 247, 0.1);">
                                <h3 style="color: #181E57; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                    ${SVG_ICONS.building} County Information
                                </h3>
                                <div style="margin-bottom: 1rem;">
                                    <div><strong>Primary County:</strong> <span id="primary-county">N/A</span></div>
                                    <div><strong>County FIPS:</strong> <span id="primary-county-fips">N/A</span></div>
                                    <div><strong>Location:</strong> <span id="county-state">N/A</span></div>
                                </div>
                                <div id="additional-counties-section" style="display: none;">
                                    <h4 style="color: #181E57; margin-bottom: 0.5rem;">Additional Counties:</h4>
                                    <div id="additional-counties-list"></div>
                                </div>
                            </div>

                            <div id="data-quality-indicator" style="display: none; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 15px; padding: 1rem; margin-bottom: 2rem;">
                                <div id="quality-badge-text" style="color: #92400e;"></div>
                            </div>

                            <div id="multi-county-alert" style="display: none; background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%); border: 2px solid #8b5cf6; border-radius: 15px; padding: 1rem; margin-bottom: 2rem;">
                                <div style="color: #5b21b6;">
                                    <strong>${SVG_ICONS.alert} Multi-County ZIP Code:</strong> This ZIP code spans <span id="multi-county-count">N/A</span> counties.
                                    <div id="multi-county-list"></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Interactive Map -->
                        <div style="margin-top: 2rem; padding-top: 2rem; border-top: 2px solid rgba(0, 24, 255, 0.1);">
                            <div class="map-header" style="text-align: center; margin-bottom: 1.5rem;">
                                <h3 style="font-size: 1.5rem; font-weight: 700; color: #181E57; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem;">
                                    ${SVG_ICONS.map}
                                    Interactive Mapping Platform
                                </h3>
                                <p style="color: #64748b; font-size: 0.95rem;">
                                    Click anywhere on the map for instant wind velocity calculations<br>
                                    <span style="display: inline-block; margin-top: 0.5rem; padding: 0.4rem 1rem; background: linear-gradient(135deg, rgba(0, 24, 255, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%); border: 2px solid rgba(0, 24, 255, 0.3); border-radius: 20px; font-weight: 700; color: #0018ff;">
                                        Currently Using: <span id="map-risk-indicator">Category II (Standard Buildings)</span>
                                    </span>
                                </p>
                            </div>
                            
                            <div class="map-controls">
                                <button class="map-control-btn active" id="velocity-layer" onclick="VelocityFinder.toggleMapLayer('velocity')">
                                    Wind Speeds
                                </button>
                                <button class="map-control-btn" id="authorities-layer" onclick="VelocityFinder.toggleMapLayer('authorities')">
                                    Local Authorities
                                </button>
                                <button class="map-control-btn" id="hurricanes-layer" onclick="VelocityFinder.toggleMapLayer('hurricanes')">
                                    Hurricane History
                                </button>
                            </div>
                            
                            <div id="velocity-map" class="velocity-map"></div>
                            
                            <div class="wind-legend">
                                <div class="legend-title">Wind Speed (mph)</div>
                                <div class="legend-items">
                                    <div class="legend-item">
                                        <div class="legend-color" style="background: #10b981;"></div>
                                        <span>90-120 Low</span>
                                    </div>
                                    <div class="legend-item">
                                        <div class="legend-color" style="background: #f59e0b;"></div>
                                        <span>120-150 Moderate</span>
                                    </div>
                                    <div class="legend-item">
                                        <div class="legend-color" style="background: #f97316;"></div>
                                        <span>150-180 High</span>
                                    </div>
                                    <div class="legend-item">
                                        <div class="legend-color" style="background: #ef4444;"></div>
                                        <span>180+ Extreme</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                


                <!-- ================================================================
                     HURRICANE RISK INTELLIGENCE SECTION
                     ================================================================ -->
                <div id="hurricane-risk" class="feature-section">
                    <div class="feature-header-row">
                        <div class="feature-icon-card">
                            <div class="feature-large-icon hurricane-icon">
                                ${SVG_ICONS.hurricane}
                            </div>
                            <h2 class="feature-icon-title">Hurricane Risk Intelligence</h2>
                            <p class="feature-icon-tagline">AI-Powered Hurricane Analysis & Risk Assessment</p>
                            ${createToggleSwitch('hurricane-risk')}
                        </div>
                        
                        <div class="feature-description-card">
                            <h3 class="feature-description-title">What This Tool Does</h3>
                            <p class="feature-description-text">
                                Comprehensive hurricane risk analysis powered by AI, featuring 75 years of hurricane data (1950-2024), 
                                location-based risk scoring, natural language search, and predictive analytics for informed decision-making.
                            </p>
                            <ul class="feature-description-list">
                                <li>Analyze historical hurricane impacts for any ZIP code (36+ major hurricanes tracked)</li>
                                <li>AI-powered risk assessment with 0-100 scoring system</li>
                                <li>Natural language search: "Show me Category 4 hurricanes in Florida"</li>
                                <li>Interactive hurricane path animator with playback controls</li>
                                <li>Insurance cost intelligence and mitigation recommendations</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="feature-content-card feature-content-hidden" id="hurricane-risk-content">
                        <!-- ZIP Code Hurricane Risk Analyzer -->
                        <div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-radius: 20px; padding: 2rem; margin-bottom: 2rem; border: 2px solid #dc2626;">
                            <h3 style="color: #991b1b; margin-bottom: 1.5rem; text-align: center; font-size: 1.5rem; font-weight: 700;">
                                ${SVG_ICONS.location} ZIP Code Hurricane Risk Analyzer
                            </h3>
                            <div class="search-container">
                                <input type="text" 
                                       id="hurricane-zip-input" 
                                       class="location-input" 
                                       placeholder="Enter ZIP Code (e.g., 33139 for Miami Beach)..." 
                                       maxlength="5"
                                       title="Enter a 5-digit ZIP code to analyze hurricane risk">
                                <button class="btn-danger" onclick="VelocityFinder.analyzeHurricaneRisk()">
                                    ${SVG_ICONS.search}
                                    ANALYZE RISK
                                </button>
                                <button class="btn-ai" onclick="VelocityFinder.generateAIHurricaneReport()">
                                    ${SVG_ICONS.brain}
                                    REPORT
                                </button>
                            </div>
                            <div id="hurricane-risk-results"></div>
                        </div>

                        <!-- AI Natural Language Search -->
                        <div class="ai-chat-container">
                            <h3 style="color: #1d4ed8; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                ${SVG_ICONS.brain} Intelligent Hurricane Explorer
                            </h3>
                            <p style="color: #475569; margin-bottom: 1rem;">
                                Ask questions in plain English about hurricanes, risk analysis, or historical data
                            </p>
                            
                            <div style="background: white; border-radius: 10px; padding: 1rem; margin-bottom: 1rem; border: 2px solid #dbeafe;">
                                <div style="font-weight: 600; color: #1d4ed8; margin-bottom: 0.5rem; font-size: 0.9rem;">💡 Try these examples:</div>
                                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                    <button onclick="document.getElementById('hurricane-nl-search').value='Show me all Category 4 hurricanes that hit Louisiana'; VelocityFinder.processNaturalLanguageSearch();" 
                                            style="background: #eff6ff; border: 1px solid #3b82f6; color: #1e40af; padding: 0.4rem 0.8rem; border-radius: 15px; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;">
                                        Cat 4 in Louisiana
                                    </button>
                                    <button onclick="document.getElementById('hurricane-nl-search').value='What is the hurricane risk for Miami Beach?'; VelocityFinder.processNaturalLanguageSearch();" 
                                            style="background: #eff6ff; border: 1px solid #3b82f6; color: #1e40af; padding: 0.4rem 0.8rem; border-radius: 15px; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;">
                                        Miami Beach Risk
                                    </button>
                                    <button onclick="document.getElementById('hurricane-nl-search').value='Compare hurricane frequency in the 1990s vs 2020s'; VelocityFinder.processNaturalLanguageSearch();" 
                                            style="background: #eff6ff; border: 1px solid #3b82f6; color: #1e40af; padding: 0.4rem 0.8rem; border-radius: 15px; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;">
                                        1990s vs 2020s
                                    </button>
                                </div>
                            </div>
                            
                            <div id="ai-chat-messages" class="ai-chat-messages">
                                <div class="ai-message assistant">
                                    <strong>Wind Load Solutions Assistant:</strong> Hello! I can help you explore hurricane data and risk. Try asking:
                                    <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                                        <li>"Show me all Category 4 hurricanes that hit Louisiana"</li>
                                        <li>"What's the hurricane risk for Miami Beach?"</li>
                                        <li>"Compare hurricane frequency in the 1990s vs 2020s"</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="ai-chat-input-container">
                                <input type="text" id="hurricane-nl-search" class="ai-chat-input" placeholder="Ask about hurricanes in natural language...">
                                <button class="btn-ai" onclick="VelocityFinder.processNaturalLanguageSearch()">
                                    ${SVG_ICONS.search}
                                    Ask Me
                                </button>
                            </div>
                        </div>

                        <!-- Hurricane Path Animator & History -->
                        <div style="background: white; border-radius: 20px; padding: 2rem; margin-bottom: 2rem; border: 2px solid #e2e8f0;">
                            <h3 style="color: #181E57; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                ${SVG_ICONS.play} Hurricane Path Animator & History
                            </h3>
                            
                            <!-- Mode Toggle -->
                            <style>
                                .hurricane-mode-btn {
                                    padding: 0.75rem 1.5rem;
                                    border-radius: 8px;
                                    border: 2px solid #e2e8f0;
                                    font-weight: 600;
                                    cursor: pointer;
                                    transition: all 0.3s ease;
                                    display: inline-flex;
                                    align-items: center;
                                    gap: 0.5rem;
                                    font-size: 1rem;
                                }
                                
                                .hurricane-mode-btn.active {
                                    background: linear-gradient(135deg, #00ff88 0%, #00cc66 100%);
                                    color: white;
                                    border-color: #00ff88;
                                    box-shadow: 0 4px 16px rgba(0, 255, 136, 0.5);
                                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                                }
                                
                                .hurricane-mode-btn:not(.active) {
                                    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                                    color: #64748b;
                                    border-color: #cbd5e1;
                                }
                                
                                .hurricane-mode-btn:not(.active):hover {
                                    background: linear-gradient(135deg, #0018ff 0%, #181E57 100%);
                                    color: white;
                                    border-color: #0018ff;
                                    box-shadow: 0 4px 12px rgba(0, 24, 255, 0.3);
                                    transform: translateY(-2px);
                                }
                            </style>

                            <div style="display: flex; gap: 1rem; margin-bottom: 1rem; justify-content: center;">
                                <button class="hurricane-mode-btn active" id="animator-mode-btn" onclick="VelocityFinder.setHurricaneMapMode('animator')">
                                    ${SVG_ICONS.play} Animator Mode
                                </button>
                                <button class="hurricane-mode-btn" id="history-mode-btn" onclick="VelocityFinder.setHurricaneMapMode('history')">
                                    ${SVG_ICONS.map} History Mode
                                </button>
                            </div>
                            
                            <!-- Animator Controls (shown by default) -->
                            <div id="animator-controls" class="hurricane-animator-controls">
                                <select id="hurricane-select" class="hurricane-select">
                                    <option value="">Select a hurricane...</option>
                                </select>
                                <button class="btn-success" id="play-btn" onclick="VelocityFinder.playHurricaneAnimation()">
                                    ${SVG_ICONS.play}
                                    Play
                                </button>
                                <button class="btn-secondary" onclick="VelocityFinder.stopHurricaneAnimation()">
                                    ${SVG_ICONS.pause}
                                    Stop
                                </button>
                            </div>
                            
                            <!-- History Controls (hidden by default) -->
                            <div id="history-controls" style="display: none; text-align: center; margin-bottom: 1rem;">
                                <p style="color: #64748b; margin-bottom: 0.5rem;">Use the timeline slider on the map to filter hurricanes by year range (1950-2024)</p>
                            </div>
                            
                            <div id="hurricane-map" style="width: 100%; height: 500px; border-radius: 15px; border: 2px solid #e2e8f0;"></div>
                        </div>

                        <!-- Hurricane Database & Statistics -->
                        <div style="background: white; border-radius: 20px; padding: 2rem; margin-bottom: 2rem; border: 2px solid #e2e8f0;">
                            <h3 style="color: #181E57; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                                ${SVG_ICONS.chart} Hurricane Statistics Dashboard
                            </h3>
                            
                            <div class="hurricane-stats-grid">
                                <div class="hurricane-stat-card">
                                    <div class="hurricane-stat-value">${HURRICANE_DATABASE.length}</div>
                                    <div class="hurricane-stat-label">Total Hurricanes</div>
                                </div>
                                <div class="hurricane-stat-card">
                                    <div class="hurricane-stat-value">${HURRICANE_DATABASE.filter(h => h.category === 5).length}</div>
                                    <div class="hurricane-stat-label">Category 5</div>
                                </div>
                                <div class="hurricane-stat-card">
                                    <div class="hurricane-stat-value">$${(HURRICANE_DATABASE.reduce((sum, h) => sum + (h.damage || 0), 0) / 1000).toFixed(0)}B</div>
                                    <div class="hurricane-stat-label">Total Damage</div>
                                </div>
                                <div class="hurricane-stat-card">
                                    <div class="hurricane-stat-value">${HURRICANE_DATABASE.reduce((sum, h) => sum + (h.casualties || 0), 0).toLocaleString()}</div>
                                    <div class="hurricane-stat-label">Total Casualties</div>
                                </div>
                            </div>

                            <!-- Enhanced Filter Controls -->
                            <div class="form-grid" style="margin-top: 2rem;">
                                <div class="form-group">
                                    <label class="form-label">Category</label>
                                    <select id="hurricane-category-filter" class="form-select" onchange="VelocityFinder.filterHurricanes()">
                                        <option value="all">All Categories</option>
                                        <option value="5">Category 5</option>
                                        <option value="4">Category 4</option>
                                        <option value="3">Category 3</option>
                                        <option value="2">Category 2</option>
                                        <option value="1">Category 1</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Year Range</label>
                                    <select id="hurricane-year-filter" class="form-select" onchange="VelocityFinder.filterHurricanes()">
                                        <option value="all">All Years (1950-2024)</option>
                                        <option value="2020-2024">2020-2024</option>
                                        <option value="2010-2019">2010-2019</option>
                                        <option value="2000-2009">2000-2009</option>
                                        <option value="1990-1999">1990-1999</option>
                                        <option value="1980-1989">1980-1989</option>
                                        <option value="1970-1979">1970-1979</option>
                                        <option value="1950-1969">1950-1969</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Search by Name</label>
                                    <input type="text" id="hurricane-name-filter" class="form-input" placeholder="Hurricane name..." onkeyup="VelocityFinder.filterHurricanes()">
                                </div>
                            </div>

                            <!-- Hurricane List -->
                            <div id="hurricane-filtered-list" class="hurricane-list">
                                <!-- Will be populated by JavaScript -->
                            </div>

                            <div class="flex-center" style="margin-top: 1.5rem;">
                                <button class="btn-success" onclick="VelocityFinder.exportHurricaneData()">
                                    ${SVG_ICONS.download}
                                    Export Hurricane Data
                                </button>
                            </div>
                        </div>

                        <!-- Insurance & Cost Intelligence -->
                        <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 20px; padding: 2rem; border: 2px solid #10b981;">
                            <h3 style="color: #065f46; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                                ${SVG_ICONS.dollarSign} Insurance & Mitigation Intelligence
                            </h3>
                            
                            <div class="hurricane-stats-grid">
                                <div class="hurricane-stat-card">
                                    <div class="hurricane-stat-label">Typical Hurricane Deductible</div>
                                    <div class="hurricane-stat-value" style="font-size: 1.5rem;">2-5%</div>
                                    <div style="font-size: 0.85rem; color: #64748b;">of coverage amount</div>
                                </div>
                                <div class="hurricane-stat-card">
                                    <div class="hurricane-stat-label">Impact Windows ROI</div>
                                    <div class="hurricane-stat-value" style="font-size: 1.5rem;">45%</div>
                                    <div style="font-size: 0.85rem; color: #64748b;">insurance discount</div>
                                </div>
                                <div class="hurricane-stat-card">
                                    <div class="hurricane-stat-label">Roof Reinforcement</div>
                                    <div class="hurricane-stat-value" style="font-size: 1.5rem;">25%</div>
                                    <div style="font-size: 0.85rem; color: #64748b;">insurance discount</div>
                                </div>
                                <div class="hurricane-stat-card">
                                    <div class="hurricane-stat-label">Hurricane Shutters</div>
                                    <div class="hurricane-stat-value" style="font-size: 1.5rem;">$15-30</div>
                                    <div style="font-size: 0.85rem; color: #64748b;">per sq ft installed</div>
                                </div>
                            </div>

                            <div style="margin-top: 2rem;">
                                <h4 style="color: #065f46; margin-bottom: 1rem;">Mitigation Strategies</h4>
                                <ul style="color: #475569; line-height: 1.8;">
                                    <li><strong>Impact-Resistant Windows:</strong> Can reduce insurance premiums by 45% in high-risk zones</li>
                                    <li><strong>Roof Reinforcement:</strong> Hurricane straps and enhanced fastening systems (25% discount)</li>
                                    <li><strong>Permanent Storm Shutters:</strong> Protection for all openings (20% discount)</li>
                                    <li><strong>Elevated Structures:</strong> Raising structures above base flood elevation</li>
                                    <li><strong>Fortified Home Program:</strong> Comprehensive hurricane resistance certification</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>


                <!-- SOLAR SITE FINDER -->
                <div id="solar-finder" class="feature-section">
                    <div class="feature-header-row">
                        <div class="feature-icon-card">
                            <div class="feature-large-icon solar-icon">
                                ${SVG_ICONS.sun}
                            </div>
                            <h2 class="feature-icon-title">Solar Site Finder</h2>
                            <p class="feature-icon-tagline">Find Low-Wind Solar Development Sites</p>
                            ${createToggleSwitch('solar-finder')}
                        </div>
                        
                        <div class="feature-description-card">
                            <h3 class="feature-description-title">What This Tool Does</h3>
                            <p class="feature-description-text">
                                Identify optimal locations for solar panel installations by finding areas with low wind speeds. 
                                Lower wind velocities mean reduced structural requirements and installation costs for solar arrays.
                            </p>
                            <ul class="feature-description-list">
                                <li>Automatically finds locations with wind speeds under 120 mph (ideal for solar)</li>
                                <li>Filter by state to focus on your target market</li>
                                <li>View results across all Risk Categories or just your selected category</li>
                                <li>See population and market demographics for each location</li>
                                <li>Export results to CSV for further analysis and planning</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="feature-content-card feature-content-hidden" id="solar-finder-content">
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">State Filter</label>
                                <select id="solar-state-filter" class="form-select">
                                    <option value="">All States</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Max Results</label>
                                <select id="solar-max-results" class="form-select">
                                    <option value="25">25 results</option>
                                    <option value="50" selected>50 results</option>
                                    <option value="100">100 results</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">
                                    <input type="checkbox" id="solar-risk-comparison" style="margin-right: 0.5rem;">
                                    Show All Risk Categories
                                </label>
                            </div>
                        </div>
                        <div class="text-center">
                            <button class="btn-primary" onclick="VelocityFinder.findSolarSites()" id="solar-find-btn">
                                ${SVG_ICONS.search}
                                Find Solar Sites
                            </button>
                        </div>
                        <div id="solar-results-container" style="display: none; margin-top: 2rem;"></div>
                    </div>
                </div>

                <!-- ADVANCED SEARCH -->
                <div id="advanced-search" class="feature-section">
                    <div class="feature-header-row">
                        <div class="feature-icon-card">
                            <div class="feature-large-icon filter-icon">
                                ${SVG_ICONS.filter}
                            </div>
                            <h2 class="feature-icon-title">Advanced Search</h2>
                            <p class="feature-icon-tagline">Complex Multi-Criteria Filtering</p>
                            ${createToggleSwitch('advanced-search')}
                        </div>
                        
                        <div class="feature-description-card">
                            <h3 class="feature-description-title">What This Tool Does</h3>
                            <p class="feature-description-text">
                                Perform sophisticated searches across our entire database using multiple criteria simultaneously. 
                                Perfect for finding specific markets that match your exact project requirements.
                            </p>
                            <ul class="feature-description-list">
                                <li>Filter by wind speed ranges to find suitable construction zones</li>
                                <li>Set population and density thresholds to target specific markets</li>
                                <li>Combine multiple filters for precise market identification</li>
                                <li>Search by state to focus on specific geographic regions</li>
                                <li>Export filtered results for business development and planning</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="feature-content-card feature-content-hidden" id="advanced-search-content">
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">Risk Category</label>
                                <select id="filter-risk-category" class="form-select">
                                    <option value="category-1">Category I</option>
                                    <option value="category-2" selected>Category II</option>
                                    <option value="category-3">Category III</option>
                                    <option value="category-4">Category IV</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Min Wind Speed (mph)</label>
                                <input type="number" id="filter-wind-min" class="form-input" placeholder="90">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Max Wind Speed (mph)</label>
                                <input type="number" id="filter-wind-max" class="form-input" placeholder="200">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Min Population</label>
                                <input type="text" id="filter-pop-min" class="form-input" placeholder="1,000">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Max Population</label>
                                <input type="text" id="filter-pop-max" class="form-input" placeholder="100,000">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Min Density (per sq mi)</label>
                                <input type="text" id="filter-density-min" class="form-input" placeholder="50">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Max Density (per sq mi)</label>
                                <input type="text" id="filter-density-max" class="form-input" placeholder="2,000">
                            </div>
                            <div class="form-group">
                                <label class="form-label">State</label>
                                <select id="filter-state" class="form-select">
                                    <option value="">All States</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Max Results</label>
                                <select id="filter-max-results" class="form-select">
                                    <option value="50">50 results</option>
                                    <option value="100" selected>100 results</option>
                                    <option value="200">200 results</option>
                                </select>
                            </div>
                        </div>
                        <div class="flex-center">
                            <button class="btn-primary" onclick="VelocityFinder.applyAdvancedFilters()" id="filter-apply-btn">
                                ${SVG_ICONS.search}
                                Apply Filters
                            </button>
                            <button class="btn-secondary" onclick="VelocityFinder.clearFilters()">
                                ${SVG_ICONS.trash}
                                Clear Filters
                            </button>
                        </div>
                        <div id="filter-results-container" style="display: none; margin-top: 2rem;"></div>
                    </div>
                </div>

                <!-- MULTI-ZIP COMPARISON -->
                <div id="multi-compare" class="feature-section">
                    <div class="feature-header-row">
                        <div class="feature-icon-card">
                            <div class="feature-large-icon compare-icon">
                                ${SVG_ICONS.chart}
                            </div>
                            <h2 class="feature-icon-title">Multi-ZIP Compare</h2>
                            <p class="feature-icon-tagline">Side-by-Side Location Analysis</p>
                            ${createToggleSwitch('multi-compare')}
                        </div>
                        
                        <div class="feature-description-card">
                            <h3 class="feature-description-title">What This Tool Does</h3>
                            <p class="feature-description-text">
                                Compare wind velocities, demographics, and market conditions across multiple ZIP codes 
                                simultaneously. Essential for evaluating competing project locations.
                            </p>
                            <ul class="feature-description-list">
                                <li>Add up to 10 ZIP codes for comprehensive side-by-side comparison</li>
                                <li>Compare wind speeds, design pressures, and local requirements</li>
                                <li>View population, density, and market metrics for each location</li>
                                <li>Identify the best location based on your specific criteria</li>
                                <li>Export comparison table for presentations and reports</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="feature-content-card feature-content-hidden" id="multi-compare-content">
                        <div style="max-width: 500px; margin: 0 auto 2rem;">
                            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                                <input type="text" id="compare-zip-input" class="form-input" placeholder="Enter ZIP code" maxlength="5">
                                <button class="btn-primary" onclick="VelocityFinder.addZIPToComparison()">
                                    ${SVG_ICONS.plus}
                                    Add
                                </button>
                            </div>
                            <p style="text-align: center; color: #64748b; font-size: 0.9rem;">
                                Add up to 10 ZIP codes for side-by-side comparison
                            </p>
                        </div>
                        <div id="comparison-list">
                            <div class="empty-state">
                                No ZIP codes added yet. Enter a ZIP code above to start comparison.
                            </div>
                        </div>
                        <div id="comparison-table-container" style="display: none; margin-top: 2rem;"></div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    // ================================================================
    // NEW: TOGGLE FEATURE SECTION FUNCTION (WITH MAP FIX)
    // ================================================================
    function toggleFeatureSection(sectionId, shouldOpen) {
        const contentId = `${sectionId}-content`;
        const content = document.getElementById(contentId);
        const toggle = document.getElementById(`${sectionId}-toggle`);
        
        if (!content) return;
        
        if (shouldOpen) {
            // Close all other sections first
            const allSections = ['velocity-finder', 'hurricane-risk', 'solar-finder', 'advanced-search', 'multi-compare'];
            allSections.forEach(id => {
                if (id !== sectionId) {
                    const otherContent = document.getElementById(`${id}-content`);
                    const otherToggle = document.getElementById(`${id}-toggle`);
                    
                    if (otherContent) {
                        otherContent.classList.add('feature-content-hidden');
                    }
                    if (otherToggle) {
                        otherToggle.checked = false;
                    }
                }
            });
            
            // Open this section
            content.classList.remove('feature-content-hidden');
            if (toggle) toggle.checked = true;
            state.openSection = sectionId;
            
            // FIX: Initialize or resize maps after section becomes visible
            setTimeout(() => {
                if (sectionId === 'velocity-finder') {
                    if (!state.map && document.getElementById('velocity-map') && typeof L !== 'undefined') {
                        // Lazy initialize if not done yet
                        try {
                            state.map = L.map('velocity-map').setView([39.8283, -98.5795], 4);
                            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
                                attribution: '© OpenStreetMap contributors', 
                                maxZoom: 18 
                            }).addTo(state.map);
                            
                            state.map.on('click', function(e) { 
                                findVelocityByCoordinates(e.latlng.lat, e.latlng.lng); 
                            });
                            
                            state.layerGroups = {
                                velocity: L.layerGroup().addTo(state.map),
                                authorities: L.layerGroup(),
                                terrain: L.layerGroup()
                            };
                            
                            addVelocityZones();
                            
                            // NOW add CSV markers after map is initialized
                            if (state.csvLoaded) {
                                addCSVSampleMarkers();
                            }
                            
                            console.log('✅ Velocity map lazy initialized');
                        } catch (error) {
                            console.error('Map initialization error:', error);
                        }
                    } else if (state.map) {
                        state.map.invalidateSize();
                        console.log('✅ Velocity map resized');
                    }
                }
                
                if (sectionId === 'hurricane-risk') {
                    if (!state.hurricaneMap && document.getElementById('hurricane-map') && typeof L !== 'undefined') {
                        // Lazy initialize if not done yet
                        try {
                            state.hurricaneMap = L.map('hurricane-map').setView([30, -90], 4);
                            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                attribution: '© OpenStreetMap contributors',
                                maxZoom: 18
                            }).addTo(state.hurricaneMap);
                            console.log('✅ Hurricane map lazy initialized');
                        } catch (error) {
                            console.error('Hurricane map initialization error:', error);
                        }
                    } else if (state.hurricaneMap) {
                        state.hurricaneMap.invalidateSize();
                        console.log('✅ Hurricane map resized');
                    }
                }
            }, 100);
            
            // Smooth scroll to section
            setTimeout(() => {
                scrollToSection(sectionId);
            }, 150);
        } else {
            // Close this section
            content.classList.add('feature-content-hidden');
            if (toggle) toggle.checked = false;
            state.openSection = null;
        }
    }

    // ================================================================
    // UTILITY FUNCTIONS (PRESERVED)
    // ================================================================
    const Utils = {
        sanitizeHTML(str) {
            if (!str) return '';
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },

        formatNumberWithCommas(num) {
            if (!num) return '';
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },

        removeCommas(str) {
            return str.replace(/,/g, '');
        },

        validateZIPCode(zip) {
            zip = zip.trim();
            if (!/^\d{5}$/.test(zip)) {
                return { valid: false, error: 'ZIP code must be exactly 5 digits' };
            }
            const invalidZIPs = ['00000', '99999'];
            if (invalidZIPs.includes(zip)) {
                return { valid: false, error: 'Invalid ZIP code' };
            }
            return { valid: true, zip: zip };
        },

        debounce(fn, delay) {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => fn(...args), delay);
            };
        },

        calculatePressure(velocity) {
            if (!velocity || velocity === 'N/A') return 'N/A';
            return Math.round(
                WIND_PRESSURE_CONSTANTS.VELOCITY_PRESSURE_COEFFICIENT * 
                Math.pow(velocity, 2) * 
                WIND_PRESSURE_CONSTANTS.CC_PRESSURE_COEFFICIENT
            );
        },

        getRiskCategoryName(category) {
            const names = {
                'category-1': 'Category I (Agricultural, Temporary)',
                'category-2': 'Category II (Standard Buildings)',
                'category-3': 'Category III (Schools, Hospitals)',
                'category-4': 'Category IV (Essential Facilities)'
            };
            return names[category] || 'Unknown';
        },

        calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 3959; // Earth radius in miles
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        }
    };

    // ================================================================
    // NOTIFICATION SYSTEM (PRESERVED)
    // ================================================================
    const Notifications = {
        show(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <span class="notification-message">${Utils.sanitizeHTML(message)}</span>
                    <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.style.opacity = '0';
                    setTimeout(() => {
                        if (notification.parentElement) {
                            notification.remove();
                        }
                    }, 300);
                }
            }, 5000);
        }
    };

    // ================================================================
    // LOADING OVERLAY (PRESERVED)
    // ================================================================
    const LoadingOverlay = {
        show(message = 'Loading...') {
            this.hide();
            const overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-spinner"></div>
                <p>${Utils.sanitizeHTML(message)}</p>
            `;
            document.body.appendChild(overlay);
        },

        hide() {
            const overlay = document.getElementById('loading-overlay');
            if (overlay) overlay.remove();
        },

        update(message) {
            const overlay = document.getElementById('loading-overlay');
            if (overlay) {
                const p = overlay.querySelector('p');
                if (p) p.textContent = message;
            }
        }
    };

    // ================================================================
    // HURRICANE RISK ANALYSIS FUNCTIONS (PRESERVED)
    // ================================================================

    /**
     * Calculate hurricane risk score for a location (0-100)
     */
    function calculateHurricaneRiskScore(lat, lng, hurricanes) {
        const radius = 50; // miles
        const nearbyHurricanes = hurricanes.filter(hurricane => {
            return hurricane.path.some(point => {
                const distance = Utils.calculateDistance(lat, lng, point[0], point[1]);
                return distance <= radius;
            });
        });

        if (nearbyHurricanes.length === 0) {
            return { score: 0, classification: 'MINIMAL RISK', color: '#10b981', nearbyHurricanes: [] };
        }

        // Score calculation factors
        let score = 0;
        
        // Factor 1: Frequency (0-40 points)
        score += Math.min(nearbyHurricanes.length * 3, 40);
        
        // Factor 2: Category strength (0-30 points)
        const avgCategory = nearbyHurricanes.reduce((sum, h) => sum + h.category, 0) / nearbyHurricanes.length;
        score += avgCategory * 6;
        
        // Factor 3: Recency (0-20 points)
        const recentHurricanes = nearbyHurricanes.filter(h => h.year >= 2014);
        score += Math.min(recentHurricanes.length * 4, 20);
        
        // Factor 4: Proximity to track (0-10 points)
        const closestDistance = Math.min(...nearbyHurricanes.flatMap(h => 
            h.path.map(point => Utils.calculateDistance(lat, lng, point[0], point[1]))
        ));
        score += Math.max(0, 10 - closestDistance / 5);

        score = Math.min(100, Math.round(score));

        // Classify risk
        let classification, color;
        if (score >= 80) {
            classification = 'EXTREME RISK';
            color = '#7f1d1d';
        } else if (score >= 60) {
            classification = 'HIGH RISK';
            color = '#dc2626';
        } else if (score >= 40) {
            classification = 'MODERATE RISK';
            color = '#f59e0b';
        } else if (score >= 20) {
            classification = 'LOW RISK';
            color = '#eab308';
        } else {
            classification = 'MINIMAL RISK';
            color = '#10b981';
        }

        return { score, classification, color, nearbyHurricanes };
    }

    /**
     * Analyze hurricane risk for a ZIP code
     */
    async function analyzeHurricaneRisk() {
        // TRIAL CHECK - Free Trial Rate Limiting (MANDATORY)
        console.log('🔍 analyzeHurricaneRisk: Checking trial status...');
        
        if (typeof TrialManager === 'undefined') {
            console.error('❌ CRITICAL: TrialManager not loaded! Trial protection disabled!');
            alert('Error: Trial system failed to load. Please refresh the page.');
            return;
        }
        
        const lookupCheck = TrialManager.canPerformLookup();
        console.log('🔍 analyzeHurricaneRisk: Lookup check result:', lookupCheck);
        
        if (!lookupCheck.allowed) {
            console.log('🚫 analyzeHurricaneRisk: Lookup blocked - showing upgrade modal');
            showUpgradeModal(lookupCheck.message);
            return;
        }
        
        console.log('✅ analyzeHurricaneRisk: Lookup allowed - proceeding...');
        
        const input = document.getElementById('hurricane-zip-input');
        if (!input) return;

        const zip = input.value.trim();
        const validation = Utils.validateZIPCode(zip);

        if (!validation.valid) {
            Notifications.show(validation.error, 'warning');
            return;
        }

        if (!state.csvLoaded) {
            Notifications.show('Data is still loading. Please try again.', 'warning');
            return;
        }

        const zipData = state.csvVelocityData[validation.zip];
        if (!zipData) {
            Notifications.show(`ZIP code ${validation.zip} not found in database`, 'error');
            return;
        }

        LoadingOverlay.show('Analyzing hurricane risk...');

        setTimeout(() => {
            const riskAnalysis = calculateHurricaneRiskScore(zipData.lat, zipData.lng, HURRICANE_DATABASE);
            state.hurricaneRiskResults = { zip: validation.zip, zipData, riskAnalysis };

            displayHurricaneRiskResults(validation.zip, zipData, riskAnalysis);            
            // TRIAL - Record successful lookup (MANDATORY)
            if (typeof TrialManager !== 'undefined') {
                TrialManager.recordLookup('hurricane_risk', validation.zip);
                console.log('📝 Recorded hurricane risk lookup');
            } else {
                console.error('❌ Cannot record lookup - TrialManager missing!');
            }

            LoadingOverlay.hide();
        }, 500);
    }

    /**
     * Display hurricane risk results
     */
    function displayHurricaneRiskResults(zip, zipData, riskAnalysis) {
        const container = document.getElementById('hurricane-risk-results');
        if (!container) return;

        const { score, classification, color, nearbyHurricanes } = riskAnalysis;

        let html = `
            <div class="hurricane-risk-score" style="background: linear-gradient(135deg, ${color}22 0%, ${color}44 100%); border-color: ${color};">
                <div class="risk-score-label">${classification}</div>
                <div class="risk-score-value" style="color: ${color};">${score}</div>
                <div class="risk-score-description">Hurricane Risk Score for ${zipData.city}, ${zipData.state_name} (${zip})</div>
            </div>

            <div class="hurricane-stats-grid">
                <div class="hurricane-stat-card">
                    <div class="hurricane-stat-value">${nearbyHurricanes.length}</div>
                    <div class="hurricane-stat-label">Hurricanes (50mi)</div>
                </div>
                <div class="hurricane-stat-card">
                    <div class="hurricane-stat-value">${nearbyHurricanes.filter(h => h.category >= 4).length}</div>
                    <div class="hurricane-stat-label">Category 4+</div>
                </div>
                <div class="hurricane-stat-card">
                    <div class="hurricane-stat-value">${nearbyHurricanes.length > 0 ? nearbyHurricanes[nearbyHurricanes.length - 1].year : 'Never'}</div>
                    <div class="hurricane-stat-label">Last Impact</div>
                </div>
                <div class="hurricane-stat-card">
                    <div class="hurricane-stat-value">${nearbyHurricanes.filter(h => h.year >= 2000).length}</div>
                    <div class="hurricane-stat-label">Since 2000</div>
                </div>
            </div>
        `;

        if (nearbyHurricanes.length > 0) {
            html += `
                <div style="margin-top: 2rem;">
                    <h4 style="color: #181E57; margin-bottom: 1rem;">Historical Hurricanes (within 50 miles)</h4>
                    <div class="hurricane-list">
            `;

            // Sort by year (most recent first)
            const sortedHurricanes = [...nearbyHurricanes].sort((a, b) => b.year - a.year);
            
            sortedHurricanes.slice(0, 10).forEach(hurricane => {
                const categoryClass = `cat-${hurricane.category}`;
                html += `
                    <div class="hurricane-list-item" onclick="VelocityFinder.showHurricaneDetails('${hurricane.name}')">
                        <div>
                            <span class="hurricane-name">${hurricane.name}</span>
                            <span class="hurricane-category-badge ${categoryClass}">CAT ${hurricane.category}</span>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 0.9rem; color: #64748b;">
                                Landfall: ${hurricane.landfall}<br>
                                Damage: $${hurricane.damage?.toLocaleString() || 'N/A'}M
                            </div>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        } else {
            html += `
                <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 15px; padding: 2rem; margin-top: 2rem; text-align: center; border: 2px solid #10b981;">
                    <h3 style="color: #065f46; margin-bottom: 0.5rem;">✓ No Historical Hurricane Impacts</h3>
                    <p style="color: #047857;">This location has no recorded hurricane impacts within 50 miles since 1950.</p>
                </div>
            `;
        }

        container.innerHTML = html;
        container.style.display = 'block';
    }

    /**
     * Generate AI-powered hurricane risk report
     */
    async function generateAIHurricaneReport() {
        if (!state.hurricaneRiskResults) {
            Notifications.show('Please analyze a ZIP code first', 'warning');
            return;
        }

        LoadingOverlay.show('Generating risk report...');

        const { zip, zipData, riskAnalysis } = state.hurricaneRiskResults;
        const { score, classification, nearbyHurricanes } = riskAnalysis;

        // Generate static report based on analysis
        setTimeout(() => {
            const report = `HURRICANE RISK ASSESSMENT REPORT

EXECUTIVE SUMMARY
Based on comprehensive historical analysis, this location presents a ${classification.toLowerCase()} profile with ${nearbyHurricanes.length} recorded hurricane impacts within 50 miles since 1950. The current risk score of ${score}/100 indicates ${score >= 60 ? 'elevated' : 'moderate'} vulnerability requiring enhanced construction standards and insurance coverage.

HISTORICAL RISK ANALYSIS
This region has experienced ${nearbyHurricanes.length} hurricanes over the 75-year period from 1950-2024. ${nearbyHurricanes.filter(h => h.category >= 4).length > 0 ? `Notably, ${nearbyHurricanes.filter(h => h.category >= 4).length} major hurricanes (Category 4+) have impacted the area,` : 'No Category 4 or 5 hurricanes have directly impacted this location,'} indicating ${score >= 60 ? 'significant' : 'moderate'} historical vulnerability.

BUILDING CODE IMPLICATIONS
Current ASCE 7-22 wind velocity requirements: ${zipData.velocity_risk_cat_2} mph
${score >= 60 ? '⚠️ Enhanced structural requirements recommended due to elevated risk' : '✓ Standard wind load calculations apply'}
${classification === 'EXTREME RISK' ? 'Consider additional safety factors beyond code minimum' : 'Meet or exceed all applicable code requirements'}

INSURANCE CONSIDERATIONS
- Hurricane deductible: ${score >= 60 ? '5%' : '2-3%'} of coverage amount typical
- Premium surcharges: ${score >= 80 ? 'Significant' : score >= 60 ? 'Moderate' : 'Minimal'} hurricane loading expected
- Coverage availability: ${score >= 80 ? 'May require surplus lines market' : 'Standard market available'}

MITIGATION RECOMMENDATIONS
${score >= 80 ? 
'1. Impact-resistant windows and doors (MANDATORY)\n2. Enhanced roof attachment systems (hurricane straps)\n3. Continuous load path from roof to foundation\n4. Permanent storm protection for all openings\n5. Elevated structures above base flood elevation' :
score >= 60 ?
'1. Impact-resistant windows recommended\n2. Hurricane straps for roof attachment\n3. Storm shutters for critical openings\n4. Regular maintenance of roof and exterior\n5. Comprehensive emergency plan' :
'1. Standard wind-resistant construction\n2. Consider optional hurricane shutters\n3. Maintain good building envelope integrity\n4. Basic emergency preparedness plan\n5. Annual property inspections'}

CONSTRUCTION REQUIREMENTS
Follow all ASCE 7-22 and local jurisdiction requirements for wind-resistant design
${classification === 'EXTREME RISK' ? 'Recommend engaging structural engineer with hurricane design experience' : 'Standard engineering practices apply'}
Ensure all contractors are experienced with hurricane-resistant construction methods

---
Report generated by Hurricane Risk Intelligence • ${new Date().toLocaleDateString()}
Location: ${zipData.city}, ${zipData.state_name} (ZIP ${zip})`;

            showAIReport(report);
            LoadingOverlay.hide();
        }, 500);
    }

    /**
     * Show AI-generated report in modal/overlay
     */
    function showAIReport(reportText) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 30000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 2rem;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        `;

        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="color: #181E57; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                    ${SVG_ICONS.brain} AI Hurricane Risk Report
                </h2>
                <button onclick="this.closest('[style*=\\'position: fixed\\']').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b;">×</button>
            </div>
            <div style="white-space: pre-wrap; line-height: 1.8; color: #374151;">
                ${Utils.sanitizeHTML(reportText)}
            </div>
            <div style="margin-top: 2rem; text-align: center;">
                <button class="btn-success" onclick="VelocityFinder.downloadReport(\`${reportText.replace(/`/g, '\\`')}\`)">
                    ${SVG_ICONS.download}
                    Download Report
                </button>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);
    }

    /**
     * Download REPORT as text file
     */
    function downloadReport(reportText) {
        const blob = new Blob([reportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hurricane-risk-report-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        Notifications.show('Report downloaded successfully', 'success');
    }

    /**
     * Filter hurricanes based on UI controls
     */
    function filterHurricanes() {
        // TRIAL CHECK - Free Trial Rate Limiting (MANDATORY)
        console.log('🔍 filterHurricanes: Checking trial status...');
        
        if (typeof TrialManager === 'undefined') {
            console.error('❌ CRITICAL: TrialManager not loaded!');
            alert('Error: Trial system failed to load. Please refresh the page.');
            return;
        }
        
        const lookupCheck = TrialManager.canPerformLookup();
        console.log('🔍 filterHurricanes: Lookup check result:', lookupCheck);
        
        if (!lookupCheck.allowed) {
            console.log('🚫 filterHurricanes: Lookup blocked');
            showUpgradeModal(lookupCheck.message);
            return;
        }
        
        console.log('✅ filterHurricanes: Lookup allowed - proceeding...');
        
        const categoryFilter = document.getElementById('hurricane-category-filter')?.value || 'all';
        const yearFilter = document.getElementById('hurricane-year-filter')?.value || 'all';
        const nameFilter = document.getElementById('hurricane-name-filter')?.value.toLowerCase() || '';

        let filtered = HURRICANE_DATABASE;

        // Category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(h => h.category === parseInt(categoryFilter));
        }

        // Year filter
        if (yearFilter !== 'all') {
            const [startYear, endYear] = yearFilter.split('-').map(Number);
            filtered = filtered.filter(h => h.year >= startYear && h.year <= endYear);
        }

        // Name filter
        if (nameFilter) {
            filtered = filtered.filter(h => h.name.toLowerCase().includes(nameFilter));
        }

        // Display filtered results
        displayFilteredHurricanes(filtered);
    }

    /**
     * Display filtered hurricane list
     */
    function displayFilteredHurricanes(hurricanes) {
        const container = document.getElementById('hurricane-filtered-list');
        if (!container) return;

        if (hurricanes.length === 0) {
            container.innerHTML = '<div class="empty-state">No hurricanes match your filters</div>';
            return;
        }

        let html = '';
        hurricanes.forEach(hurricane => {
            const categoryClass = `cat-${hurricane.category}`;
            html += `
                <div class="hurricane-list-item" onclick="VelocityFinder.showHurricaneDetails('${hurricane.name}')">
                    <div>
                        <span class="hurricane-name">${hurricane.name}</span>
                        <span class="hurricane-category-badge ${categoryClass}">CAT ${hurricane.category}</span>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 0.9rem; color: #64748b;">
                            Year: ${hurricane.year}<br>
                            Landfall: ${hurricane.landfall}
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    /**
     * Show detailed hurricane information
     */
    function showHurricaneDetails(hurricaneName) {
        // TRIAL CHECK - Free Trial Rate Limiting (MANDATORY)
        console.log('🔍 showHurricaneDetails: Checking trial status...');
        
        if (typeof TrialManager === 'undefined') {
            console.error('❌ CRITICAL: TrialManager not loaded!');
            alert('Error: Trial system failed to load. Please refresh the page.');
            return;
        }
        
        const lookupCheck = TrialManager.canPerformLookup();
        console.log('🔍 showHurricaneDetails: Lookup check result:', lookupCheck);
        
        if (!lookupCheck.allowed) {
            console.log('🚫 showHurricaneDetails: Lookup blocked');
            showUpgradeModal(lookupCheck.message);
            return;
        }
        
        console.log('✅ showHurricaneDetails: Lookup allowed - proceeding...');
        
        const hurricane = HURRICANE_DATABASE.find(h => h.name === hurricaneName);
        if (!hurricane) return;

        const categoryClass = `cat-${hurricane.category}`;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 30000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 2rem;
            max-width: 600px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        `;

        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="color: #181E57; margin: 0;">${hurricane.name}</h2>
                <button onclick="this.closest('[style*=\\'position: fixed\\']').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b;">×</button>
            </div>
            
            <div style="text-align: center; margin-bottom: 2rem;">
                <span class="hurricane-category-badge ${categoryClass}" style="font-size: 1rem; padding: 0.5rem 1rem;">
                    CATEGORY ${hurricane.category}
                </span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                <div><strong>Year:</strong> ${hurricane.year}</div>
                <div><strong>Landfall:</strong> ${hurricane.landfall}</div>
                <div><strong>Damage:</strong> $${hurricane.damage?.toLocaleString() || 'N/A'}M</div>
                <div><strong>Casualties:</strong> ${hurricane.casualties?.toLocaleString() || 'N/A'}</div>
            </div>

            <div style="margin-bottom: 1rem;">
                <strong>Affected States:</strong>
                <div style="margin-top: 0.5rem;">
                    ${hurricane.states.map(state => `<span style="display: inline-block; background: #e2e8f0; padding: 0.25rem 0.75rem; border-radius: 12px; margin: 0.25rem; font-size: 0.85rem;">${state}</span>`).join('')}
                </div>
            </div>

            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn-primary" onclick="VelocityFinder.animateSpecificHurricane('${hurricane.name}'); this.closest('[style*=\\'position: fixed\\']').remove();">
                    ${SVG_ICONS.play}
                    View Track on Map
                </button>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);
    }

    /**
     * Initialize hurricane path animator
     */
    function initializeHurricaneAnimator() {
        // Populate hurricane selector
        const select = document.getElementById('hurricane-select');
        if (!select) return;

        HURRICANE_DATABASE.forEach(hurricane => {
            const option = document.createElement('option');
            option.value = hurricane.name;
            option.textContent = `${hurricane.name} (${hurricane.year}) - Cat ${hurricane.category}`;
            select.appendChild(option);
        });

        // Initialize hurricane map
        if (document.getElementById('hurricane-map') && typeof L !== 'undefined') {
            try {
                state.hurricaneMap = L.map('hurricane-map').setView([30, -90], 4);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 18
                }).addTo(state.hurricaneMap);
                console.log('✅ Hurricane map initialized');
            } catch (error) {
                console.warn('⚠️ Hurricane map initialization delayed (container may be hidden)');
                // Map will be initialized when section opens
            }
        }
    }

    /**
     * Set hurricane map mode (animator or history)
     */
    function setHurricaneMapMode(mode) {
        const animatorBtn = document.getElementById('animator-mode-btn');
        const historyBtn = document.getElementById('history-mode-btn');
        const animatorControls = document.getElementById('animator-controls');
        const historyControls = document.getElementById('history-controls');
        
        if (mode === 'animator') {
            // Switch to animator mode
            if (animatorBtn) {
                animatorBtn.className = 'hurricane-mode-btn active';
            }
            if (historyBtn) {
                historyBtn.className = 'hurricane-mode-btn';
            }
            if (animatorControls) animatorControls.style.display = 'flex';
            if (historyControls) historyControls.style.display = 'none';
            
            // Clear hurricane history layer
            if (state.hurricaneMap && state.hurricaneTimelineControl) {
                state.hurricaneMap.removeControl(state.hurricaneTimelineControl);
                state.hurricaneTimelineControl = null;
            }
            
            // Clear all hurricane layers
            if (state.hurricaneMap) {
                state.hurricaneMap.eachLayer(layer => {
                    if (layer instanceof L.Polyline || layer instanceof L.Marker) {
                        state.hurricaneMap.removeLayer(layer);
                    }
                });
            }
        } else if (mode === 'history') {
            console.log('🌀 Switching to History mode...');

            // Switch to history mode
            if (animatorBtn) {
                animatorBtn.className = 'hurricane-mode-btn';
            }
            if (historyBtn) {
                historyBtn.className = 'hurricane-mode-btn active';
            }
            if (animatorControls) animatorControls.style.display = 'none';
            if (historyControls) historyControls.style.display = 'block';

            // Stop any running animation
            if (state.hurricaneAnimator) {
                state.hurricaneAnimator.isPlaying = false;
            }

            // FORCE initialize hurricane map if not done yet
            if (!state.hurricaneMap && document.getElementById('hurricane-map') && typeof L !== 'undefined') {
                console.log('🗺️ Lazy initializing hurricane map for History mode...');
                try {
                    state.hurricaneMap = L.map('hurricane-map').setView([30, -90], 4);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors',
                        maxZoom: 18
                    }).addTo(state.hurricaneMap);
                    console.log('✅ Hurricane map initialized for History mode');
                } catch (error) {
                    console.error('❌ Failed to initialize hurricane map:', error);
                    Notifications.show('Failed to initialize map. Please refresh the page.', 'error');
                    return;
                }
            }

            // Clear existing layers
            if (state.hurricaneMap) {
                state.hurricaneMap.eachLayer(layer => {
                    if (layer instanceof L.Polyline || layer instanceof L.Marker) {
                        state.hurricaneMap.removeLayer(layer);
                    }
                });
            }

            // Add hurricane history layer
            addHurricaneHistoryLayer();
        }
    }

    /**
     * Add hurricane history layer with timeline slider
     */
    function addHurricaneHistoryLayer() {
        console.log('🌀 addHurricaneHistoryLayer called');
        console.log('🗺️ state.hurricaneMap:', state.hurricaneMap ? 'EXISTS' : 'NULL');
        console.log('📊 HURRICANE_DATABASE length:', HURRICANE_DATABASE ? HURRICANE_DATABASE.length : 'UNDEFINED');

        if (!state.hurricaneMap) {
            console.error('❌ Hurricane map not initialized - cannot add history layer');
            Notifications.show('Map not ready. Please try again.', 'error');
            return;
        }

        if (!HURRICANE_DATABASE || HURRICANE_DATABASE.length === 0) {
            console.error('❌ HURRICANE_DATABASE is empty or undefined');
            Notifications.show('Hurricane data not loaded.', 'error');
            return;
        }

        // Store hurricane track layers
        if (!state.hurricaneHistoryLayers) {
            state.hurricaneHistoryLayers = {};
        }

        // Function to display hurricanes within selected year range
        function displayHurricanesInRange(startYear, endYear) {
            console.log(`🌀 Displaying hurricanes from ${startYear} to ${endYear}`);
            // Clear existing hurricane tracks
            Object.values(state.hurricaneHistoryLayers).forEach(trackGroup => {
                state.hurricaneMap.removeLayer(trackGroup);
            });
            state.hurricaneHistoryLayers = {};
            
            // Filter and display hurricanes within the selected year range
            const selectedHurricanes = HURRICANE_DATABASE.filter(hurricane => 
                hurricane.year >= startYear && hurricane.year <= endYear
            );
            
            selectedHurricanes.forEach(hurricane => {
                const trackGroup = L.layerGroup();
                
                const polyline = L.polyline(hurricane.path, {
                    color: hurricane.color,
                    weight: 4,
                    opacity: 0.8
                }).addTo(trackGroup);
                
                polyline.bindPopup(`
                    <div style="background: white; padding: 1rem; border-radius: 12px; min-width: 250px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                        <div style="font-size: 1.25rem; font-weight: 700; color: #181E57; margin-bottom: 0.5rem;">
                            ${hurricane.name}
                        </div>
                        <div style="background: ${hurricane.color}; color: white; display: inline-block; padding: 0.25rem 0.75rem; border-radius: 6px; font-weight: 600; margin-bottom: 0.75rem;">
                            Category ${hurricane.category}
                        </div>
                        <div style="color: #64748b; font-size: 0.95rem; line-height: 1.6;">
                            <strong style="color: #181E57;">Max Wind Speed:</strong> ${hurricane.windSpeed} mph<br>
                            <strong style="color: #181E57;">Year:</strong> ${hurricane.year}<br>
                            <strong style="color: #181E57;">Landfall:</strong> ${hurricane.landfall}<br>
                            <strong style="color: #181E57;">Damage:</strong> $${hurricane.damage ? hurricane.damage.toLocaleString() : 'N/A'}M
                        </div>
                    </div>
                `, {
                    maxWidth: 300,
                    className: 'hurricane-popup'
                });
                
                // Add start point marker
                L.marker(hurricane.path[0], {
                    icon: L.divIcon({
                        className: 'hurricane-marker',
                        html: '🌀',
                        iconSize: [25, 25]
                    })
                }).addTo(trackGroup)
                .bindPopup(`
                    <div class="velocity-popup">
                        <div class="popup-title">${hurricane.name}</div>
                        <div class="popup-velocity">Landfall Point</div>
                        <div class="popup-details">
                            <strong>Year:</strong> ${hurricane.year}<br>
                            <strong>Category:</strong> ${hurricane.category}<br>
                            <strong>Casualties:</strong> ${hurricane.casualties || 'N/A'}
                        </div>
                    </div>
                `, {
                    maxWidth: 300,
                    className: 'hurricane-popup'
                });
                
                state.hurricaneHistoryLayers[hurricane.name] = trackGroup;
                trackGroup.addTo(state.hurricaneMap);
            });
        }
        
        // Display initial range (2015-2024)
        displayHurricanesInRange(2015, 2024);
        
        // Add functional dual-range slider
        if (!state.hurricaneTimelineControl) {
            state.hurricaneTimelineControl = L.control({ position: 'bottomleft' });
            state.hurricaneTimelineControl.onAdd = function(map) {
                const div = L.DomUtil.create('div', 'hurricane-timeline');
                div.innerHTML = `
                    <div style="background: rgba(255,255,255,0.95); padding: 15px; border-radius: 8px; border: 2px solid #dc2626; backdrop-filter: blur(10px); min-width: 320px;">
                        <strong style="color: #dc2626;">Hurricane Timeline Range</strong><br>
                        <div style="margin: 15px 0; position: relative; height: 60px;">
                            <!-- Range track background -->
                            <div style="position: absolute; top: 25px; left: 10px; width: 280px; height: 6px; background: #e5e7eb; border-radius: 3px;"></div>
                            
                            <!-- Active range indicator -->
                            <div id="range-fill" style="position: absolute; top: 25px; left: 10px; height: 6px; background: #dc2626; border-radius: 3px; transition: all 0.1s ease; width: 280px;"></div>
                            
                            <!-- Dual-range slider container -->
                            <div class="dual-range-container" style="position: absolute; top: 15px; left: 10px; width: 280px; height: 25px;">
                                <input type="range" min="1950" max="2024" value="2015" 
                                    style="position: absolute; width: 100%; height: 25px; background: transparent; -webkit-appearance: none; appearance: none; cursor: pointer; pointer-events: none;"
                                    id="hurricane-start-slider">
                                
                                <input type="range" min="1950" max="2024" value="2024" 
                                    style="position: absolute; width: 100%; height: 25px; background: transparent; -webkit-appearance: none; appearance: none; cursor: pointer; pointer-events: none;"
                                    id="hurricane-end-slider">
                            </div>
                            
                            <!-- Year labels -->
                            <div style="position: absolute; top: 5px; left: 10px; font-size: 11px; color: #6b7280;">1950</div>
                            <div style="position: absolute; top: 5px; right: 10px; font-size: 11px; color: #6b7280;">2024</div>
                        </div>
                        
                        <div style="margin-top: 5px; text-align: center;">
                            <span style="color: #7f1d1d; font-weight: 600; font-size: 14px;" id="timeline-range-label">2015 - 2024</span>
                            <br><small style="color: #991b1b; font-size: 12px;" id="timeline-count-label">Showing hurricanes in range</small>
                        </div>
                    </div>
                    
                    <style>
                        /* Dual-range slider styling */
                        .dual-range-container {
                            position: relative;
                        }
                        
                        #hurricane-start-slider, #hurricane-end-slider {
                            pointer-events: auto !important;
                        }
                        
                        #hurricane-start-slider::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            appearance: none;
                            width: 20px;
                            height: 20px;
                            border-radius: 50%;
                            background: #dc2626;
                            border: 3px solid #ffffff;
                            cursor: pointer;
                            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                            pointer-events: auto;
                            z-index: 3001;
                            position: relative;
                        }
                        
                        #hurricane-end-slider::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            appearance: none;
                            width: 20px;
                            height: 20px;
                            border-radius: 50%;
                            background: #b91c1c;
                            border: 3px solid #ffffff;
                            cursor: pointer;
                            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                            pointer-events: auto;
                            z-index: 3002;
                            position: relative;
                        }
                        
                        #hurricane-start-slider::-moz-range-thumb {
                            width: 20px;
                            height: 20px;
                            border-radius: 50%;
                            background: #dc2626;
                            border: 3px solid #ffffff;
                            cursor: pointer;
                            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                            border: none;
                            pointer-events: auto;
                        }
                        
                        #hurricane-end-slider::-moz-range-thumb {
                            width: 20px;
                            height: 20px;
                            border-radius: 50%;
                            background: #b91c1c;
                            border: 3px solid #ffffff;
                            cursor: pointer;
                            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                            border: none;
                            pointer-events: auto;
                        }
                        
                        #hurricane-start-slider::-webkit-slider-track,
                        #hurricane-end-slider::-webkit-slider-track {
                            background: transparent;
                            height: 6px;
                            border-radius: 3px;
                        }
                        
                        #hurricane-start-slider::-moz-range-track,
                        #hurricane-end-slider::-moz-range-track {
                            background: transparent;
                            height: 6px;
                            border-radius: 3px;
                            border: none;
                        }
                        
                        #hurricane-start-slider:active::-webkit-slider-thumb {
                            z-index: 3003;
                        }
                        
                        #hurricane-end-slider:active::-webkit-slider-thumb {
                            z-index: 3004;
                        }
                    </style>
                `;
                
                // Add event listeners for both sliders
                const startSlider = div.querySelector('#hurricane-start-slider');
                const endSlider = div.querySelector('#hurricane-end-slider');
                const rangeLabel = div.querySelector('#timeline-range-label');
                const countLabel = div.querySelector('#timeline-count-label');
                const rangeFill = div.querySelector('#range-fill');
                
                function updateRangeFill() {
                    const startYear = parseInt(startSlider.value);
                    const endYear = parseInt(endSlider.value);
                    const totalRange = 2024 - 1950;
                    const startPercent = (startYear - 1950) / totalRange;
                    const endPercent = (endYear - 1950) / totalRange;
                    
                    rangeFill.style.left = `${10 + (startPercent * 280)}px`;
                    rangeFill.style.width = `${(endPercent - startPercent) * 280}px`;
                }
                
                function updateHurricaneDisplay() {
                    let startYear = parseInt(startSlider.value);
                    let endYear = parseInt(endSlider.value);
                    
                    // Prevent crossover
                    if (startYear > endYear) {
                        if (event && event.target === startSlider) {
                            endSlider.value = startYear;
                            endYear = startYear;
                        } else {
                            startSlider.value = endYear;
                            startYear = endYear;
                        }
                    }
                    
                    rangeLabel.textContent = `${startYear} - ${endYear}`;
                    updateRangeFill();
                    
                    const hurricanesInRange = HURRICANE_DATABASE.filter(h => h.year >= startYear && h.year <= endYear);
                    countLabel.textContent = `Showing ${hurricanesInRange.length} hurricanes in range`;
                    
                    displayHurricanesInRange(startYear, endYear);
                }
                
                startSlider.addEventListener('input', updateHurricaneDisplay);
                endSlider.addEventListener('input', updateHurricaneDisplay);
                startSlider.addEventListener('change', updateHurricaneDisplay);
                endSlider.addEventListener('change', updateHurricaneDisplay);
                
                updateRangeFill();
                updateHurricaneDisplay();
                
                // Prevent map interaction when using sliders
                L.DomEvent.disableClickPropagation(div);
                L.DomEvent.disableScrollPropagation(div);
                
                return div;
            };
            state.hurricaneTimelineControl.addTo(state.hurricaneMap);
        }
    }

    /**
     * Play hurricane animation
     */
    function playHurricaneAnimation() {
        // TRIAL CHECK - Free Trial Rate Limiting (MANDATORY)
        console.log('🔍 playHurricaneAnimation: Checking trial status...');
        
        if (typeof TrialManager === 'undefined') {
            console.error('❌ CRITICAL: TrialManager not loaded!');
            alert('Error: Trial system failed to load. Please refresh the page.');
            return;
        }
        
        const lookupCheck = TrialManager.canPerformLookup();
        console.log('🔍 playHurricaneAnimation: Lookup check result:', lookupCheck);
        
        if (!lookupCheck.allowed) {
            console.log('🚫 playHurricaneAnimation: Lookup blocked');
            showUpgradeModal(lookupCheck.message);
            return;
        }
        
        console.log('✅ playHurricaneAnimation: Lookup allowed - proceeding...');
        
        const select = document.getElementById('hurricane-select');
        if (!select || !select.value) {
            Notifications.show('Please select a hurricane first', 'warning');
            return;
        }

        animateSpecificHurricane(select.value);
    }

    /**
     * Animate specific hurricane
     */
    function animateSpecificHurricane(hurricaneName) {
        const hurricane = HURRICANE_DATABASE.find(h => h.name === hurricaneName);
        if (!hurricane || !state.hurricaneMap) return;

        // Clear existing layers
        state.hurricaneMap.eachLayer(layer => {
            if (layer instanceof L.Polyline || layer instanceof L.Marker) {
                state.hurricaneMap.removeLayer(layer);
            }
        });

        // Setup animation
        state.hurricaneAnimator.isPlaying = true;
        state.hurricaneAnimator.currentFrame = 0;
            // TRIAL - Record successful lookup
            if (typeof TrialManager !== 'undefined') {
                TrialManager.recordLookup('hurricane_animation', 'action');
                console.log('📝 Recorded hurricane_animation lookup');
            }
        state.hurricaneAnimator.selectedHurricane = hurricane;

        // Fit map to hurricane path
        const bounds = L.latLngBounds(hurricane.path);
        state.hurricaneMap.fitBounds(bounds, { padding: [50, 50] });

        // Animate path
        animateHurricanePath();
    }

    /**
     * Animate hurricane path frame by frame
     */
    function animateHurricanePath() {
        if (!state.hurricaneAnimator.isPlaying) return;

        const hurricane = state.hurricaneAnimator.selectedHurricane;
        const frame = state.hurricaneAnimator.currentFrame;

        if (frame >= hurricane.path.length) {
            state.hurricaneAnimator.isPlaying = false;
            Notifications.show(`${hurricane.name} animation complete`, 'success');
            return;
        }

        // Draw path up to current frame
        if (frame > 0) {
            const pathSegment = hurricane.path.slice(0, frame + 1);
            L.polyline(pathSegment, {
                color: hurricane.color,
                weight: 4,
                opacity: 0.8
            }).addTo(state.hurricaneMap);
        }

        // Add marker at current position
        const currentPos = hurricane.path[frame];
        L.marker(currentPos, {
            icon: L.divIcon({
                className: 'hurricane-marker',
                html: '🌀',
                iconSize: [30, 30]
            })
        }).addTo(state.hurricaneMap)
        .bindPopup(`
            <div style="background: white; padding: 1rem; border-radius: 12px; min-width: 250px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <div style="font-size: 1.25rem; font-weight: 700; color: #181E57; margin-bottom: 0.5rem;">
                    ${hurricane.name}
                </div>
                <div style="background: ${hurricane.color}; color: white; display: inline-block; padding: 0.25rem 0.75rem; border-radius: 6px; font-weight: 600; margin-bottom: 0.75rem;">
                    Category ${hurricane.category}
                </div>
                <div style="color: #64748b; font-size: 0.95rem; line-height: 1.6;">
                    <strong style="color: #181E57;">Max Wind Speed:</strong> ${hurricane.windSpeed} mph<br>
                    <strong style="color: #181E57;">Year:</strong> ${hurricane.year}<br>
                    <strong style="color: #181E57;">Position:</strong> ${frame + 1} of ${hurricane.path.length}
                </div>
            </div>
        `, {
            maxWidth: 300,
            className: 'hurricane-info-card'
        })
        .openPopup();

        state.hurricaneAnimator.currentFrame++;

        setTimeout(() => animateHurricanePath(), state.hurricaneAnimator.animationSpeed);
    }

    /**
     * Stop hurricane animation
     */
    function stopHurricaneAnimation() {
        state.hurricaneAnimator.isPlaying = false;
        state.hurricaneAnimator.currentFrame = 0;
        Notifications.show('Animation stopped', 'info');
    }

    /**
     * Export hurricane database to CSV
     */
    function exportHurricaneData() {
        let csvContent = 'Hurricane Name,Year,Category,Landfall Location,Peak Wind Speed,Damage (Millions USD),Casualties,Affected States\n';

        HURRICANE_DATABASE.forEach(hurricane => {
            csvContent += `"${hurricane.name}",${hurricane.year},${hurricane.category},"${hurricane.landfall}",N/A,${hurricane.damage || 'N/A'},${hurricane.casualties || 'N/A'},"${hurricane.states.join('; ')}"\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hurricane-database-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        Notifications.show('Hurricane data exported successfully', 'success');
    }

    // ================================================================
    // CSV DATA LOADING (PRESERVED)
    // ================================================================
    async function loadCSVData() {
        // Check if CSV loading should be skipped
        if (window.VELOCITY_FINDER_CONFIG?.skipCSVLoad === true ||
            window.VELOCITY_FINDER_CONFIG?.csvPath === null) {
            console.log('CSV loading skipped - using API for ZIP lookups');
            state.csvLoaded = false; // Mark as not loaded, will use API fallback
            LoadingOverlay.hide();
            initializeHurricaneAnimator();
            filterHurricanes(); // Initialize hurricane list
            return; // Exit early
        }

        LoadingOverlay.show('Loading location database...');

        let csvLoaded = false;
        let lastError = null;

        // Try each path until one works
        for (const csvPath of CONFIG.csvPaths) {
            try {
                console.log(`Trying to load CSV from: ${csvPath}`);
                const response = await fetch(csvPath);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                LoadingOverlay.update('Processing location data...');
                const csvText = await response.text();
                
                const lines = csvText.split('\n');
                const headers = lines[0].split(',');
                
                console.log('CSV Headers:', headers);
                
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    
                    const cols = line.split(',');
                    let zip = cols[0];
                    
                    if (zip) zip = zip.padStart(5, '0');
                    
                    if (zip && cols[1] && cols[2]) {
                        state.csvVelocityData[zip] = {
                            lat: parseFloat(cols[1]),
                            lng: parseFloat(cols[2]),
                            city: cols[3],
                            state_id: cols[4],
                            state_name: cols[5],
                            zcta: cols[6],
                            parent_zcta: cols[7],
                            population: parseInt(cols[8]) || 0,
                            density: parseFloat(cols[9]) || 0,
                            county_fips: cols[10],
                            county_name: cols[11],
                            county_weights: cols[12],
                            county_names_all: cols[13],
                            county_fips_all: cols[14],
                            imprecise: cols[15],
                            military: cols[16],
                            timezone: cols[17],
                            velocity_risk_cat_1: cols[18],
                            velocity_risk_cat_2: cols[19],
                            velocity_risk_cat_3: cols[20],
                            velocity_risk_cat_4: cols[21]
                        };
                    }
                }
                
                state.csvLoaded = true;
                console.log(`✅ CSV Loaded successfully from: ${csvPath}`);
                console.log(`✅ ${Object.keys(state.csvVelocityData).length} ZIP codes available`);
                
                LoadingOverlay.hide();
                Notifications.show('Location data loaded successfully', 'success');
                
                // Don't add markers yet - they'll be added when Velocity Finder section opens
                // addCSVSampleMarkers(); // REMOVED - causes error when map isn't initialized
                populateStateDropdowns();
                setupNumberFormatting();
                initializeHurricaneAnimator();
                filterHurricanes(); // Initialize hurricane list
                
                csvLoaded = true;
                break; // Success! Exit the loop
                
            } catch (error) {
                console.warn(`Failed to load from ${csvPath}:`, error.message);
                lastError = error;
                // Continue to next path
            }
        }
        
        if (!csvLoaded) {
            console.error('⚠️ Failed to load CSV from all attempted paths:', lastError);
            LoadingOverlay.hide();
            
            // Show helpful error message
            const errorMessage = `
                <div style="text-align: left; padding: 1rem;">
                    <strong>CSV Data File Not Found</strong><br><br>
                    The ZIP code database file could not be loaded. Please ensure:<br>
                    <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                        <li>The file <code>usps_zip_codes.csv</code> exists</li>
                        <li>It's in one of these locations:
                            <ul style="margin-top: 0.5rem;">
                                ${CONFIG.csvPaths.map(path => `<li><code>${path}</code></li>`).join('')}
                            </ul>
                        </li>
                        <li>Your web server allows access to the file</li>
                    </ul>
                    <br>
                    <strong>Or configure a custom path:</strong><br>
                    Add this before loading the script:<br>
                    <code style="display: block; background: #f3f4f6; padding: 0.5rem; margin-top: 0.5rem; border-radius: 4px;">
                        &lt;script&gt;<br>
                        &nbsp;&nbsp;window.VELOCITY_FINDER_CONFIG = {<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;csvPath: '/your/custom/path/usps_zip_codes.csv'<br>
                        &nbsp;&nbsp;};<br>
                        &lt;/script&gt;
                    </code>
                </div>
            `;
            
            // Show modal with instructions
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                z-index: 30000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            `;
            
            const content = document.createElement('div');
            content.style.cssText = `
                background: white;
                border-radius: 20px;
                padding: 2rem;
                max-width: 700px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            `;
            
            content.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="color: #dc2626; margin: 0;">⚠️ Configuration Required</h2>
                    <button onclick="this.closest('[style*=\\'position: fixed\\']').remove()" 
                            style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b;">×</button>
                </div>
                ${errorMessage}
                <div style="text-align: center; margin-top: 1.5rem;">
                    <button onclick="location.reload()" 
                            style="background: linear-gradient(135deg, #0018ff 0%, #181E57 100%); color: white; border: none; padding: 0.75rem 2rem; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        Retry
                    </button>
                </div>
            `;
            
            modal.appendChild(content);
            document.body.appendChild(modal);
            
            state.csvLoaded = false;
        }
    }

    // ================================================================
    // VELOCITY DATA RETRIEVAL (PRESERVED)
    // ================================================================
    function getVelocityFromCSV(zip, riskCategory) {
        if (!state.csvLoaded || !state.csvVelocityData[zip]) {
            console.log(`⚠️ ZIP ${zip} not found in CSV`);
            return null;
        }
        
        const data = state.csvVelocityData[zip];
        const county = data.county_name;
        
        // Check for overrides
        if (FLORIDA_OVERRIDES[county]) {
            const overrideData = FLORIDA_OVERRIDES[county];
            const isFBC2023 = overrideData.authority === 'FBC 2023';
            
            console.log(`✅ Applying ${overrideData.authority} ${county} County mandated wind speeds for ZIP ${zip}`);
            
            const catMap = {
                'category-1': overrideData.cat1,
                'category-2': overrideData.cat2,
                'category-3': overrideData.cat3,
                'category-4': overrideData.cat4
            };
            
            return {
                velocity: catMap[riskCategory],
                jurisdiction: county,
                lat: data.lat,
                lng: data.lng,
                city: data.city,
                state: data.state_name,
                county: county,
                isOverride: true,
                isFBC2023: isFBC2023,
                isLocalJurisdiction: !isFBC2023,
                buildingCode: overrideData.authorityFull,
                buildingCodeShort: overrideData.authority,
                specialRequirement: isFBC2023 
                    ? `${county} County - FBC 2023 Mandated Wind Speeds (Supersedes ASCE 7)`
                    : `${county} County - Local Jurisdiction Override (Supersedes ASCE 7)`,
                asceEdition: isFBC2023 ? 'FBC 2023' : 'Local Jurisdiction',
                population: data.population,
                density: data.density,
                timezone: data.timezone,
                county_fips: data.county_fips,
                county_weights: data.county_weights,
                county_names_all: data.county_names_all,
                county_fips_all: data.county_fips_all,
                imprecise: data.imprecise,
                state_id: data.state_id,
                cat1: overrideData.cat1,
                cat2: overrideData.cat2,
                cat3: overrideData.cat3,
                cat4: overrideData.cat4
            };
        }
        
        // Standard CSV data
        const catMap = {
            'category-1': data.velocity_risk_cat_1,
            'category-2': data.velocity_risk_cat_2,
            'category-3': data.velocity_risk_cat_3,
            'category-4': data.velocity_risk_cat_4
        };
        
        let velocity = catMap[riskCategory];
        
        if (velocity === 'ASCE' || !velocity || isNaN(velocity)) {
            console.log(`⚠️ No velocity data for ZIP ${zip}, category ${riskCategory}`);
            return null;
        }
        
        velocity = parseInt(velocity);
        
        return {
            velocity: velocity,
            jurisdiction: `${data.city}, ${data.state_name}`,
            lat: data.lat,
            lng: data.lng,
            city: data.city,
            state: data.state_name,
            county: data.county_name,
            isOverride: false,
            isFBC2023: false,
            isLocalJurisdiction: false,
            buildingCode: 'International Building Code',
            buildingCodeShort: 'IBC',
            specialRequirement: null,
            asceEdition: '7-22',
            population: data.population,
            density: data.density,
            timezone: data.timezone,
            county_fips: data.county_fips,
            county_weights: data.county_weights,
            county_names_all: data.county_names_all,
            county_fips_all: data.county_fips_all,
            imprecise: data.imprecise,
            state_id: data.state_id,
            cat1: parseInt(data.velocity_risk_cat_1) || null,
            cat2: parseInt(data.velocity_risk_cat_2) || null,
            cat3: parseInt(data.velocity_risk_cat_3) || null,
            cat4: parseInt(data.velocity_risk_cat_4) || null
        };
    }

    // ================================================================
    // GEOCODING (PRESERVED)
    // ================================================================
    async function geocodeLocation(location) {
        const now = Date.now();
        const timeSinceLastCall = now - state.lastGeocodingCall;
        
        if (timeSinceLastCall < CONFIG.geocodingDelay) {
            await new Promise(resolve => 
                setTimeout(resolve, CONFIG.geocodingDelay - timeSinceLastCall)
            );
        }
        
        state.lastGeocodingCall = Date.now();
        
        try {
            const cleanLocation = location.trim();
            
            let response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanLocation)}&limit=5`);
            let data = await response.json();
            
            if ((!data || data.length === 0) && /^[a-zA-Z\s,]+,?\s*[A-Z]{2}?$/i.test(cleanLocation)) {
                response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanLocation + ', United States')}&countrycodes=us&limit=3`);
                data = await response.json();
            }
            
            if (data && data.length > 0) {
                const bestMatch = data[0];
                return { 
                    lat: parseFloat(bestMatch.lat), 
                    lng: parseFloat(bestMatch.lon),
                    display_name: bestMatch.display_name 
                };
            }
            
            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    }

    // ================================================================
    // MAP INITIALIZATION & FUNCTIONS (PRESERVED)
    // ================================================================
    function initializeMap() {
        const mapContainer = document.getElementById('velocity-map');
        if (!mapContainer) {
            setTimeout(() => initializeMap(), 100);
            return;
        }

        if (typeof L === 'undefined') {
            setTimeout(() => initializeMap(), 100);
            return;
        }

        // Check if map container is visible
        const isVisible = mapContainer.offsetParent !== null;
        
        if (!isVisible) {
            console.log('⏳ Map container hidden - will initialize when section opens');
            // Map will be lazy-loaded when user opens the section
            loadCSVData(); // Still load the data
            return;
        }

        try {
            state.map = L.map('velocity-map').setView([39.8283, -98.5795], 4);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
                attribution: '© OpenStreetMap contributors', 
                maxZoom: 18 
            }).addTo(state.map);
            
            state.map.on('click', function(e) { 
                findVelocityByCoordinates(e.latlng.lat, e.latlng.lng); 
            });
            
            // Initialize layer groups
            state.layerGroups = {
                velocity: L.layerGroup().addTo(state.map),
                authorities: L.layerGroup(),
                terrain: L.layerGroup()
            };
            
            addVelocityZones();
            loadCSVData();
            console.log('✅ Map initialized successfully');
        } catch (error) {
            console.warn('⚠️ Map initialization delayed:', error.message);
            loadCSVData(); // Still load the data even if map fails
        }
    }

    function addVelocityZones() {
        const velocityZones = [
            { bounds: [[25.0, -82.0], [27.0, -79.0]], color: '#ef4444', velocity: '175-195 mph', description: 'High-Velocity Hurricane Zone' },
            { bounds: [[27.0, -85.0], [31.0, -79.0]], color: '#f97316', velocity: '150-175 mph', description: 'Hurricane Prone Region' },
            { bounds: [[31.0, -88.0], [35.0, -75.0]], color: '#fbbf24', velocity: '120-150 mph', description: 'Moderate Wind Region' }
        ];

        velocityZones.forEach(zone => {
            const rectangle = L.rectangle(zone.bounds, { 
                color: zone.color, 
                fillColor: zone.color, 
                fillOpacity: 0.3, 
                weight: 2 
            }).addTo(state.layerGroups.velocity);
            
            rectangle.bindPopup(`
                <div class="velocity-popup">
                    <div class="popup-title">${zone.description}</div>
                    <div class="popup-velocity">${zone.velocity}</div>
                    <div class="popup-details">Click for detailed calculations</div>
                </div>
            `);
        });
    }

    function addCSVSampleMarkers() {
        if (!state.csvLoaded) return;
        
        // Check if map and layer groups exist
        if (!state.map || !state.layerGroups || !state.layerGroups.velocity) {
            console.log('⏳ Map not initialized yet - markers will be added when map opens');
            return;
        }
        
        const allZips = Object.keys(state.csvVelocityData);
        if (allZips.length === 0) return;
        
        const sampleSize = Math.min(CONFIG.sampleMarkersCount, allZips.length);
        const step = Math.floor(allZips.length / sampleSize);
        
        let markersAdded = 0;
        for (let i = 0; i < allZips.length && markersAdded < sampleSize; i += step) {
            const zip = allZips[i];
            const velocityData = getVelocityFromCSV(zip, state.selectedRiskCategory);
            
            if (velocityData && velocityData.lat && velocityData.lng && velocityData.velocity) {
                const marker = L.marker([velocityData.lat, velocityData.lng]).addTo(state.layerGroups.velocity);
                
                const overrideLabel = velocityData.isFBC2023 
                    ? '⚠️ FBC 2023'
                    : velocityData.isLocalJurisdiction 
                        ? '⚠️ Local Jurisdiction'
                        : 'CSV Data';
                
                marker.bindPopup(`
                    <div class="velocity-popup">
                        <div class="popup-title">${velocityData.jurisdiction}</div>
                        <div class="popup-velocity">${velocityData.velocity} mph</div>
                        <div class="popup-details">
                            ZIP: ${zip}<br>
                            ${overrideLabel}
                        </div>
                    </div>
                `);
                
                state.currentMarkers.push(marker);
                markersAdded++;
            }
        }
        
        console.log(`✅ Added ${markersAdded} dynamically sampled markers from CSV`);
    }

    function clearMarkers() {
        state.currentMarkers.forEach(marker => {
            if (marker && marker.remove) {
                marker.off();
                marker.remove();
            }
        });
        state.currentMarkers = [];
    }

    function addAuthoritiesLayer() {
        state.map.addLayer(state.layerGroups.authorities);
        
        const jurisdictions = [
            { 
                bounds: [[25.0, -82.0], [27.0, -79.0]], 
                color: '#dc2626', 
                name: 'Miami-Dade HVHZ',
                requirements: 'High-Velocity Hurricane Zone - Impact resistance required'
            },
            { 
                bounds: [[26.0, -81.5], [26.5, -80.0]], 
                color: '#dc2626', 
                name: 'Broward County HVHZ',
                requirements: 'Enhanced wind resistance standards'
            },
            { 
                bounds: [[25.5, -82.5], [26.8, -81.0]], 
                color: '#f59e0b', 
                name: 'Collier County Override',
                requirements: 'Local authority wind speed requirements exceed ASCE 7'
            }
        ];
        
        jurisdictions.forEach(jurisdiction => {
            L.rectangle(jurisdiction.bounds, {
                color: jurisdiction.color,
                fillColor: jurisdiction.color,
                fillOpacity: 0.25,
                weight: 3
            }).addTo(state.layerGroups.authorities)
            .bindPopup(`
                <div class="velocity-popup">
                    <div class="popup-title">${jurisdiction.name}</div>
                    <div class="popup-details">${jurisdiction.requirements}</div>
                </div>
            `);
        });
    }

    function addTerrainLayer() {
        state.map.addLayer(state.layerGroups.terrain);
        
        state.layerGroups.terrain.clearLayers();
        
        const elevationZones = [
            { 
                bounds: [[25.0, -125.0], [48.0, -65.0]], 
                elevation: '0-1000 ft', 
                color: '#90ee90', 
                exposure: 'B/C',
                name: 'Coastal and Low-Lying Areas',
                details: 'Mixed urban and suburban development with variable exposure',
                windEffect: 'Variable: -10% to +20% depending on local obstructions',
                designNotes: 'Transition zones require site-specific exposure determination',
                zoneId: 'coastal-lowland'
            },
            { 
                bounds: [[36.0, -120.0], [42.0, -95.0]], 
                elevation: '1000-3000 ft', 
                color: '#9acd32', 
                exposure: 'B',
                name: 'Midwest Agricultural Plains',
                details: 'Farmland with scattered buildings and moderate obstructions',
                windEffect: '-15% wind speeds due to surface roughness',
                designNotes: 'Exposure B typical for suburban and light industrial areas',
                zoneId: 'midwest-agricultural'
            }
        ];
        
        elevationZones.forEach((zone, index) => {
            const rectangle = L.rectangle(zone.bounds, {
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: 0.2,
                weight: 2,
                dashArray: '10, 5',
                pane: 'overlayPane'
            });
            
            rectangle.zoneData = zone;
            
            rectangle.on('click', function(e) {
                L.DomEvent.stopPropagation(e);
                
                const uniqueZoneData = this.zoneData;
                
                const popup = L.popup()
                    .setLatLng(e.latlng)
                    .setContent(`
                        <div class="velocity-popup">
                            <div class="popup-title">${uniqueZoneData.name}</div>
                            <div class="popup-velocity">Elevation: ${uniqueZoneData.elevation}</div>
                            <div class="popup-details">
                                <strong>Exposure Category:</strong> ${uniqueZoneData.exposure}<br>
                                <strong>Wind Effect:</strong> ${uniqueZoneData.windEffect}<br>
                                <strong>Characteristics:</strong> ${uniqueZoneData.details}<br>
                                <strong>Design Notes:</strong> ${uniqueZoneData.designNotes}
                            </div>
                        </div>
                    `)
                    .openOn(state.map);
            });
            
            rectangle.addTo(state.layerGroups.terrain);
        });
    }

    function toggleMapLayer(layerType) {
        document.querySelectorAll('.map-control-btn').forEach(btn => btn.classList.remove('active'));
        const layerBtn = document.getElementById(`${layerType}-layer`);
        if (layerBtn) layerBtn.classList.add('active');
        
        state.activeLayer = layerType;
        
        Object.values(state.layerGroups).forEach(group => state.map.removeLayer(group));
        
        switch(layerType) {
            case 'velocity':
                state.map.addLayer(state.layerGroups.velocity);
                break;
            case 'authorities':
                addAuthoritiesLayer();
                break;
            case 'terrain':
                addTerrainLayer();
                break;
        }
    }

    // ================================================================
    // FIND VELOCITY FUNCTIONS (PRESERVED)
    // ================================================================
    async function findVelocity() {
        // TRIAL CHECK - Free Trial Rate Limiting (MANDATORY)
        console.log('🔍 findVelocity: Checking trial status...');
        
        if (typeof TrialManager === 'undefined') {
            console.error('❌ CRITICAL: TrialManager not loaded! Trial protection disabled!');
            alert('Error: Trial system failed to load. Please refresh the page.');
            return;
        }
        
        const lookupCheck = TrialManager.canPerformLookup();
        console.log('🔍 findVelocity: Lookup check result:', lookupCheck);
        
        if (!lookupCheck.allowed) {
            console.log('🚫 findVelocity: Lookup blocked - showing upgrade modal');
            showUpgradeModal(lookupCheck.message);
            return;
        }
        
        console.log('✅ findVelocity: Lookup allowed - proceeding...');
        
        if (!DOM.locationInput) {
            console.warn('Location input element not found');
            return;
        }
        
        const location = DOM.locationInput.value.trim();
        if (!location) {
            Notifications.show('Please enter a location', 'warning');
            return;
        }
        
        if (!state.csvLoaded) {
            Notifications.show('Data is still loading. Please wait a moment and try again.', 'warning');
            return;
        }
        
        LoadingOverlay.show('Finding location...');
        
        try {
            // Check if it's a 5-digit ZIP code
            if (/^\d{5}$/.test(location)) {
                const velocityData = getVelocityFromCSV(location, state.selectedRiskCategory);
                if (velocityData) {
                    state.map.setView([velocityData.lat, velocityData.lng], 10);
                    
                    clearMarkers();
                    const marker = L.marker([velocityData.lat, velocityData.lng]).addTo(state.map);
                    
                    const overrideLabel = velocityData.isFBC2023 
                        ? '⚠️ FBC 2023'
                        : velocityData.isLocalJurisdiction 
                            ? '⚠️ Local Jurisdiction'
                            : 'CSV Data';
                    
                    marker.bindPopup(`
                        <div class="velocity-popup">
                            <div class="popup-title">${velocityData.jurisdiction}</div>
                            <div class="popup-velocity">${velocityData.velocity} mph</div>
                            <div class="popup-details">
                                ZIP: ${location}<br>
                                ${overrideLabel}
                            </div>
                        </div>
                    `).openPopup();
                    state.currentMarkers.push(marker);
                    
                    state.currentLocationData = velocityData;
                    state.currentLocationZip = location;
                    
                    updateResults(velocityData.velocity, velocityData.velocity, velocityData.velocity, 
                                Math.round(velocityData.velocity * WIND_PRESSURE_CONSTANTS.FUTURE_VELOCITY_FACTOR), velocityData);
                    
                    // TRIAL - Record successful lookup (MANDATORY)
                    if (typeof TrialManager !== 'undefined') {
                        TrialManager.recordLookup('wind_velocity', location);
                        console.log('📝 Recorded wind velocity lookup');
                    } else {
                        console.error('❌ Cannot record lookup - TrialManager missing!');
                    }
                    
                    LoadingOverlay.hide();
                    return;
                } else {
                    LoadingOverlay.hide();
                    Notifications.show(`ZIP code ${location} not found in database.`, 'error');
                    return;
                }
            }
            
            // Dynamic city/state search from CSV
            const lowerLocation = location.toLowerCase().trim();
            
            let foundZip = null;
            for (const [zip, data] of Object.entries(state.csvVelocityData)) {
                const cityMatch = data.city.toLowerCase() === lowerLocation;
                const cityStateMatch = `${data.city.toLowerCase()}, ${data.state_id.toLowerCase()}` === lowerLocation;
                const cityStateFullMatch = `${data.city.toLowerCase()}, ${data.state_name.toLowerCase()}` === lowerLocation;
                
                if (cityMatch || cityStateMatch || cityStateFullMatch) {
                    foundZip = zip;
                    break;
                }
            }
            
            if (foundZip) {
                const velocityData = getVelocityFromCSV(foundZip, state.selectedRiskCategory);
                if (velocityData) {
                    state.map.setView([velocityData.lat, velocityData.lng], 10);
                    
                    clearMarkers();
                    const marker = L.marker([velocityData.lat, velocityData.lng]).addTo(state.map);
                    
                    const overrideLabel = velocityData.isFBC2023 
                        ? '⚠️ FBC 2023'
                        : velocityData.isLocalJurisdiction 
                            ? '⚠️ Local Jurisdiction'
                            : 'CSV Data';
                    
                    marker.bindPopup(`
                        <div class="velocity-popup">
                            <div class="popup-title">${velocityData.jurisdiction}</div>
                            <div class="popup-velocity">${velocityData.velocity} mph</div>
                            <div class="popup-details">
                                ZIP: ${foundZip}<br>
                                ${overrideLabel}
                            </div>
                        </div>
                    `).openPopup();
                    state.currentMarkers.push(marker);
                    
                    state.currentLocationData = velocityData;
                    state.currentLocationZip = foundZip;
                    
                    updateResults(velocityData.velocity, velocityData.velocity, velocityData.velocity, 
                                Math.round(velocityData.velocity * WIND_PRESSURE_CONSTANTS.FUTURE_VELOCITY_FACTOR), velocityData);
                    DOM.locationInput.value = foundZip;
                    LoadingOverlay.hide();
                    return;
                }
            }
            
            // Try geocoding as fallback
            const locationData = await geocodeLocation(location);
            if (locationData) {
                state.map.setView([locationData.lat, locationData.lng], 10);
                findVelocityByCoordinates(locationData.lat, locationData.lng);
                LoadingOverlay.hide();
                return;
            }
            
            LoadingOverlay.hide();
            Notifications.show(`Location "${location}" not found. Please try a 5-digit ZIP code or major city name.`, 'error');
            
        } catch (error) {
            console.error('Location lookup failed:', error);
            LoadingOverlay.hide();
            Notifications.show(`Error finding location "${location}".`, 'error');
        }
    }

    function findVelocityByCoordinates(lat, lng) {
        clearMarkers();
        
        if (!state.csvLoaded) {
            Notifications.show('Data is still loading. Please try again in a moment.', 'warning');
            return;
        }
        
        let closestZip = null;
        let minDistance = Infinity;
        
        Object.entries(state.csvVelocityData).forEach(([zip, data]) => {
            if (data.lat && data.lng) {
                const distance = Math.sqrt(Math.pow(lat - data.lat, 2) + Math.pow(lng - data.lng, 2));
                if (distance < minDistance) {
                    minDistance = distance;
                    closestZip = zip;
                }
            }
        });
        
        if (!closestZip || minDistance > 2) {
            Notifications.show('No velocity data available for this location.', 'warning');
            return;
        }
        
        const velocityData = getVelocityFromCSV(closestZip, state.selectedRiskCategory);
        if (!velocityData) {
            Notifications.show('No velocity data available for this location.', 'warning');
            return;
        }
        
        state.map.setView([velocityData.lat, velocityData.lng], 10);
        
        const marker = L.marker([velocityData.lat, velocityData.lng]).addTo(state.map);
        
        const overrideLabel = velocityData.isFBC2023 
            ? '⚠️ FBC 2023'
            : velocityData.isLocalJurisdiction 
                ? '⚠️ Local Jurisdiction'
                : 'CSV Data';
        
        marker.bindPopup(`
            <div class="velocity-popup">
                <div class="popup-title">${velocityData.jurisdiction}</div>
                <div style="background: linear-gradient(135deg, #0018ff 0%, #181E57 100%); color: white; padding: 0.5rem; border-radius: 8px; margin: 0.5rem 0; text-align: center; font-weight: 700;">
                    ${Utils.getRiskCategoryName(state.selectedRiskCategory)}
                </div>
                <div class="popup-velocity">${velocityData.velocity} mph</div>
                <div class="popup-details">
                    <strong>ZIP Code:</strong> ${closestZip}<br>
                    <strong>Data Source:</strong> CSV Database ✓<br>
                    ${overrideLabel !== 'CSV Data' ? `<strong>Authority:</strong> ${overrideLabel}<br>` : ''}
                    <strong>Coordinates:</strong> ${lat.toFixed(4)}°N, ${Math.abs(lng).toFixed(4)}°W
                </div>
            </div>
        `).openPopup();
        state.currentMarkers.push(marker);
        
        state.currentLocationData = velocityData;
        state.currentLocationZip = closestZip;
        
        updateResults(velocityData.velocity, velocityData.velocity, velocityData.velocity, 
                    Math.round(velocityData.velocity * WIND_PRESSURE_CONSTANTS.FUTURE_VELOCITY_FACTOR), velocityData);
        DOM.locationInput.value = closestZip;
    }

    // ================================================================
    // UPDATE RESULTS & ANALYSIS (PRESERVED)
    // ================================================================
    function updateResults(asceVelocity, localVelocity, requiredVelocity, futureVelocity, locationData) {
        if (DOM.asceVelocity) DOM.asceVelocity.textContent = asceVelocity;
        if (DOM.localVelocity) DOM.localVelocity.textContent = localVelocity;
        if (DOM.requiredVelocity) DOM.requiredVelocity.textContent = requiredVelocity;
        if (DOM.futureVelocity) DOM.futureVelocity.textContent = futureVelocity;
        
        if (DOM.localAlert && DOM.alertText) {
            if (locationData.specialRequirement) {
                DOM.alertText.textContent = `${locationData.jurisdiction}: ${locationData.specialRequirement}`;
                DOM.localAlert.style.display = 'flex';
            } else { 
                DOM.localAlert.style.display = 'none'; 
            }
        }
        
        if (DOM.velocityResults) {
            DOM.velocityResults.classList.add('show');
        }
        
        updateProfessionalAnalysis(asceVelocity, localVelocity, requiredVelocity, futureVelocity, locationData);
    }

    function updateProfessionalAnalysis(asceVelocity, localVelocity, requiredVelocity, futureVelocity, locationData) {
        if (DOM.analysisBlock) {
            DOM.analysisBlock.style.display = 'block';
        }
        
        updateLocationIntelligence(state.currentLocationData, state.currentLocationZip);
        updateVelocityComparisonTable(state.currentLocationData, state.currentLocationZip);
        updateMarketIntelligence(state.currentLocationData);
        updateEnhancedCountyDisplay(state.currentLocationData, state.currentLocationZip);
        updateDataQualityIndicator(state.currentLocationData);
        updateMultiCountyAlert(state.currentLocationData);
    }

    function updateLocationIntelligence(locationData, zip) {
        const locationCard = document.getElementById('location-intelligence-card');
        if (!locationCard || !locationData) return;
        
        locationCard.style.display = 'block';
        
        const updateText = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };
        
        if (locationData.lat && locationData.lng) {
            updateText('location-coords', `${locationData.lat.toFixed(4)}°N, ${Math.abs(locationData.lng).toFixed(4)}°W`);
        }
        updateText('location-timezone', locationData.timezone || 'Not available');
        updateText('location-fips', locationData.county_fips || 'Not available');
        updateText('location-zip', zip);

        const buildingCodeSection = document.getElementById('building-code-section');
        const buildingCodeAuthority = document.getElementById('building-code-authority');
        if (buildingCodeSection && buildingCodeAuthority) {
            if (locationData.isOverride) {
                buildingCodeSection.style.display = 'block';
                const badgeClass = locationData.isFBC2023 ? 'fbc-2023' : 'local-jurisdiction';
                const badgeText = locationData.isFBC2023 ? 'FBC 2023' : 'LOCAL JURISDICTION';
                buildingCodeAuthority.innerHTML = `${locationData.buildingCode} <span class="authority-badge ${badgeClass}">${badgeText}</span>`;
            } else {
                buildingCodeSection.style.display = 'none';
            }
        }
    }

    function updateVelocityComparisonTable(locationData, zip) {
        const comparisonCard = document.getElementById('velocity-comparison-card');
        if (!comparisonCard || !locationData) return;
        
        comparisonCard.style.display = 'block';
        
        const authorityBadge = document.getElementById('velocity-card-authority-badge');
        if (authorityBadge && locationData.isOverride) {
            const badgeClass = locationData.isFBC2023 ? 'fbc-2023' : 'local-jurisdiction';
            const badgeText = locationData.isFBC2023 ? 'FBC 2023' : 'LOCAL JURISDICTION';
            authorityBadge.innerHTML = `<span class="authority-badge ${badgeClass}">${badgeText}</span>`;
        } else if (authorityBadge) {
            authorityBadge.innerHTML = '';
        }
        
        const updateCell = (id, value) => {
            const cell = document.getElementById(id);
            if (cell) cell.textContent = value;
        };
        
        updateCell('cat1-velocity', locationData.cat1 ? `${locationData.cat1} mph` : 'N/A');
        updateCell('cat1-pressure', locationData.cat1 ? `${Utils.calculatePressure(locationData.cat1)} psf` : 'N/A');
        updateCell('cat2-velocity', locationData.cat2 ? `${locationData.cat2} mph` : 'N/A');
        updateCell('cat2-pressure', locationData.cat2 ? `${Utils.calculatePressure(locationData.cat2)} psf` : 'N/A');
        updateCell('cat3-velocity', locationData.cat3 ? `${locationData.cat3} mph` : 'N/A');
        updateCell('cat3-pressure', locationData.cat3 ? `${Utils.calculatePressure(locationData.cat3)} psf` : 'N/A');
        updateCell('cat4-velocity', locationData.cat4 ? `${locationData.cat4} mph` : 'N/A');
        updateCell('cat4-pressure', locationData.cat4 ? `${Utils.calculatePressure(locationData.cat4)} psf` : 'N/A');
    }

    function updateMarketIntelligence(locationData) {
        const marketCard = document.getElementById('market-intelligence-card');
        if (!marketCard || !locationData) return;
        
        marketCard.style.display = 'block';
        
        const updateText = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };
        
        updateText('market-population', locationData.population > 0 ? locationData.population.toLocaleString() : 'N/A');
        updateText('market-density', locationData.density > 0 ? `${locationData.density.toFixed(1)} per sq mi` : 'N/A');
        
        const marketClass = getMarketClassification(locationData.density);
        const marketClassEl = document.getElementById('market-class');
        if (marketClassEl) {
            marketClassEl.textContent = marketClass.name;
            marketClassEl.style.color = marketClass.color;
        }
        
        const constructionScore = calculateConstructionScore(locationData.population, locationData.density);
        const scoreEl = document.getElementById('construction-score');
        if (scoreEl) {
            scoreEl.textContent = constructionScore;
            scoreEl.style.color = constructionScore >= 70 ? '#10b981' : constructionScore >= 40 ? '#0018ff' : '#f59e0b';
        }
        
        const insightsList = document.getElementById('market-insights-list');
        if (insightsList) {
            const insights = generateMarketInsights(locationData.population, locationData.density, constructionScore);
            insightsList.innerHTML = insights.map(insight => `<li>${insight}</li>`).join('');
        }
    }

    function updateEnhancedCountyDisplay(locationData, zip) {
        const countyCard = document.getElementById('county-details-card');
        if (!countyCard || !locationData) return;
        
        countyCard.style.display = 'block';
        
        const updateText = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };
        
        updateText('primary-county', locationData.county_name || 'N/A');
        updateText('primary-county-fips', locationData.county_fips || 'N/A');
        updateText('county-state', `${locationData.city}, ${locationData.state}`);
        
        const isMultiCounty = locationData.county_names_all && locationData.county_names_all.includes('|');
        const additionalSection = document.getElementById('additional-counties-section');
        
        if (isMultiCounty && additionalSection) {
            additionalSection.style.display = 'block';
            const counties = locationData.county_names_all.split('|');
            const fipsCodes = locationData.county_fips_all.split('|');
            
            let weights = {};
            try {
                if (locationData.county_weights) {
                    weights = JSON.parse(locationData.county_weights.replace(/'/g, '"'));
                }
            } catch (e) {}
            
            const additionalList = document.getElementById('additional-counties-list');
            if (additionalList && counties.length > 1) {
                let listHTML = '';
                for (let i = 1; i < counties.length; i++) {
                    const countyName = counties[i];
                    const fips = fipsCodes[i] || 'Unknown';
                    const weight = weights[fips] || 0;
                    const weightText = weight > 0 ? ` (${weight.toFixed(1)}% coverage)` : '';
                    listHTML += `<div style="margin-bottom: 0.5rem;"><strong>${countyName}</strong><br><small>FIPS: ${fips}${weightText}</small></div>`;
                }
                additionalList.innerHTML = listHTML;
            }
        } else if (additionalSection) {
            additionalSection.style.display = 'none';
        }
    }

    function updateDataQualityIndicator(locationData) {
        const qualityBadge = document.getElementById('data-quality-indicator');
        if (!qualityBadge || !locationData) return;
        
        if (locationData.imprecise === 'TRUE') {
            qualityBadge.style.display = 'block';
            const badgeText = document.getElementById('quality-badge-text');
            if (badgeText) {
                badgeText.innerHTML = `<strong>Data Quality Notice:</strong> This ZIP code has approximate geographic boundaries. Wind velocity data is based on the general area and may not precisely reflect site-specific conditions.`;
            }
        } else {
            qualityBadge.style.display = 'none';
        }
    }

    function updateMultiCountyAlert(locationData) {
        const multiCountyAlert = document.getElementById('multi-county-alert');
        if (!multiCountyAlert || !locationData) return;
        
        const isMultiCounty = locationData.county_names_all && locationData.county_names_all.includes('|');
        
        if (isMultiCounty) {
            multiCountyAlert.style.display = 'block';
            const counties = locationData.county_names_all.split('|');
            const fipsCodes = locationData.county_fips_all.split('|');
            
            let weights = {};
            try {
                if (locationData.county_weights) {
                    weights = JSON.parse(locationData.county_weights.replace(/'/g, '"'));
                }
            } catch (e) {}
            
            let countyListHTML = '<ul style="margin: 0.5rem 0; padding-left: 1.5rem;">';
            counties.forEach((county, idx) => {
                const fips = fipsCodes[idx] || 'Unknown';
                const weight = weights[fips] || 0;
                const weightText = weight > 0 ? ` (${weight.toFixed(1)}%)` : '';
                countyListHTML += `<li><strong>${county}</strong> - FIPS: ${fips}${weightText}</li>`;
            });
            countyListHTML += '</ul>';
            
            const countEl = document.getElementById('multi-county-count');
            if (countEl) countEl.textContent = counties.length;
            
            const listEl = document.getElementById('multi-county-list');
            if (listEl) listEl.innerHTML = countyListHTML;
        } else {
            multiCountyAlert.style.display = 'none';
        }
    }

    // ================================================================
    // MARKET ANALYSIS HELPERS (PRESERVED)
    // ================================================================
    function getMarketClassification(density) {
        if (density > 5000) return { name: 'Ultra High-Density Urban Core', color: '#ef4444' };
        if (density > 3000) return { name: 'High-Density Urban', color: '#f97316' };
        if (density > 1000) return { name: 'Urban', color: '#0018ff' };
        if (density > 500) return { name: 'Dense Suburban', color: '#06b6d4' };
        if (density > 200) return { name: 'Suburban', color: '#10b981' };
        if (density > 50) return { name: 'Rural Suburban', color: '#16a34a' };
        if (density > 0) return { name: 'Rural', color: '#166534' };
        return { name: 'Data Unavailable', color: '#6b7280' };
    }

    function calculateConstructionScore(population, density) {
        if (population === 0 || density === 0) return 0;
        
        let popScore = 0;
        if (population > 100000) popScore = 40;
        else if (population > 50000) popScore = 35;
        else if (population > 20000) popScore = 30;
        else if (population > 10000) popScore = 25;
        else if (population > 5000) popScore = 20;
        else if (population > 1000) popScore = 10;
        else popScore = 5;
        
        let densityScore = 0;
        if (density >= 200 && density <= 2000) {
            densityScore = 40;
        } else if (density < 200) {
            densityScore = Math.max(0, (density / 200) * 40);
        } else {
            densityScore = Math.max(0, 40 - ((density - 2000) / 100));
        }
        
        const ratio = population / density;
        let balanceScore = 0;
        if (ratio >= 0.1 && ratio <= 10) {
            balanceScore = 20;
        } else if (ratio < 0.1) {
            balanceScore = ratio * 200;
        } else {
            balanceScore = Math.max(0, 20 - (ratio - 10));
        }
        
        return Math.min(100, Math.round(popScore + densityScore + balanceScore));
    }

    function generateMarketInsights(population, density, score) {
        const insights = [];
        
        if (score >= 70) {
            insights.push('<strong>High Construction Potential:</strong> Excellent market for new development');
        } else if (score >= 40) {
            insights.push('<strong>Moderate Construction Potential:</strong> Viable market with opportunities');
        } else {
            insights.push('<strong>Limited Construction Potential:</strong> Niche market conditions');
        }
        
        if (density > 2000) {
            insights.push('<strong>Urban Density:</strong> Focus on infill and vertical development');
        } else if (density >= 200 && density <= 2000) {
            insights.push('<strong>Optimal Density:</strong> Ideal for diverse building types');
        } else if (density < 200) {
            insights.push('<strong>Low Density:</strong> Consider single-family or agricultural projects');
        }
        
        if (population > 50000) {
            insights.push('<strong>Large Population Base:</strong> Strong demand potential for residential/commercial');
        } else if (population > 10000) {
            insights.push('<strong>Medium Population:</strong> Stable market for standard construction');
        } else if (population > 0) {
            insights.push('<strong>Small Community:</strong> Focus on essential services and infrastructure');
        }
        
        return insights;
    }

    // ================================================================
    // SOLAR SITE FINDER (PRESERVED)
    // ================================================================
    function findSolarSites() {
        // TRIAL CHECK - Free Trial Rate Limiting (MANDATORY)
        console.log('🔍 findSolarSites: Checking trial status...');
        
        if (typeof TrialManager === 'undefined') {
            console.error('❌ CRITICAL: TrialManager not loaded! Trial protection disabled!');
            alert('Error: Trial system failed to load. Please refresh the page.');
            return;
        }
        
        const lookupCheck = TrialManager.canPerformLookup();
        console.log('🔍 findSolarSites: Lookup check result:', lookupCheck);
        
        if (!lookupCheck.allowed) {
            console.log('🚫 findSolarSites: Lookup blocked - showing upgrade modal');
            showUpgradeModal(lookupCheck.message);
            return;
        }
        
        console.log('✅ findSolarSites: Lookup allowed - proceeding...');
        
        if (!state.csvLoaded) {
            Notifications.show('Data is still loading. Please try again.', 'warning');
            return;
        }

        const btn = document.getElementById('solar-find-btn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = `${SVG_ICONS.search} Searching...`;
        }

        const stateFilter = document.getElementById('solar-state-filter')?.value || '';
        const maxResults = parseInt(document.getElementById('solar-max-results')?.value || '50');
        const showAllCategories = document.getElementById('solar-risk-comparison')?.checked || false;
        
        LoadingOverlay.show('Finding solar sites...');
        
        setTimeout(() => {
            try {
                const results = [];
                
                Object.entries(state.csvVelocityData).forEach(([zip, data]) => {
                    if (stateFilter && data.state_id !== stateFilter) return;
                    
                    const velocityData = getVelocityFromCSV(zip, state.selectedRiskCategory);
                    if (!velocityData || !velocityData.velocity) return;
                    
                    if (velocityData.velocity <= 120) {
                        results.push({
                            zip: zip,
                            city: data.city,
                            state: data.state_name,
                            state_id: data.state_id,
                            velocity: velocityData.velocity,
                            population: data.population,
                            density: data.density,
                            cat1: velocityData.cat1,
                            cat2: velocityData.cat2,
                            cat3: velocityData.cat3,
                            cat4: velocityData.cat4
                        });
                    }
                });
                
                results.sort((a, b) => a.velocity - b.velocity);
                
                const limitedResults = results.slice(0, maxResults);
                state.solarResults = limitedResults;
                
                displaySolarResults(limitedResults, showAllCategories);                
                // TRIAL - Record successful lookup (MANDATORY)
                if (typeof TrialManager !== 'undefined') {
                    TrialManager.recordLookup('solar_sites', stateFilter || 'all_states');
                    console.log('📝 Recorded solar sites lookup');
                } else {
                    console.error('❌ Cannot record lookup - TrialManager missing!');
                }

                
                LoadingOverlay.hide();
                Notifications.show(`Found ${limitedResults.length} solar sites with low wind speeds`, 'success');
            } catch (error) {
                console.error('Solar search error:', error);
                LoadingOverlay.hide();
                Notifications.show('Error performing solar search', 'error');
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = `${SVG_ICONS.search} Find Solar Sites`;
                }
            }
        }, 100);
    }

    function displaySolarResults(results, showAllCategories) {
        const container = document.getElementById('solar-results-container');
        if (!container) return;
        
        if (results.length === 0) {
            container.innerHTML = '<div class="empty-state">No results found. Try adjusting your filters.</div>';
            container.style.display = 'block';
            return;
        }
        
        let tableHTML = `
            <div class="results-header">
                <h3 style="color: #181E57; margin: 0;">Solar Site Results (${results.length} locations)</h3>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn-secondary" onclick="VelocityFinder.toggleResultsTable('solar-results-table')" id="solar-collapse-btn">
                        ${SVG_ICONS.chevronDown}
                        Collapse
                    </button>
                    <button class="btn-success" onclick="VelocityFinder.exportSolarResults()">
                        ${SVG_ICONS.download} Export CSV
                    </button>
                </div>
            </div>
            <div class="table-wrapper" id="solar-results-table">
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>ZIP Code</th>
                            <th>City, State</th>
                            ${showAllCategories ? '<th>Cat I</th><th>Cat II</th><th>Cat III</th><th>Cat IV</th>' : '<th>Wind Speed</th>'}
                            <th>Population</th>
                            <th>Density</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        results.forEach(result => {
            tableHTML += `
                <tr onclick="VelocityFinder.loadZIPFromTable('${result.zip}')">
                    <td><strong>${result.zip}</strong></td>
                    <td>${result.city}, ${result.state}</td>
            `;
            
            if (showAllCategories) {
                tableHTML += `
                    <td>${result.cat1 || 'N/A'} mph</td>
                    <td>${result.cat2 || 'N/A'} mph</td>
                    <td>${result.cat3 || 'N/A'} mph</td>
                    <td>${result.cat4 || 'N/A'} mph</td>
                `;
            } else {
                tableHTML += `<td>${result.velocity} mph</td>`;
            }
            
            tableHTML += `
                    <td>${result.population.toLocaleString()}</td>
                    <td>${result.density.toFixed(1)}</td>
                </tr>
            `;
        });
        
        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = tableHTML;
        container.style.display = 'block';
    }

    function exportSolarResults() {
        if (!state.solarResults || state.solarResults.length === 0) {
            Notifications.show('No solar results to export', 'warning');
            return;
        }
        
        const showAllCategories = document.getElementById('solar-risk-comparison')?.checked || false;
        
        let csvContent = showAllCategories
            ? 'ZIP Code,City,State,Category I (mph),Category II (mph),Category III (mph),Category IV (mph),Population,Density\n'
            : 'ZIP Code,City,State,Wind Speed (mph),Population,Density\n';
        
        state.solarResults.forEach(result => {
            if (showAllCategories) {
                csvContent += `${result.zip},"${result.city}",${result.state},${result.cat1 || 'N/A'},${result.cat2 || 'N/A'},${result.cat3 || 'N/A'},${result.cat4 || 'N/A'},${result.population},${result.density.toFixed(1)}\n`;
            } else {
                csvContent += `${result.zip},"${result.city}",${result.state},${result.velocity},${result.population},${result.density.toFixed(1)}\n`;
            }
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        downloadBlob(blob, `solar-sites-${Date.now()}.csv`);
        Notifications.show('Solar results exported successfully', 'success');
    }

    // ================================================================
    // ADVANCED SEARCH (PRESERVED)
    // ================================================================
    function applyAdvancedFilters() {
        // TRIAL CHECK - Free Trial Rate Limiting (MANDATORY)
        console.log('🔍 applyAdvancedFilters: Checking trial status...');
        
        if (typeof TrialManager === 'undefined') {
            console.error('❌ CRITICAL: TrialManager not loaded!');
            alert('Error: Trial system failed to load. Please refresh the page.');
            return;
        }
        
        const lookupCheck = TrialManager.canPerformLookup();
        console.log('🔍 applyAdvancedFilters: Lookup check result:', lookupCheck);
        
        if (!lookupCheck.allowed) {
            console.log('🚫 applyAdvancedFilters: Lookup blocked');
            showUpgradeModal(lookupCheck.message);
            return;
        }
        
        console.log('✅ applyAdvancedFilters: Lookup allowed - proceeding...');
        
        if (!state.csvLoaded) {
            Notifications.show('Data is still loading. Please try again.', 'warning');
            return;
        }

        const btn = document.getElementById('filter-apply-btn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = `${SVG_ICONS.search} Searching...`;
        }

        const riskCategory = document.getElementById('filter-risk-category')?.value || 'category-2';
        const windMin = parseFloat(document.getElementById('filter-wind-min')?.value) || 0;
        const windMax = parseFloat(document.getElementById('filter-wind-max')?.value) || 999;
        const popMin = parseInt(Utils.removeCommas(document.getElementById('filter-pop-min')?.value || '0'));
        const popMax = parseInt(Utils.removeCommas(document.getElementById('filter-pop-max')?.value || '999999999'));
        const densityMin = parseFloat(Utils.removeCommas(document.getElementById('filter-density-min')?.value || '0'));
        const densityMax = parseFloat(Utils.removeCommas(document.getElementById('filter-density-max')?.value || '999999'));
        const stateFilter = document.getElementById('filter-state')?.value || '';
        const maxResults = parseInt(document.getElementById('filter-max-results')?.value || '100');
        
        LoadingOverlay.show('Applying filters...');
        
        setTimeout(() => {
            try {
                const results = [];
                
                Object.entries(state.csvVelocityData).forEach(([zip, data]) => {
                    if (stateFilter && data.state_id !== stateFilter) return;
                    
                    const velocityData = getVelocityFromCSV(zip, riskCategory);
                    if (!velocityData || !velocityData.velocity) return;
                    
                    if (velocityData.velocity < windMin || velocityData.velocity > windMax) return;
                    if (data.population < popMin || data.population > popMax) return;
                    if (data.density < densityMin || data.density > densityMax) return;
                    
                    results.push({
                        zip: zip,
                        city: data.city,
                        state: data.state_name,
                        state_id: data.state_id,
                        velocity: velocityData.velocity,
                        population: data.population,
                        density: data.density,
                        county: data.county_name
                    });
                });
                
                results.sort((a, b) => a.velocity - b.velocity);
                
                const limitedResults = results.slice(0, maxResults);
                state.filterResults = limitedResults;
                
                displayFilterResults(limitedResults, riskCategory);
                
                LoadingOverlay.hide();
                Notifications.show(`Found ${limitedResults.length} matching locations`, 'success');
            } catch (error) {
                console.error('Filter error:', error);
                LoadingOverlay.hide();
                Notifications.show('Error applying filters', 'error');
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = `${SVG_ICONS.search} Apply Filters`;
                }
            }
        }, 100);
    }

    function displayFilterResults(results, riskCategory) {
        const container = document.getElementById('filter-results-container');
        if (!container) return;
        
        if (results.length === 0) {
            container.innerHTML = '<div class="empty-state">No results found. Try adjusting your filters.</div>';
            container.style.display = 'block';
            return;
        }
        
        let tableHTML = `
            <div class="results-header">
                <h3 style="color: #181E57; margin: 0;">Filter Results (${results.length} locations)</h3>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn-secondary" onclick="VelocityFinder.toggleResultsTable('filter-results-table')" id="filter-collapse-btn">
                        ${SVG_ICONS.chevronDown}
                        Collapse
                    </button>
                    <button class="btn-success" onclick="VelocityFinder.exportFilterResults()">
                        ${SVG_ICONS.download} Export CSV
                    </button>
                </div>
            </div>
            <div class="table-wrapper" id="filter-results-table">
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>ZIP Code</th>
                            <th>City, State</th>
                            <th>County</th>
                            <th>Wind Speed</th>
                            <th>Population</th>
                            <th>Density</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        results.forEach(result => {
            tableHTML += `
                <tr onclick="VelocityFinder.loadZIPFromTable('${result.zip}')">
                    <td><strong>${result.zip}</strong></td>
                    <td>${result.city}, ${result.state}</td>
                    <td>${result.county}</td>
                    <td>${result.velocity} mph</td>
                    <td>${result.population.toLocaleString()}</td>
                    <td>${result.density.toFixed(1)}</td>
                </tr>
            `;
        });
        
        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = tableHTML;
        container.style.display = 'block';
    }

    function exportFilterResults() {
        if (!state.filterResults || state.filterResults.length === 0) {
            Notifications.show('No filter results to export', 'warning');
            return;
        }
        
        let csvContent = 'ZIP Code,City,State,County,Wind Speed (mph),Population,Density\n';
        
        state.filterResults.forEach(result => {
            csvContent += `${result.zip},"${result.city}",${result.state},"${result.county}",${result.velocity},${result.population},${result.density.toFixed(1)}\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        downloadBlob(blob, `advanced-search-results-${Date.now()}.csv`);
        Notifications.show('Filter results exported successfully', 'success');
    }

    function clearFilters() {
        document.getElementById('filter-risk-category').value = 'category-2';
        document.getElementById('filter-wind-min').value = '';
        document.getElementById('filter-wind-max').value = '';
        document.getElementById('filter-pop-min').value = '';
        document.getElementById('filter-pop-max').value = '';
        document.getElementById('filter-density-min').value = '';
        document.getElementById('filter-density-max').value = '';
        document.getElementById('filter-state').value = '';
        document.getElementById('filter-max-results').value = '100';
        
        const container = document.getElementById('filter-results-container');
        if (container) container.style.display = 'none';
        
        state.filterResults = [];
        
        Notifications.show('Filters cleared', 'info');
    }

    // ================================================================
    // MULTI-ZIP COMPARISON (PRESERVED)
    // ================================================================
    function addZIPToComparison() {
        // TRIAL CHECK - Free Trial Rate Limiting (MANDATORY)
        console.log('🔍 addZIPToComparison: Checking trial status...');
        
        if (typeof TrialManager === 'undefined') {
            console.error('❌ CRITICAL: TrialManager not loaded!');
            alert('Error: Trial system failed to load. Please refresh the page.');
            return;
        }
        
        const lookupCheck = TrialManager.canPerformLookup();
        console.log('🔍 addZIPToComparison: Lookup check result:', lookupCheck);
        
        if (!lookupCheck.allowed) {
            console.log('🚫 addZIPToComparison: Lookup blocked');
            showUpgradeModal(lookupCheck.message);
            return;
        }
        
        console.log('✅ addZIPToComparison: Lookup allowed - proceeding...');
        
        const input = document.getElementById('compare-zip-input');
        if (!input) return;
        
        const zip = input.value.trim();
        const validation = Utils.validateZIPCode(zip);
        
        if (!validation.valid) {
            Notifications.show(validation.error, 'warning');
            return;
        }
        
        if (!state.csvLoaded) {
            Notifications.show('Data is still loading. Please try again.', 'warning');
            return;
        }
        
        if (state.comparisonZIPs.includes(validation.zip)) {
            Notifications.show('This ZIP code is already in the comparison list', 'warning');
            return;
        }
        
        if (state.comparisonZIPs.length >= CONFIG.maxComparisons) {
            Notifications.show(`Maximum of ${CONFIG.maxComparisons} ZIP codes allowed`, 'warning');
            return;
        }
        
        const velocityData = getVelocityFromCSV(validation.zip, state.selectedRiskCategory);
        if (!velocityData) {
            Notifications.show(`ZIP code ${validation.zip} not found in database`, 'error');
            return;
        }
        
        state.comparisonZIPs.push(validation.zip);
        input.value = '';
        
        updateComparisonDisplay();
        Notifications.show(`Added ${validation.zip} to comparison`, 'success');
    }

    function removeFromComparison(zip) {
        const index = state.comparisonZIPs.indexOf(zip);
        if (index > -1) {
            state.comparisonZIPs.splice(index, 1);
            updateComparisonDisplay();
            Notifications.show(`Removed ${zip} from comparison`, 'info');
        }
    }

    function clearComparison() {
        state.comparisonZIPs = [];
        updateComparisonDisplay();
        Notifications.show('Comparison cleared', 'info');
    }

    function updateComparisonDisplay() {
        const listContainer = document.getElementById('comparison-list');
        const tableContainer = document.getElementById('comparison-table-container');
        
        if (!listContainer || !tableContainer) return;
        
        if (state.comparisonZIPs.length === 0) {
            listContainer.innerHTML = '<div class="empty-state">No ZIP codes added yet. Enter a ZIP code above to start comparison.</div>';
            tableContainer.style.display = 'none';
            return;
        }
        
        let chipsHTML = '<div class="comparison-chips">';
        state.comparisonZIPs.forEach(zip => {
            chipsHTML += `
                <div class="comparison-chip">
                    ${zip}
                    <button class="chip-remove" onclick="VelocityFinder.removeFromComparison('${zip}')" aria-label="Remove ${zip}">
                        ${SVG_ICONS.x}
                    </button>
                </div>
            `;
        });
        chipsHTML += '</div>';
        
        chipsHTML += `
            <div class="flex-center" style="margin-top: 1rem;">
                <button class="btn-secondary" onclick="VelocityFinder.clearComparison()">
                    ${SVG_ICONS.trash} Clear All
                </button>
                <button class="btn-success" onclick="VelocityFinder.exportComparison()">
                    ${SVG_ICONS.download} Export CSV
                </button>
            </div>
        `;
        
        listContainer.innerHTML = chipsHTML;
        
        let tableHTML = `
            <h3 style="color: #181E57; margin-bottom: 1rem;">Comparison Table</h3>
            <div class="table-wrapper">
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>ZIP Code</th>
                            <th>Location</th>
                            <th>Cat I</th>
                            <th>Cat II</th>
                            <th>Cat III</th>
                            <th>Cat IV</th>
                            <th>Population</th>
                            <th>Density</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        state.comparisonZIPs.forEach(zip => {
            const data = getVelocityFromCSV(zip, state.selectedRiskCategory);
            if (data) {
                tableHTML += `
                    <tr onclick="VelocityFinder.loadZIPFromTable('${zip}')">
                        <td><strong>${zip}</strong></td>
                        <td>${data.city}, ${data.state}</td>
                        <td>${data.cat1 || 'N/A'} mph</td>
                        <td>${data.cat2 || 'N/A'} mph</td>
                        <td>${data.cat3 || 'N/A'} mph</td>
                        <td>${data.cat4 || 'N/A'} mph</td>
                        <td>${data.population.toLocaleString()}</td>
                        <td>${data.density.toFixed(1)}</td>
                    </tr>
                `;
            }
        });
        
        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;
        
        tableContainer.innerHTML = tableHTML;
        tableContainer.style.display = 'block';
    }

    function exportComparison() {
        if (state.comparisonZIPs.length === 0) {
            Notifications.show('No ZIP codes to export', 'warning');
            return;
        }
        
        let csvContent = 'ZIP Code,Location,Category I (mph),Category II (mph),Category III (mph),Category IV (mph),Population,Density\n';
        
        state.comparisonZIPs.forEach(zip => {
            const data = getVelocityFromCSV(zip, state.selectedRiskCategory);
            if (data) {
                csvContent += `${zip},"${data.city}, ${data.state}",${data.cat1 || 'N/A'},${data.cat2 || 'N/A'},${data.cat3 || 'N/A'},${data.cat4 || 'N/A'},${data.population},${data.density.toFixed(1)}\n`;
            }
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        downloadBlob(blob, `zip-comparison-${Date.now()}.csv`);
        Notifications.show('Comparison exported successfully', 'success');
    }

    // ================================================================
    // EXPORT FUNCTIONS (PRESERVED)
    // ================================================================
    function exportToPDF() {
        // TRIAL BLOCK - Exports disabled during trial
        if (typeof TrialManager === 'undefined' || true) { // Always block for trial users
            console.log('🚫 Export blocked - Trial user');
            showUpgradeModal('Export features require a paid subscription. Upgrade now for unlimited exports!');
            return;
        }
        
        const locationData = state.currentLocationData;
        if (!locationData) {
            Notifications.show('Please select a location first', 'warning');
            return;
        }
        
        const timestamp = new Date().toLocaleString();
        const zip = state.currentLocationZip || 'N/A';
        
        const marketClass = getMarketClassification(locationData.density);
        const constructionScore = calculateConstructionScore(locationData.population, locationData.density);
        
        const authorityLabel = locationData.isFBC2023 
            ? 'Florida Building Code 2023 (State Mandate)'
            : locationData.isLocalJurisdiction 
                ? 'Local Jurisdiction Override'
                : 'International Building Code';
        
        const textContent = `BUILDING INTELLIGENCE PLATFORM - COMPREHENSIVE ANALYSIS REPORT
Generated: ${timestamp}

══════════════════════════════════════════════════════════════════

LOCATION INFORMATION
ZIP Code: ${zip}
City, State: ${locationData.city}, ${locationData.state}
County: ${locationData.county} (FIPS: ${locationData.county_fips || 'N/A'})
Coordinates: ${locationData.lat.toFixed(4)}°N, ${Math.abs(locationData.lng).toFixed(4)}°W
Timezone: ${locationData.timezone || 'N/A'}
${locationData.isOverride ? `\nBuilding Code Authority: ${authorityLabel}\n` : ''}
${locationData.imprecise === 'TRUE' ? '\n⚠️ DATA QUALITY NOTICE: This ZIP code has approximate geographic boundaries.\n' : ''}

══════════════════════════════════════════════════════════════════

DEMOGRAPHICS & MARKET ANALYSIS
Population: ${locationData.population > 0 ? locationData.population.toLocaleString() : 'N/A'}
Population Density: ${locationData.density > 0 ? locationData.density.toFixed(1) + ' per sq mi' : 'N/A'}
Market Classification: ${marketClass.name}
Construction Potential Score: ${constructionScore}/100

══════════════════════════════════════════════════════════════════

WIND VELOCITY ANALYSIS - ALL RISK CATEGORIES
${locationData.isOverride ? `\n⚠️ OVERRIDE: ${authorityLabel}\n` : ''}

Category I (Agricultural, Temporary):
  Wind Speed: ${locationData.cat1 || 'N/A'} mph
  Design Pressure: ${locationData.cat1 ? Utils.calculatePressure(locationData.cat1) + ' psf' : 'N/A'}

Category II (Standard Buildings):
  Wind Speed: ${locationData.cat2 || 'N/A'} mph
  Design Pressure: ${locationData.cat2 ? Utils.calculatePressure(locationData.cat2) + ' psf' : 'N/A'}

Category III (Schools, Hospitals):
  Wind Speed: ${locationData.cat3 || 'N/A'} mph
  Design Pressure: ${locationData.cat3 ? Utils.calculatePressure(locationData.cat3) + ' psf' : 'N/A'}

Category IV (Essential Facilities):
  Wind Speed: ${locationData.cat4 || 'N/A'} mph
  Design Pressure: ${locationData.cat4 ? Utils.calculatePressure(locationData.cat4) + ' psf' : 'N/A'}

══════════════════════════════════════════════════════════════════

This comprehensive report was generated by Building Intelligence Platform
Visit: https://windloadcalc.com/building-intelligence-platform
Phone: (833) 272-3946`;

        const blob = new Blob([textContent], { type: 'text/plain' });
        downloadBlob(blob, `building-intelligence-report-${zip}-${Date.now()}.txt`);
        Notifications.show('Report exported successfully', 'success');
    }

    function exportToExcel() {
        // TRIAL BLOCK - Exports disabled during trial
        if (typeof TrialManager === 'undefined' || true) { // Always block for trial users
            console.log('🚫 Export blocked - Trial user');
            showUpgradeModal('Export features require a paid subscription. Upgrade now for unlimited exports!');
            return;
        }
        
        const locationData = state.currentLocationData;
        if (!locationData) {
            Notifications.show('Please select a location first', 'warning');
            return;
        }
        
        const timestamp = new Date().toLocaleString();
        const zip = state.currentLocationZip || 'N/A';
        
        const marketClass = getMarketClassification(locationData.density);
        const constructionScore = calculateConstructionScore(locationData.population, locationData.density);
        
        const authorityLabel = locationData.isFBC2023 
            ? 'Florida Building Code 2023'
            : locationData.isLocalJurisdiction 
                ? 'Local Jurisdiction'
                : 'International Building Code';
        
        const csvContent = `Building Intelligence Platform - Comprehensive Analysis Report
Generated,${timestamp}

LOCATION INFORMATION
ZIP Code,${zip}
City,${locationData.city}
State,${locationData.state}
County,${locationData.county}
County FIPS,${locationData.county_fips || 'N/A'}
Latitude,${locationData.lat.toFixed(4)}
Longitude,${locationData.lng.toFixed(4)}
Timezone,${locationData.timezone || 'N/A'}
${locationData.isOverride ? `Building Code Authority,${authorityLabel}\n` : ''}

DEMOGRAPHICS & MARKET ANALYSIS
Population,${locationData.population || 'N/A'}
Density (per sq mi),${locationData.density > 0 ? locationData.density.toFixed(1) : 'N/A'}
Market Classification,${marketClass.name}
Construction Potential Score,${constructionScore}/100

WIND VELOCITY - ALL RISK CATEGORIES
Risk Category,Wind Speed (mph),Design Pressure (psf)
Category I,${locationData.cat1 || 'N/A'},${locationData.cat1 ? Utils.calculatePressure(locationData.cat1) : 'N/A'}
Category II,${locationData.cat2 || 'N/A'},${locationData.cat2 ? Utils.calculatePressure(locationData.cat2) : 'N/A'}
Category III,${locationData.cat3 || 'N/A'},${locationData.cat3 ? Utils.calculatePressure(locationData.cat3) : 'N/A'}
Category IV,${locationData.cat4 || 'N/A'},${locationData.cat4 ? Utils.calculatePressure(locationData.cat4) : 'N/A'}`;

        const blob = new Blob([csvContent], { type: 'text/csv' });
        downloadBlob(blob, `building-intelligence-data-${zip}-${Date.now()}.csv`);
        Notifications.show('Data exported successfully', 'success');
    }

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ================================================================
    // RISK CATEGORY SELECTION (PRESERVED)
    // ================================================================
    function selectRisk(category, event) {
        const riskOptions = document.querySelectorAll('.risk-option');
        if (riskOptions) {
            riskOptions.forEach(opt => opt.classList.remove('selected'));
        }
        
        let targetElement = null;
        if (event && event.target) {
            targetElement = event.target.closest('.risk-option');
        }
        
        if (!targetElement) {
            const categoryMap = {
                'category-1': 'risk-category-1',
                'category-2': 'risk-category-2', 
                'category-3': 'risk-category-3',
                'category-4': 'risk-category-4'
            };
            const elementId = categoryMap[category];
            if (elementId) {
                targetElement = document.getElementById(elementId);
            }
        }
        
        if (targetElement) {
            targetElement.classList.add('selected');
        }
        
        state.selectedRiskCategory = category;
        
        const mapRiskIndicator = document.getElementById('map-risk-indicator');
        if (mapRiskIndicator) {
            mapRiskIndicator.textContent = Utils.getRiskCategoryName(category);
        }
        
        clearMarkers();
        addCSVSampleMarkers();
        
        if (DOM.velocityResults && DOM.velocityResults.classList.contains('show')) {
            const currentInput = DOM.locationInput;
            if (currentInput && currentInput.value) {
                findVelocity();
            }
        }
    }

    // ================================================================
    // SMOOTH SCROLL FUNCTION (PRESERVED)
    // ================================================================
    function scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 150; // Adjust this value as needed (pixels from top)
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // ================================================================
    // HELPER FUNCTIONS (PRESERVED)
    // ================================================================
    function loadZIPFromTable(zip) {
        if (DOM.locationInput) {
            DOM.locationInput.value = zip;
            findVelocity();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    function toggleResultsTable(tableId) {
        const table = document.getElementById(tableId);
        const btnId = tableId.replace('-table', '-btn');
        const btn = document.getElementById(btnId);
        
        if (!table || !btn) return;
        
        if (table.style.display === 'none') {
            table.style.display = 'block';
            btn.innerHTML = `${SVG_ICONS.chevronDown} Collapse`;
        } else {
            table.style.display = 'none';
            btn.innerHTML = `${SVG_ICONS.chevronDown} Expand`;
        }
    }

    function populateStateDropdowns() {
        const stateSet = new Set();
        Object.values(state.csvVelocityData).forEach(data => {
            if (data.state_id) {
                stateSet.add(`${data.state_id}|${data.state_name}`);
            }
        });
        
        const states = Array.from(stateSet).sort();
        
        const solarStateFilter = document.getElementById('solar-state-filter');
        const filterState = document.getElementById('filter-state');
        
        states.forEach(stateData => {
            const [stateId, stateName] = stateData.split('|');
            
            if (solarStateFilter) {
                const option = document.createElement('option');
                option.value = stateId;
                option.textContent = stateName;
                solarStateFilter.appendChild(option);
            }
            
            if (filterState) {
                const option = document.createElement('option');
                option.value = stateId;
                option.textContent = stateName;
                filterState.appendChild(option);
            }
        });
        
        console.log(`✅ Populated state dropdowns with ${states.length} states`);
    }

    function setupNumberFormatting() {
        const inputs = [
            document.getElementById('filter-pop-min'),
            document.getElementById('filter-pop-max'),
            document.getElementById('filter-density-min'),
            document.getElementById('filter-density-max')
        ].filter(el => el !== null);
        
        inputs.forEach(input => {
            input.addEventListener('input', function(e) {
                const cursorPos = this.selectionStart;
                const oldLength = this.value.length;
                
                const numValue = Utils.removeCommas(this.value);
                if (numValue && !isNaN(numValue)) {
                    this.value = Utils.formatNumberWithCommas(numValue);
                    
                    const newLength = this.value.length;
                    const diff = newLength - oldLength;
                    this.setSelectionRange(cursorPos + diff, cursorPos + diff);
                }
            });
            
            input.addEventListener('blur', function(e) {
                const numValue = Utils.removeCommas(this.value);
                if (numValue && !isNaN(numValue)) {
                    this.value = Utils.formatNumberWithCommas(numValue);
                }
            });
        });
    }

    // ================================================================
    // INITIALIZATION
    // ================================================================
    function createBuildingIntelligencePlatformHTML(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return;
        }

        container.innerHTML = generateBuildingIntelligencePlatformHTML();
        
        setTimeout(() => {
            cacheDOMElements();
            
            // Setup event listeners
            if (DOM.locationInput) {
                DOM.locationInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        findVelocity();
                    }
                });
            }
            
            if (DOM.compareZipInput) {
                DOM.compareZipInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        addZIPToComparison();
                    }
                });
            }

            if (DOM.hurricaneZipInput) {
                DOM.hurricaneZipInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        analyzeHurricaneRisk();
                    }
                });
            }

            if (DOM.hurricaneNLSearch) {
                DOM.hurricaneNLSearch.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        processNaturalLanguageSearch();
                    }
                });
            }
            
            // Initialize map
            initializeMap();
            
            console.log('✅ Building Intelligence Platform initialized successfully!');
            console.log('✅ ASCE 7-22 standards applied');
            console.log('✅ Hurricane Risk Intelligence feature added');
            console.log('✅ AI-powered analysis enabled');
            console.log('✅ All original features preserved');
            console.log('✅ Open/Close toggle system implemented');
            console.log('✅ All sections start collapsed by default');
        }, 100);
    }

    // ================================================================
    // WRAPPER FUNCTION FOR HURRICANE AI INTEGRATION
    // ================================================================
    function processNaturalLanguageSearchWrapper() {
        if (typeof window.processNaturalLanguageSearch === 'function') {
            window.processNaturalLanguageSearch();
        } else {
            console.error('❌ hurricane-ai-complete.js not loaded!');
            Notifications.show('Hurricane AI system not loaded.', 'error');
        }
    }

    // ================================================================
    // EXPOSE HURRICANE_DATABASE GLOBALLY (MUST BE BEFORE RETURN!)
    // ================================================================
    window.HURRICANE_DATABASE = HURRICANE_DATABASE;

    // ================================================================
    // PUBLIC API
    // ================================================================
    return {
        // Initialization
        init: createBuildingIntelligencePlatformHTML,
        
        // NEW: Toggle feature sections
        toggleFeatureSection: toggleFeatureSection,
        
        // Velocity Finder (PRESERVED)
        findVelocity: findVelocity,
        findVelocityByCoordinates: findVelocityByCoordinates,
        selectRisk: selectRisk,
        toggleMapLayer: toggleMapLayer,
        exportToPDF: exportToPDF,
        exportToExcel: exportToExcel,
        scrollToSection: scrollToSection,
        
        // Solar Site Finder (PRESERVED)
        findSolarSites: findSolarSites,
        exportSolarResults: exportSolarResults,
        
        // Advanced Search (PRESERVED)
        applyAdvancedFilters: applyAdvancedFilters,
        clearFilters: clearFilters,
        exportFilterResults: exportFilterResults,
        
        // Multi-ZIP Comparison (PRESERVED)
        addZIPToComparison: addZIPToComparison,
        removeFromComparison: removeFromComparison,
        clearComparison: clearComparison,
        exportComparison: exportComparison,
        
        // Hurricane Risk Intelligence Functions (PRESERVED)
        analyzeHurricaneRisk: analyzeHurricaneRisk,
        generateAIHurricaneReport: generateAIHurricaneReport,
        setHurricaneMapMode: setHurricaneMapMode,
        processNaturalLanguageSearch: processNaturalLanguageSearchWrapper,
        filterHurricanes: filterHurricanes,
        showHurricaneDetails: showHurricaneDetails,
        playHurricaneAnimation: playHurricaneAnimation,
        stopHurricaneAnimation: stopHurricaneAnimation,
        animateSpecificHurricane: animateSpecificHurricane,
        exportHurricaneData: exportHurricaneData,
        downloadReport: downloadReport,
        
        // Helper (PRESERVED)
        loadZIPFromTable: loadZIPFromTable,
        toggleResultsTable: toggleResultsTable
    };
})();