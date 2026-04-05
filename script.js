document.addEventListener("DOMContentLoaded", () => {


    // 2. INTRO MASK REVEAL ANIMATION
    // =============================================
    const introLayer = document.getElementById("intro");
    const introSvg = document.getElementById("intro-svg");
    const homepage = document.getElementById("homepage");

    let startTimestamp = null;
    const animationDuration = 2500;

    function easeInOutExpo(x) {
        if (x === 0) return 0;
        if (x === 1) return 1;
        if (x < 0.5) return Math.pow(2, 20 * x - 10) / 2;
        return (2 - Math.pow(2, -20 * x + 10)) / 2;
    }

    function animateIntro(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        let progress = Math.min((timestamp - startTimestamp) / animationDuration, 1);
        const eased = easeInOutExpo(progress);

        const svgScale = 1 + eased * 200;
        const hpScale = 0.92 + eased * 0.08;

        introSvg.style.transform = `scale(${svgScale})`;
        homepage.style.transform = `scale(${hpScale})`;

        if (progress < 1) {
            requestAnimationFrame(animateIntro);
        } else {
            introLayer.style.display = "none";
            homepage.style.transform = "";
            // After intro, set nav to transparent
            updateNav();
        }
    }

    setTimeout(() => {
        requestAnimationFrame(animateIntro);
    }, 500);

    // =============================================
    // 3. STICKY NAV — scroll color change
    // =============================================
    const mainNav = document.getElementById("main-nav");
    const heroSection = document.getElementById("hero");

    function updateNav() {
        if (!heroSection) return;
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        const scrolled = heroBottom <= 0;

        if (scrolled) {
            mainNav.classList.remove("transparent");
            mainNav.classList.add("scrolled");
        } else {
            mainNav.classList.add("transparent");
            mainNav.classList.remove("scrolled");
        }
    }

    // Start transparent
    mainNav.classList.add("transparent");

    window.addEventListener("scroll", () => {
        updateNav();
        applyParallax();
    }, { passive: true });

    // =============================================
    // 4. PARALLAX EFFECT ON HERO
    // =============================================
    const heroText = document.getElementById("hero-text");
    const heroVideo = document.getElementById("hero-video");

    function applyParallax() {
        const scrollY = window.scrollY;
        // Video moves slower than scroll (feel of depth)
        if (heroVideo) {
            heroVideo.style.transform = `translateY(${scrollY * 0.4}px)`;
        }
        // Text moves up faster (floats away)
        if (heroText) {
            heroText.style.transform = `translateY(${scrollY * 0.55}px)`;
            heroText.style.opacity = Math.max(0, 1 - scrollY / 500);
        }
    }

    // =============================================
    // 5. SCROLL REVEAL — sections fade in
    // =============================================
    const revealEls = document.querySelectorAll(
        ".mission-inner, .stats-grid, .program-card, .cocurr-inner, " +
        ".admissions-inner, .leader-card, .news-card, .step, " +
        ".contact-inner, .footer-inner"
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach((el, i) => {
        el.classList.add("reveal-hidden");
        // Stagger children in grids
        el.style.transitionDelay = `${(i % 4) * 80}ms`;
        revealObserver.observe(el);
    });

    // Inject reveal CSS dynamically (keeps CSS file clean)
    const style = document.createElement("style");
    style.textContent = `
        .reveal-hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.7s cubic-bezier(0.165, 0.84, 0.44, 1),
                        transform 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .reveal-hidden.revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

});