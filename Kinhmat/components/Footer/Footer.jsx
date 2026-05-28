import React from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Truck
} from 'lucide-react';
// import "./style.css"; // Optional, we will use Tailwind instead

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 pt-16 border-t-4 border-brand-gold relative overflow-hidden font-sans">
      
      {/* Background Accent */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-gray-800">
          <div className="flex items-center gap-4 bg-gray-800/30 p-4 rounded-2xl border border-gray-800 hover:border-brand-gold/30 transition-colors">
            <div className="bg-brand-gold/10 p-3 rounded-full text-brand-gold">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-wide">Bảo hành 12 tháng</h4>
              <p className="text-xs text-gray-400 mt-1">Lỗi 1 đổi 1 từ nhà sản xuất</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-gray-800/30 p-4 rounded-2xl border border-gray-800 hover:border-brand-gold/30 transition-colors">
            <div className="bg-brand-gold/10 p-3 rounded-full text-brand-gold">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-wide">Miễn phí vận chuyển</h4>
              <p className="text-xs text-gray-400 mt-1">Giao hàng tận nơi toàn quốc</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-gray-800/30 p-4 rounded-2xl border border-gray-800 hover:border-brand-gold/30 transition-colors">
            <div className="bg-brand-gold/10 p-3 rounded-full text-brand-gold">
              <CreditCard size={24} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-wide">Thanh toán an toàn</h4>
              <p className="text-xs text-gray-400 mt-1">COD và Ví điện tử bảo mật</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          
          {/* Column 1: About & Contact */}
          <div className="space-y-6">
            <div>
              <img src="/images/logo3.png" alt="Luxury Optic" className="h-12 w-auto mb-6 brightness-0 invert opacity-90" />
              <p className="text-sm text-gray-400 leading-relaxed">
                Thương hiệu kính mắt cao cấp hàng đầu, mang đến cho bạn trải nghiệm hoàn hảo về thị lực và phong cách sống đẳng cấp.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 group">
                <MapPin size={18} className="text-brand-gold mt-1 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-gray-300">65A - 67 - 69 Hàm Nghi, <br/>TP. Quy Nhơn, Bình Định</span>
              </div>
              <div className="flex items-center gap-3 group">
                <Phone size={18} className="text-brand-gold group-hover:scale-110 transition-transform" />
                <a href="tel:0937876001" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">0937 876 001 - 0933 807 137</a>
              </div>
              <div className="flex items-center gap-3 group">
                <Mail size={18} className="text-brand-gold group-hover:scale-110 transition-transform" />
                <a href="mailto:Desmonshop@gmail.com" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Desmonshop@gmail.com</a>
              </div>
              <div className="flex items-center gap-3 group">
                <Clock size={18} className="text-brand-gold group-hover:scale-110 transition-transform" />
                <span className="text-sm text-gray-300">Tất cả các ngày: 7:30 – 22:00</span>
              </div>
            </div>
          </div>

          {/* Column 2: Customer Guide */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg tracking-wide uppercase relative inline-block">
              Hỗ Trợ Khách Hàng
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-brand-gold rounded-full"></span>
            </h3>
            <ul className="space-y-3 mt-4">
              {['Lưu ý nhanh', 'Chọn kính theo khuôn mặt', 'Hướng dẫn mua hàng', 'Phương thức thanh toán', 'Quy trình bảo hành & đổi trả', 'Chính sách bảo mật'].map((item, idx) => (
                <li key={idx}>
                  <Link href="#" className="text-sm text-gray-400 hover:text-brand-gold flex items-center gap-2 group transition-colors">
                    <ChevronRight size={14} className="text-gray-600 group-hover:text-brand-gold group-hover:translate-x-1 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg tracking-wide uppercase relative inline-block">
              Danh Mục Sản Phẩm
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-brand-gold rounded-full"></span>
            </h3>
            <ul className="space-y-3 mt-4">
              {['Kính mắt nam', 'Kính mắt nữ', 'Gọng kính cận', 'Tròng kính cao cấp', 'Kính râm phân cực', 'Bộ sưu tập mới'].map((item, idx) => (
                <li key={idx}>
                  <Link href="#" className="text-sm text-gray-400 hover:text-brand-gold flex items-center gap-2 group transition-colors">
                    <ChevronRight size={14} className="text-gray-600 group-hover:text-brand-gold group-hover:translate-x-1 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Map & Social */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg tracking-wide uppercase relative inline-block">
              Kết Nối Với Chúng Tôi
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-brand-gold rounded-full"></span>
            </h3>
            <div className="flex gap-4 mt-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#1877f2] hover:text-white transition-all shadow-lg hover:-translate-y-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gradient-to-tr hover:from-[#fd5949] hover:to-[#d6249f] hover:text-white transition-all shadow-lg hover:-translate-y-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#ff0000] hover:text-white transition-all shadow-lg hover:-translate-y-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
            
            <div className="mt-6 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 relative">
                <div className="absolute inset-0 bg-brand-gold/10 pointer-events-none z-10 mix-blend-overlay"></div>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.2951717808264!2d109.21528621483057!3d13.761034490341775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x316f6ceba321b0d7%3A0x6e24df61ff5c0d1c!2zNjUgSMOgbSBOZ2hpLCBOZ8O0IE3DonksIFRow6BuaCBwaOG7kSBRdXkgTmjGoW4sIELDrG5oIMSQ4buLbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1655883204918!5m2!1svi!2s"
                    width="100%"
                    height="140"
                    style={{ border: 0, filter: 'contrast(1.1) brightness(0.9)' }} 
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-800 bg-black py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs sm:text-sm font-medium text-center md:text-left">
            &copy; {new Date().getFullYear()} Kính Mắt Luxury Optic (Desmon Store). All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <Link href="#" className="hover:text-brand-gold transition-colors">Điều khoản dịch vụ</Link>
            <Link href="#" className="hover:text-brand-gold transition-colors">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
