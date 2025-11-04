import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  VStack,
  useToast,
  InputGroup,
  InputLeftAddon,
  Container, 
  Spinner,   
  Center,    
  Link,      
  Text       
} from '@chakra-ui/react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../firebase/config.js';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('cliente');
  

  const [especialidade, setEspecialidade] = useState('');
  const [precoPorHora, setPrecoPorHora] = useState('');
  const [fotoURL, setFotoURL] = useState('');
  
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); 

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let userData = {
        uid: user.uid,
        email: user.email,
        role: role,
      };

      if (role === 'bartender') {
        userData = {
          ...userData,
          especialidade,
          precoPorHora: Number(precoPorHora), 
          fotoURL,
          nome: email.split('@')[0],
          
          whatsapp: whatsapp,
          instagram: instagram,
        };
      }

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, userData);

      toast({
        title: "Conta criada.",
        description: "Cadastro realizado com sucesso! Faça seu login.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate('/login'); 

    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast({
        title: "Erro no cadastro.",
        description: "Verifique seu email ou se a senha tem 6+ caracteres.",
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
        maxWidth="700px"
        width="100%"
        borderWidth={1} 
        borderRadius={8} 
        boxShadow="lg" 
        bg="white"
      >
        <VStack spacing={4}>
          <Heading color="primaria">Criar Conta</Heading>
          
          {isLoading ? (
            <Center h="300px">
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
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    focusBorderColor="primaria" 
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Eu sou</FormLabel>
                  <Select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)} 
                    focusBorderColor="primaria" 
                  >
                    <option value="cliente">Cliente (Quero contratar)</option>
                    <option value="bartender">Bartender (Quero trabalhar)</option>
                  </Select>
                </FormControl>

               
                {role === 'bartender' && (
                  <VStack spacing={4} w="100%" p={4} borderWidth={1} borderRadius="md" borderColor="gray.200">
                    <Heading size="sm" color="textoEscuro">Perfil do Bartender</Heading>
                    
                    <FormControl isRequired>
                      <FormLabel>Especialidade Principal</FormLabel>
                      <Input
                        type="text"
                        placeholder="Ex: Drinks Clássicos, Mixologia"
                        value={especialidade}
                        onChange={(e) => setEspecialidade(e.target.value)}
                        focusBorderColor="primaria"
                      />
                    </FormControl>
                    
                    <FormControl isRequired>
                      <FormLabel>Preço por Hora</FormLabel>
                      <InputGroup>
                        <InputLeftAddon>R$</InputLeftAddon>
                        <Input
                          type="number"
                          placeholder="50"
                          value={precoPorHora}
                          onChange={(e) => setPrecoPorHora(e.target.value)}
                          focusBorderColor="primaria"
                        />
                      </InputGroup>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>URL da Foto de Perfil (Opcional)</FormLabel>
                      <Input
                        type="text"
                        placeholder="https://exemplo.com/sua-foto.jpg"
                        value={fotoURL}
                        onChange={(e) => setFotoURL(e.target.value)}
                        focusBorderColor="primaria"
                      />
                    </FormControl>

            
                    <FormControl>
                      <FormLabel>WhatsApp (apenas números)</FormLabel>
                      <InputGroup>
                        <InputLeftAddon>+</InputLeftAddon>
                        <Input
                          type="tel"
                          placeholder="5583999998888"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          focusBorderColor="primaria"
                        />
                      </InputGroup>
                    </FormControl>

                   
                    <FormControl>
                      <FormLabel>Instagram (apenas utilizador)</FormLabel>
                      <InputGroup>
                        <InputLeftAddon>@</InputLeftAddon>
                        <Input
                          type="text"
                          placeholder="seu.usuario"
                          value={instagram}
                          onChange={(e) => setInstagram(e.target.value)}
                          focusBorderColor="primaria"
                        />
                      </InputGroup>
                    </FormControl>
                  </VStack>
                )}

                <Button 
                  type="submit" 
                  variant="principal" 
                  width="full"
                  size="lg"
                  mt={4}
                  isLoading={isLoading}
                >
                  Cadastrar
                </Button>

                <Center mt={2}>
                  <Link as={RouterLink} to="/login" fontSize="sm" color="textoEscuro">
                    <Text> 
                      Já tem uma conta?{' '}
                      <Text as="span" color="primaria" fontWeight="bold">
                        Entre aqui
                      </Text>
                    </Text>
                  </Link>
                </Center>
              </VStack>
            </form>
          )}
        </VStack>
      </Box>
    </Container>
  );
}