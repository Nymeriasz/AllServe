import { useEffect, useState } from 'react';
import {
  Box, Heading, Text, VStack, Spinner, Center, Divider, HStack, Badge, Button, useDisclosure
} from '@chakra-ui/react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { FaStar } from 'react-icons/fa';
import AvaliacaoModal from '../components/AvaliacaoModal';

export default function HistoricoPagamentos() {
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedBartender, setSelectedBartender] = useState(null);

  useEffect(() => {
    const fetchPagamentos = async () => {
      if (!currentUser) return;

      try {
        const q = query(
          collection(db, "pagamentos"),
          where("clienteId", "==", currentUser.uid),
          orderBy("criadoEm", "desc")
        );

        const querySnapshot = await getDocs(q);
        const listaPagamentos = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPagamentos(listaPagamentos);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPagamentos();
  }, [currentUser]);

  const handleOpenAvaliacao = (pagamento) => {
    setSelectedBartender({
      id: pagamento.bartenderId,
      nome: pagamento.itemComprado 
    });
    onOpen();
  };

  if (loading) {
    return <Center h="50vh"><Spinner size="xl" /></Center>;
  }

  return (
    <Box p={8} maxW="container.lg" mx="auto">
      <Heading mb={6}>Histórico e Avaliações</Heading>
      <VStack spacing={4} align="stretch">
        {pagamentos.length > 0 ? (
          pagamentos.map(pagamento => (
            <Box key={pagamento.id} p={5} borderWidth={1} borderRadius={8} boxShadow="md" bg="white">
              <HStack justify="space-between" wrap="wrap" gap={4}>
                <Box>
                  <Text fontSize="xl" fontWeight="bold">{pagamento.itemComprado}</Text>
                  <Text color="gray.500">
                    Data: {pagamento.criadoEm ? new Date(pagamento.criadoEm.toDate()).toLocaleString('pt-BR') : 'Data pendente'}
                  </Text>
                  <Text fontSize="sm" color="gray.400">ID: {pagamento.id}</Text>
                </Box>
                
                <VStack align="flex-end">
                  <Text fontSize="2xl" fontWeight="bold" color="teal.500">
                    R$ {pagamento.valor.toFixed(2)}
                  </Text>
                  <HStack>
                    <Badge colorScheme="green">{pagamento.status}</Badge>
                    

                    <Button 
                      leftIcon={<FaStar />} 
                      colorScheme="yellow" 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenAvaliacao(pagamento)}
                    >
                      Avaliar Profissional
                    </Button>
                  </HStack>
                </VStack>
              </HStack>
            </Box>
          ))
        ) : (
          <Text>Você ainda não realizou nenhum pagamento.</Text>
        )}
      </VStack>
      {selectedBartender && (
        <AvaliacaoModal 
          isOpen={isOpen} 
          onClose={onClose} 
          avaliador={currentUser} 
          alvo={selectedBartender} 
        />
      )}
    </Box>
  );
}