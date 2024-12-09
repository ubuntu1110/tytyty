import React from 'react'
import Sidebar from '../components/Sidebar'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'

const data = [
    { name: 'Понедельник', amount: 4000 },
    { name: 'Вторник', amount: 3000 },
    { name: 'Среда', amount: 2000 },
    { name: 'Четверг', amount: 2780 },
    { name: 'Пятница', amount: 1890 },
]

function AdminAnalytics() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h1 className="text-3xl font-bold mb-6">Аналитика</h1>
                <div className="bg-white p-6 rounded shadow">
                    <BarChart width={600} height={300} data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="amount" fill="#8884d8" />
                    </BarChart>
                </div>
            </div>
        </div>
    )
}

export default AdminAnalytics
