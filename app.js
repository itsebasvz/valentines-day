import { tsParticles } from '@tsparticles/engine';
import { loadBasic } from '@tsparticles/basic';
import { createTimeline, stagger } from 'https://cdn.jsdelivr.net/npm/animejs@4.3.5/dist/bundles/anime.esm.js';

// Referencias a elementos
const mainScreen = document.getElementById('main-screen');
const announcementScreen = document.getElementById('announcement-screen');
const adventureScreen = document.getElementById('adventure-screen');
const yesButton = document.getElementById('yes-button');
const noButton = document.getElementById('no-button');
const dramaticMessage = document.getElementById('dramatic-message');
const readyButton = document.getElementById('ready-button');

// Referencias para el loader
const progressCircle = document.querySelector('.progress-ring-circle');
const progressPercentage = document.querySelector('.progress-percentage');
const loadingMessage = document.querySelector('.loading-message');

// Variables para el contador de rechazos
let noClickCount = 0;
const dramaticMessages = [
    "¿Me lo juras? TnT",
    "Are u sure? unu",
    "mmm, puedes pensarlo mejor... >u<",
    "ok, entiendo. TnT",
    "TwT",
    "ps cada quién. unu",
    "Ehpipipipi... TnT",
];

// Animación inicial de carga
onload = () => {
    const c = setTimeout(() => {
        document.body.classList.remove("not-loaded");
        clearTimeout(c);
    }, 1000);
    
    // Inicializar el botón "No" después de que aparezca la pregunta
    setTimeout(() => {
        initializeNoButton();
    }, 5500);
};

// Función para mostrar la pantalla de respuesta
function showAnswerScreen() {
    mainScreen.classList.remove('active');
    mainScreen.classList.add('fade-out');
    
    // Mostrar la pantalla final con ASCII art y estrellas
    setTimeout(() => {
        announcementScreen.classList.add('active');
        announcementScreen.classList.add('fade-in');
        initializeStars();
        animateCelebrationText();
    }, 500);
}

// Animar el texto de celebración con bounce
function animateCelebrationText() {
    const textElement = document.getElementById('celebration-text');
    const text = textElement.textContent;
    
    // Dividir el texto en spans individuales para cada letra
    // Preservar espacios usando &nbsp;
    textElement.innerHTML = text
        .split('')
        .map((char, index) => {
            const displayChar = char === ' ' ? '&nbsp;' : char;
            return `<span class="letter" data-index="${index}">${displayChar}</span>`;
        })
        .join('');
    
    // Animar las letras con bounce escalonado usando Anime.js v4 syntax
    createTimeline({loop: false})
        .add('#celebration-text .letter', {
            translateY: [
                { value: -80, duration: 500 },
                { value: 0, duration: 500 }
            ],
            scale: [
                { value: 1.5, duration: 500 },
                { value: 1, duration: 500 }
            ],
            rotate: [
                { value: -15, duration: 250 },
                { value: 15, duration: 250 },
                { value: 0, duration: 500 }
            ],
            opacity: [
                { value: 0, duration: 0 },
                { value: 1, duration: 300 }
            ],
            delay: stagger(100, {start: 400}),
            ease: 'outElastic(1, .8)'
        });
}

// Inicializar el comportamiento del botón "No"
function initializeNoButton() {
    // Ya no detectamos mousemove, solo clicks
    noButton.addEventListener('click', handleNoClick);
}

// Manejar clicks en el botón "No"
function handleNoClick(e) {
    e.preventDefault();
    noClickCount++;
    
    // Mostrar mensaje dramático
    if (noClickCount <= dramaticMessages.length) {
        const message = dramaticMessages[noClickCount - 1];
        dramaticMessage.textContent = message;
        dramaticMessage.classList.add('show');
        
        // Ocultar mensaje después de 10 segundos
        setTimeout(() => {
            dramaticMessage.classList.remove('show');
        }, 10000);
    }
    
    // Calcular nuevos tamaños
    const noScale = Math.max(0.3, 1 - (noClickCount * 0.12)); // Se reduce hasta 30%
    const yesScale = Math.min(1.5, 1 + (noClickCount * 0.08)); // Crece hasta 150%
    
    // Aplicar transformaciones
    noButton.style.transform = `scale(${noScale})`;
    yesButton.style.transform = `scale(${yesScale})`;
    
    // Si el botón No es muy pequeño, hacerlo casi invisible
    if (noScale <= 0.4) {
        noButton.style.opacity = '0.3';
        noButton.style.cursor = 'default';
    }
    
    // Si llegó a 8 clicks, deshabilitar el botón No
    if (noClickCount >= 8) {
        noButton.disabled = true;
        noButton.style.opacity = '0';
        noButton.style.pointerEvents = 'none';
    }
}

