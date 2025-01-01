// frontend/src/components/ui/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

const Input: React.FC<InputProps> = ({ className='', ...props }) => {
    const baseClass = "border border-yellow-500 bg-black text-white p-2 rounded focus:border-yellow-300 w-full";
    return (
        <input
            className={`${baseClass} ${className}`}
            {...props}
        />
    );
};

export default Input;
