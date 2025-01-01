// frontend/src/components/AccountantExpenses/AccountantExpensesList.tsx

import React from 'react';

interface ExpenseLine {
    id: number;
    category: string;
    amount: number;
    quantity?: number;
    currency: string;
    goal?: string;
    created_at: string;
}

interface AccountantExpensesListProps {
    expenses: ExpenseLine[];
    onEdit: (exp: ExpenseLine) => void;
}

const AccountantExpensesList: React.FC<AccountantExpensesListProps> = ({ expenses, onEdit }) => {
    return (
        <table className="min-w-full border-collapse border border-yellow-500 mt-2">
            <thead>
            <tr className="bg-yellow-700 text-white">
                <th className="border px-4 py-2 border-yellow-500">Категория</th>
                <th className="border px-4 py-2 border-yellow-500">Сумма</th>
                <th className="border px-4 py-2 border-yellow-500">Количество</th>
                <th className="border px-4 py-2 border-yellow-500">Валюта</th>
                <th className="border px-4 py-2 border-yellow-500">Цель</th>
                <th className="border px-4 py-2 border-yellow-500">Действия</th>
            </tr>
            </thead>
            <tbody>
            {expenses.length === 0 ? (
                <tr>
                    <td className="border px-4 py-2 border-yellow-500 text-white" colSpan={6}>Нет расходов</td>
                </tr>
            ) : (
                expenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-gray-800">
                        <td className="border px-4 py-2 border-yellow-500 text-white">{exp.category}</td>
                        <td className="border px-4 py-2 border-yellow-500 text-white">{exp.amount.toFixed(2)}</td>
                        <td className="border px-4 py-2 border-yellow-500 text-white">{exp.quantity !== undefined && exp.quantity !== null ? exp.quantity.toFixed(2) : '-'}</td>
                        <td className="border px-4 py-2 border-yellow-500 text-white">{exp.currency}</td>
                        <td className="border px-4 py-2 border-yellow-500 text-white">{exp.goal ?? '-'}</td>
                        <td className="border px-4 py-2 border-yellow-500 text-white">
                            <button onClick={() => onEdit(exp)} className="bg-yellow-500 text-black px-2 py-1 rounded hover:bg-yellow-600">Редактировать</button>
                        </td>
                    </tr>
                ))
            )}
            </tbody>
        </table>
    );
};

export default AccountantExpensesList;
