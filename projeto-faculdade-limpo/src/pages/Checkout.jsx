// src/pages/Checkout.jsx 

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Heading, Text, VStack, useToast, Spinner, Center,
  Divider, HStack, IconButton, Icon, 
} from '@chakra-ui/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext.jsx';

const TAXA_PLATAFORMA = 0.10; 


const CloseIcon = (props) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-83.6 290.5c4.8 4.8 4.8 12.6 0 17.4l-40.5 40.5c-4.8 4.8-12.6 4.8-17.4 0L256 313.3l-66.5 67.1c-4.8 4.8-12.6 4.8-17.4 0l-40.5-40.5c-4.8-4.8-4.8-12.6 0-17.4L198.1 256 131.6 189.5c-4.8-4.8-4.8-12.6 0-17.4l40.5-40.5c4.8-4.8 12.6-4.8 17.4 0L256 198.1l66.5-67.1c4.8-4.8 12.6-4.8 17.4 0l40.5 40.5c4.8 4.8 4.8 12.6 0 17.4L313.9 256l66.5 66.5z"></path>
  </svg>
);


export default function Checkout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { cart, removeFromCart, clearCart } = useCart();

  const precoBase = cart.reduce((acc, item) => acc + (Number(item.precoPorHora) || 0), 0);
  const taxaPlataforma = precoBase * TAXA_PLATAFORMA;
  const valorTotal = precoBase + taxaPlataforma;

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    setTimeout(async () => {
      try {
        const pagamentosRef = collection(db, "pagamentos");
        await addDoc(pagamentosRef, {
          clienteId: currentUser.uid,
          clienteEmail: currentUser.email,
          itens: cart.map(item => ({ id: item.id, nome: item.nome, preco: item.precoPorHora })),
          itemComprado: `Serviços de ${cart.map(b => b.nome).join(', ')}`,
          valorBase: precoBase,
          taxa: taxaPlataforma,
          valor: valorTotal,
          status: "Aprovado",
          criadoEm: serverTimestamp(),
        });
        clearCart();
        navigate('/payment-success');
      } catch (error) {
        console.error("Erro ao salvar comprovante:", error);
        toast({ title: "Erro", description: "Não foi possível salvar seu comprovante.", status: "error" });
        setIsProcessing(false);
      }
    }, 3000); 
  };

  return (
    <Box p={8} maxWidth="700px" margin="auto" mt={10} borderWidth={1} borderRadius={8} boxShadow="lg">
      <VStack spacing={6}>
        <Heading>Carrinho e Checkout</Heading>
        
        <VStack spacing={4} align="stretch" w="full">
          <Heading size="md">Itens no seu carrinho</Heading>
          {cart.length > 0 ? (
            cart.map(item => (
              <HStack key={item.id} justify="space-between" p={2} borderWidth={1} borderRadius={4}>
                <Box>
                  <Text fontWeight="bold">{item.nome}</Text>
                  <Text fontSize="sm">R$ {(Number(item.precoPorHora) || 0).toFixed(2)}</Text>
                </Box>
                <IconButton
                  icon={<Icon as={CloseIcon} />} // USAMOS O 'Icon as={...}'
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remover do carrinho"
                />
              </HStack>
            ))
          ) : (
            <Text>Seu carrinho está vazio.</Text>
          )}
        </VStack>
        
        <Divider />
        
        {/* ... (resto do JSX do Checkout: Sumário de custos, botão de pagar, etc.) ... */}
        <VStack spacing={4} align="stretch" w="full">
          <HStack justify="space-between">
            <Text>Valor dos serviços (base):</Text>
            <Text>R$ {precoBase.toFixed(2)}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>Taxa da plataforma (10%):</Text>
            <Text>R$ {taxaPlataforma.toFixed(2)}</Text>
          </HStack>
          <Divider />
          <HStack justify="space-between" fontSize="2xl" fontWeight="bold">
            <Text color="teal.500">Total:</Text>
            <Text color="teal.500">R$ {valorTotal.toFixed(2)}</Text>
          </HStack>
        </VStack>

        {isProcessing ? (
          <Center h="100px">
            <VStack>
              <Spinner size="xl" />
              <Text>Processando pagamento... Por favor, aguarde.</Text>
            </VStack>
          </Center>
        ) : (
          <Button
            colorScheme="teal"
            size="lg"
            width="full"
            onClick={handleSimulatePayment}
            isDisabled={cart.length === 0}
          >
            Pagar com Cartão (Simulado)
          </Button>
        )}
      </VStack>
    </Box>
  );
}