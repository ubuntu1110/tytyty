// frontend/src/components/AdminExpenses/AdminExpensesAnalytics.tsx

import React from 'react';

interface CategoryData {
    spent: number;
    count: number;
    avg_per_item: number;
}

interface ExpenseAnalytics {
    total_spent_rub: number;
    total_count_rub: number;
    category_data_rub: Record<string, CategoryData>;

    total_spent_usd: number;
    total_count_usd: number;
    category_data_usd: Record<string, CategoryData>;

    weekly_comparison: string;
    monthly_comparison: string;
}

interface AdminExpensesAnalyticsProps {
    analytics: ExpenseAnalytics;
}

const AdminExpensesAnalytics: React.FC<AdminExpensesAnalyticsProps> = ({ analytics }) => {
    const categoryDataRub = analytics.category_data_rub || {};
    const categoryDataUsd = analytics.category_data_usd || {};

    return (
        <>
            <p className="text-white mb-4">Общая аналитика по всем бухгалтерам или по выбранному бухгалтеру.</p>
            <p className="text-white">Сравнение по неделям: {analytics.weekly_comparison}</p>
            <p className="text-white">Сравнение по месяцам: {analytics.monthly_comparison}</p>

            {/* Рубли */}
            <h3 className="text-lg text-yellow-300 mt-4">Сводка по рублям (₽):</h3>
            <p className="text-white">
                Всего потрачено: {analytics.total_spent_rub?.toFixed(2) ?? '0.00'}₽,
                Всего единиц: {analytics.total_count_rub?.toFixed(2) ?? '0.00'}
            </p>
            <table className="min-w-full border-collapse border border-yellow-500 mt-2">
                <thead>
                <tr className="bg-yellow-700 text-white">
                    <th className="border px-4 py-2 border-yellow-500">Категория</th>
                    <th className="border px-4 py-2 border-yellow-500">Потрачено (₽)</th>
                    <th className="border px-4 py-2 border-yellow-500">Количество</th>
                    <th className="border px-4 py-2 border-yellow-500">Средняя стоимость/шт (₽)</th>
                </tr>
                </thead>
                <tbody>
                {Object.keys(categoryDataRub).length === 0 ? (
                    <tr>
                        <td className="border px-4 py-2 border-yellow-500 text-white" colSpan={4}>Нет данных по рублям</td>
                    </tr>
                ) : (
                    Object.keys(categoryDataRub).map(cat => (
                        <tr key={cat} className="hover:bg-gray-800">
                            <td className="border px-4 py-2 border-yellow-500 text-white">{cat}</td>
                            <td className="border px-4 py-2 border-yellow-500 text-white">
                                {categoryDataRub[cat].spent?.toFixed(2) ?? '0.00'}
                            </td>
                            <td className="border px-4 py-2 border-yellow-500 text-white">
                                {categoryDataRub[cat].count?.toFixed(2) ?? '0.00'}
                            </td>
                            <td className="border px-4 py-2 border-yellow-500 text-white">
                                {categoryDataRub[cat].avg_per_item?.toFixed(2) ?? '0.00'}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            {/* Доллары */}
            <h3 className="text-lg text-yellow-300 mt-4">Сводка по долларам ($):</h3>
            <p className="text-white">
                Всего потрачено: {analytics.total_spent_usd?.toFixed(2) ?? '0.00'}$,
                Всего единиц: {analytics.total_count_usd?.toFixed(2) ?? '0.00'}
            </p>
            <table className="min-w-full border-collapse border border-yellow-500 mt-2">
                <thead>
                <tr className="bg-yellow-700 text-white">
                    <th className="border px-4 py-2 border-yellow-500">Категория</th>
                    <th className="border px-4 py-2 border-yellow-500">Потрачено ($)</th>
                    <th className="border px-4 py-2 border-yellow-500">Количество</th>
                    <th className="border px-4 py-2 border-yellow-500">Средняя стоимость/шт ($)</th>
                </tr>
                </thead>
                <tbody>
                {Object.keys(categoryDataUsd).length === 0 ? (
                    <tr>
                        <td className="border px-4 py-2 border-yellow-500 text-white" colSpan={4}>Нет данных по долларам</td>
                    </tr>
                ) : (
                    Object.keys(categoryDataUsd).map(cat => (
                        <tr key={cat} className="hover:bg-gray-800">
                            <td className="border px-4 py-2 border-yellow-500 text-white">{cat}</td>
                            <td className="border px-4 py-2 border-yellow-500 text-white">
                                {categoryDataUsd[cat].spent?.toFixed(2) ?? '0.00'}
                            </td>
                            <td className="border px-4 py-2 border-yellow-500 text-white">
                                {categoryDataUsd[cat].count?.toFixed(2) ?? '0.00'}
                            </td>
                            <td className="border px-4 py-2 border-yellow-500 text-white">
                                {categoryDataUsd[cat].avg_per_item?.toFixed(2) ?? '0.00'}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </>
    );
};

export default AdminExpensesAnalytics;
