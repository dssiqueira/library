/**
 * Bookshelf.js - Gerenciador dinâmico de ebooks para a biblioteca digital
 * Este script carrega os dados dos ebooks e gera dinamicamente os elementos HTML
 */

class Bookshelf {
    constructor(ebooksData) {
        this.ebooksData = ebooksData;
        this.bookshelfContainer = document.querySelector('.bookshelf');
        this.activeCategory = 'all'; // Categoria padrão: mostrar todos
        this.allCategories = this.extractAllCategories();
        this.filterExpanded = localStorage.getItem('categoryFilterExpanded') !== 'false';
    }
    
    /**
     * Extrai todas as categorias únicas dos ebooks
     */
    extractAllCategories() {
        const categories = new Set();
        categories.add('all'); // Adiciona a categoria "todos"
        
        this.ebooksData.forEach(book => {
            if (book.categories && Array.isArray(book.categories)) {
                book.categories.forEach(category => {
                    categories.add(category);
                });
            }
        });
        
        return Array.from(categories).sort();
    }

    /**
     * Inicializa a estante de livros
     */
    init() {
        // Comentado temporariamente até termos mais ebooks
        // this.renderCategoryFilter();
        this.renderBooks();
        this.renderModals();
        this.setupEventListeners();
    }
    
    /**
     * Renderiza o filtro de categorias
     */
    renderCategoryFilter() {
        // Verifica se já existe um container para o filtro
        let filterContainer = document.querySelector('.category-filter');
        
        // Se não existir, cria um novo
        if (!filterContainer) {
            filterContainer = document.createElement('div');
            filterContainer.className = 'category-filter';
            
            // Adiciona o botão de toggle para expandir/recolher
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'category-toggle-btn';
            toggleBtn.innerHTML = '<i class="fas fa-filter"></i> <span>Categorias</span> <i class="fas fa-chevron-down"></i>';
            filterContainer.appendChild(toggleBtn);
            
            const categoryList = document.createElement('div');
            categoryList.className = 'category-list';
            
            // Define o estado inicial (expandido ou recolhido)
            if (this.filterExpanded) {
                categoryList.classList.add('expanded');
            } else {
                categoryList.classList.add('collapsed');
                toggleBtn.querySelector('.fa-chevron-down').classList.replace('fa-chevron-down', 'fa-chevron-up');
            }
            
            // Cria um botão para cada categoria
            this.allCategories.forEach(category => {
                const categoryBtn = document.createElement('button');
                categoryBtn.className = 'category-btn';
                categoryBtn.dataset.category = category;
                categoryBtn.textContent = category === 'all' ? 'Todos' : category;
                
                // Marca o botão da categoria ativa
                if (category === this.activeCategory) {
                    categoryBtn.classList.add('active');
                }
                
                // Adiciona o event listener
                categoryBtn.addEventListener('click', () => {
                    this.filterByCategory(category);
                });
                
                categoryList.appendChild(categoryBtn);
            });
            
            filterContainer.appendChild(categoryList);
            
            // Insere o filtro antes da estante de livros
            const container = document.querySelector('.container');
            container.insertBefore(filterContainer, this.bookshelfContainer);
            
            // Adiciona o event listener para o botão de toggle
            toggleBtn.addEventListener('click', () => {
                this.toggleCategoryFilter();
            });
        }
    }
    
    /**
     * Alterna a visibilidade do filtro de categorias
     */
    toggleCategoryFilter() {
        const categoryList = document.querySelector('.category-list');
        const toggleBtn = document.querySelector('.category-toggle-btn');
        
        if (categoryList) {
            categoryList.classList.toggle('expanded');
            categoryList.classList.toggle('collapsed');
            
            // Atualiza o ícone do botão
            const chevronIcon = toggleBtn.querySelector('.fa-chevron-down, .fa-chevron-up');
            if (chevronIcon) {
                if (categoryList.classList.contains('expanded')) {
                    chevronIcon.classList.replace('fa-chevron-up', 'fa-chevron-down');
                    this.filterExpanded = true;
                } else {
                    chevronIcon.classList.replace('fa-chevron-down', 'fa-chevron-up');
                    this.filterExpanded = false;
                }
            }
            
            // Salva a preferência do usuário no localStorage
            localStorage.setItem('categoryFilterExpanded', this.filterExpanded.toString());
        }
    }
    
    /**
     * Filtra os livros por categoria
     */
    filterByCategory(category) {
        this.activeCategory = category;
        
        // Atualiza os botões de categoria
        document.querySelectorAll('.category-btn').forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Renderiza os livros filtrados
        this.renderBooks();
    }

