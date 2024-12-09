import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { getToken } from '../services/auth'
import api from '../api'
import UsersList from '../components/UsersList'
import { useNavigate } from 'react-router-dom'

interface User {
    id: number;
    username: string;
    is_admin: boolean;
}

function AdminUsers() {
    const token = getToken()
    const navigate = useNavigate()
    const [users, setUsers] = useState<User[]>([])
    const [newUsername, setNewUsername] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newIsAdmin, setNewIsAdmin] = useState(false)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [deleteUserId, setDeleteUserId] = useState<number | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    useEffect(() => {
        if (!token) {
            navigate('/', { replace: true })
            return
        }
        fetchUsers()
    }, [token])

    const fetchUsers = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await api.get('/admin/all_users', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUsers(res.data)
        } catch (err: any) {
            setError('Не удалось загрузить пользователей.')
        } finally {
            setLoading(false)
        }
    }

    const createUser = async () => {
        if (!newUsername || !newPassword) {
            alert("Заполните имя пользователя и пароль!")
            return
        }
        try {
            await api.post('/admin/create_user', {
                username: newUsername,
                password: newPassword,
                is_admin: newIsAdmin
            },{
                headers: { Authorization: `Bearer ${token}` }
            })
            setNewUsername('')
            setNewPassword('')
            setNewIsAdmin(false)
            fetchUsers()
        } catch (err: any) {
            alert("Ошибка при создании пользователя. Возможно, пользователь уже существует.")
        }
    }

    const confirmDeleteUser = (id: number) => {
        setDeleteUserId(id)
        setDeleteError(null)
    }

    const deleteUser = async () => {
        if (!deleteUserId) return
        setDeleteLoading(true)
        setDeleteError(null)
        try {
            await api.delete(`/admin/delete_user/${deleteUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setDeleteUserId(null)
            fetchUsers()
        } catch (err: any) {
            setDeleteError('Ошибка при удалении пользователя.')
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h1 className="text-3xl font-bold mb-6">Пользователи</h1>
                <div className="bg-white p-6 rounded shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">Создать нового пользователя</h2>
                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                        <input
                            placeholder="Имя пользователя"
                            className="border border-gray-300 rounded p-2 w-64"
                            value={newUsername}
                            onChange={e => setNewUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            className="border border-gray-300 rounded p-2 w-64"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                            <label className="font-medium">Роль:</label>
                            <select
                                value={newIsAdmin ? 'admin' : 'accountant'}
                                onChange={e => setNewIsAdmin(e.target.value === 'admin')}
                                className="border border-gray-300 rounded p-2"
                            >
                                <option value="accountant">Бухгалтер</option>
                                <option value="admin">Админ</option>
                            </select>
                        </div>
                        <button
                            onClick={createUser}
                            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                            Создать
                        </button>
                    </div>
                </div>

                {loading && <p>Загрузка...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!loading && !error && (
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-semibold mb-4">Все пользователи</h2>
                        <UsersList
                            users={users}
                            onDelete={(id) => confirmDeleteUser(id)}
                        />
                    </div>
                )}

                {deleteUserId !== null && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow w-full max-w-sm">
                            <h3 className="text-xl font-semibold mb-4">Подтверждение</h3>
                            <p className="mb-4">Вы уверены, что хотите удалить пользователя с ID {deleteUserId}?</p>
                            {deleteError && <p className="text-red-600 mb-4">{deleteError}</p>}
                            <div className="flex gap-4">
                                <button
                                    onClick={deleteUser}
                                    disabled={deleteLoading}
                                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition disabled:opacity-50">
                                    {deleteLoading ? 'Удаление...' : 'Удалить'}
                                </button>
                                <button
                                    onClick={() => setDeleteUserId(null)}
                                    className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 transition">
                                    Отмена
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default AdminUsers
