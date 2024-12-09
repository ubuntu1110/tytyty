import React from 'react'

function ExpensesList({ expenses }: { expenses: any[] }) {
    if (!expenses || expenses.length === 0) {
        return <p>Нет расходов.</p>
    }

    return (
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
    )
}

export default ExpensesList
