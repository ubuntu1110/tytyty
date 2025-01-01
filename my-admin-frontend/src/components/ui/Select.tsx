// frontend/src/components/ui/Select.tsx
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: {value: string; label: string;}[]
}

const Select: React.FC<SelectProps> = ({options, ...props}) => {
    return (
        <select
            className="border border-yellow-500 bg-black text-white p-2 rounded focus:border-yellow-300 w-full"
            {...props}
        >
            {options.map(o => <option value={o.value} key={o.value}>{o.label}</option>)}
        </select>
    );
};

export default Select;
