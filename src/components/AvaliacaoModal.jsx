import { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Text, Textarea, VStack, HStack, Icon, useToast
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function AvaliacaoModal({ isOpen, onClose, avaliador, alvo, onSuccess }) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleAvaliar = async () => {
    if (nota === 0) {
      toast({ title: "Selecione uma nota (estrelas)", status: "warning" });
      return;
    }

    setLoading(true);
    try {

      await addDoc(collection(db, 'users', alvo.id, 'avaliacoes'), {
        autorId: avaliador.uid,
        autorNome: avaliador.displayName || avaliador.email.split('@')[0],
        nota: nota,
        comentario: comentario,
        visivel: true, 
        createdAt: new Date(),
        tipo: 'avaliacao'
      });

      toast({ title: "Avaliação enviada com sucesso!", status: "success" });
      if (onSuccess) onSuccess();
      onClose();
      setNota(0);
      setComentario('');
    } catch (error) {
      console.error(error);
      toast({ title: "Erro ao enviar avaliação", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Avaliar {alvo?.nome || "Usuário"}</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <Text>Quantas estrelas você dá para este serviço?</Text>
            
    
            <HStack spacing={2}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon 
                  key={star} 
                  as={FaStar} 
                  w={8} h={8} 
                  cursor="pointer"
                  color={star <= nota ? "#ffc107" : "gray.300"}
                  onClick={() => setNota(star)}
                  _hover={{ transform: 'scale(1.2)' }}
                  transition="0.2s"
                />
              ))}
            </HStack>

            <Textarea 
              placeholder="Escreva um comentário sobre a experiência..." 
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
          <Button colorScheme="yellow" bg="#A5874D" color="white" onClick={handleAvaliar} isLoading={loading}>
            Enviar Avaliação
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}