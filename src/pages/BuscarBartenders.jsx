import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Box, Container, Heading, Text, SimpleGrid, Input, 
  InputGroup, InputLeftElement, Select, Flex, Spinner, Center 
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import BartenderCard from '../components/BartenderCard'; 

const CustomGold = "#A5874D";

export default function BuscarBartenders() {
  const [bartenders, setBartenders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  const location = useLocation();

  useEffect(() => {
    if (location.state?.search) {
        setSearchTerm(location.state.search);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchBartenders = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'bartender'));
        const querySnapshot = await getDocs(q);
        
        const lista = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setBartenders(lista);
      } catch (error) {
        console.error("Erro ao buscar bartenders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBartenders();
  }, []);

  const filteredBartenders = bartenders.filter((bartender) => {
    const nome = bartender.nome ? bartender.nome.toLowerCase() : '';
    const busca = searchTerm.toLowerCase();
    
    const matchesSearch = nome.includes(busca); 
    const matchesType = filterType ? bartender.especialidade === filterType : true;
    
    return matchesSearch && matchesType;
  });

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={10}>
      <Container maxW="container.xl">
        
        <Box textAlign="center" mb={10}>
          <Heading size="xl" color="#292728" mb={4}>Encontre o Profissional Ideal</Heading>
          <Text color="gray.500">Busque por nome ou especialidade para seu evento.</Text>
        </Box>

        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          gap={4} 
          bg="white" 
          p={6} 
          borderRadius="lg" 
          shadow="sm" 
          mb={10}
        >
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.300" />
            </InputLeftElement>
            
            <Input 
              placeholder="Digite o nome do bartender..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
              focusBorderColor={CustomGold}
            />
          </InputGroup>

          <Select 
            placeholder="Todas as Especialidades" 
            size="lg" 
            w={{ base: 'full', md: '300px' }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            focusBorderColor={CustomGold}
          >
            <option value="Barman Clássico">Barman Clássico</option>
            <option value="Mixologista">Mixologista</option>
            <option value="Flair Bartender">Flair Bartender</option>
            <option value="Barista">Barista</option>
          </Select>
        </Flex>

        {loading ? (
          <Center h="200px">
            <Spinner size="xl" color={CustomGold} />
          </Center>
        ) : filteredBartenders.length === 0 ? (
          <Center h="200px" flexDirection="column">
             <Text fontSize="lg" color="gray.500">Nenhum profissional encontrado com esses critérios.</Text>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
            {filteredBartenders.map((bartender) => (
              <BartenderCard key={bartender.id} bartender={bartender} />
            ))}
          </SimpleGrid>
        )}

      </Container>
    </Box>
  );
}