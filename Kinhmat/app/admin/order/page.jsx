'use client';

import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { CreateVanchuyen, FilterOrder, GetallOrder, Getorderbyid, Getvanchuyen, UpdateState, Updatevanchuyen } from '../../../services/admin/order';
import { createHoadonXuatFromDonhang } from '../../../services/admin/invoice';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Sparkles, Search, X, ShoppingBag, User, Phone, Mail, MapPin, Calendar, Tag, Truck, CircleCheck, Printer, FileText } from 'lucide-react';
import ExportButton from '../../../components/admin/ExportButton';
import { exportToExcel } from '../../../utils/exportExcel';
import { COLUMNS_DONHANG } from '../../../utils/exportConfigs';

const parseChitiet = (donhang) => {
  if (!donhang) return [];
  const list = donhang.listjson_chitiet;
  if (!list) return [];
  if (Array.isArray(list)) return list;
  if (typeof list === 'string') {
    try {
      const parsed = JSON.parse(list);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Error parsing listjson_chitiet:", e);
      return [];
    }
  }
  return [];
};

function getStatusClass(status) {
  switch (status) {
    case 'Chờ xác nhận':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'Chờ giao':
      return 'bg-sky-50 text-sky-700 border border-sky-200';
    case 'Đang giao':
      return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
    case 'Hoàn thành':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    default:
      return 'bg-gray-50 text-gray-700 border border-gray-200';
  }
}

