import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Box, Container, Flex, Image, Heading, Text, Button, Input,
  HStack, VStack, Spinner, Center, Link,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, 
  ModalHeader, ModalCloseButton, ModalBody, ModalFooter, 
  FormControl, FormLabel, Textarea, useToast
} from '@chakra-ui/react';
import { FaRegHeart, FaHeart, FaPaperPlane } from 'react-icons/fa';

const CustomGold = "#A5874D";
const DarkText = "#292728";

const LoadingSpinner = () => (
  <Center h="50vh">
    <Spinner size="xl" color={CustomGold} thickness="4px" />
  </Center>
);

const StarRating = ({ rating = 0 }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <HStack spacing={1} color="#ffc107">
      {[...Array(fullStars)].map((_, i) => <Box as="i" key={`full-${i}`} className="fas fa-star" />)}
      {halfStar && <Box as="i" key="half" className="fas fa-star-half-alt" />}
      {[...Array(emptyStars)].map((_, i) => <Box as="i" key={`empty-${i}`} className="far fa-star" />)}
    </HStack>
  );
};

export default function PerfilBartender() {
  const { bartenderId } = useParams();
  const { currentUser, favorites, toggleFavorite, togglingFavoriteId, isFavoritesLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [bartender, setBartender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avaliacoes, setAvaliations] = useState([]);
  const [mediaAvaliacao, setMediaAvaliacao] = useState(0);
  const [activeTab, setActiveTab] = useState(0); 
  
  const [solicitacao, setSolicitacao] = useState({
    data: '',
    horario: '',
    local: '',
    mensagem: ''
  });
  const [sending, setSending] = useState(false);

  const isFavorite = favorites.includes(bartenderId);
  const isLoadingFavorite = togglingFavoriteId === bartenderId;
  
  // Verifica se o perfil é do próprio usuário logado
  const isOwnProfile = currentUser && currentUser.uid === bartenderId;
  
  const placeholderImage = '/img/avatar-placeholder.png';

  useEffect(() => {
    let unsubscribe = () => {};

    const fetchData = async () => {
      setLoading(true);
      try {
        const bartenderDoc = await getDoc(doc(db, 'users', bartenderId));
        if (!bartenderDoc.exists()) {
          setBartender(null);
          setLoading(false);
          return;
        }
        setBartender({ id: bartenderDoc.id, ...bartenderDoc.data() });

        // --- AVALIAÇÕES EM TEMPO REAL (onSnapshot) ---
        const qAvaliacoes = query(
          collection(db, 'users', bartenderId, 'avaliacoes'),
          where('visivel', '==', true)
        );

        unsubscribe = onSnapshot(qAvaliacoes, (snapshot) => {
            const avaliacoesList = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
            setAvaliations(avaliacoesList);

            if (avaliacoesList.length > 0) {
              const total = avaliacoesList.reduce((acc, a) => acc + (a.nota || 0), 0);
              setMediaAvaliacao(total / avaliacoesList.length);
            } else {
                setMediaAvaliacao(0);
            }
            setLoading(false); // Finaliza loading após carregar avaliações
        }, (error) => {
            console.error("Erro ao buscar avaliações:", error);
            setLoading(false);
        });

      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    if (bartenderId) fetchData();
    else setLoading(false);

    return () => unsubscribe(); // Limpa o ouvinte ao sair
  }, [bartenderId]);

  const handleOpenSolicitacao = () => {
    if (!currentUser) {
      toast({
        title: 'Login necessário',
        description: 'Você precisa estar logado para enviar uma solicitação.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }
    onOpen();
  };

  const handleSendSolicitacao = async () => {
    if (!solicitacao.data || !solicitacao.horario || !solicitacao.local) {
      toast({ title: 'Preencha os dados obrigatórios', status: 'warning' });
      return;
    }

    setSending(true);
    try {
      await addDoc(collection(db, 'solicitacoes'), {
        bartenderId: bartender.id,
        bartenderNome: bartender.nome || "Bartender",
        bartenderFoto: bartender.fotoURL || null,
        clienteId: currentUser.uid,
        clienteNome: currentUser.displayName || currentUser.email, 
        clienteEmail: currentUser.email,
        evento: `Evento em ${solicitacao.local}`, 
        data: solicitacao.data,
        horario: solicitacao.horario,
        local: solicitacao.local,
        mensagem: solicitacao.mensagem || "",
        valor: Number(bartender.precoPorHora) || 0, 
        status: 'pendente', 
        createdAt: new Date()
      });

      toast({
        title: "Solicitação Enviada!",
        description: "Aguarde o bartender aceitar para prosseguir.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      setSolicitacao({ data: '', horario: '', local: '', mensagem: '' });

    } catch (error) {
      console.error(error);
      toast({ 
        title: "Erro ao enviar", 
        description: "Verifique sua conexão ou tente novamente.", 
        status: "error" 
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!bartender)
    return (
      <Center h="50vh">
        <Heading size="lg" color="gray.700">Profissional não encontrado!</Heading>
      </Center>
    );

  const urlWhatsapp = bartender?.telefone
    ? `https://wa.me/${bartender.telefone.replace(/\D/g, '')}`
    : '#';
  const urlInstagram = bartender?.instagram ? `https://www.instagram.com/${bartender.instagram}/` : '#';
  const preco = Number(bartender?.precoPorHora) || 0;
  const precoFormatado = `R$ ${preco.toFixed(2).replace('.', ',')}`;

  return (
    <Container maxW="container.lg" py={{ base: 10, md: 16 }}>
      
      <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 6, md: 10 }}>
        <Box flexShrink={0} w={{ base: '100%', md: '400px' }} h="400px" bg="gray.100" borderRadius="md" overflow="hidden" boxShadow="lg">
          <Image src={bartender.fotoURL || placeholderImage} alt={bartender.nome} objectFit="cover" w="100%" h="100%" />
        </Box>

        <VStack flexGrow={1} align="flex-start" spacing={4}>
          <HStack spacing={4} align="center">
            <Heading as="h1" size="2xl" color={DarkText}>{bartender.nome}</Heading>
            {currentUser && !isOwnProfile && (
              <IconButton
                aria-label="Favoritos"
                icon={isFavorite ? <FaHeart color="#c49b3f" /> : <FaRegHeart color="black" />}
                variant="ghost"
                size="3xl"
                isRound
                onClick={() => toggleFavorite(bartenderId)}
                isLoading={isLoadingFavorite}
                isDisabled={isFavoritesLoading}
                _hover={{ color: '#c49b3f', bg: 'transparent' }}
              />
            )}
          </HStack>

          <HStack spacing={4}>
            {bartender.telefone && (
              <Link href={urlWhatsapp} isExternal _hover={{ color: CustomGold }}>
                <Box as="i" className="fab fa-whatsapp" fontSize="2xl" />
              </Link>
            )}
            {bartender.instagram && (
              <Link href={urlInstagram} isExternal _hover={{ color: CustomGold }}>
                <Box as="i" className="fab fa-instagram" fontSize="2xl" />
              </Link>
            )}
          </HStack>

          {preco > 0 && (
            <Text fontSize="3xl" fontWeight="bold" color={CustomGold}>
              {precoFormatado}/hora
            </Text>
          )}

          <HStack>
            <StarRating rating={mediaAvaliacao} />
            <Text color="gray.600" fontSize="sm">({avaliacoes.length} Avaliações)</Text>
          </HStack>

          <Text fontSize="lg" color="gray.700">{bartender.resumo}</Text>

          {/* SÓ MOSTRA O BOTÃO SE NÃO FOR O PRÓPRIO PERFIL */}
          {!isOwnProfile && (
            <Box pt={4} w="100%">
               <Button 
                 onClick={handleOpenSolicitacao} 
                 bg={CustomGold} 
                 color="white" 
                 _hover={{ bg: '#8C713B' }} 
                 size="lg"
                 w="full"
                 leftIcon={<FaPaperPlane />}
               >
                 Solicitar Orçamento / Disponibilidade
               </Button>
               <Text fontSize="xs" color="gray.500" mt={2} textAlign="center">
                  O pagamento só será liberado após o aceite do profissional.
               </Text>
            </Box>
          )}
        </VStack>
      </Flex>

      <Box mt={16}>
        <Tabs variant="enclosed" colorScheme="yellow" onChange={(index) => setActiveTab(index)} index={activeTab}>
          <TabList>
            <Tab>Descrição</Tab>
            <Tab>Detalhes</Tab>
            <Tab>Avaliações ({avaliacoes.length})</Tab>
          </TabList>
          <TabPanels bg="white" boxShadow="md" borderRadius="0 0 md md" p={6}>
            <TabPanel><Text color="gray.700">{bartender.descricaoCompleta || bartender.resumo}</Text></TabPanel>
            <TabPanel><Text color="gray.700"><strong>Categoria:</strong> {bartender.especialidade}</Text></TabPanel>
            <TabPanel>
              {avaliacoes.length > 0 ? (
                <VStack spacing={6} align="stretch">
                  {avaliacoes.map((a) => (
                    <Box key={a.id} borderBottom="1px solid #eee" pb={4}>
                      <Flex justify="space-between" align="center" mb={2}>
                        <Text fontWeight="bold">{a.clienteEmail}</Text>
                        <StarRating rating={a.nota || 0} />
                      </Flex>
                      <Text color="gray.600">{a.comentario}</Text>
                    </Box>
                  ))}
                </VStack>
              ) : <Text>Sem avaliações.</Text>}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Solicitar Profissional</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
             <VStack spacing={4}>
                <Text fontSize="sm" color="gray.600">
                  Envie os detalhes do seu evento. O bartender {bartender.nome} analisará sua proposta.
                </Text>
                
                <HStack w="100%">
                    <FormControl isRequired>
                        <FormLabel>Data</FormLabel>
                        <Input type="date" value={solicitacao.data} onChange={(e) => setSolicitacao({...solicitacao, data: e.target.value})} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Horário</FormLabel>
                        <Input type="text" placeholder="Ex: 19h às 23h" value={solicitacao.horario} onChange={(e) => setSolicitacao({...solicitacao, horario: e.target.value})} />
                    </FormControl>
                </HStack>

                <FormControl isRequired>
                    <FormLabel>Local do Evento</FormLabel>
                    <Input placeholder="Endereço ou Nome do Salão" value={solicitacao.local} onChange={(e) => setSolicitacao({...solicitacao, local: e.target.value})} />
                </FormControl>

                <FormControl>
                    <FormLabel>Mensagem (Opcional)</FormLabel>
                    <Textarea placeholder="Detalhes sobre o número de convidados, tipo de drinks, etc." value={solicitacao.mensagem} onChange={(e) => setSolicitacao({...solicitacao, mensagem: e.target.value})} />
                </FormControl>

                <Box bg="gray.50" p={3} borderRadius="md" w="full">
                   <Text fontWeight="bold" fontSize="sm">Valor estimado: {precoFormatado}/hora</Text>
                   <Text fontSize="xs">O valor final pode ser ajustado no contrato.</Text>
                </Box>
             </VStack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3} variant="ghost">Cancelar</Button>
            <Button 
              colorScheme="yellow" 
              bg={CustomGold} 
              color="white" 
              onClick={handleSendSolicitacao}
              isLoading={sending}
            >
              Enviar Solicitação
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Container>
  );
}