import { Box, Container, Heading, Text, List, ListItem, ListIcon } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

export default function SobrePage() {
  return (
    <Box>
  
      <Box bg="#E9E0D4" py={{ base: 12, md: 20 }} textAlign="center">
        <Container maxW="container.lg">
          <Heading as="h1" size={{ base: 'xl', md: '2xl' }} color="#A5874D">
            Conheça o Coração da AllServe
          </Heading>
        </Container>
      </Box>

      <Container maxW="container.lg" py={{ base: 12, md: 20 }}>
        
    
        <Box mb={10}>
          <Heading as="h2" size="xl" mb={4} borderBottom="2px solid #A5874D" pb={2}>
            Nossa História
          </Heading>
          <Text fontSize="lg" color="gray.700" mb={4}>
            Fundada em 2021 por um grupo de apaixonados por eventos e hospitalidade, 
            a AllServe nasceu do sonho de criar um espaço único em Patos, 
            onde a conexão fácil entre clientes e profissionais de bar pudesse ser apreciada em sua melhor forma.
          </Text>
          <Text fontSize="lg" color="gray.700">
            Desde o início, nossa jornada tem sido marcada por desafios, aprendizados e pela busca constante 
            por qualidade. Hoje, nos orgulhamos de ser uma referência em hospitalidade digital, 
            conectando pessoas a experiências únicas em eventos por toda a Paraíba.
          </Text>
        </Box>

       
        <Box mb={10}>
          <Heading as="h2" size="xl" mb={4} borderBottom="2px solid #A5874D" pb={2}>
            Nossa Missão e Nossos Valores
          </Heading>
          <Text fontSize="lg" color="gray.700" mb={6}>
            Nossa missão é oferecer uma experiência de contratação simples, confiável e memorável, 
            proporcionando segurança e qualidade em cada evento. Fazemos isso guiados por nossos valores fundamentais:
          </Text>
          <List spacing={3} fontSize="lg">
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <strong>Qualidade:</strong> Selecionamos os melhores profissionais e garantimos um processo transparente.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <strong>Hospitalidade:</strong> Queremos que você se sinta seguro e acolhido em nossa plataforma.
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <strong>Inovação:</strong> Buscamos constantemente novas formas de conectar pessoas e simplificar experiências.
            </ListItem>
          </List>
        </Box>

      
        <Box mb={10}>
          <Heading as="h2" size="xl" mb={4} borderBottom="2px solid #A5874D" pb={2}>
            Nossos Diferenciais
          </Heading>
          <Text fontSize="lg" color="gray.700" mb={4}>
            Um dos pilares da experiência na AllServe é a qualidade dos nossos profissionais. 
            Acreditamos que um bom coquetel pode transformar um momento. Por isso, investimos em contar 
            com <strong>bartenders profissionais e talentosos</strong>, capazes de criar desde os clássicos 
            perfeitos até bebidas autorais que surpreendem o paladar. Garantir um serviço de bar 
            excepcional é parte do nosso compromisso com a qualidade.
          </Text>
        </Box>

     
        <Box bg="gray.100" p={8} borderRadius="md">
          <Heading as="h2" size="xl" mb={6}>
            Entre em Contato
          </Heading>
          <Text fontSize="lg" color="gray.800" mb={2}>
            <strong>Sede (Escritório):</strong> Rua das Acácias, 128 - Centro, Patos - PB
          </Text>
          <Text fontSize="lg" color="gray.800" mb={2}>
            <strong>Telefone / Suporte:</strong> (83) 99999-1234
          </Text>
          <Text fontSize="lg" color="gray.800" mb={2}>
            <strong>Email:</strong> contato@allserve.com
          </Text>
          <Text fontSize="lg" color="gray.800">
            <strong>Siga-nos:</strong> <a href="#">Instagram</a> | <a href="#">Facebook</a>
          </Text>
        </Box>

      </Container>
    </Box>
  );
}
