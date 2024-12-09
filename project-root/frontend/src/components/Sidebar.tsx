import React from 'react'
import { Link } from 'react-router-dom'
import { getToken, clearToken, isAdmin, getRole } from '../services/auth'
import jwt_decode from 'jwt-decode'

interface TokenPayload {
    sub: string;
    is_admin?: boolean;
    role?: string;
}

function Sidebar() {
    const token = getToken();
    const admin = isAdmin();
    const role = getRole();
    let username = "";
    if (token) {
        const payload: TokenPayload = jwt_decode(token);
        username = payload.sub;
    }

    const handleLogout = () => {
        clearToken();
        window.location.href = '/';
    }

    return (
        <div className="bg-blue-700 text-white h-screen p-4 flex flex-col w-64">
            <div className="text-2xl font-bold mb-6">Учет расходов</div>
            {token && (
                <div className="mb-6">
                    <p>Привет, {username}</p>
                    <button onClick={handleLogout} className="mt-2 bg-red-600 px-2 py-1 rounded hover:bg-red-700">Выйти</button>
                </div>
            )}
            <nav className="flex flex-col gap-4">
                {!token && <Link to="/" className="hover:bg-blue-800 p-2 rounded">Вход</Link>}
                {token && role === 'accountant' && !admin && (
                    <>
                        <Link to="/dashboard" className="hover:bg-blue-800 p-2 rounded">Обзор</Link>
                        <Link to="/my-data" className="hover:bg-blue-800 p-2 rounded">Мои данные</Link>
                        <Link to="/my-analytics" className="hover:bg-blue-800 p-2 rounded">Моя аналитика</Link>
                    </>
                )}
                {token && admin && (
                    <>
                        <Link to="/admin-panel" className="hover:bg-blue-800 p-2 rounded">Админ панель</Link>
                        <Link to="/admin-panel/users" className="hover:bg-blue-800 p-2 rounded">Пользователи</Link>
                        <Link to="/admin-panel/data" className="hover:bg-blue-800 p-2 rounded">Все данные</Link>
                        <Link to="/admin-panel/analytics" className="hover:bg-blue-800 p-2 rounded">Аналитика</Link>
                        <Link to="/admin-panel/settings" className="hover:bg-blue-800 p-2 rounded">Настройки</Link>
                    </>
                )}
                {token && role === 'moderator' && !admin && (
                    <>
                        <Link to="/moderator-panel" className="hover:bg-blue-800 p-2 rounded">Модератор панель</Link>
                        <Link to="/moderator-chats" className="hover:bg-blue-800 p-2 rounded">Чаты</Link>
                    </>
                )}
            </nav>
        </div>
    )
}

export default Sidebar
