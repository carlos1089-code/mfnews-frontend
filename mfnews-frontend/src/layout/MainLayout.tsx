import { Box, Container } from '@mui/material';
import { Navbar } from '../components/Navbar.tsx'; // Importamos sin extensión para la compatibilidad
import { type ReactNode } from 'react'; // Importamos el tipo para 'children'

// Definimos la interfaz para las props
interface MainLayoutProps {
  children: ReactNode; 
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* La Navbar, ya tipada */}
      <Navbar />
      
      {/* El Container controla el ancho máximo y el padding superior global */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, mt: 4, mb: 8 }}>
        {children}
      </Container>

      {/* Aquí podrías poner un Footer global si quisieras */}
    </Box>
  );
};