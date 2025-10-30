// src/pages/Dashboard.jsx (Corrigido o import)

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import {
  Box, Container, Flex, Heading, Text, VStack, Button,
  Image, Spinner, Center, HStack // <-- CORREÇÃO AQUI: HStack foi adicionado
} from '@chakra-ui/react';

// --- Cores do seu Home.jsx ---
const CustomGold = "#A5874D";
const DarkText = "#292728";

const LoadingSpinner = () => (
  <Center h="50vh">
    <Spinner size="xl" color={CustomGold} />
    <Text ml={4}>Carregando dados do usuário...</Text>
  </Center>
);

// Componente para os botões do menu
const MenuButton = ({ isActive, onClick, iconClass, children }) => (
  <Button
    variant={isActive ? "solid" : "ghost"}
    bg={isActive ? CustomGold : "transparent"}
    color={isActive ? "white" : DarkText}
    _hover={{ bg: isActive ? '#8C713B' : 'gray.100' }}
    justifyContent="flex-start"
    w="100%"
    leftIcon={<Box as="i" className={iconClass} mr={2} />}
    onClick={onClick}
  >
    {children}
  </Button>
);

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('loading');
  const navigate = useNavigate();

  // --- Lógica de Busca de Dados (Mantida 100%) ---
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setActiveTab(
            data.role === 'administrador'
              ? 'admin'
              : data.role === 'bartender'
              ? 'meu-perfil'
              : 'pedidos'
          );
        } else {
          console.log('Usuário não encontrado!');
          navigate('/login');
        }
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [currentUser, navigate]);

  // --- Lógica de Logout (Mantida 100%) ---
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Erro ao sair:', err);
    }
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  if (loading || !userData) return <LoadingSpinner />;

  // --- JSX (Convertido para Chakra UI) ---
  return (
    <Container maxW="container.lg" py={{ base: 10, md: 16 }}>
      <Flex direction={{ base: 'column', md: 'row' }} gap={10}>
        
        {/* Coluna da Esquerda: Menu de Navegação */}
        <Box w={{ base: '100%', md: '300px' }} flexShrink={0}>
          {/* Card de Informação do Usuário */}
          <VStack 
            spacing={4} 
            p={6} 
            bg="gray.50" 
            borderRadius="md" 
            boxShadow="sm" 
            align="center" 
            mb={6}
          >
            <Image
              borderRadius="full"
              boxSize="100px"
              src={userData.fotoURL || '/img/avatar-exemplo.png'}
              alt="Avatar"
              objectFit="cover"
              border="3px solid"
              borderColor={CustomGold}
            />
            <Heading size="md" color={DarkText}>Olá, {userData.nome || 'Usuário'}!</Heading>
            <Text color="gray.600" fontSize="sm">{userData.email}</Text>
          </VStack>

          {/* Menu */}
          <VStack as="nav" align="stretch" spacing={2}>
            {userData.role === 'cliente' && (
              <>
                <MenuButton
                  isActive={activeTab === 'pedidos'}
                  onClick={() => handleTabClick('pedidos')}
                  iconClass="fa-solid fa-receipt"
                >
                  Meus Pedidos
                </MenuButton>
                <MenuButton
                  isActive={activeTab === 'favoritos'}
                  onClick={() => handleTabClick('favoritos')}
                  iconClass="fa-regular fa-heart"
                >
                  Favoritos
                </MenuButton>
              </>
            )}

            {userData.role === 'bartender' && (
              <MenuButton
                isActive={activeTab === 'meu-perfil'}
                onClick={() => handleTabClick('meu-perfil')}
                iconClass="fa-solid fa-user-tie"
              >
                Meu Perfil
              </MenuButton>
            )}

            {userData.role === 'administrador' && (
              <MenuButton
                isActive={activeTab === 'admin'}
                onClick={() => handleTabClick('admin')}
                iconClass="fa-solid fa-shield-halved"
              >
                Painel Admin
              </MenuButton>
            )}
            
            <MenuButton
              isActive={activeTab === 'config'}
              onClick={() => handleTabClick('config')}
              iconClass="fa-solid fa-gear"
            >
              Configurações
            </MenuButton>

            <Button
              variant="ghost"
              color="red.500"
              _hover={{ bg: 'red.50' }}
              justifyContent="flex-start"
              w="100%"
              leftIcon={<Box as="i" className="fa-solid fa-right-from-bracket" mr={2} />}
              onClick={handleLogout}
            >
              Sair
            </Button>
          </VStack>
        </Box>

        {/* Coluna da Direita: Conteúdo das Abas */}
        <Box flex={1} bg="white" p={8} borderRadius="md" boxShadow="sm">
          {/* Painel de Pedidos */}
          <Box display={activeTab === 'pedidos' ? 'block' : 'none'}>
            <Heading size="lg" mb={6}>Meus Pedidos</Heading>
            <Text mb={4}>Em breve: histórico de contratações.</Text>
            {/* Exemplo de card (convertido) */}
            <Flex borderWidth={1} borderRadius="md" p={4} align="center" justify="space-between">
              <HStack spacing={4}> {/* <--- O HStack que estava causando o erro */}
                <Image src="/img/hermione.png" alt="Exemplo" boxSize="60px" borderRadius="md" objectFit="cover" />
                <Box>
                  <Heading size="sm">Contratação de Barista (Exemplo)</Heading>
                  <Text fontSize="sm">Profissional: <strong>Hermione Granger</strong></Text>
                  <Text fontSize="sm" color="gray.600">Data: 25/10/2025</Text>
                </Box>
              </HStack>
              <VStack align="flex-end">
                <Text color="green.500" fontWeight="bold">Concluído</Text>
                <Text fontWeight="bold" fontSize="lg">R$ 2.000,00</Text>
              </VStack>
            </Flex>
          </Box>

          {/* Painel de Favoritos */}
          <Box display={activeTab === 'favoritos' ? 'block' : 'none'}>
            <Heading size="lg" mb={6}>Meus Favoritos</Heading>
            <Text>Nenhum profissional favorito ainda.</Text>
          </Box>

          {/* Painel de Configurações */}
          <Box display={activeTab === 'config' ? 'block' : 'none'}>
            <Heading size="lg" mb={6}>Configurações da Conta</Heading>
            <Text>Em breve: alterar senha e dados de pagamento.</Text>
          </Box>

          {/* Painel de Bartender */}
          <Box display={activeTab === 'meu-perfil' ? 'block' : 'none'}>
            <Heading size="lg" mb={6}>Meu Perfil de Bartender</Heading>
            <Text mb={4}>Aqui você poderá editar suas informações, preço e biografia.</Text>
            <Button as={Link} to={`/bartender/${currentUser.uid}`} bg={CustomGold} color="white" _hover={{ bg: '#8C713B' }}>
              Ver meu Perfil Público
            </Button>
          </Box>

          {/* Painel de Admin */}
          <Box display={activeTab === 'admin' ? 'block' : 'none'}>
            <Heading size="lg" mb={6}>Painel do Administrador</Heading>
            <Text mb={4}>Gerenciamento do sistema.</Text>
            <Button as={Link} to="/admin/moderar-avaliacoes" bg={CustomGold} color="white" _hover={{ bg: '#8C713B' }}>
              Moderar Avaliações
            </Button>
          </Box>
        </Box>
      </Flex>
    </Container>
  );
}