// src/components/Navbar.jsx (Estilizado com Chakra UI - CARRINHO CORRIGIDO)

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Flex, Link, Button, Heading, Text, Badge, Icon, HStack, Container } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config.js';

// --- Cores do seu Home.jsx ---
const PrimaryBg = "#E9E0D4";
const CustomGold = "#A5874D";
const DarkText = "#292728";

// --- Componente para o ícone (assume FontAwesome) ---
const FaIcon = ({ className }) => (
  <Box as="i" className={className} fontSize="lg" color={DarkText} />
);

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

  const cartItemCount = cart.length;

  return (
    <Box bg={PrimaryBg} px={4} py={3} boxShadow="sm" color={DarkText}>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          
          {/* 1. A Logomarca */}
          <Heading as={RouterLink} to="/" size="lg" fontWeight="bold">
            <Text as="span" color={DarkText}>All</Text>
            <Text as="span" color={CustomGold}>Serve</Text>
          </Heading>

          {/* 2. Links de Navegação (Centralizados) */}
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            <Link as={RouterLink} to="/" fontWeight="medium" _hover={{ color: CustomGold }}>
              Início
            </Link>
            <Link as={RouterLink} to="/sobre" fontWeight="medium" _hover={{ color: CustomGold }}>
              Sobre
            </Link>
            <Link as={RouterLink} to="/profissionais" fontWeight="medium" _hover={{ color: CustomGold }}>
              Profissionais
            </Link>
          </HStack>

          {/* 3. Ações do Usuário */}
          <HStack spacing={4} align="center">
            
            {/* --- CORREÇÃO: ÍCONE DO CARRINHO MOVido PARA FORA --- */}
            {/* Agora ele aparece mesmo se o usuário estiver deslogado */}
            <Link as={RouterLink} to="/carrinho" aria-label="Carrinho" position="relative" p={2} _hover={{ color: CustomGold }}>
              <FaIcon className="fa-solid fa-cart-shopping" />
              {cartItemCount > 0 && (
                <Badge
                  colorScheme="red"
                  borderRadius="full"
                  boxSize="18px"
                  fontSize="0.7em"
                  position="absolute"
                  top="0"
                  right="-5px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Link>

            {/* 4. Lógica de Autenticação */}
            {currentUser ? (
              <>
                {/* --- ESTADO LOGADO --- */}
                <Link as={RouterLink} to="/dashboard" aria-label="Minha Conta" p={2} _hover={{ color: CustomGold }}>
                  <FaIcon className="fa-regular fa-user" />
                </Link>
                
                <Button
                  leftIcon={<FaIcon className="fa-solid fa-right-from-bracket" />}
                  variant="link"
                  color={DarkText}
                  size="sm"
                  onClick={handleLogout}
                  _hover={{ color: CustomGold }}
                  display={{ base: 'none', md: 'flex' }} // Esconde texto "Sair" em telas pequenas
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                {/* --- ESTADO DESLOGADO --- */}
                {/* O Ícone de usuário agora leva para o Login */}
                <Link as={RouterLink} to="/login" aria-label="Entrar" p={2} _hover={{ color: CustomGold }}>
                  <FaIcon className="fa-regular fa-user" />
                </Link>
                
                <Button as={RouterLink} to="/signup" bg={CustomGold} color="white" size="sm" _hover={{ bg: '#8C713B' }} display={{ base: 'none', md: 'flex' }}>
                  Criar Conta
                </Button>
              </>
            )}
          </HStack>

        </Flex>
      </Container>
    </Box>
  );
}