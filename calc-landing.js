/**
 * =================================================================
 * CALC-LANDING.JS - REFERENCE ONLY
 * =================================================================
 * This file is NO LONGER LINKED in wind-load-calculator-landing.html
 * All scripts are now inline in the HTML file.
 * 
 * Header-related functions have been REMOVED:
 * - initializeHeaderScroll() function
 * - Smooth scrolling code
 * 
 * Only landing-specific functionality remains below for reference:
 * - Video background controls
 * - Calculator category tabs
 * - FAQ accordion
 * - Testimonial slider
 * - Demo interactions
 * 
 * Last Updated: Header Update Script
 * =================================================================
 */

// ============================================
// WIND LOAD CALCULATOR LANDING PAGE - JAVASCRIPT
// Handles navigation, panels, tabs, accordion, scroll animations, and all interactions
// ============================================

// ============================================
// CATEGORY PANEL DATA
// ============================================

const categoryData = {
    windows: {
        title: "Windows, Doors & Storm Shutters",
        link: "wind-load-calculator-shop.html#windows-details",
        tabs: {
            overview: {
                title: "Overview",
                content: `
                    <div class="panel-overview">
                        <div class="panel-price-box">
                            <div class="panel-price">$29.99<span>/month</span></div>
                            <div class="panel-price-annual">or $24.99/month billed annually</div>
                            <div class="panel-badge live">✓ LIVE NOW</div>
                        </div>
                        
                        <p class="panel-description">Complete Components & Cladding analysis for windows, doors, and storm shutters on vertical walls. Includes all ASCE 7-22 provisions, state-specific certification modules, and automatic compliance verification.</p>
                        
                        <h4>Key Benefits</h4>
                        <ul class="panel-benefits">
                            <li>12 professional calculators for all vertical wall components</li>
                            <li>Automatic ASCE 7-22 compliance (Chapters 26 & 30)</li>
                            <li>State-specific certifications (FL, LA, NC, SC, HI)</li>
                            <li>Product certification management with bulk features</li>
                            <li>Professional reports in PDF, Excel, CSV, Print formats</li>
                            <li>Unlimited projects, components, and exports</li>
                        </ul>
                    </div>
                `
            },
            included: {
                title: "What's Included",
                content: `
                    <div class="panel-included">
                        <h4>12 Professional Calculators</h4>
                        <div class="calculator-groups">
                            <div class="calc-group">
                                <h5>Windows</h5>
                                <ul>
                                    <li>Fixed Windows (all sizes, all zones)</li>
                                    <li>Operable Windows (awning, casement, sliding)</li>
                                    <li>Window Assemblies (multiple units with mullions)</li>
                                </ul>
                            </div>
                            
                            <div class="calc-group">
                                <h5>Doors</h5>
                                <ul>
                                    <li>Entry Doors (single, double, with sidelights)</li>
                                    <li>Sliding Glass Doors (2-panel, 3-panel, 4-panel)</li>
                                    <li>French Doors (single swing, double swing)</li>
                                    <li>Overhead Doors (sectional, rolling, coiling)</li>
                                </ul>
                            </div>
                            
                            <div class="calc-group">
                                <h5>Wall Systems & Protection</h5>
                                <ul>
                                    <li>Storefront Systems (glazing and framing)</li>
                                    <li>Curtain Wall Components (vision glass, spandrel)</li>
                                    <li>Storm Shutters (accordion, panel, rolling)</li>
                                    <li>Impact-Resistant Assemblies (all types)</li>
                                    <li>Exterior Wall Cladding (siding, panels, EIFS)</li>
                                </ul>
                            </div>
                        </div>
                        
                        <h4>ASCE 7-22 Compliance Features</h4>
                        <ul class="feature-list">
                            <li>Dual figure support: 30.3-1 (≤60 ft) and 30.4-1 (>60 ft)</li>
                            <li>Smart Zone 4 & 5 pressure calculations</li>
                            <li>Logarithmic GCp interpolation (10-500+ sq ft effective areas)</li>
                            <li>All exposure categories (B, C, D)</li>
                            <li>All enclosure classifications (enclosed, partially enclosed, open)</li>
                            <li>Complete pressure coefficients (Kz, Kzt, Kd, Ke, GCp, GCpi)</li>
                            <li>Automatic load case generation (all GCpi combinations)</li>
                            <li>Critical pressure identification</li>
                        </ul>
                        
                        <h4>Professional Reports</h4>
                        <ul class="feature-list">
                            <li>Auto-generated engineering documentation</li>
                            <li>Live updates as components added</li>
                            <li>Custom company logo branding</li>
                            <li>Export: PDF, Excel, CSV, Print</li>
                            <li>Executive summary + detailed calculations</li>
                            <li>Code compliance certification statement</li>
                        </ul>
                    </div>
                `
            },
            states: {
                title: "State Modules",
                content: `
                    <div class="panel-states">
                        <p class="panel-intro">State-specific certification modules that no competitor offers:</p>
                        
                        <div class="state-modules">
                            <div class="state-module">
                                <h5>Florida Building Code (FBC 2023/2024)</h5>
                                <ul>
                                    <li>Product Approval (FL#) tracking and verification</li>
                                    <li>Miami-Dade Notice of Acceptance (NOA) documentation</li>
                                    <li>High Velocity Hurricane Zone (HVHZ) requirements</li>
                                    <li>Impact rating certification (Large Missile D, Small Missile C)</li>
                                    <li>Automatic required vs. certified pressure comparison</li>
                                    <li>Visual pass/fail compliance indicators</li>
                                </ul>
                            </div>
                            
                            <div class="state-module">
                                <h5>Louisiana Building Code (LBC 2021)</h5>
                                <ul>
                                    <li>ICC-ES Evaluation Service Report (ESR) tracking</li>
                                    <li>AAMA performance ratings</li>
                                    <li>State-specific certification fields</li>
                                </ul>
                            </div>
                            
                            <div class="state-module">
                                <h5>North Carolina Building Code (NCBC 2018)</h5>
                                <ul>
                                    <li>NFRC (National Fenestration Rating Council) certifications</li>
                                    <li>ICC-ES integration</li>
                                    <li>Coastal high hazard area support</li>
                                </ul>
                            </div>
                            
                            <div class="state-module">
                                <h5>South Carolina Building Code (SCBC 2021)</h5>
                                <ul>
                                    <li>AAMA architectural ratings (AW, CW, R, LC)</li>
                                    <li>Structural performance grade tracking</li>
                                </ul>
                            </div>
                            
                            <div class="state-module">
                                <h5>Hawaii Building Code (Hawaii CBC)</h5>
                                <ul>
                                    <li>CCPR (County Product Review) numbers</li>
                                    <li>Energy Star rating documentation</li>
                                </ul>
                            </div>
                            
                            <div class="state-module all-states">
                                <h5>All 50 States + Territories</h5>
                                <ul>
                                    <li>Complete nationwide coverage</li>
                                    <li>Multi-jurisdiction project support</li>
                                    <li>Automatic state detection from location</li>
                                </ul>
                            </div>
                        </div>
                        
                        <h4>Certification Tracking</h4>
                        <p>Track all certification numbers in one place:</p>
                        <ul class="cert-list">
                            <li>Product Approval (FL# 12345.1)</li>
                            <li>Miami-Dade NOA (NOA 12-0123.45)</li>
                            <li>ICC-ES Reports (ESR-1234)</li>
                            <li>AAMA Ratings (AW-PG50, CW-PG40)</li>
                            <li>ASTM Standards (E1886, E1996)</li>
                            <li>NFRC Ratings (U-factor, SHGC)</li>
                            <li>Impact Ratings (IR, SR, LR)</li>
                            <li>Custom state certifications</li>
                        </ul>
                    </div>
                `
            },
            ideal: {
                title: "Ideal For",
                content: `
                    <div class="panel-ideal">
                        <h4>Who Should Use This Calculator?</h4>
                        
                        <div class="ideal-audience">
                            <div class="audience-group">
                                <h5>Window & Door Manufacturers</h5>
                                <ul>
                                    <li>Product certification verification</li>
                                    <li>Multi-state compliance tracking</li>
                                    <li>Bulk component analysis</li>
                                    <li>Technical literature generation</li>
                                </ul>
                            </div>
                            
                            <div class="audience-group">
                                <h5>Structural Engineers & Architects</h5>
                                <ul>
                                    <li>Complete C&C calculations for permit sets</li>
                                    <li>Product specification verification</li>
                                    <li>Multiple building envelope scenarios</li>
                                    <li>Professional stamping documentation</li>
                                </ul>
                            </div>
                            
                            <div class="audience-group">
                                <h5>Building Officials & Inspectors</h5>
                                <ul>
                                    <li>Quick verification of submitted calculations</li>
                                    <li>Code compliance checking</li>
                                    <li>Product approval validation</li>
                                    <li>Multi-jurisdiction reference</li>
                                </ul>
                            </div>
                            
                            <div class="audience-group">
                                <h5>Contractors & Installers</h5>
                                <ul>
                                    <li>Product selection assistance</li>
                                    <li>Permit package preparation</li>
                                    <li>Client proposal support</li>
                                    <li>Jobsite reference documentation</li>
                                </ul>
                            </div>
                        </div>
                        
                        <h4>Perfect For These Project Types</h4>
                        <ul class="project-types">
                            <li>Residential construction (single-family, multi-family)</li>
                            <li>Commercial buildings (offices, retail, hospitality)</li>
                            <li>High-rise construction (curtain wall systems)</li>
                            <li>Coastal properties (hurricane-prone regions)</li>
                            <li>Renovations and retrofits</li>
                            <li>Impact-resistant installations</li>
                        </ul>
                    </div>
                `
            }
        }
    },
    
    roofs: {
        title: "Roofs, Parapets & Overhangs",
        link: "wind-load-calculator-shop.html#roofs-details",
        tabs: {
            overview: {
                title: "Overview",
                content: `
                    <div class="panel-overview">
                        <div class="panel-price-box">
                            <div class="panel-price">$29.99<span>/month</span></div>
                            <div class="panel-price-annual">or $24.99/month billed annually</div>
                            <div class="panel-badge coming-soon">⏱ COMING SOON</div>
                        </div>
                        
                        <p class="panel-description">Complete Components & Cladding analysis for all roof types, slopes, and configurations. Includes edge zones, corner zones, parapets, and overhang calculations per ASCE 7-22.</p>
                        
                        <h4>Key Benefits</h4>
                        <ul class="panel-benefits">
                            <li>15+ roof calculators covering all configurations</li>
                            <li>Automatic edge and corner zone detection</li>
                            <li>Parapet pressure analysis</li>
                            <li>Multiple roof types (gable, hip, flat, mansard, shed)</li>
                            <li>Professional reports with zone diagrams</li>
                            <li>Unlimited projects and exports</li>
                        </ul>
                    </div>
                `
            },
            included: {
                title: "What's Included",
                content: `
                    <div class="panel-included">
                        <h4>15+ Professional Calculators</h4>
                        <div class="calculator-groups">
                            <div class="calc-group">
                                <h5>Roof Types</h5>
                                <ul>
                                    <li>Flat Roofs (all slopes 0-7°)</li>
                                    <li>Gable Roofs (all slopes >7°)</li>
                                    <li>Hip Roofs (all configurations)</li>
                                    <li>Mansard Roofs</li>
                                    <li>Shed Roofs</li>
                                    <li>Multi-slope Roofs</li>
                                </ul>
                            </div>
                            
                            <div class="calc-group">
                                <h5>Special Features</h5>
                                <ul>
                                    <li>Edge Zones (automatic width calculation)</li>
                                    <li>Corner Zones (automatic detection)</li>
                                    <li>Parapets (all heights and locations)</li>
                                    <li>Overhangs and Eaves</li>
                                    <li>Ridge and Hip Caps</li>
                                    <li>Attached Equipment (HVAC, solar mounts)</li>
                                </ul>
                            </div>
                        </div>
                        
                        <h4>ASCE 7-22 Compliance Features</h4>
                        <ul class="feature-list">
                            <li>Figure 30.3-2 through 30.3-7 (flat roofs)</li>
                            <li>Figure 30.4-2 through 30.4-3 (gable/hip roofs)</li>
                            <li>Automatic zone identification and pressure assignment</li>
                            <li>All exposure categories (B, C, D)</li>
                            <li>All enclosure classifications</li>
                            <li>Complete pressure coefficients</li>
                            <li>Positive and negative pressures</li>
                            <li>Critical pressure identification</li>
                        </ul>
                    </div>
                `
            },
            states: {
                title: "State Modules",
                content: `
                    <div class="panel-states">
                        <p class="panel-intro">State-specific roofing code provisions:</p>
                        
                        <div class="state-modules">
                            <div class="state-module">
                                <h5>Florida Roofing Standards</h5>
                                <ul>
                                    <li>FL Product Approval for roofing systems</li>
                                    <li>Miami-Dade NOA for roof assemblies</li>
                                    <li>HVHZ enhanced requirements</li>
                                    <li>FBC roofing installation standards</li>
                                </ul>
                            </div>
                            
                            <div class="state-module all-states">
                                <h5>All 50 States + Territories</h5>
                                <ul>
                                    <li>Complete nationwide coverage</li>
                                    <li>State-specific wind zone provisions</li>
                                    <li>Local code amendments</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `
            },
            ideal: {
                title: "Ideal For",
                content: `
                    <div class="panel-ideal">
                        <h4>Who Should Use This Calculator?</h4>
                        
                        <div class="ideal-audience">
                            <div class="audience-group">
                                <h5>Roofing Contractors</h5>
                                <ul>
                                    <li>Permit package preparation</li>
                                    <li>Product specification verification</li>
                                    <li>Client proposals and estimates</li>
                                </ul>
                            </div>
                            
                            <div class="audience-group">
                                <h5>Structural Engineers</h5>
                                <ul>
                                    <li>Complete roof C&C analysis</li>
                                    <li>Edge and corner zone calculations</li>
                                    <li>Parapet load determination</li>
                                </ul>
                            </div>
                            
                            <div class="audience-group">
                                <h5>Architects</h5>
                                <ul>
                                    <li>Roof system selection</li>
                                    <li>Parapet design requirements</li>
                                    <li>Building envelope coordination</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `
            }
        }
    },
    
    solar: {
        title: "Solar Panels & Roof Equipment",
        link: "wind-load-calculator-shop.html#solar-details",
        tabs: {
            overview: {
                title: "Overview",
                content: `
                    <div class="panel-overview">
                        <div class="panel-price-box">
                            <div class="panel-price">$49.99<span>/month</span></div>
                            <div class="panel-price-annual">or $44.99/month billed annually</div>
                            <div class="panel-badge coming-soon">⏱ COMING SOON</div>
                        </div>
                        
                        <p class="panel-description">Specialized wind load analysis for photovoltaic systems, solar arrays, and roof-mounted equipment. Complies with ASCE 7-22 Chapter 29 provisions for rooftop structures.</p>
                        
                        <h4>Key Benefits</h4>
                        <ul class="panel-benefits">
                            <li>Solar array wind load calculations</li>
                            <li>ASCE 7-22 Chapter 29 compliance</li>
                            <li>Multiple mounting configurations</li>
                            <li>Ballasted and attached systems</li>
                            <li>Equipment screening and support analysis</li>
                            <li>Professional engineering reports</li>
                        </ul>
                    </div>
                `
            },
            included: {
                title: "What's Included",
                content: `
                    <div class="panel-included">
                        <h4>Solar & Equipment Calculators</h4>
                        <div class="calculator-groups">
                            <div class="calc-group">
                                <h5>Solar Systems</h5>
                                <ul>
                                    <li>Ground-mounted arrays</li>
                                    <li>Roof-mounted arrays (all slopes)</li>
                                    <li>Ballasted systems</li>
                                    <li>Rail-attached systems</li>
                                    <li>Flush-mount configurations</li>
                                    <li>Tilted arrays</li>
                                </ul>
                            </div>
                            
                            <div class="calc-group">
                                <h5>Roof Equipment</h5>
                                <ul>
                                    <li>HVAC units and platforms</li>
                                    <li>Equipment screens and enclosures</li>
                                    <li>Satellite dishes and antennas</li>
                                    <li>Mechanical equipment supports</li>
                                </ul>
                            </div>
                        </div>
                        
                        <h4>ASCE 7-22 Chapter 29 Features</h4>
                        <ul class="feature-list">
                            <li>Rooftop structure force coefficients</li>
                            <li>Height and exposure effects</li>
                            <li>Parapet shielding considerations</li>
                            <li>Array edge and corner effects</li>
                            <li>Wind tunnel testing alternatives</li>
                        </ul>
                    </div>
                `
            },
            states: {
                title: "State Modules",
                content: `
                    <div class="panel-states">
                        <p class="panel-intro">Solar-specific state provisions:</p>
                        
                        <div class="state-modules">
                            <div class="state-module">
                                <h5>California Solar Standards</h5>
                                <ul>
                                    <li>Title 24 compliance</li>
                                    <li>Fire setback requirements</li>
                                    <li>Seismic + wind combined loads</li>
                                </ul>
                            </div>
                            
                            <div class="state-module">
                                <h5>Florida Solar Requirements</h5>
                                <ul>
                                    <li>FL Product Approval for mounting systems</li>
                                    <li>Hurricane zone provisions</li>
                                    <li>Rapid shutdown compliance</li>
                                </ul>
                            </div>
                            
                            <div class="state-module all-states">
                                <h5>All 50 States + Territories</h5>
                                <ul>
                                    <li>Complete nationwide coverage</li>
                                    <li>Local solar ordinances</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `
            },
            ideal: {
                title: "Ideal For",
                content: `
                    <div class="panel-ideal">
                        <h4>Who Should Use This Calculator?</h4>
                        
                        <div class="ideal-audience">
                            <div class="audience-group">
                                <h5>Solar Installers</h5>
                                <ul>
                                    <li>Permit-ready wind load reports</li>
                                    <li>Mounting system verification</li>
                                    <li>Ballast calculations</li>
                                    <li>Installation documentation</li>
                                </ul>
                            </div>
                            
                            <div class="audience-group">
                                <h5>Solar Engineers</h5>
                                <ul>
                                    <li>ASCE 7 Chapter 29 compliance</li>
                                    <li>Array configuration optimization</li>
                                    <li>Structural load analysis</li>
                                </ul>
                            </div>
                            
                            <div class="audience-group">
                                <h5>Mechanical Engineers</h5>
                                <ul>
                                    <li>Rooftop equipment analysis</li>
                                    <li>Support structure design</li>
                                    <li>Platform and screen loads</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `
            }
        }
    },
    
    mwfrs: {
        title: "MWFRS - Main Wind Force Resisting System",
        link: "wind-load-calculator-shop.html#mwfrs-details",
        tabs: {
            overview: {
                title: "Overview",
                content: `
                    <div class="panel-overview">
                        <div class="panel-price-box">
                            <div class="panel-price">$29.99<span>/month</span></div>
                            <div class="panel-price-annual">or $24.99/month billed annually</div>
                            <div class="panel-badge coming-soon">⏱ COMING SOON</div>
                        </div>
                        
                        <p class="panel-description">Complete Main Wind Force Resisting System analysis for buildings of all heights. Includes directional and envelope procedures per ASCE 7-22 Chapters 27 & 28.</p>
                        
                        <h4>Key Benefits</h4>
                        <ul class="panel-benefits">
                            <li>Full MWFRS calculations for any building</li>
                            <li>Directional Procedure (Method 1)</li>
                            <li>Envelope Procedure (Method 2)</li>
                            <li>Load combination generation</li>
                            <li>Structural frame analysis support</li>
                            <li>Professional engineering documentation</li>
                        </ul>
                    </div>
                `
            },
            included: {
                title: "What's Included",
                content: `
                    <div class="panel-included">
                        <h4>MWFRS Analysis Tools</h4>
                        <div class="calculator-groups">
                            <div class="calc-group">
                                <h5>Analysis Methods</h5>
                                <ul>
                                    <li>Directional Procedure (Chapter 27)</li>
                                    <li>Envelope Procedure (Chapter 27)</li>
                                    <li>Low-rise buildings (Chapter 28)</li>
                                    <li>Simplified Method (low-rise)</li>
                                </ul>
                            </div>
                            
                            <div class="calc-group">
                                <h5>Building Types</h5>
                                <ul>
                                    <li>Enclosed buildings</li>
                                    <li>Partially enclosed buildings</li>
                                    <li>Open buildings</li>
                                    <li>All height categories</li>
                                </ul>
                            </div>
                        </div>
                        
                        <h4>ASCE 7-22 Compliance</h4>
                        <ul class="feature-list">
                            <li>All velocity pressure coefficients (Kz, Kzt, Kd, Ke)</li>
                            <li>External pressure coefficients (Cp)</li>
                            <li>Internal pressure coefficients (GCpi)</li>
                            <li>All load cases and combinations</li>
                            <li>Torsional effects</li>
                            <li>Wind directionality factors</li>
                        </ul>
                    </div>
                `
            },
            states: {
                title: "State Modules",
                content: `
                    <div class="panel-states">
                        <p class="panel-intro">State-specific MWFRS provisions:</p>
                        
                        <div class="state-modules">
                            <div class="state-module all-states">
                                <h5>All 50 States + Territories</h5>
                                <ul>
                                    <li>Complete nationwide coverage</li>
                                    <li>State wind map adoptions</li>
                                    <li>Local amendments and enhancements</li>
                                    <li>Special wind regions</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `
            },
            ideal: {
                title: "Ideal For",
                content: `
                    <div class="panel-ideal">
                        <h4>Who Should Use This Calculator?</h4>
                        
                        <div class="ideal-audience">
                            <div class="audience-group">
                                <h5>Structural Engineers</h5>
                                <ul>
                                    <li>Complete lateral wind load analysis</li>
                                    <li>Frame analysis input preparation</li>
                                    <li>Load combination documentation</li>
                                    <li>Permit submittal packages</li>
                                </ul>
                            </div>
                            
                            <div class="audience-group">
                                <h5>Building Designers</h5>
                                <ul>
                                    <li>Initial structural estimates</li>
                                    <li>Foundation load determination</li>
                                    <li>Lateral system selection</li>
                                </ul>
                            </div>
                            
                            <div class="audience-group">
                                <h5>Plan Reviewers</h5>
                                <ul>
                                    <li>Quick calculation verification</li>
                                    <li>Code compliance checking</li>
                                    <li>Multi-jurisdiction reference</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `
            }
        }
    },
    
    specialized: {
        title: "Specialized Structures",
        link: "wind-load-calculator-shop.html#specialized-details",
        tabs: {
            overview: {
                title: "Overview",
                content: `
                    <div class="panel-overview">
                        <div class="panel-price-box">
                            <div class="panel-price">$29.99<span>/month</span></div>
                            <div class="panel-price-annual">or $24.99/month billed annually</div>
                            <div class="panel-badge coming-soon">⏱ COMING SOON</div>
                        </div>
                        
                        <p class="panel-description">Wind load analysis for specialized structures including chimneys, stacks, lattice frameworks, signs, billboards, and other non-building structures per ASCE 7-22 Chapter 29.</p>
                        
                        <h4>Key Benefits</h4>
                        <ul class="panel-benefits">
                            <li>Chimneys and stacks (circular and rectangular)</li>
                            <li>Lattice structures and towers</li>
                            <li>Signs and billboards (all types)</li>
                            <li>Freestanding walls and fences</li>
                            <li>Custom structure analysis</li>
                            <li>Professional engineering reports</li>
                        </ul>
                    </div>
                `
            },
            included: {
                title: "What's Included",
                content: `
                    <div class="panel-included">
                        <h4>Specialized Structure Types</h4>
                        <div class="calculator-groups">
                            <div class="calc-group">
                                <h5>Circular Structures</h5>
                                <ul>
                                    <li>Round chimneys and stacks</li>
                                    <li>Cylindrical tanks</li>
                                    <li>Silos</li>
                                    <li>Poles and posts</li>
                                </ul>
                            </div>
                            
                            <div class="calc-group">
                                <h5>Rectangular Structures</h5>
                                <ul>
                                    <li>Square chimneys and stacks</li>
                                    <li>Rectangular tanks</li>
                                    <li>Signs and billboards</li>
                                    <li>Freestanding walls</li>
                                </ul>
                            </div>
                            
                            <div class="calc-group">
                                <h5>Open Structures</h5>
                                <ul>
                                    <li>Lattice frameworks</li>
                                    <li>Communication towers</li>
                                    <li>Trussed structures</li>
                                    <li>Transmission towers</li>
                                </ul>
                            </div>
                        </div>
                        
                        <h4>ASCE 7-22 Chapter 29 Features</h4>
                        <ul class="feature-list">
                            <li>Force coefficients for all shapes</li>
                            <li>Shielding and grouping effects</li>
                            <li>Height variation effects</li>
                            <li>Reynolds number considerations</li>
                            <li>Dynamic effects (when applicable)</li>
                        </ul>
                    </div>
                `
            },
            states: {
                title: "State Modules",
                content: `
                    <div class="panel-states">
                        <p class="panel-intro">State-specific specialized structure provisions:</p>
                        
                        <div class="state-modules">
                            <div class="state-module all-states">
                                <h5>All 50 States + Territories</h5>
                                <ul>
                                    <li>Complete nationwide coverage</li>
                                    <li>State-specific amendments</li>
                                    <li>Local sign ordinances</li>
                                    <li>Tower and antenna regulations</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `
            },
            ideal: {
                title: "Ideal For",
                content: `
                    <div class="panel-ideal">
                        <h4>Who Should Use This Calculator?</h4>
                        
                        <div class="ideal-audience">
                            <div class="audience-group">
                                <h5>Structural Engineers</h5>
                                <ul>
                                    <li>Chimney and stack design</li>
                                    <li>Tower and antenna analysis</li>
                                    <li>Sign and billboard structures</li>
                                    <li>Industrial structure loads</li>
                                </ul>
                            </div>
                            
                            <div class="audience-group">
                                <h5>Sign Manufacturers</h5>
                                <ul>
                                    <li>Billboard wind load analysis</li>
                                    <li>Freestanding sign design</li>
                                    <li>Permit package preparation</li>
                                </ul>
                            </div>
                            
                            <div class="audience-group">
                                <h5>Industrial Facilities</h5>
                                <ul>
                                    <li>Stack and chimney evaluation</li>
                                    <li>Process equipment supports</li>
                                    <li>Tank and vessel analysis</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `
            }
        }
    }
};

