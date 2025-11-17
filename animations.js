/**
 * MUSKOKA BALANCE - Premium Scrollytelling Animations
 * 2025 Web Development Standards
 * Optimized for 60fps on mobile, tablet, and desktop
 */

// ============================================
// INITIALIZATION & PERFORMANCE SETUP
// ============================================

// Wait for GSAP and DOM to be ready
window.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') {
        return;
    }

    initScrollAnimations();
});

function initScrollAnimations() {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // ============================================
    // PERFORMANCE OPTIMIZATIONS
    // ============================================

    // Detect device capabilities
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Disable complex animations if user prefers reduced motion
    if (prefersReducedMotion) {
        console.log('Reduced motion preference detected. Simplifying animations.');
        document.body.style.setProperty('--animation-duration', '0.01ms');
        return;
    }

    // ============================================
    // NATIVE SCROLL - No virtual scroll interception
    // ============================================

    // Native browser scrolling - responsive and performant

    // ============================================
    // 1. HERO SECTION - TEXT REVEAL ANIMATION
    // ============================================

    const heroTitle = document.querySelector('.hero-title .reveal-text');

    if (heroTitle && typeof SplitType !== 'undefined') {
        // Split text into characters for reveal animation
        const split = new SplitType(heroTitle, {
            types: 'chars',
            tagName: 'span'
        });

        // Animate each character
        gsap.from(split.chars, {
            opacity: 0,
            y: 100,
            rotateX: -90,
            stagger: 0.03,
            duration: 0.8,
            ease: 'back.out(1.4)',
            delay: 0.5,
            onComplete: () => {
                // Clean up for better performance
                split.revert();
            }
        });
    }

    // ============================================
    // 2. HERO CONTENT - STAGGERED ENTRANCE
    // ============================================

    gsap.from('.hero-tagline', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2
    });

    gsap.from('.hero-description', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.4
    });

    gsap.from('.hero-cta', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.6
    });

    gsap.from('.cta-subtext', {
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.8
    });

    // ============================================
    // 3. MAGNETIC BUTTONS (Desktop Only)
    // ============================================

    if (!isMobile && !isTablet) {
        const magneticButtons = document.querySelectorAll('.hero-btn-1');

        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(button, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });

            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });
    }

    // ============================================
    // 4. PARALLAX SCROLLING (Hero Background) - SIMPLIFIED
    // ============================================

    // Reduced scrub value for more responsive feel
    gsap.to('.hero', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.3  // Reduced from 1.5 - much more responsive
        },
        opacity: 0.5,  // Less dramatic change
        scale: 1.05,   // Subtle scale
        ease: 'none'
    });

    // Hide scroll indicator on scroll - simplified
    gsap.to('.scroll-indicator', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: '10% top',  // Faster hide
            scrub: 0.2  // More responsive
        },
        opacity: 0,
        y: -10,
        ease: 'none'
    });

    // ============================================
    // 5. SCROLL REVEAL ANIMATIONS
    // ============================================

    // Generic scroll reveal for all elements
    gsap.utils.toArray('.scroll-reveal').forEach((element) => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                end: 'top 50%',
                toggleActions: 'play none none reverse',
                // markers: true, // Enable for debugging
            },
            opacity: 0,
            y: 60,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // ============================================
    // 6. STAGGERED ANIMATIONS
    // ============================================

    gsap.utils.toArray('.scroll-reveal-stagger').forEach((container) => {
        const items = container.querySelectorAll('.stagger-item');

        gsap.from(items, {
            scrollTrigger: {
                trigger: container,
                start: 'top 80%',
                end: 'top 40%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // ============================================
    // 7. NUMBER COUNTER ANIMATIONS
    // ============================================

    gsap.utils.toArray('.counter-animate').forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target'));

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(counter, {
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    ease: 'power2.out',
                    onUpdate: function() {
                        counter.innerText = Math.ceil(this.targets()[0].innerText);
                    }
                });
            },
            once: true
        });
    });

    // ============================================
    // 8. FEATURE ITEMS - SCALE ON SCROLL (SIMPLIFIED)
    // ============================================

    gsap.utils.toArray('.feature-item').forEach((item) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                end: 'top 70%',
                scrub: 0.3  // Reduced from 1 - more responsive
            },
            scale: 0.95,   // Subtle scale change
            opacity: 0.7,  // Less dramatic
            ease: 'none'
        });
    });

    // ============================================
    // 10. SECTION BACKGROUNDS - PARALLAX (DISABLED)
    // ============================================

    // Background parallax disabled for performance

    // ============================================
    // 11. TESTIMONIALS - FADE & SLIDE
    // ============================================

    gsap.utils.toArray('.feature-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 55%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 40,
            rotation: index % 2 === 0 ? -2 : 2,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });

    // ============================================
    // 12. SMOOTH SCROLL TO ANCHORS
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    ease: 'power3.inOut'
                });
            }
        });
    });

    // ============================================
    // 13. PERFORMANCE MONITORING
    // ============================================

    // Refresh on window resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });

    // ============================================
    // 14. SIMPLE FIXED PARALLAX (NO CONFLICTS)
    // ============================================

    // Parallax handled by CSS only

    // ============================================
    // 15. ACCESSIBILITY - PAUSE ANIMATIONS
    // ============================================

    // Pause all animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            gsap.globalTimeline.pause();
        } else {
            gsap.globalTimeline.resume();
        }
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollPolyfill = document.createElement('script');
    smoothScrollPolyfill.src = 'https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js';
    document.head.appendChild(smoothScrollPolyfill);

    smoothScrollPolyfill.onload = () => {
        window.__forceSmoothScrollPolyfill__ = true;
        smoothscroll.polyfill();
    };
}

// Preload critical images for smoother animations
function preloadImages() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize image preloading
preloadImages();
