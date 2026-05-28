'use client';

import { createSupplier, deleteSupplier, getAllSupplier, updateSupplier } from '../../../services/admin/supplier';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, Plus, X, Building2, Pencil, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import ExportButton from '../../../components/admin/ExportButton';
import { exportToExcel } from '../../../utils/exportExcel';
import { COLUMNS_NHACUNGCAP } from '../../../utils/exportConfigs';

export default function Supplier() {
    const [showModal, setShowModal] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [isEditmode, setIseditmode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState({ tenncc: false, sdt: false });
    const [newSupplier, setNewSupplier] = useState({
        tenncc: "",
        sdt: "",
        email: "",
        diachi: "",
        trangthai: 1
    });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleExport = () => {
        const rows = filteredSuppliers.map((s) => ({
            ma: s.id,
            ten: s.tenncc,
            diachi: s.diachi || '',
            sdt: s.sdt || '',
            email: s.email || '',
        }));
        exportToExcel(rows, COLUMNS_NHACUNGCAP, 'NhaCungCap', 'Nhà Cung Cấp');
    };

    const handleSave = async () => {
        const newErrors = {
            tenncc: !newSupplier.tenncc.trim(),
            sdt: !newSupplier.sdt.trim()
        };

        if (newErrors.tenncc || newErrors.sdt) {
            setError(newErrors);
            toast.error("Vui lòng nhập Tên và Số điện thoại nhà cung cấp!");
            return;
        }

        setError(newErrors);

        try {
            if (editId !== null) {
                await updateSupplier({ id: editId, ...newSupplier });
                toast.success("Cập nhật nhà cung cấp thành công!");
            } else {
                await createSupplier(newSupplier);
                toast.success("Thêm nhà cung cấp mới thành công!");
            }
            const updated = await getAllSupplier();
            setSuppliers(updated || []);
            setFilteredSuppliers(updated || []);
            setShowModal(false);
            setNewSupplier({ tenncc: '', sdt: '', email: '', diachi: '', trangthai: 1 });
            setEditId(null);
            setIseditmode(false);
        } catch (error) {
            toast.error("Lưu nhà cung cấp thất bại. Vui lòng thử lại!");
            console.error(error);
        }
    };

    const clickDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa nhà cung cấp này?")) {
            try {
                await deleteSupplier(id);
                toast.success("Đã xóa nhà cung cấp thành công.");
                const update = await getAllSupplier();
                setSuppliers(update || []);
                setFilteredSuppliers(update || []);
            } catch (error) {
                toast.error("Không thể xóa nhà cung cấp này vì có thể đang có dữ liệu liên quan.");
            }
        }
    };

    const clickEdit = (obj) => {
        setNewSupplier({ 
            tenncc: obj.tenncc || "", 
            sdt: obj.sdt || "",
            email: obj.email || "",
            diachi: obj.diachi || "",
            trangthai: obj.trangthai !== undefined ? obj.trangthai : 1
        });
        setEditId(obj.id);
        setIseditmode(true);
        setShowModal(true);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredSuppliers(suppliers);
            return;
        }
        const lowerQ = query.toLowerCase();
        const filtered = suppliers.filter(s => 
            (s.tenncc && s.tenncc.toLowerCase().includes(lowerQ)) ||
            (s.sdt && s.sdt.includes(lowerQ)) ||
            (s.email && s.email.toLowerCase().includes(lowerQ))
        );
        setFilteredSuppliers(filtered);
    };

    useEffect(() => {
        document.title = "Quản lý Nhà Cung Cấp | Kính Mắt Luxury";
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getAllSupplier();
                setSuppliers(data || []);
                setFilteredSuppliers(data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8 font-sans text-gray-800">
            {/* Header Title */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6 gap-4">
                <div>
                    <div className="flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest mb-1.5">
                        <Sparkles className="text-sm" /> Partner Ecosystem
                    </div>
                    <h1 className="text-3xl font-extrabold font-heading text-brand-dark tracking-wide">
                        Quản Lý Nhà Cung Cấp
                    </h1>
                </div>
                <ExportButton
                    label="Xuất Excel"
                    options={[{ label: 'Xuất danh sách nhà cung cấp', onClick: handleExport }]}
                />
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-gray-150 p-4 rounded-2xl shadow-md">
                {/* Search */}
                <div className="relative flex items-center max-w-sm w-full">
                    <span className="absolute left-4 text-gray-400"><Search className="text-base" /></span>
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên, SĐT, email..." 
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200 focus:border-brand-gold/60 rounded-xl py-2.5 pl-12 pr-4 text-sm font-medium outline-none transition-all duration-150 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-brand-gold/30"
                    />
                </div>

                {/* Add Button */}
                <motion.button 
                    onClick={() => {
                        setIseditmode(false);
                        setNewSupplier({ tenncc: "", sdt: "", email: "", diachi: "", trangthai: 1 });
                        setShowModal(true);
                    }}
                    className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl text-black font-heading font-bold text-xs tracking-widest bg-gradient-to-r from-brand-gold via-[#e8d7c0] to-brand-gold-hover hover:brightness-110 active:brightness-95 transition-all duration-150 cursor-pointer shadow-lg shadow-brand-gold/15 flex-shrink-0"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <Plus className="text-sm font-bold" />
                    <span>THÊM NHÀ CUNG CẤP</span>
                </motion.button>
            </div>

            {/* Data Table */}
            <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-gray-150 bg-gray-50/50 text-gray-500 font-bold uppercase tracking-wider text-xs">
                                <th className="p-4 sm:p-5">STT</th>
                                <th className="p-4 sm:p-5">Nhà Cung Cấp</th>
                                <th className="p-4 sm:p-5">Liên Hệ</th>
                                <th className="p-4 sm:p-5">Địa Chỉ</th>
                                <th className="p-4 sm:p-5">Trạng Thái</th>
                                <th className="p-4 sm:p-5 text-right">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-150 font-medium text-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-400 font-sans">Đang tải dữ liệu...</td>
                                </tr>
                            ) : filteredSuppliers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-400 font-sans">
                                        Không tìm thấy nhà cung cấp nào.
                                    </td>
                                </tr>
                            ) : (
                                filteredSuppliers.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50/30 transition duration-150">
                                        <td className="p-4 sm:p-5 text-gray-400">{index + 1}</td>
                                        <td className="p-4 sm:p-5 text-brand-dark font-semibold">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="text-brand-gold text-sm flex-shrink-0" />
                                                <span>{item.tenncc}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 sm:p-5">
                                            <div className="space-y-1 text-xs text-gray-600">
                                                <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> {item.sdt || 'N/A'}</p>
                                                {item.email && <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" /> {item.email}</p>}
                                            </div>
                                        </td>
                                        <td className="p-4 sm:p-5 text-gray-600 max-w-[200px] truncate">
                                            {item.diachi ? (
                                                <span className="flex items-center gap-1.5" title={item.diachi}>
                                                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                                    <span className="truncate">{item.diachi}</span>
                                                </span>
                                            ) : 'N/A'}
                                        </td>
                                        <td className="p-4 sm:p-5">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                item.trangthai === 1 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                                            }`}>
                                                {item.trangthai === 1 ? 'Đang hợp tác' : 'Ngừng hợp tác'}
                                            </span>
                                        </td>
                                        <td className="p-4 sm:p-5 text-right space-x-2 whitespace-nowrap">
                                            {/* Edit Button */}
                                            <button 
                                                onClick={() => clickEdit(item)}
                                                className="p-2 bg-brand-gold/10 hover:bg-brand-gold/25 text-brand-gold rounded-lg transition-colors cursor-pointer outline-none"
                                                title="Chỉnh sửa"
                                            >
                                                <Pencil className="text-base" />
                                            </button>
                                            {/* Delete Button */}
                                            <button 
                                                onClick={() => clickDelete(item.id)}
                                                className="p-2 bg-red-500/10 hover:bg-red-500/25 text-red-650 rounded-lg transition-colors cursor-pointer outline-none"
                                                title="Xóa"
                                            >
                                                <Trash2 className="text-base" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add / Edit Modal Overlay */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div 
                            className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-lg w-full relative z-10 space-y-6 max-h-[90vh] overflow-y-auto"
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            {/* Close Modal button */}
                            <button 
                                onClick={() => {
                                    setShowModal(false);
                                    setNewSupplier({ tenncc: "", sdt: "", email: "", diachi: "", trangthai: 1 });
                                    setEditId(null);
                                    setIseditmode(false);
                                }}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition duration-150 outline-none cursor-pointer"
                                title="Đóng"
                            >
                                <X className="text-lg" />
                            </button>

                            {/* Title */}
                            <div>
                                <span className="text-[9px] font-bold tracking-widest text-brand-gold uppercase block mb-1">
                                    {isEditmode ? "Update Supplier" : "New Supplier"}
                                </span>
                                <h3 className="text-xl font-extrabold font-heading text-brand-dark tracking-wide">
                                    {isEditmode ? "Sửa Nhà Cung Cấp" : "Thêm Nhà Cung Cấp"}
                                </h3>
                            </div>

                            {/* Form fields */}
                            <div className="space-y-4 text-sm font-medium text-gray-700">
                                {/* Name */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-brand-gold tracking-wide uppercase">Tên nhà cung cấp <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        placeholder="Ví dụ: Công ty TNHH Mắt Kính..."
                                        value={newSupplier.tenncc}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, tenncc: e.target.value })}
                                        className={`w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all duration-150 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-brand-gold/30 ${
                                            error.tenncc ? 'border-red-500/50 focus:border-red-500' : 'border-gray-200 focus:border-brand-gold/60'
                                        }`}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Phone */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-brand-gold tracking-wide uppercase">Số điện thoại <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text" 
                                            placeholder="Ví dụ: 090..."
                                            value={newSupplier.sdt}
                                            onChange={(e) => setNewSupplier({ ...newSupplier, sdt: e.target.value })}
                                            className={`w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all duration-150 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-brand-gold/30 ${
                                                error.sdt ? 'border-red-500/50 focus:border-red-500' : 'border-gray-200 focus:border-brand-gold/60'
                                            }`}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-brand-gold tracking-wide uppercase">Email</label>
                                        <input 
                                            type="email" 
                                            placeholder="Ví dụ: contact@company.com"
                                            value={newSupplier.email}
                                            onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                                            className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all duration-150 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-brand-gold/30 focus:border-brand-gold/60"
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-brand-gold tracking-wide uppercase">Địa chỉ</label>
                                    <input 
                                        type="text" 
                                        placeholder="Số nhà, đường, xã/phường, quận/huyện, tỉnh/thành phố"
                                        value={newSupplier.diachi}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, diachi: e.target.value })}
                                        className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all duration-150 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-brand-gold/30 focus:border-brand-gold/60"
                                    />
                                </div>

                                {/* Status */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-brand-gold tracking-wide uppercase">Trạng thái</label>
                                    <select 
                                        value={newSupplier.trangthai}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, trangthai: parseInt(e.target.value) })}
                                        className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all duration-150 text-gray-900 focus:ring-1 focus:ring-brand-gold/30 focus:border-brand-gold/60 appearance-none"
                                    >
                                        <option value={1}>Đang hợp tác</option>
                                        <option value={0}>Ngừng hợp tác</option>
                                    </select>
                                </div>
                            </div>

                            {/* Buttons actions */}
                            <div className="flex gap-3 pt-2">
                                <motion.button 
                                    onClick={handleSave}
                                    className="flex-grow py-3 rounded-xl text-black font-heading font-bold text-xs tracking-widest bg-gradient-to-r from-brand-gold via-[#e8d7c0] to-brand-gold-hover hover:brightness-110 active:brightness-95 transition-all duration-150 cursor-pointer shadow-lg shadow-brand-gold/15"
                                    whileHover={{ scale: 1.015 }}
                                    whileTap={{ scale: 0.985 }}
                                >
                                    LƯU LẠI
                                </motion.button>
                                <button 
                                    onClick={() => {
                                        setShowModal(false);
                                        setNewSupplier({ tenncc: "", sdt: "", email: "", diachi: "", trangthai: 1 });
                                        setEditId(null);
                                        setIseditmode(false);
                                    }}
                                    className="py-3 px-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-800 transition duration-150 cursor-pointer"
                                >
                                    HỦY
                                </button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
