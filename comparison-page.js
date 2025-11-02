// ============================================
// WIND LOAD CALCULATOR COMPARISON PAGE
// Interactive functionality for collapsible sections
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // COLLAPSIBLE CATEGORY SECTIONS
    // ============================================
    
    const categoryHeaders = document.querySelectorAll('.category-header');
    
    categoryHeaders.forEach(header => {
        // Initialize aria attributes
        header.setAttribute('aria-expanded', 'false');
        const categoryId = header.dataset.category;
        const content = document.getElementById(`${categoryId}-content`);
        
        if (content) {
            content.setAttribute('id', `${categoryId}-content`);
            content.setAttribute('aria-hidden', 'true');
        }
        
        // Add click event listener
        header.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const content = document.getElementById(`${categoryId}-content`);
            
            if (content) {
                if (isExpanded) {
                    // Collapse
                    this.setAttribute('aria-expanded', 'false');
                    content.setAttribute('aria-hidden', 'true');
                    content.classList.remove('expanded');
                } else {
                    // Expand
                    this.setAttribute('aria-expanded', 'true');
                    content.setAttribute('aria-hidden', 'false');
                    content.classList.add('expanded');
                }
            }
        });
    });
    
    // ============================================
    // EXPAND ALL BUTTON
    // ============================================
    
    const expandAllBtn = document.getElementById('expandAll');
    if (expandAllBtn) {
        expandAllBtn.addEventListener('click', function() {
            categoryHeaders.forEach(header => {
                header.setAttribute('aria-expanded', 'true');
                const categoryId = header.dataset.category;
                const content = document.getElementById(`${categoryId}-content`);
                
                if (content) {
                    content.setAttribute('aria-hidden', 'false');
                    content.classList.add('expanded');
                }
            });
            
            // Smooth scroll to first category
            const firstCategory = document.querySelector('.comparison-category');
            if (firstCategory) {
                firstCategory.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    // ============================================
    // COLLAPSE ALL BUTTON
    // ============================================
    
    const collapseAllBtn = document.getElementById('collapseAll');
    if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', function() {
            categoryHeaders.forEach(header => {
                header.setAttribute('aria-expanded', 'false');
                const categoryId = header.dataset.category;
                const content = document.getElementById(`${categoryId}-content`);
                
                if (content) {
                    content.setAttribute('aria-hidden', 'true');
                    content.classList.remove('expanded');
                }
            });
            
            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // ============================================
    // PRINT BUTTON
    // ============================================
    
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            // Expand all sections before printing
            categoryHeaders.forEach(header => {
                header.setAttribute('aria-expanded', 'true');
                const categoryId = header.dataset.category;
                const content = document.getElementById(`${categoryId}-content`);
                
                if (content) {
                    content.setAttribute('aria-hidden', 'false');
                    content.classList.add('expanded');
                }
            });
            
            // Wait for animations to complete, then print
            setTimeout(function() {
                window.print();
            }, 500);
        });
    }
    
    // ============================================
    // HAMBURGER MENU (Mobile)
    // ============================================
    
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for empty fragments
            if (href === '#' || href === '') {
                return;
            }
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    
    const header = document.getElementById('main-header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // ============================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ============================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe category sections
    document.querySelectorAll('.comparison-category').forEach(category => {
        observer.observe(category);
    });
    
    // Observe special sections
    document.querySelectorAll('.special-section').forEach(section => {
        observer.observe(section);
    });
    
    // ============================================
    // TABLE HORIZONTAL SCROLL INDICATOR (Mobile)
    // ============================================
    
    const tables = document.querySelectorAll('.comparison-table');
    
    tables.forEach(table => {
        const wrapper = table.parentElement;
        
        // Check if table is scrollable
        function checkScroll() {
            if (table.scrollWidth > table.clientWidth) {
                wrapper.classList.add('scrollable');
            } else {
                wrapper.classList.remove('scrollable');
            }
        }
        
        // Check on load and resize
        checkScroll();
        window.addEventListener('resize', checkScroll);
    });
    
    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    
    categoryHeaders.forEach((header, index) => {
        header.addEventListener('keydown', function(e) {
            // Enter or Space to toggle
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
            
            // Arrow keys to navigate between headers
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextHeader = categoryHeaders[index + 1];
                if (nextHeader) {
                    nextHeader.focus();
                }
            }
            
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevHeader = categoryHeaders[index - 1];
                if (prevHeader) {
                    prevHeader.focus();
                }
            }
        });
    });
    
    // ============================================
    // AUTO-EXPAND FIRST CATEGORY (Optional)
    // ============================================
    
    // Uncomment to auto-expand first category on load
    /*
    if (categoryHeaders.length > 0) {
        const firstHeader = categoryHeaders[0];
        const firstCategoryId = firstHeader.dataset.category;
        const firstContent = document.getElementById(`${firstCategoryId}-content`);
        
        if (firstContent) {
            firstHeader.setAttribute('aria-expanded', 'true');
            firstContent.setAttribute('aria-hidden', 'false');
            firstContent.classList.add('expanded');
        }
    }
    */
    
    // ============================================
    // TRACK ANALYTICS (Optional)
    // ============================================
    
    // Track category expansions
    categoryHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const categoryName = this.querySelector('h2').textContent;
            const isExpanding = this.getAttribute('aria-expanded') === 'false';
            
            // Send analytics event (customize for your analytics platform)
            if (typeof gtag !== 'undefined') {
                gtag('event', isExpanding ? 'category_expand' : 'category_collapse', {
                    'event_category': 'Comparison Page',
                    'event_label': categoryName
                });
            }
        });
    });
    
    // Track CTA clicks
    document.querySelectorAll('.cta-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const btnText = this.textContent;
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    'event_category': 'Comparison Page',
                    'event_label': btnText
                });
            }
        });
    });
    
    // ============================================
    // PERFORMANCE OPTIMIZATION
    // ============================================
    
    // Debounce function for scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Optimized scroll handler
    const optimizedScroll = debounce(function() {
        // Add any scroll-based functionality here
    }, 100);
    
    window.addEventListener('scroll', optimizedScroll);
    
    // ============================================
    // ACCESSIBILITY ENHANCEMENTS
    // ============================================
    
    // Add focus-visible polyfill behavior
    document.body.addEventListener('mousedown', function() {
        document.body.classList.add('using-mouse');
    });
    
    document.body.addEventListener('keydown', function() {
        document.body.classList.remove('using-mouse');
    });
    
    // Announce page changes to screen readers
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // Add announcement when expanding/collapsing
    categoryHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const categoryName = this.querySelector('h2').textContent;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const message = `${categoryName} ${isExpanded ? 'collapsed' : 'expanded'}`;
            announceToScreenReader(message);
        });
    });
    
    // ============================================
    // INITIALIZE COMPLETE
    // ============================================
    
    console.log('Comparison page initialized successfully');
    console.log(`Total categories: ${categoryHeaders.length}`);
    
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll to element
function scrollToElement(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Get query parameter from URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// ============================================
// HANDLE URL HASH ON LOAD
// ============================================

window.addEventListener('load', function() {
    // Check if there's a hash in the URL
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const targetElement = document.getElementById(hash);
        
        if (targetElement) {
            // If it's a category, expand it
            const category = targetElement.closest('.comparison-category');
            if (category) {
                const header = category.querySelector('.category-header');
                if (header) {
                    header.click();
                }
            }
            
            // Scroll to element after a short delay
            setTimeout(() => {
                scrollToElement(targetElement, 100);
            }, 300);
        }
    }
    
    // Check for query parameters to auto-expand categories
    const expandParam = getQueryParam('expand');
    if (expandParam === 'all') {
        const expandAllBtn = document.getElementById('expandAll');
        if (expandAllBtn) {
            expandAllBtn.click();
        }
    }
});
