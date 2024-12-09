import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AnalyticsChart({ data }: {data: {labels:string[],values:number[]}}) {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Расходы',
                data: data.values,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            }
        ]
    };

    return <Bar data={chartData} />;
}

export default AnalyticsChart
