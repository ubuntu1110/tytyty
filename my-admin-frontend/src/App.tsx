// frontend/src/App.tsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './auth/PrivateRoute';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AccountantDashboard from './pages/AccountantDashboard';
import UsersPage from './pages/UsersPage';
import NotFoundPage from './pages/NotFoundPage';
import NewChatsPage from './pages/NewChatsPage';
import ChatsPage from './pages/ChatsPage';
import AdminChatsPage from './pages/AdminChatsPage';
import AccountantChatsPage from './pages/AccountantChatsPage';
import AccountantExpensesPage from './pages/AccountantExpensesPage';
import AdminExpensesPage from './pages/AdminExpensesPage';
import AdminProxiesPage from './pages/AdminProxiesPage';
import AccountantProxiesPage from './pages/AccountantProxiesPage';
import AccountantCalculatorPage from './pages/AccountantCalculatorPage'; // новая страница калькулятора

import { AuthContext } from './auth/AuthContext';

// Подключаем react-toastify для уведомлений
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
    const { role, isAuthenticated } = useContext(AuthContext);

    return (
        <>
            {/* Контейнер уведомлений */}
            <ToastContainer />

            <Routes>
                <Route path="/login" element={<LoginPage />} />

                {/* Приватные роуты */}
                <Route element={<PrivateRoute />}>
                    {/* Админские маршруты */}
                    {role === 'admin' && (
                        <>
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/users" element={<UsersPage />} />
                            <Route path="/admin/chats" element={<AdminChatsPage />} />
                            <Route path="/admin/expenses" element={<AdminExpensesPage />} />
                            <Route path="/admin/proxies" element={<AdminProxiesPage />} />
                        </>
                    )}

                    {/* Модераторские маршруты */}
                    {role === 'moderator' && (
                        <>
                            <Route path="/moderator/new-chats" element={<NewChatsPage />} />
                            <Route path="/moderator/chats" element={<ChatsPage />} />
                        </>
                    )}

                    {/* Бухгалтерские маршруты */}
                    {role === 'accountant' && (
                        <>
                            <Route path="/accountant" element={<AccountantDashboard />} />
                            <Route path="/accountant/chats" element={<AccountantChatsPage />} />
                            <Route path="/accountant/expenses" element={<AccountantExpensesPage />} />
                            <Route path="/accountant/proxies" element={<AccountantProxiesPage />} />
                            <Route path="/accountant/calculator" element={<AccountantCalculatorPage />} />
                        </>
                    )}
                </Route>

                {/* Корневой маршрут: перенаправление в зависимости от роли */}
                <Route
                    path="/"
                    element={
                        isAuthenticated
                            ? role === 'admin'
                                ? <Navigate to="/admin" replace />
                                : role === 'accountant'
                                    ? <Navigate to="/accountant" replace />
                                    : role === 'moderator'
                                        ? <Navigate to="/moderator/new-chats" replace />
                                        : <Navigate to="/login" replace />
                            : <Navigate to="/login" replace />
                    }
                />

                {/* Страница 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
};

export default App;
