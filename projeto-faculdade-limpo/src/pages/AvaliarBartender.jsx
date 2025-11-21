import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Heading, Textarea, VStack,
  useToast, HStack, Icon, Container
} from '@chakra-ui/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Use addDoc para gerar ID automático
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { FaStar } from 'react-icons/fa'; 

export default function AvaliarBartender() {
  const { bartenderId } = useParams();
  const { currentUser } = useAuth();
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast({ title: 'Erro', description: 'Você precisa estar logado.', status: 'error' });
      return;
    }
    if (nota === 0) {
      toast({ title: 'Nota obrigatória', description: 'Selecione pelo menos 1 estrela.', status: 'warning' });
      return;
    }

    setLoading(true);
    try {
  
      await addDoc(collection(db, 'users', bartenderId, 'avaliacoes'), {
        autorId: currentUser.uid,
        autorNome: currentUser.displayName || currentUser.email.split('@')[0],
        nota: nota,
        comentario: comentario,
        visivel: true,
        createdAt: serverTimestamp(),
        tipo: 'avaliacao'
      });

      toast({ title: 'Avaliação enviada!', status: 'success', duration: 5000, isClosable: true });
      navigate('/dashboard'); // Volta para o painel
    } catch (error) {
      console.error("Erro ao avaliar:", error);
      toast({ title: 'Erro ao enviar', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <Box p={8} bg="white" shadow="md" borderRadius="lg">
        <VStack spacing={6}>
          <Heading size="lg" color="#292728">Avaliar Bartender</Heading>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={5}>
              
              <FormControl isRequired>
                <FormLabel>Sua Nota</FormLabel>
                <HStack spacing={2} justify="center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      as={FaStar}
                      boxSize={8}
                      color={star <= nota ? '#A5874D' : 'gray.300'} // Cor Dourada do projeto
                      cursor="pointer"
                      onClick={() => setNota(star)}
                      _hover={{ transform: 'scale(1.2)' }}
                      transition="0.2s"
                    />
                  ))}
                </HStack>
              </FormControl>

              <FormControl>
                <FormLabel>Comentário (Opcional)</FormLabel>
                <Textarea
                  placeholder="Conte como foi sua experiência..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  focusBorderColor="#A5874D"
                />
              </FormControl>

              <Button 
                type="submit" 
                bg="#A5874D" 
                color="white" 
                _hover={{ bg: '#8C713B' }}
                width="full"
                isLoading={loading}
              >
                Enviar Avaliação
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Container>
  );
}