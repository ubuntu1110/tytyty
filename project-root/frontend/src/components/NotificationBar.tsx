import React from 'react'

function NotificationBar({ notifications }: { notifications: string[] }) {
    if (!notifications || notifications.length === 0) return null

    return (
        <div className="fixed top-0 right-0 m-4 p-4 bg-yellow-200 border border-yellow-400 rounded shadow z-50">
            <ul className="list-disc list-inside">
                {notifications.map((n,i) => (
                    <li key={i}>{n}</li>
                ))}
            </ul>
        </div>
    )
}

export default NotificationBar
