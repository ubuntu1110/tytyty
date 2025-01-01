// frontend/src/components/calculator/CalculatorExtraOperations.tsx
import React from 'react';
import Button from '../ui/Button';

interface CalculatorExtraOperationsProps {
    onExtraOp: (op: string) => void;
}

const CalculatorExtraOperations: React.FC<CalculatorExtraOperationsProps> = ({ onExtraOp }) => {
    return (
        <>
            <Button onClick={() => onExtraOp('%')}>%</Button>
            <Button onClick={() => onExtraOp('√')}>√</Button>
            <Button onClick={() => onExtraOp('^')}>^</Button>
        </>
    );
};

export default CalculatorExtraOperations;
