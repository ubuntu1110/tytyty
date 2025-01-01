// frontend/src/components/AccountantExpenses/AccountantExpensesAddForm.tsx

import React from 'react';

interface AccountantExpensesAddFormProps {
    amount: number;
    setAmount: (val: number) => void;
    category: string;
    setCategory: (val: string) => void;
    quantity: number;
    setQuantity: (val: number) => void;
    currency: string;
    setCurrency: (val: string) => void;
    goal: string;
    setGoal: (val: string) => void;
    categories: string[];
    currencies: string[];
    handleAddExpense: () => void;
}

const AccountantExpensesAddForm: React.FC<AccountantExpensesAddFormProps> = ({
                                                                                 amount, setAmount,
                                                                                 category, setCategory,
                                                                                 quantity, setQuantity,
                                                                                 currency, setCurrency,
                                                                                 goal, setGoal,
                                                                                 categories, currencies,
                                                                                 handleAddExpense
                                                                             }) => {
    return (
        <div className="mb-4 space-y-2">
            <div>
                <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Сумма"
                    value={amount}
                    onChange={e => {
                        const val = parseFloat(e.target.value);
                        setAmount(isNaN(val) ? 0 : val);
                    }}
                    className="border border-yellow-500 bg-black text-white p-2 rounded mr-2"
                />
                <select value={category} onChange={e => setCategory(e.target.value)} className="border border-yellow-500 bg-black text-white p-2 rounded mr-2">
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                {category === "прочее" ? (
                    <input
                        type="text"
                        placeholder="Цель платежа"
                        value={goal}
                        onChange={e => setGoal(e.target.value)}
                        className="border border-yellow-500 bg-black text-white p-2 rounded mr-2"
                    />
                ) : (
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="Количество"
                        value={quantity}
                        onChange={e => {
                            const val = parseFloat(e.target.value);
                            setQuantity(isNaN(val) ? 1 : val);
                        }}
                        className="border border-yellow-500 bg-black text-white p-2 rounded mr-2"
                    />
                )}
                <select value={currency} onChange={e => setCurrency(e.target.value)} className="border border-yellow-500 bg-black text-white p-2 rounded mr-2">
                    {currencies.map(cur => (
                        <option key={cur} value={cur}>{cur}</option>
                    ))}
                </select>
                <button onClick={handleAddExpense} className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600">
                    Добавить расход
                </button>
            </div>
        </div>
    );
};

export default AccountantExpensesAddForm;
