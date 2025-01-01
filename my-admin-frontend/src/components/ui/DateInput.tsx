// frontend/src/components/ui/DateInput.tsx
import React from 'react';

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const DateInput: React.FC<DateInputProps> = (props) => {
    return (
        <input
            type="date"
            className="border border-yellow-500 bg-black text-white p-2 rounded focus:border-yellow-300 w-full"
            {...props}
        />
    );
};

export default DateInput;
