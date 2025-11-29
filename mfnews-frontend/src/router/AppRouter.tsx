import { Routes, Route, Navigate } from 'react-router-dom';

import { HomePage } from '../pages/HomePage.tsx';
import { DetailPage } from '../pages/DetailPage.tsx';
import { LoginPage } from '../pages/LoginPage.tsx';
import { RegisterPage } from '../pages/RegisterPage.jsx';
import { PrivateRoute } from '../components/PrivateRoute.tsx';

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