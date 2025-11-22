import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router/AppRouter' // <--- ¿Esta ruta está bien?
import { CssBaseline } from '@mui/material'
import { appTheme } from './theme/App.theme'
import { ThemeProvider } from '@mui/material/styles'
import { AuthProvider } from './Context/AuthContext.jsx';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider theme={appTheme}>
          <CssBaseline />
          <AppRouter /> 
        </ThemeProvider>       
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)