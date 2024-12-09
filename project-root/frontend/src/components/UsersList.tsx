import React from 'react'

function UsersList({ users, onDelete, onEdit }: { users: any[], onDelete: (id: number) => void, onEdit?: (u:any) => void }) {
    if (!users || users.length === 0) {
        return <p>Нет пользователей.</p>
    }

    return (
        <table className="w-full border-collapse">
            <thead>
            <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2 text-left">ID</th>
                <th className="border border-gray-300 p-2 text-left">Имя пользователя</th>
                <th className="border border-gray-300 p-2 text-left">Роль</th>
                <th className="border border-gray-300 p-2 text-left">Город</th>
                <th className="border border-gray-300 p-2 text-left">Действия</th>
            </tr>
            </thead>
            <tbody>
            {users.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-100 transition">
                    <td className="border border-gray-300 p-2">{u.id}</td>
                    <td className="border border-gray-300 p-2">{u.username}</td>
                    <td className="border border-gray-300 p-2">{u.role || (u.is_admin ? 'admin' : 'accountant')}</td>
                    <td className="border border-gray-300 p-2">{u.city || '-'}</td>
                    <td className="border border-gray-300 p-2 flex gap-2">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(u)}
                                className="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700 transition mr-2">
                                Редактировать
                            </button>
                        )}
                        <button
                            onClick={() => onDelete(u.id)}
                            className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 transition">
                            Удалить
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default UsersList
