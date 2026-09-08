// ============================================
// PORTFOLIO V8 - JAVASCRIPT
// Esthétique: Glassmorphism Rétro-Futuriste
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    loading: {
        duration: 3000,
        updateInterval: 30
    },
    animations: {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
};

// État global
const STATE = {
    isLoading: true,
    projectsOverlayOpen: false,
    currentOpenProject: null
};

// ============================================
// CLASSE PRINCIPALE
// ============================================
class Portfolio {
    constructor() {
        this.initElements();
        this.initLoading();
        this.initEventListeners();
    }

    // Initialiser les références aux éléments DOM
    initElements() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingBar = document.querySelector('.loading-bar');
        this.loadingPercentage = document.querySelector('.loading-percentage');
        this.loadingStatus = document.querySelector('.loading-status');
        this.mainApp = document.getElementById('main-app');
        
        // Projets overlay
        this.projectsOverlay = document.getElementById('projects-overlay');
        this.projectsTriggers = [
            document.getElementById('projects-trigger'),
            document.getElementById('u5-card-trigger')
        ];
        this.closeProjectsBtn = document.getElementById('close-projects');
        this.projectItems = document.querySelectorAll('.project-item');
        this.projectToggles = document.querySelectorAll('.project-toggle');
    }

    // Initialiser la séquence de chargement
    initLoading() {
        let progress = 0;
        const statusMessages = [
            'Chargement des modules...',
            'Initialisation du système...',
            'Configuration de l\'interface...',
            'Connexion établie...',
            'Prêt!'
        ];
        let currentStatusIndex = 0;

        const loadingInterval = setInterval(() => {
            // Incrémenter le progress
            progress += Math.random() * 8 + 2;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                
                // Finaliser le chargement
                setTimeout(() => this.completeLoading(), 300);
            }

            // Mettre à jour l'affichage
            this.updateLoadingDisplay(progress);

            // Changer le message de statut
            if (progress > (currentStatusIndex + 1) * 20 && currentStatusIndex < statusMessages.length - 1) {
                currentStatusIndex++;
                this.loadingStatus.textContent = statusMessages[currentStatusIndex];
            }

        }, CONFIG.loading.updateInterval);
    }

    // Mettre à jour l'affichage du chargement
    updateLoadingDisplay(progress) {
        const roundedProgress = Math.floor(progress);
        this.loadingBar.style.width = `${roundedProgress}%`;
        this.loadingPercentage.textContent = `${roundedProgress}%`;
    }

    // Compléter la séquence de chargement
    completeLoading() {
        STATE.isLoading = false;
        
        // Animer la disparition du loader
        this.loadingScreen.style.opacity = '0';
        this.loadingScreen.style.transform = 'scale(1.1)';

        setTimeout(() => {
            this.loadingScreen.classList.remove('active');
            this.mainApp.classList.add('visible');
            
            // Initialiser les animations d'entrée
            this.initScrollAnimations();
        }, 500);
    }

    // Initialiser les événements
    initEventListeners() {
        // Ouvrir l'overlay projets
        this.projectsTriggers.forEach(trigger => {
            if (trigger) {
                trigger.addEventListener('click', () => this.openProjectsOverlay());
            }
        });

        // Fermer l'overlay projets
        if (this.closeProjectsBtn) {
            this.closeProjectsBtn.addEventListener('click', () => this.closeProjectsOverlay());
        }

        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && STATE.projectsOverlayOpen) {
                this.closeProjectsOverlay();
            }
        });

        // Fermer en cliquant sur l'arrière-plan
        this.projectsOverlay.addEventListener('click', (e) => {
            if (e.target === this.projectsOverlay || e.target.classList.contains('overlay-background')) {
                this.closeProjectsOverlay();
            }
        });

        // Accordéons des projets
        this.projectToggles.forEach((toggle, index) => {
            toggle.addEventListener('click', () => this.toggleProject(index));
        });

        // Effets de parallaxe au scroll
        window.addEventListener('scroll', () => this.handleScroll());

        // Curseur personnalisé (optionnel)
        this.initCustomCursor();
    }

    // Ouvrir l'overlay des projets
    openProjectsOverlay() {
        STATE.projectsOverlayOpen = true;
        this.projectsOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animation d'entrée des projets
        this.projectItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Fermer l'overlay des projets
    closeProjectsOverlay() {
        STATE.projectsOverlayOpen = false;
        this.projectsOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';

        // Fermer tous les projets ouverts
        this.projectItems.forEach(item => {
            item.classList.remove('open');
        });
        STATE.currentOpenProject = null;
    }

    // Toggle d'un projet (accordéon)
    toggleProject(index) {
        const clickedItem = this.projectItems[index];
        const isCurrentlyOpen = clickedItem.classList.contains('open');

        // Fermer tous les projets
        this.projectItems.forEach(item => {
            item.classList.remove('open');
        });

        // Ouvrir le projet cliqué s'il était fermé
        if (!isCurrentlyOpen) {
            clickedItem.classList.add('open');
            STATE.currentOpenProject = index;
        } else {
            STATE.currentOpenProject = null;
        }
    }

    // Initialiser les animations au scroll
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observer les cartes
        document.querySelectorAll('.glass-card').forEach(card => {
            observer.observe(card);
        });
    }

    // Gérer le scroll
    handleScroll() {
        const scrollY = window.scrollY;
        
        // Effet de parallaxe sur le header
        const header = document.querySelector('.floating-header');
        if (header && scrollY > 50) {
            header.style.transform = `translateX(-50%) translateY(${Math.min(scrollY * 0.5, 20)}px)`;
        } else if (header) {
            header.style.transform = 'translateX(-50%) translateY(0)';
        }
    }

    // Initialiser un curseur personnalisé
    initCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, var(--color-cyan), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            mix-blend-mode: screen;
            transition: transform 0.15s ease;
        `;
        document.body.appendChild(cursor);

        const cursorTrail = document.createElement('div');
        cursorTrail.className = 'cursor-trail';
        cursorTrail.style.cssText = `
            position: fixed;
            width: 30px;
            height: 30px;
            border: 2px solid var(--color-cyan);
            border-radius: 50%;
            pointer-events: none;
            z-index: 99998;
            transition: all 0.2s ease;
            opacity: 0.5;
        `;
        document.body.appendChild(cursorTrail);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let trailX = 0, trailY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Animation fluide du curseur
        const animateCursor = () => {
            // Curseur principal (rapide)
            cursorX += (mouseX - cursorX) * 0.3;
            cursorY += (mouseY - cursorY) * 0.3;
            cursor.style.left = cursorX - 5 + 'px';
            cursor.style.top = cursorY - 5 + 'px';

            // Trail (lent)
            trailX += (mouseX - trailX) * 0.1;
            trailY += (mouseY - trailY) * 0.1;
            cursorTrail.style.left = trailX - 15 + 'px';
            cursorTrail.style.top = trailY - 15 + 'px';

            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Effets hover
        const interactiveElements = document.querySelectorAll('a, button, .glass-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursorTrail.style.transform = 'scale(1.5)';
                cursorTrail.style.borderColor = 'var(--color-magenta)';
            });

            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorTrail.style.transform = 'scale(1)';
                cursorTrail.style.borderColor = 'var(--color-cyan)';
            });
        });
    }
}

// ============================================
// EFFETS VISUELS SUPPLÉMENTAIRES
// ============================================
class VisualEffects {
    constructor() {
        this.initParticles();
        this.initGlitchEffect();
    }

    // Système de particules simple
    initParticles() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.3;
        `;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 50;

        // Créer les particules
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                color: Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.5)' : 'rgba(255, 0, 255, 0.5)'
            });
        }

        // Animer les particules
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Rebond sur les bords
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Dessiner la particule
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };
        animate();

        // Redimensionner le canvas
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Effet glitch aléatoire sur le titre
    initGlitchEffect() {
        const glitchElements = document.querySelectorAll('.gradient-text');
        
        setInterval(() => {
            glitchElements.forEach(el => {
                // Appliquer un glitch subtil aléatoirement
                if (Math.random() > 0.95) {
                    el.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                    el.style.textShadow = `
                        ${Math.random() * 5}px 0 var(--color-cyan),
                        ${Math.random() * -5}px 0 var(--color-magenta)
                    `;
                    
                    setTimeout(() => {
                        el.style.transform = 'translate(0, 0)';
                        el.style.textShadow = 'none';
                    }, 50);
                }
            });
        }, 100);
    }
}

