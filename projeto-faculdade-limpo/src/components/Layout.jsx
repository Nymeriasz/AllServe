// src/components/Layout.jsx

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { Box } from '@chakra-ui/react';

export default function Layout() {
  return (
    <Box>
      <Navbar />
      <main>
        {/* O Outlet é um espaço reservado onde o React Router irá renderizar a página da rota atual (Home, Login, etc.) */}
        <Outlet />
      </main>
    </Box>
  );
}