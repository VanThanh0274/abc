'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Plus, Edit, Trash2, X, Image as ImageIcon, CheckCircle2, List, Settings } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  getAllBlogs,
  searchBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllDanhmucBlog,
  createDanhmucBlog,
  deleteDanhmucBlog,
  uploadBlogImage
} from '../../../services/admin/blog';
import ExportButton from '../../../components/admin/ExportButton';
import { exportToExcel } from '../../../utils/exportExcel';
import { COLUMNS_BLOG } from '../../../utils/exportConfigs';

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // '' | '1' | '0'
  
  // Pagination (đơn giản hóa)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    tieude: '',
    noidung: '',
    tomtat: '',
    anh: '',
    madanhmuc: '',
    tacgia: 'Admin',
    trangthai: 1
  });
  
  // File input ref
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, [page, statusFilter, keyword]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let res;
      if (keyword || statusFilter !== '') {
        res = await searchBlog(keyword, statusFilter, page, 10);
      } else {
        res = await getAllBlogs(page, 10);
      }
      setBlogs(res.data || []);
      setTotalPages(res.total_page || 1);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách blog');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllDanhmucBlog();
      setCategories(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleExport = () => {
    const rows = blogs.map((b) => ({
      id: b.id,
      tieude: b.tieude,
      tendanhmuc: b.tendanhmuc,
      tacgia: b.tacgia,
      luotxem: b.luotxem,
      trangthai: b.trangthai === 1 ? 'Đã đăng' : 'Nháp',
      ngaytao: b.ngaytao ? new Date(b.ngaytao).toLocaleDateString('vi-VN') : ''
    }));
    exportToExcel(rows, COLUMNS_BLOG, 'DanhSachBlog', 'Blog');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadBlogImage(file);
      setFormData({ ...formData, anh: res.url });
      toast.success('Tải ảnh lên thành công');
    } catch (error) {
      toast.error('Lỗi khi tải ảnh');
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      tieude: '', noidung: '', tomtat: '', anh: '',
      madanhmuc: categories.length > 0 ? categories[0].id : '',
      tacgia: 'Admin', trangthai: 1
    });
    setShowBlogModal(true);
  };

  const openEditModal = (blog) => {
    setEditingId(blog.id);
    setFormData({
      tieude: blog.tieude,
      noidung: blog.noidung,
      tomtat: blog.tomtat || '',
      anh: blog.anh || '',
      madanhmuc: blog.madanhmuc || '',
      tacgia: blog.tacgia || '',
      trangthai: blog.trangthai
    });
    setShowBlogModal(true);
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateBlog({ id: editingId, ...formData });
        toast.success('Cập nhật thành công');
      } else {
        await createBlog(formData);
        toast.success('Thêm bài viết thành công');
      }
      setShowBlogModal(false);
      fetchData();
    } catch (error) {
      toast.error('Lỗi khi lưu bài viết');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    try {
      await deleteBlog(id);
      toast.success('Xóa bài viết thành công');
      fetchData();
    } catch (error) {
      toast.error('Lỗi khi xóa bài viết');
    }
  };

  const handleToggleStatus = async (blog) => {
    try {
      await updateBlog({ ...blog, trangthai: blog.trangthai === 1 ? 0 : 1 });
      fetchData();
    } catch (error) {
      toast.error('Lỗi khi đổi trạng thái');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="text-brand-gold" />
            Quản Lý Blog
          </h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý các bài viết, tin tức, và kiến thức chăm sóc mắt</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-semibold text-sm"
          >
            <List size={18} /> Danh mục
          </button>
          <ExportButton 
            label="Xuất Excel"
            options={[{ label: 'Xuất danh sách bài viết', onClick: handleExport }]}
          />
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-gold text-white rounded-xl hover:bg-yellow-600 transition font-semibold text-sm shadow-md"
          >
            <Plus size={18} /> Viết bài mới
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-gold transition-colors text-sm"
          />
        </div>
        <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl w-full md:w-auto">
          {['', '1', '0'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                statusFilter === status 
                  ? 'bg-white text-brand-dark shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status === '' ? 'Tất cả' : status === '1' ? 'Đã đăng' : 'Bản nháp'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-semibold">Hình ảnh</th>
                <th className="p-4 font-semibold">Bài viết</th>
                <th className="p-4 font-semibold">Danh mục</th>
                <th className="p-4 font-semibold">Lượt xem</th>
                <th className="p-4 font-semibold">Trạng thái</th>
                <th className="p-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">Không tìm thấy bài viết nào.</td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={blog.id} 
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="p-4">
                      {blog.anh ? (
                        <img loading="lazy" src={blog.anh} alt={blog.tieude} className="w-16 h-12 object-cover rounded-lg border border-gray-200" />
                      ) : (
                        <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-800 line-clamp-1">{blog.tieude}</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <span>{new Date(blog.ngaytao).toLocaleDateString('vi-VN')}</span>
                        <span>•</span>
                        <span>{blog.tacgia}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium">
                        {blog.tendanhmuc || 'Không có'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{blog.luotxem}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleToggleStatus(blog)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          blog.trangthai === 1 
                            ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {blog.trangthai === 1 ? (
                          <><CheckCircle2 size={14} /> Đã đăng</>
                        ) : (
                          <><Settings size={14} /> Bản nháp</>
                        )}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(blog)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phân trang đơn giản */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                page === i + 1 ? 'bg-brand-gold text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal Quản lý Bài Viết */}
      <AnimatePresence>
        {showBlogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingId ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
                </h2>
                <button onClick={() => setShowBlogModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveBlog} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Cột trái: Form chính */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề bài viết *</label>
                      <input
                        type="text"
                        required
                        value={formData.tieude}
                        onChange={(e) => setFormData({...formData, tieude: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition"
                        placeholder="Nhập tiêu đề..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt</label>
                      <textarea
                        rows={2}
                        value={formData.tomtat}
                        onChange={(e) => setFormData({...formData, tomtat: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition"
                        placeholder="Đoạn mô tả ngắn hiển thị ở trang danh sách..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung chi tiết *</label>
                      <textarea
                        required
                        rows={12}
                        value={formData.noidung}
                        onChange={(e) => setFormData({...formData, noidung: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition font-mono text-sm leading-relaxed"
                        placeholder="Nhập nội dung bài viết. Bạn có thể sử dụng các thẻ HTML cơ bản (<b>, <i>, <br>)..."
                      />
                    </div>
                  </div>

                  {/* Cột phải: Settings */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh bìa (Thumbnail)</label>
                      <div 
                        className="aspect-video w-full border-2 border-dashed border-gray-300 rounded-xl bg-white flex flex-col items-center justify-center cursor-pointer hover:border-brand-gold hover:bg-yellow-50/30 transition overflow-hidden relative"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {formData.anh ? (
                          <img loading="lazy" src={formData.anh} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <ImageIcon className="text-gray-400 mb-2" size={32} />
                            <span className="text-sm text-gray-500">Click để tải ảnh lên</span>
                          </>
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </div>
                      {formData.anh && (
                        <button 
                          type="button" 
                          onClick={() => setFormData({...formData, anh: ''})}
                          className="text-xs text-red-500 mt-2 block w-full text-center hover:underline"
                        >
                          Xóa ảnh
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                      <select
                        value={formData.madanhmuc}
                        onChange={(e) => setFormData({...formData, madanhmuc: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-brand-gold outline-none"
                      >
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.ten}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
                      <input
                        type="text"
                        value={formData.tacgia}
                        onChange={(e) => setFormData({...formData, tacgia: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-brand-gold outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái lưu</label>
                      <select
                        value={formData.trangthai}
                        onChange={(e) => setFormData({...formData, trangthai: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-brand-gold outline-none"
                      >
                        <option value={1}>Đăng công khai</option>
                        <option value={0}>Lưu nháp</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowBlogModal(false)}
                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-brand-gold text-white font-semibold hover:bg-yellow-600 transition shadow-md flex items-center gap-2"
                  >
                    {editingId ? 'Cập nhật' : 'Đăng bài viết'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Quản Lý Danh Mục (Đơn giản) */}
      <AnimatePresence>
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Quản lý danh mục</h2>
                <button onClick={() => setShowCategoryModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto mb-4 border border-gray-100 rounded-lg p-2 bg-gray-50">
                {categories.map(c => (
                  <div key={c.id} className="flex justify-between items-center bg-white p-2 px-3 rounded shadow-sm border border-gray-100">
                    <span className="text-sm font-medium text-gray-700">{c.ten}</span>
                    <button 
                      onClick={async () => {
                        if (confirm('Xóa danh mục này?')) {
                          await deleteDanhmucBlog(c.id);
                          fetchCategories();
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                    ><Trash2 size={14}/></button>
                  </div>
                ))}
                {categories.length === 0 && <div className="text-sm text-center text-gray-500 py-4">Chưa có danh mục nào</div>}
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const name = e.target.ten.value;
                if (!name) return;
                await createDanhmucBlog({ ten: name, trangthai: 1 });
                e.target.reset();
                fetchCategories();
              }} className="flex gap-2">
                <input name="ten" placeholder="Tên danh mục mới..." className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                <button type="submit" className="bg-brand-dark text-white px-4 rounded-lg text-sm font-semibold">Thêm</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
