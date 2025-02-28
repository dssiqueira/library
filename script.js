document.addEventListener('DOMContentLoaded', function() {
    // Theme switcher
    const checkbox = document.getElementById('checkbox');
    if (checkbox) {
        const currentTheme = localStorage.getItem('theme');

        if (currentTheme) {
            document.documentElement.setAttribute('data-theme', currentTheme);
            if (currentTheme === 'dark') {
                checkbox.checked = true;
            }
        }

        checkbox.addEventListener('change', function() {
            if (this.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Modal Info
    const modal = document.getElementById('infoModal');
    const infoBtn = document.querySelector('.info-btn');
    const closeBtn = modal?.querySelector('.close-modal');

    if (modal && infoBtn && closeBtn) {
        infoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
        });

        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        window.addEventListener('click', function(e) {
            if (e.target == modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Modal Imagem
    const imageModal = document.getElementById('imageModal');
    const bookCover = document.querySelector('.book-cover img');

    if (imageModal && bookCover) {
        bookCover.style.cursor = 'pointer';
        
        bookCover.addEventListener('click', function() {
            imageModal.style.display = 'block';
        });

        // Fecha o modal ao clicar em qualquer lugar
        imageModal.addEventListener('click', function() {
            imageModal.style.display = 'none';
        });
    }

    // Modal Contribuição
    const contributeModal = document.getElementById('contributeModal');
    const contributeBtn = document.getElementById('contributeBtn');
    const closeContributeBtn = contributeModal?.querySelector('.close-modal');

    if (contributeModal && contributeBtn && closeContributeBtn) {
        contributeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            contributeModal.style.display = 'block';
        });

        closeContributeBtn.addEventListener('click', function() {
            contributeModal.style.display = 'none';
        });

        window.addEventListener('click', function(e) {
            if (e.target == contributeModal) {
                contributeModal.style.display = 'none';
            }
        });
    }

    // Modal Email
    const emailModal = document.getElementById('emailModal');
    const emailBtn = document.getElementById('emailBtn');
    const closeEmailBtn = emailModal?.querySelector('.close-modal');
    const copyBtn = emailModal?.querySelector('.copy-btn');
    const emailInput = emailModal?.querySelector('.email-input');

    if (emailModal && emailBtn && closeEmailBtn && copyBtn && emailInput) {
        emailBtn.addEventListener('click', function(e) {
            e.preventDefault();
            emailModal.style.display = 'block';
        });

        closeEmailBtn.addEventListener('click', function() {
            emailModal.style.display = 'none';
        });

        window.addEventListener('click', function(e) {
            if (e.target == emailModal) {
                emailModal.style.display = 'none';
            }
        });

        copyBtn.addEventListener('click', async function() {
            try {
                await navigator.clipboard.writeText(emailInput.value);
                copyBtn.classList.add('copied');
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copiar';
                }, 2000);
            } catch (err) {
                console.error('Falha ao copiar texto: ', err);
            }
        });
    }

    // Botão de ajuda no modal info
    const helpBtn = document.getElementById('helpBtn');
    const helpModal = document.getElementById('helpModal');
    const infoModal = document.getElementById('infoModal');
    
    if (helpBtn) {
        helpBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (infoModal) {
                infoModal.style.display = 'none';
            }
            
            if (helpModal) {
                helpModal.style.display = 'block';
            }
        });
    }

    // Fecha o modal ao clicar no X
    const closeHelpBtn = helpModal?.querySelector('.close-modal');
    
    if (closeHelpBtn) {
        closeHelpBtn.addEventListener('click', function() {
            helpModal.style.display = 'none';
        });
    }

    // Fecha o modal ao clicar fora
    window.addEventListener('click', function(e) {
        if (e.target == helpModal) {
            helpModal.style.display = 'none';
        }
    });

    // Validação do campo nome - apenas letras
    const nameInput = document.getElementById('name');
    if (nameInput) {
        nameInput.addEventListener('input', function(e) {
            let value = e.target.value;
            // Remove caracteres que não são letras, espaços ou acentos
            value = value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
            e.target.value = value;
        });
    }

    // Validação de email em tempo real
    const helpFormEmailInput = document.getElementById('email');
    const emailValidationMessage = document.querySelector('.email-validation-message');
    
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    if (helpFormEmailInput) {
        helpFormEmailInput.addEventListener('input', function(e) {
            const email = e.target.value;
            
            if (email.length > 0) {
                if (validateEmail(email)) {
                    helpFormEmailInput.classList.remove('invalid');
                    helpFormEmailInput.classList.add('valid');
                    emailValidationMessage.classList.remove('error');
                } else {
                    helpFormEmailInput.classList.remove('valid');
                    helpFormEmailInput.classList.add('invalid');
                    emailValidationMessage.classList.add('error');
                }
            } else {
                helpFormEmailInput.classList.remove('valid', 'invalid');
                emailValidationMessage.classList.remove('error');
            }
        });
    }

    // Contador de caracteres
    const details = document.getElementById('details');
    const charCount = document.getElementById('charCount');
    
    if (details && charCount) {
        details.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }

    // Envio do formulário
    const helpForm = document.getElementById('helpForm');
    const successMessage = document.getElementById('successMessage');
    
    if (helpForm) {
        helpForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(this);

            try {
                const response = await fetch('send_email.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    // Esconde o formulário
                    helpForm.style.display = 'none';
                    // Mostra mensagem de sucesso
                    successMessage.style.display = 'block';
                    
                    // Dispara o confetti
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });

                    // Limpa o formulário
                    helpForm.reset();
                    
                    // Fecha o modal após 3 segundos
                    setTimeout(() => {
                        helpModal.style.display = 'none';
                        // Reseta o estado do modal para próximo uso
                        setTimeout(() => {
                            helpForm.style.display = 'block';
                            successMessage.style.display = 'none';
                        }, 500);
                    }, 3000);
                } else {
                    alert(result.message || 'Erro ao enviar mensagem. Tente novamente.');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao enviar mensagem. Tente novamente.');
            }
        });
    }

    // Book hover effect
    const bookCoverDiv = document.querySelector('.book-cover');
    if (bookCoverDiv) {
        bookCoverDiv.addEventListener('mouseover', () => {
            bookCoverDiv.style.transform = 'scale(1.05)';
        });
        
        bookCoverDiv.addEventListener('mouseout', () => {
            bookCoverDiv.style.transform = 'scale(1)';
        });
    }
});
