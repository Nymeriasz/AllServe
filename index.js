document.addEventListener("DOMContentLoaded", () => {

  const dadosDosServicos = {
    tradicional: {
      imagem: "", 
      categoria: "Tradicional",
      titulo: "Barman Clássico/Tradicional",
      descricao: "Muito requisitado em festas formais, jantares de gala e bares sofisticados, já que domina os coquetéis clássicos e o atendimento elegante."
    },
    barista: {
      imagem: "https://i.imgur.com/gK15wXw.png", 
      categoria: "Barista",
      titulo: "Especialista em drinks",
      descricao: "Perfeito para eventos diurnos, brunches e conferências. Surpreenda seus convidados com drinks especiais, lattes artísticos e bebidas."
    },
    showman: {
      imagem: "https://i.imgur.com/gK15wXw.png",
      categoria: "Showman",
      titulo: "Bartender Acrobático",
      descricao: "Ideal para festas animadas e eventos que buscam entretenimento. Este profissional é especialista em flair, fazendo malabarismos com garrafas e criando um show."
    }
  };

  const todosOsCards = document.querySelectorAll('.card');
  const modal = document.getElementById('detalhe-servico');
  
  
  const modalImagem = document.getElementById('modal-imagem');
  const modalCategoria = document.getElementById('modal-categoria');
  const modalTitulo = document.getElementById('modal-titulo');
  const modalDescricao = document.getElementById('modal-descricao');

  todosOsCards.forEach(card => {
    card.addEventListener('click', () => {
      
      const tipoDeServico = card.dataset.service;
      
    
      const dados = dadosDosServicos[tipoDeServico];
      
      if (dados) {
        modalImagem.src = dados.imagem;
        modalImagem.alt = dados.titulo;
        modalCategoria.textContent = dados.categoria;
        modalTitulo.textContent = dados.titulo;
        modalDescricao.textContent = dados.descricao;
        
      
        modal.classList.remove('oculto');
      }
    });
  });


  window.fecharModal = function() {
    if (modal) {
      modal.classList.add('oculto');
    }
  }

 
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        fecharModal();
      }
    });
  }

});