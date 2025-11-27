import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import {
  Box, Button, Container, FormControl, FormLabel, Heading, Input,
  VStack, useToast, HStack, Avatar, Text, Textarea
} from '@chakra-ui/react';

const CustomGold = "#A5874D";

export default function EditarPerfil() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    instagram: '',
    fotoURL: '',
    resumo: '',
    precoPorHora: '',
    cep: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: ''
  });

  useEffect(() => {
    if (!currentUser) return navigate('/login');

    const fetchProfile = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            nome: data.nome || '',
            telefone: data.telefone || '',
            instagram: data.instagram || '',
            fotoURL: data.fotoURL || '',
            resumo: data.resumo || '',
            precoPorHora: data.precoPorHora || '',
          
            cep: data.cep || '',
            endereco: data.endereco || '',
            numero: data.numero || '',
            bairro: data.bairro || '',
            cidade: data.cidade || '',
            uf: data.uf || ''
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let newPhotoURL = formData.fotoURL;

      if (imageFile) {
        const fileRef = ref(storage, `profile_pictures/${currentUser.uid}/${imageFile.name}`);
        await uploadBytes(fileRef, imageFile);
        newPhotoURL = await getDownloadURL(fileRef);
      }

      const localFormatado = formData.cidade && formData.uf 
        ? `${formData.cidade} - ${formData.uf}` 
        : '';

      await updateDoc(doc(db, 'users', currentUser.uid), {
        ...formData,
        fotoURL: newPhotoURL,
        local: localFormatado, 
        precoPorHora: Number(formData.precoPorHora) || 0
      });

      toast({ title: 'Perfil atualizado!', status: 'success', duration: 3000 });
      navigate('/dashboard');

    } catch (error) {
      toast({ title: 'Erro ao salvar', status: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Text p={10}>Carregando...</Text>;

  return (
    <Container maxW="container.md" py={10}>
      <Box bg="white" p={8} borderRadius="lg" shadow="md">
        <VStack spacing={6} as="form" onSubmit={handleSubmit}>
          <Heading size="lg" color="#292728">Editar Perfil</Heading>

          <VStack>
            <Avatar size="2xl" src={imageFile ? URL.createObjectURL(imageFile) : formData.fotoURL} />
            <Input type="file" accept="image/*" onChange={handleImageChange} pt={1} border="none" w="200px" />
          </VStack>

          <VStack spacing={4} w="full">
            <FormControl isRequired>
              <FormLabel>Nome Completo</FormLabel>
              <Input name="nome" value={formData.nome} onChange={handleChange} focusBorderColor={CustomGold} />
            </FormControl>

            <HStack w="full">
              <FormControl>
                <FormLabel>Preço/Hora (R$)</FormLabel>
                <Input name="precoPorHora" type="number" value={formData.precoPorHora} onChange={handleChange} focusBorderColor={CustomGold} />
              </FormControl>
              <FormControl>
                <FormLabel>Telefone</FormLabel>
                <Input name="telefone" value={formData.telefone} onChange={handleChange} focusBorderColor={CustomGold} />
              </FormControl>
            </HStack>

            <FormControl>
               <FormLabel>Instagram (@usuario)</FormLabel>
               <Input name="instagram" value={formData.instagram} onChange={handleChange} focusBorderColor={CustomGold} />
            </FormControl>

            <FormControl>
               <FormLabel>Resumo / Biografia</FormLabel>
               <Textarea name="resumo" value={formData.resumo} onChange={handleChange} focusBorderColor={CustomGold} placeholder="Conte um pouco sobre sua experiência..." />
            </FormControl>

            {/* --- ENDEREÇO --- */}
            <Heading size="sm" w="full" pt={4} color="gray.500">Endereço</Heading>
            
            <HStack w="full">
                <FormControl w="140px">
                    <FormLabel>CEP</FormLabel>
                    <Input name="cep" value={formData.cep} onChange={handleChange} focusBorderColor={CustomGold} />
                </FormControl>
                <FormControl flex={1}>
                    <FormLabel>Endereço</FormLabel>
                    <Input name="endereco" value={formData.endereco} onChange={handleChange} focusBorderColor={CustomGold} />
                </FormControl>
                <FormControl w="80px">
                    <FormLabel>Nº</FormLabel>
                    <Input name="numero" value={formData.numero} onChange={handleChange} focusBorderColor={CustomGold} />
                </FormControl>
            </HStack>

            <HStack w="full">
                <FormControl>
                    <FormLabel>Bairro</FormLabel>
                    <Input name="bairro" value={formData.bairro} onChange={handleChange} focusBorderColor={CustomGold} />
                </FormControl>
                <FormControl>
                    <FormLabel>Cidade</FormLabel>
                    <Input name="cidade" value={formData.cidade} onChange={handleChange} focusBorderColor={CustomGold} />
                </FormControl>
                <FormControl w="80px">
                    <FormLabel>UF</FormLabel>
                    <Input name="uf" value={formData.uf} onChange={handleChange} focusBorderColor={CustomGold} maxLength={2} />
                </FormControl>
            </HStack>
        
            <Button type="submit" bg={CustomGold} color="white" _hover={{ bg: '#8C713B' }} w="full" size="lg" mt={4} isLoading={saving}>
              Salvar Alterações
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Container>
  );
}