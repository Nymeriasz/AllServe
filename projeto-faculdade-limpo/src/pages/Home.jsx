// src/pages/Home.jsx (Links Corrigidos)

import React, { useState, useEffect } from 'react'; 
import { Link as RouterLink } from 'react-router-dom'; 
import { Box, Heading, Text, Button, Container, SimpleGrid, Image, Flex, Spinner, Center } from '@chakra-ui/react'; 

// Firestore Imports
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

// Assets (Imagens locais)
import Tradicional from '../assets/tradicional-icon.png';
import Barista from '../assets/barista-icon.png';
import Showman from '../assets/showman-icon.png';
import Capa from '../assets/capa.png'; 
import './Home.css'; 

// Cores
const PrimaryBg = "#E9E0D4";
const CardBg = "#F9F5EE";
const CustomGold = "#A5874D";
const DarkText = "#292728";
const LightText = "#707070";

// Dados dos Serviços
const servicesData = [
  { id: 'tradicional', name: 'Tradicional', title: 'Barman Clássico/Tradicional', description: '...', imgSrc: Tradicional },
  { id: 'barista', name: 'Barista', title: 'Especialista em Cafés', description: '...', imgSrc: Barista },
  { id: 'showman', name: 'Showman', title: 'Flair Bartender', description: '...', imgSrc: Showman },
];

// ----- SUB-COMPONENTES -----

const InitialServiceCard = ({ service, onClick }) => (
    <Box p={0} bg="white" borderRadius="lg" boxShadow="md" textAlign="center" overflow="hidden" transition="0.2s" onClick={() => onClick(service)} cursor="pointer" _hover={{ boxShadow: 'xl', transform: 'translateY(-2px)'}}>
        <Box bg="#EBDDA3" display="flex" alignItems="center" justifyContent="center" height="180px"> 
            <Image src={service.imgSrc} alt={`Ilustração ${service.name}`} maxH="80%" maxW="80%" objectFit="contain" p={1}/>
        </Box>
        <Text fontWeight="semibold" fontSize="lg" color={DarkText} py={4}>{service.name}</Text>
    </Box>
);

const DetailServiceCard = ({ service, onBack }) => (
    <Box p={{ base: 6, md: 10 }} bg="white" borderRadius="lg" boxShadow="xl" textAlign="left" maxWidth={{ base: '100%', lg: '800px' }} mx="auto" display="flex" flexDirection={{ base: 'column', md: 'row' }} alignItems="center">
        <Box flexShrink={0} width={{ base: '100%', md: '40%' }} height={{ base: '200px', md: '300px' }} borderRadius="lg" display="flex" alignItems="center" justifyContent="center" mb={{ base: 4, md: 0 }} mr={{ md: 6 }}>
            <Image src={service.imgSrc} alt={`Ilustração ${service.name}`} maxH="100%" maxW="100%" objectFit="contain" />
        </Box>
        <Box flexGrow={1}>
            <Text fontSize="md" color={LightText} mb={1} fontWeight="medium">{service.name}</Text>
            <Heading as="h3" size="xl" color={CustomGold} mb={4}>{service.title}</Heading>
            <Text fontSize="md" color={LightText} mb={6}>{service.description}</Text>
            
            {/* --- CORREÇÃO AQUI --- */}
            <Button as={RouterLink} to="/profissionais" bg={CustomGold} color="white" size="md" _hover={{ bg: "#8C713B" }}>
                VER PROFISSIONAIS {service.name.toUpperCase()}S
            </Button>
            {/* --- FIM DA CORREÇÃO --- */}

            <Button variant="link" size="sm" ml={4} onClick={onBack} color="gray.500">Voltar</Button>
        </Box>
    </Box>
);

