import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { getToken } from '../services/auth'
import Sidebar from '../components/Sidebar'
import NotificationBar from '../components/NotificationBar'
import Loader from '../components/Loader'
import { differenceInDays } from 'date-fns'

function AccountantData() {
    const token = getToken()
    const navigate = useNavigate()

    // Данные расходов
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('')
    const [comment, setComment] = useState('')
    const [expenses, setExpenses] = useState<any[]>([])
    const categories = ["Листовки", "Граффити", "Стикеры", "Маркеры", "Прочее"]

    // Фильтры
    const [filterCity, setFilterCity] = useState('')
    const [filterCategory, setFilterCategory] = useState('')

    // Чаты
    const [chatName, setChatName] = useState('')
    const [chatLink, setChatLink] = useState('')
    const [chatPrice, setChatPrice] = useState('')
    const [chatDays, setChatDays] = useState(10)
    const [chats, setChats] = useState<any[]>([])

    const [loading, setLoading] = useState(true)
    const [notifications, setNotifications] = useState<string[]>([])

    useEffect(() => {
        if (!token) {
            navigate('/', { replace: true })
            return
        }
        loadData()
    }, [token, filterCity, filterCategory])

    const loadData = async () => {
        setLoading(true)
        await fetchExpenses()
        await fetchChats()
        await checkHolidays()
        generateAnalyticsNotifications()
        setLoading(false)
    }

    const fetchExpenses = async () => {
        const res = await api.get('/data/my_expenses', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                city: filterCity || undefined,
                category: filterCategory || undefined
            }
        })
        setExpenses(res.data)
    }

    const fetchChats = async () => {
        try {
            const res = await api.get('/data/my_chats', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setChats(res.data)
        } catch {}
    }

    const checkHolidays = async () => {
        const res = await api.get('/data/holidays', {
            headers: { Authorization: `Bearer ${token}` }
        })
        const holidays = res.data
        const today = new Date()
        const notes: string[] = []
        for (let h of holidays) {
            const hd = new Date(h.date)
            const diff = differenceInDays(hd, today)
            if (diff === 1) {
                notes.push(`Завтра праздник: ${h.name}`)
            }
        }
        setNotifications(prev => [...prev, ...notes])
    }

    const addExpense = async () => {
        if (!amount || !category) {
            alert("Заполните сумму и категорию!")
            return
        }
        const amountNumber = parseFloat(amount)
        if (isNaN(amountNumber)) {
            alert("Сумма должна быть числом!")
            return
        }

        await api.post('/data/expenses', { amount: amountNumber, category, comment }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        setAmount('')
        setCategory('')
        setComment('')
        fetchExpenses()
    }

    const addChat = async () => {
        if (!chatName || !chatLink || !chatPrice) {
            alert("Заполните данные чата!")
            return
        }
        const priceNum = parseFloat(chatPrice)
        if (isNaN(priceNum)) {
            alert("Цена чата должна быть числом!")
            return
        }

        await api.post('/data/chats', {
            name: chatName,
            link: chatLink,
            price: priceNum,
            expiration_days: chatDays,
            owner_wallet: "default_wallet"
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        setChatName('')
        setChatLink('')
        setChatPrice('')
        setChatDays(10)
        fetchChats()
    }

    // Расчет аналитики для бухгалтера
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7*24*60*60*1000)
    const monthAgo = new Date(now.getTime() - 30*24*60*60*1000)

    const weeklyExpenses = expenses.filter(e => new Date(e.date) >= weekAgo && new Date(e.date) <= now)
    const monthlyExpenses = expenses.filter(e => new Date(e.date) >= monthAgo && new Date(e.date) <= now)

    const weeklySum = weeklyExpenses.reduce((sum, e) => sum + e.amount, 0)
    const monthlySum = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0)

    const weeklyAvg = weeklyExpenses.length > 0 ? (weeklySum / weeklyExpenses.length).toFixed(2) : 0
    const monthlyAvg = monthlyExpenses.length > 0 ? (monthlySum / monthlyExpenses.length).toFixed(2) : 0

    // Допустим, у нас нет данных за прошлый месяц/неделю, но можно придумать:
    // Предположим, прошлый месяц: 5000, текущий месяц: monthlySum
    const lastMonthSum = 5000 // фиктивные данные, в реальном случае нужно хранить или вычислять
    const lastWeekSum = 1200 // фиктивные данные

    function generateAnalyticsNotifications() {
        const notes: string[] = []
        if (monthlySum < lastMonthSum) {
            notes.push("Расходы за этот месяц ниже, чем в прошлом. Проверьте, где можно улучшить показатели.")
        }
        if (weeklySum < lastWeekSum) {
            notes.push("На этой неделе расходы упали по сравнению с прошлой неделей, обратите внимание.")
        }
        // Можно добавить подсказки, если определенная категория трат слишком велика.
        // Если, к примеру, категория "Маркеры" больше 1000 за месяц:
        const markersSum = expenses.filter(e=>e.category==="Маркеры").reduce((sum,e)=>sum+e.amount,0)
        if (markersSum > 1000) {
            notes.push("Категория 'Маркеры' превысила 1000 за месяц, возможно стоит оптимизировать затраты.")
        }

        setNotifications(prev => [...prev, ...notes])
    }

    return (
        <div className="flex">
            <Sidebar />
            {loading && <Loader />}
            <div className="flex-1 p-10">
                <NotificationBar notifications={notifications}/>
                <h1 className="text-3xl font-bold mb-6">Мои данные (Бухгалтер)</h1>

                <div className="mb-6 bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Фильтры</h2>
                    <input
                        placeholder="Фильтр по городу"
                        className="border border-gray-300 rounded p-2 w-64 mr-2"
                        value={filterCity}
                        onChange={e => setFilterCity(e.target.value)}
                    />
                    <select
                        className="border border-gray-300 rounded p-2 w-64"
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                    >
                        <option value="">Все категории</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="bg-white p-6 rounded shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">Добавить новый расход</h2>
                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                        <input
                            placeholder="Сумма"
                            className="border border-gray-300 rounded p-2 w-32"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                        />
                        <select
                            className="border border-gray-300 rounded p-2 w-64"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            <option value="">Выберите категорию</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <input
                            placeholder="Комментарий (необязательно)"
                            className="border border-gray-300 rounded p-2 w-64"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />
                        <button
                            onClick={addExpense}
                            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
                            Добавить
                        </button>
                    </div>
                </div>

                {/* Блок аналитики */}
                <div className="bg-white p-6 rounded shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">Аналитика</h2>
                    <p>Сумма за неделю: {weeklySum}, Средний расход за неделю: {weeklyAvg}</p>
                    <p>Сумма за месяц: {monthlySum}, Средний расход за месяц: {monthlyAvg}</p>
                </div>

                <div className="bg-white p-6 rounded shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">Мои расходы</h2>
                    {expenses.length === 0 ? (
                        <p>Нет расходов.</p>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2 text-left">ID</th>
                                <th className="border border-gray-300 p-2 text-left">Сумма</th>
                                <th className="border border-gray-300 p-2 text-left">Категория</th>
                                <th className="border border-gray-300 p-2 text-left">Комментарий</th>
                                <th className="border border-gray-300 p-2 text-left">Дата</th>
                            </tr>
                            </thead>
                            <tbody>
                            {expenses.map((e: any) => (
                                <tr key={e.id} className="hover:bg-gray-100 transition">
                                    <td className="border border-gray-300 p-2">{e.id}</td>
                                    <td className="border border-gray-300 p-2">{e.amount}</td>
                                    <td className="border border-gray-300 p-2">{e.category}</td>
                                    <td className="border border-gray-300 p-2">{e.comment || '-'}</td>
                                    <td className="border border-gray-300 p-2">{e.date}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="bg-white p-6 rounded shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">Мои чаты</h2>
                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                        <input
                            placeholder="Название чата"
                            className="border border-gray-300 rounded p-2 w-64"
                            value={chatName}
                            onChange={e => setChatName(e.target.value)}
                        />
                        <input
                            placeholder="Ссылка чата"
                            className="border border-gray-300 rounded p-2 w-64"
                            value={chatLink}
                            onChange={e => setChatLink(e.target.value)}
                        />
                        <input
                            placeholder="Цена"
                            className="border border-gray-300 rounded p-2 w-32"
                            value={chatPrice}
                            onChange={e => setChatPrice(e.target.value)}
                        />
                        <input
                            placeholder="Срок (дней)"
                            className="border border-gray-300 rounded p-2 w-32"
                            type="number"
                            value={chatDays}
                            onChange={e => setChatDays(Number(e.target.value))}
                        />
                        <button
                            onClick={addChat}
                            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                            Добавить чат
                        </button>
                    </div>
                    {chats.length === 0 ? (
                        <p>Нет чатов.</p>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2 text-left">ID</th>
                                <th className="border border-gray-300 p-2 text-left">Название</th>
                                <th className="border border-gray-300 p-2 text-left">Ссылка</th>
                                <th className="border border-gray-300 p-2 text-left">Цена</th>
                                <th className="border border-gray-300 p-2 text-left">Дата покупки</th>
                                <th className="border border-gray-300 p-2 text-left">Дней до окончания</th>
                            </tr>
                            </thead>
                            <tbody>
                            {chats.map((c: any) => (
                                <tr key={c.id} className="hover:bg-gray-100 transition">
                                    <td className="border border-gray-300 p-2">{c.id}</td>
                                    <td className="border border-gray-300 p-2">{c.name}</td>
                                    <td className="border border-gray-300 p-2">{c.link}</td>
                                    <td className="border border-gray-300 p-2">{c.price}</td>
                                    <td className="border border-gray-300 p-2">{c.purchase_date}</td>
                                    <td className="border border-gray-300 p-2">{c.expiration_days}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AccountantData
