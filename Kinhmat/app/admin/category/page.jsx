'use client';

import { CreatCategory, DeleteCategory, getAllCategory, searchCategory, UpdateCategory } from '../../../services/admin/category';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, Plus, X, Layers, Pencil, Trash2 } from 'lucide-react';

export default function Danhmuc() {
    const [showModal, setShowModal] = useState(false);
    const [category, setcategory] = useState([]);
    const [isEditmode, setIseditmode] = useState(false);
    const [error, seterror] = useState({ tendanhmuc: false, mota: false });
    const [newcategory, setNewcategory] = useState({
        tendanhmuc: "",
        mota: ""
    });
    const [editId, setEditId] = useState(null);

    const handleSave = async () => {
        const newErrors = {
            tendanhmuc: !newcategory.tendanhmuc.trim(),
            mota: !newcategory.mota.trim()
        };

        if (newErrors.tendanhmuc || newErrors.mota) {
            seterror(newErrors);
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        seterror(newErrors);

        try {
            if (editId !== null) {
                await UpdateCategory({ ma: editId, ...newcategory });
                toast.success("Sửa danh mục thành công!");
            } else {
                await CreatCategory(newcategory);
                toast.success("Thêm danh mục mới thành công!");
            }
            const updated = await getAllCategory();
            setcategory(updated || []);
            setShowModal(false);
            setNewcategory({ tendanhmuc: '', mota: '' });
            setEditId(null);
            setIseditmode(false);
        } catch (error) {
            toast.error("Lưu danh mục thất bại. Vui lòng thử lại!");
            console.error(error);
        }
    };

    const clickDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
            try {
                await DeleteCategory(id);
                toast.success("Đã xóa danh mục thành công.");
                const update = await getAllCategory();
                setcategory(update || []);
            } catch (error) {
                toast.error("Không thể xóa danh mục này.");
            }
        }
    };

    const clickEdit = (obj) => {
        setNewcategory({ tendanhmuc: obj.tendanhmuc, mota: obj.mota });
        setEditId(obj.ma);
        setIseditmode(true);
        setShowModal(true);
    };

    const searchdanhmuc = async (danhmuc) => {
        try {
            const data = await searchCategory(danhmuc);
            setcategory(data || []);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        document.title = "Quản lý danh mục | Kính Mắt Luxury";
        const fetchData = async () => {
            try {
                const data = await getAllCategory();
                setcategory(data || []);
            } catch (e) {
                console.error(e);
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
                        <Sparkles className="text-sm" /> Inventory Architecture
                    </div>
                    <h1 className="text-3xl font-extrabold font-heading text-brand-dark tracking-wide">
                        Quản Lý Danh Mục
                    </h1>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-gray-150 p-4 rounded-2xl shadow-md">
                {/* Search */}
                <div className="relative flex items-center max-w-sm w-full">
                    <span className="absolute left-4 text-gray-400"><Search className="text-base" /></span>
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm danh mục..." 
                        onChange={(e) => searchdanhmuc(e.target.value)}
                        className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200 focus:border-brand-gold/60 rounded-xl py-2.5 pl-12 pr-4 text-sm font-medium outline-none transition-all duration-150 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-brand-gold/30"
                    />
                </div>

                {/* Add Button */}
                <motion.button 
                    onClick={() => {
                        setIseditmode(false);
                        setNewcategory({ tendanhmuc: "", mota: "" });
                        setShowModal(true);
                    }}
                    className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl text-black font-heading font-bold text-xs tracking-widest bg-gradient-to-r from-brand-gold via-[#e8d7c0] to-brand-gold-hover hover:brightness-110 active:brightness-95 transition-all duration-150 cursor-pointer shadow-lg shadow-brand-gold/15 flex-shrink-0"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <Plus className="text-sm font-bold" />
                    <span>THÊM DANH MỤC</span>
                </motion.button>
            </div>

            {/* Data Table */}
            <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-md">
                <table className="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-gray-150 bg-gray-50/50 text-gray-500 font-bold uppercase tracking-wider text-xs">
                            <th className="p-4 sm:p-5">STT</th>
                            <th className="p-4 sm:p-5">Tên Danh Mục</th>
                            <th className="p-4 sm:p-5">Mô Tả Chi Tiết</th>
                            <th className="p-4 sm:p-5 text-right">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 font-medium text-gray-700">
                        {category.map((item, index) => (
                            <tr key={item.ma} className="hover:bg-gray-50/30 transition duration-150">
                                <td className="p-4 sm:p-5 text-gray-400">{index + 1}</td>
                                <td className="p-4 sm:p-5 text-brand-dark font-semibold flex items-center gap-2">
                                    <Layers className="text-brand-gold text-sm flex-shrink-0" />
                                    <span>{item.tendanhmuc}</span>
                                </td>
                                <td className="p-4 sm:p-5 text-gray-600 max-w-xs truncate">{item.mota}</td>
                                <td className="p-4 sm:p-5 text-right space-x-2">
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
                                        onClick={() => clickDelete(item.ma)}
                                        className="p-2 bg-red-500/10 hover:bg-red-500/25 text-red-650 rounded-lg transition-colors cursor-pointer outline-none"
                                        title="Xóa"
                                    >
                                        <Trash2 className="text-base" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {category.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-gray-400 font-sans">
                                    Không có dữ liệu danh mục.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add / Edit Modal Overlay */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div 
                            className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full relative z-10 space-y-6"
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            {/* Close Modal button */}
                            <button 
                                onClick={() => {
                                    setShowModal(false);
                                    setNewcategory({ tendanhmuc: "", mota: "" });
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
                                    {isEditmode ? "Update Category" : "New Category"}
                                </span>
                                <h3 className="text-xl font-extrabold font-heading text-brand-dark tracking-wide">
                                    {isEditmode ? "Sửa Danh Mục" : "Thêm Danh Mục Mới"}
                                </h3>
                            </div>

                            {/* Form fields */}
                            <div className="space-y-4 text-sm font-medium text-gray-700">
                                {/* Category Name */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-brand-gold tracking-wide uppercase">Tên danh mục</label>
                                    <input 
                                        type="text" 
                                        placeholder="Nhập tên danh mục (ví dụ: Kính râm)"
                                        value={newcategory.tendanhmuc}
                                        onChange={(e) => setNewcategory({ ...newcategory, tendanhmuc: e.target.value })}
                                        className={`w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all duration-150 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-brand-gold/30 ${
                                            error.tendanhmuc ? 'border-red-500/50 focus:border-red-500' : 'border-gray-200 focus:border-brand-gold/60'
                                        }`}
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-brand-gold tracking-wide uppercase">Mô tả chi tiết</label>
                                    <input 
                                        type="text" 
                                        placeholder="Mô tả tóm tắt về danh mục"
                                        value={newcategory.mota}
                                        onChange={(e) => setNewcategory({ ...newcategory, mota: e.target.value })}
                                        className={`w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all duration-150 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-brand-gold/30 ${
                                            error.mota ? 'border-red-500/50 focus:border-red-500' : 'border-gray-200 focus:border-brand-gold/60'
                                        }`}
                                    />
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
                                        setNewcategory({ tendanhmuc: "", mota: "" });
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