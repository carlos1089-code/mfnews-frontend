import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { DetailPage } from '../pages/DetailPage';

export const AppRouter = () => {
  return (
    <Routes>
        {/* Ruta principal: Listado */}
        <Route path="/" element={<HomePage />} />
        
        {/* Ruta detalle: Recibe un ID dinámico */}
        <Route path="/news/:id" element={<DetailPage />} />
        
        {/* Comodín: Cualquier ruta rara te manda al inicio */}
        <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  )
}