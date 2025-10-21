// src/components/Layout.jsx

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx'; 
import Footer from './Footer.jsx'; 
import { Box } from '@chakra-ui/react';

export default function Layout() {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh"> {/* Garante que o footer fique no fim */}
      <Navbar />
      <Box as="main" flex="1"> {/* Faz o conteúdo principal ocupar o espaço */}
        {/* Outlet renderiza a página da rota atual */}
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}