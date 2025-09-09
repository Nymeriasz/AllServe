// src/routes/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Spinner, Center } from '@chakra-ui/react';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // Se a autenticação ainda está sendo verificada, mostre um spinner
  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // Se a verificação terminou e não há usuário, redirecione para o login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Se a verificação terminou e há um usuário, mostre a página
  return children;
}