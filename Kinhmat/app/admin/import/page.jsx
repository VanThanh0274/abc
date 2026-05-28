'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Plus, X, Eye, FileText, CheckCircle2, AlertCircle, Trash2, ShieldCheck, CornerDownRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  getAllHoadonNhap, 
  getHoadonNhapChitiet, 
  createHoadonNhap, 
  confirmHoadonNhap, 
  getAllSuppliers 
} from '../../../services/admin/invoice';
import { GetallProduct } from '../../../services/admin/product';
import ExportButton from '../../../components/admin/ExportButton';
import { exportToExcel } from '../../../utils/exportExcel';
import { COLUMNS_HOADON_NHAP } from '../../../utils/exportConfigs';

const fmt = (v) => Number(v || 0).toLocaleString('vi-VN') + ' đ';

export default function ImportPage() {
  const [mounted, setMounted] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleExport = () => {
    const rows = invoices.map((inv) => ({
      mahdn: inv.mahdn,
      nhacungcap: inv.tenncc || `NCC #${inv.mancc}`,
      nguoinhan: inv.nguoinhap || '',
      ngaynhap: inv.ngaynhap ? new Date(inv.ngaynhap).toLocaleDateString('vi-VN') : '',
      tongtien: inv.tongtien || 0,
      trangthai: inv.trangthai === 1 ? 'Đã nhập kho' : 'Chờ duyệt',
      ghichu: inv.ghichu || '',
    }));
    exportToExcel(rows, COLUMNS_HOADON_NHAP, 'HoadonNhapKho', 'Hóa Đơn Nhập Kho');
  };
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Selected Invoice & Details
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // New Invoice Form
  const [form, setForm] = useState({
    mancc: '',
    nguoinhap: '',
    ghichu: '',
    items: [] // { masp, tensp, soluong, gianhap }
  });
  
  // Temp item inputs
  const [tempItem, setTempItem] = useState({
    masp: '',
    soluong: '',
    gianhap: ''
  });

  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [invRes, supRes, prodRes] = await Promise.all([
        getAllHoadonNhap(),
        getAllSuppliers(),
        GetallProduct(1, 1000)
      ]);
      setInvoices(invRes || []);
      setSuppliers(supRes?.filter(s => s.trangthai === 1) || []);
      setProducts(prodRes?.data || prodRes || []);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi tải dữ liệu. Vui lòng kiểm tra kết nối API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    document.title = 'Admin - Quản lý Nhập kho';
    loadData();
  }, []);

  const handleOpenDetail = async (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
    setDetailsLoading(true);
    try {
      const details = await getHoadonNhapChitiet(invoice.mahdn);
      setInvoiceDetails(details || []);
    } catch {
      toast.error('Không thể tải chi tiết hóa đơn');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleConfirmInvoice = async (mahdn) => {
    if (!window.confirm('Xác nhận duyệt nhập kho? Hành động này sẽ cộng trực tiếp sản phẩm vào tồn kho hệ thống và không thể hoàn tác.')) return;
    try {
      await confirmHoadonNhap(mahdn);
      toast.success('Duyệt nhập kho thành công! Số lượng tồn kho sản phẩm đã được cập nhật.');
      setShowDetailModal(false);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error('Lỗi duyệt hóa đơn nhập');
    }
  };

  const addTempItem = () => {
    if (!tempItem.masp || !tempItem.soluong || !tempItem.gianhap) {
      return toast.warn('Vui lòng điền đủ Sản phẩm, Số lượng và Giá nhập!');
    }
    if (tempItem.soluong <= 0 || tempItem.gianhap <= 0) {
      return toast.warn('Số lượng và Giá nhập phải lớn hơn 0!');
    }

    // Check if duplicate
    if (form.items.some(x => x.masp === +tempItem.masp)) {
      return toast.warn('Sản phẩm này đã có trong danh sách nhập!');
    }

    const prod = products.find(p => p.id === +tempItem.masp);
    const newItem = {
      masp: +tempItem.masp,
      tensp: prod ? prod.ten : `SP #${tempItem.masp}`,
      soluong: +tempItem.soluong,
      gianhap: +tempItem.gianhap
    };

    setForm(f => ({
      ...f,
      items: [...f.items, newItem]
    }));

    setTempItem({
      masp: '',
      soluong: '',
      gianhap: ''
    });
  };

  const removeFormItem = (masp) => {
    setForm(f => ({
      ...f,
      items: f.items.filter(x => x.masp !== masp)
    }));
  };

  const handleSaveInvoice = async () => {
    if (!form.mancc || !form.nguoinhap) {
      return toast.warn('Vui lòng chọn nhà cung cấp và nhập tên người lập phiếu!');
    }
    if (form.items.length === 0) {
      return toast.warn('Vui lòng thêm ít nhất một sản phẩm nhập kho!');
    }

    setSaving(true);
    try {
      const submitData = {
        mancc: +form.mancc,
        nguoinhap: form.nguoinhap,
        ghichu: form.ghichu,
        trangthai: 0, // 0 = Nháp / Chờ duyệt
        chitiet: form.items.map(it => ({
          masp: it.masp,
          soluong: it.soluong,
          gianhap: it.gianhap
        }))
      };

      await createHoadonNhap(submitData);
      toast.success('Lập phiếu nhập kho thành công! Trạng thái: Chờ duyệt.');
      setShowCreateModal(false);
      setForm({ mancc: '', nguoinhap: '', ghichu: '', items: [] });
      loadData();
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi lưu phiếu nhập kho.');
    } finally {
      setSaving(false);
    }
  };

  const getInvoiceTotal = () => {
    return form.items.reduce((sum, item) => sum + (item.soluong * item.gianhap), 0);
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
            <Truck className="w-3.5 h-3.5" /> Quản lý kho hàng
          </div>
          <h1 className="text-2xl font-extrabold font-heading text-brand-dark tracking-wide">
            Hóa Đơn Nhập Kho
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Quản lý và lập phiếu nhập kho từ nhà cung cấp, phê duyệt để tự động cập nhật số lượng tồn kho.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold-hover text-white text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-md shadow-brand-gold/10"
        >
          <Plus className="w-4 h-4" /> Lập phiếu nhập
        </button>
        <ExportButton
          label="Xuất Excel"
          options={[{ label: 'Xuất danh sách phiếu nhập', onClick: handleExport }]}
        />
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Mã phiếu', 'Nhà cung cấp', 'Người lập', 'Ngày nhập', 'Tổng tiền', 'Trạng thái', 'Thao tác'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400 font-medium">Đang tải danh sách phiếu nhập...</td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400 font-medium">Chưa có phiếu nhập kho nào. Hãy tạo phiếu nhập đầu tiên.</td>
                </tr>
              ) : (
                invoices.map((inv, idx) => (
                  <motion.tr 
                    key={inv.mahdn} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: idx * 0.02 }}
                    className="hover:bg-gray-50/60 transition"
                  >
                    <td className="px-5 py-4 font-bold text-brand-dark">#{inv.mahdn}</td>
                    <td className="px-5 py-4 font-semibold text-gray-800">{inv.tenncc || `NCC #${inv.mancc}`}</td>
                    <td className="px-5 py-4 text-gray-600 font-medium">{inv.nguoinhap}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{new Date(inv.ngaynhap).toLocaleDateString('vi-VN')}</td>
                    <td className="px-5 py-4 font-bold text-brand-gold">{fmt(inv.tongtien)}</td>
                    <td className="px-5 py-4">
                      {inv.trangthai === 1 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" /> Đã nhập kho
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 uppercase tracking-wider">
                          <AlertCircle className="w-3 h-3" /> Chờ duyệt
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleOpenDetail(inv)}
                          className="flex items-center gap-1.5 text-xs text-brand-gold font-bold hover:underline"
                        >
                          <Eye className="w-4 h-4" /> Chi tiết
                        </button>
                        {inv.trangthai === 0 && (
                          <button 
                            onClick={() => handleConfirmInvoice(inv.mahdn)}
                            className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-lg border border-emerald-250 hover:bg-emerald-100 transition"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" /> Duyệt
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Lập Phiếu Nhập */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 relative border border-gray-100"
              initial={{ scale: 0.95, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 15 }}
            >
              <button 
                onClick={() => setShowCreateModal(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer outline-none"
              >
                <X />
              </button>

              <div className="border-b border-gray-150 pb-4">
                <h2 className="text-xl font-extrabold font-heading text-brand-dark flex items-center gap-2">
                  <FileText className="text-brand-gold" /> Lập Phiếu Nhập Kho Mới
                </h2>
                <p className="text-xs text-gray-500 mt-1">Trạng thái mặc định: Chờ duyệt. Cần Admin xác nhận để hoàn tất nhập kho.</p>
              </div>

              {/* Form Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase mb-1.5 block">Nhà cung cấp</label>
                  <select 
                    value={form.mancc} 
                    onChange={e => setForm(f => ({ ...f, mancc: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold outline-none"
                  >
                    <option value="">-- Chọn Nhà cung cấp --</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.tenncc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase mb-1.5 block">Người lập phiếu</label>
                  <input 
                    type="text" 
                    placeholder="Tên người nhập kho"
                    value={form.nguoinhap} 
                    onChange={e => setForm(f => ({ ...f, nguoinhap: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase mb-1.5 block">Ghi chú</label>
                  <input 
                    type="text" 
                    placeholder="Lý do nhập kho, số chứng từ..."
                    value={form.ghichu} 
                    onChange={e => setForm(f => ({ ...f, ghichu: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold outline-none"
                  />
                </div>
              </div>

              {/* Add item interface */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-150 space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-gold uppercase tracking-wider">
                  <CornerDownRight className="w-4 h-4" /> Thêm sản phẩm nhập
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-6">
                    <label className="text-[10px] font-black text-gray-500 uppercase mb-1.5 block">Chọn sản phẩm</label>
                    <select 
                      value={tempItem.masp} 
                      onChange={e => setTempItem(t => ({ ...t, masp: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-brand-gold"
                    >
                      <option value="">-- Chọn sản phẩm kính mắt --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.ten} (Hiện tại: {p.soluong || 0} cái)</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase mb-1.5 block">Số lượng</label>
                    <input 
                      type="number" 
                      placeholder="VD: 50"
                      value={tempItem.soluong} 
                      onChange={e => setTempItem(t => ({ ...t, soluong: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase mb-1.5 block">Giá nhập (VNĐ)</label>
                    <input 
                      type="number" 
                      placeholder="VD: 350000"
                      value={tempItem.gianhap} 
                      onChange={e => setTempItem(t => ({ ...t, gianhap: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button 
                      type="button"
                      onClick={addTempItem}
                      className="w-full py-2 bg-brand-gold hover:bg-brand-gold-hover text-white text-xs font-bold rounded-xl transition"
                    >
                      Thêm hàng
                    </button>
                  </div>
                </div>
              </div>

              {/* Items List Table */}
              <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b border-gray-150">
                    <tr>
                      {['Mã SP', 'Sản phẩm kính mắt', 'Số lượng nhập', 'Đơn giá nhập', 'Thành tiền', 'Xóa'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {form.items.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-400 font-medium">Chưa có sản phẩm nào trong danh sách nhập kho.</td>
                      </tr>
                    ) : (
                      form.items.map(item => (
                        <tr key={item.masp} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-semibold text-gray-500">#{item.masp}</td>
                          <td className="px-4 py-3 font-bold text-brand-dark">{item.tensp}</td>
                          <td className="px-4 py-3 font-semibold text-gray-800">{item.soluong}</td>
                          <td className="px-4 py-3 font-medium text-gray-600">{fmt(item.gianhap)}</td>
                          <td className="px-4 py-3 font-bold text-brand-gold">{fmt(item.soluong * item.gianhap)}</td>
                          <td className="px-4 py-3">
                            <button 
                              onClick={() => removeFormItem(item.masp)}
                              className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals & Submit */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-150 pt-5 gap-4">
                <div className="text-right sm:text-left">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Tổng cộng giá trị phiếu nhập</span>
                  <span className="text-xl font-extrabold text-brand-gold">{fmt(getInvoiceTotal())}</span>
                </div>
                <div className="flex gap-3 justify-end">
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="border border-gray-250 hover:bg-gray-50 text-gray-600 px-5 py-2.5 rounded-xl text-xs font-bold transition"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    onClick={handleSaveInvoice}
                    disabled={saving}
                    className="bg-brand-gold hover:bg-brand-gold-hover text-white px-6 py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-60"
                  >
                    {saving ? 'Đang lưu...' : 'Lưu phiếu nhập'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Chi tiết Phiếu Nhập */}
      <AnimatePresence>
        {showDetailModal && selectedInvoice && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 relative border border-gray-100"
              initial={{ scale: 0.95, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 15 }}
            >
              <button 
                onClick={() => setShowDetailModal(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer outline-none"
              >
                <X />
              </button>

              <div>
                <span className="text-[10px] font-bold tracking-widest text-brand-gold uppercase block">Import Ledger Details</span>
                <h3 className="text-lg font-extrabold font-heading text-brand-dark flex items-center gap-2 mt-0.5">
                  Chi Tiết Phiếu Nhập Kho #{selectedInvoice.mahdn}
                  {selectedInvoice.trangthai === 1 ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-700 uppercase">Đã nhập kho</span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-700 uppercase">Chờ duyệt</span>
                  )}
                </h3>
              </div>

              {/* Info Columns */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <span className="text-gray-400 block font-semibold mb-0.5">Nhà cung cấp:</span>
                  <strong className="text-gray-900 font-bold">{selectedInvoice.tenncc || `NCC #${selectedInvoice.mancc}`}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold mb-0.5">Người lập phiếu:</span>
                  <strong className="text-gray-900 font-bold">{selectedInvoice.nguoinhap}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold mb-0.5">Ngày nhập:</span>
                  <strong className="text-gray-950 font-bold">{new Date(selectedInvoice.ngaynhap).toLocaleDateString('vi-VN')}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold mb-0.5">Ghi chú:</span>
                  <strong className="text-gray-900 font-bold italic">{selectedInvoice.ghichu || 'Không có'}</strong>
                </div>
              </div>

              {/* Details table */}
              <div className="border border-gray-150 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b border-gray-150">
                    <tr>
                      {['STT', 'Ảnh', 'Sản phẩm kính mắt', 'Số lượng', 'Đơn giá nhập', 'Thành tiền'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {detailsLoading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-400">Đang tải chi tiết phiếu nhập...</td>
                      </tr>
                    ) : invoiceDetails.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-400">Phiếu nhập này không có chi tiết hàng hóa.</td>
                      </tr>
                    ) : (
                      invoiceDetails.map((det, index) => (
                        <tr key={det.macthdn} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                          <td className="px-4 py-3">
                            <div className="w-12 h-8 rounded bg-white border border-gray-200 flex items-center justify-center">
                              {det.anh ? (
                                <img src={`http://localhost:5273/images/product/${det.anh}`} alt="" className="h-6 w-auto object-contain" />
                              ) : (
                                <span className="text-[8px] text-gray-400 font-black">NO IMG</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-brand-dark font-bold">{det.tensp || `Sản phẩm #${det.masp}`}</td>
                          <td className="px-4 py-3 font-semibold text-gray-950">{det.soluong}</td>
                          <td className="px-4 py-3 text-gray-600">{fmt(det.gianhap)}</td>
                          <td className="px-4 py-3 font-bold text-brand-gold">{fmt(det.soluong * det.gianhap)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Modal footer / Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-150 pt-5 gap-4">
                <div className="text-right sm:text-left">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block font-semibold">TỔNG GIÁ TRỊ PHIẾU NHẬP</span>
                  <span className="text-xl font-black text-brand-gold">{fmt(selectedInvoice.tongtien)}</span>
                </div>
                <div className="flex gap-3 justify-end">
                  <button 
                    onClick={() => setShowDetailModal(false)}
                    className="border border-gray-250 hover:bg-gray-50 text-gray-600 px-5 py-2.5 rounded-xl text-xs font-bold transition"
                  >
                    Đóng
                  </button>
                  {selectedInvoice.trangthai === 0 && (
                    <button 
                      onClick={() => handleConfirmInvoice(selectedInvoice.mahdn)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/10 flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" /> Duyệt nhập kho
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
