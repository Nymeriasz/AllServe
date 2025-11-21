import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Box, Container, Flex, Image, Heading, Text, Button,
  HStack, VStack, Spinner, Center, Link,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  IconButton, Tag, Badge, useToast
} from '@chakra-ui/react';
import { FaRegHeart, FaHeart, FaWhatsapp, FaInstagram, FaMapMarkerAlt, FaStore } from 'react-icons/fa';

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

export default function PerfilEmpresa() {
  const { empresaId } = useParams();
  const { currentUser, favorites, toggleFavorite, togglingFavoriteId, isFavoritesLoading } = useAuth();
  const toast = useToast();

  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avaliacoes, setAvaliations] = useState([]);
  const [mediaAvaliacao, setMediaAvaliacao] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const isFavorite = favorites.includes(empresaId);
  const isLoadingFavorite = togglingFavoriteId === empresaId;
  const placeholderImage = '/img/avatar-placeholder.png';

  useEffect(() => {
    let unsubscribe = () => {};

    const fetchData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'users', empresaId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          setEmpresa(null);
          setLoading(false);
          return;
        }
        setEmpresa({ id: docSnap.id, ...docSnap.data() });

        const qAvaliacoes = query(
          collection(db, 'users', empresaId, 'avaliacoes'),
          where('visivel', '==', true)
        );

        unsubscribe = onSnapshot(qAvaliacoes, (snapshot) => {
            const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
            setAvaliations(lista);

            if (lista.length > 0) {
              const total = lista.reduce((acc, a) => acc + (a.nota || 0), 0);
              setMediaAvaliacao(total / lista.length);
            } else {
                setMediaAvaliacao(0);
            }
            setLoading(false);
        });

      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    if (empresaId) fetchData();
    else setLoading(false);

    return () => unsubscribe();
  }, [empresaId]);

  if (loading) return <LoadingSpinner />;

  if (!empresa)
    return (
      <Center h="50vh">
        <Heading size="lg" color="gray.700">Empresa não encontrada!</Heading>
      </Center>
    );

  const urlWhatsapp = empresa?.telefone
    ? `https://wa.me/${empresa.telefone.replace(/\D/g, '')}`
    : '#';
  const urlInstagram = empresa?.instagram ? `https://www.instagram.com/${empresa.instagram.replace('@', '')}/` : '#';

  return (
    <Container maxW="container.lg" py={{ base: 10, md: 16 }}>
      
      <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 6, md: 10 }}>
 
        <Box 
            flexShrink={0} 
            w={{ base: '100%', md: '400px' }} 
            h="400px" 
            bg="gray.100" 
            borderRadius="md" 
            overflow="hidden" 
            boxShadow="lg"
            border="1px solid"
            borderColor="gray.200"
        >
          <Image 
            src={empresa.fotoURL || placeholderImage} 
            alt={empresa.nome} 
            objectFit="cover" 
            w="100%" 
            h="100%" 
          />
        </Box>
        <VStack flexGrow={1} align="flex-start" spacing={4}>
          
          <HStack spacing={4} align="center">
            <Heading as="h1" size="2xl" color={DarkText}>{empresa.nome}</Heading>
            {currentUser && (
              <IconButton
                aria-label="Favoritos"
                icon={isFavorite ? <FaHeart color="#c49b3f" /> : <FaRegHeart color="black" />}
                variant="ghost"
                size="3xl"
                isRound
                onClick={() => toggleFavorite(empresaId)}
                isLoading={isLoadingFavorite}
                isDisabled={isFavoritesLoading}
                _hover={{ color: '#c49b3f', bg: 'transparent' }}
              />
            )}
          </HStack>

          <HStack spacing={4}>
            {empresa.telefone && (
              <Link href={urlWhatsapp} isExternal _hover={{ color: CustomGold }}>
                <Box as="i" className="fab fa-whatsapp" fontSize="2xl" />
              </Link>
            )}
            {empresa.instagram && (
              <Link href={urlInstagram} isExternal _hover={{ color: CustomGold }}>
                <Box as="i" className="fab fa-instagram" fontSize="2xl" />
              </Link>
            )}
          </HStack>

          <HStack>
             <Tag size="lg" colorScheme="yellow" borderRadius="full">
                <Box as={FaStore} mr={2} />
                {empresa.tipo || "Empresa"}
             </Tag>
             <Badge colorScheme={empresa.status === 'Contratando' ? 'green' : 'blue'} fontSize="1em" px={3} py={1} borderRadius="md">
                {empresa.status || "Online"}
             </Badge>
          </HStack>

          <HStack>
            <StarRating rating={mediaAvaliacao} />
            <Text color="gray.600" fontSize="sm">({avaliacoes.length} Avaliações)</Text>
          </HStack>

          <HStack color="gray.600">
             <FaMapMarkerAlt color="#c49b3f" />
             <Text fontSize="lg">{empresa.local || "Localização não informada"}</Text>
          </HStack>
          
          <Text fontSize="lg" color="gray.700" noOfLines={3}>
             {empresa.descricao || "Conheça esta empresa parceira do AllServe."}
          </Text>

          <Box pt={4} w="100%">
             {empresa.telefone ? (
                 <Button 
                   as="a"
                   href={urlWhatsapp}
                   target="_blank"
                   bg={CustomGold} 
                   color="white" 
                   _hover={{ bg: '#8C713B' }} 
                   size="lg"
                   w="full"
                   leftIcon={<FaWhatsapp />}
                 >
                   Entrar em Contato
                 </Button>
             ) : (
                 <Button isDisabled size="lg" w="full">Contato Indisponível</Button>
             )}
          </Box>

        </VStack>
      </Flex>
      <Box mt={16}>
        <Tabs variant="enclosed" colorScheme="yellow" onChange={(index) => setActiveTab(index)} index={activeTab}>
          <TabList>
            <Tab>Sobre</Tab>
            <Tab>Detalhes</Tab>
            <Tab>Avaliações ({avaliacoes.length})</Tab>
          </TabList>
          
          <TabPanels bg="white" boxShadow="md" borderRadius="0 0 md md" p={6}>
            
            {/* Painel Sobre */}
            <TabPanel>
                <Text color="gray.700" whiteSpace="pre-line">
                    {empresa.descricao || "Sem descrição disponível."}
                </Text>
            </TabPanel>
            <TabPanel>
               <VStack align="start" spacing={3}>
                  <Text><strong>Tipo de Estabelecimento:</strong> {empresa.tipo}</Text>
                  <Text><strong>Localização:</strong> {empresa.local}</Text>
                  <Text><strong>Status na Plataforma:</strong> {empresa.status}</Text>
               </VStack>
            </TabPanel>
            

            <TabPanel>
              {avaliacoes.length > 0 ? (
                <VStack spacing={6} align="stretch">
                  {avaliacoes.map((a) => (
                    <Box key={a.id} borderBottom="1px solid #eee" pb={4}>
                      <Flex justify="space-between" align="center" mb={2}>
                        <Text fontWeight="bold">{a.autorNome || "Profissional"}</Text>
                        <StarRating rating={a.nota || 0} />
                      </Flex>
                      <Text color="gray.600">{a.comentario}</Text>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Text color="gray.500">Esta empresa ainda não recebeu avaliações de profissionais.</Text>
              )}
            </TabPanel>

          </TabPanels>
        </Tabs>
      </Box>

    </Container>
  );
}