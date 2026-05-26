/* ============================================
   GSAP ScrollTrigger Animations
   ============================================ */

(function () {
    'use strict';

    // Wait for GSAP and ScrollTrigger to load
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ─── HERO ANIMATIONS (on load) ───
    function initHeroAnimations() {
        const tl = gsap.timeline({ delay: 0.5 });

        // Subtitle fade in
        tl.to('.hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        });

        // Title lines stagger
        tl.to('.title-line', {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power4.out'
        }, '-=0.4');

        // Description
        tl.to('.hero-description', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5');

        // CTA buttons
        tl.to('.hero-cta-group', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4');

        // Scroll indicator
        tl.to('.hero-scroll-indicator', {
            opacity: 0.6,
            duration: 1,
            ease: 'power2.out'
        }, '-=0.2');
    }

    // ─── NAVBAR SCROLL EFFECT ───
    ScrollTrigger.create({
        start: 'top -80px',
        onUpdate: (self) => {
            const navbar = document.getElementById('navbar');
            if (self.direction === 1 && self.progress > 0) {
                navbar.classList.add('scrolled');
            } else if (self.progress === 0) {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Hero content parallax & fade on scroll
    gsap.to('.hero-content', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: -100,
        opacity: 0,
        scale: 0.95,
        ease: 'none'
    });

    gsap.to('.hero-scroll-indicator', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: '30% top',
            scrub: 1
        },
        opacity: 0,
        y: 30
    });

    // ─── ABOUT SECTION ───
    // Section label & title
    gsap.from('#about .section-label', {
        scrollTrigger: {
            trigger: '#about',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('#about .section-title', {
        scrollTrigger: {
            trigger: '#about',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
    });

    // About text paragraphs
    gsap.from('.about-text p', {
        scrollTrigger: {
            trigger: '.about-text',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });

    // About visual (rings area)
    gsap.from('.about-visual', {
        scrollTrigger: {
            trigger: '.about-visual',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        scale: 0.8,
        rotation: -10,
        duration: 1,
        ease: 'power3.out'
    });

    // Stats counter animation
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const obj = { val: 0 };

        gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
                element.textContent = Math.floor(obj.val);
            }
        });
    }

    // Stats cards stagger
    gsap.from('.stat-item', {
        scrollTrigger: {
            trigger: '.about-stats',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            onEnter: () => {
                document.querySelectorAll('.stat-number[data-count]').forEach(el => {
                    animateCounter(el);
                });
            }
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    });

    // ─── FLEET SECTION ───
    gsap.from('#fleet .section-label', {
        scrollTrigger: {
            trigger: '#fleet',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('#fleet .section-title', {
        scrollTrigger: {
            trigger: '#fleet',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Fleet cards stagger in with 3D rotation
    gsap.from('.fleet-card', {
        scrollTrigger: {
            trigger: '.fleet-wrapper',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 80,
        rotationX: 15,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out'
    });

    // Fleet nav
    gsap.from('.fleet-nav', {
        scrollTrigger: {
            trigger: '.fleet-nav',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out'
    });

    // ─── SERVICES SECTION ───
    gsap.from('#services .section-label', {
        scrollTrigger: {
            trigger: '#services',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('#services .section-title', {
        scrollTrigger: {
            trigger: '#services',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Service cards with staggered 3D flip-in
    gsap.from('.service-card', {
        scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 60,
        rotationY: -15,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out'
    });

    // ─── TESTIMONIALS SECTION ───
    gsap.from('#testimonials .section-label', {
        scrollTrigger: {
            trigger: '#testimonials',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('#testimonials .section-title', {
        scrollTrigger: {
            trigger: '#testimonials',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('.testimonials-marquee', {
        scrollTrigger: {
            trigger: '.testimonials-marquee',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        scale: 0.95,
        duration: 1,
        ease: 'power3.out'
    });

    // ─── PRICING SECTION ───
    gsap.from('#pricing .section-label', {
        scrollTrigger: {
            trigger: '#pricing',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('#pricing .section-title', {
        scrollTrigger: {
            trigger: '#pricing',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('#pricing .section-subtitle', {
        scrollTrigger: {
            trigger: '#pricing',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Pricing cards rise up with stagger
    gsap.from('.pricing-card', {
        scrollTrigger: {
            trigger: '.pricing-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
            onEnter: () => {
                // Animate pricing amounts
                document.querySelectorAll('.pricing-amount[data-count]').forEach(el => {
                    animateCounter(el);
                });
            }
        },
        opacity: 0,
        y: 80,
        scale: 0.9,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out'
    });

    // ─── CONTACT SECTION ───
    gsap.from('#contact .section-label', {
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('#contact .section-title', {
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Form fields stagger reveal
    gsap.from('.contact-form .form-group, .contact-form .form-row, .contact-form .btn', {
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out'
    });

    // Contact info slide in
    gsap.from('.contact-info', {
        scrollTrigger: {
            trigger: '.contact-info',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: 60,
        duration: 0.9,
        ease: 'power3.out'
    });

    // ─── FOOTER ───
    gsap.from('.footer-content > *', {
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    });

    // ─── PARALLAX BACKGROUNDS ───
    // Create subtle parallax on section backgrounds
    document.querySelectorAll('.section').forEach(section => {
        gsap.to(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            backgroundPositionY: '30%',
            ease: 'none'
        });
    });

    // ─── 3D TILT EFFECT ON HOVER ───
    function init3DTilt() {
        const tiltCards = document.querySelectorAll('[data-tilt]');

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    transformPerspective: 1000,
                    duration: 0.3,
                    ease: 'power2.out'
                });

                // Move glow to mouse position
                const glow = card.querySelector('.service-card-glow');
                if (glow) {
                    const glowX = (x / rect.width) * 100;
                    const glowY = (y / rect.height) * 100;
                    glow.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(201, 168, 76, 0.15) 0%, transparent 50%)`;
                }
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.5,
                    ease: 'power3.out'
                });
            });
        });
    }

    // ─── MAGNETIC BUTTON EFFECT ───
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.btn, .fleet-nav-btn, .social-link');

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(btn, {
                    x: x * 0.2,
                    y: y * 0.2,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });
    }

    // ─── INITIALIZE ───
    window.addEventListener('load', () => {
        // Hide loader
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) loader.classList.add('hidden');

            // Start hero animations after loader fades
            setTimeout(initHeroAnimations, 300);
        }, 1500);

        init3DTilt();
        initMagneticButtons();
    });

    // Duplicate testimonial cards for seamless infinite scroll
    const track = document.querySelector('.testimonials-track');
    if (track) {
        const cards = track.innerHTML;
        track.innerHTML = cards + cards;
    }

})();
