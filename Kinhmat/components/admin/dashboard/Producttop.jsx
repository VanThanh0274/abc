"use client"
import styles from '../../../app/dashboard.module.css'
import { useEffect, useState } from "react";
import { getTop5sp_itduocmua } from "../../../services/admin/statistics";
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        },
    },
};

export default function TopproductItdcmua() {

    const [pieData, setpieData] = useState({
        labels: [], // chứa các tháng như 'Tháng 1', 'Tháng 2'
        datasets: [],
    });

    const logdata = async (type, month, year) => {

        try {
            const bdtop5 = await getTop5sp_itduocmua(type, 6, 2025);
            if (!bdtop5) return;

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
        } catch (error) {
            console.error("Lỗi lấy dữ liệu thống kê sản phẩm:", error);
        }

    }

    const fetchdata = async () => {
        try {
            const data = await getTop5sp_itduocmua('year', 5, 2025);
            console.log(data);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
        }
    }
    useEffect(() => {
        fetchdata();
        logdata('year', 6, 2025)
    }, [])

    return (
        <div className={styles.chartBox}>
            <h3 className={styles.chartTitle}>Top 5 sản phẩm ít được mua</h3>
            <div className="relative w-full max-w-[320px] mx-auto h-[320px] flex items-center justify-center pt-4">
                <Pie data={pieData} options={options} />
            </div>
        </div>
    )
}