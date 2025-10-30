// src/main.jsx (CORRIGIDO)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // <-- 1. GARANTA QUE ESTE É O SEU CSS "BONITO"

// 2. IMPORTE O CHAKRA
import { ChakraProvider } from '@chakra-ui/react';

// Importa NOSSOS provedores de contexto
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        {/* 3. ADICIONE O CHAKRA PROVIDER */}
        <ChakraProvider> 
          <App />
        </ChakraProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
);