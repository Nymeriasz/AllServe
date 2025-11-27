import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx'; 
import Footer from './Footer.jsx'; 
import { Box } from '@chakra-ui/react';

export default function Layout() {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh"> 
      <Navbar />
      <Box as="main" flex="1"> 
       
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}