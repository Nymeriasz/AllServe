import React, { useState } from 'react';
import { Box, Heading, Text, Button, Container, SimpleGrid, Image, Flex } from '@chakra-ui/react';
import Tradicional from '../assets/tradicional-icon.png';
import Barista from '../assets/barista-icon.png';
import Showman from '../assets/showman-icon.png';
import './Home.css';

// Cores usadas com frequencia
const PrimaryBg = "#E9E0D4"; 
const CardBg = "#F9F5EE"; 
const CustomGold = "#A5874D"; 
const DarkText = "#292728";
const LightText = "#707070";

// Cards de 'serviços'
const servicesData = [
  { 
    id: 'tradicional', 
    name: 'Tradicional', 
    title: 'Barman Clássico/Tradicional',
    description: 'Muito requisitado em festas formais, jantares de gala e bares sofisticados, já que domina os coquetéis clássicos e o atendimento elegante.', 
    imgSrc: Tradicional
  }, 
  { 
    id: 'barista', 
    name: 'Barista', 
    title: 'Especialista em Cafés',
    description: 'Profissional treinado para preparar e servir bebidas à base de café, com foco em arte e qualidade. Perfeito para eventos matinais ou de encerramento.', 
    imgSrc: Barista
  }, 
  { 
    id: 'showman', 
    name: 'Showman', 
    title: 'Flair Bartender',
    description: 'Bartender que incorpora manobras acrobáticas com garrafas e utensílios, proporcionando um espetáculo visual e entretenimento para os convidados.', 
    imgSrc: Showman 
  },
];

// Dados dos profissionais
const professionalsData = [
  { id: 1, name: 'Harry Potter', category: 'Showman', price: '2.500', seed: 'harry-male' }, 
  { id: 2, name: 'Hermione Granger', category: 'Barista', price: '2.000', seed: 'hermione-feme' },
  { id: 3, name: 'Rony Weasley', category: 'Tradicional', price: '800', seed: 'rony-male' },
  { id: 4, name: 'Draco Malfoy', category: 'Tradicional', price: '1.300', seed: 'draco-male' },
  { id: 5, name: 'Sirius Black', category: 'Showman', price: '1.500', seed: 'sirius-male' },
  { id: 6, name: 'Luna Lovegood', category: 'Barista', price: '650', seed: '-feme' },
  { id: 7, name: 'Severus Snape', category: 'Tradicional', price: '1.200', seed: 'severus-male' },
  { id: 8, name: 'Remo Lupin', category: 'Showman', price: '900', seed: 'lupin-male' },
];

// Cards de Serviço (Estado Inicial)
const InitialServiceCard = ({ service, onClick }) => (
    <Box
        p={0}
        bg="white" 
        borderRadius="lg"
        boxShadow="md"
        textAlign="center"
        overflow="hidden"
        transition="0.2s"
        onClick={() => onClick(service)}
        cursor="pointer"
        _hover={{ 
             boxShadow: 'xl', 
             transform: 'translateY(-2px)', 
             transition: '0.2s',
        }}
    >
        {/* Imagens */}
        <Box
            bg="#EBDDA3"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            {service.imgSrc && (
                <Image 
                    src={service.imgSrc} 
                    alt={`Ilustração ${service.name}`}
                    maxH="100%" 
                    maxW="100%" 
                    objectFit="contain" 
                    p={1}
                />
            )}
            {!service.imgSrc && (
                <Text fontSize="lg" color={CustomGold} fontWeight="bold">Ilustração {service.name}</Text>
            )}
        </Box>

        <Text 
            fontWeight="semibold" 
            fontSize="lg" 
            color={DarkText} 
            py={4}
        >
            {service.name}
        </Text>
    </Box>
);

// Detalhes dos cards
const DetailServiceCard = ({ service, onBack }) => (
    <Box
        p={{ base: 6, md: 10 }}
        bg="white" 
        borderRadius="lg"
        boxShadow="xl"
        textAlign="left"
        maxWidth={{ base: '100%', lg: '800px' }}
        mx="auto"
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems="center"
    >
      {/* Imagens */}
        <Box
            flexShrink={0}
            width={{ base: '100%', md: '40%' }}
            height={{ base: '200px', md: '300px' }}
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={{ base: 4, md: 0 }}
            mr={{ md: 6 }}
        >
            <Image 
                src={service.imgSrc} 
                alt={`Ilustração ${service.name}`} 
                maxH="100%" 
                maxW="100%" 
                objectFit="contain" 
            />
        </Box>

        {/* Texto e button */}
        <Box flexGrow={1}>
            <Text fontSize="md" color={LightText} mb={1} fontWeight="medium">{service.name}</Text>
            <Heading as="h3" size="xl" color={CustomGold} mb={4}>
                {service.title}
            </Heading>
            <Text fontSize="md" color={LightText} mb={6}>
                {service.description}
            </Text>
            <Button 
                bg={CustomGold} 
                color="white"
                size="md"
                _hover={{ bg: "#8C713B" }} 
                onClick={() => console.log(`Contratar ${service.name}`)}
            >
                CONTRATAR AGORA
            </Button>
            <Button variant="link" size="sm" ml={4} onClick={onBack} color="gray.500">
                Voltar
            </Button>
        </Box>
    </Box>
);