const ProfessionalCard = ({ professional }) => {
    const imageUrl = professional.fotoURL || `https://api.dicebear.com/8.x/avataaars/svg?seed=${professional.seed || professional.nome}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    const preco = Number(professional.precoPorHora) || 0;

    return (
        <Box as={RouterLink} to={`/bartender/${professional.id}`} 
            bg="white" borderRadius="md" boxShadow="lg" overflow="hidden" textAlign="left" transition="0.2s" _hover={{ boxShadow: '2xl', transform: 'translateY(-4px)', textDecoration: 'none' }}>
            <Box aspectRatio={1 / 1} overflow="hidden" position="relative">
                <Image src={imageUrl} alt={`Avatar de ${professional.nome}`} objectFit="cover" width="100%" height="100%" p={1} />
            </Box>
            <Box px={3} py={3}> 
                <Heading as="h4" size="sm" color={DarkText} mb={1} noOfLines={1}> 
                    {professional.nome}
                </Heading>
                <Text fontSize="xs" color={LightText} mb={1} noOfLines={1}> 
                    {professional.especialidade} 
                </Text>
                <Text fontSize="md" fontWeight="bold" color={CustomGold}> 
                    R$ {preco > 0 ? preco.toFixed(0) : 'N/A'} 
                </Text>
            </Box>
        </Box>
    );
};

// ----- COMPONENTE PRINCIPAL Home -----
export default function Home() {
  const [selectedService, setSelectedService] = useState(null);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'users'),
          where('role', '==', 'bartender'),
          limit(8) 
        );
        const querySnapshot = await getDocs(q);
        const professionalsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProfessionals(professionalsList);
      } catch (error) {
        console.error("Erro ao buscar profissionais:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessionals();
  }, []);

  return (
    <Box>
      {/* ----- SEÇÃO 1: HERO ----- */}
      <Box bg={PrimaryBg} minH={{ base: '600px', md: '80vh' }} id='inicio' position="relative" overflow="hidden" display="flex" alignItems="center">
        <Box position="absolute" top="0" left="0" right="0" bottom="0" zIndex="0" className="Capa" bg={`url(${Capa}) center/cover no-repeat`} opacity={0.3}/> 
        <Container maxW="container.xl" position="relative" zIndex="1">
          <Box maxWidth={{ base: '90%', md: '500px' }} bg={CardBg} p={{ base: 6, md: 8 }} borderRadius="lg" boxShadow="xl" textAlign="left" marginLeft={{ base: 'auto', md: 'auto' }} marginRight={{ base: 'auto', md: 'auto' }}> 
            <Text fontSize="md" color={LightText} mb={2} fontWeight="medium">Bem-vindo ao AllServe</Text>
            <Heading as="h1" size={{ base: 'xl', md: '2xl' }} fontWeight="extrabold" mb={4} color={CustomGold} lineHeight="1.2">
              Ache o bartender ideal para o seu evento
            </Heading>
            <Text fontSize="md" mb={6} color={LightText}>Conecte-se com profissionais qualificados para tornar sua festa inesquecível.</Text>
            
            {/* --- CORREÇÃO AQUI --- */}
            <Button as={RouterLink} to="/profissionais" bg={CustomGold} color="white" size="lg" _hover={{ bg: "#8C713B" }} py={6} px={8}> 
              CONTRATAR AGORA
            </Button>
            {/* --- FIM DA CORREÇÃO --- */}
            
          </Box>
        </Container>
      </Box>

      {/* ----- SEÇÃO 2: SERVIÇOS ----- */}
      <Box p={8} textAlign="center" py={{ base: 12, md: 20 }} bg="white" id='sobre'>
          <Container maxW="container.xl">
              <Heading as="h2" size={{ base: 'xl', md: '2xl' }} fontWeight="extrabold" mb={2} color={DarkText}>Nossos serviços</Heading>
              <Text fontSize={{ base: 'md', md: 'lg' }} mb={12} fontWeight="medium" color="gray.500">Escolha o tipo de profissional ideal para sua ocasião.</Text>
              {selectedService ? (
                  <DetailServiceCard service={selectedService} onBack={() => setSelectedService(null)} />
              ) : (
                  <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={10} justifyContent="center" maxWidth="900px" mx="auto">
                      {servicesData.map((service) => ( <InitialServiceCard key={service.id} service={service} onClick={setSelectedService} /> ))}
                  </SimpleGrid>
              )}

              <Button 
                as={RouterLink} 
                to="/sobre"
                variant="outline" 
                mt={12}
                size="lg" 
                color={CustomGold} 
                borderColor={CustomGold} 
                _hover={{ bg: CustomGold, color: 'white' }}
              >
                  Conheça Nossa História
              </Button>

          </Container>
      </Box>

      {/* ----- SEÇÃO 3: PROFISSIONAIS ----- */}
      <Box p={8} textAlign="center" py={{ base: 12, md: 20 }} bg="#FAFAFA" id="profissionais"> 
          <Container maxW="container.xl">
              <Heading as="h2" size="2xl" fontWeight="extrabold" mb={12} color={DarkText}>Profissionais</Heading>
              {loading ? (
                <Center h="200px"><Spinner size="xl" color={CustomGold} /></Center>
              ) : (
                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={6}> 
                    {professionals.map((professional) => (
                        <ProfessionalCard key={professional.id} professional={professional} />
                    ))}
                </SimpleGrid>
              )}
              
              {/* --- CORREÇÃO AQUI --- */}
              <Button as={RouterLink} to="/profissionais" variant="outline" mt={12} size="lg" color={CustomGold} borderColor={CustomGold} _hover={{ bg: CustomGold, color: 'white' }}>
                  Mostrar mais
              </Button>
              {/* --- FIM DA CORREÇÃO --- */}
          </Container>
      </Box>
    </Box>
  );
}