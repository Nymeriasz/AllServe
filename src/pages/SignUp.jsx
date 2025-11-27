import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import {
  Box, Button, Container, FormControl, FormLabel, Heading, Input,
  VStack, Text, useToast, Select, HStack, Link
} from '@chakra-ui/react';

const CustomGold = "#A5874D";

export default function SignUp() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'cliente',
    cep: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: ''
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast({ title: 'Senhas não conferem', status: 'error' });
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: formData.nome });

      const localFormatado = formData.cidade && formData.uf 
        ? `${formData.cidade} - ${formData.uf}` 
        : '';

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        nome: formData.nome,
        email: formData.email,
        role: formData.role,
        
        cep: formData.cep,
        endereco: formData.endereco,
        numero: formData.numero,
        bairro: formData.bairro,
        cidade: formData.cidade,
        uf: formData.uf,
        local: localFormatado,
        
        createdAt: new Date(),
        status: 'Online'
      });

      toast({ title: 'Conta criada com sucesso!', status: 'success' });
      navigate(formData.role === 'bartender' ? '/dashboard' : '/home');

    } catch (error) {
      console.error(error);
      toast({ 
        title: 'Erro ao criar conta', 
        description: error.message, 
        status: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="gray.50" minH="100vh" py={10}>
      <Container maxW="container.md" bg="white" p={8} borderRadius="lg" shadow="lg">
        <VStack spacing={6}>
          <Heading color="#292728">Crie sua conta</Heading>
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              
              <FormControl isRequired>
                <FormLabel>Nome Completo</FormLabel>
                <Input name="nome" onChange={handleChange} focusBorderColor={CustomGold} />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" name="email" onChange={handleChange} focusBorderColor={CustomGold} />
              </FormControl>

              <HStack w="100%">
                <FormControl isRequired>
                  <FormLabel>Senha</FormLabel>
                  <Input type="password" name="password" onChange={handleChange} focusBorderColor={CustomGold} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <Input type="password" name="confirmPassword" onChange={handleChange} focusBorderColor={CustomGold} />
                </FormControl>
              </HStack>

              <FormControl isRequired>
                <FormLabel>Eu sou:</FormLabel>
                <Select name="role" onChange={handleChange} focusBorderColor={CustomGold}>
                  <option value="cliente">Cliente (Quero contratar)</option>
                  <option value="bartender">Bartender (Quero trabalhar)</option>
                </Select>
              </FormControl>

              <Heading size="sm" w="full" pt={2} color="gray.500">Endereço</Heading>
              
              <HStack w="100%">
                 <FormControl w="140px">
                    <FormLabel>CEP</FormLabel>
                    <Input name="cep" onChange={handleChange} focusBorderColor={CustomGold} placeholder="00000-000"/>
                 </FormControl>
                 <FormControl flex={1}>
                    <FormLabel>Endereço</FormLabel>
                    <Input name="endereco" onChange={handleChange} focusBorderColor={CustomGold} placeholder="Rua, Av..."/>
                 </FormControl>
                 <FormControl w="80px">
                    <FormLabel>Nº</FormLabel>
                    <Input name="numero" onChange={handleChange} focusBorderColor={CustomGold} />
                 </FormControl>
              </HStack>

              <HStack w="100%">
                 <FormControl>
                    <FormLabel>Bairro</FormLabel>
                    <Input name="bairro" onChange={handleChange} focusBorderColor={CustomGold} />
                 </FormControl>
                 <FormControl>
                    <FormLabel>Cidade</FormLabel>
                    <Input name="cidade" onChange={handleChange} focusBorderColor={CustomGold} />
                 </FormControl>
                 <FormControl w="80px">
                    <FormLabel>UF</FormLabel>
                    <Input name="uf" onChange={handleChange} focusBorderColor={CustomGold} maxLength={2} placeholder="SP"/>
                 </FormControl>
              </HStack>
          
              <Button 
                type="submit" 
                w="full" 
                bg={CustomGold} 
                color="white" 
                _hover={{ bg: '#8C713B' }}
                isLoading={loading}
                size="lg"
                mt={4}
              >
                Cadastrar
              </Button>
            </VStack>
          </form>

          <Text>
            Já tem uma conta? <Link as={RouterLink} to="/login" color={CustomGold} fontWeight="bold">Entrar</Link>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}