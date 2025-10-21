// src/pages/PerfilBartender.jsx

import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box, Heading, Text, Spinner, Center, VStack, HStack,
  Icon, Divider, Button, Image,
} from '@chakra-ui/react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useCart } from '../context/CartContext.jsx'; 

// Componente de Estrela
const StarIcon = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
  </svg>
);

export default function PerfilBartender() {
  const { bartenderId } = useParams();
  const [bartender, setBartender] = useState(null);
  const [avaliacoes, setAvaliations] = useState([]);
  const [media, setMedia] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); // Pegar a função

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bartenderDocRef = doc(db, 'users', bartenderId);
        const bartenderDoc = await getDoc(bartenderDocRef);
        if (bartenderDoc.exists()) {
          setBartender(bartenderDoc.data());
        }

        const q = query(collection(db, 'users', bartenderId, 'avaliacoes'), where('visivel', '==', true));
        const querySnapshot = await getDocs(q);
        const avaliacoesList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAvaliations(avaliacoesList);

        if (avaliacoesList.length > 0) {
          const totalNotas = avaliacoesList.reduce((acc, curr) => acc + curr.nota, 0);
          setMedia(totalNotas / avaliacoesList.length);
        }
      } catch (error) { console.error('Erro ao buscar dados do bartender:', error); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, [bartenderId]);

  if (loading) {
    return <Center h="50vh"><Spinner size="xl" /></Center>;
  }
  
  const placeholderImage = 'https://via.placeholder.com/150';
  const preco = Number(bartender?.precoPorHora) || 0; 

  return (
    <Box p={8}>
      {bartender ? (
        <VStack spacing={6} align="flex-start">
          <HStack spacing={6} align="flex-start">
            <Image
              borderRadius="full"
              boxSize="150px"
              src={bartender.fotoURL || placeholderImage}
              alt={`Foto de ${bartender.nome}`}
              objectFit="cover"
            />
            <VStack align="flex-start" spacing={3}>
              <Heading>{bartender.nome}</Heading>
              <Text fontSize="xl">Especialidade: <strong>{bartender.especialidade}</strong></Text>
              <HStack>
                <Text fontSize="2xl" fontWeight="bold">{media.toFixed(1)}</Text>
                <Icon as={StarIcon} color="gold" boxSize={6} />
                <Text>({avaliacoes.length} avaliações)</Text>
              </HStack>
            </VStack>
          </HStack>
          
          <Divider />
          
          {preco > 0 ? (
            <Box p={4} borderWidth={1} borderRadius={8} w="full">
              <HStack justify="space-between" align="center">
                <Box>
                  <Text fontSize="lg" fontWeight="bold">Valor do Serviço</Text>
                  <Text fontSize="2xl" color="teal.500" fontWeight="bold">
                    R$ {preco.toFixed(2)} / hora
                  </Text>
                </Box>
                {/* Mudar o botão */}
                <Button
                  onClick={() => addToCart({ id: bartenderId, nome: bartender.nome, precoPorHora: preco })}
                  colorScheme="teal"
                  size="lg"
                >
                  Adicionar ao Carrinho
                </Button>
              </HStack>
            </Box>
          ) : (
            <Text>Este bartender não cadastrou um preço por hora.</Text>
          )}

          <Heading size="lg" mt={4}>Comentários</Heading>
          {/* ... (código dos comentários) ... */}
        </VStack>
      ) : (
        <Text>Bartender não encontrado.</Text>
      )}
    </Box>
  );
}