// Cards de profissionais usando api DICERBEAR
const ProfessionalCard = ({ professional }) => {
    const DICERBEAR_URL = `https://api.dicebear.com/8.x/avataaars/svg?seed=${professional.seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    
    return (
        <Box
            bg="white"
            borderRadius="md"
            boxShadow="lg"
            overflow="hidden"
            textAlign="left"
            transition="0.2s"
            _hover={{ boxShadow: '2xl', transform: 'translateY(-4px)' }}
        >
            {/* Imagens */}
            <Box
                aspectRatio={1 / 1} 
                overflow="hidden" 
                position="relative"
            >
                <Image
                    src={DICERBEAR_URL} 
                    alt={`Avatar de ${professional.name}`}
                    objectFit="cover" 
                    width="100%"
                    height="100%"
                    p={1} 
                />
            </Box>

            {/* Texto do card */}
            <Box
                px={2} 
                py={2}
            >
                <Heading as="h4" size="xs" color={DarkText} mb={0}>
                    {professional.name}
                </Heading>
                <Text fontSize="2xs" color={LightText} mb={0}>
                    {professional.category}
                </Text>
                <Text fontSize="sm" fontWeight="bold" color={CustomGold}>
                    R$ {professional.price}
                </Text>
            </Box>
        </Box>
    );
};

export default function Home() {
  const [selectedService, setSelectedService] = useState(null); 
  
  return (
    <Box>
      {/* -------------------- SEÇÃO 1: Início -------------------- */}
      <Box 
        bg={PrimaryBg} 
        minH={{ base: '600px', md: '90vh' }} 
        id='inicio'
        position="relative"
        overflow="hidden"
        paddingY={{base: 8, md: 0}}
        display="flex" 
        alignItems="center" 
      >
        {/* Imagem de capa */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex="0"
          className="Capa"
        />

        {/* Card */}
        <Container 
          maxW="container.xl" 
          position="relative"
          zIndex="1"
        >
          <Box
            maxWidth={{ base: '90%', md: '500px' }} 
            bg={CardBg} 
            p={{ base: 6, md: 8 }} 
            borderRadius="lg"
            boxShadow="xl" 
            textAlign="left" 
            marginLeft={{ base: 'auto', md: 'auto' }} 
            marginRight={{ base: 'auto', md: '0' }}
          >
            <Text fontSize="md" color={LightText} mb={2} fontWeight="medium">
              Bem-vindo ao AllServe
            </Text>
            <Heading 
              as="h1" 
              size={{ base: 'xl', md: '1xl' }} 
              fontWeight="extrabold"
              mb={4}
              color={CustomGold} 
              lineHeight="1.2" 
            >
              Ache o bartender ideal para o seu evento
            </Heading>
            <Text fontSize="md" mb={6} color={LightText}> 
              Conecte-se com profissionais qualificados para tornar sua festa inesquecível.
            </Text>
            <Button 
              bg={CustomGold} 
              color="white"
              size="lg"
              _hover={{ bg: "#8C713B" }} 
              onClick={() => console.log('Contratar Agora')}
              py={5} 
              px={6}
            >
              CONTRATAR AGORA
            </Button>
          </Box>
        </Container>
      </Box>

      {/* -------------------- SEÇÃO 2: Sobre -------------------- */}
      <Box 
          p={8} 
          textAlign="center" 
          py={{ base: 12, md: 20 }} 
          bg="white"
          id='sobre'
      > 
          <Container maxW="container.xl">
              <Heading 
                  as="h2" 
                  size={{ base: 'xl', md: '1xl' }} 
                  fontWeight="extrabold" 
                  mb={2}
                  color={DarkText}
              >
                  Nossos serviços
              </Heading>
              <Text
                  fontSize={{ base: 'md', md: 'lg' }} 
                  mb={12} 
                  fontWeight="medium"
                  color="gray.500" 
              >
                  Escolha o tipo de profissional ideal para sua ocasião.
              </Text>

              {selectedService ? (
                  <DetailServiceCard 
                      service={selectedService} 
                      onBack={() => setSelectedService(null)} 
                  />
              ) : (
                  <SimpleGrid 
                      columns={{ base: 1, sm: 3 }} 
                      spacing={10}
                      justifyContent="center"
                      maxWidth="900px" 
                      mx="auto" 
                  >
                      {servicesData.map((service) => (
                          <InitialServiceCard 
                              key={service.id} 
                              service={service} 
                              onClick={setSelectedService} 
                          />
                      ))}
                  </SimpleGrid>
              )}
          </Container>
      </Box>

      
      {/* -------------------- SEÇÃO 3: Profissionais -------------------- */}
      <Box 
        p={8} 
        textAlign="center" 
        py={{ base: 12, md: 20 }} 
        bg="white" 
        id="profissionais" 
      > 
          <Container maxW="container.xl">
              <Heading 
                  as="h2" 
                  size="1xl" 
                  fontWeight="extrabold" 
                  mb={12} 
                  color={DarkText}
              >
                  Profissionais
              </Heading>

              {/* Cards */}
              <SimpleGrid 
                  columns={{ base: 2, md: 3, lg: 4 }}
                  spacing={4}
              >
                  {professionalsData.map((professional) => (
                      <ProfessionalCard key={professional.id} professional={professional} />
                  ))}
              </SimpleGrid>

              <Button
                  variant="outline"
                  mt={12}
                  size="lg"
                  color={CustomGold}
                  borderColor={CustomGold}
                  _hover={{ bg: CustomGold, color: 'white' }}
                  onClick={() => console.log('Navegar para a página profissionais')}
              >
                  Mostrar mais
              </Button>
          </Container>
      </Box>
    </Box>
  );
}
