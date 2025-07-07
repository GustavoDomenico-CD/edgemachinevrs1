/**
 * Sistema Principal - EDGE MACHINE v2.0
 * 
 * Melhorias implementadas:
 * 1. Arquitetura modular e melhor organização do código
 * 2. Gerenciamento de estado mais robusto
 * 3. Validação de formulários aprimorada
 * 4. Sistema de notificações mais completo
 * 5. Melhor tratamento de erros
 * 6. Suporte a PWA (Progressive Web App)
 * 7. Pré-carregamento de recursos críticos
 * 8. Animações otimizadas
 * 9. Controle de navegação entre partes do capítulo
 */

class EdgeMachineApp {
  constructor() {
    this.currentTheme = null;
    this.isMobileMenuOpen = false;
    this.authSystem = window.AuthSystem || null;
    this.initialized = false;
  }

  // ==================== INICIALIZAÇÃO ====================
  init() {
    if (this.initialized) return;
    
    try {
      // Configurações iniciais
      this.setupTheme();
      this.setupMobileMenu();
      this.setupForms();
      this.setupEmailResend();
      this.setupGlobalEventListeners();
      this.checkServiceWorkerSupport();
      this.setupChapterNavigation();
      
      // Pré-carrega recursos importantes
      this.preloadCriticalResources();
      
      this.initialized = true;
      console.log('EDGE MACHINE App inicializado com sucesso');
    } catch (error) {
      console.error('Erro na inicialização do app:', error);
    }
  }

