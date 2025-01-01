// frontend/src/pages/UsersPage.tsx
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { fetchUsers } from '../api/userApi';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import axios from 'axios';
import Modal from '../components/Modal';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

import UserList from '../components/users/UserList';
import UserCreateForm from '../components/users/UserCreateForm';
import UserEditForm from '../components/users/UserEditForm';

interface User {
    id: number;
    username: string;
    role: string;
    active: boolean;
}

const UsersPage: React.FC = () => {
    const { token, role } = useContext(AuthContext);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);

    // Состояния для фильтрации
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    // Состояния для сортировки
    const [sortField, setSortField] = useState<'id'|'username'|null>(null);
    const [sortDirection, setSortDirection] = useState<'asc'|'desc'>('asc');

    useEffect(() => {
        if (token && role === 'admin') {
            fetchUsers(token)
                .then(setUsers)
                .catch(() => toast.error("Не удалось получить список пользователей"))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token, role]);

    const handleCreateUser = async (username: string, password: string, newRole: string) => {
        if (!token) return;

        try {
            const response = await axios.post('http://localhost:8000/users', {
                username,
                password,
                role: newRole
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(prev => [...prev, response.data]);
            toast.success("Пользователь создан успешно");
            setShowCreateModal(false);
        } catch {
            toast.error("Не удалось создать пользователя");
        }
    };

    const openEditModal = (user: User) => {
        setEditUser(user);
        setShowEditModal(true);
    };

    const handleUpdateUser = async (username: string, password: string, newRole: string) => {
        if (!token || !editUser) return;

        try {
            const data: any = { username };
            if (password) data.password = password;
            if (newRole) data.role = newRole;

            const response = await axios.put(`http://localhost:8000/users/${editUser.id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Пользователь обновлён");
            setUsers(prev => prev.map(u => u.id === editUser.id ? response.data : u));
            setShowEditModal(false);
            setEditUser(null);
        } catch {
            toast.error("Не удалось обновить пользователя");
        }
    };

    // Фильтрация
    const filteredUsers = useMemo(() => {
        let result = [...users];
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            result = result.filter(u => u.username.toLowerCase().includes(term));
        }
        if (selectedRole !== '') {
            result = result.filter(u => u.role === selectedRole);
        }
        return result;
    }, [users, searchTerm, selectedRole]);

    // Сортировка
    const sortedUsers = useMemo(() => {
        let result = [...filteredUsers];
        if (sortField) {
            result.sort((a,b) => {
                const aValue = a[sortField];
                const bValue = b[sortField];
                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [filteredUsers, sortField, sortDirection]);

    const toggleSort = (field: 'id'|'username') => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    if (loading) return <Loader />;

    return (
        <Layout>
            <h1 className="text-2xl mb-4 text-yellow-500">Пользователи</h1>
            {role === 'admin' && (
                <Button onClick={() => setShowCreateModal(true)} className="mb-4">
                    Создать пользователя
                </Button>
            )}

            {/* Панель фильтрации */}
            <div className="mb-4 flex space-x-4">
                <Input
                    placeholder="Поиск по имени"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <Select
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value)}
                    options={[
                        {value:'', label:'Все роли'},
                        {value:'admin', label:'Администратор'},
                        {value:'accountant', label:'Бухгалтер'},
                        {value:'moderator', label:'Модератор'}
                    ]}
                />
            </div>

            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Создать пользователя">
                <UserCreateForm
                    onCreate={handleCreateUser}
                    onClose={() => setShowCreateModal(false)}
                />
            </Modal>

            <Modal isOpen={showEditModal} onClose={() => {setShowEditModal(false); setEditUser(null);}} title="Редактировать пользователя">
                {editUser && (
                    <UserEditForm
                        user={editUser}
                        onUpdate={handleUpdateUser}
                        onClose={() => {setShowEditModal(false); setEditUser(null);}}
                    />
                )}
            </Modal>

            {role === 'admin' ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-yellow-500">
                        <thead>
                        <tr>
                            <th
                                className="border px-4 py-2 border-yellow-500 cursor-pointer"
                                onClick={() => toggleSort('id')}
                            >
                                ID {sortField === 'id' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th
                                className="border px-4 py-2 border-yellow-500 cursor-pointer"
                                onClick={() => toggleSort('username')}
                            >
                                Имя пользователя {sortField === 'username' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th className="border px-4 py-2 border-yellow-500">Роль</th>
                            <th className="border px-4 py-2 border-yellow-500">Активен</th>
                            <th className="border px-4 py-2 border-yellow-500">Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedUsers.map(u => (
                            <tr key={u.id}>
                                <td className="border px-4 py-2 border-yellow-500">{u.id}</td>
                                <td className="border px-4 py-2 border-yellow-500">{u.username}</td>
                                <td className="border px-4 py-2 border-yellow-500">{u.role}</td>
                                <td className="border px-4 py-2 border-yellow-500">{u.active ? 'Да' : 'Нет'}</td>
                                <td className="border px-4 py-2 border-yellow-500">
                                    <Button onClick={() => openEditModal(u)}>
                                        Редактировать
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>У вас нет прав просматривать пользователей.</p>
            )}
        </Layout>
    );
};

export default UsersPage;
