import { useState, useEffect } from 'react';
import {
  Box, Container, Heading, Text, VStack, HStack,
  Avatar, Button, Card, CardBody, Badge, Divider,
  useToast, Icon, Flex, Spinner, Center, Link,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  AvatarBadge, Menu, MenuButton, MenuList, MenuItem, Tabs, TabList, TabPanels, Tab, TabPanel, useDisclosure,
  IconButton, Tooltip
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  FaUserEdit, FaCalendarAlt, FaClock, 
  FaBell, FaExternalLinkAlt, FaSignOutAlt, FaStar, FaCheckCircle, FaTrash 
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { db, auth } from '../firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import AvaliacaoModal from '../components/AvaliacaoModal';

export default function BartenderDashboard({ userData }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isOpenAvaliacao, 
    onOpen: onOpenAvaliacao, 
    onClose: onCloseAvaliacao 
  } = useDisclosure();

  const [requests, setRequests] = useState([]);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    
    const q = query(collection(db, "solicitacoes"), where("bartenderId", "==", currentUser.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pendentes = [];
      const aceitos = [];
      
      querySnapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        if (data.status === 'pendente') {
            pendentes.push(data);
        } else if (data.status === 'aceito' || data.status === 'pago') {
            aceitos.push(data);
        }
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
      await updateDoc(requestRef, { status: action === 'aceitar' ? 'aceito' : 'recusado' });
      toast({ title: "Status atualizado!", status: "success", duration: 2000 });
    } catch (error) {
      toast({ title: "Erro ao atualizar", status: "error" });
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Tem certeza que deseja remover este evento da lista?")) return;

    try {
        await deleteDoc(doc(db, "solicitacoes", id));
        toast({ title: "Evento removido.", status: "info", duration: 2000 });
    } catch (error) {
        toast({ title: "Erro ao remover.", status: "error" });
    }
  };

  const handleOpenAvaliarCliente = (job) => {
    setSelectedClient({ id: job.clienteId, nome: job.clienteNome });
    onOpenAvaliacao();
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleToggleStatus = () => {
    setIsAvailable(!isAvailable);
    toast({ title: "Status alterado", status: "success", duration: 2000 });
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
                <MenuItem onClick={onOpen} icon={<FaBell color={requests.length > 0 ? "red" : "gray"} />}>
                  Gerenciar Eventos
                  {requests.length > 0 && <Badge ml={2} colorScheme="red" borderRadius="full">{requests.length}</Badge>}
                </MenuItem>
                <MenuItem onClick={() => navigate('/editar-perfil')} icon={<FaUserEdit />}>Editar Perfil</MenuItem>
                <MenuItem as="a" href={`/bartender/${currentUser?.uid}`} icon={<FaExternalLinkAlt />}>Ver Perfil Público</MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} icon={<FaSignOutAlt />} color="red.500">Sair</MenuItem>
              </MenuList>
            </Menu>

            <VStack spacing={1} mt={4}>
              <Heading size="lg" color="#292728">{userData?.nome}</Heading>
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
                    <Tab>Agenda ({acceptedJobs.length})</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        {requests.length === 0 ? <Center p={10}><Text color="gray.500">Nada pendente.</Text></Center> : (
                            <VStack spacing={4}>
                                {requests.map((req) => (
                                    <Card key={req.id} w="full" borderLeft="4px solid orange" shadow="sm">
                                        <CardBody>
                                            <Flex justify="space-between" align="center">
                                                <Box>
                                                    <Heading size="sm">{req.clienteNome}</Heading>
                                                    <Text fontWeight="bold">{req.evento}</Text>
                                                    <Text fontSize="sm">{req.data} - {req.horario}</Text>
                                                </Box>
                                                <VStack>
                                                    <Button size="sm" colorScheme="green" onClick={() => handleAction(req.id, 'aceitar')}>Aceitar</Button>
                                                    <Button size="sm" colorScheme="red" variant="outline" onClick={() => handleAction(req.id, 'recusar')}>Recusar</Button>
                                                </VStack>
                                            </Flex>
                                        </CardBody>
                                    </Card>
                                ))}
                            </VStack>
                        )}
                    </TabPanel>

                    <TabPanel>
                        {acceptedJobs.length === 0 ? <Center p={10}><Text color="gray.500">Nenhum evento.</Text></Center> : (
                            <VStack spacing={4}>
                                {acceptedJobs.map((job) => (
                                    <Card key={job.id} w="full" borderLeft={job.status === 'pago' ? "4px solid green" : "4px solid orange"} shadow="sm">
                                        <CardBody>
                                            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                                                <Box>
                                                    <HStack mb={1}>
                                                        <Heading size="sm">{job.clienteNome}</Heading>
                                                        {job.status === 'pago' ? (
                                                            <Badge colorScheme="green"><Icon as={FaCheckCircle} mr={1}/>PAGO</Badge>
                                                        ) : (
                                                            <Badge colorScheme="orange">Aguardando Pagamento</Badge>
                                                        )}
                                                    </HStack>
                                                    <Text fontWeight="bold">{job.evento}</Text>
                                                    <HStack fontSize="sm" color="gray.600">
                                                        <Icon as={FaCalendarAlt} /> <Text>{job.data}</Text>
                                                    </HStack>
                                                </Box>
                          
                                                {job.status === 'pago' && (
                                                    <HStack>
                                                        <Button size="sm" colorScheme="yellow" leftIcon={<FaStar />} onClick={() => handleOpenAvaliarCliente(job)}>
                                                            Avaliar
                                                        </Button>
                                                        <Tooltip label="Remover da lista">
                                                            <IconButton 
                                                                icon={<FaTrash />} 
                                                                size="sm" 
                                                                colorScheme="red" 
                                                                variant="ghost" 
                                                                onClick={() => handleDeleteJob(job.id)}
                                                            />
                                                        </Tooltip>
                                                    </HStack>
                                                )}
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
            <AvaliacaoModal isOpen={isOpenAvaliacao} onClose={onCloseAvaliacao} avaliador={currentUser} alvo={selectedClient} />
        )}

      </Container>
    </Box>
  );
}