// Funções utilitárias
const utils = {
    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },

    sendEmailToWebhook(email) {
        return new Promise((resolve, reject) => {
            console.log('Iniciando envio do email:', email);
            
            // Pega a data atual no formato dd/mm/aaaa
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
            
            // Tenta primeiro com fetch usando GET
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
                    
                    // Se falhar com fetch, tenta com window.open direto
                    console.log('Tentando com window.open...');
                    window.open(fullUrl, '_blank');
                    
                    // Mesmo com erro, resolve para não bloquear o download
                    resolve();
                });
        });
    },

    downloadPDF() {
        const link = document.createElement('a');
        link.href = 'download/teste.pdf';
        link.download = 'handbook.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    setupModal(modalId, btnSelector, options = {}) {
        const modal = document.getElementById(modalId);
        const btn = document.querySelector(btnSelector);
        const closeBtn = modal?.querySelector('.close-modal');

        if (modal && btn) {
            // Abrir modal
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                if (options.onBeforeOpen) {
                    options.onBeforeOpen();
                }
                modal.style.display = 'block';
            });

            // Fechar com X
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    modal.style.display = 'none';
                    if (options.onClose) {
                        options.onClose();
                    }
                });
            }

            // Fechar clicando fora
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    if (options.onClose) {
                        options.onClose();
                    }
                }
            });

            // Configurações adicionais
            if (options.onClick) {
                modal.addEventListener('click', options.onClick);
            }
        }
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

    // Configurar todos os modais
    utils.setupModal('infoModal', '.info-btn');
    utils.setupModal('imageModal', '.book-cover img', {
        onClick: function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        }
    });
    utils.setupModal('contributeModal', '#contributeBtn');
    utils.setupModal('emailModal', '#emailBtn');
    utils.setupModal('helpModal', '#helpBtn', {
        onBeforeOpen: function() {
            const infoModal = document.getElementById('infoModal');
            if (infoModal) {
                infoModal.style.display = 'none';
            }
        }
    });
    utils.setupModal('pdfModal', '.download-btn');

    // Configurar formulário PDF
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
                // Envia o email para o webhook
                await utils.sendEmailToWebhook(email);
                
                // Espera 2 segundos antes de fazer download e fechar
                setTimeout(() => {
                    // Faz o download do PDF
                    utils.downloadPDF();
                    
                    // Fecha o modal e limpa o formulário
                    pdfModal.style.display = 'none';
                    pdfEmailForm.style.display = 'block';
                    pdfEmailInput.value = '';
                    pdfEmailError.textContent = '';
                    pdfEmailError.style.display = 'none';
                }, 2000);
                
            } catch (error) {
                console.error('Erro:', error);
                pdfEmailError.textContent = 'Ocorreu um erro. Por favor, tente novamente.';
                pdfEmailError.style.display = 'block';
            }
        });
    }

    // Copiar email
    const emailModal = document.getElementById('emailModal');
    const copyBtn = emailModal?.querySelector('.copy-btn');
    const emailInput = emailModal?.querySelector('.email-input');

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
});
