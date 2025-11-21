// src/pages/Checkout.jsx
import React, { useState } from 'react';
import {
  Box, Container, Heading, Text, VStack, HStack, Button, Image,
  IconButton, Input, FormControl, FormLabel, SimpleGrid,
  useToast, Icon, Flex, Center, Spinner
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa'; 
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Importar Auth
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config'; // Importar Banco de Dados
import { collection, addDoc } from 'firebase/firestore';

const CartItem = ({ item, removeFromCart, updateQuantity }) => {
  return (
    <Flex 
      bg="white" p={4} borderRadius="md" boxShadow="sm" 
      align="center" justify="space-between" borderWidth="1px" borderColor="gray.200"
    >
      <HStack spacing={4} flex={1}>
        <Image 
          src={item.imagem || item.fotoURL || '/img/avatar-exemplo.png'} 
          alt={item.nome}
          boxSize="60px" borderRadius="md" objectFit="cover"
        />
        <Box>
          <Heading size="sm" color="textoEscuro">{item.nome}</Heading>
          <Text fontSize="sm" color="gray.500">{item.especialidade || 'Bartender'}</Text>
          <Text fontSize="md" color="primaria" fontWeight="bold">
            R$ {Number(item.precoPorHora).toFixed(2)}/hora
          </Text>
        </Box>
      </HStack>
      
      <HStack spacing={3}>
        <Input 
          type="number" 
          value={item.quantity}
          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
          min={1} max={8} width="70px" textAlign="center" focusBorderColor="primaria"
        />
        <IconButton
          aria-label="Remover item"
          icon={<Icon as={FaTrash} />} 
          size="sm" variant="ghost" colorScheme="red"
          onClick={() => removeFromCart(item.id)}
        />
      </HStack>
    </Flex>
  );
};

export default function Checkout() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { currentUser } = useAuth(); // Pegar usuário logado
  const toast = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = getTotalPrice(); 

  const handleCheckout = async () => {
    if (!currentUser) {
      toast({ title: 'Erro', description: 'Você precisa estar logado.', status: 'error' });
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Salvar cada item do carrinho na coleção 'pagamentos'
      const promises = cart.map(async (item) => {
        await addDoc(collection(db, 'pagamentos'), {
          clienteId: currentUser.uid,
          clienteNome: currentUser.displayName || currentUser.email,
          bartenderId: item.id,
          itemComprado: item.nome, // Nome que aparecerá no histórico
          fotoURL: item.imagem || item.fotoURL || null,
          valor: Number(item.precoPorHora) * Number(item.quantity),
          horasContratadas: item.quantity,
          status: 'Pago', // Status confirmado
          criadoEm: new Date()
        });
      });

      await Promise.all(promises);

      // 2. Sucesso
      toast({
        title: 'Pagamento Confirmado!',
        description: 'O profissional agora aparece em seus pedidos.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      clearCart();
      navigate('/historico-pagamentos'); // Redireciona direto para "Meus Pedidos"

    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast({
        title: 'Erro no pagamento',
        description: 'Tente novamente mais tarde.',
        status: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container maxW="container.lg" py={{ base: 10, md: 16 }}>
      <Heading as="h1" size="xl" mb={8} color="textoEscuro">
        Meu Carrinho
      </Heading>
      
      {cart.length === 0 ? (
        <Center h="200px" bg="gray.50" borderRadius="md">
          <VStack>
            <Text fontSize="lg" color="gray.600">O seu carrinho está vazio.</Text>
            <Button as={RouterLink} to="/profissionais" variant="principal">
              Encontrar Profissionais
            </Button>
          </VStack>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
          
          {/* Lista de Itens */}
          <VStack spacing={6} align="stretch">
            <Heading as="h2" size="md" color="textoEscuro">
              Itens ({cart.length})
            </Heading>
            <VStack spacing={4} align="stretch">
              {cart.map((item) => (
                <CartItem 
                  key={item.id} 
                  item={item}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />
              ))}
            </VStack>

            <Box bg="gray.50" p={6} borderRadius="lg" mt={4}>
              <Heading size="md" mb={4} color="textoEscuro">Resumo do Pedido</Heading>
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text color="gray.600">Subtotal</Text>
                  <Text fontWeight="medium">R$ {total.toFixed(2)}</Text>
                </HStack>
                <HStack justify="space-between" pt={3} borderTopWidth="1px" borderColor="gray.300">
                  <Text fontWeight="bold" fontSize="lg">Total</Text>
                  <Text fontWeight="bold" fontSize="lg" color="primaria">
                    R$ {total.toFixed(2)}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
          
          {/* Formulário de Pagamento */}
          <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" h="fit-content">
            <Heading as="h2" size="md" mb={6} color="textoEscuro">
              Pagamento Seguro
            </Heading>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nome no Cartão</FormLabel>
                <Input placeholder="Como impresso no cartão" focusBorderColor="primaria" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Número do Cartão</FormLabel>
                <Input placeholder="0000 0000 0000 0000" focusBorderColor="primaria" />
              </FormControl>
              <HStack w="100%">
                <FormControl isRequired>
                  <FormLabel>Validade</FormLabel>
                  <Input placeholder="MM/AA" focusBorderColor="primaria" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>CVV</FormLabel>
                  <Input placeholder="123" focusBorderColor="primaria" />
                </FormControl>
              </HStack>
              
              <Button 
                variant="solid" 
                bg="#A5874D" 
                color="white"
                _hover={{ bg: '#8C713B' }}
                size="lg" 
                width="full" 
                mt={4}
                onClick={handleCheckout}
                isLoading={isProcessing}
                loadingText="Processando..."
              >
                Pagar R$ {total.toFixed(2)}
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>
      )}
    </Container>
  );
}