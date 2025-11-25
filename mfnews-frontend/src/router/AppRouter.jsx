import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { DetailPage } from '../pages/DetailPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { PrivateRoute } from '../components/PrivateRoute'; 

//! Aca se definen las rutas y es clave entender que
//! las routas siempre se envouelven con el componente PrivateRouter y esto
//! es basicamente para que vos no puedas ver las pantallas si no estas logueado

export const AppRouter = () => {
  return (
    <Routes>        
        <Route path="/" element={
            <PrivateRoute>
                <HomePage />
            </PrivateRoute>
        } />
        
        <Route path="/news/:id" element={
            <PrivateRoute>
                <DetailPage />
            </PrivateRoute>
        } />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/*" element={<Navigate to="/login" />} />
    </Routes>
  )
}