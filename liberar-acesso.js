document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.querySelector('.login-form');
  
  // Credenciais válidas (substitua por validação backend em produção)
  const validCredentials = [
    { codigo: "EM123", password: "edge12" },
    { codigo: "EM456", password: "trade34" },
    { codigo: "EM789", password: "book56" }
  ];

  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const codigo = document.getElementById('codigo').value.trim();
      const password = document.getElementById('password').value.trim();
      
      // Validação básica
      if (!codigo || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
      }

      // Verifica credenciais
      const isValid = validCredentials.some(cred => 
        cred.codigo === codigo && cred.password === password
      );

      if (isValid) {
        // Armazena sessão simples (substitua por método seguro em produção)
        sessionStorage.setItem('auth', 'true');
        
        // Redireciona para o capítulo 1
        window.location.href = "painelebook.html";
      } else {
        alert('Credenciais inválidas. Verifique seu código e senha.');
      }
    });
  }

  // Verifica autenticação ao carregar a página (opcional)
  if (window.location.pathname.includes('painelebook.html')) {
    if (sessionStorage.getItem('auth') !== 'true') {
      window.location.href = "login-pos-compra.html";
    }
  }
});