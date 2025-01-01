// frontend/src/pages/AdminExpensesPage.tsx
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../auth/AuthContext';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';
import AdminExpensesFilter from '../components/AdminExpenses/AdminExpensesFilter';
import AdminExpensesAnalytics from '../components/AdminExpenses/AdminExpensesAnalytics';
import AdminExpensesList from '../components/AdminExpenses/AdminExpensesList';
import AdminExpensesAddForm from '../components/AdminExpenses/AdminExpensesAddForm';
import AdminExpensesEditForm from '../components/AdminExpenses/AdminExpensesEditForm';

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

interface User {
    id: number;
    username: string;
    role: string;
    active: boolean;
}

const AdminExpensesPage: React.FC = () => {
    const { token, role } = useContext(AuthContext);
    const [analytics, setAnalytics] = useState<ExpenseAnalytics | null>(null);
    const [expenses, setExpenses] = useState<ExpenseLine[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [editingExpense, setEditingExpense] = useState<ExpenseLine | null>(null);
    const [editCategory, setEditCategory] = useState<string>("");
    const [editAmount, setEditAmount] = useState<string>("");
    const [editQuantity, setEditQuantity] = useState<string>("");
    const [editCurrency, setEditCurrency] = useState<string>("RUB");
    const [editGoal, setEditGoal] = useState<string>("");

    const currencies = ["RUB", "USD"];

    const [amount, setAmount] = useState<number>(0);
    const [category, setCategory] = useState<string>("листовки");
    const [quantity, setQuantity] = useState<number>(1);
    const [currency, setCurrency] = useState<string>("RUB");
    const [goal, setGoal] = useState<string>("");

    const [users, setUsers] = useState<User[]>([]);
    const [selectedAccountant, setSelectedAccountant] = useState<string>('');

    // Фильтры
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedCurrency, setSelectedCurrency] = useState<string>('');

    const categories = ["листовки", "граффити", "надписи", "стикеры", "прочее"];

    const buildQueryParams = () => {
        const params = new URLSearchParams();
        if (selectedAccountant) params.append('accountant_id', selectedAccountant);
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (selectedCategory) params.append('category', selectedCategory);
        if (selectedCurrency) params.append('currency', selectedCurrency);
        return params.toString();
    };

    const loadUsers = async () => {
        if (role === 'admin' && token) {
            try {
                const res = await axiosInstance.get('/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const accountants = res.data.filter((u: User) => u.role === 'accountant');
                setUsers(accountants);
            } catch {
                toast.error("Не удалось загрузить список пользователей");
            }
        }
    };

    const loadAnalytics = async () => {
        if (role === 'admin' && token) {
            try {
                const query = buildQueryParams();
                const endpoint = query
                    ? `/expenses/admin/analytics?${query}`
                    : '/expenses/admin/analytics';
                const res = await axiosInstance.get(endpoint, {
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
        if (role === 'admin' && token) {
            try {
                const query = buildQueryParams();
                const endpoint = query
                    ? `/expenses/admin?${query}`
                    : '/expenses/admin';
                const res = await axiosInstance.get(endpoint, {
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
        loadUsers();
    }, [token, role]);

    useEffect(() => {
        const loadAll = async () => {
            await loadAnalytics();
            await loadExpenses();
        };
        loadAll();
    }, [token, role, selectedAccountant, startDate, endDate, selectedCategory, selectedCurrency]);

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

        if (role === 'admin' && token) {
            try {
                await axiosInstance.post('/expenses', expenseData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success("Расход добавлен");
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

    const onFilterChange = (filters: {start_date?: string; end_date?: string; category?: string; currency?: string}) => {
        if (filters.start_date !== undefined) setStartDate(filters.start_date);
        if (filters.end_date !== undefined) setEndDate(filters.end_date);
        if (filters.category !== undefined) setSelectedCategory(filters.category);
        if (filters.currency !== undefined) setSelectedCurrency(filters.currency);
    };

    const onExportCSV = () => {
        if (expenses.length === 0) {
            toast.info("Нет данных для экспорта");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "id,category,amount,quantity,currency,goal,created_at\n";
        expenses.forEach(e => {
            csvContent += `${e.id},${e.category},${e.amount},${e.quantity || ''},${e.currency},${e.goal||''},${e.created_at}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "expenses.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (role !== 'admin') {
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
            <h1 className="text-2xl mb-4 text-yellow-500">Расходы (Админ)</h1>

            <AdminExpensesFilter
                users={users}
                selectedAccountant={selectedAccountant}
                onChangeAccountant={setSelectedAccountant}
                startDate={startDate}
                endDate={endDate}
                selectedCategory={selectedCategory}
                selectedCurrency={selectedCurrency}
                categories={categories}
                currencies={currencies}
                onFilterChange={onFilterChange}
                onExportCSV={onExportCSV}
            />

            <AdminExpensesAddForm
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
                currencies={currencies}
                handleAddExpense={handleAddExpense}
            />

            <AdminExpensesAnalytics analytics={analytics} />

            <AdminExpensesEditForm
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

            <h3 className="text-lg text-yellow-300 mt-4">Детальный список расходов:</h3>
            <AdminExpensesList expenses={expenses} onEdit={startEditExpense} />
        </Layout>
    );
};

export default AdminExpensesPage;
