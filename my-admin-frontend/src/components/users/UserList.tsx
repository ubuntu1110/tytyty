// frontend/src/components/users/UserList.tsx
import React from 'react';
import Button from '../ui/Button';

interface User {
    id: number;
    username: string;
    role: string;
    active: boolean;
}

interface UserListProps {
    users: User[];
    onEdit: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onEdit }) => {
    return (
        <table className="min-w-full border-collapse border border-yellow-500">
            <thead>
            <tr>
                <th className="border px-4 py-2 border-yellow-500">ID</th>
                <th className="border px-4 py-2 border-yellow-500">Имя пользователя</th>
                <th className="border px-4 py-2 border-yellow-500">Роль</th>
                <th className="border px-4 py-2 border-yellow-500">Активен</th>
                <th className="border px-4 py-2 border-yellow-500">Действия</th>
            </tr>
            </thead>
            <tbody>
            {users.map(u => (
                <tr key={u.id}>
                    <td className="border px-4 py-2 border-yellow-500">{u.id}</td>
                    <td className="border px-4 py-2 border-yellow-500">{u.username}</td>
                    <td className="border px-4 py-2 border-yellow-500">{u.role}</td>
                    <td className="border px-4 py-2 border-yellow-500">{u.active ? 'Да' : 'Нет'}</td>
                    <td className="border px-4 py-2 border-yellow-500">
                        <Button onClick={() => onEdit(u)}>Редактировать</Button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default UserList;
