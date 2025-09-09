// src/routes/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Spinner, Center } from '@chakra-ui/react';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // Mostra spinner enquanto carrega
  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // Redireciona se não estiver logado
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Exibe página se logado
  return children;
}
