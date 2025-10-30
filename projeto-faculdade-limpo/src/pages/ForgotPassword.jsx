// src/pages/ForgotPassword.jsx (Estilizado)

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  useToast,
  Text,
  Container, // Adicionado
  Spinner,   // Adicionado
  Center     // Adicionado
} from '@chakra-ui/react';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase/config.js';

// --- Cores do seu Home.jsx ---
const CustomGold = "#A5874D";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado de loading
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Ativa o loading

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "E-mail enviado.",
        description: "Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Em caso de sucesso, também desativamos o loading
      setIsLoading(false); 
    } catch (error) {
      console.error("Erro ao enviar e-mail de recuperação:", error);
      toast({
        title: "Erro.",
        description: "Ocorreu um problema ao tentar enviar o e-mail.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false); // Desativa o loading em caso de erro
    }
  };

  return (
    <Container maxW="container.lg" py={{ base: 12, md: 20 }} centerContent>
      <Box 
        p={8} 
        maxWidth="500px" 
        width="100%"
        borderWidth={1} 
        borderRadius={8} 
        boxShadow="lg" 
        bg="white"
      >
        <VStack spacing={4}>
          <Heading color={CustomGold}>Recuperar Senha</Heading>
          <Text textAlign="center" color="gray.600">
            Digite seu e-mail e enviaremos um link para você voltar a acessar sua conta.
          </Text>

          {isLoading ? (
            <Center h="150px">
              <Spinner size="xl" color={CustomGold} />
            </Center>
          ) : (
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4} mt={4}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    type="email" 
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    focusBorderColor={CustomGold}
                  />
                </FormControl>
                
                <Button 
                  type="submit" 
                  bg={CustomGold} 
                  color="white" 
                  _hover={{ bg: '#8C713B' }} 
                  width="full"
                  size="lg"
                  mt={4}
                  isLoading={isLoading}
                >
                  Enviar e-mail de recuperação
                </Button>
              </VStack>
            </form>
          )}
        </VStack>
      </Box>
    </Container>
  );
}