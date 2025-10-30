// src/pages/PaymentSuccess.jsx (Estilizado)

import { Box, Heading, Text, VStack, Button, Container, Center, Icon } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { CheckCircleIcon } from '@chakra-ui/icons'; // Ícone de sucesso do Chakra

// --- Cores do seu Home.jsx ---
const CustomGold = "#A5874D";

export default function PaymentSuccess() {
  return (
    <Container maxW="container.lg" py={{ base: 12, md: 20 }} centerContent>
      <Box 
        p={8} 
        textAlign="center" 
        maxWidth="600px" 
        width="100%"
        borderWidth={1} 
        borderRadius={8} 
        boxShadow="lg" 
        bg="white"
      >
        <VStack spacing={6}>
          {/* Ícone de Sucesso */}
          <Icon as={CheckCircleIcon} w={20} h={20} color="green.500" />
          
          <Heading color={CustomGold}>Pagamento Aprovado!</Heading>
          
          <Text fontSize="lg" color="gray.700">
            Seu comprovante foi gerado e o serviço foi contratado com sucesso.
          </Text>
          
          <Button 
            as={RouterLink} 
            to="/dashboard" 
            bg={CustomGold} 
            color="white" 
            _hover={{ bg: '#8C713B' }}
            size="lg"
            mt={4}
          >
            Ver Meus Pedidos
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}