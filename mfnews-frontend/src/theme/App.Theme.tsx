import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    primary: {
      main: '#D32F2F', 
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f4f4', 
      paper: '#ffffff',
    },
    text: {
      secondary: '#757575',
    }
  },
  components: {

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none', 
          fontWeight: 'bold',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, 
          boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', 
        },
      },
    },
  },
});