// ============================================
// UTILITAIRES
// ============================================
const Utils = {
    // Interpolation linéaire
    lerp: (start, end, factor) => {
        return start + (end - start) * factor;
    },

    // Mapper une valeur d'une plage à une autre
    map: (value, inMin, inMax, outMin, outMax) => {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    },

    // Clamp une valeur
    clamp: (value, min, max) => {
        return Math.min(Math.max(value, min), max);
    },

    // Délai asynchrone
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    // Animation fluide
    animate: (from, to, duration, callback) => {
        const start = performance.now();
        
        const step = (timestamp) => {
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            
            callback(from + (to - from) * eased);
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        
        requestAnimationFrame(step);
    }
};

// ============================================
// INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le portfolio
    const portfolio = new Portfolio();
    
    // Initialiser les effets visuels
    const visualEffects = new VisualEffects();
    
    // Log de démarrage
    console.log('%c🚀 Portfolio V8 Initialized ', 'background: linear-gradient(135deg, #00f0ff, #ff00ff); color: #000; font-size: 16px; font-weight: bold; padding: 10px 20px; border-radius: 4px;');
    console.log('%c✨ Glassmorphism Rétro-Futuriste ', 'background: rgba(0, 240, 255, 0.2); color: #00f0ff; font-size: 12px; padding: 5px 10px; border: 1px solid #00f0ff;');
});

// Exposer les utilitaires globalement
window.PortfolioUtils = Utils;
window.PortfolioState = STATE;
