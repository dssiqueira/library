// Dados dos ebooks da biblioteca
const ebooksData = [
    {
        id: 1,
        title: "Handbook - A evolução do produto",
        subtitle: "Como migrar sem trauma",
        coverImage: "https://iili.io/3drMNcJ.png",
        pdfFile: "Handbook-A-evolucao-do-produto-Como-migrar-sem-trauma.pdf",
        modalId: "infoModal1",
        modalTitle: "Handbook do Modelo de Estrangulamento",
        modalContent: `
            <div class="intro-text">
                <p>Modernizar um sistema sem quebrar o que já funciona pode parecer como trocar as asas de um avião em pleno voo. O Modelo de Estrangulamento propõe um caminho seguro para essa transformação, garantindo que inovação e estabilidade andem lado a lado.</p>
            </div>

            <div class="content-section">
                <p>Este handbook reúne princípios fundamentais, tomada de decisão, estrutura organizacional, métricas de sucesso e boas práticas de documentação para tornar essa jornada mais previsível e tranquila.</p>
            </div>

            <div class="content-section">
                <p>Com uma abordagem leve e prática, o material serve como um guia para quem precisa evoluir um produto sem sustos, sem grandes rupturas e, principalmente, sem perder a paciência no caminho.</p>
            </div>

            <div class="highlight-box">
                <i class="fas fa-lightbulb"></i>
                <p>Se o seu desafio é transformar algo legado em algo novo sem parar tudo no meio do caminho, este handbook é para você.</p>
            </div>
        `
    },
    {
        id: 2,
        title: "Handbook - Bastidores sem crise",
        subtitle: "O guia realista de auditoria e rastreabilidade para produto digital",
        coverImage: "https://iili.io/FED3nKx.md.png",
        pdfFile: "Handbook-Bastidores-sem-crise-O-guia-realista-de-auditoria-e-rastreabilidade-para-produto-digital.pdf",
        modalId: "infoModal2",
        modalTitle: "Handbook de Auditoria e Rastreabilidade",
        modalContent: `
            <div class="intro-text">
                <p>Em um cenário onde a transparência é cada vez mais valorizada, a capacidade de auditar e rastrear decisões em produtos digitais se torna um diferencial competitivo. Este guia apresenta uma abordagem realista para implementar práticas de auditoria sem criar burocracia desnecessária.</p>
            </div>

            <div class="content-section">
                <p>Descubra como equilibrar documentação e agilidade, implementar trilhas de auditoria eficientes e criar uma cultura de responsabilidade sem sobrecarregar as equipes.</p>
            </div>

            <div class="content-section">
                <p>Ideal para líderes de produto, gerentes de projeto e profissionais de compliance que precisam garantir transparência sem sacrificar a velocidade de entrega.</p>
            </div>

            <div class="highlight-box">
                <i class="fas fa-lightbulb"></i>
                <p>Este handbook oferece ferramentas práticas para quem busca um equilíbrio entre governança e inovação em produtos digitais.</p>
            </div>
        `
    }
    // Para adicionar um novo ebook, basta criar um novo objeto seguindo o mesmo formato acima
];

// Exportar os dados para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ebooksData };
}
