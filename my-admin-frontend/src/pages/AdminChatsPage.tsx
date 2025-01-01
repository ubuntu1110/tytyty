// frontend/src/pages/AdminChatsPage.tsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import axios from 'axios';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AdminChatsAnalytics from '../components/AdminChats/AdminChatsAnalytics';

interface WeeklyData {
    start_date: string;
    end_date: string;
    count: number;
    spent: number;
}

interface MonthlyComparison {
    count: string;
    spent: string;
}

interface MonthlyData {
    current_month: {
        count: number;
        spent: number;
    };
    previous_month: {
        count: number;
        spent: number;
    };
    comparison: MonthlyComparison;
}

interface AnalyticsData {
    total: {
        count: number;
        spent: number;
    };
    weeks: WeeklyData[];
    month?: MonthlyData;
}

interface Chat {
    id: number;
    chat_name: string;
    chat_link: string;
    chat_id_str: string;
    price: number;
    city: string;
    owner: string;
    days: number;
    end_date: string;
    number_of_people: number;
    removed: boolean;
}

const AdminChatsPage: React.FC = () => {
    const { token, role } = useContext(AuthContext);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [chats, setChats] = useState<Chat[]>([]);
    const [loadingAnalytics, setLoadingAnalytics] = useState(true);
    const [loadingChats, setLoadingChats] = useState(true);
    const [cityFilter, setCityFilter] = useState('');

    useEffect(() => {
        if (role === 'admin' && token) {
            axios.get('http://localhost:8000/chats/analytics', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    setAnalytics(res.data);
                })
                .catch(() => {
                    toast.error("Не удалось загрузить аналитику");
                })
                .finally(() => setLoadingAnalytics(false));
        } else {
            setLoadingAnalytics(false);
        }
    }, [role, token]);

    useEffect(() => {
        if (role === 'admin' && token) {
            const params: any = {};
            if (cityFilter.trim()) {
                params.city = cityFilter.trim();
            }
            axios.get('http://localhost:8000/chats', {
                headers: { Authorization: `Bearer ${token}` },
                params
            })
                .then(res => {
                    setChats(res.data);
                })
                .catch(() => {
                    toast.error("Не удалось загрузить чаты");
                })
                .finally(() => setLoadingChats(false));
        } else {
            setLoadingChats(false);
        }
    }, [role, token, cityFilter]);

    if (role !== 'admin') {
        return (
            <Layout>
                <p>У вас нет доступа к этой странице.</p>
            </Layout>
        );
    }

    return (
        <Layout>
            <h1 className="text-2xl mb-4 text-yellow-500">Чаты (Админ)</h1>
            {loadingAnalytics ? (
                <p>Загрузка аналитики...</p>
            ) : (
                <AdminChatsAnalytics analytics={analytics!} />
            )}

            <div className="mb-4 flex items-center space-x-2">
                <Input
                    type="text"
                    placeholder="Фильтр по городу"
                    value={cityFilter}
                    onChange={e => setCityFilter(e.target.value)}
                />
                <Button
                    onClick={() => { setLoadingChats(true); }}
                >
                    Фильтровать
                </Button>
            </div>

            {loadingChats ? (
                <p>Загрузка чатов...</p>
            ) : (
                <table className="min-w-full border-collapse border border-yellow-500">
                    <thead>
                    <tr className="bg-yellow-700 text-white">
                        <th className="border px-4 py-2 border-yellow-500">ID</th>
                        <th className="border px-4 py-2 border-yellow-500">Название</th>
                        <th className="border px-4 py-2 border-yellow-500">Город</th>
                        <th className="border px-4 py-2 border-yellow-500">Цена</th>
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
                            <td className="border px-4 py-2 border-yellow-500">{ch.chat_name}</td>
                            <td className="border px-4 py-2 border-yellow-500">{ch.city}</td>
                            <td className="border px-4 py-2 border-yellow-500">{ch.price}</td>
                            <td className="border px-4 py-2 border-yellow-500">{ch.chat_id_str}</td>
                            <td className="border px-4 py-2 border-yellow-500">{ch.number_of_people}</td>
                            <td className="border px-4 py-2 border-yellow-500">{ch.removed ? 'Да' : 'Нет'}</td>
                            <td className="border px-4 py-2 border-yellow-500">{new Date(ch.end_date).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </Layout>
    );
};

export default AdminChatsPage;
