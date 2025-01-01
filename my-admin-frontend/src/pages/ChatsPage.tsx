import React, { useContext, useEffect, useState } from 'react';
import { AuthContext }  from '../auth/AuthContext';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import axios from 'axios';

interface Chat {
    id: number;
    chat_name: string;
    chat_link: string;
    // chat_id_str теперь возвращается с бэкенда
    chat_id_str: string;
    price: number;
    city: string;
    owner: string;
    days: number;
    end_date: string;
    number_of_people: number;
    removed: boolean;
}

const ChatsPage: React.FC = () => {
    const { token, role } = useContext(AuthContext);
    const [chats, setChats] = useState<Chat[]>([]);
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(true);

    if (role !== 'moderator' && role !== 'admin') {
        return <Layout><p>У вас нет доступа к этой странице.</p></Layout>;
    }

    const fetchChats = async () => {
        if (!token) return;
        try {
            const params = city ? { params: { city } } : {};
            const response = await axios.get('http://localhost:8000/chats', {
                headers: { Authorization: `Bearer ${token}` },
                ...params
            });
            setChats(response.data);
        } catch {
            toast.error("Не удалось получить список чатов");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChats();
    }, [token, city]);

    if (loading) return <Layout><p>Загрузка...</p></Layout>;

    return (
        <Layout>
            <h1 className="text-2xl mb-4 text-yellow-500">Чаты</h1>
            <div className="mb-4 flex items-center space-x-2">
                <input
                    type="text"
                    placeholder="Фильтр по городу"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="border border-yellow-500 bg-black text-white p-2 rounded focus:border-yellow-300"
                />
                <button
                    onClick={fetchChats}
                    className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
                >
                    Фильтровать
                </button>
            </div>
            <p className="mb-2">Всего чатов: {chats.length}</p>
            <table className="min-w-full border-collapse border border-yellow-500">
                <thead>
                <tr>
                    <th className="border px-4 py-2 border-yellow-500">ID</th>
                    <th className="border px-4 py-2 border-yellow-500">Название</th>
                    <th className="border px-4 py-2 border-yellow-500">Ссылка</th>
                    <th className="border px-4 py-2 border-yellow-500">ID чата</th>
                    <th className="border px-4 py-2 border-yellow-500">Цена</th>
                    <th className="border px-4 py-2 border-yellow-500">Город</th>
                    <th className="border px-4 py-2 border-yellow-500">Владелец</th>
                    <th className="border px-4 py-2 border-yellow-500">Дней рекламы</th>
                    <th className="border px-4 py-2 border-yellow-500">Дата окончания</th>
                    <th className="border px-4 py-2 border-yellow-500">Кол-во человек</th>
                    <th className="border px-4 py-2 border-yellow-500">Снесен?</th>
                </tr>
                </thead>
                <tbody>
                {chats.map(ch => (
                    <tr key={ch.id}>
                        <td className="border px-4 py-2 border-yellow-500">{ch.id}</td>
                        <td className="border px-4 py-2 border-yellow-500">{ch.chat_name}</td>
                        <td className="border px-4 py-2 border-yellow-500">
                            <a href={ch.chat_link} className="text-yellow-500 hover:underline">{ch.chat_link}</a>
                        </td>
                        <td className="border px-4 py-2 border-yellow-500">{ch.chat_id_str}</td>
                        <td className="border px-4 py-2 border-yellow-500">{ch.price}</td>
                        <td className="border px-4 py-2 border-yellow-500">{ch.city}</td>
                        <td className="border px-4 py-2 border-yellow-500">{ch.owner}</td>
                        <td className="border px-4 py-2 border-yellow-500">{ch.days}</td>
                        <td className="border px-4 py-2 border-yellow-500">{new Date(ch.end_date).toLocaleString()}</td>
                        <td className="border px-4 py-2 border-yellow-500">{ch.number_of_people}</td>
                        <td className="border px-4 py-2 border-yellow-500">{ch.removed ? 'Да' : 'Нет'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Layout>
    );
};

export default ChatsPage;
