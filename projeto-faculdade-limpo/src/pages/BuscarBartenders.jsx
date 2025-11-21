import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Spinner,
  Center,
  Text,
  Button,
  Image,
  HStack 
} from '@chakra-ui/react';

const CustomGold = "#A5874D";
const DarkText = "#292728";
const LightText = "#707070";

const ITEMS_PER_PAGE = 8;

const Profissional = ({ profissional }) => {
  const imageUrl = profissional.fotoURL || `https://api.dicebear.com/8.x/avataaars/svg?seed=${profissional.seed || profissional.nome}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  const preco = Number(profissional.preco) || 0;

  return (
    <Box as={RouterLink} to={`/bartender/${profissional.id}`}
        bg="white" borderRadius="md" boxShadow="lg" overflow="hidden" textAlign="left" transition="0.2s" _hover={{ boxShadow: '2xl', transform: 'translateY(-4px)', textDecoration: 'none' }}>
        <Box aspectRatio={1 / 1} overflow="hidden" position="relative">
            <Image src={imageUrl} alt={`Avatar de ${profissional.nome}`} objectFit="cover" width="100%" height="100%" p={1} />
        </Box>
        <Box px={3} py={3}>
            <Heading as="h4" size="sm" color={DarkText} mb={1} noOfLines={1}>
                {profissional.nome}
            </Heading>
            <Text fontSize="xs" color={LightText} mb={1} noOfLines={1}>
                {profissional.categoria}
            </Text>
            <Text fontSize="md" fontWeight="bold" color={CustomGold}>
                R$ {preco > 0 ? preco.toFixed(0) : 'N/A'}
            </Text>
        </Box>
    </Box>
  );
};


const Paginacao = ({ currentPage, totalPages, goToPage, goToPreviousPage, goToNextPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <HStack spacing={2} justify="center" mt={10}>
      <Button onClick={goToPreviousPage} disabled={currentPage === 1}>
        &laquo;
      </Button>
      {pageNumbers.map(number => (
        <Button
          key={number}
          onClick={() => goToPage(number)}
          isActive={currentPage === number}
          colorScheme={currentPage === number ? 'yellow' : 'gray'}
        >
          {number}
        </Button>
      ))}
      <Button onClick={goToNextPage} disabled={currentPage === totalPages}>
        &raquo;
      </Button>
    </HStack>
  );
};

export default function BuscarBartenders() {
  const [allBartenders, setAllBartenders] = useState([]);
  const [filteredBartenders, setFilteredBartenders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [ordenacao, setOrdenacao] = useState('relevancia');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBartenders = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'bartender'));
        const querySnapshot = await getDocs(q);
        const bartendersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          imagem: doc.data().fotoURL,
          preco: Number(doc.data().precoPorHora) || 0,
          categoria: doc.data().especialidade,
          nome: doc.data().nome || doc.data().email.split('@[0]'),
        }));
        setAllBartenders(bartendersList);
        setFilteredBartenders(bartendersList);
      } catch (error) {
        console.error("Erro ao buscar bartenders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBartenders();
  }, []);

  useEffect(() => {
    let processedList = [...allBartenders];

    if (searchTerm) {
      processedList = processedList.filter(b =>
        b.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (ordenacao === 'preco_asc') {
      processedList.sort((a, b) => a.preco - b.preco);
    } else if (ordenacao === 'preco_desc') {
      processedList.sort((a, b) => b.preco - a.preco);
    }
    
    setFilteredBartenders(processedList);
    setCurrentPage(1);
  }, [searchTerm, ordenacao, allBartenders]);

  const totalPages = Math.ceil(filteredBartenders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBartenders = filteredBartenders.slice(startIndex, endIndex);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };
  const goToPreviousPage = () => { goToPage(currentPage - 1); };
  const goToNextPage = () => { goToPage(currentPage + 1); };

  return (
    <Box>
      <Box bg="#E9E0D4" py={12} textAlign="center">
        <Container maxW="container.lg">
          <Heading as="h1" size="2xl" color={CustomGold}>
            Profissionais
          </Heading>
        </Container>
      </Box>

      <Box bg="gray.50" py={6}>
        <Container maxW="container.lg" display="flex" 
                     flexDirection={{ base: 'column', md: 'row' }} 
                     gap={4}>
          <Input
            placeholder="Buscar por nome ou especialidade..."
            value={searchTerm}
            onChange={handleSearchChange}
            bg="white"
            size="lg"
            flex={1}
          />
          <Select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            bg="white"
            size="lg"
            minWidth={{ base: '100%', md: '200px' }} 
          >
            <option value="relevancia">Ordenar por: Relevância</option>
            <option value="preco_asc">Menor Preço</option>
            <option value="preco_desc">Maior Preço</option>
          </Select>
        </Container>
      </Box>

    
      <Container maxW="container.lg" py={12}>
        {loading ? (
          <Center h="200px">
            <Spinner size="xl" color={CustomGold} />
          </Center>
        ) : (
          <>
            <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={6}>
              {currentBartenders.length > 0 ? (
                currentBartenders.map(prof => (
                  <Profissional key={prof.id} profissional={prof} />
                ))
              ) : (
                <Text gridColumn="span 4" textAlign="center" fontSize="lg" color="gray.600">
                  Nenhum profissional encontrado.
                </Text>
              )}
            </SimpleGrid>

            {totalPages > 1 && (
              <Paginacao
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
                goToPreviousPage={goToPreviousPage}
                goToNextPage={goToNextPage}
              />
            )}
          </>
        )}
      </Container>
    </Box>
  );
}