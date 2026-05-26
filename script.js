// === Loader ===
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => loader.classList.add('hidden'), 300);
});

// === Custom Cursor (desktop only) ===
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => follower.classList.add('click'));
    document.addEventListener('mouseup', () => follower.classList.remove('click'));

    document.querySelectorAll('a, button, .btn, .project-card, .menu-btn, .close-btn, .social-icon, .contact-social-link').forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('hover'));
        el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });

    document.addEventListener('mousemove', (e) => {
        const bg = document.querySelector('.floating-shapes');
        if (!bg) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        bg.style.transform = `translate(${x}px, ${y}px)`;
    });
}

// === Marquee contact/skills cards on mobile ===
if (isTouchDevice) {
    const contactTrack = document.getElementById('contactTrack');
    if (contactTrack) {
        contactTrack.innerHTML += contactTrack.innerHTML;
    }
    const skillsContainer = document.getElementById('skillsContainer');
    if (skillsContainer) {
        skillsContainer.classList.add('marquee');
        skillsContainer.innerHTML += skillsContainer.innerHTML;
    }
}

// === Parallax on mobile via gyroscope / touch ===
if (isTouchDevice) {
    let sourceX = 0, sourceY = 0;
    let smoothX = 0, smoothY = 0;

    function initOrientation() {
        window.addEventListener('deviceorientation', (e) => {
            sourceX = ((e.gamma || 0) / 45) * 30;
            sourceY = ((e.beta || 0) / 45) * 20;
        }, { passive: true });
    }

    if (window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) {
        document.addEventListener('click', () => {
            DeviceOrientationEvent.requestPermission().then(state => {
                if (state === 'granted') initOrientation();
            });
        }, { once: true });
    } else if (window.DeviceOrientationEvent) {
        initOrientation();
    }

    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        if (!touch) return;
        sourceX = (touch.clientX / window.innerWidth - 0.5) * 40;
        sourceY = (touch.clientY / window.innerHeight - 0.5) * 25;
    }, { passive: true });

    document.addEventListener('touchend', () => {
        sourceX = 0;
        sourceY = 0;
    }, { passive: true });

    (function loop() {
        const bg = document.querySelector('.floating-shapes');
        if (bg) {
            smoothX += (sourceX - smoothX) * 0.04;
            smoothY += (sourceY - smoothY) * 0.04;
            bg.style.transform = `translate(${smoothX}px, ${smoothY}px)`;
        }
        requestAnimationFrame(loop);
    })();
}

// === 3D Tilt on Project Cards (desktop only) ===
if (!isTouchDevice) {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// === Menu ===
// === About Tabs ===
document.querySelectorAll('.about-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.about-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.about-tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
});

// === Scroll Animations ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .skill-item, .service-card').forEach(el => {
    observer.observe(el);
});

// === Animated Counters ===
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const step = Math.max(1, Math.floor(target / 30));
        let current = 0;
        counter.textContent = '0';

        function tick() {
            current += step;
            if (current >= target) {
                counter.textContent = target + '+';
                return;
            }
            counter.textContent = current;
            setTimeout(tick, 90);
        }
        tick();
    });
}

const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
        }
    });
}, { threshold: 0.3 });

const aboutSection = document.querySelector('#about');
if (aboutSection) aboutObserver.observe(aboutSection);

// === Skill Bars ===
function animateSkillBars() {
    document.querySelectorAll('.skill-progress').forEach(bar => {
        const width = bar.dataset.width;
        bar.style.width = width + '%';
    });
}

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const skillsSection = document.querySelector('#skills');
if (skillsSection) skillsObserver.observe(skillsSection);

// === Background Transition on Scroll ===
const bgColors = [
    { r: 10, g: 10, b: 10 },
    { r: 12, g: 10, b: 18 },
    { r: 14, g: 10, b: 26 },
    { r: 16, g: 10, b: 32 },
    { r: 18, g: 10, b: 35 },
    { r: 18, g: 10, b: 35 },
    { r: 18, g: 10, b: 35 },
    { r: 18, g: 10, b: 35 },
];

const sections = document.querySelectorAll('section');
const body = document.body;

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function updateBg() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    let totalHeight = 0;

    sections.forEach(section => {
        totalHeight += section.offsetHeight;
    });

    const scrollPercent = Math.min(scrollY / (totalHeight - windowHeight), 0.999);
    const colorIndex = scrollPercent * (bgColors.length - 1);
    const currentIndex = Math.floor(colorIndex);
    const nextIndex = Math.min(currentIndex + 1, bgColors.length - 1);
    const t = easeInOut(colorIndex - currentIndex);

    const r = Math.round(lerp(bgColors[currentIndex].r, bgColors[nextIndex].r, t));
    const g = Math.round(lerp(bgColors[currentIndex].g, bgColors[nextIndex].g, t));
    const b = Math.round(lerp(bgColors[currentIndex].b, bgColors[nextIndex].b, t));

    body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

window.addEventListener('scroll', updateBg);
updateBg();
let lastScroll = 0;
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// === Gallery ===
const galleryData = [
    { title: 'DrivePMR', images: ['img/screen-3.png', 'img/screen-4.png', 'img/screen-5.png', 'img/screen-6.png', 'img/screen-7.png'] },
    { title: 'Погода', images: ['img/screen-2.png', 'img/screen-10.png', 'img/screen-11.png'] },
    { title: 'HolyDays', images: ['img/screen-8.png', 'img/screen-9.png', 'img/screen-12.png'] },
];

const modal = document.getElementById('galleryModal');
const modalImage = document.getElementById('galleryImage');
const modalCounter = document.getElementById('galleryCounter');
const closeBtnGallery = document.getElementById('galleryClose');
const prevBtn = document.getElementById('galleryPrev');
const nextBtn = document.getElementById('galleryNext');

let currentProject = 0;
let currentIndex = 0;

function openGallery(projectIndex) {
    currentProject = projectIndex;
    currentIndex = 0;
    showImage();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeGallery() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function showImage() {
    const project = galleryData[currentProject];
    const img = project.images[currentIndex];
    modalImage.src = img;
    modalImage.alt = project.title;
    modalCounter.textContent = `${currentIndex + 1} / ${project.images.length} — ${project.title}`;
}

function prevImage() {
    const project = galleryData[currentProject];
    currentIndex = currentIndex === 0 ? project.images.length - 1 : currentIndex - 1;
    showImage();
}

function nextImage() {
    const project = galleryData[currentProject];
    currentIndex = currentIndex === project.images.length - 1 ? 0 : currentIndex + 1;
    showImage();
}

document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const projectIndex = parseInt(link.dataset.project);
        openGallery(projectIndex);
    });
});

closeBtnGallery.addEventListener('click', closeGallery);
prevBtn.addEventListener('click', prevImage);
nextBtn.addEventListener('click', nextImage);

modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('gallery-backdrop')) {
        closeGallery();
    }
});

document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
});

// === Dynamic Year in Footer ===
document.querySelector('footer p').innerHTML =
    `&copy; ${new Date().getFullYear()} Portfolio. Все права защищены`;
