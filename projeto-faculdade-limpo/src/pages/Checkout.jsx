// src/pages/Checkout.jsx (Arquivo Corrigido e Estilizado)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx'; 

// Adicionamos a taxa aqui, fora do componente
const TAXA_PLATAFORMA_PERCENTUAL = 0.10; // 10%

export default function Checkout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Usando o useCart que já tem tudo que precisamos
  const { cart, removeFromCart, clearCart } = useCart();

  // --- LÓGICA DE CÁLCULO CORRIGIDA ---
  
  // 1. Calcula o subtotal (Preço/Hora * Quantidade de Horas)
  const subtotal = cart.reduce((acc, item) => {
    const preco = Number(item.precoPorHora) || 0;
    const quant = Number(item.quantity) || 1;
    return acc + (preco * quant);
  }, 0);

  // 2. Calcula a taxa com base no subtotal
  const taxaPlataforma = subtotal * TAXA_PLATAFORMA_PERCENTUAL;

  // 3. Calcula o total final
  const valorTotal = subtotal + taxaPlataforma;

  // Formata os valores para exibição
  const subtotalFormatado = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  const taxaFormatada = `R$ ${taxaPlataforma.toFixed(2).replace('.', ',')}`;
  const totalFormatado = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;

  // Função para simular o pagamento (lógica do seu Checkout.jsx)
  const handleSimulatePayment = async () => {
    if (cart.length === 0) return; // Não faz nada se o carrinho estiver vazio

    setIsProcessing(true);

    // Simula um delay de processamento de pagamento
    setTimeout(async () => {
      try {
        // Salva o pedido no Firestore
        const pagamentosRef = collection(db, "pagamentos");
        await addDoc(pagamentosRef, {
          clienteId: currentUser.uid,
          clienteEmail: currentUser.email,
          // Salva os itens com a quantidade e preço corretos
          itens: cart.map(item => ({
            id: item.id,
            nome: item.nome,
            precoPorHora: item.precoPorHora,
            quantity: item.quantity
          })),
          valorBase: subtotal,
          taxa: taxaPlataforma,
          valor: valorTotal,
          status: "Aprovado",
          criadoEm: serverTimestamp(),
        });
        
        // Limpa o carrinho e navega para a página de sucesso
        clearCart();
        navigate('/payment-success'); // Certifique-se que essa rota existe

      } catch (error) {
        console.error("Erro ao salvar pagamento:", error);
        // Você pode adicionar um toast ou alerta aqui
        alert("Erro ao processar seu pagamento. Tente novamente.");
        setIsProcessing(false);
      }
    }, 2000); // Delay de 2 segundos
  };

  // --- JSX (Layout do seu CarrinhoPage.jsx original) ---
  return (
    <div>
      <section className="pagina-banner">
        <div className="container"><h1>Carrinho e Checkout</h1></div>
      </section>
      
      <section className="pagina-conteudo">
        <div className="carrinho-container">
          <div className="carrinho-itens">
            <div className="carrinho-header">
                <span className="header-profissional">Profissional</span>
                <span className="header-valor">Valor/Hora</span>
                <span className="header-hora">Hora(s)</span>
                <span className="header-total">Total</span>
            </div>

            {cart.length === 0 ? (
              <p className="carrinho-vazio" style={{ padding: '20px' }}>Seu carrinho está vazio.</p>
            ) : (
              cart.map(item => {
                // Pegamos os dados direto do item no carrinho
                // (Graças à correção que fizemos no PerfilBartender.jsx)
                const precoHora = Number(item.precoPorHora) || 0;
                const quant = Number(item.quantity) || 1;
                const totalItem = precoHora * quant;

                const itemTotalFormatado = `R$ ${totalItem.toFixed(2).replace('.', ',')}`;
                const itemPrecoFormatado = `R$ ${precoHora.toFixed(2).replace('.', ',')}`;
                const placeholderImage = '/img/avatar-placeholder.png';


                return (
                  <div key={item.id} className="carrinho-item">
                    <div className="item-info">
                      {/* Usamos a imagem salva no carrinho */}
                      <img src={item.imagem || placeholderImage} alt={item.nome} />
                      <div>
                        {/* <p className="item-categoria">{item.categoria || 'Bartender'}</p> */}
                        <h3 className="item-nome">{item.nome}</h3>
                      </div>
                    </div>
                    <div className="item-valor">{itemPrecoFormatado}</div>
                    <div className="item-quantidade">
                      {/* O input é readOnly pois a quantidade foi definida na página de perfil */}
                      <input type="number" value={quant} min="1" readOnly />
                    </div>
                    <div className="item-total">{itemTotalFormatado}</div>
                    <div className="item-remover">
                      <button 
                        onClick={() => !isProcessing && removeFromCart(item.id)} 
                        className="remover-btn"
                        disabled={isProcessing}
                      >
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          {/* Resumo do Pedido (com a lógica de taxa) */}
          <div className="carrinho-resumo">
            <h3>Resumo do Pedido</h3>
            <div className="resumo-linha">
              <span>Subtotal (Serviços)</span>
              <span className="resumo-subtotal">{subtotalFormatado}</span>
            </div>
            <div className="resumo-linha">
              <span>Taxa da plataforma (10%)</span>
              <span className="resumo-subtotal">{taxaFormatada}</span>
            </div>
            <div className="resumo-linha total">
              <span>Total</span>
              <span className="resumo-total">{totalFormatado}</span>
            </div>
            
            {/* Botão de Pagamento */}
            <button 
              onClick={handleSimulatePayment} 
              className="botao-contratar" // Reutiliza a classe CSS
              disabled={isProcessing || cart.length === 0}
            >
              {isProcessing ? 'Processando...' : 'Pagar Agora (Simulado)'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}