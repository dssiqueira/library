const utils = {
    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },

    sendEmailToWebhook(email) {
        return new Promise((resolve, reject) => {
            console.log('Iniciando envio do email:', email);
            
            const now = new Date();
            const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
            
            const webhookUrl = 'https://automacao-n8n.wm8h0r.easypanel.host/webhook/196aaae5-9254-442a-8f37-7071428bf53c';
            const params = new URLSearchParams({
                email: email,
                source: 'handbook-pdf-download',
                url: window.location.href,
                handbook: 'Handbook de Desenvolvimento de Software',
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

    downloadPDF() {
        this.showLoader();

        const link = document.createElement('a');
        link.href = 'download/teste.pdf';
        link.download = 'handbook.pdf';
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
    }
};

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
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
    utils.setupModal('infoModal', '.info-btn');
    utils.setupModal('helpModal', '#helpBtn', {
        onBeforeOpen() {
            const modal = document.getElementById('helpModal');
            if (modal) {
                modal.style.display = 'block';
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
                
                // Envia o email para o webhook
                await utils.sendEmailToWebhook(email);
                
                // Faz o download do PDF
                utils.downloadPDF();
                
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
});
