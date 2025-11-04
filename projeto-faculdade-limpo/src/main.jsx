import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import AppRouter from './pages/AppRouter.jsx'; 
import './index.css'; 


import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme'; 

import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={AppRouter} />
        </CartProvider>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);