import React, { useContext, useState } from 'react';
import { AuthContext }  from '../auth/AuthContext';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import axios from 'axios';

const NewChatsPage: React.FC = () => {
    const { token, role } = useContext(AuthContext);
    const [chatName, setChatName] = useState('');
    const [chatLink, setChatLink] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [city, setCity] = useState('');
    const [owner, setOwner] = useState('');
    const [days, setDays] = useState<number>(1);

    if (role !== 'moderator' && role !== 'admin') {
        return <Layout><p>У вас нет доступа к этой странице.</p></Layout>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            toast.error("Нет токена, пожалуйста, залогиньтесь");
            return;
        }

        if (!chatName.trim() || !chatLink.trim() || !city.trim() || !owner.trim() || days <= 0 || price <= 0) {
            toast.error("Пожалуйста, заполните все поля корректно.");
            return;
        }

        try {
            await axios.post('http://localhost:8000/chats', {
                chat_name: chatName,
                chat_link: chatLink,
                price: price,
                city: city,
                owner: owner,
                days: days
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Чат успешно добавлен");
            setChatName('');
            setChatLink('');
            setPrice(0);
            setCity('');
            setOwner('');
            setDays(1);
        } catch {
            toast.error("Не удалось добавить чат");
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl mb-4 text-yellow-500">Добавить новый чат</h1>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-3 max-w-md">
                <input
                    type="text"
                    placeholder="Название чата"
                    value={chatName}
                    onChange={e => setChatName(e.target.value)}
                    className="border border-yellow-500 bg-black text-white p-2 rounded focus:border-yellow-300"
                />
                <input
                    type="text"
                    placeholder="Ссылка на чат"
                    value={chatLink}
                    onChange={e => setChatLink(e.target.value)}
                    className="border border-yellow-500 bg-black text-white p-2 rounded focus:border-yellow-300"
                />
                <input
                    type="number"
                    placeholder="Цена"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="border border-yellow-500 bg-black text-white p-2 rounded focus:border-yellow-300"
                />
                <input
                    type="text"
                    placeholder="Город"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="border border-yellow-500 bg-black text-white p-2 rounded focus:border-yellow-300"
                />
                <input
                    type="text"
                    placeholder="Владелец чата"
                    value={owner}
                    onChange={e => setOwner(e.target.value)}
                    className="border border-yellow-500 bg-black text-white p-2 rounded focus:border-yellow-300"
                />
                <input
                    type="number"
                    placeholder="Кол-во дней рекламы"
                    value={days}
                    onChange={e => setDays(Number(e.target.value))}
                    className="border border-yellow-500 bg-black text-white p-2 rounded focus:border-yellow-300"
                />
                <button type="submit" className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600">
                    Добавить чат
                </button>
            </form>
        </Layout>
    );
};

export default NewChatsPage;
