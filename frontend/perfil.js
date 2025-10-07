document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    const profissionalId = params.get('id');
    const dados = profissionais[profissionalId]; 
    
  
    const contratarBtn = document.querySelector('.botao-principal.contratar');

    if (dados) {
       
        document.title = `AllServe - ${dados.nome}`; 
        document.getElementById('perfil-imagem').src = dados.imagem;
        document.getElementById('perfil-nome').textContent = dados.nome;
        document.getElementById('perfil-preco').textContent = `R$ ${dados.preco.toFixed(2).replace('.', ',')}/hora`;
        document.getElementById('perfil-resumo').textContent = dados.resumo;
        document.getElementById('tab-descricao').textContent = dados.descricaoCompleta;
        document.getElementById('perfil-id').textContent = dados.id;
        document.getElementById('perfil-categoria').textContent = dados.categoria;
        document.getElementById('perfil-especialidade').textContent = dados.especialidade;

        const avaliacaoContainer = document.getElementById('perfil-avaliacao');
        if (avaliacaoContainer && dados.avaliacao) {
            let estrelasHTML = '<div class="estrelas">';
            for (let i = 0; i < 5; i++) {
               
                estrelasHTML += `<i class="fa-${i < dados.avaliacao ? 'solid' : 'regular'} fa-star"></i>`;
            }
            estrelasHTML += `</div><span>${dados.numAvaliacoes || 0} Avaliações</span>`;
            avaliacaoContainer.innerHTML = estrelasHTML;
        }
        
        
        const tagsContainer = document.getElementById('perfil-tags');
        if (tagsContainer && dados.tags) {
            tagsContainer.innerHTML = '';
            dados.tags.forEach(tag => {
                tagsContainer.innerHTML += `<span>${tag}</span>`;
            });
        }

       
        const linkWhatsapp = document.getElementById('link-whatsapp');
        if (linkWhatsapp && dados.telefone) {
            
            const mensagem = `Olá ${dados.nome}, vi seu perfil no site AllServe e gostaria de mais informações sobre seus serviços.`;

          
            const mensagemCodificada = encodeURIComponent(mensagem);

            const urlWhatsapp = `https://wa.me/${dados.telefone}?text=${mensagemCodificada}`;

           
            linkWhatsapp.href = urlWhatsapp;
        } else if (linkWhatsapp) {
           
            linkWhatsapp.style.display = 'none';
        }
    
        
        if (contratarBtn) {
            contratarBtn.addEventListener('click', (event) => {
                event.preventDefault(); 

               
                const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

                
                const inputQuantidade = document.querySelector('.quantidade input');
                const quantidade = inputQuantidade ? parseInt(inputQuantidade.value) : 1;

              
                const itemExistente = carrinho.find(item => item.id === profissionalId);

                if (itemExistente) {
                    alert(`${dados.nome} já está no seu carrinho!`);
                } else {
                    carrinho.push({ id: profissionalId, quantidade: quantidade });
                    alert(`${dados.nome} foi adicionado ao carrinho!`);
                }

                
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                
              
                window.location.href = 'carrinho.html';
            });
        }

    } else {
       
        const container = document.querySelector('.container-perfil');
        if(container) {
            container.innerHTML = '<h1>Profissional não encontrado</h1><p>O ID fornecido não corresponde a nenhum profissional cadastrado.</p>';
        }
    }

    
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-painel');

    if (tabButtons.length > 0 && tabPanels.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
               
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));

               
                button.classList.add('active');
                const tabId = button.dataset.tab;
                const activePanel = document.getElementById(`tab-${tabId}`);
                if (activePanel) {
                    activePanel.classList.add('active');
                }
            });
        });
    }

  
    const quantidadeInput = document.querySelector('.quantidade input');
    const btnMenos = document.querySelector('.quantidade button:first-child');
    const btnMais = document.querySelector('.quantidade button:last-child');

    if(quantidadeInput && btnMenos && btnMais){
        btnMenos.addEventListener('click', () => {
            let valor = parseInt(quantidadeInput.value);
            if (valor > 1) {
                quantidadeInput.value = valor - 1;
            }
        });

        btnMais.addEventListener('click', () => {
            let valor = parseInt(quantidadeInput.value);
            quantidadeInput.value = valor + 1;
        });
    }
});