// ─── Invoice Print Component ─────────────────────────────────────────────────
function InvoicePrint({ donhang, stateOrder, idorder, vanchuyen, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  const subtotal = parseChitiet(donhang).reduce(
    (acc, item) => acc + (item.giaban || 0) * (item.soluong || 0), 0
  );
  const shippingFee = 30000;
  const total = donhang.tongtien || subtotal + shippingFee;
  const issueDate = donhang.thoigian ? new Date(donhang.thoigian) : new Date();

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      {/* Control Bar - hidden on print */}
      <div className="print:hidden fixed top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        <motion.button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#c5a880] text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-105 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Printer size={15} />
          In Hóa Đơn
        </motion.button>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-semibold text-xs rounded-xl shadow hover:bg-gray-50 transition-all"
        >
          <X size={14} />
          Đóng
        </button>
      </div>

      {/* Invoice Page */}
      <div
        id="invoice-content"
        className="bg-white w-full max-w-[800px] mt-16 print:mt-0 rounded-2xl print:rounded-none shadow-2xl print:shadow-none"
        style={{ fontFamily: "'Be Vietnam Pro', Arial, sans-serif" }}
      >
        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2a26] text-white px-10 py-8 print:px-8 print:py-6 rounded-t-2xl print:rounded-none">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-[#c5a880] rounded-lg flex items-center justify-center">
                  <span className="text-black font-black text-sm">K</span>
                </div>
                <span className="text-[#c5a880] font-black text-lg tracking-widest uppercase">Kính Mắt Luxury</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">Kính mắt cao cấp · Phong cách đẳng cấp</p>
              <p className="text-gray-500 text-[10px] mt-0.5">ĐT: 0900 000 000 · Email: kinhmatluxury@gmail.com</p>
            </div>
            <div className="text-right">
              <p className="text-[#c5a880] text-xs font-bold uppercase tracking-widest">Hóa Đơn Bán Hàng</p>
              <p className="text-white text-2xl font-black mt-1">#{idorder}</p>
              <p className="text-gray-400 text-xs mt-1">
                Ngày: {issueDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[9px] font-bold border ${getStatusClass(stateOrder)}`}>
                {stateOrder}
              </span>
            </div>
          </div>
        </div>

        <div className="px-10 py-8 print:px-8 print:py-6 space-y-7">
          {/* ── Customer Info ── */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-black text-[#c5a880] uppercase tracking-widest mb-3">Thông tin khách hàng</p>
              <div className="space-y-1.5 text-sm text-gray-700">
                <p><span className="font-semibold text-gray-500">Họ tên:</span> <span className="font-bold text-gray-900">{donhang.ten}</span></p>
                <p><span className="font-semibold text-gray-500">Điện thoại:</span> <span className="font-bold text-gray-900">{donhang.sdt}</span></p>
                <p><span className="font-semibold text-gray-500">Email:</span> <span className="font-bold text-gray-900">{donhang.email || 'N/A'}</span></p>
                <p><span className="font-semibold text-gray-500">Địa chỉ:</span> <span className="font-bold text-gray-900 text-xs leading-relaxed">{donhang.diachi}</span></p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-[#c5a880] uppercase tracking-widest mb-3">Thông tin vận chuyển</p>
              {vanchuyen ? (
                <div className="space-y-1.5 text-sm text-gray-700">
                  <p><span className="font-semibold text-gray-500">Đơn vị:</span> <span className="font-bold text-gray-900">{vanchuyen.donvivanchuyen}</span></p>
                  <p><span className="font-semibold text-gray-500">Mã vận đơn:</span> <span className="font-bold font-mono text-gray-900">{vanchuyen.mavandon}</span></p>
                  <p><span className="font-semibold text-gray-500">Ngày giao:</span> <span className="font-bold text-gray-900">{vanchuyen.ngaygiao ? new Date(vanchuyen.ngaygiao).toLocaleDateString('vi-VN') : 'N/A'}</span></p>
                </div>
              ) : (
                <div className="space-y-1.5 text-sm text-gray-400">
                  <p className="italic">Chưa có thông tin vận chuyển</p>
                  <p><span className="font-semibold text-gray-500">Phương thức:</span> <span className="font-bold text-gray-700">COD / Giao hàng</span></p>
                </div>
              )}
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="border-t-2 border-dashed border-gray-200" />

          {/* ── Product Table ── */}
          <div>
            <p className="text-[10px] font-black text-[#c5a880] uppercase tracking-widest mb-3">Chi tiết sản phẩm</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="py-3 px-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider">STT</th>
                  <th className="py-3 px-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                  <th className="py-3 px-3 text-center text-[10px] font-black text-gray-500 uppercase tracking-wider">SL</th>
                  <th className="py-3 px-3 text-right text-[10px] font-black text-gray-500 uppercase tracking-wider">Đơn giá</th>
                  <th className="py-3 px-3 text-right text-[10px] font-black text-gray-500 uppercase tracking-wider">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {parseChitiet(donhang).map((item, idx) => (
                  <tr key={item.masp} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-3 px-3 text-gray-400 text-xs">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-gray-900 text-xs">{item.ten}</p>
                      <p className="text-gray-400 text-[10px]">Mã SP: {item.masp}</p>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-gray-700">{item.soluong || 0}</td>
                    <td className="py-3 px-3 text-right text-gray-600 text-xs">{(item.giaban || 0).toLocaleString('vi-VN')} đ</td>
                    <td className="py-3 px-3 text-right font-bold text-[#c5a880]">{((item.giaban || 0) * (item.soluong || 0)).toLocaleString('vi-VN')} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Totals ── */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Tạm tính</span>
                <span className="font-semibold text-gray-700">{subtotal.toLocaleString('vi-VN')} đ</span>
              </div>
              {donhang?.tien_giam > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Giảm giá</span>
                  <span className="font-semibold text-red-500">-{donhang.tien_giam.toLocaleString('vi-VN')} đ</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Phí vận chuyển</span>
                <span className="font-semibold text-gray-700">30.000 đ</span>
              </div>
              <div className="border-t-2 border-gray-200 pt-2 flex justify-between items-center">
                <span className="font-black text-gray-900 text-base">TỔNG CỘNG</span>
                <span className="font-black text-[#c5a880] text-xl">
                  {(Math.max(0, subtotal - (donhang?.tien_giam || 0)) + shippingFee).toLocaleString('vi-VN')} đ
                </span>
              </div>
              {donhang.ghichu && (
                <div className="pt-2 border-t border-dashed border-gray-200">
                  <p className="text-[10px] text-gray-400 italic">Ghi chú: {donhang.ghichu}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="border-t-2 border-dashed border-gray-200 pt-6 text-center space-y-1">
            <p className="text-sm font-bold text-gray-700">Cảm ơn quý khách đã mua hàng tại <span className="text-[#c5a880]">Kính Mắt Luxury</span>!</p>
            <p className="text-xs text-gray-400">Hóa đơn được xuất bởi hệ thống · {new Date().toLocaleString('vi-VN')}</p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          #invoice-content, #invoice-content * { visibility: visible; }
          #invoice-content { position: fixed; left: 0; top: 0; width: 100%; }
        }
      ` }} />
    </div>
  );
}