// Event listener para el botón "Sí"
yesButton.addEventListener('click', () => {
    launchConfetti();
    // Esperar un poco antes de cambiar de pantalla para ver el confeti
    setTimeout(() => {
        showAnswerScreen();
    }, 1500);
});

// Event listener para el botón "Ready"
readyButton.addEventListener('click', () => {
    showAdventureScreen();
});

// Función específica para el confeti del botón Ready
function launchReadyConfetti() {
    // Paleta de colores basada en las flores: turquesa romántico
    const flowerColors = ["#a7ffee", "#23f0ff", "#6bf0ff", "#ffffff"];
    
    // Obtener la posición del botón Ready
    const buttonRect = readyButton.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    
    // Convertir a coordenadas relativas (0-1)
    const originX = buttonCenterX / window.innerWidth;
    const originY = buttonCenterY / window.innerHeight;
    
    // Explosión desde el botón
    confetti({
        particleCount: 150,
        angle: 90,
        spread: 360,
        origin: { x: originX, y: originY },
        colors: flowerColors,
        startVelocity: 50,
        gravity: 1,
        scalar: 1.3,
        ticks: 300,
        shapes: ["circle", "square"]
    });
    
    // Segunda ráfaga después de 150ms para efecto más dramático
    setTimeout(() => {
        confetti({
            particleCount: 100,
            angle: 90,
            spread: 270,
            origin: { x: originX, y: originY },
            colors: flowerColors,
            startVelocity: 40,
            gravity: 1,
            scalar: 1.1,
            ticks: 300,
            shapes: ["circle", "square"]
        });
    }, 150);
}

// Inicializar estrellas con tsParticles
async function initializeStars() {
    await loadBasic(tsParticles);
    
    await tsParticles.load({
        id: "tsparticles",
        options: {
            background: {
                color: "transparent"
            },
            fpsLimit: 60,
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ["#ffffff", "#ffb6c1", "#ffd4e5"]
                },
                shape: {
                    type: "circle"
                },
                opacity: {
                    value: 1,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 0.5,
                        opacity_min: 0.3,
                        sync: false
                    }
                },
                size: {
                    value: 2,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.5,
                        sync: false
                    }
                },
                move: {
                    enable: true,
                    speed: 0.5,
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: {
                        default: "out"
                    }
                }
            },
            interactivity: {
                detectsOn: "canvas",
                events: {
                    resize: true
                }
            },
            detectRetina: true
        }
    });
}

// Lanzar confeti
function launchConfetti() {
    // Paleta de colores basada en las flores: turquesa romántico
    const flowerColors = ["#a7ffee", "#23f0ff", "#6bf0ff", "#ffffff"];
    
    // Confeti desde la esquina inferior izquierda
    confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 1 },
        colors: flowerColors,
        startVelocity: 65,  // Mayor velocidad inicial
        gravity: 0.8,       // Menos gravedad para que suba más
        scalar: 1.2,        // Partículas un poco más grandes
        ticks: 300          // Duración más larga
    });
    
    // Confeti desde la esquina inferior derecha
    confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 1 },
        colors: flowerColors,
        startVelocity: 65,
        gravity: 0.8,
        scalar: 1.2,
        ticks: 300
    });
    
    // Ráfaga adicional después de 200ms
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 1 },
            colors: flowerColors,
            startVelocity: 65,
            gravity: 0.8,
            scalar: 1.2,
            ticks: 300
        });
        
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 1 },
            colors: flowerColors,
            startVelocity: 65,
            gravity: 0.8,
            scalar: 1.2,
            ticks: 300
        });
    }, 200);
}

