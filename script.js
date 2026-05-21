document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. THEME SWITCHER (DARK / LIGHT MODE)
       ========================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const bodyElement = document.body;

    // Check for saved theme in localStorage, otherwise check system preferences
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        bodyElement.classList.add('light-theme');
    } else {
        bodyElement.classList.remove('light-theme');
    }

    // Toggle theme click handler
    themeToggleBtn.addEventListener('click', () => {
        bodyElement.classList.toggle('light-theme');
        
        // Save user selection to localStorage
        if (bodyElement.classList.contains('light-theme')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });


    /* ==========================================
       2. RESPONSIVE MOBILE NAVIGATION MENU
       ========================================== */
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu visibility
    mobileNavToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        bodyElement.classList.toggle('mobile-menu-open');
    });

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            bodyElement.classList.remove('mobile-menu-open');
        });
    });


    /* ==========================================
       3. STICKY HEADER & ACTIVE SCROLL TRACKER
       ========================================== */
    const header = document.getElementById('header');
    
    // Add scrolled class to navbar when user scrolls past 20px
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // IntersectionObserver to track which section is active in the viewport
    const sections = document.querySelectorAll('section[id]');
    const navObserverOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the center zone
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Clear active states and set new active state
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });


    /* ==========================================
       4. HERO TYPEWRITER ANIMATION
       ========================================== */
    const typedTextSpan = document.getElementById('typed-text');
    const wordsAttr = typedTextSpan.getAttribute('data-words');
    const words = JSON.parse(wordsAttr);
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Remove character
            typedTextSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deletion is faster
        } else {
            // Add character
            typedTextSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        // Handle word switching states
        if (!isDeleting && charIndex === currentWord.length) {
            // Word fully typed, pause before deleting
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to next word in cycle
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before starting to type next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Start typing animation after a brief initial pause
    if (words && words.length > 0) {
        setTimeout(typeEffect, 1000);
    }


    /* ==========================================
       5. INTERACTIVE PORTFOLIO PROJECT FILTERS
       ========================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active state from current buttons, add to clicked button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    // Show matching card
                    card.classList.remove('fade-out');
                    card.classList.add('fade-in');
                } else {
                    // Hide non-matching card
                    card.classList.remove('fade-in');
                    card.classList.add('fade-out');
                }
            });
        });
    });


    /* ==========================================
       6. HIGH PERFORMANCE SCROLL REVEAL ANIMATIONS
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before entry
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve once revealed to keep layout stable and save cycles
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* ==========================================
       7. CONTACT FORM SUBMISSION & SUCCESS TOASTS
       ========================================== */
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.contact-form-btn');
            const originalBtnText = submitBtn.innerHTML;

            // Show interactive loading state
            submitBtn.disabled = true;
            submitBtn.style.transform = 'scale(0.95)';
            submitBtn.innerHTML = `
                Sending... 
                <span class="spinner" style="
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: #fff;
                    animation: spin 0.8s linear infinite;
                    margin-left: 8px;
                    vertical-align: middle;
                "></span>
                <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
            `;

            // Simulate form submission delay
            setTimeout(() => {
                // Success visual state
                submitBtn.innerHTML = `
                    Message Sent! 
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-left:8px; vertical-align:middle;">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;
                submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                submitBtn.style.boxShadow = '0 10px 20px -10px #10b981';

                // Display a premium custom toast message
                showToast("Thank you, Marnel has received your message!");

                // Reset form values after a delay
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.style.transform = '';
                    submitBtn.style.background = '';
                    submitBtn.style.boxShadow = '';
                }, 3000);

            }, 1800);
        });
    }

    // Custom Toast Notification System
    function showToast(message) {
        // Remove old toast if exists
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <div class="toast-content" style="
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: var(--glass-bg);
                backdrop-filter: blur(16px);
                border: 1px solid var(--accent-primary);
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                border-radius: 16px;
                padding: 16px 24px;
                color: var(--text-primary);
                font-family: var(--font-primary);
                font-weight: 600;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 12px;
                transform: translateY(100px);
                opacity: 0;
                transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease;
            ">
                <span style="font-size: 1.3rem;">🎉</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        const toastInner = toast.querySelector('.toast-content');

        // Animation frame trigger
        requestAnimationFrame(() => {
            toastInner.style.transform = 'translateY(0)';
            toastInner.style.opacity = '1';
        });

        // Hide and remove toast
        setTimeout(() => {
            toastInner.style.transform = 'translateY(100px)';
            toastInner.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    }
});
