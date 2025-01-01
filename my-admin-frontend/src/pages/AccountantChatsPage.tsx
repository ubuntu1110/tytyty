// frontend/src/pages/AccountantChatsPage.tsx

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import axios from 'axios';

interface Chat {
    id: number;
    chat_name: string | null;
    chat_link: string | null;
    chat_id_str: string | null;
    price: number | null;
    city: string | null;
    owner: string | null;
    days: number | null;
    end_date: string | null;
    number_of_people: number | null;
    removed: boolean;
}

const AccountantChatsPage: React.FC = () => {
    const { token, role } = useContext(AuthContext);
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState('');
    const [hasCity, setHasCity] = useState<boolean | null>(null);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    const loadChats = async () => {
        if (token && role === 'accountant') {
            try {
                const res = await axios.get(`${BACKEND_URL}/chats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setChats(res.data);
                setHasCity(true);
            } catch (error: any) {
                if (error.response && error.response.status === 400) {
                    // Город не установлен
                    setHasCity(false);
                } else {
                    toast.error("Не удалось загрузить чаты");
                }
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadAll = async () => {
            await loadChats();
        };
        loadAll();
    }, [token, role]);

    const handleSetCity = async () => {
        if (!city.trim()) {
            toast.error("Введите город");
            return;
        }

        if (role === 'accountant' && token) {
            try {
                await axios.put(`${BACKEND_URL}/users/accountant/city`, { accountant_city: city.trim() }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Город обновлен");
                setLoading(true);
                await loadChats();
            } catch (error: any) {
                if (error.response && error.response.data && error.response.data.detail) {
                    toast.error(`Ошибка: ${error.response.data.detail}`);
                } else {
                    toast.error("Не удалось установить город");
                }
            }
        }
    };

    if (role !== 'accountant') {
        return (
            <Layout>
                <p>У вас нет доступа к этой странице.</p>
            </Layout>
        );
    }

    if (loading) {
        return (
            <Layout>
                <p>Загрузка...</p>
            </Layout>
        );
    }

    if (hasCity === false) {
        // Город не установлен, покажем поле для установки
        return (
            <Layout>
                <h1 className="text-2xl mb-4 text-yellow-500">Чаты (Бухгалтер)</h1>
                <p className="mb-4">Город не установлен. Пожалуйста, установите город, за который вы отвечаете:</p>
                <div className="flex space-x-2 mb-4">
                    <input
                        type="text"
                        placeholder="Установить город"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="border border-yellow-500 bg-black text-white p-2 rounded focus:border-yellow-300"
                    />
                    <button
                        onClick={handleSetCity}
                        className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
                    >
                        Обновить город
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <h1 className="text-2xl mb-4 text-yellow-500">Чаты (Бухгалтер)</h1>
            <div className="mb-4">
                <span className="text-white">Всего чатов: {chats.length}</span>
            </div>
            <table className="min-w-full border-collapse border border-yellow-500">
                <thead>
                <tr className="bg-yellow-700 text-white">
                    <th className="border px-4 py-2 border-yellow-500">ID</th>
                    <th className="border px-4 py-2 border-yellow-500">Название</th>
                    <th className="border px-4 py-2 border-yellow-500">Город</th>
                    <th className="border px-4 py-2 border-yellow-500">Цена</th>
                    <th className="border px-4 py-2 border-yellow-500">Ссылка на чат</th>
                    <th className="border px-4 py-2 border-yellow-500">ID чата</th>
                    <th className="border px-4 py-2 border-yellow-500">Людей</th>
                    <th className="border px-4 py-2 border-yellow-500">Снесен?</th>
                    <th className="border px-4 py-2 border-yellow-500">Дата окончания</th>
                </tr>
                </thead>
                <tbody>
                {chats.map(ch => (
                    <tr key={ch.id} className="hover:bg-gray-800">
                        <td className="border px-4 py-2 border-yellow-500">{ch.id}</td>
                        <td className="border px-4 py-2 border-yellow-500">{ch.chat_name || '-'}</td>
                        <td className="border px-4 py-2 border-yellow-500">{ch.city || '-'}</td>
                        <td className="border px-4 py-2 border-yellow-500">{ch.price !== null && ch.price !== undefined ? ch.price.toFixed(2) : '0.00'} ₽</td>
                        <td className="border px-4 py-2 border-yellow-500">
                            {ch.chat_link ? (
                                <a href={ch.chat_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    {ch.chat_link}
                                </a>
                            ) : (
                                '-'
                            )}
                        </td>
                        <td className="border px-4 py-2 border-yellow-500">{ch.chat_id_str || '-'}</td>
                        <td className="border px-4 py-2 border-yellow-500">{ch.number_of_people !== null && ch.number_of_people !== undefined ? ch.number_of_people : '0'}</td>
                        <td className="border px-4 py-2 border-yellow-500">{ch.removed ? 'Да' : 'Нет'}</td>
                        <td className="border px-4 py-2 border-yellow-500">{ch.end_date ? new Date(ch.end_date).toLocaleString() : '-'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Layout>
    );
};

export default AccountantChatsPage;
