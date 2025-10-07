// src/pages/AvaliarBartender.jsx (Versão com SVG)

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Textarea,
  VStack,
  useToast,
  HStack,
  Icon,
} from '@chakra-ui/react';
// REMOVEMOS A IMPORTAÇÃO DO REACT-ICONS
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

// CRIAMOS NOSSO PRÓPRIO COMPONENTE DE ESTRELA COM SVG
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

export default function AvaliarBartender() {
  const { bartenderId } = useParams();
  const { currentUser } = useAuth();
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) { /* ... Lógica de envio ... */ return; }
    if (nota === 0) { /* ... Lógica de envio ... */ return; }
    try {
      const avaliacaoRef = doc(collection(db, 'users', bartenderId, 'avaliacoes'));
      await setDoc(avaliacaoRef, { clienteId: currentUser.uid, clienteEmail: currentUser.email, nota, comentario, criadoEm: serverTimestamp(), visivel: true });
      toast({ title: 'Avaliação enviada!', status: 'success', duration: 5000, isClosable: true });
      navigate('/dashboard');
    } catch (error) { /* ... Lógica de erro ... */ }
  };

  return (
    <Box p={8} maxWidth="600px" margin="auto" mt={10}>
      <VStack spacing={6}>
        <Heading>Avaliar Bartender</Heading>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nota</FormLabel>
              <HStack spacing={1}>
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <Icon
                      key={ratingValue}
                      as={StarIcon} // USANDO NOSSO COMPONENTE
                      boxSize={8}
                      color={ratingValue <= nota ? 'gold' : 'gray.300'}
                      cursor="pointer"
                      onClick={() => setNota(ratingValue)}
                    />
                  );
                })}
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel>Comentário (opcional)</FormLabel>
              <Textarea
                placeholder="Deixe seu feedback sobre o serviço..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
              />
            </FormControl>
            <Button type="submit" colorScheme="teal" width="full">
              Enviar Avaliação
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
}