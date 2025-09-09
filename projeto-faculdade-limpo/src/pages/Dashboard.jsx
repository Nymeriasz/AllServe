// src/pages/Dashboard.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Heading, Text, Spinner, Center, VStack } from '@chakra-ui/react';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config.js';
import { useAuth } from '../context/AuthContext.jsx';
import AdminPanel from '../components/AdminPanel.jsx'; 

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("Documento do usuário não encontrado no Firestore!");
        }
        setLoading(false);
      }
    };
    fetchUserData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (loading) {
    return <Center h="100vh"><Spinner size="xl" /></Center>;
  }

  return (
    <Box p={8}>
      <VStack spacing={4} align="flex-start">
        <Heading>Dashboard</Heading>
        {userData ? (
          <>
            <Text fontSize="xl">Bem-vindo, {userData.email}!</Text>
            <Text fontSize="lg">Seu papel é: <strong>{userData.role}</strong></Text>

            {/* Mostra painel só para admin */}
            {userData.role === 'administrador' && <AdminPanel />}
            
          </>
        ) : (
          <Text>Não foi possível carregar os dados do usuário.</Text>
        )}
        <Button colorScheme="red" onClick={handleLogout}>
          Sair
        </Button>
      </VStack>
    </Box>
  );
}