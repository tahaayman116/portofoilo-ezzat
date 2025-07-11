document.addEventListener('DOMContentLoaded', () => {
    // --- CORE UI & ANIMATION SETUP ---
    const cursor = document.querySelector('.cursor');
    const hamburger = document.querySelector('.hamburger');

    document.addEventListener('mousemove', e => {
        if (cursor) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
    });

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = parseInt(element.dataset.delay) || 0;
                setTimeout(() => element.classList.add('is-visible'), delay);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.1 });

    function animate(selector, stagger = 0) {
        document.querySelectorAll(selector).forEach((elem, i) => {
            elem.dataset.delay = i * stagger;
            observer.observe(elem);
        });
    }

    function setupMagneticEffect() {
        document.querySelectorAll('.magnetic-item').forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                item.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
                if (cursor) cursor.style.transform = `scale(1.5)`;
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translate(0,0)';
                if (cursor) cursor.style.transform = `scale(1)`;
            });
        });
    }

    // --- DYNAMIC CONTENT LOADING ---
    async function fetchJson(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Failed to fetch ${url}: ${response.statusText}`);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            return null;
        }
    }

    async function loadContent() {
        const [mainData, experienceData, certificationsData, skillsData] = await Promise.all([
            fetchJson('/_data/main.json'),
            fetchJson('/_data/experience.json'),
            fetchJson('/_data/certifications.json'),
            fetchJson('/_data/skills.json')
        ]);

        if (!mainData) {
            document.body.innerHTML = '<h1 style="color: white; text-align: center; padding-top: 50px;">Error: Could not load main site content.</h1>';
            return;
        }

        // 1. Populate Main Settings
        document.title = mainData.title || 'Portfolio';
        document.querySelector('.logo').textContent = mainData.logo_name;
        document.getElementById('hero-name').textContent = mainData.hero_name;
        document.getElementById('hero-title').textContent = mainData.hero_title;
        document.getElementById('hero-description').textContent = mainData.hero_description;
        document.querySelector('.cta-button.secondary').href = mainData.cv_filename;
        document.getElementById('about-me').textContent = mainData.about_me;
        document.getElementById('education-degree').textContent = mainData.education_degree;
        document.getElementById('education-description').textContent = mainData.education_description;
        document.getElementById('certifications-title').textContent = mainData.certifications_title;
        document.querySelector('a[href^="mailto:"]').href = `mailto:${mainData.contact_email}`;
        document.querySelector('a[href^="tel:"]').href = `tel:${mainData.contact_phone}`;
        document.querySelector('a[href*="linkedin"]').href = mainData.linkedin_url;

        // 2. Populate Experience
        if (experienceData) {
            const expList = document.getElementById('experience-list');
            expList.innerHTML = '';
            experienceData.forEach(job => {
                const jobDiv = document.createElement('div');
                jobDiv.className = 'job';
                jobDiv.innerHTML = `
                    <h3>${job.title}</h3>
                     <p class="company">${job.company}</p>
                    <p class="date">${job.date}</p>
                    <ul>
                        ${(job.responsibilities || []).map(item => `<li>${item}</li>`).join('')}
                    </ul>
                `;
                expList.appendChild(jobDiv);
            });
        }

        // 3. Populate Certifications
        if (certificationsData) {
            const certList = document.getElementById('certifications-list');
            certList.innerHTML = '';
            certificationsData.forEach(cert => {
                const certItem = document.createElement('li');
                certItem.innerHTML = `${cert.name} <span>(${cert.issuer})</span>`;
                certList.appendChild(certItem);
            });
        }

        // 4. Populate Skills
        if (skillsData) {
            const skillsGrid = document.getElementById('skills-grid');
            skillsGrid.innerHTML = '';
            skillsData.forEach(skill => {
                const skillDiv = document.createElement('div');
                skillDiv.className = 'skill-item magnetic-item';
                skillDiv.textContent = skill.name;
                skillsGrid.appendChild(skillDiv);
            });
        }

        // 5. Trigger all animations and effects AFTER content is loaded
        animate('section h2');
        animate('.job', 100);
        animate('#certifications-list li', 100);
        animate('.skill-item', 50);
        setupMagneticEffect();
    }

    loadContent();
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
