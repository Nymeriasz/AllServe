import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  useToast,
  Link,
  Flex,
  Container,
  Spinner,
  Center,
  Text 
} from '@chakra-ui/react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase/config.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); 

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login bem-sucedido.",
        description: `Bem-vindo de volta!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard'); 
    } catch (error) {
      console.error("Erro no login:", error.code, error.message);
      toast({
        title: "Erro no login.",
        description: "Email ou senha inválidos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false); 
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
  
          <Heading color="primaria">Entrar</Heading>
          
          {isLoading ? (
            <Center h="200px">
              <Spinner size="xl" color="primaria" />
            </Center>
          ) : (
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    type="email" 
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    focusBorderColor="primaria" 
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Senha</FormLabel>
                  <Input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    focusBorderColor="primaria"
                  />
                </FormControl>
                

                <Button 
                  type="submit" 
                  variant="principal" 
                  width="full"
                  size="lg"
                  mt={4}
                  isLoading={isLoading}
                >
                  Entrar
                </Button>

                <Flex width="full" justify="space-between" align="center" mt={2}>
                  <Link as={RouterLink} to="/signup" fontSize="sm" color="textoEscuro">
                    <Text> 
                      Não tem uma conta?{' '}
                      <Text as="span" color="primaria" fontWeight="bold">
                        Crie aqui
                      </Text>
                    </Text>
                  </Link>
                  
                  <Link as={RouterLink} to="/forgot-password" fontSize="sm" color="primaria">
                    Esqueci minha senha
                  </Link>
                </Flex>
              </VStack>
            </form>
          )}
        </VStack>
      </Box>
    </Container>
  );
}