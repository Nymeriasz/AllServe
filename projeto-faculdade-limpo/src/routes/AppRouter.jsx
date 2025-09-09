// src/routes/AppRouter.jsx

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import SignUp from '../pages/SignUp.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Layout from '../components/Layout.jsx';
import ForgotPassword from '../pages/ForgotPassword.jsx';

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
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}