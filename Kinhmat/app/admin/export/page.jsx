'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageCheck, ShoppingBag, Eye, FileText, CheckCircle2, User, Phone, MapPin, Calendar, Clock, ArrowRight, X, Printer } from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  getAllHoadonXuat, 
  getHoadonXuatChitiet, 
  createHoadonXuatFromDonhang 
} from '../../../services/admin/invoice';
import { FilterOrder, GetallOrder } from '../../../services/admin/order';
import ExportButton from '../../../components/admin/ExportButton';
import { exportToExcel } from '../../../utils/exportExcel';
import { COLUMNS_HOADON_XUAT } from '../../../utils/exportConfigs';

const fmt = (v) => Number(v || 0).toLocaleString('vi-VN') + ' đ';

export default function ExportPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('invoices'); // 'invoices' or 'pending-orders'
  const [invoices, setInvoices] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleExport = () => {
    const rows = invoices.map((inv) => ({
      mahdx: inv.mahdx,
      mahd: inv.mahd,
      nguoixuat: inv.nguoixuat || '',
      ngayxuat: inv.ngayxuat ? new Date(inv.ngayxuat).toLocaleDateString('vi-VN') : '',
      tongtien: inv.tongtien || 0,
      ghichu: inv.ghichu || '',
    }));
    exportToExcel(rows, COLUMNS_HOADON_XUAT, 'HoadonXuatKho', 'Hóa Đơn Xuất Kho');
  };

  // Modals
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Selected state
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form, setForm] = useState({
    nguoixuat: '',
    ghichu: ''
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'invoices') {
        const invs = await getAllHoadonXuat();
        setInvoices(invs || []);
      } else {
        // Fetch orders that are ready for invoice generation (status is 'Chờ giao', 'Đang giao', 'Hoàn thành')
        const ordersRes = await FilterOrder('Chờ giao', '', 1, 100);
        const ordersRes2 = await FilterOrder('Đang giao', '', 1, 100);
        const ordersRes3 = await FilterOrder('Hoàn thành', '', 1, 100);
        
        const allPending = [
          ...(ordersRes?.data || ordersRes || []),
          ...(ordersRes2?.data || ordersRes2 || []),
          ...(ordersRes3?.data || ordersRes3 || [])
        ];
        
        // Remove duplicate order IDs if any
        const uniquePending = [];
        const seenIds = new Set();
        for (const o of allPending) {
          if (!seenIds.has(o.mahd)) {
            seenIds.add(o.mahd);
            uniquePending.push(o);
          }
        }
        setPendingOrders(uniquePending);
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi tải dữ liệu. Vui lòng kiểm tra API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    document.title = 'Admin - Quản lý Xuất kho';
    loadData();
  }, [activeTab]);

  const handleOpenDetail = async (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
    setDetailsLoading(true);
    try {
      const details = await getHoadonXuatChitiet(invoice.mahdx);
      setInvoiceDetails(details || []);
    } catch {
      toast.error('Không thể tải chi tiết hóa đơn xuất kho');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleOpenCreateModal = (order) => {
    setSelectedOrder(order);
    setShowCreateModal(true);
    setForm({ nguoixuat: '', ghichu: '' });
  };

  const handleCreateInvoice = async () => {
    if (!form.nguoixuat.trim()) {
      return toast.warn('Vui lòng nhập tên người thực hiện xuất kho!');
    }
    setSaving(true);
    try {
      const payload = {
        mahd: selectedOrder.mahd,
        nguoixuat: form.nguoixuat,
        ghichu: form.ghichu
      };
      await createHoadonXuatFromDonhang(payload);
      toast.success(`Tạo hóa đơn xuất kho cho đơn hàng #${selectedOrder.mahd} thành công! Kho đã được cập nhật.`);
      setShowCreateModal(false);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error('Đơn hàng này đã có hóa đơn xuất hoặc xảy ra lỗi.');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!mounted) {
    return <div className="p-8 text-center text-gray-400 font-sans">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6 font-sans text-gray-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest mb-1">
            <PackageCheck className="w-3.5 h-3.5" /> Quản lý xuất kho & doanh thu
          </div>
          <h1 className="text-2xl font-extrabold font-heading text-brand-dark tracking-wide">
            Hóa Đơn Xuất Kho
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Quản lý hóa đơn bán lẻ đã xuất kho cho khách hàng, trừ số lượng tồn kho tự động.
          </p>
        </div>
        {activeTab === 'invoices' && (
          <ExportButton
            label="Xuất Excel"
            options={[{ label: 'Xuất danh sách phiếu xuất kho', onClick: handleExport }]}
          />
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-3 text-sm font-bold uppercase tracking-wider relative transition ${
            activeTab === 'invoices' ? 'text-brand-dark' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Lịch sử xuất kho
          {activeTab === 'invoices' && (
            <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-gold rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('pending-orders')}
          className={`pb-3 text-sm font-bold uppercase tracking-wider relative transition ${
            activeTab === 'pending-orders' ? 'text-brand-dark' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Đơn hàng chờ lập HĐ xuất
          {activeTab === 'pending-orders' && (
            <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-gold rounded-full" />
          )}
        </button>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {activeTab === 'invoices' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Mã HĐ', 'Mã Đơn Hàng', 'Khách hàng', 'Người xuất', 'Ngày xuất', 'Tổng tiền', 'Thao tác'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400 font-medium">Đang tải danh sách hóa đơn xuất...</td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400 font-medium">Chưa có hóa đơn xuất nào được tạo.</td>
                  </tr>
                ) : (
                  invoices.map((inv, idx) => (
                    <motion.tr 
                      key={inv.mahdx} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ delay: idx * 0.02 }}
                      className="hover:bg-gray-50/60 transition"
                    >
                      <td className="px-5 py-4 font-bold text-brand-dark">#{inv.mahdx}</td>
                      <td className="px-5 py-4 font-bold text-gray-500">#{inv.mahd}</td>
                      <td className="px-5 py-4 font-semibold text-gray-800">{inv.tenkhachhang || `Khách hàng #${inv.iduser}`}</td>
                      <td className="px-5 py-4 text-gray-600 font-medium">{inv.nguoixuat}</td>
                      <td className="px-5 py-4 text-gray-500 text-xs">{new Date(inv.ngayxuat).toLocaleDateString('vi-VN')}</td>
                      <td className="px-5 py-4 font-bold text-brand-gold">{fmt(inv.tongtien)}</td>
                      <td className="px-5 py-4">
                        <button 
                          onClick={() => handleOpenDetail(inv)}
                          className="flex items-center gap-1.5 text-xs text-brand-gold font-bold hover:underline"
                        >
                          <Eye className="w-4 h-4" /> Chi tiết & In
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Mã đơn', 'Khách hàng', 'Số điện thoại', 'Ngày đặt', 'Tổng đơn hàng', 'Trạng thái đơn', 'Thao tác'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400 font-medium">Đang tải đơn hàng...</td>
                  </tr>
                ) : pendingOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400 font-medium">Không có đơn hàng nào chờ lập hóa đơn xuất.</td>
                  </tr>
                ) : (
                  pendingOrders.map((ord, idx) => (
                    <motion.tr 
                      key={ord.mahd} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ delay: idx * 0.02 }}
                      className="hover:bg-gray-50/60 transition"
                    >
                      <td className="px-5 py-4 font-bold text-brand-dark">#{ord.mahd}</td>
                      <td className="px-5 py-4 font-semibold text-gray-800">{ord.ten}</td>
                      <td className="px-5 py-4 text-gray-500 font-medium">{ord.sdt}</td>
                      <td className="px-5 py-4 text-gray-500 text-xs">{ord.thoigian ? new Date(ord.thoigian).toLocaleDateString('vi-VN') : 'N/A'}</td>
                      <td className="px-5 py-4 font-bold text-brand-gold">{fmt(ord.tongtien)}</td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-250">
                          {ord.trangthai}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button 
                          onClick={() => handleOpenCreateModal(ord)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-brand-gold hover:bg-brand-gold-hover text-black text-xs font-bold rounded-lg transition"
                        >
                          Lập HĐ xuất <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Lập HĐ Xuất Từ Đơn Hàng */}
      <AnimatePresence>
        {showCreateModal && selectedOrder && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative border border-gray-150"
              initial={{ scale: 0.95 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.95 }}
            >
              <button 
                onClick={() => setShowCreateModal(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer outline-none"
              >
                <X />
              </button>

              <div className="border-b border-gray-150 pb-4 mb-4">
                <h3 className="text-base font-extrabold text-brand-dark flex items-center gap-2">
                  <FileText className="text-brand-gold" /> Lập Hóa Đơn Xuất Kho
                </h3>
                <p className="text-xs text-gray-400 mt-1">Xuất kho cho Đơn hàng #{selectedOrder.mahd}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-xs space-y-1.5 font-medium text-gray-600">
                  <p>Khách hàng: <strong className="text-gray-800">{selectedOrder.ten}</strong></p>
                  <p>Số điện thoại: <strong className="text-gray-800">{selectedOrder.sdt}</strong></p>
                  <p>Địa chỉ nhận: <strong className="text-gray-800 leading-normal">{selectedOrder.diachi}</strong></p>
                  <p>Tổng giá trị đơn: <strong className="text-brand-gold font-bold">{fmt(selectedOrder.tongtien)}</strong></p>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase mb-1.5 block">Người thực hiện xuất kho</label>
                  <input 
                    type="text" 
                    placeholder="VD: Nguyễn Văn Thủ Kho"
                    value={form.nguoixuat} 
                    onChange={e => setForm(f => ({ ...f, nguoixuat: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase mb-1.5 block">Ghi chú</label>
                  <input 
                    type="text" 
                    placeholder="VD: Khách hàng mua trực tiếp, gửi chuyển phát nhanh..."
                    value={form.ghichu} 
                    onChange={e => setForm(f => ({ ...f, ghichu: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 transition"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={handleCreateInvoice}
                  disabled={saving}
                  className="flex-1 bg-brand-gold hover:bg-brand-gold-hover text-white py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-60"
                >
                  {saving ? 'Đang xuất kho...' : 'Xác nhận xuất'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Chi tiết Phiếu Xuất (Printable) */}
      <AnimatePresence>
        {showDetailModal && selectedInvoice && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            {/* Action Bar inside modal but hidden on print */}
            <div className="print:hidden fixed top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-black font-bold text-xs rounded-xl shadow-lg hover:brightness-105 transition"
              >
                <Printer size={15} /> In Hóa Đơn Xuất
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-semibold text-xs rounded-xl shadow hover:bg-gray-50 transition"
              >
                Đóng
              </button>
            </div>

            {/* Printable Invoice Container */}
            <div 
              id="invoice-print-content"
              className="bg-white w-full max-w-[800px] mt-16 print:mt-0 rounded-2xl print:rounded-none shadow-2xl print:shadow-none overflow-hidden text-gray-800 font-sans border border-gray-100"
            >
              {/* Invoice Header */}
              <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2a26] text-white px-10 py-8 print:px-8 print:py-6 rounded-t-2xl print:rounded-none">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center">
                        <span className="text-black font-black text-sm">K</span>
                      </div>
                      <span className="text-brand-gold font-black text-lg tracking-widest uppercase">Kính Mắt Luxury</span>
                    </div>
                    <p className="text-gray-400 text-xs">Mô hình cửa hàng kính mắt thông minh cao cấp</p>
                    <p className="text-gray-500 text-[10px] mt-0.5">Địa chỉ: 123 Đường lớn, TP. Hồ Chí Minh</p>
                  </div>
                  <div className="text-right">
                    <span className="text-brand-gold text-xs font-black uppercase tracking-widest block">HÓA ĐƠN XUẤT KHO</span>
                    <strong className="text-white text-2xl font-black block mt-1">#HDX-{selectedInvoice.mahdx}</strong>
                    <span className="text-gray-400 text-xs block mt-1">Đơn đặt hàng: #{selectedInvoice.mahd}</span>
                    <span className="text-gray-400 text-xs block">
                      Ngày xuất: {new Date(selectedInvoice.ngayxuat).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-10 py-8 print:px-8 print:py-6 space-y-6">
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-8 text-xs font-medium text-gray-600 border-b border-gray-150 pb-5">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-brand-gold uppercase tracking-wider block mb-1">Thông tin khách hàng</span>
                    <p>Họ tên: <strong className="text-gray-900">{selectedInvoice.tenkhachhang || `Khách hàng #${selectedInvoice.iduser}`}</strong></p>
                    <p>Số điện thoại: <strong className="text-gray-900">{selectedInvoice.sdt || 'N/A'}</strong></p>
                    <p>Địa chỉ giao nhận: <strong className="text-gray-900 leading-relaxed block mt-0.5">{selectedInvoice.diachi || 'N/A'}</strong></p>
                  </div>
                  <div className="space-y-1.5 text-right sm:text-left sm:pl-8">
                    <span className="text-[10px] font-black text-brand-gold uppercase tracking-wider block mb-1">Chứng từ xuất kho</span>
                    <p>Người thực hiện xuất: <strong className="text-gray-900">{selectedInvoice.nguoixuat}</strong></p>
                    <p>Ghi chú xuất kho: <strong className="text-gray-900 italic">{selectedInvoice.ghichu || 'Không có'}</strong></p>
                    <p>Trạng thái chứng từ: <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">Đã xuất & trừ kho</span></p>
                  </div>
                </div>

                {/* Products Table */}
                <div>
                  <span className="text-[10px] font-black text-brand-gold uppercase tracking-wider block mb-3">Danh sách sản phẩm xuất kho</span>
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b-2 border-gray-200">
                        <th className="py-2.5 px-3 text-gray-500 font-bold uppercase tracking-wider">STT</th>
                        <th className="py-2.5 px-3 text-gray-500 font-bold uppercase tracking-wider">Sản phẩm</th>
                        <th className="py-2.5 px-3 text-center text-gray-500 font-bold uppercase tracking-wider">SL</th>
                        <th className="py-2.5 px-3 text-right text-gray-500 font-bold uppercase tracking-wider">Đơn giá bán</th>
                        <th className="py-2.5 px-3 text-right text-gray-500 font-bold uppercase tracking-wider">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {detailsLoading ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-gray-400">Đang tải sản phẩm xuất kho...</td>
                        </tr>
                      ) : invoiceDetails.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-gray-400">Không có dòng chi tiết hàng hóa nào.</td>
                        </tr>
                      ) : (
                        invoiceDetails.map((det, idx) => (
                          <tr key={det.macthdx} className="hover:bg-gray-50/30">
                            <td className="py-3 px-3 text-gray-400">{idx + 1}</td>
                            <td className="py-3 px-3">
                              <p className="font-bold text-gray-900">{det.tensp || `Kính mắt #${det.masp}`}</p>
                              <span className="text-[10px] text-gray-400 block font-normal">Mã hàng: #{det.masp}</span>
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-gray-800">{det.soluong}</td>
                            <td className="py-3 px-3 text-right text-gray-600">{fmt(det.giaban)}</td>
                            <td className="py-3 px-3 text-right font-bold text-brand-gold">{fmt(det.soluong * det.giaban)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer Totals */}
                <div className="flex justify-end pt-4">
                  <div className="w-72 space-y-2 text-xs font-semibold text-gray-600">
                    <div className="flex justify-between">
                      <span>Tổng tiền hàng:</span>
                      <strong className="text-gray-800">{fmt(selectedInvoice.tongtien)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Thuế VAT (0%):</span>
                      <strong className="text-gray-800">0 đ</strong>
                    </div>
                    <div className="border-t-2 border-gray-200 pt-2 flex justify-between items-center text-sm font-extrabold">
                      <span className="text-gray-900 uppercase">TỔNG THANH TOÁN:</span>
                      <span className="text-brand-gold text-lg font-black">{fmt(selectedInvoice.tongtien)}</span>
                    </div>
                  </div>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 text-center pt-8 pb-4 text-xs font-medium text-gray-600 print:pt-12">
                  <div className="space-y-16">
                    <p className="font-bold uppercase tracking-wider text-gray-500">Khách hàng nhận hàng</p>
                    <p className="italic text-gray-400">(Ký và ghi rõ họ tên)</p>
                  </div>
                  <div className="space-y-16">
                    <p className="font-bold uppercase tracking-wider text-gray-500">Người lập hóa đơn xuất</p>
                    <p className="font-black text-gray-900">{selectedInvoice.nguoixuat}</p>
                  </div>
                </div>

                {/* Thank you */}
                <div className="border-t border-dashed border-gray-200 pt-6 text-center text-xs text-gray-400">
                  <p>Hóa đơn điện tử được kết xuất từ hệ thống Kính Mắt Luxury · {new Date().toLocaleString('vi-VN')}</p>
                </div>
              </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                body * { visibility: hidden; }
                #invoice-print-content, #invoice-print-content * { visibility: visible; }
                #invoice-print-content { position: fixed; left: 0; top: 0; width: 100%; border: none; box-shadow: none; margin: 0; }
              }
            ` }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
