// frontend/src/pages/AdminDashboard.tsx
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../auth/AuthContext';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface User {
    id: number;
    username: string;
    created_at?: string;
}

interface Expense {
    id: number;
    user_id: number;
    category: string;
    amount: number;
    created_at: string; // ожидается ISO-строка
}

const AdminDashboard: React.FC = () => {
    const { role, token } = useContext(AuthContext);
    const [usersCount, setUsersCount] = useState<number>(0);
    const [chatsCount, setChatsCount] = useState<number>(0);
    const [expensesCount, setExpensesCount] = useState<number>(0);
    const [proxiesCount, setProxiesCount] = useState<number>(0);

    const [latestUsers, setLatestUsers] = useState<User[]>([]);
    const [monthlyExpensesData, setMonthlyExpensesData] = useState<{ name: string; spent: number }[]>([]);

    useEffect(() => {
        if (role === 'admin' && token) {
            Promise.all([
                fetch('http://localhost:8000/users', {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(r => r.json()),
                fetch('http://localhost:8000/chats/analytics', {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(r => r.json()).catch(() => null),
                fetch('http://localhost:8000/expenses/admin', {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(r => r.json()),
                fetch('http://localhost:8000/proxies/admin', {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(r => r.json())
            ])
                .then(([usersData, chatsAnalytics, expensesData, proxiesData]) => {
                    setUsersCount(Array.isArray(usersData) ? usersData.length : 0);
                    setExpensesCount(Array.isArray(expensesData) ? expensesData.length : 0);
                    setProxiesCount(Array.isArray(proxiesData) ? proxiesData.length : 0);

                    if (chatsAnalytics && chatsAnalytics.total) {
                        setChatsCount(chatsAnalytics.total.count);
                    }

                    // Последние 5 пользователей
                    const latest = Array.isArray(usersData) ? usersData.slice(-5).reverse() : [];
                    setLatestUsers(latest);

                    // Группируем расходы по месяцам
                    if (Array.isArray(expensesData)) {
                        const currentYear = new Date().getFullYear();
                        // Инициализируем массив с 12 месяцами = 0
                        const monthlyMap: Record<number, number> = {};
                        for (let i = 1; i <= 12; i++) {
                            monthlyMap[i] = 0;
                        }

                        expensesData.forEach((exp: Expense) => {
                            const d = new Date(exp.created_at);
                            if (d.getFullYear() === currentYear) {
                                const month = d.getMonth() + 1; // 0-based -> +1
                                monthlyMap[month] += exp.amount;
                            }
                        });

                        // Формируем данные для графика
                        // Названия месяцев можно локализовать
                        const monthNames = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
                        const chartData = monthNames.map((name, idx) => {
                            const monthIndex = idx + 1;
                            return {
                                name,
                                spent: monthlyMap[monthIndex] || 0
                            };
                        });
                        setMonthlyExpensesData(chartData);
                    }
                })
                .catch(() => toast.error("Не удалось загрузить данные"));
        }
    }, [role, token]);

    if (role !== 'admin') {
        return (
            <Layout>
                <p>У вас нет доступа к этой странице.</p>
            </Layout>
        );
    }

    return (
        <Layout>
            <h1 className="text-2xl mb-4 text-yellow-500">Админ - Обзор</h1>
            {/* Карточки со сводкой */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-black border border-yellow-500 p-4 rounded">
                    <p className="text-yellow-500 text-lg">Пользователи</p>
                    <p className="text-white text-2xl">{usersCount}</p>
                </div>
                <div className="bg-black border border-yellow-500 p-4 rounded">
                    <p className="text-yellow-500 text-lg">Чаты</p>
                    <p className="text-white text-2xl">{chatsCount}</p>
                </div>
                <div className="bg-black border border-yellow-500 p-4 rounded">
                    <p className="text-yellow-500 text-lg">Расходы</p>
                    <p className="text-white text-2xl">{expensesCount}</p>
                </div>
                <div className="bg-black border border-yellow-500 p-4 rounded">
                    <p className="text-yellow-500 text-lg">Прокси</p>
                    <p className="text-white text-2xl">{proxiesCount}</p>
                </div>
            </div>

            {/* График расходов (реальные данные по месяцам) */}
            <div className="bg-black border border-yellow-500 p-4 rounded mb-8">
                <h2 className="text-yellow-500 text-xl mb-4">Расходы по месяцам (Текущий год)</h2>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={monthlyExpensesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="#fff" />
                            <YAxis stroke="#fff" />
                            <Tooltip />
                            <Bar dataKey="spent" fill="#ffc107" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Последние 5 пользователей */}
            <div className="bg-black border border-yellow-500 p-4 rounded mb-8">
                <h2 className="text-yellow-500 text-xl mb-4">Последние созданные пользователи</h2>
                <table className="min-w-full border border-yellow-500">
                    <thead>
                    <tr className="bg-yellow-700 text-white">
                        <th className="border px-4 py-2 border-yellow-500">ID</th>
                        <th className="border px-4 py-2 border-yellow-500">Username</th>
                    </tr>
                    </thead>
                    <tbody>
                    {latestUsers.map(u => (
                        <tr key={u.id} className="hover:bg-gray-800">
                            <td className="border px-4 py-2 border-yellow-500">{u.id}</td>
                            <td className="border px-4 py-2 border-yellow-500">{u.username}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="mt-4">
                    <a href="/admin/users" className="text-yellow-500 hover:underline">Все пользователи</a>
                </div>
            </div>

            {/* Быстрые ссылки */}
            <div className="bg-black border border-yellow-500 p-4 rounded">
                <h2 className="text-yellow-500 text-xl mb-4">Быстрые ссылки</h2>
                <div className="flex space-x-4">
                    <a href="/admin/users" className="text-yellow-500 hover:underline">Управлять пользователями</a>
                    <a href="/admin/chats" className="text-yellow-500 hover:underline">Перейти к чатам</a>
                    <a href="/admin/expenses" className="text-yellow-500 hover:underline">Перейти к расходам</a>
                    <a href="/admin/proxies" className="text-yellow-500 hover:underline">Перейти к прокси</a>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
