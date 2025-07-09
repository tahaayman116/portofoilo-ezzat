// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Advanced Scroll-triggered Animations
const animatedElements = document.querySelectorAll('section h2, .job ul li, .certifications ul li, .skill-item');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const delay = element.dataset.delay || 0;
            
            setTimeout(() => {
                element.classList.add('is-visible');
            }, delay);

            observer.unobserve(element); // Animate only once
        }
    });
}, { threshold: 0.1 });

// Stagger animations for lists and grids
function staggerAnimation(selector, delay) {
    document.querySelectorAll(selector).forEach((element, index) => {
        element.dataset.delay = index * delay;
        observer.observe(element);
    });
}

document.querySelectorAll('section h2').forEach(h2 => observer.observe(h2));
staggerAnimation('.job ul li', 100);
staggerAnimation('.certifications ul li', 100);
staggerAnimation('.skill-item', 100);

// Super-Modern Magnetic Cursor Logic
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');
    const magneticItems = document.querySelectorAll('.magnetic-item');

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    magneticItems.forEach(item => {
        let isHovering = false;
        const strength = 0.5; // How strong the pull is

        item.addEventListener('mouseenter', () => {
            isHovering = true;
            cursor.classList.add('hover');
        });

        item.addEventListener('mouseleave', () => {
            isHovering = false;
            cursor.classList.remove('hover');
            item.style.transform = 'translate(0, 0)';
        });

        const animate = () => {
            if (isHovering) {
                const rect = item.getBoundingClientRect();
                const itemCenterX = rect.left + rect.width / 2;
                const itemCenterY = rect.top + rect.height / 2;

                const deltaX = (mouseX - itemCenterX) * strength;
                const deltaY = (mouseY - itemCenterY) * strength;

                item.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            }
            requestAnimationFrame(animate);
        };
        animate();
    });
});

// Add keyframes for the animation
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;
document.head.appendChild(style);

// Parallax effect for hero content
const hero = document.querySelector('#hero');
const heroContent = document.querySelector('.hero-content');

hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { offsetWidth, offsetHeight } = hero;

    const xPos = (clientX / offsetWidth - 0.5) * 30; // Multiplier controls intensity
    const yPos = (clientY / offsetHeight - 0.5) * 30;

    heroContent.style.transform = `perspective(1000px) rotateY(${xPos / 2}deg) rotateX(${-yPos / 2}deg)`;
});
