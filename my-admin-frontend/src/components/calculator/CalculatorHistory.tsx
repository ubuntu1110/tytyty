// frontend/src/components/calculator/CalculatorHistory.tsx
import React from 'react';

interface HistoryItem {
    expression: string;
    result: string;
}

interface CalculatorHistoryProps {
    history: HistoryItem[];
    onItemClick: (item: HistoryItem) => void;
}

const CalculatorHistory: React.FC<CalculatorHistoryProps> = ({ history, onItemClick }) => {
    if (history.length === 0) return null;

    return (
        <div className="max-w-xs mx-auto bg-black border border-yellow-500 rounded p-4 mt-4">
            <h2 className="text-yellow-500 text-lg mb-2">История вычислений</h2>
            <div className="max-h-48 overflow-y-auto">
                {history.map((item, index) => (
                    <div
                        key={index}
                        className="text-white mb-2 cursor-pointer hover:bg-gray-800 p-1 rounded"
                        onClick={() => onItemClick(item)}
                        title="Нажмите, чтобы использовать результат"
                    >
                        {item.expression} = {item.result}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalculatorHistory;
