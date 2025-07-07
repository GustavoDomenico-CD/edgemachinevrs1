/**
 * Script específico para cadastro.html - EDGE MACHINE
 * 
 * Responsabilidades:
 * 1. Gerenciar o formulário de cadastro
 * 2. Validar os dados antes do envio
 * 3. Integrar com o AuthSystem para registro
 * 4. Redirecionar para a página de confirmação
 * 5. Lidar com feedback visual para o usuário
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const cadastroForm = document.getElementById('cadastro-form');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const senhaInput = document.getElementById('senha');
    const confirmarSenhaInput = document.getElementById('confirmar-senha');
    const termosCheckbox = document.getElementById('termos');
    const newsletterCheckbox = document.getElementById('newsletter');
    const submitButton = cadastroForm.querySelector('button[type="submit"]');

    // Toggle para mostrar/ocultar senha
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    });

    // Máscara para telefone
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            
            if (value.length > 0) {
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                if (value.length > 10) {
                    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
                } else {
                    value = value.replace(/(\d)(\d{3})$/, '$1-$2');
                }
            }
            
            e.target.value = value;
        });
    }

    // Validação em tempo real da senha
    if (senhaInput) {
        senhaInput.addEventListener('input', function() {
            const password = this.value;
            const strengthMeter = document.getElementById('password-strength');
            const strengthText = document.getElementById('strength-text');
            
            if (password.length === 0) {
                strengthMeter.style.width = '0%';
                strengthText.textContent = '';
                return;
            }

            let strength = 0;
            if (password.length >= 8) strength += 25;
            if (/[A-Z]/.test(password)) strength += 25;
            if (/\d/.test(password)) strength += 25;
            if (/[^A-Za-z0-9]/.test(password)) strength += 25;

            strengthMeter.style.width = `${strength}%`;
            strengthMeter.style.backgroundColor = 
                strength < 50 ? '#f44336' : strength < 75 ? '#ff9800' : '#4CAF50';
            
            strengthText.textContent = 
                strength < 50 ? 'fraca' : strength < 75 ? 'média' : 'forte';
        });
    }

    // Submissão do formulário
    cadastroForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validações básicas
        if (!termosCheckbox.checked) {
            showAlert('Você deve aceitar os Termos de Serviço e Política de Privacidade', 'error');
            return;
        }

        if (senhaInput.value !== confirmarSenhaInput.value) {
            showAlert('As senhas não coincidem', 'error');
            return;
        }

        const passwordValidation = window.AuthSystem.validatePassword(senhaInput.value);
        if (!passwordValidation.isValid) {
            showAlert('A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula e um número', 'error');
            return;
        }

        try {
            // Mostrar estado de carregamento
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando conta...';

            // Preparar dados do usuário
            const userData = {
                name: nomeInput.value.trim(),
                email: emailInput.value.trim(),
                phone: telefoneInput.value.replace(/\D/g, ''),
                password: senhaInput.value,
                newsletter: newsletterCheckbox.checked
            };

            // Registrar usuário via AuthSystem
            const registerResponse = await window.AuthSystem.registerUser(userData);
            
            if (registerResponse.success) {
                // Redirecionar para página de confirmação
                window.location.href = registerResponse.redirectTo || 'aguardando-confirmacao.html';
            } else {
                throw new Error(registerResponse.message || 'Erro no cadastro');
            }
        } catch (error) {
            console.error('Erro no cadastro:', error);
            showAlert(error.message || 'Erro ao cadastrar. Por favor, tente novamente.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Criar Conta <i class="fas fa-user-plus"></i>';
        }
    });

    // Função para mostrar alertas
    function showAlert(message, type = 'success') {
        // Remove alertas existentes
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) existingAlert.remove();

        // Cria novo alerta
        const alertDiv = document.createElement('div');
        alertDiv.className = `custom-alert alert-${type}`;
        alertDiv.innerHTML = `
            <div class="alert-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Adiciona ao corpo do documento
        document.body.appendChild(alertDiv);

        // Animação de entrada
        setTimeout(() => {
            alertDiv.classList.add('show');
        }, 10);

        // Remove após 5 segundos
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => {
                alertDiv.remove();
            }, 300);
        }, 5000);
    }

    // Estilos para os alertas
    const alertStyles = document.createElement('style');
    alertStyles.textContent = `
        .custom-alert {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 4px;
            background-color: #2A2A2A;
            color: #E0E0E0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            border-left: 4px solid;
        }
        
        .custom-alert.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .alert-success {
            border-left-color: #4CAF50;
        }
        
        .alert-error {
            border-left-color: #f44336;
        }
        
        .alert-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .alert-content i {
            font-size: 1.2rem;
        }
        
        .alert-success .alert-content i {
            color: #4CAF50;
        }
        
        .alert-error .alert-content i {
            color: #f44336;
        }
    `;
    document.head.appendChild(alertStyles);
});