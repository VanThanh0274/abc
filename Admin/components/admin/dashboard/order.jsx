"use client";
import styles from '../../../app/dashboard.module.css'
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useState } from 'react';
import { getThongke_donhang } from '../../../services/admin/statistics';
import { useEffect } from 'react';
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const barOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
    },
    scales: {
        y: {
            ticks: {
                callback: value => `${value.toLocaleString()} đơn`,
            },
        },
    },
};

export default function DashboardOrder() {
    const [barData, setBarData] = useState({
        labels: [], // chứa các tháng như 'Tháng 1', 'Tháng 2'
        datasets: [],
    });

    const fetchdata = async () => {
        const thongke = await getThongke_donhang(2025);
        let labels = [];
        for (let i = 0; i < thongke.length; i++) {

            labels.push("Tháng " + thongke[i].thang);

        }
        let soluong = [];
        for (let j = 0; j < thongke.length; j++) {
            soluong.push(thongke[j].soluong);
        }

        setBarData({
            labels: labels,
            datasets: [
                {
                    label: 'Đon hàng',
                    data: soluong,
                    backgroundColor: '#36A2EB',
                }
            ],
        });
        console.log(soluong);

    }
    useEffect(() => {
        fetchdata();
    }, [])
    return (
        <div>
            <div className={styles.chartBox}>
                <h3 className={styles.chartTitle}>Thống kê đơn hàng</h3>
                <div style={{ width: 800, height: 300 }}>
                    <Bar data={barData} options={barOptions}  />
                </div>
                
            </div>
        </div>
    )
}