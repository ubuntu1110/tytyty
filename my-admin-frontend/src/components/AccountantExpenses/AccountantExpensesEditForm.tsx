// frontend/src/components/AccountantExpenses/AccountantExpensesEditForm.tsx

import React from 'react';

interface ExpenseLine {
    id: number;
}

interface AccountantExpensesEditFormProps {
    editingExpense: ExpenseLine | null;
    editCategory: string;
    setEditCategory: (val: string) => void;
    editAmount: string;
    setEditAmount: (val: string) => void;
    editQuantity: string;
    setEditQuantity: (val: string) => void;
    editCurrency: string;
    setEditCurrency: (val: string) => void;
    editGoal: string;
    setEditGoal: (val: string) => void;
    handleUpdateExpense: () => void;
    setEditingExpense: (val: ExpenseLine | null) => void;
    currencies: string[];
}

const AccountantExpensesEditForm: React.FC<AccountantExpensesEditFormProps> = ({
                                                                                   editingExpense,
                                                                                   editCategory,
                                                                                   setEditCategory,
                                                                                   editAmount,
                                                                                   setEditAmount,
                                                                                   editQuantity,
                                                                                   setEditQuantity,
                                                                                   editCurrency,
                                                                                   setEditCurrency,
                                                                                   editGoal,
                                                                                   setEditGoal,
                                                                                   handleUpdateExpense,
                                                                                   setEditingExpense,
                                                                                   currencies
                                                                               }) => {
    if (!editingExpense) return null;

    return (
        <div className="bg-gray-800 p-4 mb-4 mt-4">
            <h4 className="text-yellow-400 mb-2">Редактирование расхода #{editingExpense.id}</h4>
            <input
                type="text"
                value={editCategory}
                onChange={e => setEditCategory(e.target.value)}
                className="border border-yellow-500 bg-black text-white p-2 rounded mr-2 mb-2"
                placeholder="Категория"
            />
            <input
                type="number"
                step="0.01"
                min="0.01"
                value={editAmount}
                onChange={e => setEditAmount(e.target.value)}
                className="border border-yellow-500 bg-black text-white p-2 rounded mr-2 mb-2"
                placeholder="Сумма"
            />
            <input
                type="number"
                step="0.01"
                min="0.01"
                value={editQuantity}
                onChange={e => setEditQuantity(e.target.value)}
                className="border border-yellow-500 bg-black text-white p-2 rounded mr-2 mb-2"
                placeholder="Количество (опционально)"
            />
            <select value={editCurrency} onChange={e => setEditCurrency(e.target.value)} className="border border-yellow-500 bg-black text-white p-2 rounded mr-2 mb-2">
                {currencies.map(cur => (
                    <option key={cur} value={cur}>{cur}</option>
                ))}
            </select>
            <input
                type="text"
                value={editGoal}
                onChange={e => setEditGoal(e.target.value)}
                className="border border-yellow-500 bg-black text-white p-2 rounded mr-2 mb-2"
                placeholder="Цель платежа (для прочего)"
            />
            <div>
                <button onClick={handleUpdateExpense} className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 mr-2">Сохранить</button>
                <button onClick={() => setEditingExpense(null)} className="bg-gray-500 text-black px-4 py-2 rounded hover:bg-gray-600">Отмена</button>
            </div>
        </div>
    );
};

export default AccountantExpensesEditForm;
