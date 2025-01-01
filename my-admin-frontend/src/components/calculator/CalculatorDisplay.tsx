// frontend/src/components/calculator/CalculatorDisplay.tsx
import React from 'react';

interface CalculatorDisplayProps {
    value: string;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ value }) => {
    return (
        <div className="bg-gray-800 text-white text-right p-2 mb-4 rounded h-10 flex items-center justify-end">
            {value}
        </div>
    );
};

export default CalculatorDisplay;
