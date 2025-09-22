// 🌍 Cosmic Insights Multi-Language Support
class CosmicLanguage {
    constructor() {
        this.currentLanguage = this.detectLanguage();
        this.translations = this.initTranslations();
        this.init();
    }

    detectLanguage() {
        // Check localStorage first
        const saved = localStorage.getItem('cosmic-language');
        if (saved && this.isValidLanguage(saved)) {
            return saved;
        }

        // Detect browser language
        const browserLang = navigator.language.substring(0, 2);
        const supported = ['en', 'ro', 'es', 'fr', 'de'];
        
        return supported.includes(browserLang) ? browserLang : 'en';
    }

    isValidLanguage(lang) {
        return ['en', 'ro', 'es', 'fr', 'de'].includes(lang);
    }

    initTranslations() {
        return {
            en: {
                // Navigation
                home: "Home",
                services: "Services",
                astrology: "Astrology",
                numerology: "Numerology",
                tarot: "Tarot",
                dreams: "Dreams",
                
                // Main titles
                mainTitle: "Unlock Your Cosmic Constellation",
                mainSubtitle: "Journey through the infinite cosmos of self-discovery with our AI-powered constellation guidance. Let the stars illuminate your path through astrology, numerology, tarot, and dream interpretation.",
                exploreNow: "✨ Explore Now",
                completeReports: "Complete Reports",
                
                // Astrology
                astrologyTitle: "⭐ Astrology Readings",
                astrologySubtitle: "Discover the cosmic forces that shaped your destiny. Your birth chart reveals the unique celestial blueprint that guides your life's journey through the stars.",
                birthChartCalculator: "Birth Chart Calculator",
                yourFullName: "🌟 Your Full Name",
                birthDate: "🌙 Birth Date",
                birthTime: "⏰ Birth Time (Optional)",
                birthLocation: "🌍 Birth Location",
                generateBirthChart: "Generate Birth Chart",
                yourCosmicReading: "Your Cosmic Reading",
                starsAwaitDetails: "The Stars Await Your Details",
                fillBirthInfo: "Fill out your birth information to discover your celestial blueprint and cosmic destiny.",
                
                // Numerology
                numerologyTitle: "🔢 Numerology Calculator",
                numerologySubtitle: "Numbers are the universal language of the cosmos. Discover the sacred mathematics that govern your existence and reveal your life's divine purpose.",
                lifePathCalculator: "Life Path Calculator",
                focusArea: "🎯 Focus Area",
                calculateNumbers: "Calculate Numbers",
                yourNumbers: "Your Numbers",
                sacredNumbersAwait: "Sacred Numbers Await",
                enterNameDate: "Enter your name and birth date to unlock the numerical secrets of your cosmic identity.",
                
                // Focus options
                lifePath: "Life Path Number",
                destiny: "Destiny Number",
                soul: "Soul Urge Number",
                personality: "Personality Number",
                complete: "Complete Analysis",
                
                // Tarot
                tarotTitle: "🃏 Tarot Reading",
                tarotSubtitle: "The ancient wisdom of tarot cards reveals the hidden currents of your destiny. Draw from the cosmic deck to receive guidance for your journey.",
                drawYourCards: "Draw Your Cards",
                yourQuestion: "🌟 Your Question",
                questionPlaceholder: "What guidance do you seek from the cosmos?",
                selectReadingType: "🎴 Select Reading Type",
                singleCard: "Single Card",
                dailyGuidance: "Daily guidance",
                threeCards: "Three Cards",
                pastPresentFuture: "Past, Present, Future",
                chooseYourCards: "🔮 Choose Your Cards",
                revealCards: "Reveal Cards",
                yourReading: "Your Reading",
                cardsHoldAnswers: "The Cards Hold Your Answers",
                selectCardType: "Select your reading type and draw cards to receive cosmic guidance for your question.",
                
                // Dreams
                dreamsTitle: "🌙 Dream Analysis",
                dreamsSubtitle: "Your dreams are messages from the cosmic unconscious. Unlock the hidden symbolism and discover the profound insights your sleeping mind reveals.",
                dreamJournal: "Dream Journal",
                dreamDate: "🌙 Dream Date",
                dreamDescription: "🌟 Dream Description",
                dreamPlaceholder: "Describe your dream in vivid detail...",
                emotionsFelt: "💭 Emotions Felt",
                emotionsPlaceholder: "How did the dream make you feel?",
                keySymbols: "🔍 Key Symbols",
                symbolsPlaceholder: "Notable people, objects, or places...",
                analyzeDream: "Analyze Dream",
                dreamInterpretation: "Dream Interpretation",
                dreamsHoldSecrets: "Your Dreams Hold Cosmic Secrets",
                shareDreamDetails: "Share your dream details to receive a comprehensive analysis of its symbolic meaning and spiritual significance.",
                
                // Newsletter
                newsletterTitle: "Join the Cosmic Constellation",
                newsletterSubtitle: "Subscribe to receive monthly cosmic insights, constellation forecasts, and exclusive spiritual guidance.",
                emailPlaceholder: "Enter your cosmic email address...",
                subscribe: "Subscribe",
                privacyNote: "🌟 We respect your cosmic privacy. Unsubscribe at any time.",
                
                // Validation messages
                fillRequired: "Please fill in all required fields.",
                validEmail: "Please enter a valid cosmic email address.",
                selectCard: "Please select at least one card.",
                describeDream: "Please describe your dream.",
                welcomeConstellation: "Welcome to the constellation",
                checkInbox: "Check your inbox for cosmic insights.",
                
                // Common words
                processing: "Processing...",
                subscribing: "Subscribing...",
                name: "Name",
                email: "Email",
                question: "Question",
                guidance: "Guidance",
                cosmic: "Cosmic",
                constellation: "Constellation"
            },
            
            ro: {
                // Navigation
                home: "Acasă",
                services: "Servicii",
                astrology: "Astrologie",
                numerology: "Numerologie",
                tarot: "Tarot",
                dreams: "Vise",
                
                // Main titles
                main: "Descoperă-ți Constelația Cosmică",
                mainSubtitle: "Călătorește prin cosmosul infinit al descoperirii de sine cu ghidarea noastră cosmică bazată pe inteligența artificială. Lasă stelele să îți lumineze calea prin astrologie, numerologie, tarot și interpretarea viselor.",
                exploreNow: "✨ Explorează Acum",
                completeReports: "Rapoarte Complete",
                
                // Astrology
                astrologyTitle: "⭐ Lecturi Astrologice",
                astrologySubtitle: "Descoperă forțele cosmice care ți-au modelat destinul. Harta ta natală dezvăluie planul ceresc unic care îți ghidează călătoria vieții prin stele.",
                birthChartCalculator: "Calculator Hartă Natală",
                yourFullName: "🌟 Numele Tău Complet",
                birthDate: "🌙 Data Nașterii",
                birthTime: "⏰ Ora Nașterii (Opțional)",
                birthLocation: "🌍 Locul Nașterii",
                generateBirthChart: "Generează Harta Natală",
                yourCosmicReading: "Lectura Ta Cosmică",
                starsAwaitDetails: "Stelele Așteaptă Detaliile Tale",
                fillBirthInfo: "Completează informațiile de naștere pentru a-ți descoperi planul ceresc și destinul cosmic.",
                
                // Numerology
                numerologyTitle: "🔢 Calculator Numerologic",
                numerologySubtitle: "Numerele sunt limba universală a cosmosului. Descoperă matematica sacră care îți guvernează existența și îți dezvăluie scopul divin al vieții.",
                lifePathCalculator: "Calculator Cale de Viață",
                focusArea: "🎯 Zonă de Focus",
                calculateNumbers: "Calculează Numerele",
                yourNumbers: "Numerele Tale",
                sacredNumbersAwait: "Numerele Sacre Te Așteaptă",
                enterNameDate: "Introdu numele și data nașterii pentru a debloca secretele numerice ale identității tale cosmice.",
                
                // Focus options
                lifePath: "Numărul Căii de Viață",
                destiny: "Numărul Destinului",
                soul: "Numărul Sufletului",
                personality: "Numărul Personalității",
                complete: "Analiză Completă",
                
                // Tarot
                tarotTitle: "🃏 Lectura Tarot",
                tarotSubtitle: "Înțelepciunea antică a cărților de tarot dezvăluie curenții ascunși ai destinului tău. Trage din pachetul cosmic pentru a primi îndrumare în călătoria ta.",
                drawYourCards: "Trage Cărțile",
                yourQuestion: "🌟 Întrebarea Ta",
                questionPlaceholder: "Ce îndrumare cauți din cosmos?",
                selectReadingType: "🎴 Selectează Tipul de Lectură",
                singleCard: "O Carte",
                dailyGuidance: "Îndrumare zilnică",
                threeCards: "Trei Cărți",
                pastPresentFuture: "Trecut, Prezent, Viitor",
                chooseYourCards: "🔮 Alege Cărțile",
                revealCards: "Dezvăluie Cărțile",
                yourReading: "Lectura Ta",
                cardsHoldAnswers: "Cărțile Dețin Răspunsurile",
                selectCardType: "Selectează tipul de lectură și trage cărțile pentru a primi îndrumare cosmică pentru întrebarea ta.",
                
                // Dreams
                dreamsTitle: "🌙 Analiza Viselor",
                dreamsSubtitle: "Visele tale sunt mesaje din inconștientul cosmic. Deblochează simbolismul ascuns și descoperă perspectivele profunde pe care mintea ta adormită le dezvăluie.",
                dreamJournal: "Jurnalul Viselor",
                dreamDate: "🌙 Data Visului",
                dreamDescription: "🌟 Descrierea Visului",
                dreamPlaceholder: "Descrie visul tău în detalii vii...",
                emotionsFelt: "💭 Emoții Simțite",
                emotionsPlaceholder: "Cum te-a făcut să te simți visul?",
                keySymbols: "🔍 Simboluri Cheie",
                symbolsPlaceholder: "Persoane, obiecte sau locuri notabile...",
                analyzeDream: "Analizează Visul",
                dreamInterpretation: "Interpretarea Visului",
                dreamsHoldSecrets: "Visele Tale Ascund Secrete Cosmice",
                shareDreamDetails: "Împărtășește detaliile visului pentru a primi o analiză cuprinzătoare a semnificației sale simbolice și importanței spirituale.",
                
                // Newsletter
                newsletterTitle: "Alătură-te Constelației Cosmice",
                newsletterSubtitle: "Abonează-te pentru a primi perspective cosmice lunare, previziuni despre constelații și îndrumare spirituală exclusivă.",
                emailPlaceholder: "Introdu adresa ta de email cosmică...",
                subscribe: "Abonează-te",
                privacyNote: "🌟 Respectăm intimitatea ta cosmică. Dezabonează-te oricând.",
                
                // Validation messages
                fillRequired: "Te rog completează toate câmpurile obligatorii.",
                validEmail: "Te rog introdu o adresă de email cosmică validă.",
                selectCard: "Te rog selectează cel puțin o carte.",
                describeDream: "Te rog descrie visul tău.",
                welcomeConstellation: "Bine ai venit în constelație",
                checkInbox: "Verifică-ți inbox-ul pentru perspective cosmice.",
                
                // Common words
                processing: "Procesez...",
                subscribing: "Mă abonez...",
                name: "Nume",
                email: "Email",
                question: "Întrebare",
                guidance: "Îndrumare",
                cosmic: "Cosmic",
                constellation: "Constelație"
            }
        };
    }

