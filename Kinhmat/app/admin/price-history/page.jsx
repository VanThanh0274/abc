'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Plus, X, History, Tag } from 'lucide-react';
import { toast } from 'react-toastify';
import { getAllActivePrice, getPriceHistoryBySP, updatePrice } from '../../../services/admin/priceHistory';
import { GetallProduct } from '../../../services/admin/product';

const fmt = (v) => Number(v || 0).toLocaleString('vi-VN') + ' đ';

export default function PriceHistoryPage() {
  const [mounted, setMounted] = useState(false);
  const [prices, setPrices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({ masp: '', gianhap: '', giaban: '' });
  const [productSearch, setProductSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const handleProductSelect = (e) => {
    const val = e.target.value;
    setProductSearch(val);
    const match = val.match(/^(\d+)\s*-/);
    const masp = match ? parseInt(match[1], 10) : null;
    
    if (masp) {
      const prod = products.find(p => p.id === masp);
      if (prod) {
        setForm(f => ({ ...f, gianhap: prod.gianhap || 0 }));
      }
    } else {
      setForm(f => ({ ...f, gianhap: '' }));
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const [p, prods] = await Promise.all([getAllActivePrice(), GetallProduct(1, 1000)]);
      setPrices(p || []);
      setProducts(prods?.data || prods || []);
    } catch { toast.error('Lỗi tải dữ liệu'); }
    finally { setLoading(false); }
  };

  const viewHistory = async (masp) => {
    try {
      const h = await getPriceHistoryBySP(masp);
      setHistory(h || []);
      setShowHistoryModal(true);
    } catch { toast.error('Lỗi tải lịch sử'); }
  };

  const handleSave = async () => {
    // Extract masp from format "123 - Product Name"
    const match = productSearch.match(/^(\d+)\s*-/);
    const masp = match ? parseInt(match[1], 10) : null;

    if (!masp || !form.gianhap || !form.giaban) return toast.warn('Vui lòng chọn sản phẩm và điền đầy đủ giá');
    setSaving(true);
    try {
      await updatePrice({ masp: masp, gianhap: +form.gianhap, giaban: +form.giaban });
      toast.success('Cập nhật giá thành công! Giá cũ đã được lưu vào lịch sử.');
      setShowModal(false);
      setForm({ masp: '', gianhap: '', giaban: '' });
      setProductSearch('');
      load();
    } catch { toast.error('Lỗi cập nhật giá'); }
    finally { setSaving(false); }
  };

  useEffect(() => { 
    setMounted(true);
    document.title = 'Admin - Lịch sử giá'; 
    load(); 
  }, []);

  if (!mounted) {
    return <div className="p-8 text-center text-gray-400 font-sans">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest mb-1">
            <TrendingUp className="w-3.5 h-3.5" /> Quản lý giá cả
          </div>
          <h1 className="text-2xl font-extrabold font-heading text-brand-dark">Lịch sử Giá Sản Phẩm</h1>
          <p className="text-xs text-gray-500 mt-0.5">Mỗi lần cập nhật giá, hệ thống tự lưu lịch sử để tính toán lợi nhuận chính xác.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-hover text-white text-sm font-bold px-5 py-2.5 rounded-xl transition"
        >
          <Plus className="w-4 h-4" /> Cập nhật giá mới
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Sản phẩm', 'Giá nhập', 'Giá bán', 'Ngày áp dụng', 'Trạng thái', 'Thao tác'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-black text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-16 text-gray-400">Đang tải...</td></tr>
            ) : prices.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16 text-gray-400">Chưa có dữ liệu giá. Hãy cập nhật giá cho sản phẩm đầu tiên.</td></tr>
            ) : prices.map((p, i) => (
              <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="hover:bg-gray-50/60 transition">
                <td className="px-5 py-4 font-semibold text-gray-800">{p.tensp || `SP #${p.masp}`}</td>
                <td className="px-5 py-4 text-gray-600">{fmt(p.gianhap)}</td>
                <td className="px-5 py-4 font-bold text-brand-gold">{fmt(p.giaban)}</td>
                <td className="px-5 py-4 text-gray-500 text-xs">{new Date(p.ngayapdung).toLocaleDateString('vi-VN')}</td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Đang áp dụng</span>
                </td>
                <td className="px-5 py-4">
                  <button onClick={() => viewHistory(p.masp)}
                    className="flex items-center gap-1.5 text-xs text-brand-gold font-bold hover:underline">
                    <History className="w-3.5 h-3.5" /> Xem lịch sử
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Cập nhật giá */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7"
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-extrabold font-heading text-brand-dark flex items-center gap-2">
                  <Tag className="text-brand-gold" /> Cập nhật giá sản phẩm
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700"><X /></button>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Chọn sản phẩm (Gõ để tìm kiếm)</label>
                  <input 
                    list="price-product-list"
                    placeholder="Nhập tên hoặc mã SP..."
                    value={productSearch} 
                    onChange={handleProductSelect}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold outline-none" 
                  />
                  <datalist id="price-product-list">
                    {products.map(p => <option key={p.id} value={`${p.id} - ${p.ten}`} />)}
                  </datalist>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Giá nhập (Tự động từ Hóa đơn nhập)</label>
                  <input type="number" value={form.gianhap} readOnly disabled
                    placeholder="Tự động điền..." className="w-full bg-gray-100 text-gray-500 font-bold border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Giá bán (VNĐ)</label>
                  <input type="number" value={form.giaban} onChange={e => setForm(f => ({ ...f, giaban: e.target.value }))}
                    placeholder="VD: 850000" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold outline-none" />
                </div>
                {form.gianhap && form.giaban && +form.giaban > +form.gianhap && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-xs text-emerald-700 font-semibold">
                    Biên lợi nhuận: {(((+form.giaban - +form.gianhap) / +form.giaban) * 100).toFixed(1)}%
                    ({(+form.giaban - +form.gianhap).toLocaleString('vi-VN')} đ/sp)
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50">Hủy</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-brand-gold hover:bg-brand-gold-hover text-white py-2.5 rounded-xl text-sm font-bold disabled:opacity-60">
                  {saving ? 'Đang lưu...' : 'Cập nhật giá'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Lịch sử */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-7"
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-extrabold font-heading text-brand-dark">Lịch sử thay đổi giá</h2>
                <button onClick={() => setShowHistoryModal(false)} className="text-gray-400 hover:text-gray-700"><X /></button>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {history.map((h, i) => (
                  <div key={h.id} className={`flex items-center justify-between p-3 rounded-xl border ${i === 0 ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 bg-gray-50'}`}>
                    <div>
                      <p className="text-xs font-black text-gray-700">Nhập: {fmt(h.gianhap)} — Bán: <span className="text-brand-gold">{fmt(h.giaban)}</span></p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{new Date(h.ngayapdung).toLocaleDateString('vi-VN')} {h.ngayketthuc ? `→ ${new Date(h.ngayketthuc).toLocaleDateString('vi-VN')}` : '→ Hiện tại'}</p>
                    </div>
                    {i === 0 && <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Hiện hành</span>}
                  </div>
                ))}
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="mt-4 w-full border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50">Đóng</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
