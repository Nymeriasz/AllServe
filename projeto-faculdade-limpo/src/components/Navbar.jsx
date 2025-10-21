// src/components/Navbar.jsx

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Flex, Link, Button, Heading, Text, Badge } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx'; 
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config.js';

export default function Navbar() {
  const { currentUser } = useAuth();
  const { cart } = useCart(); 
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <Box bg="teal.500" p={4} color="white">
      <Flex maxW="container.xl" margin="auto" justify="space-between" align="center">
        <Heading as={RouterLink} to="/" size="md">
          Meu App
        </Heading>
        <Flex gap={4} align="center">
          {currentUser ? (
            <>
              <Link as={RouterLink} to="/buscar">
                Buscar Bartenders
              </Link>
              <Link as={RouterLink} to="/dashboard">
                Dashboard
              </Link>
              
              {/* Link do Carrinho */}
              <Link as={RouterLink} to="/checkout" position="relative">
                Carrinho
                {cart.length > 0 && (
                  <Badge
                    colorScheme="red"
                    borderRadius="full"
                    boxSize="20px"
                    fontSize="0.7em"
                    position="absolute"
                    top="-8px"
                    right="-15px"
                  >
                    {cart.length}
                  </Badge>
                )}
              </Link>
              
              <Text>Olá, {currentUser.email}</Text>
              <Button colorScheme="red" size="sm" onClick={handleLogout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link as={RouterLink} to="/login">
                Entrar
              </Link>
              <Link as={RouterLink} to="/signup">
                Criar Conta
              </Link>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}