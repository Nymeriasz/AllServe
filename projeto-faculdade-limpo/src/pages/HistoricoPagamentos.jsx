// src/pages/HistoricoPagamentos.jsx

import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Center,
  Divider,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export default function HistoricoPagamentos() {
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

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

  if (loading) {
    return <Center h="50vh"><Spinner size="xl" /></Center>;
  }

  return (
    <Box p={8}>
      <Heading mb={6}>Histórico de Pagamentos</Heading>
      <VStack spacing={4} align="stretch">
        {pagamentos.length > 0 ? (
          pagamentos.map(pagamento => (
            <Box key={pagamento.id} p={5} borderWidth={1} borderRadius={8} boxShadow="md">
              <HStack justify="space-between">
                <Box>
                  <Text fontSize="xl" fontWeight="bold">{pagamento.itemComprado}</Text>
                  <Text color="gray.500">
                    Data: {pagamento.criadoEm ? new Date(pagamento.criadoEm.toDate()).toLocaleString('pt-BR') : 'Data pendente'}
                  </Text>
                </Box>
                <VStack align="flex-end">
                  <Text fontSize="2xl" fontWeight="bold" color="teal.500">
                    R$ {pagamento.valor.toFixed(2)}
                  </Text>
                  <Badge colorScheme="green">{pagamento.status}</Badge>
                </VStack>
              </HStack>
              <Divider my={3} />
              <Text fontSize="sm">ID do Comprovante: {pagamento.id}</Text>
            </Box>
          ))
        ) : (
          <Text>Você ainda não realizou nenhum pagamento.</Text>
        )}
      </VStack>
    </Box>
  );
}