  // ==================== NAVEGAÇÃO ENTRE PARTES DO CAPÍTULO ====================
  setupChapterNavigation() {
    const partToggles = document.querySelectorAll('.part-toggle');
    
    if (partToggles.length === 0) return;
    
    partToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const part = toggle.getAttribute('data-part');
        
        // Remove active class from all toggles and parts
        document.querySelectorAll('.part-toggle').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.chapter-text').forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked toggle and corresponding part
        toggle.classList.add('active');
        document.querySelector(`.part-${part}`).classList.add('active');
        
        // Rola suavemente para o topo da parte ativa
        document.querySelector(`.part-${part}`).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });
    
    // Ativa a primeira parte por padrão
    if (partToggles.length > 0) {
      partToggles[0].click();
    }
  }

  // ==================== GERENCIAMENTO DE TEMA ====================
  setupTheme() {
    this.htmlElement = document.documentElement;
    this.themeToggle = document.getElementById('theme-toggle');
    
    // Aplica o tema inicial
    this.currentTheme = this.getPreferredTheme();
    this.applyTheme(this.currentTheme);
    
    // Configura o observador de preferência do sistema
    this.setupThemeObserver();
  }

  getPreferredTheme() {
    const storedTheme = localStorage.getItem('edge-machine-theme');
    if (storedTheme) return storedTheme;
    
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  applyTheme(theme) {
    this.htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('edge-machine-theme', theme);
    this.updateThemeIcon(theme);
    
    // Dispara evento personalizado para outros scripts
    document.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: theme 
    }));
  }

  updateThemeIcon(theme) {
    if (!this.themeToggle) return;
    
    const icon = this.themeToggle.querySelector('i');
    if (!icon) return;
    
    icon.classList.toggle('fa-sun', theme === 'light');
    icon.classList.toggle('fa-moon', theme === 'dark');
    this.themeToggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Alternar para tema claro' : 'Alternar para tema escuro'
    );
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(this.currentTheme);
  }

  setupThemeObserver() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    
    mediaQuery.addEventListener('change', e => {
      if (!localStorage.getItem('edge-machine-theme')) {
        const newTheme = e.matches ? 'light' : 'dark';
        this.applyTheme(newTheme);
      }
    });
  }

  // ==================== MENU MOBILE ====================
  setupMobileMenu() {
    this.mobileMenuButton = document.querySelector('.mobile-menu-button');
    this.mobileMenu = document.querySelector('.mobile-menu');
    
    if (!this.mobileMenuButton || !this.mobileMenu) return;
    
    // Fecha o menu ao clicar em links
    document.querySelectorAll('.mobile-menu a').forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    this.mobileMenuButton.setAttribute('aria-expanded', this.isMobileMenuOpen);
    this.mobileMenu.classList.toggle('active', this.isMobileMenuOpen);
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
    
    // Anima o ícone do hambúrguer
    if (this.isMobileMenuOpen) {
      this.mobileMenuButton.classList.add('active');
    } else {
      this.mobileMenuButton.classList.remove('active');
    }
  }

  closeMobileMenu() {
    if (!this.isMobileMenuOpen) return;
    
    this.isMobileMenuOpen = false;
    this.mobileMenuButton.setAttribute('aria-expanded', 'false');
    this.mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
    this.mobileMenuButton.classList.remove('active');
  }

  // ==================== FORMULÁRIOS ====================
  setupForms() {
    this.setupForm('cadastro-form', this.handleCadastroSubmit.bind(this));
    this.setupForm('login-form', this.handleLoginSubmit.bind(this));
    this.setupForm('recovery-form', this.handleRecoverySubmit.bind(this));
    this.setupForm('userForm', this.handleProfileSubmit.bind(this));
    this.setupContactForm();
  }

  setupForm(formId, handler) {
    const form = document.getElementById(formId);
    if (form) {
      form.addEventListener('submit', handler);
      
      // Adiciona validação em tempo real
      if (formId === 'cadastro-form') {
        this.setupPasswordValidation(form);
      }
    }
  }

  setupPasswordValidation(form) {
    const passwordInput = form.querySelector('#senha');
    const confirmInput = form.querySelector('#confirmar-senha');
    
    if (passwordInput && confirmInput) {
      passwordInput.addEventListener('input', () => this.validatePasswordStrength(passwordInput));
      confirmInput.addEventListener('input', () => this.validatePasswordMatch(passwordInput, confirmInput));
    }
  }

  validatePasswordStrength(input) {
    const value = input.value;
    const feedback = document.createElement('div');
    feedback.className = 'password-feedback';
    
    // Remove feedback anterior
    const existingFeedback = input.parentNode.querySelector('.password-feedback');
    if (existingFeedback) existingFeedback.remove();
    
    if (value.length === 0) return;
    
    const validation = this.authSystem 
      ? this.authSystem.validatePassword(value) 
      : this.basicPasswordValidation(value);
    
    if (!validation.isValid) {
      feedback.textContent = validation.message;
      feedback.style.color = 'var(--error-color)';
      input.parentNode.appendChild(feedback);
      input.setCustomValidity(validation.message);
    } else {
      feedback.textContent = 'Senha forte ✓';
      feedback.style.color = 'var(--success-color)';
      input.parentNode.appendChild(feedback);
      input.setCustomValidity('');
    }
  }

  basicPasswordValidation(password) {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return {
      isValid: hasMinLength && hasUpperCase && hasNumber,
      message: 'A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula e um número'
    };
  }

  validatePasswordMatch(passwordInput, confirmInput) {
    if (passwordInput.value !== confirmInput.value) {
      confirmInput.setCustomValidity('As senhas não coincidem');
    } else {
      confirmInput.setCustomValidity('');
    }
  }

  setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      
      try {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        // Simula envio do formulário
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        this.showAlert('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        contactForm.reset();
      } catch (error) {
        this.showAlert('Erro ao enviar mensagem. Tente novamente.', 'error');
        console.error('Contact form error:', error);
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
      }
    });
  }

  async handleCadastroSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    try {
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando conta...';

      const userData = {
        name: form.querySelector('#nome').value,
        email: form.querySelector('#email').value,
        phone: form.querySelector('#telefone').value,
        password: form.querySelector('#senha').value
      };

      // Usa AuthSystem se disponível, caso contrário usa fallback
      const registerResponse = this.authSystem 
        ? await this.authSystem.registerUser(userData)
        : await this.mockRegister(userData);
      
      if (registerResponse.success) {
        localStorage.setItem('registeredEmail', userData.email);
        window.location.href = registerResponse.redirectTo || 'aguardando-confirmacao.html';
      } else {
        throw new Error(registerResponse.message || 'Erro no cadastro');
      }
    } catch (error) {
      this.showAlert(error.message || 'Erro ao cadastrar. Tente novamente.', 'error');
      console.error('Cadastro error:', error);
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
    }
  }

  async mockRegister(userData) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          redirectTo: 'aguardando-confirmacao.html'
        });
      }, 1500);
    });
  }

  async handleLoginSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    try {
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';

      const formData = {
        email: form.querySelector('#email').value,
        password: form.querySelector('#senha').value,
        remember: form.querySelector('#remember')?.checked
      };

      const response = this.authSystem
        ? await this.authSystem.loginUser(formData)
        : await this.mockLogin(formData);
      
      if (response.success) {
        if (this.authSystem) {
          this.authSystem.login(response.user, response.token);
        }
        
        const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
        window.location.href = redirectUrl || 'usuario.html';
      } else {
        throw new Error(response.message || 'E-mail ou senha incorretos');
      }
    } catch (error) {
      this.showAlert(error.message, 'error');
      console.error('Login error:', error);
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
    }
  }

  async mockLogin(formData) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          token: 'mock-jwt-token',
          user: {
            name: formData.email.split('@')[0],
            email: formData.email,
            verified: Math.random() > 0.5
          }
        });
      }, 1500);
    });
  }

  async handleRecoverySubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    try {
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

      const email = form.querySelector('#email').value;
      
      const response = this.authSystem
        ? await this.authSystem.recoverPassword(email)
        : await this.mockRecovery(email);
      
      if (response.success) {
        this.showAlert('E-mail de recuperação enviado! Verifique sua caixa de entrada.', 'success');
        form.reset();
      } else {
        throw new Error(response.message || 'Erro ao enviar e-mail');
      }
    } catch (error) {
      this.showAlert(error.message, 'error');
      console.error('Recovery error:', error);
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
    }
  }

  async mockRecovery(email) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1500);
    });
  }

  async handleProfileSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    try {
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';

      const formData = {
        name: form.querySelector('#fullname').value,
        email: form.querySelector('#email').value,
        phone: form.querySelector('#phone').value
      };

      const currentPassword = form.querySelector('#currentPassword')?.value;
      const newPassword = form.querySelector('#newPassword')?.value;
      
      if (currentPassword && newPassword) {
        formData.currentPassword = currentPassword;
        formData.newPassword = newPassword;
        
        const validation = this.authSystem 
          ? this.authSystem.validatePassword(newPassword)
          : this.basicPasswordValidation(newPassword);
        
        if (!validation.isValid) {
          throw new Error(validation.message);
        }
      }

      const response = this.authSystem
        ? await this.authSystem.updateProfile(formData)
        : await this.mockProfileUpdate(formData);
      
      if (response.success) {
        this.showAlert('Perfil atualizado com sucesso!', 'success');
        
        // Atualiza dados locais se AuthSystem não estiver disponível
        if (!this.authSystem) {
          const userData = JSON.parse(localStorage.getItem('userData') || {});
          Object.assign(userData, formData);
          localStorage.setItem('userData', JSON.stringify(userData));
        }
      } else {
        throw new Error(response.message || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      this.showAlert(error.message, 'error');
      console.error('Profile error:', error);
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
    }
  }

  async mockProfileUpdate(formData) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1500);
    });
  }

  // ==================== REENVIO DE E-MAIL ====================
  setupEmailResend() {
    const resendBtn = document.getElementById('resend-btn');
    if (!resendBtn) return;

    resendBtn.addEventListener('click', async () => {
      const email = localStorage.getItem('registeredEmail');
      
      if (!email) {
        this.showAlert('Nenhum e-mail registrado para reenvio', 'error');
        return;
      }

      const originalText = resendBtn.innerHTML;
      
      try {
        resendBtn.disabled = true;
        resendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        const success = this.authSystem
          ? await this.authSystem.resendVerificationEmail(email)
          : await this.mockResendEmail(email);
        
        if (success) {
          this.showAlert('E-mail reenviado com sucesso!', 'success');
          this.startCountdown(120, resendBtn);
        } else {
          throw new Error('Falha no reenvio');
        }
      } catch (error) {
        this.showAlert(error.message, 'error');
      } finally {
        resendBtn.disabled = false;
        resendBtn.innerHTML = originalText;
      }
    });

    if (resendBtn && resendBtn.disabled) {
      this.startCountdown(120, resendBtn);
    }
  }

  async mockResendEmail(email) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 1500);
    });
  }

  startCountdown(seconds, button) {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;

    let remaining = seconds;
    
    const interval = setInterval(() => {
      remaining--;
      countdownElement.textContent = `(${remaining})`;
      
      if (remaining <= 0) {
        clearInterval(interval);
        if (button) button.disabled = false;
        countdownElement.textContent = '';
      }
    }, 1000);
  }

  // ==================== NOTIFICAÇÕES ====================
  showAlert(message, type = 'success') {
    // Remove alertas existentes
    const existingAlerts = document.querySelectorAll('.edge-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `edge-alert edge-alert-${type}`;
    
    const icon = type === 'success' 
      ? '<i class="fas fa-check-circle"></i>' 
      : '<i class="fas fa-exclamation-circle"></i>';
    
    alertDiv.innerHTML = `${icon} <span>${message}</span>`;
    
    document.body.appendChild(alertDiv);
    
    // Mostra o alerta
    setTimeout(() => {
      alertDiv.classList.add('show');
    }, 10);
    
    // Remove após 5 segundos
    setTimeout(() => {
      alertDiv.classList.remove('show');
      setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
  }

  // ==================== PWA E PERFORMANCE ====================
  checkServiceWorkerSupport() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          registration => {
            console.log('ServiceWorker registrado com sucesso:', registration.scope);
          },
          err => {
            console.log('Falha ao registrar ServiceWorker:', err);
          }
        );
      });
    }
  }

  preloadCriticalResources() {
    const resources = [
      'logohorizontal.png',
      'assets/performance-chart.png',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = resource.endsWith('.css') ? 'style' : 'image';
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  // ==================== EVENTOS GLOBAIS ====================
  setupGlobalEventListeners() {
    // Tema
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    // Menu mobile
    if (this.mobileMenuButton) {
      this.mobileMenuButton.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    // Fecha menu ao clicar fora
    document.addEventListener('click', (e) => {
      if (this.isMobileMenuOpen && 
          !this.mobileMenu.contains(e.target) && 
          !this.mobileMenuButton.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
    
    // Fecha menu ao pressionar ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  // ==================== INJEÇÃO DE ESTILOS ====================
  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Alertas */
      .edge-alert {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 6px;
        color: white;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease-out;
        max-width: 90%;
        width: 320px;
      }
      
      .edge-alert.show {
        opacity: 1;
        transform: translateX(0);
      }
      
      .edge-alert-success {
        background-color: var(--success-color, #28a745);
      }
      
      .edge-alert-error {
        background-color: var(--error-color, #dc3545);
      }
      
      /* Menu mobile */
      .mobile-menu-button.active i {
        transform: rotate(90deg);
      }
      
      .mobile-menu-button i {
        transition: transform 0.3s ease;
      }
      
      /* Validação de senha */
      .password-feedback {
        font-size: 0.8rem;
        margin-top: 5px;
      }
      
      /* Contador */
      #countdown {
        display: inline-block;
        margin-left: 5px;
      }
      
      /* Formulários */
      button[disabled] {
        opacity: 0.7;
        cursor: not-allowed;
      }
      
      /* Transições de página */
      body {
        view-transition-name: root;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @media (prefers-reduced-motion: no-preference) {
        html {
          animation: fadeIn 0.5s ease-out;
        }
      }

      /* Navegação entre partes do capítulo */
      .part-navigation {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin: 40px 0;
      }
      
      .part-toggle {
        background-color: var(--bg-secondary);
        color: var(--accent);
        border: 2px solid var(--accent);
        padding: 10px 20px;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-weight: 600;
        transition: var(--transition);
      }
      
      .part-toggle:hover {
        background-color: var(--accent);
        color: var(--black);
      }
      
      .part-toggle.active {
        background-color: var(--accent);
        color: var(--black);
      }
    `;
    document.head.appendChild(style);
  }
}

// Inicializa o app quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  const app = new EdgeMachineApp();
  app.injectStyles();
  app.init();
  
  // Expõe o app globalmente para acesso via console se necessário
  window.EdgeMachineApp = app;
});