import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getToken } from '../services/auth';
import api from '../api';
import { differenceInDays } from 'date-fns';

const walletValidators: Record<string, (wallet: string) => boolean> = {
    Ethereum: (wallet) => /^0x[a-fA-F0-9]{40}$/.test(wallet),
    Bitcoin: (wallet) => /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(wallet),
    Tron: (wallet) => /^T[a-zA-Z0-9]{33}$/.test(wallet),
    Litecoin: (wallet) => /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,34}$/.test(wallet), // Added Litecoin support
};


function ModeratorChats() {
    const token = getToken();
    const [chats, setChats] = useState<any[]>([]);
    const [cityFilter, setCityFilter] = useState('');

    const [chatName, setChatName] = useState('');
    const [chatLink, setChatLink] = useState('');
    const [chatPrice, setChatPrice] = useState('');
    const [chatDays, setChatDays] = useState(10);
    const [ownerUsername, setOwnerUsername] = useState('');
    const [ownerWallet, setOwnerWallet] = useState('');
    const [walletType, setWalletType] = useState('Ethereum');

    const [editingChat, setEditingChat] = useState<any>(null); // For editing chat details

    const fetchChats = async () => {
        const res = await api.get('/data/all_chats', {
            headers: { Authorization: `Bearer ${token}` },
            params: { city: cityFilter || undefined },
        });
        setChats(res.data);
    };

    useEffect(() => {
        if (token) fetchChats();
    }, [token, cityFilter]);

    const validateFields = () => {
        if (!chatName.trim()) {
            alert('Название чата обязательно!');
            return false;
        }
        if (!chatLink.trim() || !/^https?:\/\/.+\..+/.test(chatLink)) {
            alert('Введите корректную ссылку на чат (начиная с http:// или https://)!');
            return false;
        }
        if (!chatPrice.trim() || isNaN(parseFloat(chatPrice)) || parseFloat(chatPrice) <= 0) {
            alert('Цена должна быть положительным числом!');
            return false;
        }
        if (chatDays <= 0 || isNaN(chatDays)) {
            alert('Срок (дни) должен быть положительным числом!');
            return false;
        }
        if (ownerUsername.trim() && ownerUsername.length < 3) {
            alert('Имя владельца (если указано) должно быть не менее 3 символов!');
            return false;
        }
        return true; // Removed wallet validation logic
    };


    const addOrUpdateChat = async () => {
        if (!validateFields()) return;

        const payload = {
            name: chatName.trim(),
            link: chatLink.trim(),
            price: parseFloat(chatPrice),
            expiration_days: chatDays,
            owner_username: ownerUsername.trim() || null,
            owner_wallet: ownerWallet.trim(),
            wallet_type: walletType,
        };

        if (editingChat) {
            await api.put(`/data/chats/${editingChat.id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEditingChat(null); // Clear editing state
        } else {
            await api.post('/data/chats', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
        }

        // Reset form fields
        setChatName('');
        setChatLink('');
        setChatPrice('');
        setChatDays(10);
        setOwnerUsername('');
        setOwnerWallet('');
        setWalletType('Ethereum');

        fetchChats();
    };

    const startEditingChat = (chat: any) => {
        setEditingChat(chat);
        setChatName(chat.name);
        setChatLink(chat.link);
        setChatPrice(chat.price.toString());
        setChatDays(chat.expiration_days);
        setOwnerUsername(chat.owner_username || '');
        setOwnerWallet(chat.owner_wallet);
        setWalletType(chat.wallet_type || 'Ethereum');
    };

    const now = new Date();

    const highlightUnavailableChats = (chat: any) => {
        // Mock check: Chat is unavailable if the link ends with 'unavailable'
        return chat.link.includes('unavailable');
    };

    const expiringChats = chats.filter((c) => {
        const purchase_date = new Date(c.purchase_date);
        const endDate = new Date(purchase_date.getTime() + c.expiration_days * 24 * 60 * 60 * 1000);
        const diff = differenceInDays(endDate, now);
        return diff <= 3 && diff >= 0;
    });

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h1 className="text-3xl font-bold mb-6">Чаты (Модератор)</h1>
                <div className="mb-4">
                    <input
                        placeholder="Фильтр по городу"
                        className="border border-gray-300 rounded p-2 w-64 mr-4"
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                    />
                    <span className="mr-4">Всего чатов: {chats.length}</span>
                </div>

                <div className="bg-white p-6 rounded shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">{editingChat ? 'Редактировать чат' : 'Добавить новый чат'}</h2>
                    <div className="flex flex-wrap gap-4 mb-4">
                        <input
                            placeholder="Название чата"
                            className="border border-gray-300 rounded p-2 w-64"
                            value={chatName}
                            onChange={(e) => setChatName(e.target.value)}
                        />
                        <input
                            placeholder="Ссылка на чат"
                            className="border border-gray-300 rounded p-2 w-64"
                            value={chatLink}
                            onChange={(e) => setChatLink(e.target.value)}
                        />
                        <input
                            placeholder="Цена"
                            className="border border-gray-300 rounded p-2 w-32"
                            value={chatPrice}
                            onChange={(e) => setChatPrice(e.target.value)}
                        />
                        <input
                            placeholder="Срок (дней)"
                            className="border border-gray-300 rounded p-2 w-32"
                            type="number"
                            value={chatDays}
                            onChange={(e) => setChatDays(Number(e.target.value))}
                        />
                        <input
                            placeholder="Имя владельца (необязательно)"
                            className="border border-gray-300 rounded p-2 w-64"
                            value={ownerUsername}
                            onChange={(e) => setOwnerUsername(e.target.value)}
                        />
                        <select
                            className="border border-gray-300 rounded p-2 w-64"
                            value={walletType}
                            onChange={(e) => setWalletType(e.target.value)}
                        >
                            {Object.keys(walletValidators).map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <input
                            placeholder="Кошелек владельца (обязательно)"
                            className="border border-gray-300 rounded p-2 w-64"
                            value={ownerWallet}
                            onChange={(e) => setOwnerWallet(e.target.value)}
                        />
                        <button
                            onClick={addOrUpdateChat}
                            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                        >
                            {editingChat ? 'Сохранить изменения' : 'Добавить чат'}
                        </button>
                    </div>
                </div>

                {expiringChats.length > 0 && (
                    <div className="bg-yellow-100 p-4 rounded shadow mb-6">
                        <h2 className="text-xl font-semibold mb-2">Уведомление</h2>
                        <p>У следующих чатов скоро заканчивается срок (менее 3 дней осталось):</p>
                        <ul className="list-disc list-inside">
                            {expiringChats.map((c) => (
                                <li key={c.id}>
                                    {c.name} - заканчивается через {differenceInDays(new Date(c.purchase_date).getTime() + c.expiration_days * 24 * 60 * 60 * 1000, now)} дней
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Все чаты</h2>
                    {chats.length === 0 ? (
                        <p>Нет чатов.</p>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2 text-left">ID</th>
                                <th className="border border-gray-300 p-2 text-left">Название</th>
                                <th className="border border-gray-300 p-2 text-left">Ссылка</th>
                                <th className="border border-gray-300 p-2 text-left">Цена</th>
                                <th className="border border-gray-300 p-2 text-left">Дата покупки</th>
                                <th className="border border-gray-300 p-2 text-left">Дней до окончания</th>
                                <th className="border border-gray-300 p-2 text-left">Владелец чата</th>
                                <th className="border border-gray-300 p-2 text-left">Кошелек владельца</th>
                                <th className="border border-gray-300 p-2 text-left">Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {chats.map((c: any) => {
                                const purchase_date = new Date(c.purchase_date);
                                const endDate = new Date(
                                    purchase_date.getTime() + c.expiration_days * 24 * 60 * 60 * 1000
                                );
                                const diff = differenceInDays(endDate, now);
                                const unavailable = highlightUnavailableChats(c);
                                return (
                                    <tr
                                        key={c.id}
                                        className={`hover:bg-gray-100 transition ${
                                            unavailable ? 'bg-red-200' : ''
                                        }`}
                                    >
                                        <td className="border border-gray-300 p-2">{c.id}</td>
                                        <td className="border border-gray-300 p-2">{c.name}</td>
                                        <td className="border border-gray-300 p-2">
                                            <a href={c.link} target="_blank" rel="noopener noreferrer">
                                                {c.link}
                                            </a>
                                        </td>
                                        <td className="border border-gray-300 p-2">{c.price}</td>
                                        <td className="border border-gray-300 p-2">{c.purchase_date}</td>
                                        <td className="border border-gray-300 p-2">{diff} дней</td>
                                        <td className="border border-gray-300 p-2">{c.owner_username || '-'}</td>
                                        <td className="border border-gray-300 p-2">{c.owner_wallet}</td>
                                        <td className="border border-gray-300 p-2">
                                            <button
                                                onClick={() => startEditingChat(c)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 transition"
                                            >
                                                Редактировать
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ModeratorChats;
