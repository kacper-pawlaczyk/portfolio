
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// --- 1. Loader ---
let progress = 0;
const loaderText = document.querySelector('.loader-text');
const loader = document.querySelector('.loader');

const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 10) + 5;
    if (progress > 100) progress = 100;
    loaderText.innerText = `${progress}%`;
    
    if (progress === 100) {
        clearInterval(interval);
        gsap.to(loader, { y: "-100%", duration: 1, ease: "power4.inOut", delay: 0.5 });
        startSiteAnimations();
    }
}, 50);

function startSiteAnimations() {
    gsap.from(".anim-text", {
        y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out", delay: 1
    });
}

// --- 2. Tłumaczenie (Zero Config) ---
const langToggle = document.getElementById('lang-toggle');
const labelPl = document.getElementById('label-pl');
const labelEn = document.getElementById('label-en');
const translatableElements = document.querySelectorAll('[data-en]');

translatableElements.forEach(el => {
    el.setAttribute('data-pl', el.innerHTML); 
});

if (langToggle) {
    langToggle.addEventListener('change', () => {
        const lang = langToggle.checked ? 'en' : 'pl';
        
        if (lang === 'en') {
            labelEn.classList.add('active');
            labelPl.classList.remove('active');
        } else {
            labelPl.classList.add('active');
            labelEn.classList.remove('active');
        }

        gsap.to(translatableElements, {
            opacity: 0, y: -10, duration: 0.3,
            onComplete: () => {
                translatableElements.forEach(el => {
                    const newText = el.getAttribute(`data-${lang}`);
                    if (newText) el.innerHTML = newText;
                });
                gsap.to(translatableElements, { opacity: 1, y: 0, duration: 0.5, stagger: 0.02 });
            }
        });
    });
}

// --- 3. Scroll Reveals ---
const revealElements = document.querySelectorAll(".scroll-reveal");
revealElements.forEach(el => {
    gsap.fromTo(el, 
        { y: 50, opacity: 0, filter: "blur(10px)", scale: 0.95 }, 
        {
            y: 0, opacity: 1, filter: "blur(0px)", scale: 1, duration: 0.8, ease: "power2.out",
            scrollTrigger: {
                trigger: el, start: "top 90%", end: "bottom 10%", toggleActions: "play reverse play reverse"
            }
        }
    );
});

// --- 4. Smooth Navigation ---
document.querySelectorAll('nav a, .cta-btn').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if(targetId.startsWith('#')) {
            e.preventDefault();
            gsap.to(window, { duration: 1.5, scrollTo: { y: targetId, offsetY: 50 }, ease: "power4.inOut" });
        }
    });
});

// --- 5. Cursor & Magnets ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
});

document.querySelectorAll('.hover-magnet').forEach(magnet => {
    magnet.addEventListener('mousemove', (e) => {
        const rect = magnet.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(magnet, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
        gsap.to(cursorOutline, { scale: 1.5, duration: 0.2 });
    });
    magnet.addEventListener('mouseleave', () => {
        gsap.to(magnet, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        gsap.to(cursorOutline, { scale: 1, duration: 0.2 });
    });
});

// --- 6. Parallax (Ultra Smooth + Scroll Integration) ---
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
            x: xPos, y: yPos,
            rotate: 35 + (currentMouseX * 0.05) + (scrollY * 0.005),
            force3D: true
        });
    });
});