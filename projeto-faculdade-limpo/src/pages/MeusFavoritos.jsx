import { useEffect, useState } from 'react';
import { 
  Box, Heading, Text, Spinner, Alert, AlertIcon, 
  Container, SimpleGrid, VStack 
} from '@chakra-ui/react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext.jsx';
import BartenderCard from '../components/BartenderCard.jsx';

const CustomGold = "#A5874D"; 
const DarkText = "#292728"; 

export default function MeusFavoritos() {
  const { favorites, isFavoritesLoading } = useAuth();
  const [favoriteBartenders, setFavoriteBartenders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isFavoritesLoading) {
      if (favorites.length === 0) {
        setFavoriteBartenders([]);
        setIsLoading(false);
        return;
      }

      const fetchFavoriteBartenders = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const usersRef = collection(db, 'users'); 
          
          if (favorites.length > 10) {
             console.warn("A lista de favoritos tem > 10 itens. O Firestore 'in' pode falhar.");
          }
          
          const q = query(usersRef, where('__name__', 'in', favorites));
          const querySnapshot = await getDocs(q);
          
          const bartendersData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setFavoriteBartenders(bartendersData);

        } catch (err) {
          console.error("Erro ao buscar dados dos bartenders favoritos:", err);
          setError("Não foi possível carregar os favoritos.");
        }
        setIsLoading(false);
      };

      fetchFavoriteBartenders();
    }
  }, [favorites, isFavoritesLoading]);

  const renderContent = () => {
    if (isLoading || isFavoritesLoading) {
      return (
        <VStack justify="center" minH="200px">
          <Spinner size="xl" color={CustomGold} />
          <Text color={DarkText}>Carregando favoritos...</Text>
        </VStack>
      );
    }

    if (error) {
      return (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      );
    }

    if (favoriteBartenders.length === 0) {
      return (
        <Alert status="info">
          <AlertIcon />
          Você ainda não adicionou nenhum bartender aos seus favoritos.
        </Alert>
      );
    }

    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {favoriteBartenders.map(bartender => (
          
          <BartenderCard 
            key={bartender.id} 
            bartender={bartender} 
            hideAddToCart={true} 
          />
          
        ))}
      </SimpleGrid>
    );
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" color={DarkText}>
          Meus Favoritos
        </Heading>
        <Box>
          {renderContent()}
        </Box>
      </VStack>
    </Container>
  );
}