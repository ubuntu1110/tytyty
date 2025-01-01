// frontend/src/pages/AccountantExpensesPage.tsx

import React, { useContext, useState, useEffect } from 'react';
import { AuthContext }  from '../auth/AuthContext';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';

import AccountantExpensesAddForm from '../components/AccountantExpenses/AccountantExpensesAddForm';
import AccountantExpensesEditForm from '../components/AccountantExpenses/AccountantExpensesEditForm';
import AccountantExpensesAnalytics from '../components/AccountantExpenses/AccountantExpensesAnalytics';
import AccountantExpensesList from '../components/AccountantExpenses/AccountantExpensesList';

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

interface ExpenseLine {
    id: number;
    category: string;
    amount: number;
    quantity?: number;
    currency: string;
    goal?: string;
    created_at: string;
}

const AccountantExpensesPage: React.FC = () => {
    const { token, role } = useContext(AuthContext);
    const [amount, setAmount] = useState<number>(0);
    const [category, setCategory] = useState<string>("листовки");
    const [quantity, setQuantity] = useState<number>(1);
    const [currency, setCurrency] = useState<string>("RUB");
    const [goal, setGoal] = useState<string>("");
    const [analytics, setAnalytics] = useState<ExpenseAnalytics | null>(null);
    const [expenses, setExpenses] = useState<ExpenseLine[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [editingExpense, setEditingExpense] = useState<ExpenseLine | null>(null);
    const [editCategory, setEditCategory] = useState<string>("");
    const [editAmount, setEditAmount] = useState<string>("");
    const [editQuantity, setEditQuantity] = useState<string>("");
    const [editCurrency, setEditCurrency] = useState<string>("RUB");
    const [editGoal, setEditGoal] = useState<string>("");

    const categories = ["листовки", "граффити", "надписи", "стикеры", "прочее"];
    const currencies = ["RUB", "USD"];

    const loadAnalytics = async () => {
        if (role === 'accountant' && token) {
            try {
                const res = await axiosInstance.get('/expenses/accountant/analytics', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAnalytics(res.data);
            } catch (error: any) {
                if (error.response) {
                    toast.error(`Ошибка: ${error.response.data.detail || "Не удалось загрузить аналитику"}`);
                } else if (error.request) {
                    toast.error("Сервер не отвечает. Попробуйте позже.");
                } else {
                    toast.error("Произошла ошибка. Попробуйте снова.");
                }
            }
        }
    };

    const loadExpenses = async () => {
        if (role === 'accountant' && token) {
            try {
                const res = await axiosInstance.get('/expenses/accountant', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setExpenses(res.data);
            } catch (error: any) {
                if (error.response) {
                    toast.error(`Ошибка: ${error.response.data.detail || "Не удалось загрузить список расходов"}`);
                } else if (error.request) {
                    toast.error("Сервер не отвечает. Попробуйте позже.");
                } else {
                    toast.error("Произошла ошибка. Попробуйте снова.");
                }
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadAll = async () => {
            await loadAnalytics();
            await loadExpenses();
        };
        loadAll();
    }, [token, role]);

    const handleAddExpense = async () => {
        if (amount <= 0 || (category !== "прочее" && quantity <= 0) || (category === "прочее" && goal.trim() === "")) {
            toast.error("Заполните все необходимые поля корректно");
            return;
        }

        const expenseData: any = {
            category,
            amount: parseFloat(amount.toFixed(2)),
            currency
        };

        if (category === "прочее") {
            expenseData.goal = goal.trim();
        } else {
            expenseData.quantity = parseFloat(quantity.toFixed(2));
        }

        if (role === 'accountant' && token) {
            try {
                await axiosInstance.post('/expenses', expenseData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success("Расход добавлен");
                // Сброс полей формы
                setAmount(0);
                setCategory("листовки");
                setQuantity(1);
                setCurrency("RUB");
                setGoal("");
                await loadAnalytics();
                await loadExpenses();
            } catch (error: any) {
                if (error.response) {
                    toast.error(`Ошибка: ${error.response.data.detail || "Не удалось добавить расход"}`);
                } else if (error.request) {
                    toast.error("Сервер не отвечает. Попробуйте позже.");
                } else {
                    toast.error("Произошла ошибка. Попробуйте снова.");
                }
            }
        }
    };

    const startEditExpense = (exp: ExpenseLine) => {
        setEditingExpense(exp);
        setEditCategory(exp.category);
        setEditAmount(exp.amount.toString());
        setEditQuantity(exp.quantity !== undefined ? exp.quantity.toString() : "");
        setEditCurrency(exp.currency);
        setEditGoal(exp.goal || "");
    };

    const handleUpdateExpense = async () => {
        if (!editingExpense) return;

        const expenseUpdate: any = {};
        if (editCategory.trim()) expenseUpdate.category = editCategory;
        if (editAmount.trim()) expenseUpdate.amount = parseFloat(editAmount);
        if (editQuantity.trim()) expenseUpdate.quantity = parseFloat(editQuantity);
        if (editCurrency.trim()) expenseUpdate.currency = editCurrency;
        if (editGoal.trim()) expenseUpdate.goal = editGoal;

        try {
            await axiosInstance.put(`/expenses/${editingExpense.id}`, expenseUpdate, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Расход обновлен");
            setEditingExpense(null);
            await loadAnalytics();
            await loadExpenses();
        } catch (error: any) {
            if (error.response) {
                toast.error(`Ошибка: ${error.response.data.detail || "Не удалось обновить расход"}`);
            } else if (error.request) {
                toast.error("Сервер не отвечает. Попробуйте позже.");
            } else {
                toast.error("Произошла ошибка. Попробуйте снова.");
            }
        }
    };

    if (role !== 'accountant') {
        return (
            <Layout>
                <p>У вас нет доступа к этой странице.</p>
            </Layout>
        );
    }

    if (loading) {
        return (
            <Layout>
                <p>Загрузка...</p>
            </Layout>
        );
    }

    if (!analytics) {
        return (
            <Layout>
                <p>Нет данных по расходам.</p>
            </Layout>
        );
    }

    return (
        <Layout>
            <h1 className="text-2xl mb-4 text-yellow-500">Расходы (Бухгалтер)</h1>

            {/* Форма добавления расхода */}
            <AccountantExpensesAddForm
                amount={amount}
                setAmount={setAmount}
                category={category}
                setCategory={setCategory}
                quantity={quantity}
                setQuantity={setQuantity}
                currency={currency}
                setCurrency={setCurrency}
                goal={goal}
                setGoal={setGoal}
                categories={categories}
                currencies={currencies}
                handleAddExpense={handleAddExpense}
            />

            {/* Аналитика */}
            <AccountantExpensesAnalytics analytics={analytics} />

            {/* Форма редактирования расхода */}
            <AccountantExpensesEditForm
                editingExpense={editingExpense}
                editCategory={editCategory}
                setEditCategory={setEditCategory}
                editAmount={editAmount}
                setEditAmount={setEditAmount}
                editQuantity={editQuantity}
                setEditQuantity={setEditQuantity}
                editCurrency={editCurrency}
                setEditCurrency={setEditCurrency}
                editGoal={editGoal}
                setEditGoal={setEditGoal}
                handleUpdateExpense={handleUpdateExpense}
                setEditingExpense={setEditingExpense}
                currencies={currencies}
            />

            {/* Список расходов */}
            <h3 className="text-lg text-yellow-300 mt-4">Детальный список расходов:</h3>
            <AccountantExpensesList expenses={expenses} onEdit={startEditExpense} />
        </Layout>
    );
};

export default AccountantExpensesPage;
