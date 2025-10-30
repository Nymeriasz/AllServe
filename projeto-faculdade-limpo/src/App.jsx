// src/App.jsx (VERSÃO FINAL CORRIGIDA)

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importa os NOVOS componentes visuais
import Navbar from "./components/Navbar.jsx"; // Você importou como 'Navbar'
import Footer from './components/Footer.jsx';

// Importa SUAS PÁGINAS onde a lógica já existe ou será adaptada
import Home from './pages/Home.jsx';
import BuscarBartenders from './pages/BuscarBartenders.jsx';
import PerfilBartender from './pages/PerfilBartender.jsx';
import Checkout from './pages/Checkout.jsx'; // Sua página de checkout/carrinho
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx'; // Rota adicionada
import HistoricoPagamentos from './pages/HistoricoPagamentos.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import AvaliarBartender from './pages/AvaliarBartender.jsx'; // Rota adicionada
import SobrePage from './pages/SobrePage.jsx'; // Incluindo a página Sobre que você tem

// Importe SEUS componentes de proteção de rota
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AdminRoute from './routes/AdminRoute.jsx';
import ModerarAvaliacoes from './pages/ModerarAvaliacoes.jsx';

// O CartProvider está no main.jsx

function App() {
  return (
    <BrowserRouter>
      {/* --- CORREÇÃO AQUI --- */}
      <Navbar /> {/* Estava <Header />, mas você importou como <Navbar /> */}
      <main> {/* O conteúdo principal será renderizado aqui */}
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<SobrePage />} /> {/* Rota Sobre incluída */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Rota incluída */}

          {/* Rotas Protegidas */}
          <Route path="/profissionais" element={<ProtectedRoute><BuscarBartenders /></ProtectedRoute>} /> {/* Mapeia para SUA Busca */}
          {/* Mantém SUA rota /bartender/:id */}
          <Route path="/bartender/:bartenderId" element={<ProtectedRoute><PerfilBartender /></ProtectedRoute>} />
          {/* Mapeia /carrinho (link do Header) para SEU Checkout */}
          <Route path="/carrinho" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          {/* Mantém SUA rota /checkout (caso precise acessar diretamente) */}
           <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/historico-pagamentos" element={<ProtectedRoute><HistoricoPagamentos /></ProtectedRoute>} />
          <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/avaliar/:bartenderId" element={<ProtectedRoute><AvaliarBartender /></ProtectedRoute>} /> {/* Rota incluída */}

          {/* Rotas de Admin */}
          <Route path="/admin/moderar-avaliacoes" element={<ProtectedRoute><AdminRoute><ModerarAvaliacoes /></AdminRoute></ProtectedRoute>} />

          {/* Mapeia /perfil-usuario (link do Header) para SUA Dashboard */}
          <Route path="/perfil-usuario" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        </Routes>
      </main>
      <Footer /> {/* Usa o NOVO Footer */}
    </BrowserRouter>
  );
}

export default App;