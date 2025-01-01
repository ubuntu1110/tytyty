// frontend/src/pages/LoginPage.tsx

import React, { useContext, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginPage: React.FC = () => {
    const { setToken, setRole } = useContext(AuthContext);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await axios.post('http://localhost:8000/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.data && response.data.access_token) {
                // Сохраняем токен и роль
                setToken(response.data.access_token);
                setRole(response.data.role || null);

                toast.success('Успешный вход');

                // Перенаправляем в зависимости от роли
                const userRole = response.data.role;
                if (userRole === 'admin') {
                    navigate('/admin', { replace: true });
                } else if (userRole === 'accountant') {
                    navigate('/accountant', { replace: true });
                } else if (userRole === 'moderator') {
                    navigate('/moderator/new-chats', { replace: true });
                } else {
                    // Если неизвестная роль, просто на страницу логина или можно показать ошибку
                    toast.error("Неизвестная роль пользователя");
                    navigate('/login', { replace: true });
                }

            } else {
                toast.error("Неверный логин или пароль");
            }
        } catch (error: any) {
            console.error('Login error', error);
            if (error.response && error.response.data && error.response.data.detail) {
                toast.error(`Ошибка: ${error.response.data.detail}`);
            } else {
                toast.error("Не удалось выполнить вход");
            }
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-20">
            <h1 className="text-2xl mb-4 text-white">Вход</h1>
            <input
                type="text"
                placeholder="Логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-3"
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-3"
            />
            <button
                onClick={handleLogin}
                className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 w-full"
            >
                Войти
            </button>
        </div>
    );
};

export default LoginPage;
