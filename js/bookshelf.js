/**
 * Bookshelf.js - Gerenciador dinâmico de ebooks para a biblioteca digital
 * Este script carrega os dados dos ebooks e gera dinamicamente os elementos HTML
 */

class Bookshelf {
    constructor(ebooksData) {
        this.ebooksData = ebooksData;
        this.bookshelfContainer = document.querySelector('.bookshelf');
    }

    /**
     * Inicializa a estante de livros
     */
    init() {
        this.renderBooks();
        this.renderModals();
        this.setupEventListeners();
    }

    /**
     * Renderiza os livros na estante
     */
    renderBooks() {
        if (!this.bookshelfContainer) return;
        
        // Limpa o conteúdo atual
        this.bookshelfContainer.innerHTML = '';
        
        // Gera o HTML para cada ebook
        this.ebooksData.forEach(book => {
            const bookElement = this.createBookElement(book);
            this.bookshelfContainer.appendChild(bookElement);
        });
    }

    /**
     * Cria o elemento HTML para um livro
     */
    createBookElement(book) {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book';
        bookDiv.dataset.bookId = book.id;
        
        bookDiv.innerHTML = `
            <div class="book-cover">
                <img src="${book.coverImage}" alt="${book.title}: ${book.subtitle}" 
                     class="cover-image" data-pdf="${book.pdfFile}">
            </div>
            <div class="book-info">
                <h2>${book.title}</h2>
                <p class="subtitle">${book.subtitle}</p>
                <div class="buttons">
                    <a href="#" class="btn download-btn">
                        <i class="fas fa-download"></i> PDF
                    </a>
                    <a href="#" class="btn info-btn" data-modal="${book.modalId}">
                        <i class="fas fa-info-circle"></i> Info
                    </a>
                </div>
            </div>
        `;
        
        return bookDiv;
    }

    /**
     * Renderiza os modais para cada ebook
     */
    renderModals() {
        // Remove modais antigos
        document.querySelectorAll('.ebook-info-modal').forEach(modal => {
            modal.remove();
        });
        
        // Cria novos modais para cada ebook
        this.ebooksData.forEach(book => {
            const modal = this.createInfoModal(book);
            document.body.appendChild(modal);
        });
    }

    /**
     * Cria o modal de informações para um ebook
     */
    createInfoModal(book) {
        const modalDiv = document.createElement('div');
        modalDiv.id = book.modalId;
        modalDiv.className = 'modal ebook-info-modal';
        
        modalDiv.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-header">
                    <h2>${book.modalTitle}</h2>
                </div>
                <div class="modal-body">
                    ${book.modalContent}
                    <div class="help-action">
                        <button class="help-btn" data-book-id="${book.id}">
                            <i class="fas fa-hands-helping"></i>
                            Quero ajuda para usar esse modelo
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return modalDiv;
    }

    /**
     * Configura os event listeners para os elementos gerados
     */
    setupEventListeners() {
        // Event listeners para botões de download
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const book = btn.closest('.book');
                if (book) {
                    const coverImage = book.querySelector('.cover-image');
                    if (coverImage) {
                        window.selectedPdfFilename = coverImage.getAttribute('data-pdf');
                        document.getElementById('pdfModal').style.display = 'block';
                    }
                }
            });
        });

        // Event listeners para botões de info
        document.querySelectorAll('.info-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = btn.getAttribute('data-modal');
                if (modalId) {
                    const modal = document.getElementById(modalId);
                    if (modal) {
                        modal.style.display = 'block';
                    }
                }
            });
        });

        // Event listeners para botões de fechar modal
        document.querySelectorAll('.close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                const modal = closeBtn.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Event listeners para clique fora do modal
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Event listeners para botões de ajuda
        document.querySelectorAll('.help-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    document.getElementById('helpModal').style.display = 'block';
                }
            });
        });
    }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se os dados dos ebooks estão disponíveis
    if (typeof ebooksData !== 'undefined') {
        const bookshelf = new Bookshelf(ebooksData);
        bookshelf.init();
    } else {
        console.error('Dados dos ebooks não encontrados!');
    }
});
