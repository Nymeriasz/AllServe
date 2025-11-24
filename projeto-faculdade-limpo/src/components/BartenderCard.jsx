import { Box, Image, Heading, Text, Button, VStack, HStack, Icon, Badge, Card, CardBody, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaStar, FaUser } from 'react-icons/fa';

const CustomGold = "#A5874D";

export default function BartenderCard({ bartender }) {

  const imageUrl = bartender.fotoURL || '/img/avatar-placeholder.png';
  
  const nota = bartender.notaMedia || 5.0; 

  return (
    <Card 
      direction="column" 
      overflow="hidden" 
      variant="outline" 
      borderColor="gray.200"
      _hover={{ shadow: 'md', borderColor: CustomGold, transform: 'translateY(-2px)' }}
      transition="all 0.2s"
    >
      <Image
        objectFit="cover"
        maxW="100%"
        h="200px"
        src={imageUrl}
        alt={bartender.nome}
        fallbackSrc="https://via.placeholder.com/300?text=Sem+Foto" 
      />

      <CardBody>
        <VStack align="start" spacing={2}>
          
          <HStack justify="space-between" w="full">
            <Badge colorScheme="yellow">{bartender.especialidade || "Bartender"}</Badge>
            <HStack spacing={1}>
                <Icon as={FaStar} color="gold" />
                <Text fontSize="sm" fontWeight="bold">{nota.toFixed(1)}</Text>
            </HStack>
          </HStack>

          <Heading size="md" color="#292728" noOfLines={1}>
            {bartender.nome}
          </Heading>

          <Text fontSize="sm" color="gray.500" noOfLines={2}>
            {bartender.resumo || "Profissional pronto para tornar seu evento incrível."}
          </Text>

          <Text color={CustomGold} fontWeight="bold" fontSize="lg">
             R$ {Number(bartender.precoPorHora).toFixed(2)} / hora
          </Text>

          <Button 
            as={Link} 
            to={`/bartender/${bartender.id}`} 
            variant="outline" 
            colorScheme="yellow" 
            color={CustomGold}
            borderColor={CustomGold}
            _hover={{ bg: CustomGold, color: 'white' }}
            w="full"
            mt={2}
            leftIcon={<FaUser />}
          >
            Ver Perfil
          </Button>

        </VStack>
      </CardBody>
    </Card>
  );
}