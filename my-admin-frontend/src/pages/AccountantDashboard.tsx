// frontend/src/pages/AccountantDashboard.tsx

import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../auth/AuthContext';
import { toast } from 'react-toastify';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Expense {
    id: number;
    category: string;
    amount: number;
    created_at: string;
}

const AccountantDashboard: React.FC = () => {
    const { role, token } = useContext(AuthContext);

    const [handledChatsCount, setHandledChatsCount] = useState(0);
    const [monthExpensesSum, setMonthExpensesSum] = useState(0);
    const [proxiesCount, setProxiesCount] = useState(0);
    const [lastExpenses, setLastExpenses] = useState<Expense[]>([]);
    const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);

    useEffect(() => {
        if (role === 'accountant' && token) {
            // Загружаем данные для бухгалтера
            Promise.all([
                fetch('http://localhost:8000/accountant/chats', {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(r => r.ok ? r.json() : []),
                fetch('http://localhost:8000/expenses/accountant', {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(r => r.ok ? r.json() : []),
                fetch('http://localhost:8000/proxies/accountant', {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(r => r.ok ? r.json() : [])
            ])
                .then(([chatsData, expensesData, proxiesData]) => {
                    if (Array.isArray(chatsData)) {
                        // Все чаты считаем обработанными за 30 дней - упрощение
                        setHandledChatsCount(chatsData.length);
                    }

                    if (Array.isArray(expensesData)) {
                        // Фильтруем расходы за последние 30 дней
                        const now = new Date();
                        const pastMonth = new Date();
                        pastMonth.setDate(now.getDate() - 30);
                        const recentExpenses = expensesData.filter((e: Expense) => {
                            const d = new Date(e.created_at);
                            return d >= pastMonth;
                        });

                        setLastExpenses(recentExpenses.slice(-5).reverse());

                        const sum = recentExpenses.reduce((acc: number, e: Expense) => acc + e.amount, 0);
                        setMonthExpensesSum(sum);

                        // Группируем по категориям
                        const catMap: Record<string, number> = {};
                        recentExpenses.forEach((e: Expense) => {
                            catMap[e.category] = (catMap[e.category] || 0) + e.amount;
                        });
                        const catArray = Object.entries(catMap).map(([name, value]) => ({ name, value }));
                        setCategoryData(catArray);
                    }

                    if (Array.isArray(proxiesData)) {
                        setProxiesCount(proxiesData.length);
                    }
                })
                .catch(() => toast.error("Не удалось загрузить данные"));
        }
    }, [role, token]);

    if (role !== 'accountant') {
        return (
            <Layout>
                <p>У вас нет доступа к этой странице.</p>
            </Layout>
        );
    }

    const COLORS = ['#ffc107', '#ff9800', '#ff5722', '#4caf50', '#2196f3', '#9c27b0'];

    return (
        <Layout>
            <h1 className="text-2xl mb-4 text-yellow-500">Бухгалтер - Обзор</h1>
            {/* Карточки */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-black border border-yellow-500 p-4 rounded">
                    <p className="text-yellow-500 text-lg">Обработанные чаты (30 дн)</p>
                    <p className="text-white text-2xl">{handledChatsCount}</p>
                </div>
                <div className="bg-black border border-yellow-500 p-4 rounded">
                    <p className="text-yellow-500 text-lg">Расходы внесены (30 дн)</p>
                    <p className="text-white text-2xl">{monthExpensesSum.toFixed(2)}</p>
                </div>
                <div className="bg-black border border-yellow-500 p-4 rounded">
                    <p className="text-yellow-500 text-lg">Доступные прокси</p>
                    <p className="text-white text-2xl">{proxiesCount}</p>
                </div>
            </div>

            {/* Диаграмма по категориям */}
            <div className="bg-black border border-yellow-500 p-4 rounded mb-8">
                <h2 className="text-yellow-500 text-xl mb-4">Расходы по категориям (30 дн)</h2>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={100} fill="#ffc107" label>
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Последние расходы */}
            <div className="bg-black border border-yellow-500 p-4 rounded mb-8">
                <h2 className="text-yellow-500 text-xl mb-4">Последние внесенные расходы</h2>
                <table className="min-w-full border border-yellow-500">
                    <thead>
                    <tr className="bg-yellow-700 text-white">
                        <th className="border px-4 py-2 border-yellow-500">ID</th>
                        <th className="border px-4 py-2 border-yellow-500">Категория</th>
                        <th className="border px-4 py-2 border-yellow-500">Сумма</th>
                    </tr>
                    </thead>
                    <tbody>
                    {lastExpenses.map(e => (
                        <tr key={e.id} className="hover:bg-gray-800">
                            <td className="border px-4 py-2 border-yellow-500">{e.id}</td>
                            <td className="border px-4 py-2 border-yellow-500">{e.category}</td>
                            <td className="border px-4 py-2 border-yellow-500">{e.amount.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="mt-4">
                    <a href="/accountant/expenses" className="text-yellow-500 hover:underline">Все расходы</a>
                </div>
            </div>

            {/* Быстрые ссылки */}
            <div className="bg-black border border-yellow-500 p-4 rounded">
                <h2 className="text-yellow-500 text-xl mb-4">Быстрые ссылки</h2>
                <div className="flex space-x-4">
                    <a href="/accountant/chats" className="text-yellow-500 hover:underline">Мои чаты</a>
                    <a href="/accountant/expenses" className="text-yellow-500 hover:underline">Мои расходы</a>
                    <a href="/accountant/proxies" className="text-yellow-500 hover:underline">Мои прокси</a>
                </div>
            </div>
        </Layout>
    );
};

export default AccountantDashboard;
