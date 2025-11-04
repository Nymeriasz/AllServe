import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Spinner, Center } from '@chakra-ui/react';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();


  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

 
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  
  return children;
}
