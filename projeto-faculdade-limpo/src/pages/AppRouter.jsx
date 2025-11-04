// src/pages/AppRouter.jsx (CORRIGIDO)

import { createBrowserRouter } from 'react-router-dom'; 
import Home from './Home.jsx'; 
import Login from './Login.jsx'; 
import SignUp from './SignUp.jsx'; 
import Dashboard from './Dashboard.jsx'; 
import ProtectedRoute from '../routes/ProtectedRoute.jsx'; 
import Layout from '../components/Layout.jsx'; 
import ForgotPassword from './ForgotPassword.jsx'; 

// Importações das rotas de avaliação
import ListaBartenders from './ListaBartenders.jsx'; 
import AvaliarBartender from './AvaliarBartender.jsx'; 
import PerfilBartender from './PerfilBartender.jsx'; 
import ModerarAvaliacoes from './ModerarAvaliacoes.jsx';
import AdminRoute from '../routes/AdminRoute.jsx'; 

// Importação da rota de busca
import BuscarBartenders from './BuscarBartenders.jsx'; 

// Importações das rotas de pagamento 
import Checkout from './Checkout.jsx'; 
import PaymentSuccess from './PaymentSuccess.jsx'; 
import HistoricoPagamentos from './HistoricoPagamentos.jsx'; 

// Importação da página Sobre
import SobrePage from './SobrePage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      // Rota 'Sobre' adicionada
      {
        path: 'sobre',
        element: <SobrePage />,
      },
      // Rotas de Avaliação
      {
        path: 'bartenders', // Rota antiga (pode remover se não usar)
        element: (
          <ProtectedRoute>
            <ListaBartenders />
          </ProtectedRoute>
        ),
      },
      {
        path: 'bartender/:bartenderId',
        element: (
          <ProtectedRoute>
            <PerfilBartender />
          </ProtectedRoute>
        ),
      },
      {
        path: 'avaliar/:bartenderId',
        element: (
          <ProtectedRoute>
            <AvaliarBartender />
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