const utils = {
    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },

    sendEmailToWebhook(email, pdfFileName = null) {
        return new Promise((resolve, reject) => {
            console.log('Iniciando envio do email:', email);
            
            const now = new Date();
            const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
            
            // Determine handbook name based on PDF filename
            let handbookName = 'Handbook de Desenvolvimento de Software';
            
            if (pdfFileName) {
                if (pdfFileName.includes('Bastidores')) {
                    handbookName = 'Handbook - Bastidores sem crise';
                } else if (pdfFileName.includes('evolucao-do-produto')) {
                    handbookName = 'Handbook - A evolução do produto';
                }
            }
            
            const webhookUrl = 'https://automacao-n8n.wm8h0r.easypanel.host/webhook/196aaae5-9254-442a-8f37-7071428bf53c';
            const params = new URLSearchParams({
                email: email,
                source: 'handbook-pdf-download',
                url: window.location.href,
                handbook: handbookName,
                download_date: date
            }).toString();
            
            const fullUrl = `${webhookUrl}?${params}`;
            console.log('URL do webhook:', fullUrl);
            
            fetch(fullUrl, {
                method: 'GET'
            })
                .then(response => {
                    console.log('Resposta do webhook:', response.status, response.statusText);
                    if (!response.ok) {
                        throw new Error(`Erro HTTP: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Dados da resposta:', data);
                    resolve(data);
                })
                .catch(error => {
                    console.error('Erro detalhado:', error);
                    window.open(fullUrl, '_blank');
                    resolve();
                });
        });
    },

    showLoader() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'flex';
        }
    },

    hideLoader() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'none';
        }
    },

    downloadPDF(pdfFileName = null) {
        this.showLoader();
        
        // Use the provided PDF filename or default to the first ebook
        const fileName = pdfFileName || 'Handbook-A-evolucao-do-produto-Como-migrar-sem-trauma.pdf';
        
        const link = document.createElement('a');
        link.href = `download/${fileName}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            this.hideLoader();
            const successModal = document.getElementById('successModal');
            if (successModal) {
                successModal.style.display = 'block';
                this.createConfetti();
            }
        }, 1500);
    },

    createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '9999';

        for (let i = 0; i < 10; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confettiContainer.appendChild(confetti);
        }

        document.body.appendChild(confettiContainer);

        setTimeout(() => {
            document.body.removeChild(confettiContainer);
        }, 5000);
    },

    setupModal(modalId, btnSelector, options = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const closeBtn = modal.querySelector('.close-modal');
        
        const closeModal = () => {
            modal.style.display = 'none';
            if (options.onClose) options.onClose();
        };

        if (btnSelector) {
            document.querySelectorAll(btnSelector).forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (options.onBeforeOpen) options.onBeforeOpen();
                    if (options.onClick) options.onClick(e);
                    modal.style.display = 'block';
                });
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });
    },
    
    setupDynamicModals(triggerSelector) {
        const triggers = document.querySelectorAll(triggerSelector);
        
        triggers.forEach(trigger => {
            const modalId = trigger.getAttribute('data-modal');
            if (!modalId) return;
            
            const modal = document.getElementById(modalId);
            if (!modal) return;
            
            const closeBtn = modal.querySelector('.close-modal');
            
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                modal.style.display = 'block';
            });
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
            }
            
            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    },
};

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Variável global para armazenar o PDF selecionado
    window.selectedPdfFilename = null;
    // Theme switcher
    const checkbox = document.getElementById('checkbox');
    if (checkbox) {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            document.documentElement.setAttribute('data-theme', currentTheme);
            checkbox.checked = currentTheme === 'dark';
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

    // Setup modals
    utils.setupModal('imageModal', '.cover-image', {
        onClick(e) {
            e.preventDefault();
            document.querySelector('#imageModal .modal-image').src = e.target.src;
        }
    });
    utils.setupModal('contributeModal', '#contributeBtn');
    utils.setupModal('helpModal', '.help-btn', {
        onBeforeOpen() {
            const modal = document.getElementById('helpModal');
            const form = modal.querySelector('#helpForm');
            const successMessage = modal.querySelector('#successMessage');
            if (form && successMessage) {
                form.style.display = 'block';
                successMessage.style.display = 'none';
            }
        }
    });
    utils.setupModal('emailModal', '#emailBtn');
    utils.setupModal('pdfModal', '.download-btn');
    utils.setupModal('successModal', null);

    // Setup email copy button
    const copyBtn = document.querySelector('.copy-btn');
    const emailInput = document.querySelector('.email-input');
    if (copyBtn && emailInput) {
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

    // Setup PDF form
    const pdfEmailForm = document.getElementById('pdfEmailForm');
    const pdfEmailInput = document.getElementById('pdfEmailInput');
    const pdfEmailError = document.getElementById('pdfEmailError');
    const pdfModal = document.getElementById('pdfModal');

    if (pdfEmailForm && pdfEmailInput && pdfEmailError) {
        // Validação em tempo real do email
        pdfEmailInput.addEventListener('input', function(e) {
            const email = e.target.value;
            
            if (email.length > 0) {
                if (utils.validateEmail(email)) {
                    pdfEmailInput.classList.remove('invalid');
                    pdfEmailInput.classList.add('valid');
                    pdfEmailError.textContent = '';
                    pdfEmailError.style.display = 'none';
                } else {
                    pdfEmailInput.classList.remove('valid');
                    pdfEmailInput.classList.add('invalid');
                    pdfEmailError.textContent = 'Por favor, insira um email válido';
                    pdfEmailError.style.display = 'block';
                }
            } else {
                pdfEmailInput.classList.remove('valid', 'invalid');
                pdfEmailError.textContent = '';
                pdfEmailError.style.display = 'none';
            }
        });

        // Submit do formulário
        pdfEmailForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = pdfEmailInput.value;

            if (!utils.validateEmail(email)) {
                pdfEmailError.textContent = 'Por favor, insira um e-mail válido';
                pdfEmailError.style.display = 'block';
                return;
            }

            try {
                utils.showLoader();
                pdfModal.style.display = 'none';
                
                // Envia o email para o webhook com o nome do PDF selecionado
                await utils.sendEmailToWebhook(email, selectedPdfFilename);
                
                // Faz o download do PDF com o arquivo selecionado
                utils.downloadPDF(selectedPdfFilename);
                
                // Limpa o formulário
                pdfEmailForm.reset();
                pdfEmailInput.classList.remove('valid', 'invalid');
                pdfEmailError.textContent = '';
                pdfEmailError.style.display = 'none';
                
            } catch (error) {
                console.error('Erro:', error);
                utils.hideLoader();
                pdfEmailError.textContent = 'Ocorreu um erro. Por favor, tente novamente.';
                pdfEmailError.style.display = 'block';
            }
        });
    }

    // Setup help form
    const helpForm = document.getElementById('helpForm');
    const helpEmailInput = document.getElementById('email');
    const emailValidationMessage = document.querySelector('.email-validation-message');
    const successMessage = document.getElementById('successMessage');

    if (helpForm && helpEmailInput && emailValidationMessage) {
        // Validação em tempo real do email
        helpEmailInput.addEventListener('input', function(e) {
            const email = e.target.value;
            
            if (email.length > 0) {
                if (utils.validateEmail(email)) {
                    helpEmailInput.classList.remove('invalid');
                    helpEmailInput.classList.add('valid');
                    emailValidationMessage.style.display = 'none';
                } else {
                    helpEmailInput.classList.remove('valid');
                    helpEmailInput.classList.add('invalid');
                    emailValidationMessage.style.display = 'block';
                }
            } else {
                helpEmailInput.classList.remove('valid', 'invalid');
                emailValidationMessage.style.display = 'none';
            }
        });

        // Submit do formulário de ajuda
        helpForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            utils.showLoader();

            try {
                const response = await fetch('send_email.php', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                utils.hideLoader();

                if (data.success) {
                    helpForm.style.display = 'none';
                    successMessage.style.display = 'block';
                    this.reset();
                } else {
                    throw new Error(data.message || 'Erro ao enviar mensagem');
                }
            } catch (error) {
                utils.hideLoader();
                console.error('Erro:', error);
                alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.');
            }
        });

        // Character counter for details textarea
        const detailsTextarea = document.getElementById('details');
        const charCount = document.getElementById('charCount');
        
        if (detailsTextarea && charCount) {
            detailsTextarea.addEventListener('input', function() {
                const remaining = this.value.length;
                charCount.textContent = remaining;
            });
        }
    }
});
