// curated-locations.js - Enhanced with 50+ US locations
const CuratedLocations = (function() {
    'use strict';

    // Comprehensive location database with 50+ US locations
    const locations = {
        // Florida locations with accurate coordinates
        '33109': { 
            asce: 180, local: 175, jurisdiction: 'Miami-Dade County', 
            specialRequirement: 'High-Velocity Hurricane Zone - Additional testing required for impact resistance', 
            lat: 25.7617, lng: -80.1918,
            ccRequirements: {
                allowsNominal: true,
                stormShuttersRequired: true,
                impactResistanceRequired: true,
                buildingCode: 'Florida Building Code',
                nominalFactor: 0.6,
                specialNotes: 'HVHZ - Impact-resistant windows or storm shutters mandatory. Nominal pressures accepted for C&C design per FBC.'
            }
        },
        '33301': { 
            asce: 175, local: 156, jurisdiction: 'Broward County', 
            specialRequirement: 'High-Velocity Hurricane Zone - Enhanced wind resistance standards', 
            lat: 26.1224, lng: -80.1373,
            ccRequirements: {
                allowsNominal: true,
                stormShuttersRequired: true,
                impactResistanceRequired: true,
                buildingCode: 'Florida Building Code',
                nominalFactor: 0.6,
                specialNotes: 'HVHZ - All openings must meet impact standards. Storm shutters required if windows not impact-rated.'
            }
        },
        '34112': { 
            asce: 185, local: 195, jurisdiction: 'Collier County', 
            specialRequirement: 'Local Authority Override - See Collier County wind speed maps for specific requirements', 
            lat: 26.1420, lng: -81.7948,
            ccRequirements: {
                allowsNominal: true,
                stormShuttersRequired: true,
                impactResistanceRequired: true,
                buildingCode: 'Florida Building Code + Local Amendments',
                nominalFactor: 0.6,
                specialNotes: 'Enhanced requirements beyond FBC. Storm shutters mandatory for all openings. Nominal pressures accepted but verify local amendments.'
            }
        },
        '32801': { 
            asce: 150, local: 160, jurisdiction: 'Orange County, FL', 
            specialRequirement: 'Hurricane region - Special fastener requirements for roof systems', 
            lat: 28.5383, lng: -81.3792,
            ccRequirements: {
                allowsNominal: true,
                stormShuttersRequired: true,
                impactResistanceRequired: true,
                buildingCode: 'Florida Building Code',
                nominalFactor: 0.6,
                specialNotes: 'FBC nominal pressures accepted. Impact-resistant openings or storm shutters required for all habitable rooms.'
            }
        },
        '33401': { 
            asce: 175, local: 170, jurisdiction: 'Palm Beach County', 
            specialRequirement: 'High-Velocity Hurricane Zone - Impact resistance required', 
            lat: 26.7056, lng: -80.0364,
            ccRequirements: {
                allowsNominal: true,
                stormShuttersRequired: true,
                impactResistanceRequired: true,
                buildingCode: 'Florida Building Code',
                nominalFactor: 0.6,
                specialNotes: 'HVHZ requirements apply. All glazing must meet impact standards.'
            }
        },
        '33602': { 
            asce: 150, local: 155, jurisdiction: 'Hillsborough County, FL', 
            specialRequirement: 'Hurricane region - Enhanced tie-down requirements', 
            lat: 27.9506, lng: -82.4572,
            ccRequirements: {
                allowsNominal: true,
                stormShuttersRequired: true,
                impactResistanceRequired: true,
                buildingCode: 'Florida Building Code',
                nominalFactor: 0.6,
                specialNotes: 'Hurricane region requirements. Storm shutters or impact glazing required.'
            }
        },
        '32114': { 
            asce: 140, local: 145, jurisdiction: 'Volusia County, FL', 
            specialRequirement: 'Hurricane region - Special provisions for coastal construction', 
            lat: 29.2108, lng: -81.0228,
            ccRequirements: {
                allowsNominal: true,
                stormShuttersRequired: true,
                impactResistanceRequired: true,
                buildingCode: 'Florida Building Code',
                nominalFactor: 0.6,
                specialNotes: 'Coastal construction requirements apply. Enhanced fastening for roof systems.'
            }
        },
        
        // Major US cities with accurate coordinates
        '10001': { 
            asce: 115, local: 115, jurisdiction: 'New York City', 
            specialRequirement: null, 
            lat: 40.7505, lng: -73.9934,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'NYC Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required for all C&C design. No nominal pressure provisions.'
            }
        },
        '10013': { 
            asce: 115, local: 115, jurisdiction: 'Manhattan, NY', 
            specialRequirement: null, 
            lat: 40.7195, lng: -74.0033,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'NYC Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required. High-rise wind tunnel testing may be required.'
            }
        },
        '11201': { 
            asce: 115, local: 115, jurisdiction: 'Brooklyn, NY', 
            specialRequirement: null, 
            lat: 40.6901, lng: -73.9956,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'NYC Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required for all applications.'
            }
        },
        '90210': { 
            asce: 85, local: 85, jurisdiction: 'Los Angeles County', 
            specialRequirement: null, 
            lat: 34.0901, lng: -118.4065,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'California Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required. Seismic design typically governs over wind.'
            }
        },
        '90001': { 
            asce: 85, local: 85, jurisdiction: 'Los Angeles, CA', 
            specialRequirement: null, 
            lat: 33.9731, lng: -118.2479,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'California Building Code',
                nominalFactor: null,
                specialNotes: 'Low wind speeds. Seismic considerations typically govern structural design.'
            }
        },
        '94102': { 
            asce: 85, local: 85, jurisdiction: 'San Francisco, CA', 
            specialRequirement: null, 
            lat: 37.7849, lng: -122.4094,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'San Francisco Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required. Seismic design governs over wind loads.'
            }
        },
        '60601': { 
            asce: 90, local: 90, jurisdiction: 'City of Chicago', 
            specialRequirement: null, 
            lat: 41.8825, lng: -87.6441,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Chicago Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required for all applications. No nominal pressure allowances.'
            }
        },
        '60605': { 
            asce: 90, local: 90, jurisdiction: 'Cook County, IL', 
            specialRequirement: null, 
            lat: 41.8708, lng: -87.6505,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Chicago Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required. Enhanced requirements for high-rise buildings.'
            }
        },
        '77001': { 
            asce: 130, local: 130, jurisdiction: 'Harris County', 
            specialRequirement: 'Hurricane prone region - Enhanced tie-down requirements', 
            lat: 29.7589, lng: -95.3677,
            ccRequirements: {
                allowsNominal: true,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Texas Building Code',
                nominalFactor: 0.6,
                specialNotes: 'Nominal pressures accepted for windows and doors. Storm shutters not required but recommended.'
            }
        },
        '77002': { 
            asce: 130, local: 130, jurisdiction: 'Houston, TX', 
            specialRequirement: 'Hurricane prone region - Gulf Coast provisions', 
            lat: 29.7604, lng: -95.3698,
            ccRequirements: {
                allowsNominal: true,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Texas Building Code',
                nominalFactor: 0.6,
                specialNotes: 'Gulf Coast hurricane region. Enhanced anchorage requirements for mobile structures.'
            }
        },
        '78701': { 
            asce: 90, local: 95, jurisdiction: 'Austin, TX', 
            specialRequirement: null, 
            lat: 32.7767, lng: -96.7970,
            ccRequirements: {
                allowsNominal: true,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Texas Building Code',
                nominalFactor: 0.6,
                specialNotes: 'Inland Texas. Standard ASCE 7 requirements with nominal pressure allowances.'
            }
        },
        '30301': { 
            asce: 90, local: 90, jurisdiction: 'Fulton County', 
            specialRequirement: null, 
            lat: 33.7537, lng: -84.3901,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Georgia State Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required. Standard ASCE 7 procedures apply.'
            }
        },
        '30309': { 
            asce: 90, local: 90, jurisdiction: 'Atlanta, GA', 
            specialRequirement: null, 
            lat: 33.7851, lng: -84.3733,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Georgia State Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required for all C&C applications.'
            }
        },
        '29401': { 
            asce: 140, local: 155, jurisdiction: 'Charleston County, SC', 
            specialRequirement: 'Coastal wind zone - Additional testing for windows and doors required', 
            lat: 32.7765, lng: -79.9311,
            ccRequirements: {
                allowsNominal: true,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'South Carolina Building Code',
                nominalFactor: 0.6,
                specialNotes: 'Nominal pressures accepted with enhanced testing requirements. Storm shutters recommended but not required.'
            }
        },
        '28202': { 
            asce: 100, local: 105, jurisdiction: 'Charlotte, NC', 
            specialRequirement: null, 
            lat: 35.2271, lng: -80.8431,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'North Carolina Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required per North Carolina amendments.'
            }
        },
        '27601': { 
            asce: 100, local: 110, jurisdiction: 'Raleigh, NC', 
            specialRequirement: null, 
            lat: 35.7796, lng: -78.6382,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'North Carolina Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required. Inland North Carolina provisions.'
            }
        },
        '70112': { 
            asce: 120, local: 135, jurisdiction: 'Orleans Parish, LA', 
            specialRequirement: 'Hurricane region - Mandatory wind-resistant construction standards', 
            lat: 29.9511, lng: -90.0715,
            ccRequirements: {
                allowsNominal: true,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Louisiana State Building Code',
                nominalFactor: 0.6,
                specialNotes: 'Nominal pressures accepted for C&C. Enhanced anchorage requirements for hurricane resistance.'
            }
        },
        '70115': { 
            asce: 120, local: 135, jurisdiction: 'New Orleans, LA', 
            specialRequirement: 'Hurricane region - Post-Katrina enhanced standards', 
            lat: 29.9140, lng: -90.0624,
            ccRequirements: {
                allowsNominal: true,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Louisiana State Building Code',
                nominalFactor: 0.6,
                specialNotes: 'Enhanced post-Katrina construction standards. Nominal pressures accepted.'
            }
        },
        '75201': { 
            asce: 90, local: 95, jurisdiction: 'Dallas County, TX', 
            specialRequirement: 'Enhanced requirements for high-rise buildings over 150 feet', 
            lat: 32.7767, lng: -96.7970,
            ccRequirements: {
                allowsNominal: true,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Texas Building Code',
                nominalFactor: 0.6,
                specialNotes: 'Nominal pressures accepted for standard applications. Ultimate pressures required for high-rise buildings.'
            }
        },
        '76101': { 
            asce: 90, local: 95, jurisdiction: 'Fort Worth, TX', 
            specialRequirement: null, 
            lat: 32.7555, lng: -97.3308,
            ccRequirements: {
                allowsNominal: true,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Texas Building Code',
                nominalFactor: 0.6,
                specialNotes: 'Standard Texas provisions. Nominal pressures accepted for C&C design.'
            }
        },
        
        // Additional cities for broader coverage
        '80202': { 
            asce: 90, local: 90, jurisdiction: 'City and County of Denver', 
            specialRequirement: null, 
            lat: 39.7392, lng: -104.9903,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Denver Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required. High altitude and terrain considerations apply.'
            }
        },
        '80301': { 
            asce: 90, local: 90, jurisdiction: 'Boulder, CO', 
            specialRequirement: 'High altitude - Terrain effects may apply', 
            lat: 40.0150, lng: -105.2705,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Colorado Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required. Consider topographic factor for exposed ridges.'
            }
        },
        '84101': { 
            asce: 90, local: 90, jurisdiction: 'Salt Lake City, UT', 
            specialRequirement: null, 
            lat: 40.7608, lng: -111.8910,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Utah Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required. Mountain terrain considerations may apply.'
            }
        },
        '85001': { 
            asce: 85, local: 85, jurisdiction: 'Phoenix, AZ', 
            specialRequirement: null, 
            lat: 33.4484, lng: -112.0740,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Arizona Building Code',
                nominalFactor: null,
                specialNotes: 'Low wind speeds. Ultimate pressures required per Arizona amendments.'
            }
        },
        '89101': { 
            asce: 85, local: 85, jurisdiction: 'Las Vegas, NV', 
            specialRequirement: null, 
            lat: 36.1699, lng: -115.1398,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Nevada Building Code',
                nominalFactor: null,
                specialNotes: 'Desert region. Ultimate wind pressures required for all applications.'
            }
        },
        '98101': { 
            asce: 85, local: 85, jurisdiction: 'City of Seattle', 
            specialRequirement: null, 
            lat: 47.6062, lng: -122.3321,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Seattle Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required. Seismic design typically governs over wind loads.'
            }
        },
        '97201': { 
            asce: 85, local: 85, jurisdiction: 'Portland, OR', 
            specialRequirement: null, 
            lat: 45.5152, lng: -122.6784,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Oregon Building Code',
                nominalFactor: null,
                specialNotes: 'Pacific Northwest. Ultimate pressures required per Oregon amendments.'
            }
        },
        '02101': { 
            asce: 110, local: 110, jurisdiction: 'City of Boston', 
            specialRequirement: null, 
            lat: 42.3601, lng: -71.0589,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Massachusetts Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required for all C&C applications.'
            }
        },
        '02139': { 
            asce: 110, local: 110, jurisdiction: 'Cambridge, MA', 
            specialRequirement: null, 
            lat: 42.3736, lng: -71.1097,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Massachusetts Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required. Enhanced requirements for institutional buildings.'
            }
        },
        '19101': { 
            asce: 100, local: 100, jurisdiction: 'Philadelphia, PA', 
            specialRequirement: null, 
            lat: 39.9526, lng: -75.1652,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Philadelphia Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required per Philadelphia amendments.'
            }
        },
        '20001': { 
            asce: 100, local: 100, jurisdiction: 'Washington, DC', 
            specialRequirement: null, 
            lat: 38.9072, lng: -77.0369,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'DC Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required for all federal district applications.'
            }
        },
        '21201': { 
            asce: 100, local: 100, jurisdiction: 'Baltimore, MD', 
            specialRequirement: null, 
            lat: 39.2904, lng: -76.6122,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Maryland Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required per Maryland state amendments.'
            }
        },
        '23219': { 
            asce: 100, local: 105, jurisdiction: 'Richmond, VA', 
            specialRequirement: null, 
            lat: 37.5407, lng: -77.4360,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Virginia Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required. Inland Virginia provisions apply.'
            }
        },
        '37201': { 
            asce: 90, local: 90, jurisdiction: 'Nashville, TN', 
            specialRequirement: null, 
            lat: 36.1627, lng: -86.7816,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Tennessee Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required per Tennessee state code.'
            }
        },
        '38103': { 
            asce: 90, local: 90, jurisdiction: 'Memphis, TN', 
            specialRequirement: null, 
            lat: 35.1495, lng: -90.0490,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Tennessee Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate pressures required. Mississippi River valley considerations.'
            }
        },
        '40202': { 
            asce: 90, local: 90, jurisdiction: 'Louisville, KY', 
            specialRequirement: null, 
            lat: 38.2527, lng: -85.7585,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Kentucky Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required per Kentucky amendments.'
            }
        },
        '45202': { 
            asce: 90, local: 90, jurisdiction: 'Cincinnati, OH', 
            specialRequirement: null, 
            lat: 39.1031, lng: -84.5120,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Ohio Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required for all Ohio applications.'
            }
        },
        '43215': { 
            asce: 90, local: 90, jurisdiction: 'Columbus, OH', 
            specialRequirement: null, 
            lat: 39.9612, lng: -82.9988,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Ohio Building Code',
                nominalFactor: null,
                specialNotes: 'Standard Ohio requirements. Ultimate pressures for all C&C elements.'
            }
        },
        '44113': { 
            asce: 90, local: 90, jurisdiction: 'Cleveland, OH', 
            specialRequirement: null, 
            lat: 41.4993, lng: -81.6944,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Ohio Building Code',
                nominalFactor: null,
                specialNotes: 'Great Lakes region. Ultimate pressures required with lake effect considerations.'
            }
        },
        '48202': { 
            asce: 90, local: 90, jurisdiction: 'Detroit, MI', 
            specialRequirement: null, 
            lat: 42.3314, lng: -83.0458,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Michigan Building Code',
                nominalFactor: null,
                specialNotes: 'Great Lakes wind effects. Ultimate pressures required per Michigan code.'
            }
        },
        '53202': { 
            asce: 90, local: 90, jurisdiction: 'Milwaukee, WI', 
            specialRequirement: null, 
            lat: 43.0389, lng: -87.9065,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Wisconsin Building Code',
                nominalFactor: null,
                specialNotes: 'Lake Michigan shoreline. Ultimate pressures with enhanced exposure considerations.'
            }
        },
        '55401': { 
            asce: 90, local: 90, jurisdiction: 'Minneapolis, MN', 
            specialRequirement: null, 
            lat: 44.9778, lng: -93.2650,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Minnesota Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required. Cold climate construction considerations.'
            }
        },
        '68102': { 
            asce: 90, local: 90, jurisdiction: 'Omaha, NE', 
            specialRequirement: null, 
            lat: 41.2565, lng: -95.9345,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Nebraska Building Code',
                nominalFactor: null,
                specialNotes: 'Great Plains region. Ultimate pressures with prairie exposure considerations.'
            }
        },
        '64108': { 
            asce: 90, local: 90, jurisdiction: 'Kansas City, MO', 
            specialRequirement: null, 
            lat: 39.0997, lng: -94.5786,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Missouri Building Code',
                nominalFactor: null,
                specialNotes: 'Midwest region. Ultimate pressures required per Missouri amendments.'
            }
        },
        '63101': { 
            asce: 90, local: 90, jurisdiction: 'St. Louis, MO', 
            specialRequirement: null, 
            lat: 38.6270, lng: -90.1994,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Missouri Building Code',
                nominalFactor: null,
                specialNotes: 'Mississippi River valley. Ultimate pressures for all applications.'
            }
        },
        '50309': { 
            asce: 90, local: 90, jurisdiction: 'Des Moines, IA', 
            specialRequirement: null, 
            lat: 41.5868, lng: -93.6250,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Iowa Building Code',
                nominalFactor: null,
                specialNotes: 'Agricultural region. Ultimate pressures with rural exposure considerations.'
            }
        },
        '73102': { 
            asce: 90, local: 95, jurisdiction: 'Oklahoma City, OK', 
            specialRequirement: 'Tornado alley - Enhanced safe room provisions', 
            lat: 35.4676, lng: -97.5164,
            ccRequirements: {
                allowsNominal: true,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'Oklahoma Building Code',
                nominalFactor: 0.6,
                specialNotes: 'Tornado region. Enhanced safe room and storm shelter requirements.'
            }
        },
        '87101': { 
            asce: 85, local: 85, jurisdiction: 'Albuquerque, NM', 
            specialRequirement: null, 
            lat: 35.0844, lng: -106.6504,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'New Mexico Building Code',
                nominalFactor: null,
                specialNotes: 'High desert region. Ultimate pressures with high altitude considerations.'
            }
        },
        
        'default': { 
            asce: 115, local: 115, jurisdiction: 'Standard ASCE 7 Area', 
            specialRequirement: null, 
            lat: 39.8283, lng: -98.5795,
            ccRequirements: {
                allowsNominal: false,
                stormShuttersRequired: false,
                impactResistanceRequired: false,
                buildingCode: 'International Building Code',
                nominalFactor: null,
                specialNotes: 'Ultimate wind pressures required per IBC. No nominal pressure provisions.'
            }
        }
    };

    return {
        locations: locations
    };
})();

window.CuratedLocations = CuratedLocations;