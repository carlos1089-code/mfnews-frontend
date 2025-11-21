import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { DetailPage } from '../pages/DetailPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { PrivateRoute } from '../components/PrivateRoute'; // <--- 1. IMPORTAR

export const AppRouter = () => {
  return (
    <Routes>
        {/* --- RUTAS PRIVADAS (Envueltas) --- */}
        
        {/* Home solo para logueados */}
        <Route path="/" element={
            <PrivateRoute>
                <HomePage />
            </PrivateRoute>
        } />
        
        {/* Detalle solo para logueados */}
        <Route path="/news/:id" element={
            <PrivateRoute>
                <DetailPage />
            </PrivateRoute>
        } />

        {/* --- RUTAS PÚBLICAS --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Cualquier otra cosa -> Login */}
        <Route path="/*" element={<Navigate to="/login" />} />
    </Routes>
  )
}