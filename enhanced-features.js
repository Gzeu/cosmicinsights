// 🌟 Cosmic Insights - Enhanced Interactive Features

class CosmicEnhancements {
    constructor() {
        this.particleCount = 50;
        this.particles = [];
        this.currentTheme = 'cosmic';
        this.init();
    }

    init() {
        this.createParticleSystem();
        this.setupThemeSelector();
        this.setupScrollAnimations();
        this.setupTouchGestures();
        this.setup3DCardEffects();
        this.setupSoundEffects();
        this.setupVoiceInput();
        this.setupProgressiveWebApp();
    }

    // ✨ Particle System
    createParticleSystem() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const container = document.createElement('div');
        container.className = 'particles-container';
        document.body.appendChild(container);

        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positioning and animation delay
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            
            // Color variation
            const colors = [
                'radial-gradient(circle, #667eea, #764ba2)',
                'radial-gradient(circle, #4facfe, #00f2fe)',
                'radial-gradient(circle, #a8edea, #fed6e3)',
                'radial-gradient(circle, #ff9a9e, #fecfef)'
            ];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    // 🎨 Theme System
    setupThemeSelector() {
        const themeSelector = document.createElement('div');
        themeSelector.className = 'theme-selector';
        themeSelector.innerHTML = `
            <div class="theme-btn theme-cosmic active" data-theme="cosmic" title="Cosmic Theme"></div>
            <div class="theme-btn theme-mystical" data-theme="mystical" title="Mystical Theme"></div>
            <div class="theme-btn theme-aurora" data-theme="aurora" title="Aurora Theme"></div>
            <div class="theme-btn theme-primary" data-theme="primary" title="Primary Theme"></div>
            <div class="theme-btn theme-secondary" data-theme="secondary" title="Secondary Theme"></div>
        `;
        document.body.appendChild(themeSelector);

        themeSelector.addEventListener('click', (e) => {
            if (e.target.classList.contains('theme-btn')) {
                this.changeTheme(e.target.dataset.theme);
            }
        });
    }

    changeTheme(theme) {
        this.currentTheme = theme;
        document.body.className = `theme-${theme}`;
        
        // Update active button
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
        
        // Update particle colors based on theme
        this.updateParticleColors(theme);
        
        // Save preference
        localStorage.setItem('cosmic-theme', theme);
        
        // Play theme change sound
        this.playSound('theme-change');
    }

    updateParticleColors(theme) {
        const themeColors = {
            cosmic: ['radial-gradient(circle, #4facfe, #00f2fe)'],
            mystical: ['radial-gradient(circle, #a8edea, #fed6e3)'],
            aurora: ['radial-gradient(circle, #ff9a9e, #fecfef)'],
            primary: ['radial-gradient(circle, #667eea, #764ba2)'],
            secondary: ['radial-gradient(circle, #f093fb, #f5576c)']
        };
        
        this.particles.forEach(particle => {
            particle.style.background = themeColors[theme][0];
        });
    }

