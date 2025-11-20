import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router/AppRouter' // <--- ¿Esta ruta está bien?
import { CssBaseline } from '@mui/material'

// Si esto tira error, comentalo temporalmente poniendo // al principio
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CssBaseline />
      <AppRouter /> {/* <--- Esto es lo que carga tu HomePage */}
    </BrowserRouter>
  </React.StrictMode>,
)