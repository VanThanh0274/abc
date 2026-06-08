"use client";
import styles from '../../../app/dashboard.module.css'
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useState } from 'react';
import { getThongke_by_year } from '../../../services/admin/statistics';
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
                callback: value => `${value.toLocaleString()}đ`,
            },
        },
    },
};

export default function Revenue() {
    const [barData, setBarData] = useState({
        labels: [], // chứa các tháng như 'Tháng 1', 'Tháng 2'
        datasets: [],
    });


    const logdata = async () => {
        try {
            const { bddoanhthu, bdloinhuan } = await getThongke_by_year(2025);
            if (!bddoanhthu || !bdloinhuan) return;
            
            let labels = [];
            for (let i = 0; i < bddoanhthu.length; i++) {

                labels.push("Tháng " + bddoanhthu[i].thang);

            }
            

            let dataDoanhthu = [];
            for (let j = 0; j < bddoanhthu.length; j++) {
                dataDoanhthu.push(bddoanhthu[j].doanhthu_thang);
            }
            let dataLoinhuan = [];
            for (let j = 0; j < bdloinhuan.length; j++) {
                dataLoinhuan.push(bdloinhuan[j].loinhuan_thang);
            }
            setBarData({
                labels: labels,
                datasets: [
                    {
                        label: 'Doanh thu',
                        data: dataDoanhthu,
                        backgroundColor: '#36A2EB',
                    },
                    {
                        label: 'Lợi nhuận',
                        data: dataLoinhuan,
                        backgroundColor: '#4BC0C0',
                    },
                ],
            });
        } catch (error) {
            console.error("Lỗi lấy dữ liệu thống kê:", error);
        }
    }

    useEffect(() =>{
        logdata();
    },[])

        return (
            <>
                <div className={styles.chartBox}>
                    <h3 className={styles.chartTitle}>Thống kê</h3>
                    <div className="relative w-full h-[320px] pt-4">
                        <Bar data={barData} options={barOptions} />
                    </div>

                </div>
            </>
        )
    }
