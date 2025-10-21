// src/pages/PaymentSuccess.jsx
import { Box, Heading, Text, VStack, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export default function PaymentSuccess() {
  return (
    <Box p={8} textAlign="center" mt={10}>
      <VStack spacing={4}>
        <Heading color="teal.500">Pagamento Aprovado!</Heading>
        <Text fontSize="lg">Seu comprovante foi gerado e o serviço foi contratado.</Text>
        <Button as={RouterLink} to="/dashboard" colorScheme="teal">
          Voltar para o Dashboard
        </Button>
      </VStack>
    </Box>
  );
}