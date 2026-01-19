/**
 * EDEA FIX - Main JavaScript
 * Professional Carpentry Website - Hundvåg, Stavanger
 */

(function() {
    'use strict';

    // ========================================
    // DOM Elements
    // ========================================
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    // ========================================
    // Mobile Navigation Toggle
    // ========================================
    function initMobileNav() {
        if (!navToggle || !nav) return;

        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            this.setAttribute('aria-expanded', !isExpanded);
            this.classList.toggle('active');
            nav.classList.toggle('active');

            // Prevent body scroll when nav is open
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // Close nav when clicking on a link
        const navLinks = nav.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close nav when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('active') &&
                !nav.contains(e.target) &&
                !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close nav on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ========================================
    // Header Scroll Effect
    // ========================================
    function initHeaderScroll() {
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateHeader() {
            const scrollY = window.scrollY;

            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScrollY = scrollY;
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });

        // Initial check
        updateHeader();
    }

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');

                if (targetId === '#') return;

                const target = document.querySelector(targetId);

                if (target) {
                    e.preventDefault();

                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========================================
    // Contact Form Handler
    // ========================================
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                jobType: document.getElementById('jobType').value,
                description: document.getElementById('description').value,
                siteVisit: document.getElementById('siteVisit').checked
            };

            // Get submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; animation: spin 1s linear infinite;">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sender...
            `;

            try {
                // Simulate form submission (replace with actual API call)
                // In production, you would send this to your backend or email service
                await simulateFormSubmission(formData);

                // Show success message
                contactForm.style.display = 'none';
                if (formSuccess) {
                    formSuccess.classList.add('show');
                }

                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

            } catch (error) {
                console.error('Form submission error:', error);

                // Show error message
                alert('Beklager, noe gikk galt. Vennligst prøv igjen eller kontakt oss direkte på telefon.');

                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });

        // Form validation feedback
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }

    // Simulate form submission (for demo purposes)
    function simulateFormSubmission(formData) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // Log form data (in production, send to server)
                console.log('Form submitted:', formData);

                // For demo, always succeed
                resolve({ success: true });

                // To test error handling, uncomment:
                // reject(new Error('Network error'));
            }, 1500);
        });
    }

    // Validate individual field
    function validateField(field) {
        const isValid = field.checkValidity();

        if (!isValid) {
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }

        return isValid;
    }

    // ========================================
    // Animate on Scroll (Simple Implementation)
    // ========================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .benefit-item, .value-card, .project-card');

        if (!animatedElements.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }

    // ========================================
    // Click-to-Call Tracking (Analytics)
    // ========================================
    function initClickTracking() {
        // Track phone clicks
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', function() {
                if (typeof gtag === 'function') {
                    gtag('event', 'click', {
                        'event_category': 'Contact',
                        'event_label': 'Phone Call',
                        'value': 1
                    });
                }
                console.log('Phone click tracked');
            });
        });

        // Track email clicks
        document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            link.addEventListener('click', function() {
                if (typeof gtag === 'function') {
                    gtag('event', 'click', {
                        'event_category': 'Contact',
                        'event_label': 'Email',
                        'value': 1
                    });
                }
                console.log('Email click tracked');
            });
        });
    }

    // ========================================
    // Lazy Load Images
    // ========================================
    function initLazyLoad() {
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        } else {
            // Fallback for older browsers
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');

            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // ========================================
    // Current Year for Copyright
    // ========================================
    function updateCopyrightYear() {
        const yearElements = document.querySelectorAll('.copyright-year');
        const currentYear = new Date().getFullYear();

        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
    }

    // ========================================
    // Add CSS for Spinner Animation
    // ========================================
    function addSpinnerStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            .form-group input.error,
            .form-group select.error,
            .form-group textarea.error {
                border-color: #e53e3e;
                box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
            }
        `;
        document.head.appendChild(style);
    }

    // ========================================
    // Initialize All Functions
    // ========================================
    function init() {
        addSpinnerStyles();
        initMobileNav();
        initHeaderScroll();
        initSmoothScroll();
        initContactForm();
        initScrollAnimations();
        initClickTracking();
        initLazyLoad();
        updateCopyrightYear();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
