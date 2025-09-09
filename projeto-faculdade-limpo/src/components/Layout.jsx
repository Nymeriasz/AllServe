// src/components/Layout.jsx

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { Box } from '@chakra-ui/react';

export default function Layout() {
  return (
    <Box>
      <Navbar />
      <main>
        {/* Outlet mostra o conteúdo da rota atual */}
        <Outlet />
      </main>
    </Box>
  );
}