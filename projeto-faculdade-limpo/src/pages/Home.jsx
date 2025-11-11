import React, { useState, useEffect } from 'react'; 
import { Link as RouterLink } from 'react-router-dom'; 
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Container, 
  SimpleGrid, 
  Image, 
  Flex, 
  Spinner, 
  Center,

  LinkBox,
  LinkOverlay,
  HStack,
  Link,
  Icon
} from '@chakra-ui/react'; 

import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

import Tradicional from '../assets/tradicional-icon.png';
import Barista from '../assets/barista-icon.png';
import Showman from '../assets/showman-icon.png';
import Capa from '../assets/capa.png'; 

const servicesData = [
  { id: 'tradicional', name: 'Tradicional', title: 'Barman Clássico/Tradicional', description: 'Muito requisitado em festas formais, jantares de gala e bares sofisticados, já que domina os coquetéis clássicos e o atendimento elegante.', imgSrc: Tradicional },
  { id: 'barista', name: 'Barista', title: 'Especialista em Cafés', description: 'Profissional treinado para preparar e servir bebidas à base de café, com foco em arte e qualidade. Perfeito para eventos matinais ou de encerramento.', imgSrc: Barista },
  { id: 'showman', name: 'Showman', title: 'Flair Bartender', description: 'Bartender que incorpora manobras acrobáticas com garrafas e utensílios, proporcionando um espetáculo visual e entretenimento para os convidados.', imgSrc: Showman },
];

const InitialServiceCard = ({ service, onClick }) => (
    <Box 
        bg="fundoCard" 
        borderRadius="15px" 
        boxShadow="0 4px 12px rgba(0,0,0,0.08)"
        textAlign="center" 
        overflow="hidden" 
        transition="transform 0.3s ease" 
        onClick={() => onClick(service)} 
        cursor="pointer" 
        _hover={{ 
            transform: 'translateY(-10px)'
        }}
    >
      <Image 
        src={service.imgSrc} 
        alt={`Ilustração ${service.name}`} 
        maxH="180px" 
        width="100%"
        objectFit="cover"
      />
      <Heading as="h3" size="md" fontWeight="bold" p={5} color="textoEscuro">
        {service.name}
      </Heading>
    </Box>
);

const DetailServiceCard = ({ service, onBack }) => (
    <Box p={{ base: 6, md: 10 }} bg="white" borderRadius="lg" boxShadow="xl" textAlign="left" maxWidth={{ base: '100%', lg: '800px' }} mx="auto" display="flex" flexDirection={{ base: 'column', md: 'row' }} alignItems="center">
        <Box flexShrink={0} width={{ base: '100%', md: '40%' }} height={{ base: '200px', md: '300px' }} borderRadius="lg" display="flex" alignItems="center" justifyContent="center" mb={{ base: 4, md: 0 }} mr={{ md: 6 }}>
            <Image src={service.imgSrc} alt={`Ilustração ${service.name}`} maxH="100%" maxW="100%" objectFit="contain" />
        </Box>
        <Box flexGrow={1}>
            <Text fontSize="md" color="textoPrincipal" mb={1} fontWeight="medium">{service.name}</Text>
            <Heading as="h3" size="xl" color="primaria" mb={4}>{service.title}</Heading>
            <Text fontSize="md" color="textoPrincipal" mb={6}>{service.description}</Text>
            <Button as={RouterLink} to="/profissionais" variant="principal" size="md">
                VER PROFISSIONAIS {service.name.toUpperCase()}S
            </Button>
            <Button variant="link" size="sm" ml={4} onClick={onBack} color="gray.500">Voltar</Button>
        </Box>
    </Box>
);


