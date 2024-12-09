import React from 'react'
import Sidebar from '../components/Sidebar'

function AdminSettings() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h1 className="text-3xl font-bold mb-6">Настройки</h1>
                <p>Здесь админ может настроить различные параметры системы, сроки уведомлений и т.д.</p>
            </div>
        </div>
    )
}

export default AdminSettings
