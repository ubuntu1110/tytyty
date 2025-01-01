// frontend/src/components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    loading?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, loading = false, className='', ...props }) => {
    const baseClass = "px-4 py-2 rounded focus:outline-none transition-colors duration-200";
    const variantClass = variant === 'primary'
        ? "bg-yellow-500 text-black hover:bg-yellow-600"
        : "bg-gray-700 text-white hover:bg-gray-800";

    const disabledClass = loading ? "opacity-50 cursor-not-allowed" : "";
    const finalClassName = `${baseClass} ${variantClass} ${disabledClass} ${className}`;

    return (
        <button
            className={finalClassName}
            disabled={loading || props.disabled}
            aria-busy={loading ? "true" : "false"}
            {...props}
        >
            {loading ? "Загрузка..." : children}
        </button>
    );
};

export default Button;
