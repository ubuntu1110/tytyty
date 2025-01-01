// frontend/src/components/AdminExpenses/AdminExpensesFilter.tsx
import React from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import DateInput from '../ui/DateInput';
import Button from '../ui/Button';

interface FilterProps {
    users: {id:number;username:string;role:string;active:boolean;}[];
    selectedAccountant: string;
    onChangeAccountant: (val: string) => void;

    startDate: string;
    endDate: string;
    selectedCategory: string;
    selectedCurrency: string;
    categories: string[];
    currencies: string[];

    onFilterChange: (filters: {start_date?: string; end_date?: string; category?: string; currency?: string}) => void;
    onExportCSV: () => void;
}

const AdminExpensesFilter: React.FC<FilterProps> = ({
                                                        users,
                                                        selectedAccountant,
                                                        onChangeAccountant,
                                                        startDate,
                                                        endDate,
                                                        selectedCategory,
                                                        selectedCurrency,
                                                        categories,
                                                        currencies,
                                                        onFilterChange,
                                                        onExportCSV
                                                    }) => {
    return (
        <div className="mb-4 flex flex-wrap space-x-4 space-y-2 items-end">
            <div className="w-48">
                <label className="text-yellow-500 block mb-1">Бухгалтер</label>
                <Select
                    value={selectedAccountant}
                    onChange={e => onChangeAccountant(e.target.value)}
                    options={[{value:'', label:'Все'}].concat(users.map(u => ({value:String(u.id),label:u.username})))}
                />
            </div>
            <div className="w-48">
                <label className="text-yellow-500 block mb-1">Дата с</label>
                <DateInput value={startDate} onChange={e => onFilterChange({start_date:e.target.value})} />
            </div>
            <div className="w-48">
                <label className="text-yellow-500 block mb-1">Дата по</label>
                <DateInput value={endDate} onChange={e => onFilterChange({end_date:e.target.value})} />
            </div>
            <div className="w-48">
                <label className="text-yellow-500 block mb-1">Категория</label>
                <Select
                    value={selectedCategory}
                    onChange={e => onFilterChange({category:e.target.value})}
                    options={[{value:'',label:'Все'}].concat(categories.map(c => ({value:c,label:c})))}
                />
            </div>
            <div className="w-48">
                <label className="text-yellow-500 block mb-1">Валюта</label>
                <Select
                    value={selectedCurrency}
                    onChange={e => onFilterChange({currency:e.target.value})}
                    options={[{value:'',label:'Все'}].concat(currencies.map(c => ({value:c,label:c})))}
                />
            </div>
            <div>
                <Button onClick={onExportCSV}>Экспорт CSV</Button>
            </div>
        </div>
    );
};

export default AdminExpensesFilter;
