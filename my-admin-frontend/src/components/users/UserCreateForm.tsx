// frontend/src/components/users/UserCreateForm.tsx
import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface UserCreateFormProps {
    onCreate: (username: string, password: string, role: string) => void;
    onClose: () => void;
}

const UserCreateForm: React.FC<UserCreateFormProps> = ({ onCreate, onClose }) => {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState('accountant');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(newUsername, newPassword, newRole);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
            <Input
                type="text"
                placeholder="Имя пользователя"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                required
            />
            <Input
                type="password"
                placeholder="Пароль"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
            />
            <Select
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                options={[
                    { value:'admin', label:'Администратор'},
                    { value:'accountant', label:'Бухгалтер'},
                    { value:'moderator', label:'Модератор'}
                ]}
            />
            <div className="flex space-x-2">
                <Button type="submit">Сохранить</Button>
                <Button type="button" variant="secondary" onClick={onClose}>Отмена</Button>
            </div>
        </form>
    );
};

export default UserCreateForm;
