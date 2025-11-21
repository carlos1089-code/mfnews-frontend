import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { DetailPage } from '../pages/DetailPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

export const AppRouter = () => {
  return (
    <Routes>
        {/* Ruta principal: Listado */}
        <Route path="/" element={<HomePage />} />
        
        {/* Ruta detalle: Recibe un ID dinámico */}
        <Route path="/news/:id" element={<DetailPage />} />

        <Route path="/login" element={<LoginPage />} />
           
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Comodín: Cualquier ruta rara te manda al inicio */}
        <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  )
}