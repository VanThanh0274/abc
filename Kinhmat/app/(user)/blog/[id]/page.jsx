'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, User, Eye, ArrowLeft, Share2, Link as LinkIcon } from 'lucide-react';
import { getBlogById, increaseView } from '../../../../services/blog';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const viewCounted = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        if (!viewCounted.current) {
          viewCounted.current = true;
          try {
            await increaseView(id); // Gọi API tăng view trước
          } catch (e) {
            console.error(e);
          }
        }
        // Lấy thông tin bài viết sau khi view đã tăng
        fetchBlogDetail(id);
      }
    };
    loadData();
  }, [id]);

  const fetchBlogDetail = async (blogId) => {
    try {
      setLoading(true);
      const data = await getBlogById(blogId);
      setBlog(data);
    } catch (error) {
      console.error(error);
      router.push('/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.tieude,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã copy link bài viết!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Không tìm thấy bài viết</h1>
        <button onClick={() => router.push('/blog')} className="px-6 py-3 bg-brand-dark text-white rounded-xl font-semibold">
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-brand-dark overflow-hidden">
        {blog.anh && (
          <div className="absolute inset-0">
            <img src={blog.anh} alt={blog.tieude} className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          </div>
        )}
        
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 md:pb-20">
            <motion.button 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors text-sm font-semibold uppercase tracking-wider"
            >
              <ArrowLeft size={16} /> Quay lại
            </motion.button>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-3 py-1 bg-brand-gold text-brand-dark rounded-md text-xs font-bold uppercase tracking-widest mb-4">
              {blog.tendanhmuc || 'Tin tức'}
            </motion.div>
            
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              {blog.tieude}
            </motion.h1>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-medium">
              <span className="flex items-center gap-2">
                <User size={16} className="text-brand-gold" /> {blog.tacgia}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-brand-gold" /> {new Date(blog.ngaytao).toLocaleDateString('vi-VN')}
              </span>
              <span className="flex items-center gap-2">
                <Eye size={16} className="text-brand-gold" /> {blog.luotxem} lượt xem
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100"
        >
          {/* Tóm tắt */}
          {blog.tomtat && (
            <div className="text-lg md:text-xl text-gray-600 font-medium italic border-l-4 border-brand-gold pl-6 py-2 mb-10 leading-relaxed">
              {blog.tomtat}
            </div>
          )}
          
          {/* Nội dung chính */}
          <div 
            className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-brand-gold hover:prose-a:text-yellow-600 prose-img:rounded-2xl prose-img:shadow-md leading-loose"
            dangerouslySetInnerHTML={{ __html: blog.noidung }}
          />

          {/* Chia sẻ */}
          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-gray-800 font-bold text-lg">Chia sẻ bài viết này</div>
            <div className="flex gap-3">
              <button onClick={handleShare} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition">
                <Share2 size={18} />
              </button>
              <button onClick={handleShare} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition text-sm">
                <LinkIcon size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
