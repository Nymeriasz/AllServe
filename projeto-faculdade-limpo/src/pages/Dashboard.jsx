// src/pages/Dashboard.jsx (Lógica + Visual)

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'; // Importações extras para pedidos
import { auth, db } from '../firebase/config.js';
import { useAuth } from '../context/AuthContext.jsx';

// (Opcional) Você pode mover os painéis de conteúdo para componentes separados depois
// import AdminPanel from '../components/AdminPanel.jsx'; 
// import HistoricoPedidos from '../components/HistoricoPedidos.jsx';

// Componente simples de Loading
const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <p>Carregando dados do usuário...</p>
  </div>
);

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Estado para controlar a aba ativa (lógica do UsuarioPage.jsx)
  const [activeTab, setActiveTab] = useState('loading'); // Começa como loading

  // (Opcional) Estado para guardar os pedidos do cliente
  // const [pedidos, setPedidos] = useState([]);

  // --- LÓGICA DE BUSCA DE DADOS (do Dashboard.jsx) ---
  useEffect(() => {
    if (!currentUser) {
      navigate('/login'); // Se não há usuário, manda pro login
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          
          // Define a aba inicial com base no papel do usuário
          if (data.role === 'administrador') {
            setActiveTab('admin');
          } else if (data.role === 'bartender') {
            setActiveTab('meu-perfil');
          } else {
            setActiveTab('pedidos'); // Padrão para cliente
          }
        } else {
          console.log('Documento do usuário não encontrado!');
          navigate('/login'); // Se não acha o doc, desloga
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    
    // (Opcional) Aqui você também poderia buscar os pedidos do cliente
    // const fetchPedidos = async () => { ... }
    // if (currentUser) fetchPedidos();

  }, [currentUser, navigate]);

  // --- LÓGICA DE AÇÕES (do Dashboard.jsx e UsuarioPage.jsx) ---
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleTabClick = (tabName) => {
      setActiveTab(tabName);
  };

  // --- RENDERIZAÇÃO ---
  if (loading || !userData) {
    return <LoadingSpinner />;
  }

  // --- JSX (Visual do UsuarioPage.jsx) ---
  return (
    <section className="pagina-conteudo">
      <div className="container perfil-usuario-container">
        
        <aside className="perfil-nav">
          <div className="user-info-card">
            <img 
              src={userData.fotoURL || '/img/avatar-exemplo.png'} 
              alt="Avatar do usuário" 
              className="user-avatar" 
            />
            <h3>Olá, {userData.nome || 'Usuário'}!</h3>
            <p>{userData.email}</p>
          </div>
          <nav className="perfil-menu">
            <ul>
              {/* Links do Cliente */}
              {userData.role === 'cliente' && (
                <>
                  <li>
                    <a href="#" 
                       className={`menu-link ${activeTab === 'pedidos' ? 'active' : ''}`}
                       onClick={(e) => { e.preventDefault(); handleTabClick('pedidos'); }}>
                       <i className="fa-solid fa-receipt"></i> Meus Pedidos
                    </a>
                  </li>
                  <li>
                    <a href="#" 
                       className={`menu-link ${activeTab === 'favoritos' ? 'active' : ''}`}
                       onClick={(e) => { e.preventDefault(); handleTabClick('favoritos'); }}>
                       <i className="fa-regular fa-heart"></i> Favoritos
                    </a>
                  </li>
                </>
              )}

              {/* Links do Bartender */}
              {userData.role === 'bartender' && (
                <li>
                  <a href="#" 
                     className={`menu-link ${activeTab === 'meu-perfil' ? 'active' : ''}`}
                     onClick={(e) => { e.preventDefault(); handleTabClick('meu-perfil'); }}>
                     <i className="fa-solid fa-user-tie"></i> Meu Perfil
                  </a>
                </li>
              )}

              {/* Links do Admin */}
              {userData.role === 'administrador' && (
                <li>
                  <a href="#" 
                     className={`menu-link ${activeTab === 'admin' ? 'active' : ''}`}
                     onClick={(e) => { e.preventDefault(); handleTabClick('admin'); }}>
                     <i className="fa-solid fa-shield-halved"></i> Painel Admin
                  </a>
                </li>
              )}

              {/* Links Comuns */}
              <li>
                <a href="#" 
                   className={`menu-link ${activeTab === 'config' ? 'active' : ''}`}
                   onClick={(e) => { e.preventDefault(); handleTabClick('config'); }}>
                   <i className="fa-solid fa-gear"></i> Configurações
                </a>
              </li>
              <li>
                {/* Botão de Sair agora usa o handleLogout */}
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="menu-link">
                  <i className="fa-solid fa-right-from-bracket"></i> Sair
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <section className="perfil-conteudo">
          
          {/* --- PAINÉIS DE CONTEÚDO --- */}

          <div id="pedidos" className={`painel-conteudo ${activeTab === 'pedidos' ? 'active' : ''}`}>
            <h2>Meus Pedidos</h2>
            {/* Aqui você pode renderizar os pedidos ou importar 
              o componente <HistoricoPagamentos /> que busca os dados
            */}
            <p>Em breve: Você verá seu histórico de contratações aqui.</p>
            {/* Exemplo de card (do UsuarioPage.jsx) */}
            <div className="pedido-card">
              <div className="pedido-info">
                  <img src="/img/hermione.png" alt="Exemplo" />
                  <div>
                      <h4>Contratação de Barista (Exemplo)</h4>
                      <p>Profissional: <strong>Hermione Granger</strong></p>
                      <p>Data: 25/10/2025</p>
                  </div>
              </div>
              <div className="pedido-status">
                  <span className="status concluido">Concluído</span>
                  <span className="pedido-valor">R$ 2.000,00</span>
              </div>
            </div>
          </div>

          <div id="favoritos" className={`painel-conteudo ${activeTab === 'favoritos' ? 'active' : ''}`}>
            <h2>Meus Favoritos</h2>
            <p>Você ainda não marcou nenhum profissional como favorito.</p>
          </div>

          <div id="config" className={`painel-conteudo ${activeTab === 'config' ? 'active' : ''}`}>
            <h2>Configurações da Conta</h2>
            <p>Em breve, aqui você poderá alterar sua senha e informações de pagamento.</p>
          </div>

          {/* Painel do Bartender */}
          <div id="meu-perfil" className={`painel-conteudo ${activeTab === 'meu-perfil' ? 'active' : ''}`}>
            <h2>Meu Perfil de Bartender</h2>
            <p>Aqui você poderá editar suas informações, preço, fotos e biografia.</p>
            <Link to={`/bartender/${currentUser.uid}`} className="botao-secundario">
              Ver meu Perfil Público
            </Link>
          </div>

          {/* Painel do Admin */}
          <div id="admin" className={`painel-conteudo ${activeTab === 'admin' ? 'active' : ''}`}>
            <h2>Painel do Administrador</h2>
            {/* <AdminPanel /> */}
            <p>Carregando painel de administração...</p>
            <Link to="/admin/moderar-avaliacoes" className="botao-secundario">
              Moderar Avaliações
            </Link>
          </div>

        </section>
      </div>
    </section>
  );
}