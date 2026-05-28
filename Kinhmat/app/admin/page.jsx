'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import Card_dashboard from "../../components/admin/dashboard/card";
import { useEffect, useState } from 'react';
import { getThongke_today, getThongke_tongquan, getThongke_by_year, getThongke_donhang, getTop5product, getTop5sp_itduocmua } from '../../services/admin/statistics';
import Revenue from '../../components/admin/dashboard/Revenue';
import Topproduct from '../../components/admin/dashboard/Topproduct';
import DashboardOrder from '../../components/admin/dashboard/order';
import TopproductItdcmua from '../../components/admin/dashboard/Producttop';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, DollarSign, Activity, Glasses, ShoppingBag, Layers } from 'lucide-react';
import ExportButton from '../../components/admin/ExportButton';
import { exportMultiSheet } from '../../utils/exportExcel';
import { COLUMNS_THONGKE_DOANHTHU, COLUMNS_THONGKE_DONHANG, COLUMNS_TOP_SANPHAM } from '../../utils/exportConfigs';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [datatoday, setdatatoday] = useState({ donhang: 0, doanhthu: 0, kinhmat: 0 });
  const [datatongquan, setdatatongquan] = useState({ donhang: 0, kinhmat: 0, danhmuc: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  const handleExportDashboard = async () => {
    try {
      setExportLoading(true);
      const currentYear = new Date().getFullYear();

      // Lấy dữ liệu song song
      const [yearData, donhangData, top5Ban, top5It] = await Promise.all([
        getThongke_by_year(currentYear),
        getThongke_donhang(currentYear),
        getTop5product('month', new Date().getMonth() + 1, currentYear),
        getTop5sp_itduocmua('month', new Date().getMonth() + 1, currentYear),
      ]);

      // Gộp doanh thu và lợi nhuận vào cùng 1 bảng
      const doanhThuMap = {};
      (yearData?.bddoanhthu || []).forEach((r) => { doanhThuMap[r.thang] = r.doanhthu_thang || 0; });
      const mergedRevenue = (yearData?.bdloinhuan || []).map((r) => ({
        thang: `Tháng ${r.thang}`,
        doanhthu_thang: doanhThuMap[r.thang] || 0,
        loinhuan_thang: r.loinhuan_thang || 0,
      }));

      // Thống kê đơn hàng
      const donhangRows = (donhangData || []).map((r) => ({
        thang: `Tháng ${r.thang}`,
        soluong: r.soluong,
      }));

      // Top 5 sản phẩm bán chạy
      const top5BanRows = (top5Ban?.list || []).map((r) => ({
        masp: r.masp,
        ten: r.ten,
        sl: r.sl,
      }));

      // Top 5 sản phẩm ít được mua
      const top5ItRows = (top5It?.list || []).map((r) => ({
        masp: r.masp,
        ten: r.ten,
        sl: r.sl,
      }));

      exportMultiSheet(
        [
          { name: 'Doanh Thu & Lợi Nhuận', data: mergedRevenue, columns: COLUMNS_THONGKE_DOANHTHU },
          { name: 'Đơn Hàng Theo Tháng', data: donhangRows, columns: COLUMNS_THONGKE_DONHANG },
          { name: 'Top 5 SP Bán Chạy', data: top5BanRows, columns: COLUMNS_TOP_SANPHAM },
          { name: 'Top 5 SP Ít Được Mua', data: top5ItRows, columns: COLUMNS_TOP_SANPHAM },
        ],
        `BaoCao_TongQuan_${currentYear}`
      );
    } catch (e) {
      console.error('Lỗi xuất Excel Dashboard:', e);
      alert('Có lỗi khi xuất Excel. Vui lòng thử lại!');
    } finally {
      setExportLoading(false);
    }
  };

  const logdata = async () => {
    try {
      setIsLoading(true);
      const thongketoday = await getThongke_today();
      const thongketongquan = await getThongke_tongquan();
      if (thongketoday) setdatatoday(thongketoday);
      if (thongketongquan) setdatatongquan(thongketongquan);
    } catch (e) {
      console.error("Lỗi lấy dữ liệu thống kê:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    document.title = "Admin - Tổng quan | Kính Mắt Luxury";
    logdata();
  }, []);

  if (!mounted) {
    return <div className="p-8 text-center text-gray-400 font-sans">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-8 font-sans text-gray-800 transition-colors duration-150">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 dark:border-white/5 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest mb-1.5">
            <Sparkles className="text-sm" /> MANAGEMENT CONSOLE
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-brand-dark tracking-wide">
            Bảng điều khiển tổng quan
          </h1>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="text-xs font-semibold text-gray-500 bg-white border border-gray-150 rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Dữ liệu cập nhật thời gian thực</span>
          </div>
          <ExportButton
            label="Xuất Báo Cáo"
            loading={exportLoading}
            options={[{ label: 'Xuất báo cáo tổng quan năm nay', onClick: handleExportDashboard }]}
          />
        </div>
      </div>

      {/* Daily Statistics Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold tracking-widest text-brand-gold uppercase">Chỉ số hôm nay</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Daily Orders */}
          <motion.div 
            className="bg-white border border-gray-150 rounded-2xl p-6 flex items-center justify-between shadow-md relative overflow-hidden group cursor-pointer"
            whileHover={{ y: -2, border: "1px solid rgba(197,168,128,0.4)", shadow: "0 10px 15px -3px rgba(197,168,128,0.06)" }}
            transition={{ duration: 0.15 }}
          >
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Đơn hàng mới</span>
              <p className="text-3xl font-extrabold font-heading text-brand-dark">
                {datatoday.donhang || 0}
              </p>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +12% so với hôm qua
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold relative z-10">
              <Activity className="text-xl" />
            </div>
          </motion.div>

          {/* Daily Revenue */}
          <motion.div 
            className="bg-white border border-gray-150 rounded-2xl p-6 flex items-center justify-between shadow-md relative overflow-hidden group cursor-pointer"
            whileHover={{ y: -2, border: "1px solid rgba(197,168,128,0.4)", shadow: "0 10px 15px -3px rgba(197,168,128,0.06)" }}
            transition={{ duration: 0.15 }}
          >
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Doanh thu ngày</span>
              <p className="text-2xl sm:text-3xl font-extrabold font-heading text-brand-gold tracking-wide">
                {(datatoday.doanhthu || 0).toLocaleString("vi-VN")} đ
              </p>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +18.4% so với hôm qua
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold relative z-10">
              <DollarSign className="text-xl" />
            </div>
          </motion.div>

          {/* Daily Products Sold */}
          <motion.div 
            className="bg-white border border-gray-150 rounded-2xl p-6 flex items-center justify-between shadow-md relative overflow-hidden group cursor-pointer"
            whileHover={{ y: -2, border: "1px solid rgba(197,168,128,0.4)", shadow: "0 10px 15px -3px rgba(197,168,128,0.06)" }}
            transition={{ duration: 0.15 }}
          >
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Mắt kính đã bán</span>
              <p className="text-3xl font-extrabold font-heading text-brand-dark">
                {datatoday.kinhmat || 0}
              </p>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +5% sản lượng
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold relative z-10">
              <Glasses className="text-2xl" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* General Stats (Dashboard Grid Cards) */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xs font-bold tracking-widest text-brand-gold uppercase">Tổng quan kho hàng</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card_dashboard
            title="Đơn hàng chưa xác nhận"
            value={datatongquan?.donhang}
            percentage={0.43}
            icon={<ShoppingBag />}
          />
          <Card_dashboard
            title="Tổng sản phẩm"
            value={datatongquan?.kinhmat}
            percentage={0.43}
            icon={<Glasses />}
          />
          <Card_dashboard
            title="Danh mục sản phẩm"
            value={datatongquan?.danhmuc}
            percentage={0.43}
            icon={<Layers />}
          />
        </div>
      </div>

      {/* Chart Section Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-4">
        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-md">
          <Topproduct />
        </div>
        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-md">
          <Revenue />
        </div>
      </div>

      {/* Bottom Lists & Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-4">
        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-md">
          <TopproductItdcmua />
        </div>
        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-md">
          <DashboardOrder />
        </div>
      </div>

    </div>
  );
}
