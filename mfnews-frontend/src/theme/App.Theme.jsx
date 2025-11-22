// src/theme/AppTheme.js
import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    primary: {
      main: '#D32F2F', // Tu rojo corporativo
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f4f4', // El gris que usabas en HomePage
      paper: '#ffffff',
    },
    text: {
      secondary: '#757575',
    }
  },
  components: {
    // Podemos definir estilos por defecto para componentes aquí
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Bordes un poco más redondeados para todo
          textTransform: 'none', // Quitar mayúsculas forzadas si quieres
          fontWeight: 'bold',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Cards más modernas
          boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', // Sombra suave global
        },
      },
    },
  },
});