// ============================================
// GLOBAL STATE
// ============================================

let currentPanel = null;
let currentCategory = null;

// ============================================
// MOBILE NAVIGATION
// ============================================

function toggleNav() {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('nav-overlay');
    
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// ============================================
// ============================================

// ============================================
// VIDEO BACKGROUND
// ============================================

function initializeVideo() {
    const video = document.querySelector('.hero-video');
    
    if (video) {
        // Ensure video plays on mobile (with fallback)
        video.play().catch(function(error) {
            console.log('Video autoplay failed:', error);
            // Fallback: Show poster or static image if video fails
        });
        
        // Pause video when not in viewport (performance optimization)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(video);
    }
}

// ============================================
// CATEGORY PANEL FUNCTIONS
// ============================================

function openCategoryPanel(category) {
    const panel = document.getElementById('category-panel');
    const panelTitle = document.getElementById('panel-title');
    const panelCTA = document.getElementById('panel-cta');
    
    // Store current category
    currentCategory = category;
    
    // Get category data
    const data = categoryData[category];
    
    if (!data) {
        console.error('Category data not found:', category);
        return;
    }
    
    // Update panel title
    panelTitle.textContent = data.title;
    
    // Update CTA link
    panelCTA.href = data.link;
    
    // Show panel
    panel.classList.add('active');
    document.body.style.overflow = 'hidden';
    currentPanel = panel;
    
    // Load default tab (overview)
    loadPanelTab('overview');
    
    // Activate first tab
    const navItems = document.querySelectorAll('.panel-nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    navItems[0].classList.add('active');
}

function closeCategoryPanel() {
    const panel = document.getElementById('category-panel');
    panel.classList.remove('active');
    document.body.style.overflow = '';
    currentPanel = null;
    currentCategory = null;
}

function loadPanelTab(tabName) {
    if (!currentCategory) return;
    
    const data = categoryData[currentCategory];
    const tabData = data.tabs[tabName];
    
    if (!tabData) {
        console.error('Tab data not found:', tabName);
        return;
    }
    
    const panelBody = document.getElementById('panel-body');
    panelBody.innerHTML = tabData.content;
}

// ============================================
// PANEL TAB NAVIGATION
// ============================================

function initializePanelTabs() {
    const navItems = document.querySelectorAll('.panel-nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Load the corresponding tab
            const tabName = this.getAttribute('data-tab');
            loadPanelTab(tabName);
        });
    });
}

// ============================================
// FAQ ACCORDION
// ============================================

function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

function initializeSmoothScroll() {
    // Smooth scrolling handled by reference script
}

// ============================================
// ESCAPE KEY TO CLOSE PANEL
// ============================================

function initializeEscapeKey() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && currentPanel) {
            closeCategoryPanel();
        }
    });
}

// ============================================
// SCROLL ANIMATIONS - NEW!
// ============================================

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all elements that should animate on scroll
    document.querySelectorAll('.differentiator-card, .category-card, .process-step').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// RESPONSIVE PANEL BEHAVIOR
// ============================================

function handlePanelResize() {
    // This function can be used to switch between tabs and accordion
    // based on screen size if needed in the future
    // For now, CSS handles the responsive behavior
}

window.addEventListener('resize', handlePanelResize);

// ============================================
// INITIALIZE EVERYTHING ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Wind Load Calculator Landing Page - Initializing...');
    
    initializeVideo();
    initializePanelTabs();
    initializeFAQ();
    initializeSmoothScroll();
    initializeEscapeKey();
    initializeScrollAnimations(); // NEW!
    handlePanelResize();
    
    console.log('✅ All features initialized successfully!');
});