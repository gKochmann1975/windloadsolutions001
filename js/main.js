// WindLoad Solutions - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeader();
    initSmoothScrolling();
    initFormHandling();
    initAnimations();
    initErrorHandling();
});

// Header scroll effects
function initHeader() {
    const header = document.querySelector('.main-header');
    
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    
    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Throttle scroll events for better performance
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateHeader();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form handling
function initFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
            const originalText = submitButton ? submitButton.textContent : '';
            
            // Add loading state
            if (submitButton) {
                submitButton.textContent = 'Submitting...';
                submitButton.disabled = true;
                submitButton.classList.add('loading');
            }
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Here you would typically send to your Python backend
            // For now, we'll simulate the submission
            setTimeout(() => {
                // Remove loading state
                if (submitButton) {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.classList.remove('loading');
                }
                
                // Show success message
                showNotification('Form submitted successfully!', 'success');
                
                // Reset form
                form.reset();
                
                // Redirect for certain forms
                if (form.classList.contains('signup-form')) {
                    window.location.href = '/dashboard';
                }
            }, 2000);
        });
    });
}

// Animation on scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .benefit-card, .hero-content');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Error handling - prevents the console errors you were seeing
function initErrorHandling() {
    // Prevent querySelector errors by checking if elements exist
    function safeQuerySelector(selector) {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.warn(`Invalid selector: ${selector}`);
            return null;
        }
    }
    
    function safeQuerySelectorAll(selector) {
        try {
            return document.querySelectorAll(selector);
        } catch (error) {
            console.warn(`Invalid selector: ${selector}`);
            return [];
        }
    }
    
    // Replace global querySelector functions
    window.safeQuerySelector = safeQuerySelector;
    window.safeQuerySelectorAll = safeQuerySelectorAll;
    
    // Handle missing images gracefully
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn(`Failed to load image: ${this.src}`);
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        backgroundColor: type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#667eea',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        zIndex: 10000,
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Calculator functionality (basic demo)
function initCalculator() {
    const calculateButton = document.getElementById('calculate-wind-loads');
    
    if (calculateButton) {
        calculateButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get form inputs
            const zipCode = document.getElementById('zip-code')?.value;
            const buildingHeight = document.getElementById('building-height')?.value;
            const exposureCategory = document.getElementById('exposure-category')?.value;
            
            if (!zipCode || !buildingHeight || !exposureCategory) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Simulate calculation
            this.textContent = 'Calculating...';
            this.disabled = true;
            
            setTimeout(() => {
                // Show demo results
                const resultsDiv = document.getElementById('calculation-results');
                if (resultsDiv) {
                    resultsDiv.innerHTML = `
                        <h3>Calculation Results</h3>
                        <p><strong>Basic Wind Speed:</strong> 180 mph</p>
                        <p><strong>Velocity Pressure:</strong> 45.2 psf</p>
                        <p><strong>Zone 4 Pressure:</strong> ±32.5 psf</p>
                        <p><strong>Zone 5 Pressure:</strong> ±48.8 psf</p>
                        <p><em>Note: These are demo calculations. Sign up for full access.</em></p>
                    `;
                    resultsDiv.style.display = 'block';
                    resultsDiv.scrollIntoView({ behavior: 'smooth' });
                }
                
                this.textContent = 'Calculate Wind Loads';
                this.disabled = false;
                
                showNotification('Calculation complete! Sign up for detailed results.', 'success');
            }, 2000);
        });
    }
}

// Mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// Initialize calculator if on calculator page
if (document.querySelector('#calculate-wind-loads')) {
    initCalculator();
}

// Initialize mobile menu
initMobileMenu();

// Utility functions
const Utils = {
    // Debounce function to limit function calls
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },
    
    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Format currency
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
};

// Export for use in other scripts
window.WindLoadUtils = Utils;
window.showNotification = showNotification;