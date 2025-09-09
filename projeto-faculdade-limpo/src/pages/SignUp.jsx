// src/pages/SignUp.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Box, Button, FormControl, FormLabel, Heading, Input, Select, VStack, useToast } from '@chakra-ui/react'; // NOVO: Select e useToast
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { auth, db } from '../firebase/config.js';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('cliente');
  const navigate = useNavigate(); 
  const toast = useToast(); 

  const handleSubmit = async (event) => { // NOVO: A função agora é 'async'
    event.preventDefault();
    
    try {
      // 1. Cria o usuário na Autenticação
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 2. Salva os dados adicionais no Firestore
      // Cria uma referência para um novo documento na coleção 'users' com o ID do usuário
      const userDocRef = doc(db, "users", user.uid);
      
      // Salva os dados nesse documento
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        role: role 
      });

      console.log("Usuário cadastrado e dados salvos no Firestore:", user.uid);
      toast({ 
        title: "Conta criada.",
        description: "Seu cadastro foi realizado com sucesso!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate('/login'); 

    } catch (error) {
      console.error("Erro no cadastro:", error.code, error.message);
      toast({ 
        title: "Erro no cadastro.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg" margin="auto" mt={10}>
      <VStack spacing={4}>
        <Heading>Criar Conta</Heading>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input 
                type="email" 
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Senha</FormLabel>
              <Input 
                type="password" 
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
            </FormControl>

            {/* NOVO: Seletor de Papel */}
            <FormControl isRequired>
              <FormLabel>Eu sou</FormLabel>
              <Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="cliente">Cliente</option>
                <option value="bartender">Bartender</option>
                <option value="administrador">Administrador</option>
              </Select>
            </FormControl>

            <Button type="submit" colorScheme="teal" width="full">
              Cadastrar
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
}