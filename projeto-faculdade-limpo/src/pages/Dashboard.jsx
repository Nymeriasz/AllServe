import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/config'; 
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; 
import {
  Box, Container, Heading, Text, VStack, HStack, Button,
  Spinner, Center, useToast, Avatar, 
  Card, CardBody, Badge, Icon, Flex, Divider,
  Menu, MenuButton, MenuList, MenuItem, AvatarBadge,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { 
  FaUserEdit, FaCheckCircle, FaCreditCard, FaClock, 
  FaSignOutAlt, FaExternalLinkAlt, FaBell, FaListUl 
} from 'react-icons/fa'; 

import BartenderDashboard from './BartenderDashboard'; 

const CustomGold = "#A5874D";
const DarkText = "#292728";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { addToCart } = useCart(); 
  const navigate = useNavigate();
  const toast = useToast();
  
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [minhasSolicitacoes, setMinhasSolicitacoes] = useState([]);
  const [loadingSolicitacoes, setLoadingSolicitacoes] = useState(true);

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
          setFormData({ ...data });
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser && formData && formData.role !== 'bartender') {
        const q = query(collection(db, 'solicitacoes'), where('clienteId', '==', currentUser.uid));
        const unsubscribe = onSnapshot(q, (snap) => {
            const lista = [];
            snap.forEach(doc => lista.push({id: doc.id, ...doc.data()}));
            lista.sort((a, b) => {
                const dateA = a.createdAt?.seconds || 0;
                const dateB = b.createdAt?.seconds || 0;
                return dateB - dateA;
            });
            setMinhasSolicitacoes(lista);
            setLoadingSolicitacoes(false);
        });
        return () => unsubscribe();
    }
  }, [currentUser, formData]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleProcederPagamento = (solicitacao) => {
    addToCart({
        id: solicitacao.bartenderId,
        nome: solicitacao.bartenderNome || "Bartender",
        precoPorHora: Number(solicitacao.valor) || 0, 
        imagem: solicitacao.bartenderFoto || '/img/avatar-placeholder.png',
        quantity: 1 
    });
    navigate('/carrinho'); 
  };

  const novasRespostas = minhasSolicitacoes.filter(s => s.status === 'aceito' || s.status === 'recusado').length;

  if (loading || !formData) return (
    <Center h="50vh"><Spinner size="xl" color={CustomGold} /><Text ml={4}>Carregando...</Text></Center>
  );

  if (formData.role === 'bartender') {
    return <BartenderDashboard userData={formData} />;
  }

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={10}>
      <Container maxW="container.md">
        
        <Card bg="white" shadow="lg" borderRadius="xl" overflow="visible">
          
          {/* --- BANNER COM GRADIENTE DOURADO (IGUAL AO BARTENDER) --- */}
          <Box h="120px" bgGradient="linear(to-r, #c49b3f, #e5b64e)" borderRadius="xl xl 0 0"></Box>
          
          <CardBody textAlign="center" mt="-60px">
            
            <Menu>
              <MenuButton 
                as={Button} 
                rounded="full" 
                variant="unstyled" 
                cursor="pointer" 
                minW={0}
                w="auto" h="auto"
                _hover={{ transform: 'scale(1.05)' }}
              >
                <Avatar 
                  size="2xl" 
                  name={formData.nome} 
                  src={formData.fotoURL} 
                  border="6px solid white"
                  boxShadow="md"
                >
                  <AvatarBadge 
                    boxSize="1.2em" 
                    bg={novasRespostas > 0 ? "red.500" : "green.500"} 
                    border="3px solid white"
                  >
                    {novasRespostas > 0 && (
                      <Text fontSize="xs" color="white" fontWeight="bold">{novasRespostas}</Text>
                    )}
                  </AvatarBadge>
                </Avatar>
              </MenuButton>

              <MenuList fontSize="md" color="gray.700" zIndex={10} boxShadow="xl">
                <Box px={3} py={2}>
                  <Text fontWeight="bold" fontSize="sm" color="gray.500">MENU DA EMPRESA</Text>
                </Box>
                <Divider />
                
                <MenuItem onClick={onOpen} icon={<FaBell color={novasRespostas > 0 ? "red" : "gray"} />}>
                  Minhas Solicitações
                  {novasRespostas > 0 && (
                    <Badge ml={2} colorScheme="red" borderRadius="full">{novasRespostas} Atualizações</Badge>
                  )}
                </MenuItem>

                <MenuItem onClick={() => navigate('/editar-perfil')} icon={<FaUserEdit />}>
                  Editar Credenciais
                </MenuItem>

                <MenuItem as={Link} to={`/empresa/${currentUser.uid}`} icon={<FaExternalLinkAlt />}>
                  Ver Perfil Público
                </MenuItem>

                <Divider my={1} />
                
                <MenuItem onClick={handleLogout} icon={<FaSignOutAlt />} color="red.500">
                  Sair
                </MenuItem>
              </MenuList>
            </Menu>

            <VStack spacing={1} mt={4}>
              <Heading size="lg" color="#292728">{formData.nome}</Heading>
              <Text color="gray.500">{formData.tipo || "Cliente / Empresa"}</Text>
            </VStack>

            <Box mt={8} p={6} maxW="500px" mx="auto" bg="gray.50" borderRadius="lg" border="1px dashed" borderColor="gray.200">
               <VStack spacing={2}>
                  <Icon as={FaListUl} w={6} h={6} color="gray.400" />
                  <Text color="gray.500" fontWeight="medium">Painel de Controle</Text>
                  <Text fontSize="sm" color="gray.400">
                    {minhasSolicitacoes.length > 0 
                      ? `Você enviou ${minhasSolicitacoes.length} solicitações. Clique na foto para gerenciar.` 
                      : "Você ainda não fez nenhuma solicitação."}
                  </Text>
                  {minhasSolicitacoes.length > 0 && (
                    <Button size="sm" colorScheme="yellow" variant="link" onClick={onOpen}>
                      Ver Acompanhamento
                    </Button>
                  )}
               </VStack>
            </Box>

          </CardBody>
        </Card>

        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
          <ModalOverlay backdropFilter="blur(5px)" />
          <ModalContent>
            <ModalHeader borderBottom="1px solid" borderColor="gray.100">
               Minhas Solicitações
               <Text fontSize="sm" fontWeight="normal" color="gray.500">
                 Acompanhe o status dos seus pedidos.
               </Text>
            </ModalHeader>
            <ModalCloseButton />
            
            <ModalBody bg="gray.50" p={6}>
              {loadingSolicitacoes ? (
                 <Center h="200px"><Spinner size="xl" color={CustomGold} /></Center>
              ) : minhasSolicitacoes.length === 0 ? (
                 <Center h="200px" flexDirection="column">
                    <Icon as={FaListUl} w={12} h={12} color="gray.300" mb={4} />
                    <Text color="gray.500">Nenhuma solicitação enviada.</Text>
                    <Button as={Link} to="/profissionais" mt={4} size="sm" colorScheme="yellow" bg={CustomGold} color="white" _hover={{ bg: '#8C713B' }}>
                        Buscar Profissionais
                    </Button>
                 </Center>
              ) : (
                 <VStack spacing={4} align="stretch">
                     {minhasSolicitacoes.map((solicitacao) => (
                         <Card key={solicitacao.id} borderLeft="4px solid" borderColor={
                            solicitacao.status === 'aceito' ? 'green.400' : 
                            solicitacao.status === 'recusado' ? 'red.400' : 'orange.400'
                         } shadow="sm">
                             <CardBody>
                                 <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                                     <Box>
                                         <Heading size="sm" color={DarkText} mb={1}>{solicitacao.bartenderNome}</Heading>
                                         <Text fontSize="sm" color="gray.600" fontWeight="bold">{solicitacao.evento}</Text>
                                         <HStack fontSize="xs" color="gray.500" mt={1}>
                                            <Icon as={FaClock} />
                                            <Text>{solicitacao.data} às {solicitacao.horario}</Text>
                                         </HStack>
                                     </Box>
                                     
                                     <VStack align="end">
                                        {solicitacao.status === 'pendente' && (
                                            <Badge colorScheme="orange" p={2} borderRadius="md">
                                                Aguardando...
                                            </Badge>
                                        )}
                                        {solicitacao.status === 'recusado' && (
                                            <Badge colorScheme="red" p={2} borderRadius="md">Recusado</Badge>
                                        )}
                                        {solicitacao.status === 'aceito' && (
                                            <VStack align="end">
                                                <Badge colorScheme="green" p={2} borderRadius="md">
                                                    <Icon as={FaCheckCircle} mr={1}/> Aceito!
                                                </Badge>
                                                <Button 
                                                    size="sm" 
                                                    colorScheme="green" 
                                                    leftIcon={<FaCreditCard />}
                                                    onClick={() => {
                                                        onClose();
                                                        handleProcederPagamento(solicitacao);
                                                    }}
                                                >
                                                    Contratar / Pagar
                                                </Button>
                                            </VStack>
                                        )}
                                     </VStack>
                                 </Flex>
                             </CardBody>
                         </Card>
                     ))}
                 </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>

      </Container>
    </Box>
  );
}