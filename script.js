// DOM Elements
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
const navMenu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('.hamburger');
const skillBars = document.querySelectorAll('.skill-level');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contact-form');
const projectModal = document.getElementById('project-modal');
const closeModal = document.querySelector('.close-modal');
const backToTop = document.querySelector('.back-to-top');
const toggleButtons = document.querySelectorAll('.toggle-btn');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Particle System
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = Math.random() > 0.5 ? '#00f3ff' : '#ff00ff';
        this.alpha = Math.random() * 0.5 + 0.2;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

let particles = [];
function initParticles() {
    particles = [];
    const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 10000));
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Connect particles with lines
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = particles[i].color;
                ctx.globalAlpha = 0.1 * (1 - distance / 100);
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }
    
    requestAnimationFrame(animateParticles);
}

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Animate Skill Bars on Scroll
function animateSkillBars() {
    skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        bar.style.width = level + '%';
    });
}

// Intersection Observer for skill bars
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

observer.observe(document.querySelector('.skills'));

// Project Filtering
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category');
            
            if (filter === 'all' || categories.includes(filter)) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
})

// Toggle Buttons (About Me section)
toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        content.classList.toggle('active');
        button.textContent = content.classList.contains('active') ? 'Show Less' : 'Show More';
    });
});

// Form Validation
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const feedback = document.getElementById('form-feedback');
    
    let isValid = true;
    
    // Reset errors
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';
    feedback.style.display = 'none';
    
    // Name validation
    if (!name.value.trim()) {
        nameError.textContent = 'Name is required';
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        emailError.textContent = 'Email is required';
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        emailError.textContent = 'Please enter a valid email';
        isValid = false;
    }
    
    // Message validation
    if (!message.value.trim()) {
        messageError.textContent = 'Message is required';
        isValid = false;
    } else if (message.value.trim().length < 10) {
        messageError.textContent = 'Message must be at least 10 characters';
        isValid = false;
    }
    
    if (isValid) {
        // Simulate form submission
        feedback.textContent = 'Message sent successfully! I\'ll get back to you soon.';
        feedback.className = 'form-feedback success';
        feedback.style.display = 'block';
        
        // Reset form
        contactForm.reset();
        
        // Hide feedback after 5 seconds
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 5000);
    } else {
        feedback.textContent = 'Please fix the errors above';
        feedback.className = 'form-feedback error';
        feedback.style.display = 'block';
    }
});

// Project Data with detailed features
const projectData = {
    'study-planner': {
        title: 'Smart Study Planner',
        description: 'An AI-powered web application that generates personalized study schedules using Prolog reasoning, Flask backend, and MySQL database.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Prolog', 'Flask', 'MySQL', 'Bootstrap'],
        features: [
            'AI-based schedule generation using Prolog rules',
            'Personalized study plans based on subjects and time available',
            'Interactive calendar view',
            'Progress tracking system',
            'Reminder notifications',
            'Responsive design for all devices'
        ],
        challenges: 'Integrating Prolog reasoning engine with web interface, optimizing database queries for performance.'
    },
    'portfolio': {
        title: 'Personal Portfolio Website',
        description: 'A responsive portfolio website showcasing my projects and skills with interactive elements.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Canvas API'],
        features: [
            'Interactive particle background with Canvas API',
            'Responsive design for mobile, tablet, and desktop',
            'Animated skill progress bars',
            'Project filtering system',
            'Form validation with real-time feedback',
            'Smooth scrolling navigation',
            'Dark theme with neon accents'
        ],
        challenges: 'Creating performant particle system, ensuring cross-browser compatibility, implementing smooth animations.'
    },
    'weather': {
        title: 'Real-Time Weather App',
        description: 'A weather application that fetches real-time data from API and displays forecasts.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Weather API', 'JSON'],
        features: [
            'Real-time weather data from API',
            '5-day weather forecast',
            'Location-based weather detection',
            'Temperature unit conversion (C/F)',
            'Animated weather icons',
            'Search functionality for cities',
            'Responsive mobile-friendly design'
        ],
        challenges: 'Handling API rate limits, displaying data in user-friendly format, error handling for invalid locations.'
    }
};

// Enhanced Project Modal with detailed features
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const projectId = this.getAttribute('data-project');
        const project = projectData[projectId];
        
        if (!project) return;
        
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
            <h3>${project.title}</h3>
            <p class="modal-description">${project.description}</p>
            <br>
            
            <div class="modal-section">
                <h4><i class="fas fa-code"></i> Technologies Used</h4>
                <div class="project-tags">${project.technologies.map(tech => `<span>${tech}</span>`).join('')}</div>
            </div>
            <br>
            
            <div class="modal-section">
                <h4><i class="fas fa-star"></i> Key Features</h4>
                <ul class="features-list">
                    ${project.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                </ul>
            </div>
            <br>
            
            <div class="modal-section">
                <h4><i class="fas fa-tasks"></i> Challenges & Solutions</h4>
                <p>${project.challenges}</p>
            </div>
            <br>
            
            <div class="modal-section">
                <h4><i class="fas fa-cogs"></i> Technical Implementation</h4>
                <ul>
                    <li>Frontend: ${project.technologies.filter(t => ['HTML', 'CSS', 'JavaScript'].includes(t)).join(', ')}</li>
                    <li>Backend: ${project.technologies.filter(t => !['HTML', 'CSS', 'JavaScript'].includes(t)).join(', ')}</li>
                </ul>
            </div>
        `;
        
        projectModal.style.display = 'flex';
    });
});

// Close Modal
closeModal.addEventListener('click', () => {
    projectModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === projectModal) {
        projectModal.style.display = 'none';
    }
});

// Back to Top
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.style.opacity = '1';
        backToTop.style.visibility = 'visible';
    } else {
        backToTop.style.opacity = '0';
        backToTop.style.visibility = 'hidden';
    }
});

// Initialize
window.addEventListener('load', () => {
    initParticles();
    animateParticles();
    
    // Set initial skill bar width to 0
    skillBars.forEach(bar => {
        bar.style.width = '0%';
    });
});