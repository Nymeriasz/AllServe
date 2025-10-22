// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext.jsx'; 
import { CartProvider } from './context/CartContext.jsx'; 

const theme = extendTheme({});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <CartProvider> {/* 2. Envolver o App */}
          <App />
        </CartProvider>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);