    init() {
        this.createLanguageSelector();
        this.applyTranslations();
        this.setupLanguageEvents();
    }

    createLanguageSelector() {
        const selector = document.createElement('div');
        selector.className = 'language-selector';
        selector.innerHTML = `
            <div class="lang-toggle">
                <div class="current-lang">
                    <span class="lang-flag">${this.getFlag(this.currentLanguage)}</span>
                    <span class="lang-code">${this.currentLanguage.toUpperCase()}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="lang-dropdown hidden">
                    <div class="lang-option" data-lang="en">
                        <span class="lang-flag">🇺🇸</span>
                        <span class="lang-name">English</span>
                    </div>
                    <div class="lang-option" data-lang="ro">
                        <span class="lang-flag">🇷🇴</span>
                        <span class="lang-name">Română</span>
                    </div>
                    <div class="lang-option" data-lang="es">
                        <span class="lang-flag">🇪🇸</span>
                        <span class="lang-name">Español</span>
                    </div>
                    <div class="lang-option" data-lang="fr">
                        <span class="lang-flag">🇫🇷</span>
                        <span class="lang-name">Français</span>
                    </div>
                    <div class="lang-option" data-lang="de">
                        <span class="lang-flag">🇩🇪</span>
                        <span class="lang-name">Deutsch</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(selector);
        this.addLanguageSelectorStyles();
    }

    addLanguageSelectorStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .language-selector {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 1000;
                font-family: var(--font-body);
            }

            .lang-toggle {
                position: relative;
                background: var(--glass-bg);
                backdrop-filter: blur(20px);
                border: 1px solid var(--glass-border);
                border-radius: 15px;
                padding: 8px 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 80px;
            }

            .lang-toggle:hover {
                background: rgba(15, 23, 42, 0.5);
                border-color: var(--star-accent);
                box-shadow: 0 4px 20px rgba(96, 165, 250, 0.3);
            }

            .current-lang {
                display: flex;
                align-items: center;
                gap: 6px;
                color: var(--star-primary);
                font-size: 14px;
                font-weight: 600;
            }

            .lang-flag {
                font-size: 16px;
            }

            .lang-dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                margin-top: 5px;
                background: var(--glass-bg);
                backdrop-filter: blur(20px);
                border: 1px solid var(--glass-border);
                border-radius: 15px;
                overflow: hidden;
                box-shadow: var(--glass-shadow);
            }

            .lang-option {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 12px;
                color: var(--star-primary);
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s ease;
                border-bottom: 1px solid var(--glass-border);
            }

            .lang-option:last-child {
                border-bottom: none;
            }

            .lang-option:hover {
                background: rgba(96, 165, 250, 0.1);
                color: var(--star-accent);
            }

            @media (max-width: 768px) {
                .language-selector {
                    top: 70px;
                    right: 10px;
                }
                
                .lang-toggle {
                    padding: 6px 10px;
                    min-width: 70px;
                }
                
                .current-lang, .lang-option {
                    font-size: 12px;
                }
                
                .lang-flag {
                    font-size: 14px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupLanguageEvents() {
        const toggle = document.querySelector('.lang-toggle');
        const dropdown = document.querySelector('.lang-dropdown');
        
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            dropdown.classList.add('hidden');
        });

        document.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const newLang = option.dataset.lang;
                this.changeLanguage(newLang);
                dropdown.classList.add('hidden');
            });
        });
    }

    changeLanguage(lang) {
        if (!this.isValidLanguage(lang) || lang === this.currentLanguage) return;
        
        this.currentLanguage = lang;
        localStorage.setItem('cosmic-language', lang);
        
        // Update selector display
        const currentLang = document.querySelector('.current-lang');
        currentLang.innerHTML = `
            <span class="lang-flag">${this.getFlag(lang)}</span>
            <span class="lang-code">${lang.toUpperCase()}</span>
            <i class="fas fa-chevron-down"></i>
        `;
        
        // Apply translations
        this.applyTranslations();
        
        // Show language change feedback
        this.showLanguageChangeNotification(lang);
    }

    getFlag(lang) {
        const flags = {
            en: '🇺🇸',
            ro: '🇷🇴', 
            es: '🇪🇸',
            fr: '🇫🇷',
            de: '🇩🇪'
        };
        return flags[lang] || '🌍';
    }

    applyTranslations() {
        const t = this.translations[this.currentLanguage];
        if (!t) return;

        // Navigation links
        document.querySelectorAll('[data-translate="home"]').forEach(el => el.textContent = t.home);
        document.querySelectorAll('[data-translate="services"]').forEach(el => el.textContent = t.services);
        document.querySelectorAll('[data-translate="astrology"]').forEach(el => el.textContent = t.astrology);
        document.querySelectorAll('[data-translate="numerology"]').forEach(el => el.textContent = t.numerology);
        document.querySelectorAll('[data-translate="tarot"]').forEach(el => el.textContent = t.tarot);
        document.querySelectorAll('[data-translate="dreams"]').forEach(el => el.textContent = t.dreams);

        // Main titles
        document.querySelectorAll('[data-translate="main-title"]').forEach(el => el.innerHTML = t.mainTitle || t.main);
        document.querySelectorAll('[data-translate="main-subtitle"]').forEach(el => el.textContent = t.mainSubtitle);
        document.querySelectorAll('[data-translate="explore-now"]').forEach(el => el.innerHTML = t.exploreNow);
        document.querySelectorAll('[data-translate="complete-reports"]').forEach(el => el.innerHTML = t.completeReports);

        // Section titles
        document.querySelectorAll('[data-translate="astrology-title"]').forEach(el => el.innerHTML = t.astrologyTitle);
        document.querySelectorAll('[data-translate="astrology-subtitle"]').forEach(el => el.textContent = t.astrologySubtitle);
        document.querySelectorAll('[data-translate="numerology-title"]').forEach(el => el.innerHTML = t.numerologyTitle);
        document.querySelectorAll('[data-translate="numerology-subtitle"]').forEach(el => el.textContent = t.numerologySubtitle);
        document.querySelectorAll('[data-translate="tarot-title"]').forEach(el => el.innerHTML = t.tarotTitle);
        document.querySelectorAll('[data-translate="tarot-subtitle"]').forEach(el => el.textContent = t.tarotSubtitle);
        document.querySelectorAll('[data-translate="dreams-title"]').forEach(el => el.innerHTML = t.dreamsTitle);
        document.querySelectorAll('[data-translate="dreams-subtitle"]').forEach(el => el.textContent = t.dreamsSubtitle);

        // Form labels
        document.querySelectorAll('[data-translate="your-full-name"]').forEach(el => el.textContent = t.yourFullName);
        document.querySelectorAll('[data-translate="birth-date"]').forEach(el => el.textContent = t.birthDate);
        document.querySelectorAll('[data-translate="birth-time"]').forEach(el => el.textContent = t.birthTime);
        document.querySelectorAll('[data-translate="birth-location"]').forEach(el => el.textContent = t.birthLocation);

        // Placeholders
        document.querySelectorAll('[data-translate-placeholder="question"]').forEach(el => el.placeholder = t.questionPlaceholder);
        document.querySelectorAll('[data-translate-placeholder="dream-description"]').forEach(el => el.placeholder = t.dreamPlaceholder);
        document.querySelectorAll('[data-translate-placeholder="emotions"]').forEach(el => el.placeholder = t.emotionsPlaceholder);
        document.querySelectorAll('[data-translate-placeholder="symbols"]').forEach(el => el.placeholder = t.symbolsPlaceholder);
        document.querySelectorAll('[data-translate-placeholder="email"]').forEach(el => el.placeholder = t.emailPlaceholder);

        // Buttons
        document.querySelectorAll('[data-translate="generate-birth-chart"]').forEach(el => {
            const textSpan = el.querySelector('span') || el;
            textSpan.textContent = t.generateBirthChart;
        });
        document.querySelectorAll('[data-translate="calculate-numbers"]').forEach(el => {
            const textSpan = el.querySelector('span') || el;
            textSpan.textContent = t.calculateNumbers;
        });
        document.querySelectorAll('[data-translate="reveal-cards"]').forEach(el => {
            const textSpan = el.querySelector('span') || el;
            textSpan.textContent = t.revealCards;
        });
        document.querySelectorAll('[data-translate="analyze-dream"]').forEach(el => {
            const textSpan = el.querySelector('span') || el;
            textSpan.textContent = t.analyzeDream;
        });
        document.querySelectorAll('[data-translate="subscribe"]').forEach(el => {
            const textSpan = el.querySelector('span') || el;
            textSpan.textContent = t.subscribe;
        });

        // Update document language attribute
        document.documentElement.lang = this.currentLanguage;
    }

    showLanguageChangeNotification(lang) {
        const notification = document.createElement('div');
        notification.className = 'lang-notification';
        notification.innerHTML = `
            <div class="constellation-glass p-4 text-center">
                <div class="text-2xl mb-2">${this.getFlag(lang)}</div>
                <div class="text-white font-semibold">
                    ${lang === 'ro' ? 'Limba schimbată în Română' : 'Language changed to ' + lang.toUpperCase()}
                </div>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 150px;
            right: 20px;
            z-index: 1001;
            animation: slideInRight 0.5s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-in';
            setTimeout(() => notification.remove(), 500);
        }, 3000);

        // Add animation keyframes
        if (!document.querySelector('#lang-animations')) {
            const style = document.createElement('style');
            style.id = 'lang-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Enhanced response generation with language support
    generateAstrologyResponse(name, date, time, location, lang = 'en') {
        const responses = {
            en: {
                sunSign: "Your core essence radiates cosmic energy, illuminating your path through life's stellar journey.",
                moonPhase: "Your emotional nature flows like celestial tides, influenced by the eternal dance of cosmic bodies.",
                risingSign: "Your cosmic mask presents your soul's first impression to the universe.",
                venus: "Love and creativity flow through your cosmic essence",
                mars: "Your warrior spirit is guided by stellar determination",
                jupiter: "Expansion and wisdom illuminate your path",
                saturn: "Cosmic lessons shape your spiritual growth"
            },
            ro: {
                sunSign: "Esența ta centrală radiază energie cosmică, iluminându-ți calea prin călătoria stelară a vieții.",
                moonPhase: "Natura ta emotională curge ca mareele cerești, influențată de dansul etern al corpurilor cosmice.",
                risingSign: "Masca ta cosmică prezintă prima impresie a sufletului tău universului.",
                venus: "Dragostea și creativitatea curg prin esența ta cosmică",
                mars: "Spiritul tău războinic este ghidat de determinarea stelară",
                jupiter: "Expansiunea și înțelepciunea îți iluminează calea",
                saturn: "Lecțiile cosmice îți modelează creșterea spirituală"
            }
        };

        const r = responses[lang] || responses.en;
        
        return `
            <div class="space-y-6">
                <div class="constellation-glass p-6">
                    <h4 class="text-lg font-semibold text-blue-400 mb-4">🌟 ${lang === 'ro' ? 'Harta Natală pentru' : 'Birth Chart for'} ${name}</h4>
                    <div class="text-white/90 space-y-3">
                        <p><strong class="text-blue-400">${lang === 'ro' ? 'Născut' : 'Born'}:</strong> ${date}${time ? ' la ' + time : ''} ${lang === 'ro' ? 'în' : 'in'} ${location}</p>
                        <p><strong class="text-purple-400">${lang === 'ro' ? 'Semn Solar' : 'Sun Sign'}:</strong> ${r.sunSign}</p>
                        <p><strong class="text-cyan-400">${lang === 'ro' ? 'Faza Lunii' : 'Moon Phase'}:</strong> ${r.moonPhase}</p>
                        <p><strong class="text-pink-400">${lang === 'ro' ? 'Semn Ascendent' : 'Rising Sign'}:</strong> ${r.risingSign}</p>
                    </div>
                </div>
                <div class="constellation-glass p-6">
                    <h4 class="text-lg font-semibold text-green-400 mb-4">🪐 ${lang === 'ro' ? 'Influențe Planetare' : 'Planetary Influences'}</h4>
                    <div class="text-white/90 space-y-2">
                        <p>• <strong class="text-blue-400">Venus:</strong> ${r.venus}</p>
                        <p>• <strong class="text-red-400">Mars:</strong> ${r.mars}</p>
                        <p>• <strong class="text-yellow-400">Jupiter:</strong> ${r.jupiter}</p>
                        <p>• <strong class="text-purple-400">Saturn:</strong> ${r.saturn}</p>
                    </div>
                </div>
            </div>
        `;
    }

    generateNumerologyResponse(name, lifePathNumber, lang = 'en') {
        const responses = {
            en: {
                lifePathDesc: "This sacred number reveals your cosmic purpose and spiritual journey through the stars.",
                cosmicJourney: "Your cosmic journey follows the sacred mathematics of universal harmony.",
                destinyVibration: "The numerical frequency of your name resonates with celestial energies.",
                soulPurpose: "Your existence is guided by divine mathematical principles.",
                cosmicMessage: "Embrace the numerical wisdom that flows through your being."
            },
            ro: {
                lifePathDesc: "Acest număr sacru îți dezvăluie scopul cosmic și călătoria spirituală prin stele.",
                cosmicJourney: "Călătoria ta cosmică urmează matematica sacră a armoniei universale.",
                destinyVibration: "Frecvența numerică a numelui tău rezonează cu energiile cerești.",
                soulPurpose: "Existența ta este ghidată de principii matematice divine.",
                cosmicMessage: "Îmbrățișează înțelepciunea numerică care curge prin ființa ta."
            }
        };

        const r = responses[lang] || responses.en;
        
        return `
            <div class="space-y-6">
                <div class="constellation-glass p-6 text-center">
                    <div class="text-6xl mb-4 text-blue-400">${lifePathNumber}</div>
                    <h4 class="text-xl font-semibold text-white mb-2">${lang === 'ro' ? 'Numărul Căii Tale de Viață' : 'Your Life Path Number'}</h4>
                    <p class="text-white/80">${r.lifePathDesc}</p>
                </div>
                <div class="constellation-glass p-6">
                    <h4 class="text-lg font-semibold text-purple-400 mb-4">🔢 ${lang === 'ro' ? 'Analiză Numerică pentru' : 'Numerical Analysis for'} ${name}</h4>
                    <div class="text-white/90 space-y-3">
                        <p><strong class="text-blue-400">${lang === 'ro' ? 'Calea Vieții' : 'Life Path'} ${lifePathNumber}:</strong> ${r.cosmicJourney}</p>
                        <p><strong class="text-cyan-400">${lang === 'ro' ? 'Vibrația Destinului' : 'Destiny Vibration'}:</strong> ${r.destinyVibration}</p>
                        <p><strong class="text-pink-400">${lang === 'ro' ? 'Scopul Sufletului' : 'Soul Purpose'}:</strong> ${r.soulPurpose}</p>
                        <p><strong class="text-green-400">${lang === 'ro' ? 'Mesaj Cosmic' : 'Cosmic Message'}:</strong> ${r.cosmicMessage}</p>
                    </div>
                </div>
            </div>
        `;
    }

    generateTarotResponse(cards, question, lang = 'en') {
        const cardMeanings = {
            en: [
                { name: 'The Star', meaning: 'Hope, inspiration, and spiritual guidance illuminate your path through the cosmic darkness.' },
                { name: 'The Moon', meaning: 'Intuition and subconscious wisdom guide your journey through the mystical realms.' },
                { name: 'The Sun', meaning: 'Joy, success, and cosmic enlightenment await you in your stellar destiny.' },
                { name: 'The Hermit', meaning: 'Inner wisdom and soul-searching lead to profound cosmic revelations.' },
                { name: 'The Wheel', meaning: 'Cosmic cycles and universal changes bring new opportunities your way.' }
            ],
            ro: [
                { name: 'Steaua', meaning: 'Speranța, inspirația și îndrumarea spirituală îți iluminează calea prin întunericul cosmic.' },
                { name: 'Luna', meaning: 'Intuiția și înțelepciunea subconștientului îți ghidează călătoria prin tărâmurile mistice.' },
                { name: 'Soarele', meaning: 'Bucuria, succesul și iluminarea cosmică te așteaptă în destinul tău stelar.' },
                { name: 'Ermitul', meaning: 'Înțelepciunea interioară și căutarea sufletului duc la revelații cosmice profunde.' },
                { name: 'Roata', meaning: 'Ciclurile cosmice și schimbările universale îți aduc noi oportunități.' }
            ]
        };

        const meanings = cardMeanings[lang] || cardMeanings.en;
        const positions = lang === 'ro' ? ['Trecut', 'Prezent', 'Viitor'] : ['Past', 'Present', 'Future'];
        
        let result = `
            <div class="space-y-6">
                <div class="constellation-glass p-6">
                    <h4 class="text-lg font-semibold text-purple-400 mb-4">🃏 ${lang === 'ro' ? 'Lectura Ta Cosmică' : 'Your Cosmic Reading'}</h4>
                    ${question ? `<p class="text-white/80 mb-4"><strong>${lang === 'ro' ? 'Întrebarea Ta' : 'Your Question'}:</strong> ${question}</p>` : ''}
        `;

        cards.forEach((cardId, index) => {
            const card = meanings[index] || meanings[Math.floor(Math.random() * meanings.length)];
            const position = cards.length === 3 ? positions[index] : (lang === 'ro' ? 'Îndrumare' : 'Guidance');
            
            result += `
                <div class="mb-4 p-4 bg-white/10 rounded-lg">
                    <h5 class="text-cyan-400 font-semibold">${position}: ${card.name}</h5>
                    <p class="text-white/90 text-sm mt-2">${card.meaning}</p>
                </div>
            `;
        });

        result += `</div></div>`;
        return result;
    }

    generateDreamResponse(description, emotions, symbols, lang = 'en') {
        const responses = {
            en: {
                primaryMeaning: "Your dream reveals deep subconscious processing of cosmic energies and life transitions.",
                emotionalSignificance: "indicate your soul's response to spiritual transformation.",
                symbolInterpretation: "represents archetypal energies guiding your cosmic journey.",
                guidanceTitle: "✨ Cosmic Guidance",
                guidance: [
                    "Your subconscious is processing important spiritual lessons",
                    "Pay attention to recurring symbols in future dreams", 
                    "This dream may be preparing you for upcoming changes",
                    "Consider meditating on the emotions this dream evoked"
                ]
            },
            ro: {
                primaryMeaning: "Visul tău dezvăluie procesarea subconștientă profundă a energiilor cosmice și tranzițiilor de viață.",
                emotionalSignificance: "indică răspunsul sufletului tău la transformarea spirituală.",
                symbolInterpretation: "reprezintă energii arhetipale care îți ghidează călătoria cosmică.",
                guidanceTitle: "✨ Îndrumare Cosmică",
                guidance: [
                    "Subconștientul tău procesează lecții spirituale importante",
                    "Acordă atenție simbolurilor recurente din visele viitoare",
                    "Acest vis te-ar putea pregăti pentru schimbări viitoare", 
                    "Consideră să meditezi asupra emoțiilor pe care le-a evocat acest vis"
                ]
            }
        };

        const r = responses[lang] || responses.en;
        
        return `
            <div class="space-y-6">
                <div class="constellation-glass p-6">
                    <h4 class="text-lg font-semibold text-blue-400 mb-4">🌙 ${lang === 'ro' ? 'Analiza Visului' : 'Dream Analysis'}</h4>
                    <div class="text-white/90 space-y-3">
                        <p><strong class="text-cyan-400">${lang === 'ro' ? 'Semnificația Primară' : 'Primary Meaning'}:</strong> ${r.primaryMeaning}</p>
                        ${emotions ? `<p><strong class="text-pink-400">${lang === 'ro' ? 'Semnificația Emoțională' : 'Emotional Significance'}:</strong> ${lang === 'ro' ? 'Sentimentele de' : 'The feelings of'} "${emotions}" ${r.emotionalSignificance}</p>` : ''}
                        ${symbols ? `<p><strong class="text-green-400">${lang === 'ro' ? 'Interpretarea Simbolurilor' : 'Symbol Interpretation'}:</strong> "${symbols}" ${r.symbolInterpretation}</p>` : ''}
                    </div>
                </div>
                <div class="constellation-glass p-6">
                    <h4 class="text-lg font-semibold text-yellow-400 mb-4">${r.guidanceTitle}</h4>
                    <div class="text-white/90 space-y-2">
                        ${r.guidance.map(text => `<p>• ${text}</p>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Get translation for current language
    t(key) {
        return this.translations[this.currentLanguage]?.[key] || this.translations.en[key] || key;
    }
}

// Global language instance
window.CosmicLang = new CosmicLanguage();