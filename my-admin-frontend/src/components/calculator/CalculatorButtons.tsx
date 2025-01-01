// frontend/src/components/calculator/CalculatorButtons.tsx
import React from 'react';
import Button from '../ui/Button';

interface CalculatorButtonsProps {
    onDigit: (digit: string) => void;
    onOperator: (op: string) => void;
    onEquals: () => void;
    onClear: () => void;
}

const CalculatorButtons: React.FC<CalculatorButtonsProps> = ({ onDigit, onOperator, onEquals, onClear }) => {
    return (
        <>
            {/* Верхний ряд цифр и / */}
            <Button onClick={() => onDigit('7')}>7</Button>
            <Button onClick={() => onDigit('8')}>8</Button>
            <Button onClick={() => onDigit('9')}>9</Button>
            <Button onClick={() => onOperator('/')}>/</Button>

            <Button onClick={() => onDigit('4')}>4</Button>
            <Button onClick={() => onDigit('5')}>5</Button>
            <Button onClick={() => onDigit('6')}>6</Button>
            <Button onClick={() => onOperator('*')}>*</Button>

            <Button onClick={() => onDigit('1')}>1</Button>
            <Button onClick={() => onDigit('2')}>2</Button>
            <Button onClick={() => onDigit('3')}>3</Button>
            <Button onClick={() => onOperator('-')}>-</Button>

            <Button onClick={() => onDigit('0')}>0</Button>
            <Button onClick={onClear}>C</Button>
            <Button onClick={onEquals}>=</Button>
            <Button onClick={() => onOperator('+')}>+</Button>
        </>
    );
};

export default CalculatorButtons;
