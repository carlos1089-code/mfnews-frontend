// src/layout/MainLayout.jsx
import { Box, Container } from '@mui/material';
import { Navbar } from '../components/Navbar';

export const MainLayout = ({ children }) => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* La Navbar ya no se importa en cada página, vive aquí */}
      <Navbar />
      
      {/* El Container controla el ancho máximo y el padding superior global */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, mt: 4, mb: 8 }}>
        {children}
      </Container>

      {/* Aquí podrías poner un Footer global si quisieras */}
    </Box>
  );
};