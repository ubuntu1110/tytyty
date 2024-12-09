import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { getToken } from '../services/auth'
import UsersList from '../components/UsersList'
import ExpensesList from '../components/ExpensesList'
import Sidebar from '../components/Sidebar'

function AdminPanel() {
    const token = getToken()
    const navigate = useNavigate()
    const [users, setUsers] = useState<any[]>([])
    const [newUsername, setNewUsername] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newRole, setNewRole] = useState('accountant') // можно выбрать роль при создании
    const [newCity, setNewCity] = useState('')
    const [expenses, setExpenses] = useState([])

    // Состояние для модалки редактирования пользователя
    const [editUserId, setEditUserId] = useState<number | null>(null)
    const [editUsername, setEditUsername] = useState('')
    const [editPassword, setEditPassword] = useState('')
    const [editRole, setEditRole] = useState('accountant')
    const [editCity, setEditCity] = useState('')

    useEffect(() => {
        if (!token) {
            navigate('/', { replace: true })
            return
        }
        fetchUsers()
        fetchAllExpenses()
    }, [token])

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/all_users', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUsers(res.data)
        } catch (err) {
            alert('Недостаточно прав или произошла ошибка.')
            navigate('/', { replace: true })
        }
    }

    const fetchAllExpenses = async () => {
        const res = await api.get('/data/all_expenses', {
            headers: { Authorization: `Bearer ${token}` }
        })
        setExpenses(res.data)
    }

    const createAccountant = async () => {
        if (!newUsername || !newPassword) {
            alert("Заполните имя пользователя и пароль!")
            return
        }
        try {
            await api.post('/admin/create_user', {
                username: newUsername,
                password: newPassword,
                is_admin: (newRole === 'admin'), // если роль admin, значит is_admin=true
                role: newRole,
                city: newCity || null
            },{
                headers: { Authorization: `Bearer ${token}` }
            })
            setNewUsername('')
            setNewPassword('')
            setNewRole('accountant')
            setNewCity('')
            fetchUsers()
        } catch (err) {
            alert("Ошибка при создании пользователя. Возможно, пользователь уже существует.")
        }
    }

    const deleteUser = async (id: number) => {
        await api.delete(`/admin/delete_user/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        fetchUsers()
    }

    const startEditUser = (u: any) => {
        setEditUserId(u.id)
        setEditUsername(u.username)
        setEditPassword('')
        setEditRole(u.role || (u.is_admin ? 'admin' : 'accountant'))
        setEditCity(u.city || '')
    }

    const saveEditUser = async () => {
        if (!editUserId) return
        try {
            await api.put(`/admin/update_user/${editUserId}`, {
                username: editUsername,
                password: editPassword ? editPassword : undefined,
                role: editRole,
                city: editCity || null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setEditUserId(null)
            setEditUsername('')
            setEditPassword('')
            setEditRole('accountant')
            setEditCity('')
            fetchUsers()
        } catch (err) {
            alert("Ошибка при обновлении пользователя.")
        }
    }

    const cancelEdit = () => {
        setEditUserId(null)
        setEditUsername('')
        setEditPassword('')
        setEditRole('accountant')
        setEditCity('')
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>
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
                        <select
                            className="border border-gray-300 rounded p-2 w-64"
                            value={newRole}
                            onChange={e => setNewRole(e.target.value)}
                        >
                            <option value="admin">Админ</option>
                            <option value="accountant">Бухгалтер</option>
                            <option value="moderator">Модератор</option>
                        </select>
                        <input
                            placeholder="Город (необязательно)"
                            className="border border-gray-300 rounded p-2 w-64"
                            value={newCity}
                            onChange={e => setNewCity(e.target.value)}
                        />
                        <button
                            onClick={createAccountant}
                            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                            Создать
                        </button>
                    </div>
                </div>
                <div className="bg-white p-6 rounded shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">Все пользователи</h2>
                    <UsersList users={users} onDelete={deleteUser} onEdit={startEditUser}/>
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Все расходы</h2>
                    <ExpensesList expenses={expenses} />
                </div>
            </div>

            {editUserId !== null && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow w-full max-w-sm">
                        <h3 className="text-xl font-semibold mb-4">Редактирование пользователя {editUserId}</h3>
                        <label className="block mb-2 font-medium">Имя пользователя</label>
                        <input
                            value={editUsername}
                            onChange={e => setEditUsername(e.target.value)}
                            placeholder="Имя пользователя"
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                        />
                        <label className="block mb-2 font-medium">Новый пароль (опционально)</label>
                        <input
                            type="password"
                            value={editPassword}
                            onChange={e => setEditPassword(e.target.value)}
                            placeholder="Пароль"
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                        />
                        <label className="block mb-2 font-medium">Роль</label>
                        <select
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                            value={editRole}
                            onChange={e => setEditRole(e.target.value)}
                        >
                            <option value="admin">Админ</option>
                            <option value="accountant">Бухгалтер</option>
                            <option value="moderator">Модератор</option>
                        </select>
                        <label className="block mb-2 font-medium">Город (необязательно)</label>
                        <input
                            value={editCity}
                            onChange={e => setEditCity(e.target.value)}
                            placeholder="Город"
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={saveEditUser}
                                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                            >
                                Сохранить
                            </button>
                            <button
                                onClick={cancelEdit}
                                className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 transition"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminPanel
