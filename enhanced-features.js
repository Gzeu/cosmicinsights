// Enhanced Features for Cosmic Insights
// Interactive animations, improved user experience, and visual enhancements

class CosmicEnhancements {
    constructor() {
        this.initializeParticleSystem();
        this.initializeCardAnimations();
        this.initializeProgressBars();
        this.initializeSoundEffects();
        this.initializeThemeToggle();
        this.initializeLiveChat();
    }

    // Particle background system
    initializeParticleSystem() {
        const canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        canvas.style.opacity = '0.3';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 50;

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }

        // Animate particles
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Wrap around screen
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.y > canvas.height) particle.y = 0;
                if (particle.y < 0) particle.y = canvas.height;

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = '#8b5cf6';
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }

        animate();

        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Enhanced card animations
    initializeCardAnimations() {
        const cards = document.querySelectorAll('.card-glow');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.6)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.3)';
            });
        });
    }

    // Progress bars for form completion
    initializeProgressBars() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.innerHTML = `
                <div class="bg-mystic-800 h-2 rounded-full mb-4">
                    <div class="bg-gradient-to-r from-mystic-500 to-cosmic-500 h-full rounded-full transition-all duration-300" style="width: 0%"></div>
                </div>
            `;
            
            form.insertBefore(progressBar, form.firstChild);
            
            const inputs = form.querySelectorAll('input, select, textarea');
            const progressFill = progressBar.querySelector('div > div');
            
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    const filledInputs = Array.from(inputs).filter(inp => inp.value.trim() !== '').length;
                    const progress = (filledInputs / inputs.length) * 100;
                    progressFill.style.width = progress + '%';
                });
            });
        });
    }

    // Sound effects for interactions
    initializeSoundEffects() {
        // Create audio context for sound effects
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const playTone = (frequency, duration) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };
        
        // Add sound to buttons
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                playTone(800, 0.1);
            });
        });
    }

    // Theme toggle functionality
    initializeThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.innerHTML = '<i class="fas fa-palette"></i>';
        themeToggle.className = 'fixed top-20 right-4 bg-mystic-700 hover:bg-mystic-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg transition-all z-50';
        themeToggle.title = 'Change Color Theme';
        
        document.body.appendChild(themeToggle);
        
        const themes = [
            { primary: '#8b5cf6', secondary: '#6366f1' }, // Default purple
            { primary: '#06b6d4', secondary: '#0891b2' }, // Cyan
            { primary: '#10b981', secondary: '#059669' }, // Emerald
            { primary: '#f59e0b', secondary: '#d97706' }, // Amber
            { primary: '#ef4444', secondary: '#dc2626' }  // Red
        ];
        
        let currentTheme = 0;
        
        themeToggle.addEventListener('click', () => {
            currentTheme = (currentTheme + 1) % themes.length;
            const theme = themes[currentTheme];
            
            document.documentElement.style.setProperty('--theme-primary', theme.primary);
            document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
        });
    }

    // Live chat widget
    initializeLiveChat() {
        const chatWidget = document.createElement('div');
        chatWidget.innerHTML = `
            <div id="chat-widget" class="fixed bottom-20 right-8 w-80 bg-mystic-900 rounded-lg shadow-2xl border border-mystic-700 hidden z-50">
                <div class="p-4 border-b border-mystic-700">
                    <h3 class="text-white font-semibold flex items-center">
                        <i class="fas fa-comments mr-2 text-mystic-400"></i>
                        Cosmic Guide
                    </h3>
                </div>
                <div id="chat-messages" class="h-64 overflow-y-auto p-4 space-y-2">
                    <div class="bg-mystic-800 rounded-lg p-2 text-mystic-200 text-sm">
                        Welcome! I'm here to help guide you through your cosmic journey. Ask me anything about astrology, tarot, or dreams! 🌟
                    </div>
                </div>
                <div class="p-4 border-t border-mystic-700">
                    <div class="flex space-x-2">
                        <input type="text" id="chat-input" placeholder="Ask about your reading..." class="flex-1 bg-mystic-800 border border-mystic-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-mystic-500">
                        <button id="chat-send" class="bg-mystic-600 hover:bg-mystic-700 text-white px-3 py-2 rounded-lg text-sm">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
            <button id="chat-toggle" class="fixed bottom-8 right-20 bg-mystic-600 hover:bg-mystic-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg transition-all">
                <i class="fas fa-comment"></i>
            </button>
        `;
        
        document.body.appendChild(chatWidget);
        
        const chatToggle = document.getElementById('chat-toggle');
        const chatWidgetEl = document.getElementById('chat-widget');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const chatMessages = document.getElementById('chat-messages');
        
        chatToggle.addEventListener('click', () => {
            chatWidgetEl.classList.toggle('hidden');
        });
        
        const addMessage = (message, isUser = false) => {
            const messageEl = document.createElement('div');
            messageEl.className = `rounded-lg p-2 text-sm ${
                isUser 
                    ? 'bg-mystic-600 text-white ml-8' 
                    : 'bg-mystic-800 text-mystic-200 mr-8'
            }`;
            messageEl.textContent = message;
            chatMessages.appendChild(messageEl);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };
        
        const sendMessage = async () => {
            const message = chatInput.value.trim();
            if (!message) return;
            
            addMessage(message, true);
            chatInput.value = '';
            
            // Simulate AI response (you can integrate with your Groq API here)
            setTimeout(() => {
                const responses = [
                    "That's a fascinating question! The stars suggest looking deeper into your inner wisdom.",
                    "Your cosmic energy is strong today. Trust your intuition.",
                    "The universe is aligning to bring you clarity on this matter.",
                    "I sense this is connected to your spiritual growth journey.",
                    "The cards whisper of new opportunities coming your way."
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse);
            }, 1000);
        };
        
        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
}

// Initialize enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CosmicEnhancements();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CosmicEnhancements;
}