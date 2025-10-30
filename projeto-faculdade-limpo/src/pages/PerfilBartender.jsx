// src/pages/PerfilBartender.jsx (CORRIGIDO)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useCart } from '../context/CartContext.jsx'; // Certifique-se que o caminho está correto
import { useAuth } from '../context/AuthContext.jsx'; // Certifique-se que o caminho está correto

const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <p>Carregando perfil...</p>
  </div>
);

const StarRating = ({ rating = 0 }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="estrelas" style={{ color: '#ffc107' }}>
      {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="fas fa-star" />)}
      {halfStar && <i key="half" className="fas fa-star-half-alt" />}
      {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="far fa-star" />)}
    </div>
  );
};

export default function PerfilBartender() {
  const { bartenderId } = useParams(); // 'bartenderId' deve bater com a sua rota (ex: /bartender/:bartenderId)
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [bartender, setBartender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avaliacoes, setAvaliations] = useState([]);
  const [mediaAvaliacao, setMediaAvaliacao] = useState(0);
  const [activeTab, setActiveTab] = useState('descricao');
  const [quantity, setQuantity] = useState(1); // <-- 1. CORREÇÃO: Adicionado estado de quantidade

  const placeholderImage = '/img/avatar-placeholder.png'; // Definido aqui para usar no handleAddToCart

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Busca os dados do Bartender
        const bartenderDocRef = doc(db, 'users', bartenderId);
        const bartenderDoc = await getDoc(bartenderDocRef);
        if (!bartenderDoc.exists()) {
          console.error('Bartender não encontrado!');
          setBartender(null);
          return;
        }
        setBartender({ id: bartenderDoc.id, ...bartenderDoc.data() });

        // Busca as avaliações (subcoleção)
        const qAvaliacoes = query(
          collection(db, 'users', bartenderId, 'avaliacoes'),
          where('visivel', '==', true)
        );
        const avaliacoesSnap = await getDocs(qAvaliacoes);
        const avaliacoesList = avaliacoesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAvaliations(avaliacoesList);

        // Calcula a média das avaliações
        if (avaliacoesList.length > 0) {
          const totalNotas = avaliacoesList.reduce((acc, curr) => acc + (curr.nota || 0), 0);
          setMediaAvaliacao(totalNotas / avaliacoesList.length);
        } else {
          setMediaAvaliacao(0);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bartenderId) fetchData();
    else setLoading(false);
  }, [bartenderId]);

  const handleAddToCart = () => {
    if (!currentUser) {
      alert('Você precisa estar logado para contratar.');
      navigate('/login');
      return;
    }
    if (!bartender) return;
    
    // <-- 3. CORREÇÃO: Passa objeto completo para o carrinho
    addToCart({
      id: bartender.id,
      nome: bartender.nome || (bartender.email || '').split('@')[0],
      precoPorHora: Number(bartender.precoPorHora) || 0,
      imagem: bartender.fotoURL || placeholderImage, // Passa a imagem
      quantity: quantity // Passa a quantidade selecionada
    });
    
    // Opcional: Redireciona para o carrinho
    navigate('/carrinho'); 
  };

  // --- Variáveis auxiliares para o JSX ---
  const mensagemPadrao = `Olá ${bartender?.nome || ''}, vi seu perfil no site AllServe e gostaria de mais informações.`;
  const urlWhatsapp = bartender?.telefone
    ? `https://wa.me/${bartender.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagemPadrao)}`
    : '#';
  const urlInstagram = bartender?.instagram ? `https://www.instagram.com/${bartender.instagram}/` : '#';

  const preco = Number(bartender?.precoPorHora) || 0;
  const precoFormatado = `R$ ${preco.toFixed(2).replace('.', ',')}`;
  const lightTextColor = '#666';

  if (loading) return <LoadingSpinner />;

  if (!bartender) {
    return (
      <section className="pagina-conteudo">
        <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Profissional não encontrado!</h2>
          <p>O perfil que você está procurando não existe ou foi removido.</p>
        </div>
      </section>
    );
  }

  // --- JSX de Retorno (Visual do 'PerfilPage.jsx') ---
  return (
    <main className="container-perfil">
      <section className="perfil-principal">
        <div className="perfil-imagem-col">
          <img src={bartender.fotoURL || placeholderImage} alt={bartender.nome || 'Foto do profissional'} />
        </div>

        <div className="perfil-info-col">
          <div className="nome-container">
            <h1>{bartender.nome || (bartender.email || '').split('@')[0]}</h1>
          </div>

          <div className="contato-icones">
            {bartender.telefone && (
              <a href={urlWhatsapp} className="btn-social whatsapp" title="Conversar no WhatsApp" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp" />
              </a>
            )}
            {bartender.instagram && (
              <a href={urlInstagram} className="btn-social instagram" title="Ver no Instagram" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram" />
              </a>
            )}
          </div>

          {preco > 0 && <p className="info-preco">{precoFormatado}/hora</p>}

          <div className="info-avaliacao" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StarRating rating={mediaAvaliacao} />
            <span>{avaliacoes.length} {avaliacoes.length === 1 ? 'Avaliação' : 'Avaliações'}</span>
          </div>

          <p className="info-resumo">{bartender.resumo || `Profissional especializado em ${bartender.especialidade || 'diversas áreas'}`}</p>

          {Array.isArray(bartender.tags) && bartender.tags.length > 0 && (
            <>
              <h4>Serviços oferecidos:</h4>
              <div className="info-tags">
                {bartender.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </>
          )}

        {/* <-- 2. CORREÇÃO: Adicionado seletor de quantidade e botão */}
          <div className="info-acoes">
            {preco > 0 ? (
              <>
                <div className="quantidade">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                  <input type="text" value={quantity} readOnly />
                  <button onClick={() => setQuantity(q => q + 1)}>+</button>
                </div>
                <button onClick={handleAddToCart} className="botao-principal contratar">Contratar</button>
              </>
            ) : (
              <p style={{ color: lightTextColor }}>Consulte o preço com o profissional.</p>
            )}
          </div>
        </div>
      </section>

      <section className="perfil-detalhes">
        <nav className="tabs-nav">
          <button className={`tab-btn ${activeTab === 'descricao' ? 'active' : ''}`} onClick={() => setActiveTab('descricao')}>Descrição</button>
          <button className={`tab-btn ${activeTab === 'servicos' ? 'active' : ''}`} onClick={() => setActiveTab('servicos')}>Detalhes</button>
          <button className={`tab-btn ${activeTab === 'avaliacoes' ? 'active' : ''}`} onClick={() => setActiveTab('avaliacoes')}>Avaliações ({avaliacoes.length})</button>
        </nav>

        <div className="tabs-conteudo">
          <div id="tab-descricao" className={`tab-painel ${activeTab === 'descricao' ? 'active' : ''}`}>
            {bartender.descricaoCompleta || bartender.resumo || `Mais detalhes sobre ${bartender.nome} em breve.`}
          </div>

          <div id="tab-servicos" className={`tab-painel ${activeTab === 'servicos' ? 'active' : ''}`}>
            <div className="info-extra">
              <div><span>Categoria:</span> <span>{bartender.especialidade || '—'}</span></div>
€           </div>
          </div>

          <div id="tab-avaliacoes" className={`tab-painel ${activeTab === 'avaliacoes' ? 'active' : ''}`}>
            {avaliacoes.length > 0 ? (
              avaliacoes.map((avaliacao) => (
                <div key={avaliacao.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ fontWeight: 'bold' }}>{avaliacao.clienteEmail || 'Cliente'}</span>
                    <StarRating rating={avaliacao.nota || 0} />
                  </div>
                  <p>{avaliacao.comentario || '-'}</p>
                </div>
              ))
            ) : (
              <p>Este profissional ainda não recebeu avaliações.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}