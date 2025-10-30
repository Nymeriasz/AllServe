// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// 2. IMPORTE O CHAKRA
import { ChakraProvider } from '@chakra-ui/react';

// Importa NOSSOS provedores de contexto
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
  <ChakraProvider>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </ChakraProvider>
</React.StrictMode>);