const ProfissionalCard = ({ profissional }) => {
    const imageUrl = profissional.fotoURL || `https://api.dicebear.com/8.x/avataaars/svg?seed=${profissional.seed || profissional.nome}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    const preco = Number(profissional.precoPorHora) || 0;

    
    const whatsappLink = profissional.whatsapp; 
    const instagramLink = profissional.instagram;

    return (
     
        <LinkBox 
            bg="white" 
            borderRadius="md" 
            boxShadow="lg" 
            overflow="hidden" 
            textAlign="left" 
            transition="0.2s" 
            _hover={{ boxShadow: '2xl', transform: 'translateY(-4px)' }}
        >
            <Box aspectRatio={1 / 1} overflow="hidden" position="relative">
           
            <LinkOverlay as={RouterLink} to={`/bartender/${profissional.id}`}>
                <Image src={imageUrl} alt={`Avatar de ${profissional.nome}`} objectFit="cover" width="100%" height="100%" p={1} />
            </LinkOverlay>
            </Box>
            <Box px={3} py={3}> 
            
                <Heading as="h4" size="sm" color="textoEscuro" mb={1} noOfLines={1}> 
                <LinkOverlay as={RouterLink} to={`/bartender/${profissional.id}`}>
                    {profissional.nome}
                </LinkOverlay>
                </Heading>
                <Text fontSize="xs" color="textoPrincipal" mb={1} noOfLines={1}> 
                    {profissional.especialidade} 
                </Text>
           
            
            <Flex justify="space-between" align="center" mt={2}>
                  <Text fontSize="md" fontWeight="bold" color="primaria"> 
                      R$ {preco > 0 ? preco.toFixed(0) : 'N/A'} 
                  </Text>

        
              <HStack spacing={2}>
                 
                  {whatsappLink && (
                      <Link 
                          href={`https://wa.me/${whatsappLink}`} 
                          isExternal 
                          bg="#25d366" 
                          color="white"
                          h="24px"
                          w="24px"
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          _hover={{ opacity: 0.8 }}
                          onClick={(e) => e.stopPropagation()} 
                      >
                          <Icon as={FaWhatsapp} fontSize="14px" />
                      </Link>
                  )}

                  {instagramLink && (
                      <Link 
                          href={`https://instagram.com/${instagramLink}`} 
                          isExternal 
                          bgGradient="linear(to-r, #f09433, #e6683c, #dc2743, #bc1888)" 
                          color="white"
                          h="24px"
                          w="24px"
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          _hover={{ opacity: 0.8 }}
                          onClick={(e) => e.stopPropagation()} // Impede o card de ser clicado
                      >
                          <Icon as={FaInstagram} fontSize="14px" />
                      </Link>
                  )}
              </HStack>
            </Flex>
            </Box>
        </LinkBox>
    );
};



export default function Home() {
  const [selectedService, setSelectedService] = useState(null);
  const [profissionals, setprofissionals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchprofissionals = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'users'),
          where('role', '==', 'bartender'),
          limit(8) 
        );
        const querySnapshot = await getDocs(q);
        const profissionalsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setprofissionals(profissionalsList);
      } catch (error) {
        console.error("Erro ao buscar profissionais:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchprofissionals();
  }, []);

  return (
    <Box>
      <Box bg="corFooter" minH={{ base: '600px', md: '80vh' }} id='inicio' position="relative" overflow="hidden" display="flex" alignItems="center">
        <Box position="absolute" top="0" left="0" right="0" bottom="0" zIndex="0" bg={`url(${Capa}) center/cover no-repeat`} opacity={0.3}/> 
        <Container maxW="container.xl" position="relative" zIndex="1">
          <Box maxWidth={{ base: '90%', md: '500px' }} bg="fundoCard" p={{ base: 6, md: 8 }} borderRadius="lg" boxShadow="xl" textAlign="left" marginLeft={{ base: 'auto', md: 'auto' }} marginRight={{ base: 'auto', md: 'auto' }}> 
            <Text fontSize="md" color="textoPrincipal" mb={2} fontWeight="medium">Bem-vindo ao AllServe</Text>
            <Heading as="h1" size={{ base: 'xl', md: '2xl' }} fontWeight="extrabold" mb={4} color="primaria" lineHeight="1.2">
              Ache o bartender ideal para o seu evento
            </Heading>
            <Text fontSize="md" mb={6} color="textoPrincipal">Conecte-se com profissionais qualificados para tornar sua festa inesquecível.</Text>
            
            <Button as={RouterLink} to="/profissionais" variant="principal" size="lg" py={6} px={8}> 
              CONTRATAR AGORA
            </Button>
            
          </Box>
        </Container>
      </Box>

      <Box p={8} textAlign="center" py={{ base: 12, md: 20 }} bg="white" id='sobre'>
          <Container maxW="container.xl">
              <Heading as="h2" size={{ base: 'xl', md: '2xl' }} fontWeight="extrabold" mb={2} color="textoEscuro">Nossos serviços</Heading>
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
                variant="secundario" 
                mt={12}
                size="lg" 
              >
                  Conheça Nossa História
              </Button>

          </Container>
      </Box>

      
      <Box p={8} textAlign="center" py={{ base: 12, md: 20 }} bg="#FAFAFA" id="profissionais"> 
          <Container maxW="container.xl">
              <Heading as="h2" size="2xl" fontWeight="extrabold" mb={12} color="textoEscuro">Profissionais</Heading>
              
              {loading ? (
                <Center h="200px"><Spinner size="xl" color="primaria" /></Center>
              ) : (
                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={6}> 
                    {profissionals.map((profissional) => (
                        <ProfissionalCard key={profissional.id} profissional={profissional} />

                    ))}
                </SimpleGrid>
              )}
              
              <Button as={RouterLink} to="/profissionais" variant="secundario" mt={12} size="lg">
                  Mostrar mais
              </Button>
          </Container>
      </Box>
    </Box>
  );
}
