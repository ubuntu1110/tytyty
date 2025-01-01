// frontend/src/components/calculator/CalculatorMemoryButtons.tsx
import React from 'react';
import Button from '../ui/Button';

interface CalculatorMemoryButtonsProps {
    onMC: () => void;
    onMR: () => void;
    onMPlus: () => void;
    onMMinus: () => void;
}

const CalculatorMemoryButtons: React.FC<CalculatorMemoryButtonsProps> = ({ onMC, onMR, onMPlus, onMMinus }) => {
    return (
        <>
            <Button onClick={onMC}>MC</Button>
            <Button onClick={onMR}>MR</Button>
            <Button onClick={onMPlus}>M+</Button>
            <Button onClick={onMMinus}>M-</Button>
        </>
    );
};

export default CalculatorMemoryButtons;
