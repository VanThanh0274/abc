"use client";
import React, { useState, useEffect } from 'react';
import { getAllPromotions, createPromotion, updatePromotion, deletePromotion } from '../../../services/admin/promotions';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import ExportButton from '../../../components/admin/ExportButton';
import { exportToExcel } from '../../../utils/exportExcel';
import { COLUMNS_KHUYENMAI } from '../../../utils/exportConfigs';

export default function PromotionsPage() {
    const [promotions, setPromotions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleExport = () => {
        const rows = promotions.map((p) => ({
            ma: p.ma_km,
            ten: p.ten_km,
            phantram: p.loai_km === 1 ? `${p.giatri_km}%` : `${p.giatri_km.toLocaleString()} đ`,
            ngaybatdau: p.ngaybatdau ? new Date(p.ngaybatdau).toLocaleDateString('vi-VN') : '',
            ngayketthuc: p.ngayketthuc ? new Date(p.ngayketthuc).toLocaleDateString('vi-VN') : '',
            trangthai: p.trangthai === 1 ? 'Hoạt động' : 'Tạm dừng',
        }));
        exportToExcel(rows, COLUMNS_KHUYENMAI, 'KhuyenMai', 'Khuyến Mãi');
    };
    const [formData, setFormData] = useState({
        ma_km: '',
        ten_km: '',
        mota: '',
        loai_km: 1,
        giatri_km: 0,
        dieukien_toithieu: 0,
        ngaybatdau: '',
        ngayketthuc: '',
        is_vip_only: 0,
        trangthai: 1
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getAllPromotions();
            setPromotions(data);
        } catch (error) {
            toast.error("Lỗi lấy danh sách khuyến mãi");
        }
    };

    const handleOpenModal = (promo = null) => {
        if (promo) {
            setEditingId(promo.id);
            setFormData({
                ma_km: promo.ma_km,
                ten_km: promo.ten_km,
                mota: promo.mota || '',
                loai_km: promo.loai_km,
                giatri_km: promo.giatri_km,
                dieukien_toithieu: promo.dieukien_toithieu,
                ngaybatdau: promo.ngaybatdau ? new Date(promo.ngaybatdau).toISOString().slice(0, 16) : '',
                ngayketthuc: promo.ngayketthuc ? new Date(promo.ngayketthuc).toISOString().slice(0, 16) : '',
                is_vip_only: promo.is_vip_only,
                trangthai: promo.trangthai
            });
        } else {
            setEditingId(null);
            setFormData({
                ma_km: '', ten_km: '', mota: '', loai_km: 1, giatri_km: 0, 
                dieukien_toithieu: 0, ngaybatdau: '', ngayketthuc: '', is_vip_only: 0, trangthai: 1
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updatePromotion({ id: editingId, ...formData });
                toast.success("Cập nhật thành công!");
            } else {
                await createPromotion(formData);
                toast.success("Thêm mới thành công!");
            }
            setIsModalOpen(false);
            loadData();
        } catch (error) {
            toast.error("Đã có lỗi xảy ra");
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Bạn có chắc chắn muốn xoá khuyến mãi này?")) {
            try {
                await deletePromotion(id);
                toast.success("Xoá thành công!");
                loadData();
            } catch (error) {
                toast.error("Lỗi khi xoá");
            }
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Quản lý Khuyến Mãi</h2>
                    <p className="text-sm text-gray-500 mt-1">Tạo và quản lý các mã giảm giá cho khách hàng</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()} 
                    className="flex items-center gap-2 bg-brand-gold text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-yellow-600 transition"
                >
                    <Plus size={18} /> Thêm mới
                </button>
                <ExportButton
                    label="Xuất Excel"
                    options={[{ label: 'Xuất danh sách khuyến mãi', onClick: handleExport }]}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            <th className="p-4">Mã KM</th>
                            <th className="p-4">Tên</th>
                            <th className="p-4">Loại/Giá trị</th>
                            <th className="p-4">Hạn dùng</th>
                            <th className="p-4">Đối tượng</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {promotions.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50/50 transition">
                                <td className="p-4 font-semibold text-brand-dark">{p.ma_km}</td>
                                <td className="p-4 text-gray-700">{p.ten_km}</td>
                                <td className="p-4 text-gray-600">
                                    {p.loai_km === 1 ? `Giảm ${p.giatri_km}%` : `Giảm ${p.giatri_km.toLocaleString()}đ`}
                                    <div className="text-xs text-gray-400">Đơn TT: {p.dieukien_toithieu.toLocaleString()}đ</div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    Từ: {new Date(p.ngaybatdau).toLocaleDateString()}<br/>
                                    Đến: {new Date(p.ngayketthuc).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    {p.is_vip_only === 1 
                                        ? <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-bold">VIP Only</span> 
                                        : <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold">All Users</span>}
                                </td>
                                <td className="p-4">
                                    {p.trangthai === 1 
                                        ? <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold">Hoạt động</span> 
                                        : <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold">Đã khoá</span>}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => handleOpenModal(p)} className="p-1.5 text-gray-400 hover:text-blue-500 bg-white rounded-lg border border-gray-200 shadow-sm transition">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-500 bg-white rounded-lg border border-gray-200 shadow-sm transition">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {promotions.length === 0 && (
                            <tr><td colSpan="7" className="p-8 text-center text-gray-500">Chưa có dữ liệu khuyến mãi.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-800">{editingId ? 'Cập nhật Khuyến mãi' : 'Thêm mới Khuyến mãi'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition"><X size={20} /></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <form id="promoForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-semibold text-gray-600">Mã Khuyến Mãi</label>
                                    <input type="text" required value={formData.ma_km} onChange={e => setFormData({...formData, ma_km: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none" placeholder="VD: SALE10, VIP20..." />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-semibold text-gray-600">Tên chương trình</label>
                                    <input type="text" required value={formData.ten_km} onChange={e => setFormData({...formData, ten_km: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">Loại giảm giá</label>
                                    <select value={formData.loai_km} onChange={e => setFormData({...formData, loai_km: Number(e.target.value)})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-gold outline-none">
                                        <option value={1}>Giảm theo %</option>
                                        <option value={2}>Giảm số tiền cố định</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">Giá trị giảm</label>
                                    <input type="number" required value={formData.giatri_km} onChange={e => setFormData({...formData, giatri_km: Number(e.target.value)})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-gold outline-none" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-semibold text-gray-600">Đơn tối thiểu (VNĐ)</label>
                                    <input type="number" value={formData.dieukien_toithieu} onChange={e => setFormData({...formData, dieukien_toithieu: Number(e.target.value)})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-gold outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">Ngày bắt đầu</label>
                                    <input type="datetime-local" required value={formData.ngaybatdau} onChange={e => setFormData({...formData, ngaybatdau: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-gold outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">Ngày kết thúc</label>
                                    <input type="datetime-local" required value={formData.ngayketthuc} onChange={e => setFormData({...formData, ngayketthuc: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-gold outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">Đối tượng áp dụng</label>
                                    <select value={formData.is_vip_only} onChange={e => setFormData({...formData, is_vip_only: Number(e.target.value)})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-gold outline-none">
                                        <option value={0}>Tất cả khách hàng</option>
                                        <option value={1}>Chỉ dành cho VIP</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">Trạng thái</label>
                                    <select value={formData.trangthai} onChange={e => setFormData({...formData, trangthai: Number(e.target.value)})} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-gold outline-none">
                                        <option value={1}>Hoạt động</option>
                                        <option value={0}>Tạm dừng</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition">Huỷ</button>
                            <button type="submit" form="promoForm" className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-gold rounded-xl hover:bg-yellow-600 transition shadow-sm">Lưu Thay Đổi</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
