import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import ExpensesList from '../components/ExpensesList'
import { getToken } from '../services/auth'
import Sidebar from '../components/Sidebar'

function Dashboard() {
    const token = getToken()
    const navigate = useNavigate()
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('')
    const [expenses, setExpenses] = useState([])

    useEffect(() => {
        if (!token) {
            navigate('/', { replace: true })
            return
        }
        fetchExpenses()
    }, [token])

    const fetchExpenses = async () => {
        const res = await api.get('/data/my_expenses', {
            headers: { Authorization: `Bearer ${token}` }
        })
        setExpenses(res.data)
    }

    const addExpense = async () => {
        if (!amount || !category) {
            alert("Пожалуйста, заполните все поля!")
            return
        }

        const amountNumber = parseFloat(amount)
        if (isNaN(amountNumber)) {
            alert("Сумма должна быть числом!")
            return
        }

        try {
            await api.post('/data/expenses', { amount: amountNumber, category }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setAmount('')
            setCategory('')
            fetchExpenses()
        } catch (err) {
            alert("Ошибка при добавлении расхода. Проверьте введённые данные.")
        }
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h1 className="text-3xl font-bold mb-6">Рабочая панель</h1>
                <div className="bg-white p-6 rounded shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">Добавить новый расход</h2>
                    <div className="flex items-center gap-4 mb-4">
                        <input
                            placeholder="Сумма"
                            className="border border-gray-300 rounded p-2 w-32"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                        />
                        <input
                            placeholder="Категория"
                            className="border border-gray-300 rounded p-2 w-64"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        />
                        <button
                            onClick={addExpense}
                            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
                            Добавить
                        </button>
                    </div>
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Ваши расходы</h2>
                    <ExpensesList expenses={expenses} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
