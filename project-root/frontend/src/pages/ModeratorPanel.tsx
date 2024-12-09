import React from 'react'
import Sidebar from '../components/Sidebar'

function ModeratorPanel() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h1 className="text-3xl font-bold mb-6">Модератор панель</h1>
                <p>Здесь модератор может просматривать общую информацию о чатах.</p>
            </div>
        </div>
    )
}

export default ModeratorPanel
