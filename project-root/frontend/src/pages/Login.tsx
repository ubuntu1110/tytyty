import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { setToken, setIsAdmin, setRole } from '../services/auth'
import Sidebar from '../components/Sidebar'
import jwt_decode from 'jwt-decode';

interface TokenPayload {
    sub: string;
    is_admin?: boolean;
    role?: string;
}

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = async () => {
        try {
            const res = await api.post('/token', new URLSearchParams({ username, password }))
            const token = res.data.access_token;
            setToken(token);
            const payload: TokenPayload = jwt_decode(token);
            setIsAdmin(!!payload.is_admin);
            setRole(payload.role || (payload.is_admin ? 'admin' : 'accountant'));

            if (payload.role === 'admin' || payload.is_admin) {
                navigate('/admin-panel', { replace: true })
            } else if (payload.role === 'moderator') {
                navigate('/moderator-panel', { replace: true })
            } else {
                navigate('/dashboard', { replace: true })
            }
        } catch (err) {
            alert('Ошибка входа! Проверьте логин и пароль.')
        }
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex flex-col items-center justify-center flex-1">
                <div className="w-full max-w-sm bg-white rounded shadow p-6">
                    <h1 className="text-3xl font-bold mb-6 text-center">Вход</h1>
                    <label className="block mb-2 font-medium">Имя пользователя</label>
                    <input
                        placeholder="Имя пользователя"
                        className="border border-gray-300 rounded w-full p-2 mb-4"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <label className="block mb-2 font-medium">Пароль</label>
                    <input
                        type="password"
                        placeholder="Пароль"
                        className="border border-gray-300 rounded w-full p-2 mb-4"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button
                        onClick={handleLogin}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                        Войти
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login
