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
