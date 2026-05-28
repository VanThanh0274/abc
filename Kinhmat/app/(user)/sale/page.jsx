'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Gift, Clock, Phone, Globe, Facebook, ChevronRight, Percent, Tag, Zap } from 'lucide-react';

export default function SalePage() {
  useEffect(() => {
    document.title = "Ưu đãi - Kính Mắt Luxury";
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans pb-16">
      
      {/* Hero Banner */}
      <div className="relative w-full h-[400px] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img 
            src="/images/sale.jpg" 
            alt="Sale Banner" 
            className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
            <span className="inline-block py-1.5 px-4 bg-brand-gold text-black font-bold tracking-widest text-sm rounded-full mb-4 animate-bounce">
                CHƯƠNG TRÌNH KHUYẾN MẠI
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase tracking-tight leading-tight mb-6 text-shadow-lg">
                SALE TƯNG BỪNG <br/><span className="text-brand-gold">MỪNG NĂM MỚI</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 font-medium max-w-2xl mx-auto">
                Mua 1 Được 2 - Thay đổi phong cách chưa bao giờ dễ dàng và tiết kiệm đến thế!
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content (Left) */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Article Card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-750">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <Gift className="text-brand-gold w-8 h-8" />
                        PHÁ BỎ GIỚI HẠN BẢN THÂN
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6">
                        Hưởng ứng mùa tựu trường và năm mới, Luxury Optic kính gửi đến quý khách hàng event <strong className="text-brand-gold">“Mua 1 Được 5”</strong>. Với mong muốn dành tặng những phần quà ý nghĩa tới khách hàng nhân dịp năm mới, chúng tôi đã tâm huyết xây dựng & cho ra mắt chương trình <strong className="text-red-500 dark:text-red-400">“Mua 1 được 2”</strong>.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                        Đây là một cơ hội tuyệt vời giúp mọi người thay đổi đa dạng style trong năm mới với chi phí cực nhỏ. Hãy đến với cửa hàng của chúng tôi, phá bỏ ngay “giới hạn” của bản thân nhé!
                    </p>
                </div>

                {/* Offer Details */}
                <div className="bg-gradient-to-br from-brand-gold/20 to-yellow-500/10 dark:from-brand-gold/10 dark:to-transparent rounded-3xl p-8 border border-brand-gold/30 shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 uppercase flex items-center gap-3">
                        <Zap className="text-brand-gold" fill="currentColor"/>
                        Chi tiết quà tặng
                    </h3>
                    <ul className="space-y-4">
                        {[
                            "Mua 1 gọng tặng 1 kính râm thời trang cao cấp",
                            "Với hóa đơn gọng trên 500k, tặng ngay combo nước ngâm + hộp đựng xịn sò",
                            "Giảm ngay 30% cho khách hàng không lấy gói bảo hành",
                            "Miễn phí đo khám mắt với hệ thống máy móc nhập khẩu"
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-start gap-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700">
                                <div className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-sm text-brand-gold shrink-0 mt-0.5">
                                    <Tag size={18} />
                                </div>
                                <span className="text-gray-800 dark:text-gray-200 font-medium text-lg">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Sidebar (Right) */}
            <div className="lg:col-span-1 space-y-8">
                
                {/* Contact Widget */}
                <div className="bg-gray-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-gold/20 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <h3 className="text-xl font-bold uppercase mb-6 tracking-wide border-b border-gray-700 pb-4">
                        Trân Trọng Thông Báo
                    </h3>
                    
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <div className="bg-gray-800 p-3 rounded-xl text-brand-gold">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Thời gian áp dụng</p>
                                <p className="font-semibold">7:30 – 21:30 hàng ngày</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="bg-gray-800 p-3 rounded-xl text-brand-gold">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Hotline tư vấn</p>
                                <p className="font-bold text-brand-gold">0937 876 001</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-gray-800 p-3 rounded-xl text-brand-gold">
                                <Globe size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Website</p>
                                <Link href="/" className="font-medium hover:text-brand-gold transition-colors">luxuryoptic.com</Link>
                            </div>
                        </div>
                    </div>

                    <Link href="/listproduct" className="mt-8 w-full block bg-brand-gold text-black text-center font-bold py-4 rounded-xl hover:bg-yellow-500 transition-colors shadow-[0_0_15px_rgba(197,168,128,0.4)]">
                        MUA SẮM NGAY
                    </Link>
                </div>

                {/* Banner Ad */}
                <div className="rounded-3xl overflow-hidden shadow-xl group relative cursor-pointer">
                    <img src="/images/sale.jpg" alt="Promo" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                        <div className="text-white">
                            <p className="font-bold text-lg">Giảm thêm 10%</p>
                            <p className="text-sm text-gray-300">Dành cho VIP Member</p>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
      </div>

    </div>
  );
}
