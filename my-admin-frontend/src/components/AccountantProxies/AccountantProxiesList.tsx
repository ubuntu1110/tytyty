// frontend/src/components/AccountantProxies/AccountantProxiesList.tsx
import React from 'react';
import Button from '../../components/ui/Button';
import { toast } from 'react-toastify';

interface Proxy {
    id: number;
    ip_address: string;
    port: number;
    username?: string;
    password?: string;
    assigned_to?: number | null;
    created_at: string;
}

interface AccountantProxiesListProps {
    proxies: Proxy[];
}

const AccountantProxiesList: React.FC<AccountantProxiesListProps> = ({ proxies }) => {

    const handleCopy = (p: Proxy) => {
        const url = new URL('https://t.me/socks');
        url.searchParams.set('server', p.ip_address);
        url.searchParams.set('port', p.port.toString());
        if (p.username) {
            url.searchParams.set('user', p.username);
        }
        if (p.password) {
            url.searchParams.set('pass', p.password);
        }

        const proxyLink = url.toString();
        navigator.clipboard.writeText(proxyLink).then(() => {
            toast.success("Ссылка прокси скопирована в буфер обмена");
        });
    };

    if (proxies.length === 0) {
        return <p className="text-white">Нет доступных прокси.</p>;
    }

    return (
        <table className="min-w-full border-collapse border border-yellow-500">
            <thead>
            <tr className="bg-yellow-700 text-white">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Прокси</th>
                <th className="border px-4 py-2">Логин</th>
                <th className="border px-4 py-2">Пароль</th>
                <th className="border px-4 py-2">Действия</th>
            </tr>
            </thead>
            <tbody>
            {proxies.map(p => (
                <tr key={p.id} className="hover:bg-gray-800">
                    <td className="border px-4 py-2">{p.id}</td>
                    <td className="border px-4 py-2">{p.ip_address}:{p.port}</td>
                    <td className="border px-4 py-2">{p.username || '-'}</td>
                    <td className="border px-4 py-2">{p.password ? '******' : '-'}</td>
                    <td className="border px-4 py-2">
                        <Button onClick={() => handleCopy(p)}>Копировать ссылку</Button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default AccountantProxiesList;
