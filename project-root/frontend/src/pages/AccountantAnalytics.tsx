import React from 'react'
import Sidebar from '../components/Sidebar'
import ChartPlaceholder from '../components/ChartPlaceholder'

function AccountantAnalytics() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-10">
                <h1 className="text-3xl font-bold mb-6">Моя аналитика</h1>
                <p className="mb-4">Здесь будет аналитика по вашим расходам: графики, средние значения, динамика по неделям.</p>
                <ChartPlaceholder />
            </div>
        </div>
    )
}

export default AccountantAnalytics
