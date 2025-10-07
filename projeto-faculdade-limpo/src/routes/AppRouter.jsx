// src/routes/AppRouter.jsx

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import SignUp from '../pages/SignUp.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Layout from '../components/Layout.jsx';
import ForgotPassword from '../pages/ForgotPassword.jsx';
import ListaBartenders from '../pages/ListaBartenders.jsx';
import AvaliarBartender from '../pages/AvaliarBartender.jsx';
import PerfilBartender from '../pages/PerfilBartender.jsx';
import ModerarAvaliacoes from '../pages/ModerarAvaliacoes.jsx';
import AdminRoute from './AdminRoute.jsx'; 
import BuscarBartenders from '../pages/BuscarBartenders.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'buscar', // Nova rota
        element: (
          <ProtectedRoute>
            <BuscarBartenders />
          </ProtectedRoute>
        ),
      },

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
      // Novas Rotas
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
            {/* Rota protegida apenas para admins */}
            <AdminRoute>
              <ModerarAvaliacoes />
            </AdminRoute>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}