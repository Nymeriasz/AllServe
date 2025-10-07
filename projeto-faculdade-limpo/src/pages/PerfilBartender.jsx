// src/pages/PerfilBartender.jsx 

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Center,
  VStack,
  HStack,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const StarIcon = (props) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 576 512"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
  </svg>
);

export default function PerfilBartender() {
  const { bartenderId } = useParams();
  const [bartender, setBartender] = useState(null);
  const [avaliacoes, setAvaliations] = useState([]);
  const [media, setMedia] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bartenderDocRef = doc(db, 'users', bartenderId);
        const bartenderDoc = await getDoc(bartenderDocRef);
        if (bartenderDoc.exists()) setBartender(bartenderDoc.data());

        const q = query(collection(db, 'users', bartenderId, 'avaliacoes'), where('visivel', '==', true));
        const querySnapshot = await getDocs(q);
        const avaliacoesList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAvaliations(avaliacoesList);

        if (avaliacoesList.length > 0) {
          const totalNotas = avaliacoesList.reduce((acc, curr) => acc + curr.nota, 0);
          setMedia(totalNotas / avaliacoesList.length);
        }
      } catch (error) { console.error('Erro ao buscar dados:', error); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, [bartenderId]);

  if (loading) { return <Center h="50vh"><Spinner size="xl" /></Center>; }

  return (
    <Box p={8}>
      {bartender ? (
        <VStack spacing={6} align="flex-start">
          <Heading>{bartender.email}</Heading>
          <HStack>
            <Text fontSize="2xl" fontWeight="bold">{media.toFixed(1)}</Text>
            <Icon as={StarIcon} color="gold" boxSize={6} />
            <Text>({avaliacoes.length} avaliações)</Text>
          </HStack>
          <Divider />
          <Heading size="lg" mt={4}>Comentários</Heading>
          {avaliacoes.length > 0 ? (
            avaliacoes.map((avaliacao) => (
              <Box key={avaliacao.id} p={4} borderWidth={1} borderRadius={8} width="full">
                <HStack>
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      as={StarIcon} // USANDO NOSSO COMPONENTE
                      color={i < avaliacao.nota ? 'gold' : 'gray.300'}
                    />
                  ))}
                </HStack>
                <Text mt={2}><strong>{avaliacao.clienteEmail}</strong></Text>
                <Text mt={1}>"{avaliacao.comentario}"</Text>
              </Box>
            ))
          ) : ( <Text>Este bartender ainda não recebeu avaliações.</Text> )}
        </VStack>
      ) : ( <Text>Bartender não encontrado.</Text> )}
    </Box>
  );
}