import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { auth, db, storage } from '../firebase/config'; 
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; 
import {
  Box, Container, Heading, Text, VStack, Button,
  Spinner, Center, useToast, Avatar, 
  Card, CardBody, Badge, Icon, Flex, Divider,
  Menu, MenuButton, MenuList, MenuItem, AvatarBadge,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  useDisclosure, HStack, FormControl, FormLabel, Input, Select
} from '@chakra-ui/react';
import { 
  FaUserEdit, FaCheckCircle, FaCreditCard, FaClock, 
  FaExternalLinkAlt, FaBell, FaListUl, FaSignOutAlt 
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
  
  const [isSaving, setIsSaving] = useState(false);
  const [loadingText, setLoadingText] = useState("Salvando...");
  
  const [activeTab, setActiveTab] = useState('solicitacoes');
  const [imageFile, setImageFile] = useState(null); 

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
          setFormData({ 
            nome: data.nome || '',
            telefone: data.telefone || '',
            instagram: data.instagram || '',
            fotoURL: data.fotoURL || '/img/avatar-exemplo.png',
            tipo: data.tipo || '', 
            status: data.status || 'Online',
            cep: data.cep || '',
            endereco: data.endereco || '',
            numero: data.numero || '',
            bairro: data.bairro || '',
            cidade: data.cidade || '',
            uf: data.uf || '',
            local: data.local || '', 
            ...data
          });
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

  const handleTabClick = (tabName) => setActiveTab(tabName);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Imagem muito grande!",
          description: "Por favor, escolha uma imagem menor que 2MB.",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
        e.target.value = ""; 
        setImageFile(null);
        return;
      }
      setImageFile(file);
    }
  };

  const handleProcederPagamento = (solicitacao) => {
    addToCart({
        id: solicitacao.bartenderId,
        nome: solicitacao.bartenderNome || "Bartender",
        precoPorHora: Number(solicitacao.valor) || 0, 
        imagem: solicitacao.bartenderFoto || '/img/avatar-placeholder.png',
        quantity: 1,
        solicitacaoId: solicitacao.id 
    });
    navigate('/carrinho'); 
  };

  const uploadImage = async () => {
    if (!imageFile || !currentUser) return formData.fotoURL; 
    
    setLoadingText("Enviando foto...");
    
    try {
      const fileRef = ref(storage, `profile_pictures/${currentUser.uid}/${imageFile.name}`);
      await uploadBytes(fileRef, imageFile);
      const photoURL = await getDownloadURL(fileRef);
      
      setImageFile(null); 
      return photoURL;
    } catch (error) {
      console.error("Erro upload:", error);
      toast({ title: "Erro ao enviar imagem.", status: "error" });
      return formData.fotoURL; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsSaving(true); 
    setLoadingText("Salvando...");

    try {
      
      const newPhotoURL = await uploadImage();

      setLoadingText("Atualizando dados...");

      const cidade = formData.cidade || '';
      const uf = formData.uf || '';
      const localFormatado = (cidade && uf) ? `${cidade} - ${uf}` : (formData.local || '');

      const dadosParaSalvar = {
        nome: formData.nome || '', 
        telefone: formData.telefone || '', 
        instagram: formData.instagram || '',
        fotoURL: newPhotoURL,
        tipo: formData.tipo || '', 
        status: formData.status || 'Online',
        cep: formData.cep || '',
        endereco: formData.endereco || '',
        numero: formData.numero || '',
        bairro: formData.bairro || '',
        cidade: cidade,
        uf: uf,
        local: localFormatado
      };

      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, dadosParaSalvar);
      
      setFormData(prev => ({ ...prev, ...dadosParaSalvar }));
      toast({ title: "Perfil Atualizado!", status: "success", duration: 3000 });

    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      toast({ 
        title: "Erro ao salvar.", 
        description: "Verifique sua conexão.", 
        status: "error" 
      });
    } finally {
      setIsSaving(false); 
      setLoadingText("Salvar Alterações");
    }
  };

  const novasRespostas = minhasSolicitacoes.filter(s => 
    s.status === 'aceito' || s.status === 'recusado'
  ).length;

  const solicitacoesAtivas = minhasSolicitacoes.filter(s => s.status !== 'pago');

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
                  {novasRespostas > 0 && <Badge ml={2} colorScheme="red" borderRadius="full">{novasRespostas} Atualizações</Badge>}
                </MenuItem>

                <MenuItem onClick={() => handleTabClick('editar-perfil')} icon={<FaUserEdit />}>
                  Editar Credenciais
                </MenuItem>

                <MenuItem as={Link} to={`/empresa/${currentUser.uid}`} icon={<FaExternalLinkAlt />}>
                  Ver Perfil Público
                </MenuItem>

                <Divider my={1} />
                <MenuItem onClick={handleLogout} icon={<FaSignOutAlt />} color="red.500">Sair</MenuItem>
              </MenuList>
            </Menu>

            <VStack spacing={1} mt={4}>
              <Heading size="lg" color="#292728">{formData.nome}</Heading>
              <Text color="gray.500">{formData.tipo || "Cliente / Empresa"}</Text>
            </VStack>

          </CardBody>
        </Card>

        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
          <ModalOverlay backdropFilter="blur(5px)" />
          <ModalContent>
            <ModalHeader borderBottom="1px solid" borderColor="gray.100">Minhas Solicitações Pendentes</ModalHeader>
            <ModalCloseButton />
            <ModalBody bg="gray.50" p={6}>
              {loadingSolicitacoes ? (
                 <Center h="200px"><Spinner size="xl" color={CustomGold} /></Center>
              ) : solicitacoesAtivas.length === 0 ? (
                 <Center h="200px" flexDirection="column">
                    <Icon as={FaListUl} w={12} h={12} color="gray.300" mb={4} />
                    <Text color="gray.500">Nenhuma pendência.</Text>
                    <Button as={Link} to="/profissionais" mt={4} size="sm" colorScheme="yellow" bg={CustomGold} color="white" _hover={{ bg: '#8C713B' }}>Buscar Profissionais</Button>
                 </Center>
              ) : (
                 <VStack spacing={4} align="stretch">
                     {solicitacoesAtivas.map((solicitacao) => (
                         <Card key={solicitacao.id} borderLeft="4px solid" borderColor={solicitacao.status === 'aceito' ? 'green.400' : 'orange.400'} shadow="sm">
                             <CardBody>
                                 <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                                     <Box>
                                         <Heading size="sm" color={DarkText} mb={1}>{solicitacao.bartenderNome}</Heading>
                                         <Text fontSize="sm" color="gray.600" fontWeight="bold">{solicitacao.evento}</Text>
                                         <HStack fontSize="xs" color="gray.500" mt={1}><Icon as={FaClock} /><Text>{solicitacao.data} às {solicitacao.horario}</Text></HStack>
                                     </Box>
                                     <VStack align="end">
                                        {solicitacao.status === 'pendente' && <Badge colorScheme="orange" p={2} borderRadius="md">Aguardando...</Badge>}
                                        {solicitacao.status === 'recusado' && <Badge colorScheme="red" p={2} borderRadius="md">Recusado</Badge>}
                                        {solicitacao.status === 'aceito' && (
                                            <VStack align="end">
                                                <Badge colorScheme="green" p={2} borderRadius="md"><Icon as={FaCheckCircle} mr={1}/> Aceito!</Badge>
                                                <Button size="sm" colorScheme="green" leftIcon={<FaCreditCard />} onClick={() => { onClose(); handleProcederPagamento(solicitacao); }}>Contratar / Pagar</Button>
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

        {activeTab === 'editar-perfil' && (
            <Box mt={8} bg="white" p={8} borderRadius="lg" boxShadow="sm" borderTop="4px solid" borderColor={CustomGold}>
                <Heading size="lg" mb={6} color={DarkText}>Editar Credenciais</Heading>
                <VStack spacing={5} as="form" onSubmit={handleSubmit}>
                    
                    <FormControl>
                        <FormLabel>Logo / Foto de Perfil</FormLabel>
                        <Input type="file" accept="image/*" onChange={handleImageChange} p={1} border="1px solid" borderColor="gray.200" />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Nome da Empresa</FormLabel>
                        <Input name="nome" value={formData.nome} onChange={handleChange} focusBorderColor={CustomGold} />
                    </FormControl>

                    <HStack w="100%" spacing={4}>
                        <FormControl><FormLabel>Tipo de Negócio</FormLabel><Input name="tipo" placeholder="Ex: Restaurante, Bar..." value={formData.tipo} onChange={handleChange} focusBorderColor={CustomGold} /></FormControl>
                        <FormControl><FormLabel>Status</FormLabel><Select name="status" value={formData.status} onChange={handleChange} focusBorderColor={CustomGold}><option value="Online">Online</option><option value="Contratando">Contratando</option><option value="Ausente">Ausente</option></Select></FormControl>
                    </HStack>
                    
                    <Heading size="sm" width="full" pt={2} color="gray.500">Endereço</Heading>
                    <HStack w="100%" spacing={4}>
                        <FormControl w="150px"><FormLabel>CEP</FormLabel><Input name="cep" value={formData.cep} onChange={handleChange} focusBorderColor={CustomGold} placeholder="00000-000" /></FormControl>
                        <FormControl flex={1}><FormLabel>Endereço (Rua/Av)</FormLabel><Input name="endereco" value={formData.endereco} onChange={handleChange} focusBorderColor={CustomGold} /></FormControl>
                        <FormControl w="100px"><FormLabel>Número</FormLabel><Input name="numero" value={formData.numero} onChange={handleChange} focusBorderColor={CustomGold} /></FormControl>
                    </HStack>
                    <HStack w="100%" spacing={4}>
                        <FormControl flex={1}><FormLabel>Bairro</FormLabel><Input name="bairro" value={formData.bairro} onChange={handleChange} focusBorderColor={CustomGold} /></FormControl>
                        <FormControl flex={1}><FormLabel>Cidade</FormLabel><Input name="cidade" value={formData.cidade} onChange={handleChange} focusBorderColor={CustomGold} /></FormControl>
                        <FormControl w="80px"><FormLabel>UF</FormLabel><Input name="uf" value={formData.uf} onChange={handleChange} focusBorderColor={CustomGold} maxLength={2} /></FormControl>
                    </HStack>

                    <FormControl><FormLabel>Telefone / WhatsApp</FormLabel><Input name="telefone" value={formData.telefone} onChange={handleChange} focusBorderColor={CustomGold} /></FormControl>
                    <FormControl><FormLabel>Instagram</FormLabel><Input name="instagram" value={formData.instagram} onChange={handleChange} focusBorderColor={CustomGold} placeholder="@seuinsta" /></FormControl>

                    <Button 
                        type="submit" 
                        bg={CustomGold} 
                        color="white" 
                        _hover={{ bg: '#8C713B' }} 
                        w="full" 
                        isLoading={isSaving} 
                        loadingText={loadingText} 
                        size="lg" 
                        mt={4}
                    >
                        {loadingText === "Salvando..." ? "Salvar Alterações" : loadingText}
                    </Button>
                </VStack>
            </Box>
        )}

      </Container>
    </Box>
  );
}