// ─── Main Admin Order Component ───────────────────────────────────────────────
export default function Order() {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState("Tất cả");
  const [listOrder, setlistOrder] = useState([]);
  const [donhang, setdonhang] = useState({});
  const [vanchuyen, setvanchuyen] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [stateOrder, setstateOrder] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  
  // Shipping Input fields
  const [ngaygiao, setngaygiao] = useState("");
  const [mavandon, setmavandon] = useState("");
  const [donviVC, setdonviVC] = useState("");
  const [idorder, setidorder] = useState(0);

  const [tongtrang, settongtrang] = useState(0);
  const [tranghientai, settranghientai] = useState(0);
  const [inputSearch, setinputSearch] = useState("");
  const [stateSearch, setstateSearch] = useState(false);

  // Xuất trang hiện tại
  const handleExportCurrentPage = () => {
    const rows = listOrder.map((o) => ({
      ...o,
      thoigian: o.thoigian ? new Date(o.thoigian).toLocaleString('vi-VN') : '',
    }));
    exportToExcel(rows, COLUMNS_DONHANG, 'DonHang_TrangHienTai', 'Dơn Hàng');
  };

  // Xuất tất cả đơn hàng
  const handleExportAll = async () => {
    try {
      setExportLoading(true);
      const trangthai = activeIndex !== 'Tất cả' ? activeIndex : '';
      const keyword = stateSearch ? inputSearch : '';
      // Gọi API không phân trang (page_size lớn)
      const res = await FilterOrder(trangthai, keyword, 1, 9999);
      const rows = (res?.data || []).map((o) => ({
        ...o,
        thoigian: o.thoigian ? new Date(o.thoigian).toLocaleString('vi-VN') : '',
      }));
      exportToExcel(rows, COLUMNS_DONHANG, 'DonHang_TatCa', 'Dơn Hàng');
    } catch (e) {
      console.error(e);
      toast.error('Lỗi xuất Excel!');
    } finally {
      setExportLoading(false);
    }
  };

  const handleClick = async (index) => {
    setActiveIndex(index);
    settranghientai(0);
    setinputSearch('');
    setstateSearch(false);
    try {
      let datafilter;
      if (index !== "Tất cả") {
        datafilter = await FilterOrder(index, "", 1, 10);
      } else {
        datafilter = await GetallOrder(1, 10);
      }
      setlistOrder(datafilter.data || []);
      settongtrang(datafilter.total || 0);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = async (keyword) => {
    settranghientai(0);
    setinputSearch(keyword);
    try {
      const datafilter = await FilterOrder(activeIndex !== "Tất cả" ? activeIndex : "", keyword, 1, 10);
      setlistOrder(datafilter.data || []);
      settongtrang(datafilter.total || 0);
      setstateSearch(true);
    } catch (e) {
      console.error(e);
    }
  };

  const reloadData = async () => {
    try {
      let datafilter;
      if (activeIndex !== "Tất cả") {
        datafilter = await FilterOrder(activeIndex, stateSearch ? inputSearch : "", tranghientai + 1, 10);
      } else {
        datafilter = await GetallOrder(tranghientai + 1, 10);
      }
      setlistOrder(datafilter.data || []);
      settongtrang(datafilter.total || 0);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    document.title = "Quản lý đơn hàng | Kính Mắt Luxury";
    reloadData();
  }, [tranghientai, activeIndex, stateSearch]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePageClick = (event) => {
    settranghientai(event.selected);
  };

  const xacnhan = async () => {
    try {
      await UpdateState("Chờ giao", idorder);
      toast.success("Đã xác nhận đơn hàng thành công!");
      setstateOrder("Chờ giao");
      reloadData();
    } catch (e) {
      toast.error("Lỗi xác nhận đơn hàng.");
    }
  };

  const giaohang = async () => {
    if (!mavandon.trim() || !donviVC.trim() || !ngaygiao.trim()) {
      toast.warn("Vui lòng nhập đầy đủ Ngày giao, Mã vận đơn và Đơn vị vận chuyển!");
      return;
    }
    try {
      const obj = {
        mavandon,
        mahd: idorder,
        donvivanchuyen: donviVC,
        ngaygiao,
        ngaynhan: ngaygiao,
        trangthai: "Đang giao"
      };
      await CreateVanchuyen(obj);
      await UpdateState("Đang giao", idorder);
      toast.success("Đơn hàng đã được chuyển sang trạng thái Đang giao!");
      setstateOrder("Đang giao");
      reloadData();
    } catch (e) {
      toast.error("Lỗi cập nhật giao hàng.");
    }
  };

  const hoanthanh = async () => {
    try {
      const a = vanchuyen?.mavandon || mavandon;
      if (!a) {
        toast.error("Không tìm thấy mã vận đơn.");
        return;
      }
      await UpdateState("Hoàn thành", idorder);
      await Updatevanchuyen(a);
      toast.success("Đơn hàng đã giao thành công và hoàn tất!");
      setstateOrder("Hoàn thành");
      reloadData();
    } catch (error) {
      toast.error("Đã xảy ra lỗi hoàn thành đơn hàng.");
      console.log(error);
    }
  };

  const openOrderDetail = async (itemoder) => {
    try {
      setShowDetail(true);
      setstateOrder(itemoder.trangthai);
      setidorder(itemoder.mahd);
      
      const dataorder = await Getorderbyid(itemoder.mahd);
      setdonhang(dataorder || {});
      
      const dataVC = await Getvanchuyen(itemoder.mahd);
      setvanchuyen(dataVC);
      
      if (dataVC) {
        setmavandon(dataVC.mavandon || "");
        setdonviVC(dataVC.donvivanchuyen || "");
        setngaygiao(dataVC.ngaygiao ? dataVC.ngaygiao.split('T')[0] : "");
      } else {
        const generatedMavandon = `VD${Math.random().toString(36).substring(2, 6).toUpperCase()}${Date.now().toString().slice(-4)}`;
        setmavandon(generatedMavandon);
        setdonviVC("GHTK");
        setngaygiao(new Date().toISOString().split('T')[0]);
      }
    } catch (e) {
      console.error(e);
      toast.error("Không thể lấy chi tiết đơn hàng.");
    }
  };

  if (!mounted) {
    return <div className="p-8 text-center text-gray-400 font-sans">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-8 font-sans text-gray-800">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest mb-1.5">
            <Sparkles className="text-sm" /> Transaction Ledger
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-brand-dark tracking-wide">
            Quản Lý Đơn Hàng
          </h1>
        </div>
        <ExportButton
          label="Xuất Excel"
          loading={exportLoading}
          options={[
            { label: 'Xuất trang hiện tại', onClick: handleExportCurrentPage },
            { label: 'Xuất tất cả đơn hàng', onClick: handleExportAll },
          ]}
        />
      </div>

      {/* Actions and Search Bar */}
      <div className="bg-white border border-gray-150 p-4 rounded-2xl shadow-md space-y-4">
        {/* Search */}
        <div className="relative flex items-center max-w-md w-full">
          <span className="absolute left-4 text-gray-400"><Search className="text-base" /></span>
          <input
            type="text"
            placeholder="Tìm theo mã, tên khách, số điện thoại..."
            className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200 focus:border-brand-gold/60 rounded-xl py-2.5 pl-12 pr-4 text-sm font-medium outline-none transition-all duration-150 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-brand-gold/30"
            onChange={(e) => handleSearch(e.target.value)}
            value={inputSearch}
          />
        </div>

        {/* Horizontal Status Filters */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-150">
          {["Tất cả", "Chờ xác nhận", "Chờ giao", "Đang giao", "Hoàn thành"].map((status) => (
            <button
              key={status}
              onClick={() => handleClick(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer outline-none ${
                activeIndex === status 
                  ? 'bg-brand-gold text-black shadow-md shadow-brand-gold/15'
                  : 'bg-gray-50 border border-gray-200 text-gray-500 hover:text-brand-dark hover:bg-gray-100/50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-md">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-150 bg-gray-50/50 text-gray-500 font-bold uppercase tracking-wider text-xs">
              <th className="p-4 sm:p-5">Mã ĐH</th>
              <th className="p-4 sm:p-5">Khách Hàng</th>
              <th className="p-4 sm:p-5">Số Điện Thoại</th>
              <th className="p-4 sm:p-5">Tổng Tiền</th>
              <th className="p-4 sm:p-5">Trạng Thái</th>
              <th className="p-4 sm:p-5 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-150 font-medium text-gray-700">
            {listOrder.map((itemoder, index) => (
              <tr key={index} className="hover:bg-gray-50/30 transition duration-150">
                <td className="p-4 sm:p-5 text-brand-dark font-bold">#{itemoder.mahd}</td>
                <td className="p-4 sm:p-5 text-brand-dark font-semibold">{itemoder.ten}</td>
                <td className="p-4 sm:p-5 text-gray-500">{itemoder.sdt}</td>
                <td className="p-4 sm:p-5 text-brand-gold font-bold">{(itemoder.tongtien || 0).toLocaleString('vi-VN')} đ</td>
                <td className="p-4 sm:p-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusClass(itemoder.trangthai)}`}>
                    {itemoder.trangthai}
                  </span>
                </td>
                <td className="p-4 sm:p-5 text-right">
                  <button 
                    className="p-2 bg-brand-gold/10 hover:bg-brand-gold/25 text-brand-gold rounded-lg transition-colors cursor-pointer outline-none"
                    onClick={() => openOrderDetail(itemoder)}
                    title="Xem chi tiết"
                  >
                    <Eye className="text-base" />
                  </button>
                </td>
              </tr>
            ))}
            {listOrder.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400 font-sans">
                  Không tìm thấy đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {tongtrang > 1 && (
        <div className="flex justify-center pt-2">
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={tongtrang}
            previousLabel="<"
            renderOnZeroPageCount={null}
            containerClassName="pagination flex items-center gap-1.5 list-none select-none text-xs font-semibold font-heading"
            pageLinkClassName="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:border-brand-gold hover:text-brand-gold transition duration-150"
            previousLinkClassName="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:border-brand-gold hover:text-brand-gold transition duration-150"
            nextLinkClassName="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:border-brand-gold hover:text-brand-gold transition duration-150"
            activeLinkClassName="!border-brand-gold !bg-brand-gold !text-white shadow-md shadow-brand-gold/15"
            forcePage={tranghientai}
          />
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {showDetail && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              className="bg-white border border-gray-200 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-5xl w-full relative z-10 max-h-[90vh] overflow-y-auto space-y-6"
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {/* Close Button */}
              <button 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition duration-150 outline-none cursor-pointer"
                onClick={() => setShowDetail(false)}
                title="Đóng"
              >
                <X className="text-lg" />
              </button>

              {/* Title + Print Button */}
              <div className="flex items-start justify-between pr-8">
                <div>
                  <span className="text-[9px] font-bold tracking-widest text-brand-gold uppercase block mb-1">
                    Order Invoice #{idorder}
                  </span>
                  <h3 className="text-xl font-extrabold font-heading text-brand-dark tracking-wide flex items-center gap-2">
                    Chi Tiết Đơn Hàng
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${getStatusClass(stateOrder)}`}>
                      {stateOrder}
                    </span>
                  </h3>
                </div>
                {/* ⬇ Print Invoice Button */}
                <motion.button
                  onClick={() => setShowInvoice(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#c5a880] to-[#d4b896] text-black font-bold text-xs rounded-xl shadow hover:brightness-105 transition-all cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title="In hóa đơn"
                >
                  <Printer size={14} />
                  In Hóa Đơn
                </motion.button>
              </div>

              {/* 2-Column Details Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-sm">
                
                {/* Left Side: Order Items List */}
                <div className="lg:col-span-7 bg-gray-50/30 border border-gray-150 rounded-2xl overflow-hidden shadow-md p-4 space-y-4">
                  <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingBag className="text-sm" /> Danh sách sản phẩm mua
                  </h4>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-gray-150 pb-2 text-gray-400 font-bold uppercase tracking-wide">
                          <th className="pb-2">STT</th>
                          <th className="pb-2">Ảnh</th>
                          <th className="pb-2">Kính Mắt</th>
                          <th className="pb-2 text-center">SL</th>
                          <th className="pb-2 text-right">Thành Tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-150 font-medium text-gray-700">
                        {parseChitiet(donhang).map((item, idx) => (
                          <tr key={item.masp} className="hover:bg-gray-50/30">
                            <td className="py-3 text-gray-400">{idx + 1}</td>
                            <td className="py-3">
                              <div className="w-12 h-8 rounded bg-white border border-gray-200 flex items-center justify-center">
                                <img src={`http://localhost:5273/images/product/${item.anh}`} alt="" className="h-6 w-auto object-contain" />
                              </div>
                            </td>
                            <td className="py-3 text-brand-dark font-semibold truncate max-w-[120px]">{item.ten}</td>
                            <td className="py-3 text-center">{item.soluong || 0}</td>
                            <td className="py-3 text-right text-brand-gold">{((item.giaban || 0) * (item.soluong || 0)).toLocaleString("vi-VN")} đ</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Side: Customer info & shipping */}
                <div className="lg:col-span-5 bg-gray-50/40 border border-gray-150 rounded-2xl p-6 shadow-md space-y-5">
                  <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-150 pb-2">
                    Thông tin người nhận & Vận chuyển
                  </h4>

                  {/* Customer Card */}
                  <div className="space-y-2.5 text-xs text-gray-600 font-medium pl-1">
                    <p className="flex items-center gap-2"><User className="text-brand-gold text-sm" /> <span>Họ tên: <strong className="text-gray-900">{donhang.ten}</strong></span></p>
                    <p className="flex items-center gap-2"><Phone className="text-brand-gold text-sm" /> <span>SĐT: <strong className="text-gray-900">{donhang.sdt}</strong></span></p>
                    <p className="flex items-center gap-2"><Mail className="text-brand-gold text-sm" /> <span>Email: <strong className="text-gray-900">{donhang.email || 'N/A'}</strong></span></p>
                    <p className="flex items-start gap-2"><MapPin className="text-brand-gold text-sm mt-0.5" /> <span>Địa chỉ: <strong className="text-gray-900 leading-relaxed block">{donhang.diachi}</strong></span></p>
                    <p className="flex items-center gap-2"><Calendar className="text-brand-gold text-sm" /> <span>Ngày đặt: <strong className="text-gray-900">{donhang.thoigian ? new Date(donhang.thoigian).toLocaleString("vi-VN") : 'N/A'}</strong></span></p>
                  </div>

                  <hr className="border-gray-150" />

                  {/* Shipping inputs */}
                  {stateOrder === "Chờ giao" && (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-brand-gold uppercase tracking-wider">
                        <Truck className="text-xs" /> Nhập thông tin giao hàng
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ngày gửi giao hàng</label>
                        <input type="date" value={ngaygiao} onChange={(e) => setngaygiao(e.target.value)} className="w-full bg-white hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand-gold/60 rounded-xl py-2 px-3 text-xs outline-none transition-all duration-150 text-gray-900 cursor-pointer" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Mã vận đơn</label>
                        <input type="text" placeholder="Mã vận đơn nhà vận chuyển" value={mavandon} onChange={(e) => setmavandon(e.target.value)} className="w-full bg-white hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand-gold/60 rounded-xl py-2 px-3 text-xs outline-none transition-all duration-150 text-gray-900" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Đơn vị vận chuyển</label>
                        <input type="text" placeholder="Ví dụ: GHTK, Viettel Post" value={donviVC} onChange={(e) => setdonviVC(e.target.value)} className="w-full bg-white hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand-gold/60 rounded-xl py-2 px-3 text-xs outline-none transition-all duration-150 text-gray-900" />
                      </div>
                    </div>
                  )}

                  {(stateOrder === "Đang giao" || stateOrder === "Hoàn thành") && vanchuyen && (
                    <div className="space-y-2.5 text-xs font-semibold pl-1 text-gray-600">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-brand-gold uppercase tracking-wider mb-1">
                        <Truck className="text-xs" /> Thông tin vận chuyển
                      </div>
                      <p>Ngày giao: <span className="text-gray-900">{vanchuyen.ngaygiao ? new Date(vanchuyen.ngaygiao).toLocaleDateString("vi-VN") : 'N/A'}</span></p>
                      <p>Mã vận đơn: <span className="text-gray-900 tracking-widest font-mono bg-gray-100 border border-gray-250 rounded px-2 py-0.5 inline-block">{vanchuyen.mavandon}</span></p>
                      <p>Đơn vị vận chuyển: <span className="text-gray-900">{vanchuyen.donvivanchuyen}</span></p>
                    </div>
                  )}

                  <hr className="border-gray-150" />

                  {/* Summary Pricing */}
                  <div className="space-y-2 text-xs font-semibold text-gray-500 pl-1">
                    <div className="flex justify-between">
                      <span>Tạm tính (Giá gốc):</span>
                      <span className="text-gray-600">{(parseChitiet(donhang).reduce((acc, item) => acc + (item.giaban || 0) * (item.soluong || 0), 0)).toLocaleString("vi-VN")} đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Giảm giá:</span>
                      <span className="text-red-500">-{((donhang?.tien_giam || 0)).toLocaleString("vi-VN")} đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí vận chuyển:</span>
                      <span className="text-gray-600">30.000 đ</span>
                    </div>
                    <div className="flex justify-between items-end pt-2 mt-1 border-t border-gray-150">
                      <span className="text-sm font-bold text-gray-800">Tổng thanh toán:</span>
                      <span className="text-base font-extrabold text-brand-gold">
                        {(Math.max(0, parseChitiet(donhang).reduce((acc, item) => acc + (item.giaban || 0) * (item.soluong || 0), 0) - (donhang?.tien_giam || 0)) + 30000).toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  </div>

                  {/* Process Action Buttons */}
                  <div className="pt-2">
                    {stateOrder === 'Chờ xác nhận' && (
                      <motion.button className="w-full py-3.5 rounded-xl text-black font-heading font-bold text-xs tracking-widest bg-gradient-to-r from-brand-gold via-[#e8d7c0] to-brand-gold-hover hover:brightness-110 active:brightness-95 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/15" onClick={xacnhan} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <CircleCheck className="text-sm font-bold" />
                        <span>XÁC NHẬN ĐƠN HÀNG</span>
                      </motion.button>
                    )}
                    {stateOrder === 'Chờ giao' && (
                      <motion.button className="w-full py-3.5 rounded-xl text-black font-heading font-bold text-xs tracking-widest bg-gradient-to-r from-brand-gold via-[#e8d7c0] to-brand-gold-hover hover:brightness-110 active:brightness-95 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/15" onClick={giaohang} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Truck className="text-sm font-bold" />
                        <span>BẮT ĐẦU GIAO HÀNG</span>
                      </motion.button>
                    )}
                    {stateOrder === 'Đang giao' && (
                      <motion.button className="w-full py-3.5 rounded-xl text-black font-heading font-bold text-xs tracking-widest bg-gradient-to-r from-brand-gold via-[#e8d7c0] to-brand-gold-hover hover:brightness-110 active:brightness-95 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/15" onClick={hoanthanh} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <CircleCheck className="text-sm font-bold" />
                        <span>HOÀN THÀNH ĐƠN HÀNG</span>
                      </motion.button>
                    )}
                    {(stateOrder === 'Đang giao' || stateOrder === 'Hoàn thành') && (
                      <motion.button 
                        className="w-full mt-2 py-3 rounded-xl text-white font-heading font-bold text-xs tracking-widest bg-emerald-600 hover:bg-emerald-700 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-600/15" 
                        onClick={async () => {
                          const nguoixuat = prompt("Nhập tên người thực hiện xuất kho:", "Nguyễn Văn Thủ Kho");
                          if (!nguoixuat) return;
                          const ghichu = prompt("Nhập ghi chú xuất kho (nếu có):", "Xuất bán theo đơn hàng #" + idorder);
                          try {
                            await createHoadonXuatFromDonhang({ mahd: idorder, nguoixuat, ghichu });
                            toast.success("Đã lập hóa đơn xuất kho và cập nhật số lượng tồn kho thành công!");
                          } catch (err) {
                            toast.error("Lập hóa đơn xuất thất bại. Đơn hàng này có thể đã được xuất kho trước đó!");
                          }
                        }} 
                        whileHover={{ scale: 1.01 }} 
                        whileTap={{ scale: 0.99 }}
                      >
                        <FileText className="text-xs font-bold" />
                        <span>LẬP HĐ XUẤT KHO</span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invoice Print Modal */}
      <AnimatePresence>
        {showInvoice && (
          <InvoicePrint
            donhang={donhang}
            stateOrder={stateOrder}
            idorder={idorder}
            vanchuyen={vanchuyen}
            onClose={() => setShowInvoice(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
