// frontend/src/pages/AccountantProxiesPage.tsx
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { fetchAccountantProxies } from '../api/proxyApi';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import AccountantProxiesFilter from '../components/AccountantProxies/AccountantProxiesFilter';
import AccountantProxiesList from '../components/AccountantProxies/AccountantProxiesList';

interface Proxy {
    id: number;
    ip_address: string;
    port: number;
    username?: string;
    password?: string;
    assigned_to?: number | null;
    created_at: string;
}

const AccountantProxiesPage: React.FC = () => {
    const { token, role } = useContext(AuthContext);
    const [proxies, setProxies] = useState<Proxy[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        if (token && role === 'accountant') {
            fetchAccountantProxies(token)
                .then(setProxies)
                .catch(() => toast.error("Не удалось получить список прокси"))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token, role]);

    const filteredProxies = useMemo(() => {
        if (!filterText.trim()) return proxies;
        const term = filterText.toLowerCase();
        return proxies.filter(p =>
            p.ip_address.toLowerCase().includes(term) ||
            (p.username && p.username.toLowerCase().includes(term))
        );
    }, [proxies, filterText]);

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

    return (
        <Layout>
            <h1 className="text-2xl mb-4 text-yellow-500">Мои Прокси</h1>
            <AccountantProxiesFilter
                filterText={filterText}
                onFilterChange={setFilterText}
            />
            <AccountantProxiesList proxies={filteredProxies} />
        </Layout>
    );
};

export default AccountantProxiesPage;
