'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Calendar, User, Eye, ChevronRight, BookOpen } from 'lucide-react';
import { getAllBlogsUser, getAllDanhmucBlog } from '../../../services/blog';

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [page, selectedCategory, keyword]);

  const fetchCategories = async () => {
    try {
      const data = await getAllDanhmucBlog();
      setCategories(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await getAllBlogsUser(page, 9, keyword, selectedCategory);
      setBlogs(res.data || []);
      setTotalPages(res.total_page || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center justify-center p-3 bg-brand-gold/10 rounded-2xl mb-4 text-brand-gold">
          <BookOpen size={32} />
        </motion.div>
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Blog & <span className="text-brand-gold">Tin Tức</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-lg text-gray-600 max-w-2xl mx-auto">
          Cập nhật những kiến thức chăm sóc mắt mới nhất, tư vấn chọn kính phù hợp và các xu hướng thời trang kính mắt.
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
                <button
                  onClick={() => { setSelectedCategory(''); setPage(1); }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === '' ? 'bg-brand-dark text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tất cả
                </button>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCategory(c.id); setPage(1); }}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === c.id ? 'bg-brand-dark text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {c.ten}
                  </button>
                ))}
              </div>
              
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={keyword}
                  onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors text-sm"
                />
              </div>
            </div>

            {/* Blog Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-gold rounded-full animate-spin"></div>
              </div>
            ) : blogs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy bài viết</h3>
                <p className="text-gray-500">Hãy thử tìm kiếm với từ khóa hoặc danh mục khác.</p>
              </div>
            ) : (
              <>
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {blogs.map(blog => (
                    <motion.div key={blog.id} variants={itemVariants}>
                      <Link href={`/blog/${blog.id}`} className="group block h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col relative top-0 hover:-top-2">
                        <div className="aspect-[4/3] overflow-hidden relative bg-gray-100">
                          {blog.anh ? (
                            <img loading="lazy" 
                              src={blog.anh} 
                              alt={blog.tieude} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <BookOpen size={48} />
                            </div>
                          )}
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-brand-dark px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                            {blog.tendanhmuc || 'Tin tức'}
                          </div>
                        </div>
                        
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 font-medium">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={14} />
                              {new Date(blog.ngaytao).toLocaleDateString('vi-VN')}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Eye size={14} />
                              {blog.luotxem}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-gold transition-colors leading-tight">
                            {blog.tieude}
                          </h3>
                          
                          <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
                            {blog.tomtat || "Đang cập nhật..."}
                          </p>
                          
                          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                <User size={12} />
                              </div>
                              {blog.tacgia}
                            </span>
                            <span className="text-brand-gold font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              Đọc tiếp <ChevronRight size={16} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-xl font-bold transition-all ${
                          page === i + 1 
                            ? 'bg-brand-dark text-brand-gold shadow-lg shadow-brand-dark/20' 
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