// ============================================
// LÓGICA DEL LOADER - PANTALLA DE AVENTURA
// ============================================

// Mensajes que irán rotando cada 2 segundos
const loadingMessages = [
    "¿Estás lista para lo que se viene? uwu",
    "Ponte algo cómodo para ir a gusto sisi.",
    "Qué emociónnn. :3",
    "o(≧▽≦)o"
];

// URL de destino (Google Maps)
const destinationURL = "https://maps.app.goo.gl/2Xv9JPdvYVE72vmM8";

// Función para iniciar el loader cuando se muestra adventure screen
function startLoader() {
    const radius = 80;
    const circumference = 2 * Math.PI * radius; // 502.65
    
    let currentProgress = 0;
    let messageIndex = 0;
    const totalDuration = 8000; // 8 segundos
    const interval = 50; // Actualizar cada 50ms para animación suave
    const incrementPerInterval = (100 / (totalDuration / interval));
    const messageChangeInterval = 2000; // Cambiar mensaje cada 2 segundos
    
    // Inicializar el círculo
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;
    
    // Cambiar mensajes cada 2 segundos
    const messageTimer = setInterval(() => {
        if (messageIndex < loadingMessages.length - 1) {
            // Fade out
            loadingMessage.classList.add('fade');
            
            setTimeout(() => {
                messageIndex++;
                loadingMessage.textContent = loadingMessages[messageIndex];
                loadingMessage.classList.remove('fade');
            }, 500); // Duración del fade
        }
    }, messageChangeInterval);
    
    // Actualizar progreso
    const progressTimer = setInterval(() => {
        currentProgress += incrementPerInterval;
        
        if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(progressTimer);
            clearInterval(messageTimer);
            
            // Al llegar a 100%, esperar un momento y redirigir
            setTimeout(() => {
                // Fade out suave antes de redirigir
                adventureScreen.classList.add('fade-out');
                
                setTimeout(() => {
                    window.location.href = destinationURL;
                }, 500);
            }, 500);
        }
        
        // Actualizar porcentaje
        progressPercentage.textContent = Math.floor(currentProgress) + '%';
        
        // Actualizar círculo SVG
        const offset = circumference - (currentProgress / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
        
    }, interval);
}

// ============================================
// FIREFLY BACKGROUND - ADVENTURE SCREEN
// ============================================

async function initializeFirefly() {
    try {
        await loadBasic(tsParticles);
        
        // Crear efecto de luciérnagas con partículas básicas
        await tsParticles.load({
            id: "tsparticles-firefly",
            options: {
                background: {
                    color: "transparent"
                },
                fpsLimit: 60,
                particles: {
                    number: {
                        value: 40,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: ["#ffffff"]
                    },
                    shape: {
                        type: "circle"
                    },
                    opacity: {
                        value: 0.6,
                        random: true,
                        animation: {
                            enable: true,
                            speed: 0.5,
                            minimumValue: 0.1,
                            sync: false
                        }
                    },
                    size: {
                        value: 3,
                        random: { enable: true, minimumValue: 1 },
                        animation: {
                            enable: true,
                            speed: 2,
                            minimumValue: 1,
                            sync: false
                        }
                    },
                    move: {
                        enable: true,
                        speed: 0.8,
                        direction: "none",
                        random: true,
                        straight: false,
                        outModes: {
                            default: "bounce"
                        }
                    }
                },
                detectRetina: true
            }
        });
        
        console.log("Firefly particles initialized successfully");
    } catch (error) {
        console.error("Error initializing firefly:", error);
    }
}

// Función para mostrar la pantalla de aventura con loader
function showAdventureScreen() {
    // Transicionar directamente sin confeti
    announcementScreen.classList.remove('active');
    announcementScreen.classList.add('fade-out');
    
    setTimeout(() => {
        adventureScreen.classList.add('active');
        adventureScreen.classList.add('fade-in');
        
        // Inicializar firefly particles
        initializeFirefly();
        
        // Iniciar el loader después de que se muestre la pantalla
        setTimeout(() => {
            startLoader();
        }, 500);
    }, 500);
}