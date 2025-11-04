import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Flex, 
  Link, 
  Button, 
  Heading, 
  Text, 
  Badge, 
  HStack, 
  Container, 
  Icon 
} from '@chakra-ui/react';

import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';

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

  const cartItemCount = cart.length;

  return (
    // USANDO O TEMA: bg="fundo" é #fff (branco)
    <Box 
      bg="fundo" 
      px={4} 
      py={3} 
      boxShadow="sm" // var(--sombra-padrao)
      color="textoEscuro"
      position="sticky" // Para ficar no topo
      top={0}
      zIndex={1100} // Para ficar acima do conteúdo da página
    >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          
          {/* 1. Logomarca (usando cores do tema) */}
          <Heading as={RouterLink} to="/" size="lg" fontWeight="bold">
            <Text as="span" color="textoEscuro">All</Text>
            <Text as="span" color="primaria">Serve</Text> {/* cor --cor-primaria */}
          </Heading>

          {/* 2. Links de Navegação (usando cores do tema) */}
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            <Link as={RouterLink} to="/" fontWeight="medium" _hover={{ color: "primaria" }}>
              Início
            </Link>
            <Link as={RouterLink} to="/sobre" fontWeight="medium" _hover={{ color: "primaria" }}>
              Sobre
            </Link>
            <Link as={RouterLink} to="/profissionais" fontWeight="medium" _hover={{ color: "primaria" }}>
              Profissionais
            </Link>
          </HStack>

          {/* 3. Ações do Usuário */}
          <HStack spacing={4} align="center">
            
            <Link as={RouterLink} to="/carrinho" aria-label="Carrinho" position="relative" p={2} _hover={{ color: "primaria" }}>
              <Icon as={FaShoppingCart} fontSize="lg" />
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
                <Link as={RouterLink} to="/dashboard" aria-label="Minha Conta" p={2} _hover={{ color: "primaria" }}>
                  <Icon as={FaUser} fontSize="lg" />
                </Link>
                
                <Button
                  leftIcon={<Icon as={FaSignOutAlt} />}
                  variant="link"
                  color="textoEscuro"
                  size="sm"
                  onClick={handleLogout}
                  _hover={{ color: "primaria" }}
                  display={{ base: 'none', md: 'flex' }}
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link as={RouterLink} to="/login" aria-label="Entrar" p={2} _hover={{ color: "primaria" }}>
                  <Icon as={FaUser} fontSize="lg" />
                </Link>
                
                {/* USANDO O TEMA: variant="principal" (do seu .botao-principal) */}
                <Button 
                  as={RouterLink} 
                  to="/signup" 
                  variant="principal" 
                  size="sm"
                  display={{ base: 'none', md: 'flex' }}
                >
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