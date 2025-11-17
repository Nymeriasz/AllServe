import {
  Box, Flex, HStack, Link as ChakraLink, IconButton, Menu, MenuButton,
  MenuList, MenuItem, Avatar, Button, useDisclosure, VStack, Text
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const NavLink = ({ to, children, isActive }) => (
  <ChakraLink
    as={RouterLink}
    to={to}
    px={3}
    py={2}
    fontWeight="medium"
    color={isActive ? '#c49b3f' : 'black'}
    _hover={{ textDecoration: 'none', color: '#c49b3f' }}
  >
    {children}
  </ChakraLink>
);

export default function Navbar() {
  const { currentUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <Box bg="white" px={6} boxShadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="container.xl" mx="auto">
        <ChakraLink as={RouterLink} to="/home" _hover={{ textDecoration: 'none' }}>
          <Text fontSize="xl" fontWeight="bold">
            <Text as="span" color="black">All</Text>
            <Text as="span" color="#c49b3f">Serve</Text>
          </Text>
        </ChakraLink>

        <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
          <NavLink to="/home" isActive={location.pathname === '/home'}>Início</NavLink>
          <NavLink to="/sobre" isActive={location.pathname === '/sobre'}>Sobre</NavLink>
          <NavLink to="/profissionais" isActive={location.pathname === '/profissionais'}>Profissionais</NavLink>
        </HStack>

        <HStack spacing={5} display={{ base: 'none', md: 'flex' }}>
          <IconButton
            icon={<FaSearch />}
            aria-label="Pesquisar"
            variant="ghost"
            color="black"
            fontSize="lg"
            _hover={{ color: '#c49b3f', bg: 'transparent' }}
          />
          {currentUser ? (
            <Menu>
              <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
                <Avatar size="sm" name={currentUser.email} />
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/dashboard">Configurações</MenuItem>
                <MenuItem as={RouterLink} to="/historico-pagamentos">Meus Pedidos</MenuItem>
                <MenuItem as={RouterLink} to="/meus-favoritos">Favoritos</MenuItem>
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <IconButton
              as={RouterLink}
              to="/login"
              icon={<FaUser />}
              aria-label="Entrar"
              variant="ghost"
              color="black"
              fontSize="lg"
              _hover={{ color: '#c49b3f', bg: 'transparent' }}
            />
          )}
          <IconButton
            as={RouterLink}
            to="/carrinho"
            icon={<FaShoppingCart />}
            aria-label="Carrinho"
            variant="ghost"
            color="black"
            fontSize="lg"
            _hover={{ color: '#c49b3f', bg: 'transparent' }}
          />
        </HStack>

        <IconButton
          size="md"
          icon={isOpen ? <FaTimes /> : <FaBars />}
          aria-label="Abrir Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
          bg="transparent"
          color="black"
          _hover={{ color: '#c49b3f' }}
        />
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <VStack as="nav" spacing={3} align="stretch">
            <NavLink to="/home" isActive={location.pathname === '/home'}>Início</NavLink>
            <NavLink to="/sobre" isActive={location.pathname === '/sobre'}>Sobre</NavLink>
            <NavLink to="/profissionais" isActive={location.pathname === '/profissionais'}>Profissionais</NavLink>
            <hr />
            {currentUser ? (
              <>
                <NavLink to="/dashboard">Configurações</NavLink>
                <NavLink to="/historico-pagamentos">Meus Pedidos</NavLink>
                <NavLink to="/meus-favoritos">Favoritos</NavLink>
                <ChakraLink onClick={handleLogout} px={3} py={2}>Sair</ChakraLink>
              </>
            ) : (
              <>
                <NavLink to="/login">Entrar</NavLink>
                <NavLink to="/signup">Cadastrar</NavLink>
              </>
            )}
          </VStack>
        </Box>
      ) : null}
    </Box>
  );
}