
document.addEventListener('DOMContentLoaded', () => {

    const carrinhoItensContainer = document.querySelector('.carrinho-itens');
    const resumoSubtotal = document.querySelector('.resumo-subtotal');
    const resumoTotal = document.querySelector('.resumo-total');

    function renderizarCarrinho() {
       
        carrinhoItensContainer.innerHTML = `
            <div class="carrinho-header">
                <span class="header-profissional">Profissional</span>
                <span class="header-valor">Valor</span>
                <span class="header-hora">Hora</span>
                <span class="header-total">Total</span>
            </div>`;
        
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        let subtotal = 0;

        if (carrinho.length === 0) {
            carrinhoItensContainer.innerHTML += '<p class="carrinho-vazio">Seu carrinho está vazio.</p>';
            resumoSubtotal.textContent = 'R$ 0,00';
            resumoTotal.textContent = 'R$ 0,00';
            return;
        }

        carrinho.forEach(item => {
            const dadosProfissional = profissionais[item.id];
            if (dadosProfissional) {
                const totalItem = dadosProfissional.preco * item.quantidade;
                subtotal += totalItem;

                const itemHTML = `
                    <div class="carrinho-item">
                        <div class="item-info">
                            <img src="${dadosProfissional.imagem}" alt="${dadosProfissional.nome}">
                            <div>
                                <p class="item-categoria">${dadosProfissional.categoria}</p>
                                <h3 class="item-nome">${dadosProfissional.nome}</h3>
                            </div>
                        </div>
                        <div class="item-valor">R$ ${dadosProfissional.preco.toFixed(2).replace('.', ',')}</div>
                        <div class="item-quantidade">
                            <input type="number" value="${item.quantidade}" min="1" data-id="${item.id}">
                        </div>
                        <div class="item-total">R$ ${totalItem.toFixed(2).replace('.', ',')}</div>
                        <div class="item-remover">
                            <button class="remover-btn" data-id="${item.id}"><i class="fa-regular fa-trash-can"></i></button>
                        </div>
                    </div>
                `;
                carrinhoItensContainer.innerHTML += itemHTML;
            }
        });
        
        
        resumoSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        resumoTotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;

        adicionarEventListeners();
    }

    function removerDoCarrinho(idProfissional) {
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        carrinho = carrinho.filter(item => item.id !== idProfissional);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        renderizarCarrinho();
    }
    
    function adicionarEventListeners() {
        const botoesRemover = document.querySelectorAll('.remover-btn');
        botoesRemover.forEach(botao => {
            botao.addEventListener('click', () => {
                const idParaRemover = botao.dataset.id;
                removerDoCarrinho(idParaRemover);
            });
        });
    }

    renderizarCarrinho();
});