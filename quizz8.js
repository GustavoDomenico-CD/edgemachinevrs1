    document.addEventListener('DOMContentLoaded', function() {
      // Configurações
      const PASSING_SCORE = 60; // 60% para aprovação
      const TOTAL_QUESTIONS = 15; // Total de questões
      
      // Elementos do DOM
      const modal = document.getElementById('result-modal');
      const closeModal = document.querySelector('.close-modal');
      const resultTitle = document.getElementById('result-title');
      const resultMessage = document.getElementById('result-message');
      const resultScore = document.getElementById('result-score');
      const resultActions = document.getElementById('result-actions');
      const quizForm = document.getElementById('quiz-form');
      
      // Respostas corretas
      const correctAnswers = {
        q1: "false", q2: "C", q3: "A", q4: "B", q5: "true",
        q6: "C", q7: "B", q8: "B", q9: "C", q10: "B",
        q11: "C", q12: "false", q13: "C", q14: "B", q15: "C"
      };
      
      // Gerenciamento do Modal
      function openModal() {
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
      }
      
      function closeModalHandler() {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }
      
      // Event Listeners para o modal
      closeModal.addEventListener('click', closeModalHandler);
      window.addEventListener('click', function(event) {
        if (event.target === modal) {
          closeModalHandler();
        }
      });
      
      // Função para resetar o quiz
      function resetQuiz() {
        quizForm.reset();
        closeModalHandler();
        scrollToQuizTop();
      }
      
      // Rolagem suave para o topo do quiz
      function scrollToQuizTop() {
        window.scrollTo({
          top: document.querySelector('.quiz-content').offsetTop - 20,
          behavior: 'smooth'
        });
      }
      
      // Validar respostas e calcular pontuação
      function calculateScore() {
        let score = 0;
        const userAnswers = {};
        
        for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
          const questionName = "q" + i;
          const selectedOption = document.querySelector(`input[name="${questionName}"]:checked`);
          
          if (selectedOption) {
            userAnswers[questionName] = selectedOption.value;
            if (selectedOption.value === correctAnswers[questionName]) {
              score++;
            }
          }
        }
        
        return {
          score: score,
          percentage: Math.round((score / TOTAL_QUESTIONS) * 100),
          answers: userAnswers
        };
      }
      
      // Exibir resultados no modal
      function displayResults(score, percentage) {
        resultScore.textContent = `Você acertou ${score} de ${TOTAL_QUESTIONS} questões (${percentage}%).`;
        
        if (percentage >= PASSING_SCORE) {
          resultTitle.textContent = "Parabéns! 🎉";
          resultMessage.textContent = "Você demonstrou um bom entendimento sobre uso de contas demo e simulação!";
          resultActions.innerHTML = `
            <a href="proximo-capitulo.html" class="btn-primary">Próximo Capítulo <i class="fas fa-arrow-right"></i></a>
            <button id="retry-quiz" class="btn-outline">Refazer Quiz <i class="fas fa-sync-alt"></i></button>
          `;
        } else {
          resultTitle.textContent = "Quase lá! 📚";
          resultMessage.textContent = `Você precisa acertar pelo menos ${Math.ceil(TOTAL_QUESTIONS * PASSING_SCORE/100)} questões para avançar. Recomendamos revisar o material.`;
          resultActions.innerHTML = `
            <a href="capitulo-demo.html" class="btn-primary">Revisar Capítulo <i class="fas fa-book"></i></a>
            <button id="retry-quiz" class="btn-outline">Refazer Quiz <i class="fas fa-sync-alt"></i></button>
          `;
        }
        
        // Adiciona evento ao botão de refazer
        document.getElementById('retry-quiz')?.addEventListener('click', resetQuiz);
      }
      
      // Manipulador de envio do formulário
      quizForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const { score, percentage } = calculateScore();
        displayResults(score, percentage);
        openModal();
      });
      
      // Menu mobile
      const mobileMenuButton = document.querySelector('.mobile-menu-button');
      const mobileMenu = document.querySelector('.mobile-menu');
      
      if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
          const isExpanded = this.getAttribute('aria-expanded') === 'true';
          this.setAttribute('aria-expanded', !isExpanded);
          mobileMenu.style.display = isExpanded ? 'none' : 'block';
        });
        
        // Fechar menu ao clicar em links
        document.querySelectorAll('.mobile-menu a').forEach(link => {
          link.addEventListener('click', () => {
            mobileMenu.style.display = 'none';
            mobileMenuButton.setAttribute('aria-expanded', 'false');
          });
        });
      }
    });