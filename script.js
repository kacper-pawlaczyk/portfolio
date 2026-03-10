gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// --- 1. Loader & Init ---
let progress = 0;
const loaderText = document.querySelector('.loader-text');
const loader = document.querySelector('.loader');

const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 10) + 5;
    if (progress > 100) progress = 100;
    loaderText.innerText = `${progress}%`;

    if (progress === 100) {
        clearInterval(interval);
        gsap.to(loader, {
            y: "-100%",
            duration: 1,
            ease: "power4.inOut",
            delay: 0.5
        });
        startSiteAnimations();
    }
}, 50);

function startSiteAnimations() {
    gsap.from(".anim-text", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 1
    });
}

// --- 2. Tłumaczenie ---
const langToggle = document.getElementById('lang-toggle');
const labelPl = document.getElementById('label-pl');
const labelEn = document.getElementById('label-en');
const translatableElements = document.querySelectorAll('[data-en]');
const cards = document.querySelectorAll('.glass-card');

translatableElements.forEach(el => {
    el.setAttribute('data-pl', el.innerHTML);
});

if (langToggle) {
    langToggle.addEventListener('change', () => {
        langToggle.disabled = true;
        const lang = langToggle.checked ? 'en' : 'pl';

        if (lang === 'en') {
            labelEn.classList.add('active');
            labelPl.classList.remove('active');
        } else {
            labelPl.classList.add('active');
            labelEn.classList.remove('active');
        }

        const startHeights = [];
        cards.forEach((card, i) => {
            startHeights[i] = card.offsetHeight;
            card.style.height = startHeights[i] + 'px';
        });

        const tl = gsap.timeline({
            onComplete: () => {
                langToggle.disabled = false;
                gsap.set(cards, {
                    height: "auto"
                });
            }
        });

        tl.to(translatableElements, {
            filter: "blur(10px)",
            opacity: 0,
            scale: 0.95,
            y: -5,
            duration: 0.3,
            stagger: 0.01,
            ease: "power2.in"
        });

        tl.call(() => {
            translatableElements.forEach(el => {
                const newText = el.getAttribute(`data-${lang}`);
                if (newText) el.innerHTML = newText;
            });

            gsap.set(translatableElements, {
                scale: 1.05,
                y: 5
            });

            cards.forEach((card, i) => {
                card.style.height = 'auto';
                const endHeight = card.offsetHeight;

                gsap.fromTo(card, {
                    height: startHeights[i]
                }, {
                    height: endHeight,
                    duration: 0.6,
                    ease: "power3.inOut"
                });
            });
        });

        tl.to(translatableElements, {
            filter: "blur(0px)",
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.02,
            ease: "expo.out",
            clearProps: "filter, transform, opacity"
        }, "+=0.1");
    });
}

// --- 3. MENU MOBILNE ---
const mobileBtn = document.querySelector('.mobile-menu-btn');
const mobileOverlay = document.querySelector('.mobile-menu-overlay');
const mobileLinks = document.querySelectorAll('.mobile-link');
let isMenuOpen = false;

if (mobileBtn) {
    mobileBtn.addEventListener('click', toggleMenu);
}

mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        toggleMenu();

        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            setTimeout(() => {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: {
                        y: targetId,
                        offsetY: 50
                    },
                    ease: "power4.inOut"
                });
            }, 300);
        }
    });
});

function toggleMenu() {
    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
        mobileBtn.classList.add('open');
        mobileOverlay.classList.add('active');

        gsap.to(mobileLinks, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.2,
            ease: "power3.out"
        });
    } else {
        mobileBtn.classList.remove('open');
        mobileOverlay.classList.remove('active');

        gsap.to(mobileLinks, {
            y: 20,
            opacity: 0,
            duration: 0.3
        });
    }
}

// --- 4. Scroll Reveals ---
const revealElements = document.querySelectorAll(".scroll-reveal");
revealElements.forEach(el => {
    gsap.fromTo(el, {
        y: 50,
        opacity: 0,
        filter: "blur(10px)",
        scale: 0.95
    }, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: el,
            start: "top 90%",
            end: "bottom 10%",
            toggleActions: "play reverse play reverse"
        }
    });
});

// --- 5. Desktop Navigation Scroll ---
document.querySelectorAll('.desktop-nav a, .cta-btn').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            gsap.to(window, {
                duration: 1.5,
                scrollTo: {
                    y: targetId,
                    offsetY: 50
                },
                ease: "power4.inOut"
            });
        }
    });
});

// --- 6. CYBER CURSOR (Instant Movement) ---
const customCursor = document.querySelector('.custom-cursor');

const setCursorX = gsap.quickSetter(customCursor, "x", "px");
const setCursorY = gsap.quickSetter(customCursor, "y", "px");

window.addEventListener('mousemove', (e) => {
    setCursorX(e.clientX);
    setCursorY(e.clientY);
});

const interactiveElements = document.querySelectorAll('a, button, .cta-btn, .switch, .skill-tag, .mobile-menu-btn, .hover-magnet');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        customCursor.classList.add('hover-active');
    });
    el.addEventListener('mouseleave', () => {
        customCursor.classList.remove('hover-active');
    });
});

document.querySelectorAll('.hover-magnet').forEach(magnet => {
    magnet.addEventListener('mousemove', (e) => {
        const rect = magnet.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(magnet, {
            x: x * 0.1,
            y: y * 0.1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    magnet.addEventListener('mouseleave', () => {
        gsap.to(magnet, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

// --- 7. Parallax ---
const shapes = document.querySelectorAll('.geo-shape');
let targetMouseX = 0, targetMouseY = 0;
let currentMouseX = 0, currentMouseY = 0;

window.addEventListener('mousemove', (e) => {
    targetMouseX = (window.innerWidth - e.pageX * 2) / 100;
    targetMouseY = (window.innerHeight - e.pageY * 2) / 100;
});

gsap.ticker.add(() => {
    currentMouseX += (targetMouseX - currentMouseX) * 0.05;
    currentMouseY += (targetMouseY - currentMouseY) * 0.05;
    const scrollY = window.scrollY;

    shapes.forEach(shape => {
        const speed = parseFloat(shape.getAttribute('data-speed'));
        const xPos = currentMouseX * speed * 50;
        const yPos = (currentMouseY * speed * 50) - (scrollY * speed * 20);

        gsap.set(shape, {
            x: xPos,
            y: yPos,
            rotate: 35 + (currentMouseX * 0.05) + (scrollY * 0.005),
            force3D: true
        });
    });
});
// --- 8. CONTACT HUB LOGIC ---

function setupCopyTile(tileId, valueId) {
    const tile = document.getElementById(tileId);
    const valueText = document.getElementById(valueId);
    
    if (tile && valueText) {
        tile.addEventListener('click', () => {
            const textToCopy = valueText.innerText;
            
            
            navigator.clipboard.writeText(textToCopy).then(() => {
               
                const tooltip = tile.querySelector('.copy-tooltip');
                
                
                tooltip.classList.add('show');
                
                
                gsap.fromTo(tile, 
                    { backgroundColor: "rgba(176, 251, 93, 0.2)" }, 
                    { backgroundColor: "rgba(255, 255, 255, 0.03)", duration: 0.5 }
                );

                
                setTimeout(() => {
                    tooltip.classList.remove('show');
                }, 2000);
            });
        });
    }
}

setupCopyTile('tile-email', 'val-email');
setupCopyTile('tile-phone', 'val-phone');