/* ============================================
   Main Application — Nav, Cursor, Utilities
   ============================================ */

(function () {
    'use strict';

    // ─── CUSTOM CURSOR ───
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Instant cursor update
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Smooth follower with requestAnimationFrame
        function updateFollower() {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;

            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';

            requestAnimationFrame(updateFollower);
        }
        updateFollower();

        // Hover state on interactive elements
        const hoverElements = document.querySelectorAll(
            'a, button, .fleet-card, .service-card, .pricing-card, .testimonial-card, input, textarea, select'
        );

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
            el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            follower.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            follower.style.opacity = '1';
        });
    }

    // ─── MOBILE NAVIGATION ───
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navOverlay = document.getElementById('nav-overlay');

    if (menuToggle && navLinks && navOverlay) {
        function toggleMenu() {
            const isActive = menuToggle.classList.toggle('active');
            navLinks.classList.toggle('mobile-open');
            navOverlay.style.display = isActive ? 'block' : 'none';

            // Trigger overlay fade
            if (isActive) {
                requestAnimationFrame(() => navOverlay.classList.add('active'));
                document.body.style.overflow = 'hidden';
            } else {
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        menuToggle.addEventListener('click', toggleMenu);
        navOverlay.addEventListener('click', toggleMenu);

        // Close menu on link click
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('mobile-open')) {
                    toggleMenu();
                }
            });
        });
    }

    // ─── SMOOTH SCROLL FOR ANCHOR LINKS ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ─── ACTIVE NAV LINK HIGHLIGHT ───
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.pageYOffset;
        const navHeight = document.querySelector('.navbar').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY >= sectionTop && scrollY < sectionBottom) {
                    navLink.classList.add('active');
                    navLink.style.color = 'var(--color-gold)';
                } else {
                    navLink.classList.remove('active');
                    navLink.style.color = '';
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ─── CONTACT FORM ───
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = document.getElementById('submit-btn');
            const originalHTML = btn.innerHTML;

            // Show success state
            btn.innerHTML = '<span>Message Sent! ✓</span>';
            btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
            btn.disabled = true;

            // Create particle burst effect
            createParticleBurst(btn);

            // Reset after delay
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 3000);
        });
    }

    // ─── PARTICLE BURST ON SUBMIT ───
    function createParticleBurst(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: ${Math.random() * 6 + 3}px;
                height: ${Math.random() * 6 + 3}px;
                background: ${Math.random() > 0.5 ? '#c9a84c' : '#e8d48b'};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${centerX}px;
                top: ${centerY}px;
            `;
            document.body.appendChild(particle);

            const angle = (Math.PI * 2 / 20) * i + Math.random() * 0.5;
            const velocity = 80 + Math.random() * 120;
            const destX = Math.cos(angle) * velocity;
            const destY = Math.sin(angle) * velocity;

            if (typeof gsap !== 'undefined') {
                gsap.to(particle, {
                    x: destX,
                    y: destY,
                    opacity: 0,
                    scale: 0,
                    duration: 0.8 + Math.random() * 0.4,
                    ease: 'power3.out',
                    onComplete: () => particle.remove()
                });
            } else {
                setTimeout(() => particle.remove(), 1000);
            }
        }
    }

    // ─── NAVBAR SCROLL BACKGROUND ───
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        const currentScrollY = window.pageYOffset;

        if (currentScrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

    // ─── ABOUT SECTION — Mini 3D Rings (CSS only fallback) ───
    const aboutRings = document.getElementById('about-rings');
    if (aboutRings) {
        aboutRings.innerHTML = `
            <div style="
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: aboutRingSpin 8s linear infinite;
            ">
                <div style="
                    position: absolute;
                    width: 120px;
                    height: 120px;
                    border: 3px solid rgba(201, 168, 76, 0.6);
                    border-radius: 50%;
                    transform: rotateX(60deg) rotateZ(0deg);
                    animation: ringOrbit1 4s linear infinite;
                "></div>
                <div style="
                    position: absolute;
                    width: 120px;
                    height: 120px;
                    border: 3px solid rgba(232, 212, 139, 0.5);
                    border-radius: 50%;
                    transform: rotateX(60deg) rotateZ(90deg);
                    animation: ringOrbit2 5s linear infinite reverse;
                "></div>
                <div style="
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background: var(--color-gold);
                    border-radius: 50%;
                    box-shadow: 0 0 20px rgba(201, 168, 76, 0.6);
                "></div>
            </div>
        `;

        // Add CSS animation rules dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes aboutRingSpin {
                from { transform: rotateY(0deg); }
                to { transform: rotateY(360deg); }
            }
            @keyframes ringOrbit1 {
                from { transform: rotateX(60deg) rotateZ(0deg); }
                to { transform: rotateX(60deg) rotateZ(360deg); }
            }
            @keyframes ringOrbit2 {
                from { transform: rotateX(75deg) rotateZ(90deg); }
                to { transform: rotateX(75deg) rotateZ(450deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // ─── THEME TOGGLE (Dark / Light Mode) ───
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Load saved preference
        const savedTheme = localStorage.getItem('eternal-rides-theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('eternal-rides-theme', isLight ? 'light' : 'dark');

            // Smooth transition on toggle
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(themeToggle, { rotate: 0 }, { rotate: 360, duration: 0.5, ease: 'power2.out' });
            }
        });
    }

    // ─── USER REVIEWS SYSTEM ───
    const reviewForm = document.getElementById('review-form');
    const reviewsContainer = document.getElementById('reviews-container');
    let selectedRating = 0;

    // Star rating input
    const starBtns = document.querySelectorAll('.star-btn');
    starBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedRating = parseInt(btn.getAttribute('data-star'));
            starBtns.forEach((s, i) => {
                if (i < selectedRating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });

        btn.addEventListener('mouseenter', () => {
            const hoverStar = parseInt(btn.getAttribute('data-star'));
            starBtns.forEach((s, i) => {
                if (i < hoverStar) {
                    s.style.color = 'var(--color-gold)';
                    s.style.transform = 'scale(1.2)';
                }
            });
        });

        btn.addEventListener('mouseleave', () => {
            starBtns.forEach((s, i) => {
                if (!s.classList.contains('active')) {
                    s.style.color = '';
                    s.style.transform = '';
                }
            });
        });
    });

    // Load saved reviews
    function loadReviews() {
        const saved = JSON.parse(localStorage.getItem('eternal-rides-reviews') || '[]');
        if (saved.length === 0) {
            reviewsContainer.innerHTML = '<p class="no-reviews-msg">No reviews yet. Be the first to share your experience!</p>';
            return;
        }
        reviewsContainer.innerHTML = '';
        saved.reverse().forEach(review => renderReview(review));
    }

    function renderReview(review) {
        const initials = review.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

        const card = document.createElement('div');
        card.className = 'user-review-card';
        card.innerHTML = `
            <div class="user-review-header">
                <div class="user-review-author">
                    <div class="user-review-avatar">${initials}</div>
                    <div>
                        <span class="user-review-name">${review.name}</span>
                        ${review.vehicle ? `<span class="user-review-vehicle">${review.vehicle}</span>` : ''}
                    </div>
                </div>
                <span class="user-review-stars">${stars}</span>
            </div>
            <p class="user-review-text">"${review.text}"</p>
            <span class="user-review-date">${review.date}</span>
        `;

        // Remove "no reviews" message if present
        const noMsg = reviewsContainer.querySelector('.no-reviews-msg');
        if (noMsg) noMsg.remove();

        reviewsContainer.prepend(card);
    }

    // Submit review
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (selectedRating === 0) {
                alert('Please select a star rating!');
                return;
            }

            const name = document.getElementById('reviewName').value.trim();
            const vehicle = document.getElementById('reviewVehicle').value;
            const text = document.getElementById('reviewText').value.trim();

            if (!name || !text) return;

            const review = {
                name,
                vehicle,
                text,
                rating: selectedRating,
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            };

            // Save to localStorage
            const saved = JSON.parse(localStorage.getItem('eternal-rides-reviews') || '[]');
            saved.push(review);
            localStorage.setItem('eternal-rides-reviews', JSON.stringify(saved));

            // Render the new review
            renderReview(review);

            // Reset form
            reviewForm.reset();
            selectedRating = 0;
            starBtns.forEach(s => {
                s.classList.remove('active');
                s.style.color = '';
                s.style.transform = '';
            });

            // Success feedback
            const btn = document.getElementById('review-submit-btn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span>Review Submitted! ✦</span>';
            btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
            createParticleBurst(btn);

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
            }, 2500);
        });

        loadReviews();
    }

    // ─── 3D CAR SHOWCASE ───
    const showcaseCar = document.getElementById('showcase-car');
    const showcaseCarImg = document.getElementById('showcase-car-img');
    const showcaseSpecs = document.getElementById('showcase-specs');
    const showcaseSelector = document.getElementById('showcase-selector');
    const showcaseParticles = document.getElementById('showcase-particles');

    if (showcaseCar && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

        // Generate floating particles
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'showcase-particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.setProperty('--px', (Math.random() - 0.5) * 150 + 'px');
            p.style.setProperty('--py', -(50 + Math.random() * 100) + 'px');
            p.style.animationDelay = Math.random() * 3 + 's';
            p.style.width = (2 + Math.random() * 4) + 'px';
            p.style.height = p.style.width;
            showcaseParticles.appendChild(p);
        }

        // ScrollTrigger — 3D car animation
        gsap.registerPlugin(ScrollTrigger);

        // Car drives in from the left
        gsap.fromTo('#showcase-car-wrapper', {
            x: '-100vw',
            rotateY: -30,
            scale: 0.7,
            opacity: 0
        }, {
            scrollTrigger: {
                trigger: '#car-showcase',
                start: 'top 80%',
                end: 'center center',
                scrub: 1
            },
            x: 0,
            rotateY: 0,
            scale: 1,
            opacity: 1,
            ease: 'power2.out'
        });

        // Specs appear as car enters
        const specs = showcaseSpecs.querySelectorAll('.showcase-spec');
        ScrollTrigger.create({
            trigger: '#car-showcase',
            start: 'center 60%',
            onEnter: () => {
                specs.forEach((spec, i) => {
                    setTimeout(() => spec.classList.add('visible'), i * 200);
                });
            },
            onLeaveBack: () => {
                specs.forEach(spec => spec.classList.remove('visible'));
            }
        });

        // 3D rotation on scroll through section
        gsap.to('#showcase-car', {
            scrollTrigger: {
                trigger: '#car-showcase',
                start: 'center center',
                end: 'bottom top',
                scrub: 1
            },
            rotateY: 15,
            rotateX: -5,
            scale: 1.05,
            ease: 'none'
        });

        // Mouse hover 3D tilt on car
        const showcaseWrapper = document.getElementById('showcase-car-wrapper');
        if (showcaseWrapper) {
            showcaseWrapper.addEventListener('mousemove', (e) => {
                const rect = showcaseWrapper.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                gsap.to('#showcase-car', {
                    rotateY: x * 25,
                    rotateX: -y * 15,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });

            showcaseWrapper.addEventListener('mouseleave', () => {
                gsap.to('#showcase-car', {
                    rotateY: 0,
                    rotateX: 0,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        }

        // Car selector
        if (showcaseSelector) {
            const carData = {
                rolls_royce: { specs: ['6.75L', '563', '5.4s', '★★★★★'], labels: ['V12 Engine', 'Horsepower', '0-60 mph', 'Guest Rating'] },
                mercedes: { specs: ['4.0L', '496', '4.4s', '★★★★★'], labels: ['V8 Biturbo', 'Horsepower', '0-60 mph', 'Guest Rating'] },
                bentley: { specs: ['6.0L', '626', '3.6s', '★★★★★'], labels: ['W12 Engine', 'Horsepower', '0-60 mph', 'Guest Rating'] },
                vintage_car: { specs: ['4.9L', '178', '10.9s', '★★★★★'], labels: ['Inline-6', 'Horsepower', '0-60 mph', 'Guest Rating'] }
            };

            showcaseSelector.querySelectorAll('.showcase-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    // Update active state
                    showcaseSelector.querySelectorAll('.showcase-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const carKey = btn.getAttribute('data-car');
                    const carName = btn.getAttribute('data-name');

                    // Animate car out and in
                    gsap.to('#showcase-car', {
                        rotateY: -90,
                        scale: 0.8,
                        opacity: 0,
                        duration: 0.4,
                        ease: 'power2.in',
                        onComplete: () => {
                            // Switch image
                            showcaseCarImg.src = `assets/images/${carKey}.png`;
                            showcaseCarImg.alt = `${carName} 3D Showcase`;

                            // Update specs
                            if (carData[carKey]) {
                                specs.forEach((spec, i) => {
                                    spec.querySelector('.spec-value').textContent = carData[carKey].specs[i];
                                    spec.querySelector('.spec-label').textContent = carData[carKey].labels[i];
                                });
                            }

                            // Animate back in
                            gsap.fromTo('#showcase-car', {
                                rotateY: 90,
                                scale: 0.8,
                                opacity: 0
                            }, {
                                rotateY: 0,
                                scale: 1,
                                opacity: 1,
                                duration: 0.6,
                                ease: 'power3.out'
                            });
                        }
                    });
                });
            });
        }
    }

    // ─── BACK TO TOP BUTTON ───
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ─── REVEAL ON SCROLL (Intersection Observer fallback) ───
    if (!('IntersectionObserver' in window)) return;

    const revealElements = document.querySelectorAll('[data-animate]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── PRELOAD IMAGES ───
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
    } else {
        // Fallback: load all immediately
        images.forEach(img => {
            img.src = img.src;
        });
    }

    // ─── LOG ───
    console.log(
        '%c✦ Eternal Rides %c— Luxury Wedding Car Rental',
        'color: #c9a84c; font-family: Georgia, serif; font-size: 16px; font-weight: bold;',
        'color: #8a8278; font-family: sans-serif; font-size: 12px;'
    );

})();

