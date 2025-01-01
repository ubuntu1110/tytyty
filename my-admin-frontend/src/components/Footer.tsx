// src/components/Footer.tsx
import React, { useEffect, useState } from 'react';

interface Rates {
    RUB?: number;
    BYN?: number;
}

const Footer: React.FC = () => {
    const [rates, setRates] = useState<Rates>({});
    const [error, setError] = useState<string | null>(null);

    const fetchRates = async () => {
        try {
            const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=RUB,BYN');
            if (!res.ok) {
                throw new Error('Не удалось получить курсы валют (HTTP ошибка)');
            }
            const data = await res.json();

            // Проверяем, что success = true и есть data.rates
            if (data && data.success && data.rates) {
                setRates(data.rates);
                setError(null);
            } else {
                throw new Error('Не удалось разобрать данные о курсах');
            }
        } catch (err: any) {
            setError(err.message || 'Ошибка при загрузке курсов валют');
        }
    };

    useEffect(() => {
        fetchRates();
        // Обновляем курсы каждые 10 минут
        const intervalId = setInterval(fetchRates, 600000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <footer className="bg-black border-t border-yellow-500 p-4 text-center text-sm text-yellow-500">
            <p>© {new Date().getFullYear()} Все права защищены.</p>
            <div className="mt-2">
                {error ? (
                    <p className="text-red-500">Ошибка: {error}</p>
                ) : (
                    <>
                        <p>Курсы валют (USD):</p>
                        <p>
                            {`1 USD = ${rates.RUB !== undefined ? rates.RUB.toFixed(2) : '...'} RUB`}
                        </p>
                        <p>
                            {`1 USD = ${rates.BYN !== undefined ? rates.BYN.toFixed(2) : '...'} BYN`}
                        </p>
                    </>
                )}
            </div>
        </footer>
    );
};

export default Footer;
