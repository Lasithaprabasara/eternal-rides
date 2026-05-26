/* ============================================
   Fleet 3D Carousel
   ============================================ */

(function () {
    'use strict';

    const track = document.getElementById('fleet-track');
    const prevBtn = document.getElementById('fleet-prev');
    const nextBtn = document.getElementById('fleet-next');
    const dotsContainer = document.getElementById('fleet-dots');

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = track.querySelectorAll('.fleet-card');
    const totalCards = cards.length;
    let currentIndex = 0;
    let cardWidth = 0;
    let gap = 32;
    let visibleCards = 3;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let autoPlayTimer = null;

    // ─── CALCULATE DIMENSIONS ───
    function calculateDimensions() {
        const containerWidth = track.parentElement.offsetWidth;

        if (window.innerWidth <= 480) {
            cardWidth = 260;
            gap = 16;
            visibleCards = 1;
        } else if (window.innerWidth <= 768) {
            cardWidth = 280;
            gap = 20;
            visibleCards = 1;
        } else if (window.innerWidth <= 1024) {
            cardWidth = 320;
            gap = 24;
            visibleCards = 2;
        } else {
            cardWidth = 380;
            gap = 32;
            visibleCards = 3;
        }
    }

    // ─── CREATE DOTS ───
    function createDots() {
        dotsContainer.innerHTML = '';
        const maxIndex = Math.max(0, totalCards - visibleCards);

        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('button');
            dot.classList.add('fleet-dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to car ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // ─── UPDATE DOTS ───
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.fleet-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    // ─── GO TO SLIDE ───
    function goToSlide(index) {
        const maxIndex = Math.max(0, totalCards - visibleCards);
        currentIndex = Math.max(0, Math.min(index, maxIndex));

        const offset = currentIndex * (cardWidth + gap);
        currentTranslate = -offset;
        prevTranslate = currentTranslate;

        track.style.transform = `translateX(${currentTranslate}px)`;

        updateDots();
        updateCardStates();
    }

    // ─── UPDATE CARD VISUAL STATES ───
    function updateCardStates() {
        cards.forEach((card, i) => {
            const isVisible = i >= currentIndex && i < currentIndex + visibleCards;
            const isCentered = i === currentIndex + Math.floor(visibleCards / 2);

            if (isVisible) {
                card.style.opacity = '1';
                card.style.filter = 'none';
            } else {
                card.style.opacity = '0.4';
                card.style.filter = 'blur(2px)';
            }

            if (isCentered && visibleCards > 1) {
                card.style.transform = 'scale(1.03)';
            } else {
                card.style.transform = '';
            }
        });
    }

    // ─── NAVIGATION ───
    function nextSlide() {
        const maxIndex = Math.max(0, totalCards - visibleCards);
        if (currentIndex >= maxIndex) {
            goToSlide(0); // Loop back
        } else {
            goToSlide(currentIndex + 1);
        }
    }

    function prevSlide() {
        const maxIndex = Math.max(0, totalCards - visibleCards);
        if (currentIndex <= 0) {
            goToSlide(maxIndex); // Loop to end
        } else {
            goToSlide(currentIndex - 1);
        }
    }

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });

    // ─── TOUCH / DRAG SUPPORT ───
    function handleDragStart(e) {
        isDragging = true;
        startX = getPositionX(e);
        track.style.transition = 'none';
        track.style.cursor = 'grabbing';
    }

    function handleDragMove(e) {
        if (!isDragging) return;
        const currentX = getPositionX(e);
        const diff = currentX - startX;
        currentTranslate = prevTranslate + diff;
        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function handleDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = '';
        track.style.cursor = '';

        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -80) {
            nextSlide();
        } else if (movedBy > 80) {
            prevSlide();
        } else {
            goToSlide(currentIndex);
        }

        resetAutoPlay();
    }

    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    // Mouse events
    track.addEventListener('mousedown', handleDragStart);
    track.addEventListener('mousemove', handleDragMove);
    track.addEventListener('mouseup', handleDragEnd);
    track.addEventListener('mouseleave', handleDragEnd);

    // Touch events
    track.addEventListener('touchstart', handleDragStart, { passive: true });
    track.addEventListener('touchmove', handleDragMove, { passive: true });
    track.addEventListener('touchend', handleDragEnd);

    // Prevent link/image dragging
    track.addEventListener('dragstart', (e) => e.preventDefault());

    // ─── KEYBOARD NAVIGATION ───
    document.addEventListener('keydown', (e) => {
        // Only respond if fleet section is in view
        const fleetSection = document.getElementById('fleet');
        const rect = fleetSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (!isInView) return;

        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoPlay();
        }
    });

    // ─── AUTO PLAY ───
    function startAutoPlay() {
        autoPlayTimer = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    // ─── RESIZE HANDLER ───
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            calculateDimensions();
            createDots();
            goToSlide(Math.min(currentIndex, totalCards - visibleCards));
        }, 200);
    });

    // ─── INITIALIZE ───
    calculateDimensions();
    createDots();
    updateCardStates();
    startAutoPlay();

    // Pause auto-play when hovering over fleet section
    const fleetSection = document.getElementById('fleet');
    fleetSection.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    fleetSection.addEventListener('mouseleave', () => startAutoPlay());

})();
