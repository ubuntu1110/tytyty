// src/hooks/useExpenseAnalytics.ts
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

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

export const useExpenseAnalytics = (role: string) => {
    const [analytics, setAnalytics] = useState<ExpenseAnalytics | null>(null);
    const [expenses, setExpenses] = useState<ExpenseLine[]>([]);
    const [loading, setLoading] = useState(true);

    const loadAnalytics = async () => {
        if (role === 'accountant' || role === 'admin') {
            try {
                const endpoint = role === 'accountant' ? '/expenses/accountant/analytics' : '/expenses/admin/analytics';
                const res = await axiosInstance.get(endpoint);
                setAnalytics(res.data);
            } catch (error: any) {
                toast.error("Не удалось загрузить аналитику");
            }
        }
    };

    const loadExpenses = async () => {
        if (role === 'accountant' || role === 'admin') {
            try {
                const endpoint = role === 'accountant' ? '/expenses/accountant' : '/expenses/admin';
                const res = await axiosInstance.get(endpoint);
                setExpenses(res.data);
            } catch {
                toast.error("Не удалось загрузить список расходов");
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    const loadAll = async () => {
        await loadAnalytics();
        await loadExpenses();
    };

    useEffect(() => {
        loadAll();
    }, [role]);

    return { analytics, expenses, loading, reload: loadAll };
};
