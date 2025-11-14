/**
 * MUSKOKA BALANCE - JavaScript (Bug-Free 2025)
 * Enterprise-level interactions, cleaned and optimized
 */

'use strict';

// ============================================
// CONFIGURATION & STATE
// ============================================

const CONFIG = {
    enableCustomCursor: false, // DISABLED - causing cursor to disappear
    enableScrollProgress: true,
    enableMagneticButtons: true,
    enableParallax: false, // Disabled to prevent layout bugs
    scrollProgressHeight: '2px',
    debounceDelay: 10
};

let state = {
    isMenuOpen: false,
    lastScrollY: 0,
    ticking: false,
    hasSeenPreloader: sessionStorage.getItem('preloaderSeen')
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function isDesktop() {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function isMobile() {
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

// ============================================
// PRELOADER (Optimized)
// ============================================

function initPreloader() {
    const preloader = document.querySelector('.preloader');

    // ALWAYS add loaded class immediately to prevent hiding content
    document.body.classList.add('loaded');

    if (!preloader) {
        document.body.style.overflow = '';
        return;
    }

    if (state.hasSeenPreloader) {
        // Instant removal on subsequent visits
        preloader.remove();
        document.body.style.overflow = '';
        return;
    }

    // First visit - show preloader
    document.body.style.overflow = 'hidden';

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');

            setTimeout(() => {
                document.body.style.overflow = '';
                preloader.remove();
                sessionStorage.setItem('preloaderSeen', 'true');
            }, 1600);
        }, 2500);
    }, { once: true });
}

// ============================================
// CUSTOM CURSOR (Desktop Only)
// ============================================

function initCustomCursor() {
    if (!CONFIG.enableCustomCursor || !isDesktop()) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const follower = document.createElement('div');
    follower.className = 'custom-cursor-follower';

    document.body.append(cursor, follower);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    let animationFrameId;

    const updateCursor = () => {
        cursorX = mouseX;
        cursorY = mouseY;
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        follower.style.transform = `translate(${followerX}px, ${followerY}px)`;

        animationFrameId = requestAnimationFrame(updateCursor);
    };

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.classList.add('active');
        follower.classList.add('active');
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        follower.classList.remove('active');
    });

    updateCursor();
}

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================

function initScrollProgress() {
    if (!CONFIG.enableScrollProgress) return;

    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.height = CONFIG.scrollProgressHeight;
    document.body.appendChild(progressBar);

    const updateProgress = throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;
        progressBar.style.transform = `scaleX(${progress})`;
    }, 16); // 60fps

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

// ============================================
// MAGNETIC BUTTONS (Desktop Only)
// ============================================

function initMagneticButtons() {
    if (!CONFIG.enableMagneticButtons || !isDesktop()) return;

    const magneticElements = document.querySelectorAll('.link-arrow');

    magneticElements.forEach(el => {
        let animationFrameId;

        el.addEventListener('mouseenter', () => {
            el.style.transition = 'transform 0.1s ease-out';
        });

        el.addEventListener('mousemove', (e) => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);

            animationFrameId = requestAnimationFrame(() => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
                el.style.transform = `translate(${x}px, ${y}px)`;
            });
        });

        el.addEventListener('mouseleave', () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            el.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
            el.style.transform = 'translate(0, 0)';
        });
    });
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

function initSmoothScroll() {
    const header = document.getElementById('header');
    const headerHeight = header ? header.offsetHeight : 0;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

            // Let Lenis handle smooth scrolling
            window.scrollTo({
                top: targetPosition,
                behavior: 'auto' // Changed from 'smooth' - Lenis handles it
            });
        });
    });
}

// ============================================
// SCROLL ANIMATIONS (Single Implementation)
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Unobserve after animation to prevent re-triggering
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Only animate elements that explicitly have fade-in classes
    // Don't auto-hide everything!
    const elementsToAnimate = document.querySelectorAll('.fade-in-up, .scroll-reveal');

    elementsToAnimate.forEach(el => {
        // Only set initial hidden state if element isn't already visible
        if (el.style.opacity === '' || el.style.opacity === '1') {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        }
        observer.observe(el);
    });
}

// ============================================
// MOBILE MENU (2025 Full-Screen Version)
// ============================================

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const oldNavLinks = document.getElementById('navLinks');

    if (!menuToggle || !mobileMenu) return;

    const closeMenu = () => {
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');

        // Also close old nav if it exists
        if (oldNavLinks) {
            oldNavLinks.classList.remove('active');
        }

        state.isMenuOpen = false;
    };

    const openMenu = () => {
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        mobileMenu.classList.add('open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-open');

        // Track opening
        if (typeof trackEvent === 'function') {
            trackEvent('Navigation', 'open_mobile_menu', 'Mobile Menu');
        }

        state.isMenuOpen = true;
    };

    // Toggle menu on button click
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        state.isMenuOpen ? closeMenu() : openMenu();
    });

    // Close menu when clicking links inside mobile menu
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();

            // Track link clicks
            if (typeof trackEvent === 'function') {
                trackEvent('Navigation', 'click_mobile_link', link.textContent.trim());
            }
        });
    });

    // Close menu on outside click (backdrop)
    mobileMenu.addEventListener('click', (e) => {
        // Only close if clicking the backdrop, not the inner content
        if (e.target === mobileMenu) {
            closeMenu();
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isMenuOpen) {
            closeMenu();
            menuToggle.focus();
        }
    });

    // Prevent scroll on body when menu is open (double-lock)
    let scrollY = 0;
    const lockScroll = () => {
        scrollY = window.scrollY;
        document.body.style.top = `-${scrollY}px`;
    };

    const unlockScroll = () => {
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
    };

    // Listen for menu state changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (document.body.classList.contains('menu-open')) {
                    lockScroll();
                } else {
                    unlockScroll();
                }
            }
        });
    });

    observer.observe(document.body, { attributes: true });
}

