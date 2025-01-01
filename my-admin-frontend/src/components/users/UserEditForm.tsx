// frontend/src/components/users/UserEditForm.tsx
import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface User {
    id: number;
    username: string;
    role: string;
    active: boolean;
}

interface UserEditFormProps {
    user: User;
    onUpdate: (username: string, password: string, role: string) => void;
    onClose: () => void;
}

const UserEditForm: React.FC<UserEditFormProps> = ({ user, onUpdate, onClose }) => {
    const [editUsername, setEditUsername] = useState(user.username);
    const [editPassword, setEditPassword] = useState('');
    const [editRole, setEditRole] = useState(user.role);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(editUsername, editPassword, editRole);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
            <Input
                type="text"
                placeholder="Имя пользователя"
                value={editUsername}
                onChange={e => setEditUsername(e.target.value)}
                required
            />
            <Input
                type="password"
                placeholder="Новый пароль (необязательно)"
                value={editPassword}
                onChange={e => setEditPassword(e.target.value)}
            />
            <Select
                value={editRole}
                onChange={e => setEditRole(e.target.value)}
                options={[
                    {value:'admin', label:'Администратор'},
                    {value:'accountant', label:'Бухгалтер'},
                    {value:'moderator', label:'Модератор'}
                ]}
            />
            <div className="flex space-x-2">
                <Button type="submit">Сохранить</Button>
                <Button type="button" variant="secondary" onClick={onClose}>Отмена</Button>
            </div>
        </form>
    );
};

export default UserEditForm;
