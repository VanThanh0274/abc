"use client";
import styles from '../../../app/dashboard.module.css'
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useState } from 'react';
import { getTop5product} from '../../../services/admin/statistics';
import { useEffect } from 'react';
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);


const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        },
    },
};
export default function Topproduct() {
    const [filter, setFilter] = useState('today');

    const [pieData, setpieData] = useState({
        labels: [], // chứa các tháng như 'Tháng 1', 'Tháng 2'
        datasets: [],
    });

    const logdata = async (type, month, year) => {

        const bdtop5 = await getTop5product(type, 6, 2025);
        
        
        
        let name_product = [];
        for (let i = 0; i < bdtop5.length; i++) {

            name_product.push(bdtop5[i].ten);

        }


        let datatop5sp = [];
        for (let j = 0; j < bdtop5.length; j++) {
            datatop5sp.push(bdtop5[j].sl);
        }



        setpieData(
            {
                labels: name_product,
                datasets: [
                    {
                        label: 'Số lượng bán',
                        data: datatop5sp,
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#4BC0C0',
                            '#9966FF',
                        ],
                        borderWidth: 1,
                    },
                ],
            }
        )


    }
    const handleFilter = async (type, month, year) => {
        logdata(type, month, year)
    }
    useEffect(() => {
        logdata("today", 6, 2025);
    }, [])


    return (
        <>
            <div className={styles.chartBox}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className={styles.chartTitle}>Top 5 sản phẩm bán chạy</h3>

                    {/* Các nút chọn thời gian */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => { 
                            setFilter('today')
                            handleFilter("today", 0, 0)} } className={filter === 'today' ? styles.activeButton : styles.button}>
                            Hôm nay
                        </button>
                        <button onClick={() => {
                            setFilter('week')
                            handleFilter("week", 0, 0)
                        }}
                            className={filter === 'week' ? styles.activeButton : styles.button}>
                            Tuần này
                        </button>
                        <button onClick={() => {
                            setFilter('month')
                            handleFilter("month", 0, 0)
                        }}
                            className={filter === 'month' ? styles.activeButton : styles.button}>
                            Tháng này
                        </button>
                        <button onClick={() => {
                            setFilter('year')
                            handleFilter("year", 0, 0)
                        }}
                            className={filter === 'year' ? styles.activeButton : styles.button}>
                            Năm nay
                        </button>
                    </div>
                </div>

                <div style={{ width: 450, height: 500 }}>
                    <Pie data={pieData} options={options} />
                </div>
            </div>
        </>
    )
}

