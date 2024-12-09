import React from 'react'

function Loader() {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="p-4 bg-white rounded shadow">
                <p>Загрузка...</p>
            </div>
        </div>
    )
}

export default Loader
