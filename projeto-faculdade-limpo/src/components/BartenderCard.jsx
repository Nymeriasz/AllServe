// src/components/BartenderCard.jsx (Corrigido)

import {
  Box, Image, Text, Badge, VStack, HStack, Icon, Button,
  Link as ChakraLink, Heading, ButtonGroup,
  IconButton // Importar IconButton
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx'; // Importar useAuth
import { FaRegHeart, FaHeart } from 'react-icons/fa'; // Importar ícones

// Definição do StarIcon (como estava antes)
const StarIcon = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
  </svg>
);

// Aceitar a nova prop 'hideAddToCart'
export default function BartenderCard({ bartender, hideAddToCart = false }) {
  const { id, nome, especialidade, precoPorHora, fotoURL, mediaAvaliacao = 0, totalAvaliacoes = 0 } = bartender;
  const { addToCart } = useCart();
  const placeholderImage = 'https://via.placeholder.com/300x200?text=Bartender';
  const preco = Number(precoPorHora) || 0;

  // Lógica de Favorito (para apagar)
  const { 
    currentUser, 
    favorites, 
    toggleFavorite, 
    togglingFavoriteId,
    isFavoritesLoading
  } = useAuth();

  const isFavorite = favorites.includes(id);
  const isLoading = togglingFavoriteId === id;

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="md" width="100%">
      <Image src={fotoURL || placeholderImage} alt={`Foto de ${nome}`} height="200px" width="100%" objectFit="cover" />

      <VStack p={4} align="stretch" spacing={3}>
        
        {/* HStack para Nome e Botão de Favorito */}
        <HStack justify="space-between" align="flex-start">
          <Heading as="h3" size="md" noOfLines={1} flex="1" color="black">{nome}</Heading>
          
          {/* Botão de Favorito (para poder apagar) */}
          {currentUser && (
            <IconButton
              aria-label="Adicionar aos favoritos"
              icon={isFavorite ? <FaHeart color="#c49b3f" /> : <FaRegHeart color="black" />}
              variant="ghost"
              size="lg"
              isRound
              onClick={() => toggleFavorite(id)}
              isLoading={isLoading}
              isDisabled={isFavoritesLoading}
              _hover={{ color: '#c49b3f', bg: 'transparent' }}
            />
          )}
        </HStack>

        <Badge bg="#c49b3f" color="white" alignSelf="flex-start" px={2} py={1} borderRadius="md">
          {especialidade}
        </Badge>
        
        <HStack justify="space-between">
          <Text fontWeight="bold" fontSize="lg" color="#c49b3f">
            R$ {preco.toFixed(2)}/hora
          </Text>
          <HStack spacing={1}>
            <Icon as={StarIcon} color="gold" />
            <Text fontWeight="medium">{mediaAvaliacao.toFixed(1)}</Text>
            <Text color="gray.500">({totalAvaliacoes})</Text>
          </HStack>
        </HStack>
        
        {/* Lógica dos botões (Adicionar / Ver Perfil) */}
        <ButtonGroup spacing={2} width="full">
          
          {!hideAddToCart && (
            <Button
              width="full"
              bg="#c49b3f"
              color="white"
              onClick={() => addToCart({ id, nome, precoPorHora: preco })}
              isDisabled={preco <= 0} 
              _hover={{ bg: '#a88437' }}
            >
              Adicionar
            </Button>
          )}

          <ChakraLink as={RouterLink} to={`/bartender/${id}`} width="full">
            <Button width="full" variant="outline" color="black" borderColor="gray.300">
              Ver Perfil
            </Button>
          </ChakraLink>
        </ButtonGroup>
      </VStack>
    </Box>
  );
}