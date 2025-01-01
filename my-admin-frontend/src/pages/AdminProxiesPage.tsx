// frontend/src/pages/AdminProxiesPage.tsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { fetchAllProxies, createProxy, assignProxy, updateProxy } from '../api/proxyApi';
import { fetchUsers } from '../api/userApi';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

interface Proxy {
    id: number;
    ip_address: string;
    port: number;
    username?: string;
    password?: string;
    assigned_to?: number | null;
    created_at: string;
}

interface User {
    id: number;
    username: string;
    role: string;
    active: boolean;
}

interface ProxyFormProps {
    onClose: () => void;
    onSave: (data: {ip_address:string;port:number;username?:string;password?:string}) => void;
    initialData?: Partial<Proxy>;
}

const ProxyFormModal: React.FC<ProxyFormProps> = ({ onClose, onSave, initialData = {} }) => {
    const [ip, setIp] = useState(initialData.ip_address || '');
    const [port, setPort] = useState(initialData.port?.toString() || '');
    const [username, setUsername] = useState(initialData.username || '');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        if (!ip.trim() || !port.trim()) {
            toast.error("IP и порт обязательны");
            return;
        }
        const portNum = parseInt(port,10);
        if (isNaN(portNum)) {
            toast.error("Порт должен быть числом");
            return;
        }
        onSave({ ip_address: ip.trim(), port: portNum, username: username.trim() || undefined, password: password.trim() || undefined });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-gray-900 p-4 rounded w-full max-w-sm space-y-2">
                <h2 className="text-yellow-500 text-xl mb-2">{initialData.id ? "Редактировать прокси" : "Создать прокси"}</h2>
                <div>
                    <label className="text-yellow-500 block mb-1">IP адрес</label>
                    <Input value={ip} onChange={e=>setIp(e.target.value)} />
                </div>
                <div>
                    <label className="text-yellow-500 block mb-1">Порт</label>
                    <Input value={port} onChange={e=>setPort(e.target.value)} />
                </div>
                <div>
                    <label className="text-yellow-500 block mb-1">Логин</label>
                    <Input value={username} onChange={e=>setUsername(e.target.value)} />
                </div>
                <div>
                    <label className="text-yellow-500 block mb-1">Пароль</label>
                    <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
                </div>
                <div className="flex space-x-2 mt-4">
                    <Button onClick={handleSubmit}>Сохранить</Button>
                    <Button variant="secondary" onClick={onClose}>Отмена</Button>
                </div>
            </div>
        </div>
    );
};

const AdminProxiesPage: React.FC = () => {
    const { token, role } = useContext(AuthContext);
    const [proxies, setProxies] = useState<Proxy[]>([]);
    const [loading, setLoading] = useState(true);
    const [accountants, setAccountants] = useState<User[]>([]);
    const [assignProxyId, setAssignProxyId] = useState<number|null>(null);
    const [assignAccountantId, setAssignAccountantId] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editProxyData, setEditProxyData] = useState<Proxy| null>(null);

    useEffect(() => {
        if (token && role === 'admin') {
            fetchAllProxies(token)
                .then(setProxies)
                .catch(() => toast.error("Не удалось получить список прокси"))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token, role]);

    useEffect(() => {
        if (token && role === 'admin') {
            fetchUsers(token)
                .then((users:User[]) => {
                    const acc = users.filter(u=>u.role==='accountant');
                    setAccountants(acc);
                })
                .catch(() => toast.error("Не удалось получить список бухгалтеров"));
        }
    }, [token, role]);

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

    const handleCreateProxy = (data: {ip_address:string;port:number;username?:string;password?:string}) => {
        if (!token) return;
        createProxy(data, token)
            .then(p => {
                toast.success("Прокси создан");
                setProxies(prev => [...prev, p]);
                setShowCreateModal(false);
            })
            .catch(e=>toast.error(e.message));
    };

    const handleAssignProxy = () => {
        if (!token || !assignProxyId || !assignAccountantId) return;
        assignProxy(assignProxyId, parseInt(assignAccountantId,10), token)
            .then(updated => {
                toast.success("Прокси назначен бухгалтеру");
                setProxies(prev => prev.map(p=> p.id===updated.id?updated:p));
                setAssignProxyId(null);
                setAssignAccountantId('');
            })
            .catch(e=>toast.error(e.message));
    };

    const handleEditProxy = (data: {ip_address:string;port:number;username?:string;password?:string}) => {
        if (!token || !editProxyData) return;
        updateProxy(editProxyData.id, data, token)
            .then(updated => {
                toast.success("Прокси обновлён");
                setProxies(prev => prev.map(p=> p.id===updated.id?updated:p));
                setEditProxyData(null);
            })
            .catch(e=>toast.error(e.message));
    };

    return (
        <Layout>
            <h1 className="text-2xl mb-4 text-yellow-500">Прокси (Админ)</h1>
            <div className="mb-4">
                <Button onClick={()=>setShowCreateModal(true)}>Создать прокси</Button>
            </div>
            {proxies.length === 0 ? (
                <p className="text-white">Нет прокси.</p>
            ) : (
                <table className="min-w-full border-collapse border border-yellow-500">
                    <thead>
                    <tr className="bg-yellow-700 text-white">
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Прокси</th>
                        <th className="border px-4 py-2">Логин</th>
                        <th className="border px-4 py-2">Пароль</th>
                        <th className="border px-4 py-2">Назначено</th>
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
                            <td className="border px-4 py-2">{p.assigned_to || '-'}</td>
                            <td className="border px-4 py-2 space-x-2">
                                <Button onClick={()=>{setEditProxyData(p)}}>Редактировать</Button>
                                <Button variant="secondary" onClick={()=>{setAssignProxyId(p.id)}}>Назначить</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {assignProxyId && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-gray-900 p-4 rounded w-full max-w-sm space-y-2">
                        <h2 className="text-yellow-500 text-xl mb-2">Назначить прокси #{assignProxyId} бухгалтеру</h2>
                        <Select
                            value={assignAccountantId}
                            onChange={e=>setAssignAccountantId(e.target.value)}
                            options={[{value:'',label:'Выбрать бухгалтера'}, ...accountants.map(a=>({value:String(a.id),label:a.username}))]}
                        />
                        <div className="flex space-x-2 mt-4">
                            <Button onClick={handleAssignProxy}>Назначить</Button>
                            <Button variant="secondary" onClick={()=>{setAssignProxyId(null);setAssignAccountantId('');}}>Отмена</Button>
                        </div>
                    </div>
                </div>
            )}

            {showCreateModal && (
                <ProxyFormModal
                    onClose={()=>setShowCreateModal(false)}
                    onSave={handleCreateProxy}
                />
            )}

            {editProxyData && (
                <ProxyFormModal
                    onClose={()=>setEditProxyData(null)}
                    onSave={handleEditProxy}
                    initialData={editProxyData}
                />
            )}
        </Layout>
    );
};

export default AdminProxiesPage;
