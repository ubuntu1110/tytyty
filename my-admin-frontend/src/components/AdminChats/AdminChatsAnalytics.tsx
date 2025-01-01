// frontend/src/components/AdminChats/AdminChatsAnalytics.tsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

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

interface AdminChatsAnalyticsProps {
    analytics: AnalyticsData;
}

const COLORS = ['#ffc107', '#ff9800', '#ff5722', '#4caf50', '#2196f3', '#9c27b0'];

const AdminChatsAnalytics: React.FC<AdminChatsAnalyticsProps> = ({ analytics }) => {
    if (!analytics) return <p>Нет данных по аналитике.</p>;

    const renderComparison = (value: string) => {
        if (value === 'лучше') {
            return <span className="text-green-500 font-bold">{value}</span>;
        } else if (value === 'хуже') {
            return <span className="text-red-500 font-bold">{value}</span>;
        } else {
            return <span className="text-gray-300 font-bold">{value}</span>;
        }
    };

    // Подготовим данные для месячной аналитики пироговой диаграммы
    let pieData: { name: string; value: number }[] = [];
    if (analytics.month) {
        pieData = [
            { name: 'Текущий месяц', value: analytics.month.current_month.count },
            { name: 'Прошлый месяц', value: analytics.month.previous_month.count }
        ];
    }

    // Данные для недельной аналитики - отображение графика расходов
    const weekChartData = analytics.weeks.map(w => ({
        name: `${w.start_date} - ${w.end_date}`,
        Чатов: w.count,
        Затраты: w.spent
    }));

    return (
        <div className="mb-4 space-y-6">
            <div>
                <h2 className="text-xl mb-2 text-yellow-400">Аналитика</h2>
                <div className="mb-2">
                    <strong>Всего чатов:</strong> {analytics.total.count}, <strong>Общие затраты:</strong> {analytics.total.spent}
                </div>
            </div>

            {analytics.month && (
                <div>
                    <h3 className="text-lg mb-1 text-yellow-300">Месячная аналитика</h3>
                    <div className="space-y-2">
                        <div>
                            <strong>Текущий месяц:</strong> Чатов: {analytics.month.current_month.count}, Затраты: {analytics.month.current_month.spent}
                        </div>
                        <div>
                            <strong>Прошлый месяц:</strong> Чатов: {analytics.month.previous_month.count}, Затраты: {analytics.month.previous_month.spent}
                        </div>
                        <div>
                            <strong>Сравнение по количеству:</strong> {renderComparison(analytics.month.comparison.count)}
                        </div>
                        <div>
                            <strong>Сравнение по затратам:</strong> {renderComparison(analytics.month.comparison.spent)}
                        </div>
                    </div>
                    {pieData.length > 0 && (
                        <div className="mt-4 w-full h-64">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            )}

            <div>
                <h3 className="text-lg mb-1 text-yellow-300">По неделям (График):</h3>
                <div className="w-full h-64">
                    <ResponsiveContainer>
                        <BarChart data={weekChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Чатов" fill="#ffc107" />
                            <Bar dataKey="Затраты" fill="#ff5722" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminChatsAnalytics;
