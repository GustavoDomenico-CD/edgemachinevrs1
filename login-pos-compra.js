document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.querySelector('.login-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simulação de login - em produção, você faria uma chamada AJAX para seu backend
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Validação básica
      if (email && password) {
        alert('Login realizado com sucesso! Redirecionando para o ebook...');
        // window.location.href = "ebook.html"; // Descomente e ajuste para sua página real do ebook
      } else {
        alert('Por favor, preencha todos os campos.');
      }
    });
  }
});