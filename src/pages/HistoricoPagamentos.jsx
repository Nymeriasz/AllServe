import { useEffect, useState, useRef } from 'react';
import {
  Box, Container, Heading, Text, VStack, Spinner, Center,
  HStack, Badge, Button, useDisclosure, Card, CardBody, Flex,
  Icon, useToast, IconButton, Tooltip,
  AlertDialog, AlertDialogBody, AlertDialogFooter,
  AlertDialogHeader, AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaCalendarAlt, FaReceipt, FaCheckCircle, FaTrash, FaTimes } from 'react-icons/fa';
import AvaliacaoModal from '../components/AvaliacaoModal';

const CustomGold = "#A5874D";

export default function HistoricoPagamentos() {
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedBartender, setSelectedBartender] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const cancelRef = useRef();

  const openConfirm = (action) => {
    setConfirmAction(() => action);
    setIsConfirmOpen(true);
  };

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "pagamentos"),
      where("clienteId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const lista = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      lista.sort((a, b) => {
        const dateA = a.criadoEm?.seconds || 0;
        const dateB = b.criadoEm?.seconds || 0;
        return dateB - dateA;
      });

      setPagamentos(lista);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar pagamentos:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleOpenAvaliacao = (pagamento) => {
    setSelectedBartender({
      id: pagamento.bartenderId,
      nome: pagamento.itemComprado
    });
    onOpen();
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "pagamentos", id));
      toast({ title: "Item removido.", status: "info", duration: 2000 });
    } catch (error) {
      toast({ title: "Erro ao remover.", status: "error" });
    }
  };

  const handleClearHistory = async () => {
    try {
      const deletePromises = pagamentos.map(p => deleteDoc(doc(db, "pagamentos", p.id)));
      await Promise.all(deletePromises);
      toast({ title: "Histórico limpo!", status: "success", duration: 3000 });
    } catch (error) {
      toast({ title: "Erro ao limpar.", status: "error" });
    }
  };

  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color={CustomGold} />
        <Text ml={4} color="gray.500">Carregando pedidos...</Text>
      </Center>
    );
  }

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={10}>
      <Container maxW="container.lg">

        <VStack spacing={6} align="stretch">

          {/* Cabeçalho */}
          <Flex justify="space-between" align="end" borderBottom="2px solid" borderColor={CustomGold} pb={2}>
            <Box>
              <Heading size="lg" color="#292728">Meus Pedidos</Heading>
              <Text color="gray.500">Histórico de contratações</Text>
            </Box>

            {pagamentos.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                borderColor={CustomGold}
                color={CustomGold}
                leftIcon={<FaTrash />}
                _hover={{ bg: CustomGold, color: "white" }}
                onClick={() => openConfirm(() => handleClearHistory())}
              >
                Limpar Histórico
              </Button>
            )}
          </Flex>

          {pagamentos.length === 0 ? (
            <Center h="200px" flexDirection="column" bg="white" borderRadius="lg" shadow="sm">
              <Icon as={FaReceipt} w={12} h={12} color="gray.300" mb={4} />
              <Text color="gray.500">Seu histórico está vazio.</Text>
            </Center>
          ) : (

            pagamentos.map(pagamento => (
              <Card
                key={pagamento.id}
                shadow="sm"
                borderLeft="4px solid"
                borderColor={CustomGold}
                _hover={{ shadow: 'md' }}
                transition="0.2s"
              >
                <CardBody>
                  <Flex justify="space-between" align="center" wrap="wrap" gap={6}>

                    <VStack align="start" spacing={1}>
                      <Heading size="md" color="#292728">{pagamento.itemComprado || "Profissional"}</Heading>

                      <HStack color="gray.500" fontSize="sm">
                        <Icon as={FaCalendarAlt} color={CustomGold} />
                        <Text>
                          {pagamento.criadoEm
                            ? new Date(pagamento.criadoEm.seconds * 1000).toLocaleString('pt-BR')
                            : "Data pendente"}
                        </Text>
                      </HStack>

                      <Text fontSize="xs" color="gray.400">ID: {pagamento.id.slice(0, 8)}...</Text>
                    </VStack>

                    <VStack align="end" spacing={2}>
                      <HStack>
                        <Text fontSize="sm" color="gray.500">Total Pago:</Text>
                        <Text fontSize="xl" fontWeight="bold" color="green.600">
                          R$ {Number(pagamento.valor).toFixed(2)}
                        </Text>
                      </HStack>

                      <HStack>
                        <Badge colorScheme="green" px={2} py={1} borderRadius="md">
                          <Icon as={FaCheckCircle} mr={1} />
                          {pagamento.status || "Pago"}
                        </Badge>

                        <Button
                          size="sm"
                          leftIcon={<FaStar />}
                          bg={CustomGold}
                          color="white"
                          _hover={{ bg: "#8C713B" }}
                          onClick={() => handleOpenAvaliacao(pagamento)}
                        >
                          Avaliar
                        </Button>

                        <Tooltip label="Remover do histórico">
                          <IconButton
                            icon={<FaTimes />}
                            size="sm"
                            variant="ghost"
                            color="gray.400"
                            _hover={{ color: "red.500", bg: "red.50" }}
                            aria-label="Remover item"
                            onClick={() => openConfirm(() => handleDeleteItem(pagamento.id))}
                          />
                        </Tooltip>
                      </HStack>
                    </VStack>

                  </Flex>
                </CardBody>
              </Card>
            ))
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
        <AlertDialog
          isOpen={isConfirmOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsConfirmOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent borderTop="4px solid" borderColor={CustomGold}>
              <AlertDialogHeader fontSize="lg" fontWeight="bold" color="#292728">
                Confirmar Ação
              </AlertDialogHeader>

              <AlertDialogBody color="gray.600">
                Tem certeza que deseja continuar? Esta ação não pode ser desfeita.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setIsConfirmOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  color="white"
                  bg={CustomGold}
                  _hover={{ bg: "#8C713B" }}
                  ml={3}
                  onClick={() => {
                    confirmAction();
                    setIsConfirmOpen(false);
                  }}
                >
                  Confirmar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

      </Container>
    </Box>
  );
}
