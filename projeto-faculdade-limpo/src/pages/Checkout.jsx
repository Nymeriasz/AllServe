// src/pages/Checkout.jsx (CORRIGIDO)

import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Image,
  IconButton,
  Input,
  FormControl,
  FormLabel,
  SimpleGrid,
  useToast,
  Icon,
  Flex ,
  Center
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa'; 

import { useCart } from '../context/CartContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';


const CartItem = ({ item, removeFromCart, updateQuantity }) => {
  return (
  
    <Flex 
      bg="white" 
      p={4} 
      borderRadius="md" 
      boxShadow="sm" 
      align="center" 
      justify="space-between"
      borderWidth="1px"
      borderColor="gray.200"
    >
      <HStack spacing={4} flex={1}>
        <Image 
          src={item.fotoURL || '/img/avatar-exemplo.png'} 
          alt={item.nome}
          boxSize="60px"
          borderRadius="md"
          objectFit="cover"
        />
        <Box>
          <Heading size="sm" color="textoEscuro">{item.nome}</Heading>
          <Text fontSize="sm" color="gray.500">{item.especialidade}</Text>
          <Text fontSize="md" color="primaria" fontWeight="bold">
            R$ {item.precoPorHora.toFixed(2)}/hora
          </Text>
        </Box>
      </HStack>
      
      <HStack spacing={3}>
        <Input 
          type="number" 
          value={item.quantity}
          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
          min={1}
          max={8} 
          width="70px"
          textAlign="center"
          focusBorderColor="primaria"
        />
        <IconButton
          aria-label="Remover item"
          icon={<Icon as={FaTrash} />} 
          size="sm"
          variant="ghost"
          colorScheme="red"
          onClick={() => removeFromCart(item.id)}
        />
      </HStack>
    </Flex>
  );
};


export default function Checkout() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

 
  const total = getTotalPrice(); 

  const handleCheckout = () => {
    toast({
      title: 'Compra finalizada!',
      description: 'O seu pedido foi agendado com sucesso.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    clearCart();
    navigate('/payment-success');
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

            <Box bg="fundoCard" p={6} borderRadius="lg" mt={4}>
              <Heading size="md" mb={4} color="textoEscuro">Resumo do Pedido</Heading>
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text color="textoPrincipal">Subtotal</Text>
                  <Text fontWeight="medium" color="textoEscuro">R$ {total.toFixed(2)}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="textoPrincipal">Taxa de Serviço</Text>
                  <Text fontWeight="medium" color="textoEscuro">R$ 0.00</Text>
                </HStack>
                <HStack justify="space-between" pt={3} borderTopWidth="1px" borderColor="gray.300">
                  <Text fontWeight="bold" fontSize="lg" color="textoEscuro">Total</Text>
                  <Text fontWeight="bold" fontSize="lg" color="primaria">
                    R$ {total.toFixed(2)}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
          
          <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200" h="fit-content">
            <Heading as="h2" size="md" mb={6} color="textoEscuro">
              Informações de Pagamento
            </Heading>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nome no Cartão</FormLabel>
                <Input placeholder="Seu nome completo" focusBorderColor="primaria" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Número do Cartão</FormLabel>
                <Input placeholder="0000 0000 0000 0000" focusBorderColor="primaria" />
              </FormControl>
              <HStack w="100%">
                <FormControl isRequired>
                  <FormLabel>Validade (MM/AA)</FormLabel>
                  <Input placeholder="MM/AA" focusBorderColor="primaria" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>CVV</FormLabel>
                  <Input placeholder="123" focusBorderColor="primaria" />
                </FormControl>
              </HStack>
              
              <Button 
                variant="principal" 
                size="lg" 
                width="full" 
                mt={4}
                onClick={handleCheckout}
              >
                Finalizar Compra
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>
      )}
    </Container>
  );
}