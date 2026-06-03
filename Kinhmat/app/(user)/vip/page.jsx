'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Star, ArrowRight, CheckCircle2, Truck, Gift } from 'lucide-react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { apiUpgradeVip, apiGetprofile_byid, apiVipProgress } from '../../../services/login';
import { Getiduser } from '../../../services/auth';

export default function VipBanner() {
  const [isVip, setIsVip] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mucTieu, setMucTieu] = useState(5000000);
  
  const router = useRouter();

  const fetchVipProgress = async () => {
    try {
        const data = await apiVipProgress();
        if (data) {
            setProgress(data.tongChiTieu || 0);
            setMucTieu(data.mucTieu || 5000000);
            setIsVip(data.isVip || false);
        }
    } catch (error) {
        console.error("Lỗi lấy tiến độ VIP:", error);
    }
  }

  useEffect(() => {
    const checkStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
        const userId = Getiduser();
        if (userId) {
            await fetchVipProgress();
        }
      }
    };
    checkStatus();
  }, []);

  const handleRegisterVip = async () => {
    if (!isLoggedIn) {
      toast.info("Vui lòng đăng nhập để đăng ký hạng thành viên VIP.");
      router.push('/login');
      return;
    }
    if (progress < mucTieu) {
      toast.warn(`Bạn cần chi tiêu thêm ${(mucTieu - progress).toLocaleString()}đ nữa để đủ điều kiện nâng cấp VIP.`);
      return;
    }
    
    setLoading(true);
    try {
      await apiUpgradeVip();
      toast.success("Chúc mừng! Bạn đã chính thức trở thành Thành Viên VIP!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi nâng cấp VIP.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      {isVip && (
        <div className="bg-gradient-to-r from-gray-900 via-brand-dark to-gray-900 rounded-2xl p-6 sm:p-10 shadow-2xl border border-brand-gold/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group mb-8">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-gold/20 rounded-full blur-3xl group-hover:bg-brand-gold/30 transition-all duration-700"></div>
          
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-brand-gold/20 border border-brand-gold flex items-center justify-center flex-shrink-0">
              <Crown className="text-brand-gold w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-wide flex items-center gap-2">
                Xin chào, Thành Viên VIP <Sparkles className="text-brand-gold w-5 h-5" />
              </h3>
              <p className="text-gray-400 text-sm mb-4">Cảm ơn bạn đã đồng hành cùng Luxury Optic. Tận hưởng các đặc quyền dành riêng cho bạn!</p>
              
              <div className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-black/40 border border-brand-gold/30 px-5 py-3 rounded-xl">
                <span className="text-gray-300 text-sm font-medium">Mã giảm 20% độc quyền:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-brand-gold font-bold text-lg tracking-wider bg-brand-gold/10 px-3 py-1 rounded border border-brand-gold/20">KM002</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => router.push('/listproduct?id=1')}
            className="relative z-10 px-6 py-3 bg-brand-gold hover:bg-brand-gold-hover text-black font-bold rounded-xl shadow-[0_0_15px_rgba(197,168,128,0.3)] hover:shadow-[0_0_25px_rgba(197,168,128,0.5)] transition-all flex items-center gap-2 tracking-wider text-sm"
          >
            MUA SẮM NGAY <ArrowRight size={16} />
          </button>
        </div>
      )}

      {!isVip ? (
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden shadow-2xl relative border border-gray-800">
          
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 bg-gradient-to-l from-brand-gold to-transparent mix-blend-overlay"></div>
          <div className="absolute -left-24 -bottom-24 w-64 h-64 bg-brand-gold/20 rounded-full blur-3xl"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10">
            {/* Left Content */}
            <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/30 w-fit mb-6">
                <Star className="text-brand-gold w-4 h-4" />
                <span className="text-brand-gold text-xs font-bold uppercase tracking-widest">Đặc Quyền Thành Viên</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                Nâng Tầm Phong Cách <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-yellow-200 to-brand-gold">
                  Trở Thành VIP
                </span>
              </h2>
              
              <p className="text-gray-400 text-sm sm:text-base mb-8 leading-relaxed max-w-md">
                Gia nhập câu lạc bộ khách hàng tinh hoa của Luxury Optic để nhận vô vàn ưu đãi độc quyền và dịch vụ chăm sóc hạng nhất. 
              </p>
              
              <div className="space-y-4 mb-10">
                {[
                  "Nhận các mã giảm giá khủng chỉ dành cho VIP",
                  "Ưu tiên trải nghiệm các bộ sưu tập mới nhất",
                  "Miễn phí vận chuyển toàn quốc không giới hạn",
                  "Quà tặng tri ân đặc biệt vào ngày sinh nhật"
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="bg-brand-gold/20 rounded-full p-1">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                    </div>
                    <span className="text-gray-300 text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
              
              {isLoggedIn && (
                <div className="mb-8 p-5 bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-300 text-sm font-medium">Chi tiêu tích lũy</span>
                    <span className="text-brand-gold font-bold">{progress.toLocaleString()} / {mucTieu.toLocaleString()} đ</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-brand-gold via-yellow-200 to-brand-gold h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(100, (progress / mucTieu) * 100)}%` }}></div>
                  </div>
                  {progress < mucTieu ? (
                    <p className="text-xs text-gray-400">Bạn cần chi tiêu thêm <span className="text-white font-semibold">{(mucTieu - progress).toLocaleString()}đ</span> để mở khóa VIP.</p>
                  ) : (
                    <p className="text-xs text-green-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={14}/> Bạn đã đủ điều kiện nâng cấp VIP!
                    </p>
                  )}
                </div>
              )}
              
              <button
                onClick={handleRegisterVip}
                disabled={loading || (isLoggedIn && progress < mucTieu)}
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-brand-gold text-black font-bold rounded-xl overflow-hidden shadow-[0_0_20px_rgba(197,168,128,0.4)] hover:shadow-[0_0_30px_rgba(197,168,128,0.6)] transition-all w-fit disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative flex items-center gap-2 tracking-wider">
                  {loading ? "ĐANG XỬ LÝ..." : 
                   (!isLoggedIn ? "ĐĂNG NHẬP ĐỂ TIẾP TỤC" : 
                    (progress >= mucTieu ? "KÍCH HOẠT VIP NGAY" : "CHƯA ĐỦ ĐIỀU KIỆN")
                   )
                  } 
                  {!loading && <Crown className="w-5 h-5 animate-pulse" />}
                </span>
              </button>
            </div>
            
            {/* Right Image/Graphic */}
            <div className="hidden lg:flex items-center justify-center p-12 relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2080&auto=format&fit=crop')] bg-cover bg-center opacity-30 mask-image-fade"></div>
              
              <motion.div 
                className="relative z-10 w-80 h-96 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-2xl"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex justify-between items-start">
                  <Crown className="text-brand-gold w-10 h-10 opacity-80" />
                  <span className="text-brand-gold font-bold tracking-widest text-lg">VIP</span>
                </div>
                
                <div className="mt-auto">
                  <div className="text-gray-400 text-xs tracking-widest uppercase mb-1">Thẻ Thành Viên</div>
                  <div className="text-white font-mono text-lg tracking-widest mb-4">**** **** **** 8888</div>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>LUXURY OPTIC</span>
                    <span>MEMBER</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Active Perks Dashboard */}
           <div className="bg-gray-900 rounded-3xl p-8 sm:p-12 border border-gray-800 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl"></div>
             <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8 relative z-10">Đặc quyền đang kích hoạt</h3>
             
             <div className="space-y-6 relative z-10">
               <div className="flex items-center gap-5 p-5 bg-gray-800/80 rounded-2xl border border-gray-700/50 hover:border-brand-gold/30 transition-colors">
                  <div className="bg-green-500/20 p-4 rounded-full text-green-400"><Truck size={28}/></div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">Miễn phí vận chuyển</h4>
                    <p className="text-sm text-gray-400">Tự động áp dụng mức phí 0đ cho mọi đơn hàng tại trang thanh toán.</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-5 p-5 bg-gray-800/80 rounded-2xl border border-gray-700/50 hover:border-brand-gold/30 transition-colors">
                  <div className="bg-brand-gold/20 p-4 rounded-full text-brand-gold"><Sparkles size={28}/></div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">Ưu tiên trải nghiệm</h4>
                    <p className="text-sm text-gray-400">Truy cập sớm các bộ sưu tập giới hạn trước khi mở bán công khai.</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-5 p-5 bg-gray-800/80 rounded-2xl border border-gray-700/50 hover:border-brand-gold/30 transition-colors">
                  <div className="bg-purple-500/20 p-4 rounded-full text-purple-400"><Gift size={28}/></div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">Quà tặng sinh nhật</h4>
                    <p className="text-sm text-gray-400">Nhận quà tri ân đặc biệt vào tháng sinh nhật của bạn.</p>
                  </div>
               </div>
             </div>
           </div>

           {/* VIP Card */}
           <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-gradient-to-br from-brand-dark via-black to-brand-dark rounded-3xl border border-brand-gold/20 relative overflow-hidden shadow-2xl">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
             <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-brand-gold/10 to-transparent"></div>
             
             <motion.div 
              className="relative z-10 w-full max-w-sm h-56 sm:h-64 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="flex justify-between items-start">
                <Crown className="text-brand-gold w-12 h-12 opacity-90 drop-shadow-lg" />
                <div className="px-3 py-1 bg-brand-gold/20 border border-brand-gold/50 rounded-full">
                  <span className="text-brand-gold font-bold tracking-widest text-sm">VIP</span>
                </div>
              </div>
              
              <div className="mt-auto">
                <div className="text-gray-400 text-[10px] sm:text-xs tracking-widest uppercase mb-2">Thẻ Thành Viên</div>
                <div className="text-white font-mono text-xl sm:text-2xl tracking-widest mb-6 drop-shadow-md">**** **** **** 8888</div>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-gray-400 tracking-wider">LUXURY OPTIC</span>
                  <span className="text-brand-gold font-bold text-xs uppercase tracking-wider">Active Member</span>
                </div>
              </div>
            </motion.div>
            
            <div className="relative z-10 mt-8 text-center">
              <p className="text-gray-400 text-sm mb-2">Tình trạng thẻ: <span className="text-green-400 font-semibold">Đang hoạt động</span></p>
              <p className="text-gray-500 text-xs">Thẻ VIP có giá trị vĩnh viễn trên toàn hệ thống.</p>
            </div>
           </div>
        </div>
      )}
    </div>
  );
}
