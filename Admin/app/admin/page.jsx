'use client';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
// } from 'recharts';
import Card_dashboard from "../../components/admin/dashboard/card";
import styles from '../dashboard.module.css'
import { BiCategoryAlt } from "react-icons/bi";
import { FaBagShopping } from "react-icons/fa6";
import { IoStatsChart } from "react-icons/io5";
import { IoGlasses } from "react-icons/io5";
import { useEffect, useState } from 'react';
import { getThongke_by_year, getThongke_today, getThongke_tongquan, getTop5product } from '../../services/admin/statistics';
import Revenue from '../../components/admin/dashboard/Revenue';
import Topproduct from '../../components/admin/dashboard/Topproduct';
import { icon } from '@fortawesome/fontawesome-svg-core';
import DashboardOrder from '../../components/admin/dashboard/order';
import TopproductItdcmua from '../../components/admin/dashboard/Producttop';



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
const data = {
  labels: ['Áo thun', 'Giày thể thao', 'Balo', 'Mũ lưỡi trai', 'Quần jeans'],
  datasets: [
    {
      label: 'Số lượng bán',
      data: [120, 95, 80, 60, 45],
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
};
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
  },
};


export default function AdminPage() {

  const [datatoday, setdatatoday] = useState([]);
  const [datatongquan, setdatatongquan] = useState([]);

  const logdata = async () => {
    const thongketoday = await getThongke_today();
    const thongketongquan = await getThongke_tongquan();
    setdatatoday(thongketoday);
    setdatatongquan(thongketongquan);

  }
  useEffect(() => {
    document.title = "Admin-Tổng quan"
    logdata();
  }, [])





  return (
    <div>

      <div className={styles.dashboardTilte}>
        <div className={styles.dashboardTilte2}>
          <h1>Bảng điều khiển</h1>
        </div>
        <div className={styles.dashboardTilteToday}>

          <div className={styles.card}>
            <div className={styles.iconContainer}>
              {/* Placeholder for actual icon, use an SVG or Font Awesome */}
              <IoStatsChart color="#92d9ec" size={24} />

            </div>
            <h3 className={styles.title}>Đơn hàng / ngày</h3>
            <p className={styles.value}>{datatoday.donhang}</p>
          </div>

          <div className={styles.card}>
            <div className={styles.iconContainer}>
              {/* Placeholder for actual icon, use an SVG or Font Awesome */}
              <IoStatsChart color="#a5b0f1" size={24} />

            </div>
            <h3 className={styles.title}>Doanh thu / ngày</h3>
            <p className={styles.value}>{datatoday.doanhthu?.toLocaleString("vi-VN")} đ</p>
          </div>

          <div className={styles.card}>
            <div className={styles.iconContainer}>
              {/* Placeholder for actual icon, use an SVG or Font Awesome */}
              <IoStatsChart color="#63eead" size={24} />

            </div>
            <h3 className={styles.title}>Sản phẩm bán / ngày</h3>
            <p className={styles.value}>{datatoday.kinhmat}</p>
          </div>

        </div>
      </div>


      <div className={styles.dashboardGrid}>
        <div className={styles.cardGrid}>
          {/* <Card_dashboard
            title="Sản phẩm sắp hết"
            value="26"
            percentage={0.43}
            icon={<BiCategoryAlt size={16} />} /> */}
          <Card_dashboard
            title="Đơn hàng chưa xác nhận"
            value={datatongquan?.donhang}
            percentage={0.43}
            icon={<FaBagShopping />} />
          <Card_dashboard
            title="Sản phẩm"
            value={datatongquan?.kinhmat}
            percentage={0.43}
            icon={<IoGlasses />} />


          <Card_dashboard
            title="Danh mục"
            value={datatongquan?.danhmuc}
            percentage={0.43}
            icon={<BiCategoryAlt />} />

        </div>
      </div>

      <div className={styles.dashboardChart}>

        <Topproduct />
        <Revenue />

      </div>

      <div className={styles.dashboardChart}>

        <TopproductItdcmua/>
        <DashboardOrder/>
      </div>

    </div>


  );
}
