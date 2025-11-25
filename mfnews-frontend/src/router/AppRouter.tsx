import { Routes, Route, Navigate } from 'react-router-dom';

// IMPORTANTE: Vite resolverá si son .tsx o .jsx, no pongas la extensión.
import { HomePage } from '../pages/HomePage.tsx';
import { DetailPage } from '../pages/DetailPage.tsx';
import { LoginPage } from '../pages/LoginPage.js';
import { RegisterPage } from '../pages/RegisterPage.jsx';
import { PrivateRoute } from '../components/PrivateRoute.tsx'; 

export const AppRouter = () => {
  return (
    <Routes>        
        {/* RUTA PROTEGIDA: HOME */}
        <Route path="/" element={
            <PrivateRoute>
                <HomePage />
            </PrivateRoute>
        } />
        
        {/* RUTA PROTEGIDA: DETALLE */}
        {/* React Router pasa el parámetro :id automáticamente al hook useParams en DetailPage */}
        <Route path="/news/:id" element={
            <PrivateRoute>
                <DetailPage />
            </PrivateRoute>
        } />

        {/* RUTAS PÚBLICAS */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* CATCH-ALL: Si no existe la ruta, manda al login */}
        <Route path="/*" element={<Navigate to="/login" />} />
    </Routes>
  )
}