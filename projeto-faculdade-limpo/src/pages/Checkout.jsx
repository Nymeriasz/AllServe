// src/pages/Checkout.jsx (Convertido para Chakra UI)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// --- Importações do Chakra UI ---
import {
  Box, Container, Heading, Text, Button, VStack, HStack, Flex,
  Image, Input, IconButton, Spinner, Center, Divider
} from '@chakra-ui/react';

// --- Cores do seu Home.jsx ---
const CustomGold = "#A5874D";
const DarkText = "#292728";

// --- Ícone (FontAwesome) ---
const FaIcon = ({ className }) => (
  <Box as="i" className={className} fontSize="lg" color={DarkText} />
);

const TAXA_PLATAFORMA = 0.1; // 10%

export default function Checkout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUser } = useAuth();
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // --- Cálculos (Lógica 100% mantida) ---
  const subtotal = cart.reduce((acc, i) => acc + (Number(i.precoPorHora) || 0) * (Number(i.quantity) || 1), 0);
  const taxa = subtotal * TAXA_PLATAFORMA;
  const total = subtotal + taxa;

  // Função de formatação (Lógica 100% mantida)
  const f = (v) => `R$ ${v.toFixed(2).replace('.', ',')}`;

  // --- Pagamento simulado (Lógica 100% mantida) ---
  const handlePayment = async () => {
    if (!cart.length || !currentUser) return;
    setIsProcessing(true);
    setTimeout(async () => {
      try {
        await addDoc(collection(db, 'pagamentos'), {
          clienteId: currentUser.uid,
          clienteEmail: currentUser.email,
          itens: cart.map((i) => ({
            id: i.id,
            nome: i.nome,
            precoPorHora: i.precoPorHora,
            quantity: i.quantity,
          })),
          valorBase: subtotal,
          taxa,
          valor: total,
          status: 'Aprovado',
          criadoEm: serverTimestamp(),
        });

        clearCart();
        navigate('/payment-success');
      } catch (err) {
        console.error('Erro ao salvar pagamento:', err);
        alert('Erro ao processar pagamento. Tente novamente.');
        setIsProcessing(false);
      }
    }, 2000);
  };

  // --- JSX (Convertido para Chakra UI) ---
  return (
    <Box>
      {/* 1. Banner (Estilo do seu Home/Sobre) */}
      <Box bg="#E9E0D4" py={12} textAlign="center">
        <Container maxW="container.lg">
          <Heading as="h1" size="2xl" color={CustomGold}>
            Carrinho e Checkout
          </Heading>
        </Container>
      </Box>

      {/* 2. Conteúdo da Página */}
      <Container maxW="container.lg" py={{ base: 10, md: 16 }}>
        {/* Mostra spinner se estiver processando */}
        {isProcessing ? (
          <Center h="300px">
            <VStack>
              <Spinner size="xl" color={CustomGold} />
              <Text fontSize="lg" color="gray.600">Processando seu pagamento...</Text>
            </VStack>
          </Center>
        ) : cart.length === 0 ? (
          // Mensagem de Carrinho Vazio
          <Center h="200px">
            <Text fontSize="xl" color="gray.600">Seu carrinho está vazio.</Text>
          </Center>
        ) : (
          // Layout Principal (Itens + Resumo)
          <Flex direction={{ base: 'column-reverse', lg: 'row' }} gap={10}>
            
            {/* Coluna da Esquerda: Itens do Carrinho */}
            <VStack flex={1} spacing={4} align="stretch">
              {/* Cabeçalho (antigo .carrinho-header) */}
              <Flex
                display={{ base: 'none', md: 'flex' }} // Esconde em telas pequenas
                w="100%"
                py={2}
                borderBottom="2px solid"
                borderColor="gray.200"
                fontWeight="bold"
                color="gray.600"
              >
                <Text flex={2}>Profissional</Text>
                <Text flex={1}>Valor/Hora</Text>
                <Text flex={1}>Hora(s)</Text>
                <Text flex={1} textAlign="right">Total</Text>
                <Box w="50px" /> {/* Espaço para o botão de remover */}
              </Flex>

              {/* Lista de Itens */}
              {cart.map((item) => {
                const preco = Number(item.precoPorHora) || 0;
                const qtd = Number(item.quantity) || 1;
                const totalItem = preco * qtd;
                return (
                  <Flex
                    key={item.id}
                    direction={{ base: 'column', md: 'row' }}
                    align="center"
                    p={4}
                    boxShadow="sm"
                    borderWidth={1}
                    borderRadius="md"
                    bg="white"
                  >
                    {/* Item Info */}
                    <HStack flex={2} w="100%" mb={{ base: 4, md: 0 }}>
                      <Image
                        src={item.imagem || '/img/avatar-placeholder.png'}
                        alt={item.nome}
                        boxSize="60px"
                        borderRadius="md"
                        objectFit="cover"
                        mr={3}
                      />
                      <Heading size="sm" color={DarkText}>{item.nome}</Heading>
                    </HStack>

                    {/* Preço, Qtd, Total */}
                    <HStack flex={3} w="100%" justify={{ base: 'space-between', md: 'normal' }}>
                      <Text flex={1}>{f(preco)}</Text>
                      <Input
                        type="number"
                        value={qtd}
                        readOnly
                        w="80px"
                        flex={1}
                        textAlign="center"
                      />
                      <Text flex={1} fontWeight="bold" textAlign="right">{f(totalItem)}</Text>
                    </HStack>

                    {/* Botão Remover */}
                    <IconButton
                      aria-label="Remover item"
                      icon={<FaIcon className="fa-regular fa-trash-can" />}
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => !isProcessing && removeFromCart(item.id)}
                      disabled={isProcessing}
                      w="50px"
                      ml={{ md: 4 }}
                      mt={{ base: 4, md: 0 }}
                    />
                  </Flex>
                );
              })}
            </VStack>

            {/* Coluna da Direita: Resumo do Pedido */}
            <Box
              w={{ base: '100%', lg: '350px' }}
              bg="gray.50"
              p={6}
              borderRadius="md"
              boxShadow="sm"
              alignSelf="flex-start" // Gruda no topo
            >
              <VStack spacing={4} align="stretch">
                <Heading size="lg" color={DarkText}>Resumo do Pedido</Heading>
                
                <HStack justify="space-between" fontSize="md">
                  <Text color="gray.600">Subtotal</Text>
                  <Text>{f(subtotal)}</Text>
                </HStack>
                
                <HStack justify="space-between" fontSize="md">
                  <Text color="gray.600">Taxa (10%)</Text>
                  <Text>{f(taxa)}</Text>
                </HStack>
                
                <Divider />
                
                <HStack justify="space-between">
                  <Heading size="md" color={DarkText}>Total</Heading>
                  <Heading size="md" color={CustomGold}>{f(total)}</Heading>
                </HStack>
                
                <Button
                  onClick={handlePayment}
                  bg={CustomGold}
                  color="white"
                  _hover={{ bg: '#8C713B' }}
                  size="lg"
                  w="100%"
                  mt={4}
                  isLoading={isProcessing}
                  disabled={isProcessing || !cart.length}
                >
                  Pagar Agora (Simulado)
                </Button>
              </VStack>
            </Box>

          </Flex>
        )}
      </Container>
    </Box>
  );
}