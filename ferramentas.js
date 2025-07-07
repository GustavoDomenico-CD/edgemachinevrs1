// robos.js

document.addEventListener('DOMContentLoaded', function() {
  // Seleciona todos os botões de perfil
  const profileTabs = document.querySelectorAll('.profile-tab');
  // Seleciona todos os cards de robôs
  const robotCards = document.querySelectorAll('.profile-card');

  // Função para alternar entre os perfis
  function switchProfile(profile) {
    // Remove a classe 'active' de todos os botões
    profileTabs.forEach(tab => {
      tab.classList.remove('active');
    });

    // Adiciona a classe 'active' apenas ao botão clicado
    const activeTab = document.querySelector(`.profile-tab[data-profile="${profile}"]`);
    if (activeTab) {
      activeTab.classList.add('active');
    }

    // Oculta todos os cards
    robotCards.forEach(card => {
      card.style.display = 'none';
    });

    // Mostra apenas o card correspondente ao perfil selecionado
    const activeCard = document.getElementById(`${profile}-card`);
    if (activeCard) {
      activeCard.style.display = 'block';
    }
  }

  // Adiciona event listeners para cada botão de perfil
  profileTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const profile = this.getAttribute('data-profile');
      switchProfile(profile);
    });
  });

  // Inicializa mostrando apenas o perfil conservador (ou outro padrão)
  switchProfile('conservador');
});