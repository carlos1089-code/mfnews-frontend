import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router/AppRouter.tsx' 
import { CssBaseline } from '@mui/material'
import { appTheme } from './theme/App.Theme.tsx'
import { ThemeProvider } from '@mui/material/styles'
import { AuthProvider } from './Context/AuthContext.tsx'; 
import { Toaster } from 'sonner'; 

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider> 
        <BrowserRouter>
          <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <Toaster richColors position="top-right" closeButton />          
            <AppRouter /> 
          </ThemeProvider>       
        </BrowserRouter>
      </AuthProvider>
    </React.StrictMode>,
  );
} else {
  console.error("Root element not found");
}