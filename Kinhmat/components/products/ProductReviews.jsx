"use client";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Star, Send, UserCircle } from 'lucide-react';

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [newReview, setNewReview] = useState({ SoSao: 5, BinhLuan: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (!productId) return;
    
    setHasToken(typeof window !== 'undefined' && !!localStorage.getItem('token'));
    fetchReviews();
    checkCanReview();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:5273/api/Ctr_Danhgia/product/${productId}`);
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews", error);
    }
  };

  const checkCanReview = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5273/api/Ctr_Danhgia/check-can-review/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCanReview(data.canReview);
      }
    } catch (error) {
      console.error("Error checking review eligibility", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newReview.BinhLuan.trim() === '') {
      toast.error('Vui lòng nhập nội dung đánh giá!');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập!');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        masp: parseInt(productId),
        SoSao: newReview.SoSao,
        BinhLuan: newReview.BinhLuan
      };

      const res = await fetch(`http://localhost:5273/api/Ctr_Danhgia/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success('Đánh giá thành công!');
        setNewReview({ SoSao: 5, BinhLuan: '' });
        fetchReviews(); // refresh
      } else {
        const err = await res.json();
        toast.error(err.message || 'Lỗi khi đánh giá');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-black/10 py-12 font-sans border-t border-gray-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-white border-l-4 border-brand-gold pl-4 tracking-wide uppercase">
              Đánh giá từ khách hàng ({reviews.length})
            </h2>

            {reviews.length === 0 ? (
              <div className="text-gray-500 italic bg-gray-50 dark:bg-white/[0.02] p-6 rounded-xl border border-gray-100 dark:border-white/5">
                Chưa có đánh giá nào cho sản phẩm này.
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((rv) => (
                  <div key={rv.id} className="bg-gray-50 dark:bg-white/[0.02] p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-brand-gold/20 rounded-full flex items-center justify-center text-brand-gold">
                        <UserCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{rv.tenNguoiDung}</h4>
                        <span className="text-xs text-gray-400">{new Date(rv.ngayTao).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="ml-auto flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= rv.soSao ? 'text-brand-gold fill-brand-gold' : 'text-gray-300 dark:text-gray-700'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                      {rv.binhLuan}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Review Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-black/20 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-150 dark:border-white/5 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider font-heading">
                Viết đánh giá
              </h3>
              
              {!hasToken ? (
                <div className="text-sm text-gray-500 mb-4 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 p-4 rounded-xl">
                  Bạn cần đăng nhập để đánh giá sản phẩm.
                </div>
              ) : !canReview ? (
                <div className="text-sm text-gray-500 mb-4 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 p-4 rounded-xl">
                  Chỉ những khách hàng đã mua và nhận thành công sản phẩm này mới có thể đánh giá.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Đánh giá của bạn</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          onClick={() => setNewReview({...newReview, SoSao: star})}
                          className={`w-8 h-8 cursor-pointer transition-colors ${
                            star <= newReview.SoSao ? 'text-brand-gold fill-brand-gold' : 'text-gray-300 dark:text-gray-700 hover:text-brand-gold/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nội dung</label>
                    <textarea 
                      rows="4" 
                      className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition"
                      placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm..."
                      value={newReview.BinhLuan}
                      onChange={(e) => setNewReview({...newReview, BinhLuan: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold to-[#d4af37] text-black font-bold uppercase tracking-wider text-sm h-12 rounded-xl shadow-lg hover:shadow-brand-gold/20 transition-all disabled:opacity-70"
                  >
                    {isSubmitting ? 'Đang gửi...' : (
                      <>
                        <Send className="w-4 h-4" /> Gửi đánh giá
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
