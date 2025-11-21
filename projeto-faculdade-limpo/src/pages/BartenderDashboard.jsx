import { useState, useEffect } from 'react';
import {
  Box, Container, Heading, Text, VStack, HStack,
  Avatar, Button, Card, CardBody, Badge, Divider,
  useToast, Icon, Flex, Spinner, Center, Link,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  AvatarBadge, Menu, MenuButton, MenuList, MenuItem, Grid, GridItem, Tabs, TabList, TabPanels, Tab, TabPanel, useDisclosure
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  FaUserEdit, FaCheck, FaTimes, FaCalendarAlt, FaClock, 
  FaMapMarkerAlt, FaMoneyBillWave, FaBell, FaExternalLinkAlt, FaSignOutAlt, FaStar 
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { db, auth } from '../firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import AvaliacaoModal from '../components/AvaliacaoModal';

export default function BartenderDashboard({ userData }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Controle dos Modais
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isOpenAvaliacao, 
    onOpen: onOpenAvaliacao, 
    onClose: onCloseAvaliacao 
  } = useDisclosure();

  const [requests, setRequests] = useState([]); // Pendentes
  const [acceptedJobs, setAcceptedJobs] = useState([]); // Aceitos
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);

  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    
    const q = query(
      collection(db, "solicitacoes"), 
      where("bartenderId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pendentes = [];
      const aceitos = [];
      
      querySnapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        if (data.status === 'pendente') pendentes.push(data);
        if (data.status === 'aceito') aceitos.push(data);
      });
      
      setRequests(pendentes);
      setAcceptedJobs(aceitos);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleAction = async (id, action) => {
    try {
      const requestRef = doc(db, "solicitacoes", id);
      await updateDoc(requestRef, {
        status: action === 'aceitar' ? 'aceito' : 'recusado'
      });
      toast({ title: "Status atualizado!", status: "success", duration: 2000 });
    } catch (error) {
      toast({ title: "Erro ao atualizar", status: "error" });
    }
  };

  const handleOpenAvaliarCliente = (job) => {
    setSelectedClient({
        id: job.clienteId,
        nome: job.clienteNome
    });
    onOpenAvaliacao();
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleToggleStatus = () => {
    setIsAvailable(!isAvailable);
    toast({ title: "Status atualizado", status: "success", duration: 2000 });
  };

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={10}>
      <Container maxW="container.md">
        
        <Card bg="white" shadow="lg" borderRadius="xl" overflow="visible">
          <Box h="120px" bgGradient="linear(to-r, #c49b3f, #e5b64e)" borderRadius="xl xl 0 0"></Box>
          <CardBody textAlign="center" mt="-60px">
            
            <Menu>
              <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0} _hover={{ transform: 'scale(1.05)' }}>
                <Avatar size="2xl" name={userData?.nome} src={userData?.fotoURL} border="6px solid white" boxShadow="md">
                  <AvatarBadge boxSize="1.2em" bg={requests.length > 0 ? "red.500" : "green.500"} border="3px solid white">
                    {requests.length > 0 && <Text fontSize="xs" color="white" fontWeight="bold">{requests.length}</Text>}
                  </AvatarBadge>
                </Avatar>
              </MenuButton>

              <MenuList fontSize="md" color="gray.700" zIndex={10}>
                <Box px={3} py={2}><Text fontWeight="bold" fontSize="sm">Menu do Profissional</Text></Box>
                <Divider />
                <MenuItem onClick={onOpen} icon={<FaBell color={requests.length > 0 ? "red" : "gray"} />}>
                  Gerenciar Eventos
                  {requests.length > 0 && <Badge ml={2} colorScheme="red" borderRadius="full">{requests.length} Novas</Badge>}
                </MenuItem>
                <MenuItem onClick={() => navigate('/editar-perfil')} icon={<FaUserEdit />}>Editar Perfil</MenuItem>
                <MenuItem as="a" href={`/bartender/${currentUser?.uid}`} icon={<FaExternalLinkAlt />}>Ver Perfil Público</MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} icon={<FaSignOutAlt />} color="red.500">Sair</MenuItem>
              </MenuList>
            </Menu>

            <VStack spacing={1} mt={4}>
              <Heading size="lg" color="#292728">{userData?.nome || "Profissional"}</Heading>
              <Text color="gray.500">Bartender Profissional</Text>
            </VStack>

            <Flex justify="center" my={6}>
               <Badge colorScheme={isAvailable ? "green" : "red"} px={4} py={2} borderRadius="full" cursor="pointer" onClick={handleToggleStatus}>
                 {isAvailable ? "🟢 Disponível" : "🔴 Indisponível"}
               </Badge>
            </Flex>

            {requests.length > 0 && (
               <Button leftIcon={<FaBell />} colorScheme="red" variant="outline" size="sm" onClick={onOpen} mt={2}>
                 {requests.length} solicitações pendentes
               </Button>
            )}
          </CardBody>
        </Card>

        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
          <ModalOverlay backdropFilter="blur(5px)" />
          <ModalContent>
            <ModalHeader>Gerenciar Eventos</ModalHeader>
            <ModalCloseButton />
            
            <ModalBody bg="gray.50" p={0}>
              <Tabs isFitted variant="enclosed" colorScheme="yellow">
                <TabList mb={0} bg="white">
                    <Tab>Pendentes ({requests.length})</Tab>
                    <Tab>Meus Eventos ({acceptedJobs.length})</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        {loading ? <Center p={10}><Spinner color="#c49b3f"/></Center> : requests.length === 0 ? (
                            <Center p={10}><Text color="gray.500">Nada pendente.</Text></Center>
                        ) : (
                            <VStack spacing={4}>
                                {requests.map((req) => (
                                    <Card key={req.id} w="full" borderLeft="4px solid orange" shadow="sm">
                                        <CardBody>
                                            <Flex direction={{ base: "column", md: "row" }} justify="space-between" gap={4}>
                                                <VStack align="start" spacing={1} flex={1}>
                                                    <Heading size="sm">{req.clienteNome}</Heading>
                                                    <Text fontWeight="bold">{req.evento}</Text>
                                                    <Text fontSize="sm">{req.data} - {req.horario}</Text>
                                                    <Text fontSize="sm" color="green.600">R$ {req.valor}</Text>
                                                </VStack>
                                                <VStack justify="center">
                                                    <Button size="sm" colorScheme="green" w="full" onClick={() => handleAction(req.id, 'aceitar')}>Aceitar</Button>
                                                    <Button size="sm" colorScheme="red" variant="outline" w="full" onClick={() => handleAction(req.id, 'recusar')}>Recusar</Button>
                                                </VStack>
                                            </Flex>
                                        </CardBody>
                                    </Card>
                                ))}
                            </VStack>
                        )}
                    </TabPanel>

                    <TabPanel>
                        {acceptedJobs.length === 0 ? (
                            <Center p={10}><Text color="gray.500">Nenhum evento agendado.</Text></Center>
                        ) : (
                            <VStack spacing={4}>
                                {acceptedJobs.map((job) => (
                                    <Card key={job.id} w="full" borderLeft="4px solid green" shadow="sm">
                                        <CardBody>
                                            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                                                <Box>
                                                    <Heading size="sm">{job.clienteNome}</Heading>
                                                    <Text fontSize="xs" color="gray.500">Cliente</Text>
                                                    <Text fontWeight="bold" mt={1}>{job.evento}</Text>
                                                    <HStack fontSize="sm" color="gray.600">
                                                        <Icon as={FaCalendarAlt} /> <Text>{job.data}</Text>
                                                    </HStack>
                                                </Box>
                                                <Button 
                                                    size="sm" 
                                                    colorScheme="yellow" 
                                                    leftIcon={<FaStar />}
                                                    onClick={() => handleOpenAvaliarCliente(job)}
                                                >
                                                    Avaliar Cliente
                                                </Button>
                                            </Flex>
                                        </CardBody>
                                    </Card>
                                ))}
                            </VStack>
                        )}
                    </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>
          </ModalContent>
        </Modal>

        {selectedClient && (
            <AvaliacaoModal 
                isOpen={isOpenAvaliacao} 
                onClose={onCloseAvaliacao} 
                avaliador={currentUser} 
                alvo={selectedClient} 
            />
        )}

      </Container>
    </Box>
  );
}