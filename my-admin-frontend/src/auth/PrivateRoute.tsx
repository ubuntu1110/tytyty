// frontend/src/auth/PrivateRoute.tsx

import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute: React.FC = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        // Пока неизвестен статус аутентификации, показываем загрузку
        return <div style={{ color: 'white' }}>Загрузка...</div>;
    }

    // Если пользователь авторизован - отображаем вложенные маршруты, иначе перенаправляем на /login
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
