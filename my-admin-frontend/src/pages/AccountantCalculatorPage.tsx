// frontend/src/pages/AccountantCalculatorPage.tsx
import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../auth/AuthContext';
import { toast } from 'react-toastify';
import { create, all } from 'mathjs';

import CalculatorDisplay from '../components/calculator/CalculatorDisplay';
import CalculatorMemoryButtons from '../components/calculator/CalculatorMemoryButtons';
import CalculatorButtons from '../components/calculator/CalculatorButtons';
import CalculatorExtraOperations from '../components/calculator/CalculatorExtraOperations';
import CalculatorHistory from '../components/calculator/CalculatorHistory';

const math = create(all, {});

interface HistoryItem {
    expression: string;
    result: string;
}

const AccountantCalculatorPage: React.FC = () => {
    const { role } = useContext(AuthContext);

    if (role !== 'accountant') {
        return (
            <Layout>
                <p>У вас нет доступа к этой странице.</p>
            </Layout>
        );
    }

    const [display, setDisplay] = useState<string>('0');
    const [memory, setMemory] = useState<number | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        const savedHistory = localStorage.getItem('calc_history');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('calc_history', JSON.stringify(history));
    }, [history]);

    const handleDigit = (digit: string) => {
        if (display === '0' || display === 'Ошибка') {
            setDisplay(digit);
        } else {
            setDisplay(display + digit);
        }
    };

    const handleOperator = (operator: string) => {
        const lastChar = display[display.length - 1];
        if (['+', '-', '*', '/', '^'].includes(lastChar)) {
            setDisplay(display.slice(0, -1) + operator);
        } else {
            setDisplay(display + operator);
        }
    };

    const handleClear = () => {
        setDisplay('0');
    };

    const handleEquals = () => {
        try {
            let expression = display.replace(/(\d+)%/g, '($1/100)');
            expression = expression.replace(/√(\d+(\.\d+)?)/g, 'sqrt($1)');
            const result = math.evaluate(expression);
            setDisplay(String(result));
            setHistory(prev => [...prev, { expression: display, result: String(result) }]);
        } catch (e) {
            setDisplay('Ошибка');
            setTimeout(() => setDisplay('0'), 1000);
        }
    };

    const handleMemoryClear = () => {
        setMemory(null);
    };

    const handleMemoryRecall = () => {
        if (memory !== null) {
            if (display === '0' || display === 'Ошибка') {
                setDisplay(String(memory));
            } else {
                setDisplay(display + memory);
            }
        }
    };

    const handleMemoryAdd = () => {
        try {
            const val = math.evaluate(display);
            if (memory === null) {
                setMemory(val);
            } else {
                setMemory(memory + val);
            }
            setDisplay('0');
        } catch (e) {
            setDisplay('Ошибка');
            setTimeout(() => setDisplay('0'), 1000);
        }
    };

    const handleMemorySubtract = () => {
        try {
            const val = math.evaluate(display);
            if (memory === null) {
                setMemory(-val);
            } else {
                setMemory(memory - val);
            }
            setDisplay('0');
        } catch (e) {
            setDisplay('Ошибка');
            setTimeout(() => setDisplay('0'), 1000);
        }
    };

    const handleExtraOperation = (op: string) => {
        if (op === '%') {
            setDisplay(display + '%');
        } else if (op === '√') {
            if (display === '0' || display === 'Ошибка') {
                setDisplay('√');
            } else {
                setDisplay(display + '√');
            }
        } else if (op === '^') {
            handleOperator('^');
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key;
            if (key >= '0' && key <= '9') {
                handleDigit(key);
            } else if (['+', '-', '*', '/','^'].includes(key)) {
                handleOperator(key);
            } else if (key === 'Enter') {
                e.preventDefault();
                handleEquals();
            } else if (key === 'Escape' || key === 'Backspace') {
                e.preventDefault();
                handleClear();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [display]);

    const handleHistoryClick = (item: HistoryItem) => {
        setDisplay(item.result);
    };

    return (
        <Layout>
            <h1 className="text-2xl mb-4 text-yellow-500">Калькулятор</h1>
            <div className="max-w-xs mx-auto bg-black border border-yellow-500 rounded p-4">
                <CalculatorDisplay value={display} />
                <div className="grid grid-cols-4 gap-2 mb-4">
                    <CalculatorMemoryButtons
                        onMC={handleMemoryClear}
                        onMR={handleMemoryRecall}
                        onMPlus={handleMemoryAdd}
                        onMMinus={handleMemorySubtract}
                    />
                    <CalculatorButtons
                        onDigit={handleDigit}
                        onOperator={handleOperator}
                        onEquals={handleEquals}
                        onClear={handleClear}
                    />
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <CalculatorExtraOperations onExtraOp={handleExtraOperation} />
                </div>
            </div>

            <CalculatorHistory history={history} onItemClick={handleHistoryClick} />
        </Layout>
    );
};

export default AccountantCalculatorPage;
