import React, { useState, useEffect } from 'react';
import {
  Box, Container, Heading, VStack, FormControl, FormLabel,
  Input, Button, Spinner, Center, Alert, AlertIcon, useToast
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext.jsx';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Cores do seu tema
const CustomGold = "#A5874D";
const DarkText = "#292728";

export default function EditarPerfil() {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    instagram: '',
    // Adicione mais campos aqui se necessário (ex: resumo, especialidade)
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // 1. Buscar dados atuais do utilizador
  useEffect(() => {
    if (!currentUser) return;

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDocCref);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            nome: data.nome || '',
            telefone: data.telefone || '',
            instagram: data.instagram || '',
          });
        } else {
          console.log("Nenhum documento de utilizador encontrado!");
        }
      } catch (err) {
        console.error(err);
        setError("Falha ao carregar dados do perfil.");
      }
      setLoading(false);
    };

    fetchUserData();
  }, [currentUser]);

  // 2. Atualizar o estado do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Salvar os dados no Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSaving(true);
    setError(null);

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        nome: formData.nome,
        telefone: formData.telefone,
        instagram: formData.instagram,
        // (Certifique-se de que os campos aqui correspondem aos do Firestore)
      });
      
      toast({
        title: "Perfil Atualizado!",
        description: "Os seus dados foram salvos com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

    } catch (err) {
      console.error(err);
      setError("Falha ao salvar. Tente novamente.");
      toast({
        title: "Erro",
        description: "Falha ao salvar. Tente novamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsSaving(false);
  };

  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color={CustomGold} thickness="4px" />
      </Center>
    );
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" color={DarkText} mb={4}>
          Editar Perfil
        </Heading>
        
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={5}>
            <FormControl isRequired>
              <FormLabel htmlFor="nome" color={DarkText}>Nome Completo</FormLabel>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                focusBorderColor={CustomGold}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="telefone" color={DarkText}>Telefone (com DDD)</FormLabel>
              <Input
                id="telefone"
                name="telefone"
                type="tel"
                placeholder="(XX) XXXXX-XXXX"
                value={formData.telefone}
                onChange={handleChange}
                focusBorderColor={CustomGold}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="instagram" color={DarkText}>Instagram (utilizador)</FormLabel>
              <Input
                id="instagram"
                name="instagram"
                placeholder="ex: seu.utilizador"
                value={formData.instagram}
                onChange={handleChange}
                focusBorderColor={CustomGold}
              />
            </FormControl>
            
            <Button
              type="submit"
              bg={CustomGold}
              color="white"
              _hover={{ bg: '#8C713B' }}
              size="lg"
              w="full"
              isLoading={isSaving}
              loadingText="Salvando..."
            >
              Salvar Alterações
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}