    /**
     * Renderiza os livros na estante
     */
    renderBooks() {
        if (!this.bookshelfContainer) return;
        
        // Limpa o conteúdo atual
        this.bookshelfContainer.innerHTML = '';
        
        // Temporariamente desativado o filtro por categorias
        // const filteredBooks = this.activeCategory === 'all' 
        //     ? this.ebooksData 
        //     : this.ebooksData.filter(book => 
        //         book.categories && book.categories.includes(this.activeCategory)
        //     );
        
        // Usando todos os ebooks sem filtro
        const filteredBooks = this.ebooksData;
        
        // Se não houver livros, mostra uma mensagem
        if (filteredBooks.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-category-message';
            emptyMessage.innerHTML = `
                <i class="fas fa-search"></i>
                <p>Nenhum handbook encontrado.</p>
            `;
            this.bookshelfContainer.appendChild(emptyMessage);
            return;
        }
        
        // Gera o HTML para cada ebook
        filteredBooks.forEach(book => {
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
        
        // Gera as tags de categoria - temporariamente comentado
        let categoriesHTML = '';
        // if (book.categories && book.categories.length > 0) {
        //     categoriesHTML = `
        //         <div class="book-categories">
        //             ${book.categories.map(category => 
        //                 `<span class="category-tag">${category}</span>`
        //             ).join('')}
        //         </div>
        //     `;
        // }
        
        bookDiv.innerHTML = `
            <div class="book-cover">
                <img src="${book.coverImage}" alt="${book.title}: ${book.subtitle}" 
                     class="cover-image" data-pdf="${book.pdfFile}">
            </div>
            <div class="book-info">
                <h2>${book.title}</h2>
                <p class="subtitle">${book.subtitle}</p>
                ${categoriesHTML}
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
     * Configura os event listeners
     */
    setupEventListeners() {
        // Event listener para os botões de download
        this.bookshelfContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('download-btn') || e.target.closest('.download-btn')) {
                e.preventDefault();
                const bookElement = e.target.closest('.book');
                if (bookElement) {
                    const coverImage = bookElement.querySelector('.cover-image');
                    if (coverImage && coverImage.dataset.pdf) {
                        // Armazena o nome do PDF selecionado em uma variável global
                        window.selectedPdfFilename = coverImage.dataset.pdf;
                        
                        // Abre o modal de PDF
                        const pdfModal = document.getElementById('pdfModal');
                        if (pdfModal) pdfModal.style.display = 'block';
                    }
                }
            }
        });
        
        // Event listener para visualização da capa em tamanho maior
        this.bookshelfContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('cover-image')) {
                e.preventDefault();
                const bookElement = e.target.closest('.book');
                if (bookElement) {
                    const coverImage = e.target;
                    const title = bookElement.querySelector('h2').textContent;
                    const subtitle = bookElement.querySelector('.subtitle').textContent;
                    
                    // Preenche o modal com os dados da capa
                    const coverModal = document.getElementById('coverModal');
                    const coverModalImage = document.getElementById('coverModalImage');
                    const coverModalTitle = document.getElementById('coverModalTitle');
                    const coverModalSubtitle = document.getElementById('coverModalSubtitle');
                    
                    if (coverModal && coverModalImage && coverModalTitle && coverModalSubtitle) {
                        coverModalImage.src = coverImage.src;
                        coverModalImage.alt = coverImage.alt;
                        coverModalTitle.textContent = title;
                        coverModalSubtitle.textContent = subtitle;
                        
                        // Abre o modal
                        coverModal.style.display = 'block';
                    }
                }
            }
        });

        // Event listener para os botões de info
        this.bookshelfContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('info-btn') || e.target.closest('.info-btn')) {
                e.preventDefault();
                const btn = e.target.closest('.info-btn');
                if (btn) {
                    const modalId = btn.dataset.modal;
                    if (modalId) {
                        const modal = document.getElementById(modalId);
                        if (modal) modal.style.display = 'block';
                    }
                }
            }
        });

        // Event listeners para botões de fechar modal
        document.querySelectorAll('.close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                const modal = closeBtn.closest('.modal');
                if (modal) modal.style.display = 'none';
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
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('help-btn') || e.target.closest('.help-btn')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    const helpModal = document.getElementById('helpModal');
                    if (helpModal) helpModal.style.display = 'block';
                }
            }
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
