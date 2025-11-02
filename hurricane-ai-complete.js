// =====================================================
// HURRICANE AI SYSTEM - POWERED BY GEMINI AI
// =====================================================
// Real AI-powered natural language hurricane analysis
// Using Google Gemini API for intelligent responses

// =====================================================
// CONFIGURATION
// =====================================================

const GEMINI_API_KEY = 'AIzaSyCPAnfaH4PyXo8SOOoJlRNXe8Os8qxj3BQ';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Global AI instance
let hurricaneAI = null;

// =====================================================
// GEMINI AI HURRICANE ASSISTANT
// =====================================================

class GeminiHurricaneAI {
    constructor(database) {
        this.database = database;
        console.log(`🤖 Gemini AI initialized with ${database.length} hurricanes`);
    }

    // Create context about the hurricane database for Gemini
    createDatabaseContext() {
        const totalHurricanes = this.database.length;
        const categories = {};
        const stateImpacts = {};
        const yearRange = {
            earliest: Infinity,
            latest: -Infinity
        };

        this.database.forEach(h => {
            // Count categories
            categories[h.category] = (categories[h.category] || 0) + 1;
            
            // Track states
            if (h.states) {
                h.states.forEach(state => {
                    stateImpacts[state] = (stateImpacts[state] || 0) + 1;
                });
            }
            
            // Track year range
            if (h.year < yearRange.earliest) yearRange.earliest = h.year;
            if (h.year > yearRange.latest) yearRange.latest = h.year;
        });

        return {
            totalHurricanes,
            categories,
            stateImpacts,
            yearRange,
            topStates: Object.entries(stateImpacts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([state, count]) => `${state} (${count})`)
        };
    }

    // Find relevant hurricanes for the question
    findRelevantHurricanes(question) {
        const q = question.toLowerCase();
        const relevant = [];

        // Extract potential filters
        const yearMatch = q.match(/\b(19|20)\d{2}\b/);
        const catMatch = q.match(/cat(?:egory)?\s*(\d)/i);
        
        // Find hurricanes mentioned by name or matching criteria
        this.database.forEach(h => {
            let score = 0;
            
            // Hurricane name mentioned
            if (q.includes(h.name.toLowerCase())) {
                score += 100;
            }
            
            // Year match
            if (yearMatch && h.year === parseInt(yearMatch[0])) {
                score += 50;
            }
            
            // Category match
            if (catMatch && h.category === parseInt(catMatch[1])) {
                score += 30;
            }
            
            // State mention
            if (h.states) {
                h.states.forEach(state => {
                    if (q.includes(state.toLowerCase())) {
                        score += 20;
                    }
                });
            }
            
            // Damage keywords
            if (q.includes('damage') || q.includes('cost') || q.includes('expensive')) {
                score += h.damage ? 10 : 0;
            }
            
            // Death keywords
            if (q.includes('death') || q.includes('fatal') || q.includes('deadly')) {
                score += h.deaths ? 10 : 0;
            }
            
            if (score > 0) {
                relevant.push({ hurricane: h, score });
            }
        });

        // Sort by relevance and return top 10
        return relevant
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map(item => item.hurricane);
    }

    // Build the prompt for Gemini
    buildPrompt(question, relevantHurricanes, dbContext) {
        let prompt = `You are a hurricane analysis AI assistant. Answer questions about hurricanes using the provided data.

DATABASE OVERVIEW:
- Total hurricanes: ${dbContext.totalHurricanes}
- Year range: ${dbContext.yearRange.earliest} - ${dbContext.yearRange.latest}
- Top affected states: ${dbContext.topStates.join(', ')}
- Category distribution: ${Object.entries(dbContext.categories).map(([cat, count]) => `Cat ${cat}: ${count}`).join(', ')}

USER QUESTION: "${question}"

`;

        if (relevantHurricanes.length > 0) {
            prompt += `\nRELEVANT HURRICANES FROM DATABASE:\n`;
            relevantHurricanes.forEach((h, i) => {
                prompt += `\n${i + 1}. ${h.name} (${h.year})
   - Category: ${h.category}
   - States: ${h.states ? h.states.join(', ') : 'N/A'}
   - Deaths: ${h.deaths || 'Unknown'}
   - Damage: ${h.damage ? '$' + h.damage.toLocaleString() : 'Unknown'}
   - Landfall: ${h.landfall || 'Unknown'}
`;
            });
        }

        prompt += `\n\nINSTRUCTIONS:
1. Provide a clear, informative answer based on the hurricane data
2. Use specific numbers and facts from the database
3. If comparing hurricanes, highlight key differences
4. If asked about trends, analyze patterns in the data
5. Be conversational but precise
6. If the data doesn't contain the information, say so clearly
7. Keep responses concise (2-4 paragraphs max)

Answer the user's question now:`;

        return prompt;
    }

