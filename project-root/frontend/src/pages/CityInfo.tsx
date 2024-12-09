// src/pages/CityInfo.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { getToken, getRole } from '../services/auth'
import Sidebar from '../components/Sidebar'
import Loader from '../components/Loader'
import NotificationBar from '../components/NotificationBar'

function CityInfo() {
    const token = getToken()
    const role = getRole()
    const navigate = useNavigate()
    const [cities, setCities] = useState<any[]>([])
    const [selectedCity, setSelectedCity] = useState('')
    const [loading, setLoading] = useState(true)
    const [notifications, setNotifications] = useState<string[]>([])

    useEffect(() => {
        if (!token) {
            navigate('/', { replace: true })
            return
        }
        if (!['admin','accountant'].includes(role || '')) {
            navigate('/', { replace: true })
            return
        }
        fetchCities()
    }, [token, role])

    const fetchCities = async () => {
        setLoading(true)
        try {
            const res = await api.get('/data/cities_info', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCities(res.data)
        } catch (err) {
            setNotifications(["Ошибка при загрузке городов"])
        }
        setLoading(false)
    }

    const city = cities.find(c => c.name === selectedCity)

    return (
        <div className="flex">
            <Sidebar />
            {loading && <Loader />}
            <div className="flex-1 p-10">
                <NotificationBar notifications={notifications}/>
                <h1 className="text-3xl font-bold mb-6">Информация о городах Беларуси</h1>
                <div className="bg-white p-4 rounded shadow mb-4">
                    <h2 className="text-xl font-semibold mb-4">Выберите город</h2>
                    <select
                        className="border border-gray-300 rounded p-2 w-64"
                        value={selectedCity}
                        onChange={e=>setSelectedCity(e.target.value)}
                    >
                        <option value="">- Выберите -</option>
                        {cities.map(c=>(
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                </div>
                {city && (
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold mb-4">{city.name}</h2>
                        <p>Население: {city.population}</p>
                        <p>Погода: {city.weather}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CityInfo
