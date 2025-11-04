// src/pages/PerfilBartender.jsx (Convertido para Chakra UI)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Box, Container, Flex, Image, Heading, Text, Button, Input,
  HStack, VStack, Spinner, Center, Tag, Wrap, Link,
  Tabs, TabList, TabPanels, Tab, TabPanel
} from '@chakra-ui/react';

// --- Cores do seu Home.jsx ---
const CustomGold = "#A5874D";
const DarkText = "#292728";

// Componente de Loading com Chakra Spinner
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
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [bartender, setBartender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avaliacoes, setAvaliations] = useState([]);
  const [mediaAvaliacao, setMediaAvaliacao] = useState(0);
  const [activeTab, setActiveTab] = useState(0); // Mudado para 0 (índice da aba)
  const [quantity, setQuantity] = useState(1);

  const placeholderImage = '/img/avatar-placeholder.png';

  // --- Lógica de Busca (Idêntica, está correta) ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const bartenderDoc = await getDoc(doc(db, 'users', bartenderId));
        if (!bartenderDoc.exists()) {
          setBartender(null);
          return;
        }
        const bartenderData = { id: bartenderDoc.id, ...bartenderDoc.data() };
        setBartender(bartenderData);

        const qAvaliacoes = query(
          collection(db, 'users', bartenderId, 'avaliacoes'),
          where('visivel', '==', true)
        );
        const snap = await getDocs(qAvaliacoes);
        const avaliacoesList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAvaliations(avaliacoesList);

        if (avaliacoesList.length > 0) {
          const total = avaliacoesList.reduce((acc, a) => acc + (a.nota || 0), 0);
          setMediaAvaliacao(total / avaliacoesList.length);
        } else setMediaAvaliacao(0);
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
      } finally {
        setLoading(false);
      }
    };
    if (bartenderId) fetchData();
    else setLoading(false);
  }, [bartenderId]);

  // --- Lógica do Carrinho (Idêntica, está correta) ---
  const handleAddToCart = () => {
    if (!currentUser) {
      alert('Você precisa estar logado para contratar.');
      navigate('/login');
      return;
    }
    if (!bartender) return;
    addToCart({
      id: bartender.id,
      nome: bartender.nome || (bartender.email || '').split('@')[0],
      precoPorHora: Number(bartender.precoPorHora) || 0,
      imagem: bartender.fotoURL || placeholderImage,
      quantity
    });
    navigate('/carrinho');
  };

  // --- Variáveis Auxiliares (Idênticas) ---
  const mensagem = `Olá ${bartender?.nome || ''}, vi seu perfil no site AllServe e gostaria de mais informações.`;
  const urlWhatsapp = bartender?.telefone
    ? `https://wa.me/${bartender.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`
    : '#';
  const urlInstagram = bartender?.instagram ? `https://www.instagram.com/${bartender.instagram}/` : '#';

  const preco = Number(bartender?.precoPorHora) || 0;
  const precoFormatado = `R$ ${preco.toFixed(2).replace('.', ',')}`;

  // --- Renderização ---
  if (loading) return <LoadingSpinner />;

  if (!bartender)
    return (
      <Center h="50vh">
        <VStack>
          <Heading size="lg" color="gray.700">Profissional não encontrado!</Heading>
          <Text>O perfil que você procura não existe ou foi removido.</Text>
        </VStack>
      </Center>
    );

  // --- JSX (Convertido para Chakra UI) ---
  return (
    <Container maxW="container.lg" py={{ base: 10, md: 16 }}>
      
      {/* --- Bloco Principal (antigo .perfil-principal) --- */}
      <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 6, md: 10 }}>
        
        {/* Coluna da Imagem */}
        <Box 
          flexShrink={0} 
          w={{ base: '100%', md: '400px' }} 
          h="400px" 
          bg="gray.100" 
          borderRadius="md" 
          overflow="hidden" 
          boxShadow="lg"
        >
          <Image 
            src={bartender.fotoURL || placeholderImage} 
            alt={bartender.nome || 'Foto do profissional'} 
            objectFit="cover" 
            w="100%" 
            h="100%" 
          />
        </Box>

        {/* Coluna de Informações */}
        <VStack flexGrow={1} align="flex-start" spacing={4}>
          <Heading as="h1" size="2xl" color={DarkText}>
            {bartender.nome || (bartender.email || '').split('@')[0]}
          </Heading>

          <HStack spacing={4}>
            {bartender.telefone && (
              <Link href={urlWhatsapp} isExternal className="btn-social whatsapp" _hover={{ color: CustomGold }}>
                <Box as="i" className="fab fa-whatsapp" fontSize="2xl" />
              </Link>
            )}
            {bartender.instagram && (
              <Link href={urlInstagram} isExternal className="btn-social instagram" _hover={{ color: CustomGold }}>
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
            <Text color="gray.600" fontSize="sm">
              ({avaliacoes.length} {avaliacoes.length === 1 ? 'Avaliação' : 'Avaliações'})
            </Text>
          </HStack>

          <Text fontSize="lg" color="gray.700">
            {bartender.resumo || `Profissional especializado em ${bartender.especialidade || 'diversas áreas'}`}
          </Text>

          {Array.isArray(bartender.tags) && bartender.tags.length > 0 && (
            <VStack align="flex-start" spacing={2}>
              <Heading as="h4" size="md">Serviços oferecidos:</Heading>
              <Wrap>
                {bartender.tags.map((tag) => (
                  <Tag key={tag} size="md" variant="solid" bg="yellow.400" color="black">
                    {tag}
                  </Tag>
                ))}
              </Wrap>
            </VStack>
          )}

          {/* Ações (Contratar) */}
          <Box pt={4} w="100%">
            {preco > 0 ? (
              <HStack spacing={4} w="100%">
                {/* Seletor de Quantidade */}
                <HStack maxW="150px">
                  <Button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</Button>
                  <Input value={quantity} readOnly textAlign="center" focusBorderColor={CustomGold} />
                  <Button onClick={() => setQuantity(q => q + 1)}>+</Button>
                </HStack>
                
                {/* Botão Contratar */}
                <Button 
                  onClick={handleAddToCart} 
                  bg={CustomGold} 
                  color="white" 
                  _hover={{ bg: '#8C713B' }} 
                  size="lg"
                  flex={1}
                >
                  Contratar
                </Button>
              </HStack>
            ) : (
              <Text color="gray.600">Consulte o preço com o profissional.</Text>
            )}
          </Box>
        </VStack>
      </Flex>

      {/* --- Bloco de Detalhes (antigo .perfil-detalhes) --- */}
      <Box mt={16}>
        <Tabs variant="enclosed" colorScheme="yellow" onChange={(index) => setActiveTab(index)} index={activeTab}>
          <TabList>
            <Tab>Descrição</Tab>
            <Tab>Detalhes</Tab>
            <Tab>Avaliações ({avaliacoes.length})</Tab>
          </TabList>
          
          <TabPanels bg="white" boxShadow="md" borderRadius="0 0 md md" p={6}>
            {/* Painel Descrição */}
            <TabPanel>
              <Text color="gray.700">
                {bartender.descricaoCompleta || bartender.resumo || `Mais detalhes sobre ${bartender.nome} em breve.`}
              </Text>
            </TabPanel>
            
            {/* Painel Detalhes */}
            <TabPanel>
              <Text color="gray.700">
                <strong>Categoria:</strong> {bartender.especialidade || '—'}
              </Text>
              {/* Adicione mais detalhes aqui se existirem */}
            </TabPanel>
            
            {/* Painel Avaliações */}
            <TabPanel>
              {avaliacoes.length > 0 ? (
                <VStack spacing={6} align="stretch">
                  {avaliacoes.map((a) => (
                    <Box key={a.id} borderBottom="1px solid #eee" pb={4}>
                      <Flex justify="space-between" align="center" mb={2}>
                        <Text fontWeight="bold" color={DarkText}>{a.clienteEmail || 'Cliente'}</Text>
                        <StarRating rating={a.nota || 0} />
                      </Flex>
                      <Text color="gray.600">{a.comentario || 'Sem comentário.'}</Text>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Text>Este profissional ainda não recebeu avaliações.</Text>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

    </Container>
  );
}