    // 📱 Touch Gestures
    setupTouchGestures() {
        if (!('ontouchstart' in window)) return;

        let startX, startY, currentX, currentY;
        let isSwipe = false;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwipe = true;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!isSwipe) return;
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', () => {
            if (!isSwipe || !startX || !currentX) return;
            
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Horizontal swipe detection
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.handleSwipeLeft();
                } else {
                    this.handleSwipeRight();
                }
            }
            
            // Vertical swipe detection
            if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
                if (diffY > 0) {
                    this.handleSwipeUp();
                } else {
                    this.handleSwipeDown();
                }
            }
            
            startX = startY = currentX = currentY = null;
            isSwipe = false;
        }, { passive: true });
    }

    handleSwipeLeft() {
        // Navigate to next section
        this.nextTheme();
    }

    handleSwipeRight() {
        // Navigate to previous section
        this.previousTheme();
    }

    handleSwipeUp() {
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    handleSwipeDown() {
        // Refresh particles
        this.refreshParticles();
    }

    nextTheme() {
        const themes = ['cosmic', 'mystical', 'aurora', 'primary', 'secondary'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.changeTheme(themes[nextIndex]);
    }

    previousTheme() {
        const themes = ['cosmic', 'mystical', 'aurora', 'primary', 'secondary'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const previousIndex = currentIndex === 0 ? themes.length - 1 : currentIndex - 1;
        this.changeTheme(themes[previousIndex]);
    }

    // 🎭 3D Card Effects
    setup3DCardEffects() {
        const cards = document.querySelectorAll('.card-3d, .glassmorphism');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // 🔊 Sound Effects
    setupSoundEffects() {
        this.sounds = {
            'click': this.createTone(800, 0.1),
            'hover': this.createTone(600, 0.05),
            'theme-change': this.createTone(1000, 0.2),
            'success': this.createTone(1200, 0.3)
        };

        // Add sound to interactive elements
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn-cosmic, .theme-btn')) {
                this.playSound('click');
            }
        });

        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('button, .btn-cosmic, .card-3d, .glassmorphism')) {
                this.playSound('hover');
            }
        });
    }

    createTone(frequency, duration) {
        return () => {
            if (!window.AudioContext && !window.webkitAudioContext) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    // 🎤 Voice Input
    setupVoiceInput() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        // Add voice button to forms
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            this.addVoiceButton(textarea);
        });
    }

    addVoiceButton(textarea) {
        const voiceBtn = document.createElement('button');
        voiceBtn.innerHTML = '🎤';
        voiceBtn.className = 'voice-btn';
        voiceBtn.style.cssText = `
            position: absolute;
            right: 10px;
            top: 10px;
            background: rgba(102, 126, 234, 0.8);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            font-size: 16px;
            z-index: 10;
        `;
        
        textarea.parentNode.style.position = 'relative';
        textarea.parentNode.appendChild(voiceBtn);
        
        voiceBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.startVoiceRecognition(textarea);
        });
    }

    startVoiceRecognition(textarea) {
        this.recognition.start();
        
        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            textarea.value += (textarea.value ? ' ' : '') + transcript;
            this.playSound('success');
        };
        
        this.recognition.onerror = (event) => {
            console.log('Speech recognition error:', event.error);
        };
    }

    // 📱 Progressive Web App
    setupProgressiveWebApp() {
        // Service worker registration
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
        }
        
        // Install prompt
        this.setupInstallPrompt();
        
        // Offline detection
        this.setupOfflineDetection();
    }

    registerServiceWorker() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    }

    setupInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button
            const installBtn = document.createElement('button');
            installBtn.innerHTML = '📲 Install App';
            installBtn.className = 'btn-cosmic install-btn';
            installBtn.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 20px;
                z-index: 1000;
                font-size: 14px;
                padding: 10px 15px;
            `;
            
            installBtn.addEventListener('click', () => {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(choice => {
                    if (choice.outcome === 'accepted') {
                        console.log('User accepted PWA install');
                        installBtn.remove();
                    }
                    deferredPrompt = null;
                });
            });
            
            document.body.appendChild(installBtn);
        });
    }

    setupOfflineDetection() {
        const updateOnlineStatus = () => {
            const status = navigator.onLine ? 'online' : 'offline';
            document.body.setAttribute('data-connection', status);
            
            if (!navigator.onLine) {
                this.showOfflineNotification();
            }
        };
        
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        updateOnlineStatus();
    }

    showOfflineNotification() {
        const notification = document.createElement('div');
        notification.innerHTML = '📶 You are offline. Some features may be limited.';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 152, 0, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            z-index: 1000;
            font-size: 14px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // 🔄 Utility Methods
    refreshParticles() {
        this.particles.forEach(particle => {
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.left = Math.random() * 100 + '%';
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('page-transition');
                }
            });
        }, observerOptions);

        // Observe elements with animation class
        document.querySelectorAll('.glassmorphism, .cosmic-grid-item').forEach(el => {
            observer.observe(el);
        });
    }

    // 🎯 Load saved preferences
    loadPreferences() {
        const savedTheme = localStorage.getItem('cosmic-theme');
        if (savedTheme) {
            this.changeTheme(savedTheme);
        }
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.cosmicEnhancements = new CosmicEnhancements();
    });
} else {
    window.cosmicEnhancements = new CosmicEnhancements();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CosmicEnhancements;
}