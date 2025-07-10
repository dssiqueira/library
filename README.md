# 📚 Biblioteca Digital de Handbooks

> *"Uma biblioteca digital de conhecimento para profissionais de tecnologia e produto."*

![Banner do Projeto](https://iili.io/3drMNcJ.png)

## 🚀 Sobre o Projeto

Este é um site interativo que hospeda uma coleção de handbooks sobre desenvolvimento de software e gestão de produtos digitais. A biblioteca inclui conteúdos como o "Modelo de Estrangulamento" para modernização de sistemas legados e "Bastidores sem crise" sobre auditoria e rastreabilidade em produtos digitais. Desenvolvido com HTML, CSS e JavaScript puros, oferece uma experiência elegante e responsiva para acessar e baixar os conteúdos.

### ✨ Funcionalidades

- 🌓 Modo claro/escuro com persistência via localStorage
- 📚 Estante de livros dinâmica e expansível
- 📥 Download do PDF com captura de email
- 📬 Sistema de contato integrado
- 🤝 Seção de contribuições
- 🎨 Design responsivo e moderno
- 🎉 Animações e feedback visual
- 💾 Estrutura modular para fácil adição de novos ebooks

## 🔧️ Tecnologias

- HTML5
- CSS3 (com animações e flexbox)
- JavaScript (Vanilla)
- PHP (Backend para envio de emails)
- Font Awesome (ícones)
- Canvas Confetti (efeitos especiais)

## 💼 Estrutura do Projeto

```
.
├── index.html           # Página principal
├── styles.css           # Estilos CSS
├── script.js            # JavaScript principal
├── send_email.php       # Backend para formulário de contato
├── data/
│   └── ebooks.js        # Dados dos ebooks em formato JSON
├── js/
│   └── bookshelf.js     # Lógica para geração dinâmica da estante
├── download/            # Arquivos PDF dos ebooks
└── img/                # Imagens do site
```

## 📚 Como Adicionar Novos Ebooks

Para adicionar um novo ebook à biblioteca, siga estes passos:

1. Adicione o arquivo PDF na pasta `download/`

2. Edite o arquivo `data/ebooks.js` e adicione um novo objeto seguindo o formato:

```javascript
{
    id: 3, // Incrementar o ID
    title: "Título do Novo Handbook",
    subtitle: "Subtítulo do handbook",
    coverImage: "URL da imagem de capa",
    pdfFile: "Nome-do-arquivo-PDF.pdf",
    modalId: "infoModal3", // Incrementar o número
    modalTitle: "Título do Modal de Informação",
    modalContent: `
        <div class="intro-text">
            <p>Texto de introdução...</p>
        </div>
        
        <div class="content-section">
            <p>Conteúdo do modal...</p>
        </div>
        
        <div class="highlight-box">
            <i class="fas fa-lightbulb"></i>
            <p>Destaque importante...</p>
        </div>
    `
}
```

Não é necessário modificar o HTML ou o JavaScript principal - o novo ebook será automaticamente adicionado à estante e terá seu próprio modal de informações.

## 🏃‍♂️ Como Executar

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/handbook-library.git
```

2. Configure seu servidor web (Apache/Nginx) para apontar para o diretório do projeto

3. Configure as permissões do PHP para envio de emails no arquivo `send_email.php`

4. Acesse através do seu navegador
```
http://localhost/seu-diretorio
```

## 📋 Requisitos

- Servidor web com suporte a PHP 7.4+
- Configuração de email SMTP (para funcionalidade de contato)
- Navegador moderno com suporte a ES6+

## 🤝 Contribuindo

Quer contribuir? Ótimo! Temos várias formas de tornar este projeto ainda melhor:

1. 🐛 Reporte bugs
2. 💡 Sugira novas features
3. 📖 Melhore a documentação
4. 🎨 Proponha melhorias de UI/UX

## 📬 Contato

Tem dúvidas ou sugestões? Entre em contato:
- Email: handbook@dsiqueira.com
- Website: [dsiqueira.com](https://dsiqueira.com)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
Feito com ☕ e código por <a href="https://dsiqueira.com">DSiqueira</a>
</p>