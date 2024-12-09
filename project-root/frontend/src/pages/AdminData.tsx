import React, { useEffect, useState } from 'react'
import { getToken } from '../services/auth'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../api'
import ExpensesList from '../components/ExpensesList'

function AdminData() {
    const token = getToken()
    const navigate = useNavigate()
    const [expenses, setExpenses] = useState([])

    useEffect(() => {
        if (!token) {
            navigate('/', { replace: true })
            return
        }
        fetchAllExpenses()
    }, [token])

    const fetchAllExpenses = async () => {
        const res = await api.get('/data/all_expenses', {
            headers: { Authorization: `Bearer ${token}` }
        })
        setExpenses(res.data)
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h1 className="text-3xl font-bold mb-6">Все данные</h1>
                <p className="mb-4">Здесь собраны все расходы, внесённые бухгалтерами.</p>
                <ExpensesList expenses={expenses} />
            </div>
        </div>
    )
}

export default AdminData
