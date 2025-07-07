// Configuração do Sistema de Afiliados
const affiliateSystem = {
  // Dados de acesso válidos (pode ser substituído por verificação via API)
  validCredentials: {
    // Formato: código: senha
    '12121': '123456',
    'MACH1': '654321',
    'TRAD1': '112233'
  },

  // URL do painel de afiliados (substitua pela sua URL real)
  dashboardUrl: 'https://painel.edgemachine.com/afiliados',

  // Elementos do DOM
  elements: {
    loginForm: document.getElementById('affiliate-login'),
    codeInput: document.getElementById('affiliate-code'),
    passwordInput: document.getElementById('affiliate-password'),
    errorMessage: document.createElement('div'),
    successMessage: document.createElement('div')
  },

  // Inicialização do sistema
  init: function() {
    this.setupForm();
    this.createMessageElements();
    this.setupTabs();
  },

  // Configuração do formulário de login
  setupForm: function() {
    if (!this.elements.loginForm) return;

    this.elements.loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    // Formatação automática do código (uppercase e limite de 5 caracteres)
    this.elements.codeInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase().slice(0, 5);
    });

    // Limite de 6 caracteres para a senha
    this.elements.passwordInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.slice(0, 6);
    });
  },

  // Cria elementos para mensagens de feedback
  createMessageElements: function() {
    // Elemento de erro
    this.elements.errorMessage.className = 'affiliate-message error';
    this.elements.errorMessage.style.display = 'none';
    this.elements.loginForm.parentNode.insertBefore(this.elements.errorMessage, this.elements.loginForm);

    // Elemento de sucesso
    this.elements.successMessage.className = 'affiliate-message success';
    this.elements.successMessage.style.display = 'none';
    this.elements.loginForm.parentNode.insertBefore(this.elements.successMessage, this.elements.loginForm);
  },

  // Controle das abas
  setupTabs: function() {
    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', () => {
        // Remove classe active de todos os botões
        document.querySelectorAll('.tab-button').forEach(btn => {
          btn.classList.remove('active');
        });
        
        // Adiciona ao botão clicado
        button.classList.add('active');
        
        // Esconde todos os conteúdos
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
        
        // Mostra o conteúdo correspondente
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
  },

  // Manipulação do login
  handleLogin: function() {
    const code = this.elements.codeInput.value.trim();
    const password = this.elements.passwordInput.value.trim();

    // Validação básica
    if (code.length !== 5 || password.length !== 6) {
      this.showError('Por favor, insira um código de 5 caracteres e senha de 6 dígitos');
      return;
    }

    // Verifica as credenciais
    if (this.verifyCredentials(code, password)) {
      this.showSuccess('Acesso autorizado! Redirecionando...');
      setTimeout(() => {
        this.redirectToDashboard(code);
      }, 1500);
    } else {
      this.showError('Código ou senha incorretos. Por favor, tente novamente.');
    }
  },

  // Verificação das credenciais
  verifyCredentials: function(code, password) {
    // Em produção, substitua por uma verificação via API
    return this.validCredentials[code] === password;
    
    // Exemplo de como seria com uma API real:
    // return fetch('/api/affiliate/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ code, password })
    // })
    // .then(response => response.json())
    // .then(data => data.success)
    // .catch(() => false);
  },

  // Redirecionamento para o painel
  redirectToDashboard: function(code) {
    // Em produção, você pode adicionar parâmetros ou tokens de autenticação
    window.location.href = `${this.dashboardUrl}?affiliate=${encodeURIComponent(code)}`;
  },

  // Exibe mensagem de erro
  showError: function(message) {
    this.elements.successMessage.style.display = 'none';
    this.elements.errorMessage.textContent = message;
    this.elements.errorMessage.style.display = 'block';
    
    // Efeito visual de shake no formulário
    this.elements.loginForm.classList.add('shake');
    setTimeout(() => {
      this.elements.loginForm.classList.remove('shake');
    }, 500);
  },

  // Exibe mensagem de sucesso
  showSuccess: function(message) {
    this.elements.errorMessage.style.display = 'none';
    this.elements.successMessage.textContent = message;
    this.elements.successMessage.style.display = 'block';
  }
};

// Inicializa o sistema quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  affiliateSystem.init();
});