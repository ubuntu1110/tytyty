// frontend/src/components/AccountantProxies/AccountantProxiesFilter.tsx
import React from 'react';
import Input from '../../components/ui/Input';

interface AccountantProxiesFilterProps {
    filterText: string;
    onFilterChange: (value: string) => void;
}

const AccountantProxiesFilter: React.FC<AccountantProxiesFilterProps> = ({ filterText, onFilterChange }) => {
    return (
        <div className="mb-4 w-64">
            <label className="text-yellow-500 block mb-1">Поиск по IP или логину</label>
            <Input
                value={filterText}
                onChange={e => onFilterChange(e.target.value)}
                placeholder="Введите IP или логин"
            />
        </div>
    );
};

export default AccountantProxiesFilter;
