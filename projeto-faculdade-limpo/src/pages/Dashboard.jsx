// src/pages/Dashboard.jsx (Código Completo e Corrigido)

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { auth, db, storage } from '../firebase/config'; // <-- Esta linha agora funciona
import { useAuth } from '../context/AuthContext';
import {
  Box, Container, Flex, Heading, Text, VStack, Button,
  Image, Spinner, Center, HStack,
  FormControl, FormLabel, Input, useToast, Avatar 
} from '@chakra-ui/react';

// --- Cores do seu Home.jsx ---
const CustomGold = "#A5874D";
const DarkText = "#292728";

const LoadingSpinner = () => (
  <Center h="50vh">
    <Spinner size="xl" color={CustomGold} />
    <Text ml={4}>Carregando dados do usuário...</Text>
  </Center>
);

// Componente para os botões do menu
const MenuButton = ({ isActive, onClick, iconClass, children }) => (
  <Button
    variant={isActive ? "solid" : "ghost"}
    bg={isActive ? CustomGold : "transparent"}
    color={isActive ? "white" : DarkText}
    _hover={{ bg: isActive ? '#8C713B' : 'gray.100' }}
    justifyContent="flex-start"
    w="100%"
    leftIcon={<Box as="i" className={iconClass} mr={2} />}
    onClick={onClick}
  >
    {children}
  </Button>
);

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('loading');
  const [imageFile, setImageFile] = useState(null); 
  const [uploadingImage, setUploadingImage] = useState(false); 
  const navigate = useNavigate();
  const toast = useToast();

  // --- Lógica de Busca de Dados ---
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFormData({
            nome: data.nome || '',
            telefone: data.telefone || '',
            instagram: data.instagram || '',
            fotoURL: data.fotoURL || '/img/avatar-exemplo.png', 
            ...data
          });
          
          setActiveTab(
            data.role === 'administrador'
              ? 'admin'
              : data.role === 'bartender'
              ? 'meu-perfil'
              : 'editar-perfil'
          );
        } else {
          console.log('Usuário não encontrado!');
          navigate('/login');
        }
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [currentUser, navigate]);

  // --- Lógica de Logout ---
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Erro ao sair:', err);
    }
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // --- Funções para o Formulário de Edição ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler para a seleção de imagem
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Função para fazer upload da imagem para o Firebase Storage
  const uploadImage = async () => {
    if (!imageFile || !currentUser) return formData.fotoURL; 

    setUploadingImage(true);
    const fileRef = ref(storage, `profile_pictures/${currentUser.uid}/${imageFile.name}`);
    try {
      await uploadBytes(fileRef, imageFile);
      const photoURL = await getDownloadURL(fileRef);
      setUploadingImage(false);
      setImageFile(null); 
      return photoURL;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      toast({
        title: "Erro no upload da imagem.",
        description: "Não foi possível enviar a foto de perfil.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setUploadingImage(false);
      return formData.fotoURL; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSaving(true);
    let newPhotoURL = formData.fotoURL;

    if (imageFile) {
      newPhotoURL = await uploadImage();
      if (!newPhotoURL) {
        setIsSaving(false);
        return; 
      }
    }

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        nome: formData.nome,
        telefone: formData.telefone,
        instagram: formData.instagram,
        fotoURL: newPhotoURL, 
      });
      
      setFormData(prev => ({ ...prev, fotoURL: newPhotoURL }));

      toast({
        title: "Perfil Atualizado!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

    } catch (err) {
      console.error(err);
      toast({
        title: "Erro ao salvar.",
        description: "Tente novamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsSaving(false);
  };

  if (loading || !formData) return <LoadingSpinner />;

  // --- JSX ---
  return (
    <Container maxW="container.lg" py={{ base: 10, md: 16 }}>
      <Flex direction={{ base: 'column', md: 'row' }} gap={10}>
        
        {/* Coluna da Esquerda: Menu de Navegação */}
        <Box w={{ base: '100%', md: '300px' }} flexShrink={0}>
          {/* Card de Informação do Usuário (COM AVATAR) */}
          <VStack 
            spacing={4} 
            p={6} 
            bg="gray.50" 
            borderRadius="md" 
            boxShadow="sm" 
            align="center" 
            mb={6}
          >
            <Avatar
              size="xl" 
              name={formData.nome || 'Usuário'}
              src={imageFile ? URL.createObjectURL(imageFile) : formData.fotoURL} 
              alt="Avatar"
              border="3px solid"
              borderColor={CustomGold}
            />
            <Heading size="md" color={DarkText}>Olá, {formData.nome || 'Usuário'}!</Heading>
            <Text color="gray.600" fontSize="sm">{formData.email}</Text>
          </VStack>

          {/* Menu (Com a correção do </MenuButton>) */}
          <VStack as="nav" align="stretch" spacing={2}>
            
            {formData.role === 'bartender' && (
              <MenuButton
                isActive={activeTab === 'meu-perfil'}
                onClick={() => handleTabClick('meu-perfil')}
                iconClass="fa-solid fa-user-tie"
              >
                Meu Perfil
              </MenuButton>
            )}

            {formData.role === 'administrador' && (
              <MenuButton
                isActive={activeTab === 'admin'}
                onClick={() => handleTabClick('admin')}
                iconClass="fa-solid fa-shield-halved"
              >
                Painel Admin
              </MenuButton>
            )}
            
            <MenuButton
              isActive={activeTab === 'editar-perfil'}
              onClick={() => handleTabClick('editar-perfil')}
              iconClass="fa-solid fa-user-pen"
            >
              Editar Perfil
            </MenuButton> 

            <MenuButton
              isActive={activeTab === 'seguranca'}
              onClick={() => handleTabClick('seguranca')}
              iconClass="fa-solid fa-lock"
            >
              Alterar Senha
            </MenuButton>

            <Button
              variant="ghost"
              color="red.500"
              _hover={{ bg: 'red.50' }}
              justifyContent="flex-start"
              w="100%"
              leftIcon={<Box as="i" className="fa-solid fa-right-from-bracket" mr={2} />}
              onClick={handleLogout}
            >
              Sair
            </Button>
          </VStack>
        </Box>

        {/* Coluna da Direita: Conteúdo das Abas */}
        <Box flex={1} bg="white" p={8} borderRadius="md" boxShadow="sm">
          
          {/* Painel de Editar Perfil (AGORA COM UPLOAD DE FOTO) */}
          <Box display={activeTab === 'editar-perfil' ? 'block' : 'none'} as="form" onSubmit={handleSubmit}>
            <Heading size="lg" mb={6}>Editar Perfil</Heading>
            <VStack spacing={5}>
              
              {/* === O CAMPO PARA TROCAR FOTO ESTÁ AQUI === */}
              <FormControl>
                <FormLabel htmlFor="foto" color={DarkText}>Foto de Perfil</FormLabel>
                <Input
                  id="foto"
                  name="foto"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  p={1}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                />
              </FormControl>

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
                isLoading={isSaving || uploadingImage} 
                loadingText={uploadingImage ? "Enviando foto..." : "Salvando..."}
              >
                Salvar Alterações
              </Button>
            </VStack>
          </Box>

          {/* Painel para Alterar Senha */}
          <Box display={activeTab === 'seguranca' ? 'block' : 'none'}>
            <Heading size="lg" mb={6}>Segurança</Heading>
            <Text>Em breve: formulário para alterar a sua senha.</Text>
          </Box>

          {/* Painel de Bartender */}
          <Box display={activeTab === 'meu-perfil' ? 'block' : 'none'}>
            <Heading size="lg" mb={6}>Meu Perfil de Bartender</Heading>
            <Text mb={4}>Aqui você poderá editar suas informações, preço e biografia.</Text>
            <Button as={Link} to={`/bartender/${currentUser.uid}`} bg={CustomGold} color="white" _hover={{ bg: '#8C713B' }}>
              Ver meu Perfil Público
            </Button>
          </Box>

          {/* Painel de Admin */}
          <Box display={activeTab === 'admin' ? 'block' : 'none'}>
            <Heading size="lg" mb={6}>Painel do Administrador</Heading>
            <Text mb={4}>Gerenciamento do sistema.</Text>
            <Button as={Link} to="/admin/moderar-avaliacoes" bg={CustomGold} color="white" _hover={{ bg: '#8C713B' }}>
              Moderar Avaliações
            </Button>
          </Box>
        </Box>
      </Flex>
    </Container>
  );
}