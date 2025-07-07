document.addEventListener('DOMContentLoaded', function() {
    // Configurações iniciais
    const config = {
        countdownDuration: 3600, // 1 hora em segundos
        animationDuration: 300, // Duração das animações em ms
        localStorageKey: 'visitedEdgeMachine' // Chave para armazenamento local
    };

    // 1. Gerenciamento do FAQ Accordion
    function setupFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item-v2');
        
        faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question-v2');
            const answer = item.querySelector('.faq-answer-v2');
            
            // Adiciona ícone se não existir
            if (!question.querySelector('i')) {
                const icon = document.createElement('i');
                icon.className = 'fas fa-plus';
                question.insertBefore(icon, question.firstChild);
            }
            
            // Configura estado inicial (primeiro item aberto)
            if (index === 0) {
                item.classList.add('active');
            }
            
            // Adiciona evento de clique
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Fecha todos os itens
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('active');
                });
                
                // Abre o item clicado se não estava ativo
                if (!isActive) {
                    item.classList.add('active');
                    
                    // Scroll suave para a pergunta
                    setTimeout(() => {
                        question.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 10);
                }
            });
        });
    }

    // 2. Contador Regressivo
    function setupCountdownTimer() {
        const countdownElement = document.getElementById('countdown-timer');
        if (!countdownElement) return;
        
        let remainingSeconds = config.countdownDuration;
        
        function updateTimerDisplay() {
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;
            countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Efeito visual quando faltam menos de 5 minutos
            if (remainingSeconds <= 300) {
                countdownElement.style.color = '#ff4757';
                countdownElement.style.fontWeight = 'bold';
                
                // Piscar nos últimos 30 segundos
                if (remainingSeconds <= 30) {
                    countdownElement.style.animation = 'pulse 0.5s infinite alternate';
                }
            }
        }
        
        updateTimerDisplay();
        
        const timer = setInterval(() => {
            remainingSeconds--;
            updateTimerDisplay();
            
            if (remainingSeconds <= 0) {
                clearInterval(timer);
                countdownElement.textContent = "Oferta expirada!";
                
                // Desativa os botões de compra
                document.querySelectorAll('.cta-button').forEach(button => {
                    button.style.opacity = '0.5';
                    button.style.cursor = 'not-allowed';
                    button.onclick = function(e) {
                        e.preventDefault();
                        alert('Esta oferta expirou. Entre em contato para verificar disponibilidade.');
                    };
                });
            }
        }, 1000);
    }

    // 3. Rastreamento de Conversão
    function setupConversionTracking() {
        const ctaButtons = document.querySelectorAll('.cta-button');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Verifica se é um link real ou âncora
                if (this.getAttribute('href') === '#oferta') {
                    e.preventDefault();
                    document.getElementById('oferta').scrollIntoView({ behavior: 'smooth' });
                    return;
                }
                
                // Simulação de rastreamento (substitua pelos códigos reais)
                console.log('CTA button clicked - tracking conversion');
                
                // Facebook Pixel (exemplo)
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Purchase', { currency: 'BRL', value: 97.00 });
                }
                
                // Google Analytics (exemplo)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'conversion', {
                        'send_to': 'AW-123456789/AbCdEfGhIjKl',
                        'value': 97.00,
                        'currency': 'BRL'
                    });
                }
                
                // Hotmart (exemplo)
                if (typeof _hp !== 'undefined') {
                    _hp.push(['trackEvent', 'Purchase']);
                }
            });
        });
    }

    // 4. Efeitos Visuais e Interações
    function setupVisualEffects() {
        // Efeito de hover nos cards
        const cards = document.querySelectorAll('.benefit-card-v2, .testimonial-card-v2, .bonus-card-v2');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
                this.style.transition = 'all 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });
        
        // Scroll suave para links internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Animação de exibição ao rolar a página
        const animateOnScroll = function() {
            const elements = document.querySelectorAll('.benefit-card-v2, .testimonial-card-v2, .bonus-card-v2, .section-title');
            
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.2;
                
                if (elementPosition < screenPosition) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };
        
        // Configura estado inicial para animação
        const animatedElements = document.querySelectorAll('.benefit-card-v2, .testimonial-card-v2, .bonus-card-v2, .section-title');
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.5s ease-out';
        });
        
        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll(); // Executa uma vez ao carregar
    }

    // 5. Persistência de Visitante
    function setupVisitorPersistence() {
        if (!localStorage.getItem(config.localStorageKey)) {
            // Primeira visita - pode mostrar um popup especial ou oferta
            localStorage.setItem(config.localStorageKey, 'true');
            
            // Exemplo: mostra um toast de boas-vindas
            const welcomeToast = document.createElement('div');
            welcomeToast.className = 'welcome-toast';
            welcomeToast.innerHTML = `
                <div style="position: fixed; bottom: 20px; left: 20px; background: var(--accent); color: white; padding: 15px; border-radius: 5px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; display: flex; align-items: center;">
                    <i class="fas fa-gift" style="margin-right: 10px;"></i>
                    <span>Bem-vindo! Use o código BEMVINDO10 para 10% de desconto extra!</span>
                    <button onclick="this.parentElement.remove()" style="margin-left: 15px; background: none; border: none; color: white; cursor: pointer;">×</button>
                </div>
            `;
            document.body.appendChild(welcomeToast);
            
            // Remove após 5 segundos
            setTimeout(() => {
                welcomeToast.remove();
            }, 5000);
        }
    }

    // 6. Verificação de Dispositivo
    function checkDeviceType() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            document.body.classList.add('mobile-device');
            
            // Ajustes específicos para mobile
            const heroSection = document.querySelector('.hero-v2');
            if (heroSection) {
                heroSection.style.flexDirection = 'column-reverse';
            }
        }
    }

    // Inicialização de todas as funções
    function init() {
        setupFAQAccordion();
        setupCountdownTimer();
        setupConversionTracking();
        setupVisualEffects();
        setupVisitorPersistence();
        checkDeviceType();
    }

    // Inicia tudo
    init();
});

// Adiciona animação de pulse para o CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        from { opacity: 1; }
        to { opacity: 0.7; }
    }
`;
document.head.appendChild(style);