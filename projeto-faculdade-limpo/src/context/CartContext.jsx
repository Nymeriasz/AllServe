// src/context/CartContext.jsx

import { createContext, useContext, useState } from 'react';
import { useToast } from '@chakra-ui/react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const toast = useToast();

  const addToCart = (bartender) => {
    // Verifica se o bartender já está no carrinho
    if (cart.find(item => item.id === bartender.id)) {
      toast({
        title: "Item já está no carrinho.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setCart(prevCart => [...prevCart, bartender]);
    toast({
      title: "Bartender adicionado!",
      description: `${bartender.nome} foi adicionado ao seu carrinho.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const removeFromCart = (bartenderId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== bartenderId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}