    // Call Gemini API
    async callGemini(prompt) {
        try {
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    }

    // Main processing function
    async processQuestion(question) {
        try {
            // Find relevant hurricanes
            const relevantHurricanes = this.findRelevantHurricanes(question);
            
            // Create database context
            const dbContext = this.createDatabaseContext();
            
            // Build prompt
            const prompt = this.buildPrompt(question, relevantHurricanes, dbContext);
            
            // Get AI response
            const response = await this.callGemini(prompt);
            
            return {
                success: true,
                response: response,
                relevantHurricanes: relevantHurricanes.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// =====================================================
// INITIALIZATION
// =====================================================

function initializeHurricaneAI() {
    if (typeof HURRICANE_DATABASE === 'undefined') {
        console.error('❌ HURRICANE_DATABASE not found!');
        return false;
    }

    if (HURRICANE_DATABASE.length === 0) {
        console.error('❌ HURRICANE_DATABASE is empty!');
        return false;
    }

    try {
        hurricaneAI = new GeminiHurricaneAI(HURRICANE_DATABASE);
        console.log('✅ Gemini Hurricane AI initialized successfully!');
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize Hurricane AI:', error);
        return false;
    }
}

// =====================================================
// USER INTERFACE INTEGRATION
// =====================================================

async function processNaturalLanguageSearch() {
    // TRIAL CHECK - Free Trial Rate Limiting (MANDATORY)
    console.log('🔍 Hurricane AI: Checking trial status...');
    
    if (typeof TrialManager === 'undefined') {
        console.error('❌ CRITICAL: TrialManager not loaded! Trial protection disabled!');
        alert('Error: Trial system failed to load. Please refresh the page.');
        return;
    }
    
    const lookupCheck = TrialManager.canPerformLookup();
    console.log('🔍 Hurricane AI: Lookup check result:', lookupCheck);
    
    if (!lookupCheck.allowed) {
        console.log('🚫 Hurricane AI: Lookup blocked - showing upgrade modal');
        showUpgradeModal(lookupCheck.message);
        return;
    }
    
    console.log('✅ Hurricane AI: Lookup allowed - proceeding...');
    
    const searchInput = document.getElementById('hurricane-nl-search');
    const resultsDiv = document.getElementById('ai-chat-messages');
    
    if (!searchInput || !resultsDiv) {
        console.error('❌ Required elements not found!');
        return;
    }

    const question = searchInput.value.trim();

    if (!question) {
        showErrorMessage(resultsDiv, '❓ Please enter a question about hurricanes');
        return;
    }

    // Initialize AI if needed
    if (!hurricaneAI) {
        const initialized = initializeHurricaneAI();
        if (!initialized) {
            showErrorMessage(resultsDiv, '❌ Hurricane AI system not available. Please refresh the page.');
            return;
        }
    }

    // Show loading state
    resultsDiv.innerHTML = `
        <div class="loading-spinner" style="text-align: center; padding: 40px;">
            <div style="display: inline-block; width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #FF6B35; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <p style="margin-top: 20px; color: #666; font-size: 16px;">🤖 Gemini AI is thinking...</p>
        </div>
    `;

    try {
        // Process with Gemini AI
        const result = await hurricaneAI.processQuestion(question);

        if (result.success) {
            displayResponse(resultsDiv, question, result.response, result.relevantHurricanes);
            
            // TRIAL - Record successful lookup (MANDATORY)
            if (typeof TrialManager !== 'undefined') {
                TrialManager.recordLookup('hurricane_ai', question.substring(0, 50));
                console.log('📝 Recorded Hurricane AI lookup');
            } else {
                console.error('❌ Cannot record lookup - TrialManager missing!');
            }
            searchInput.value = ''; // Clear input
        } else {
            showErrorMessage(resultsDiv, `⚠️ AI Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Processing error:', error);
        showErrorMessage(resultsDiv, '❌ Something went wrong. Please try again.');
    }
}

// Display the AI response
function displayResponse(container, question, response, relevantCount) {
    container.innerHTML = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px 20px; border-radius: 8px 8px 0 0; color: white; display: flex; align-items: center; gap: 10px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <strong>Your Question</strong>
        </div>
        <div style="background: #f8f9fa; padding: 15px 20px; border-left: 3px solid #667eea; margin-bottom: 15px;">
            <p style="margin: 0; color: #333;">${question}</p>
        </div>
        
        <div style="background: white; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 15px;">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none" style="flex-shrink: 0; margin-top: 2px;">
                    <!-- Outer glow circle -->
                    <circle cx="24" cy="24" r="22" fill="url(#aiGradient)" opacity="0.1">
                        <animate attributeName="r" values="22;24;22" dur="3s" repeatCount="indefinite"/>
                    </circle>
                    
                    <!-- Main AI brain structure -->
                    <circle cx="24" cy="24" r="18" fill="url(#aiGradient)" opacity="0.15"/>
                    
                    <!-- Neural network nodes -->
                    <circle cx="24" cy="12" r="2.5" fill="#667eea">
                        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="12" cy="20" r="2.5" fill="#667eea">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="36" cy="20" r="2.5" fill="#667eea">
                        <animate attributeName="opacity" values="1;0.5;1" dur="2s" begin="0.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="15" cy="32" r="2.5" fill="#764ba2">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="1s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="33" cy="32" r="2.5" fill="#764ba2">
                        <animate attributeName="opacity" values="1;0.5;1" dur="2s" begin="1.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="24" cy="36" r="2.5" fill="#764ba2">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.75s" repeatCount="indefinite"/>
                    </circle>
                    
                    <!-- Connecting lines (neural pathways) -->
                    <path d="M24 12 L12 20" stroke="#667eea" stroke-width="1.5" opacity="0.4">
                        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite"/>
                    </path>
                    <path d="M24 12 L36 20" stroke="#667eea" stroke-width="1.5" opacity="0.4">
                        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite"/>
                    </path>
                    <path d="M12 20 L15 32" stroke="#667eea" stroke-width="1.5" opacity="0.4">
                        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" begin="0.5s" repeatCount="indefinite"/>
                    </path>
                    <path d="M36 20 L33 32" stroke="#667eea" stroke-width="1.5" opacity="0.4">
                        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" begin="0.5s" repeatCount="indefinite"/>
                    </path>
                    <path d="M15 32 L24 36" stroke="#764ba2" stroke-width="1.5" opacity="0.4">
                        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" begin="1s" repeatCount="indefinite"/>
                    </path>
                    <path d="M33 32 L24 36" stroke="#764ba2" stroke-width="1.5" opacity="0.4">
                        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" begin="1s" repeatCount="indefinite"/>
                    </path>
                    <path d="M12 20 L24 24" stroke="#667eea" stroke-width="1.5" opacity="0.3">
                        <animate attributeName="opacity" values="0.1;0.5;0.1" dur="2s" begin="0.25s" repeatCount="indefinite"/>
                    </path>
                    <path d="M36 20 L24 24" stroke="#667eea" stroke-width="1.5" opacity="0.3">
                        <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" begin="0.25s" repeatCount="indefinite"/>
                    </path>
                    
                    <!-- Central processing core -->
                    <circle cx="24" cy="24" r="4" fill="url(#coreGradient)">
                        <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="24" cy="24" r="3" fill="white" opacity="0.3"/>
                    
                    <!-- Sparkle effects -->
                    <circle cx="28" cy="16" r="1" fill="#fff">
                        <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="20" cy="28" r="1" fill="#fff">
                        <animate attributeName="opacity" values="0;1;0" dur="3s" begin="1s" repeatCount="indefinite"/>
                    </circle>
                    
                    <!-- Gradient definitions -->
                    <defs>
                        <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                        </linearGradient>
                        <radialGradient id="coreGradient">
                            <stop offset="0%" style="stop-color:#fff;stop-opacity:0.8" />
                            <stop offset="50%" style="stop-color:#667eea;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                        </radialGradient>
                    </defs>
                </svg>
                <div style="flex: 1;">
                    <strong style="color: #667eea; font-size: 14px; display: block; margin-bottom: 10px;">
                        GEMINI AI RESPONSE ${relevantCount > 0 ? `(analyzed ${relevantCount} hurricanes)` : ''}
                    </strong>
                    ${formatResponse(response)}
                </div>
            </div>
        </div>
    `;
}

// Format the response with proper HTML
function formatResponse(text) {
    // Convert markdown-style bold
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Convert bullet points
    text = text.replace(/^[•\-]\s/gm, '• ');
    
    // Convert numbered lists
    text = text.replace(/^\d+\.\s/gm, match => `<strong>${match}</strong>`);
    
    // Convert line breaks to proper HTML paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map(p => 
        `<p style="margin: 0 0 15px 0; line-height: 1.8; color: #333; font-size: 15px;">${p.replace(/\n/g, '<br>')}</p>`
    ).join('');
}

// Show error messages
function showErrorMessage(container, message) {
    container.innerHTML = `
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; color: #856404; padding: 20px; border-radius: 8px; display: flex; align-items: center; gap: 15px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink: 0;">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span style="flex: 1; font-size: 15px;">${message}</span>
        </div>
    `;
}

// Add CSS for loading spinner
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// =====================================================
// EXPOSE GLOBALLY
// =====================================================

window.processNaturalLanguageSearch = processNaturalLanguageSearch;

// =====================================================
// AUTO-INITIALIZE
// =====================================================

console.log('🤖 Gemini Hurricane AI system loaded');

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📄 DOM loaded. Attempting to initialize Gemini AI...');
        initializeHurricaneAI();
    });
} else {
    console.log('📄 DOM already loaded. Initializing Gemini AI...');
    initializeHurricaneAI();
}

// Export for modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        GeminiHurricaneAI, 
        initializeHurricaneAI, 
        processNaturalLanguageSearch 
    };
}