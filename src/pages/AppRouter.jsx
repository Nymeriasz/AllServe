import { createBrowserRouter } from 'react-router-dom'; 
import Home from './Home.jsx'; 
import Login from './Login.jsx'; 
import SignUp from './SignUp.jsx'; 
import Dashboard from './Dashboard.jsx'; 
import ProtectedRoute from '../routes/ProtectedRoute.jsx'; 
import Layout from '../components/Layout.jsx'; 
import ForgotPassword from './ForgotPassword.jsx'; 
import ListaBartenders from './ListaBartenders.jsx'; 
import PerfilBartender from './PerfilBartender.jsx'; 
import PerfilEmpresa from './PerfilEmpresa.jsx';
import ModerarAvaliacoes from './ModerarAvaliacoes.jsx';
import AdminRoute from '../routes/AdminRoute.jsx'; 
import BuscarBartenders from './BuscarBartenders.jsx'; 
import Checkout from './Checkout.jsx'; 
import PaymentSuccess from './PaymentSuccess.jsx'; 
import HistoricoPagamentos from './HistoricoPagamentos.jsx'; 
import SobrePage from './SobrePage.jsx';
import MeusFavoritos from './MeusFavoritos.jsx';
import EditarPerfil from './EditarPerfil.jsx';

const router = createBrowserRouter([
  
  // Rotas Públicas (Fora do Layout Principal se quiser esconder Navbar/Footer, 
  // mas geralmente Login/SignUp ficam melhor fora ou com layout simplificado)
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },

  // Rotas com Layout (Navbar + Footer)
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        // A rota raiz agora mostra a Home (Vitrine)
        index: true,
        element: <Home />, 
      },
      {
        // Rota 'home' opcional, redireciona para a raiz para evitar conteúdo duplicado
        path: 'home', 
        element: <Home />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'sobre',
        element: <SobrePage />,
      },
      {
        path: 'meus-favoritos', 
        element: (
          <ProtectedRoute>
            <MeusFavoritos />
          </ProtectedRoute>
        ),
      },
      {
        path: 'empresa/:empresaId',
        element: (
          <ProtectedRoute>
            <PerfilEmpresa />
          </ProtectedRoute>
        ),
      },
      {
        path: 'editar-perfil',
        element: (
          <ProtectedRoute>
            <EditarPerfil />
          </ProtectedRoute>
        ),
      },
      {
        path: 'bartenders', 
        element: (
          <ProtectedRoute>
            <ListaBartenders />
          </ProtectedRoute>
        ),
      },
      {
        path: 'bartender/:bartenderId',
        // Perfil pode ser público ou protegido? 
        // Se for público (para SEO/compartilhar), remova o ProtectedRoute.
        // Se for só para logados, mantenha.
        element: (
          <ProtectedRoute>
            <PerfilBartender />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/moderar-avaliacoes',
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <ModerarAvaliacoes />
            </AdminRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profissionais', 
        element: (
          <ProtectedRoute>
            <BuscarBartenders />
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
       {
        path: 'carrinho',
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: 'payment-success',
        element: (
          <ProtectedRoute>
            <PaymentSuccess />
          </ProtectedRoute>
        ),
      },
      {
        path: 'historico-pagamentos',
        element: (
          <ProtectedRoute>
            <HistoricoPagamentos />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router; 