// ============================================
// HEADER SCROLL EFFECTS
// ============================================

function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    let scrollTimeout;

    const handleScroll = () => {
        const currentScrollY = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;

        // Don't hide header when menu is open
        if (state.isMenuOpen) {
            state.lastScrollY = currentScrollY;
            state.ticking = false;
            return;
        }

        // Add shadow when scrolled
        header.classList.toggle('scrolled', currentScrollY > 50);

        // Clear any existing timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        // Delay the header hide/show logic slightly to prevent jitter on mobile
        scrollTimeout = setTimeout(() => {
            // Hide header on scroll down, show on scroll up
            if (currentScrollY > state.lastScrollY && currentScrollY > 100) {
                header.classList.add('header-hidden');
            } else if (currentScrollY < state.lastScrollY || currentScrollY < 50) {
                header.classList.remove('header-hidden');
            }

            state.lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY; // Prevent negative values
        }, 10); // Small delay to batch scroll events

        state.ticking = false;
    };

    const requestTick = () => {
        if (!state.ticking) {
            requestAnimationFrame(handleScroll);
            state.ticking = true;
        }
    };

    window.addEventListener('scroll', requestTick, { passive: true });

    // Initialize lastScrollY on load
    state.lastScrollY = window.pageYOffset || 0;
}

// ============================================
// CONTACT FORM
// ============================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const emailInput = document.getElementById('email');
    const submitButton = form.querySelector('button[type="submit"]');

    // Email validation
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            if (emailInput.value && !validateEmail(emailInput.value)) {
                emailInput.style.borderColor = '#e74c3c';
            } else {
                emailInput.style.borderColor = '';
            }
        });

        emailInput.addEventListener('input', () => {
            emailInput.style.borderColor = '';
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name')?.value || '',
            email: emailInput?.value || '',
            message: document.getElementById('message')?.value || ''
        };

        // Validation
        if (!formData.name || !formData.email || !formData.message) {
            alert('Please fill in all required fields.');
            return;
        }

        if (!validateEmail(formData.email)) {
            alert('Please enter a valid email address.');
            emailInput.focus();
            return;
        }

        // Disable button
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            const subject = encodeURIComponent(`Contact from ${formData.name}`);
            const body = encodeURIComponent(
                `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
            );

            window.location.href = `mailto:muskokabalance@gmail.com?subject=${subject}&body=${body}`;

            setTimeout(() => {
                alert('Thank you! Your email client should open shortly.');
                form.reset();
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }, 500);

        } catch (error) {
            console.error('Form error:', error);
            alert('Error submitting. Please email muskokabalance@gmail.com directly.');
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================

function initScrollToTop() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Scroll to top');
    button.className = 'scroll-to-top-btn';
    button.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: var(--gold);
        color: var(--deep-brown);
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    document.body.appendChild(button);

    const toggleButton = throttle(() => {
        const show = window.pageYOffset > 500;
        button.style.opacity = show ? '1' : '0';
        button.style.visibility = show ? 'visible' : 'hidden';
    }, 100);

    window.addEventListener('scroll', toggleButton, { passive: true });

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// LAZY LOAD IMAGES
// ============================================

function initLazyLoading() {
    if (!('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// ANALYTICS (Placeholder)
// ============================================

function trackEvent(category, action, label) {
    console.log('📊 Event:', { category, action, label });

    // Add your analytics here:
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', action, { event_category: category, event_label: label });
    // }
}

function initAnalytics() {
    // Track CTA clicks
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('CTA', 'click', btn.textContent.trim());
        }, { once: false });
    });
}

// ============================================
// ACCESSIBILITY
// ============================================

function initAccessibility() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--gold);
        color: var(--deep-brown);
        padding: 8px;
        z-index: 10000;
    `;
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

function logPerformance() {
    if (!window.performance) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⚡ Page loaded in ${loadTime}ms`);
        }, 0);
    }, { once: true });
}

// ============================================
// CONSOLE GREETING
// ============================================

function showGreeting() {
    console.log('%c🌿 Muskoka Balance', 'color: #C8A450; font-size: 24px; font-weight: bold;');
    console.log('%cPure. Grounded. Naturally you.', 'color: #241609; font-size: 14px;');
    console.log('%c\n📧 muskokabalance@gmail.com', 'color: #C8A450; font-size: 12px;');
}

// ============================================
// MAIN INITIALIZATION
// ============================================

function init() {
    // Core features
    initPreloader();
    initSmoothScroll();
    initMobileMenu();
    initHeaderScroll();
    initContactForm();

    // Premium features
    initCustomCursor();
    initScrollProgress();
    initMagneticButtons();

    // Enhancement features
    initScrollToTop();
    initLazyLoading();
    initAnalytics();
    initAccessibility();

    // Initialize AOS (Animate On Scroll) if available
    // This needs to run AFTER AOS library loads
    if (typeof AOS !== 'undefined') {
        try {
            AOS.init({
                duration: 700,
                offset: 120,
                easing: 'ease-out-cubic',
                once: false,
                mirror: false,
                disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
                startEvent: 'load' // Initialize on window load
            });
            console.log('✅ AOS initialized');
        } catch (error) {
            console.error('AOS initialization failed:', error);
            // Fallback: show all AOS elements
            document.querySelectorAll('[data-aos]').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
        }
    } else {
        console.warn('⚠️ AOS library not loaded, showing all content');
        // Fallback: show all AOS elements
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    // Monitoring
    logPerformance();
    showGreeting();
}

// ============================================
// BOOTSTRAP
// ============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
    init();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { debounce, throttle, trackEvent };
}
