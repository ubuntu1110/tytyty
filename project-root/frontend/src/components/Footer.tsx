import React, { useEffect, useState } from 'react'

function Footer() {
    const [time, setTime] = useState(new Date())
    const [rates, setRates] = useState<{usd?: number, eur?: number, bun?: number}>({})

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        fetchRates()
    }, [])

    async function fetchRates() {
        // Получаем курсы валют:
        // Предположим, RUB - базовая валюта, нужен курс к USD, EUR, BUN
        // ExchangeRatesAPI не поддерживает вымышленную валюту BUN, но предположим, что у нас есть другой API или просто вымышленный курс
        const res = await fetch("https://api.exchangerate.host/latest?base=RUB&symbols=USD,EUR")
        const data = await res.json()
        // Возьмем BUN за выдумку: 1 RUB = 0.5 BUN
        setRates({
            usd: data.rates.USD,
            eur: data.rates.EUR,
            bun: 0.5
        })
    }

    function getTimeInZone(offsetHours: number) {
        const localTime = new Date(time.getTime() + offsetHours*60*60*1000)
        return localTime.toLocaleString()
    }

    return (
        <div className="p-4 bg-gray-900 text-white flex flex-wrap gap-4 justify-center items-center fixed bottom-0 w-full text-sm">
            <div className="flex flex-col items-center">
                <span>Москва (UTC+3)</span>
                <span>{getTimeInZone(3)}</span>
            </div>
            <div className="flex flex-col items-center">
                <span>Минск (UTC+3)</span>
                <span>{getTimeInZone(3)}</span>
            </div>
            <div className="flex flex-col items-center">
                <span>Иркутск (UTC+8)</span>
                <span>{getTimeInZone(8)}</span>
            </div>
            <div className="flex flex-col items-center">
                <span>Ноябрьск (UTC+7)</span>
                <span>{getTimeInZone(7)}</span>
            </div>
            <div className="flex flex-col items-center border-l border-white pl-4">
                <span>Курсы валют:</span>
                {rates.usd && <span>1 RUB = {rates.usd.toFixed(4)} USD</span>}
                {rates.eur && <span>1 RUB = {rates.eur.toFixed(4)} EUR</span>}
                {rates.bun && <span>1 RUB = {rates.bun.toFixed(4)} BUN</span>}
            </div>
            <div className="flex flex-col items-center border-l border-white pl-4">
                <span>Сегодня: {time.toLocaleDateString()}</span>
            </div>
        </div>
    )
}

export default Footer
