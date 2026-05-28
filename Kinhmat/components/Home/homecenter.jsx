"use client";
import React from "react";
import { motion } from "framer-motion";
import { UserCheck, Phone, CalendarDays } from "lucide-react";
import { toast } from "react-toastify";

export default function Homecenter() {
    const handleRegister = (e) => {
        e.preventDefault();
        toast.success("Đăng ký đặt lịch khám mắt thành công! Đội ngũ tư vấn sẽ liên hệ bạn sớm.");
    };

    return (
        <div className="w-full bg-luxury-cream dark:bg-[#0c0d0f] transition-colors duration-150 py-12 space-y-20 font-sans text-gray-800 dark:text-gray-200">
            
            {/* 1. Brands Logo Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 dark:opacity-40">
                    <img src="/images/brand1.png" alt="Brand 1" className="h-10 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition duration-300 cursor-pointer" />
                    <img src="/images/brand2.jpg" alt="Brand 2" className="h-10 md:h-12 w-auto object-contain rounded-lg grayscale hover:grayscale-0 transition duration-300 cursor-pointer" />
                    <img src="/images/brand3.jpg" alt="Brand 3" className="h-10 md:h-12 w-auto object-contain rounded-lg grayscale hover:grayscale-0 transition duration-300 cursor-pointer" />
                    <img src="/images/brand4.png" alt="Brand 4" className="h-10 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition duration-300 cursor-pointer" />
                    <img src="/images/brand5.jpeg" alt="Brand 5" className="h-10 md:h-12 w-auto object-contain rounded-lg grayscale hover:grayscale-0 transition duration-300 cursor-pointer" />
                </div>
            </div>

            {/* 2. Intro Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Text Column */}
                    <motion.div 
                        className="lg:col-span-7 space-y-6"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="space-y-2">
                            <span className="text-xs font-bold tracking-widest text-brand-gold uppercase">Giới thiệu cửa hàng</span>
                            <h3 className="text-3xl sm:text-4xl font-extrabold font-heading text-gray-900 dark:text-white leading-tight">
                                TÀI SẢN LỚN NHẤT CỦA DOANH NGHIỆP LÀ KHÁCH HÀNG
                            </h3>
                        </div>
                        
                        <p className="text-brand-gold italic font-medium text-sm border-l-2 border-brand-gold pl-4 py-1">
                            Kính mắt DESMON – Trải nghiệm chất lượng kính mắt theo tiêu chuẩn quốc tế
                        </p>
                        
                        <div className="space-y-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-medium">
                            <p>
                                Với 15 năm kinh nghiệm trên thị trường kính mắt Việt, DESMON tự hào là đơn vị
                                cung cấp các sản phẩm và dịch vụ về kính mắt uy tín tại Việt Nam. Các sản phẩm
                                được tuyển chọn kỹ lưỡng, đạt độ tinh xảo và chất lượng cao, hướng đến trải
                                nghiệm tốt nhất cho khách hàng.
                            </p>
                            <p>
                                Là một sản phẩm về sức khoẻ con người, chúng tôi “kinh doanh dựa trên sự tử tế”
                                lấy khách hàng là trọng tâm, không ngừng thay đổi cải tiến sản phẩm cũng như
                                dịch vụ đi kèm. Ngoài ra, hệ thống kỹ thuật viên giàu kinh nghiệm, trang thiết
                                bị máy móc hiện đại cùng dịch vụ tư vấn tận tâm giúp DESMON trở thành địa chỉ
                                tin cậy đồng hành cùng hàng triệu khách hàng Việt.
                            </p>
                        </div>
                    </motion.div>

                    {/* Image Column */}
                    <motion.div 
                        className="lg:col-span-5 flex justify-center"
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="relative group overflow-hidden rounded-2xl shadow-xl border border-gray-200 dark:border-white/5 max-w-sm w-full bg-white dark:bg-black/20">
                            <img 
                                src="/images/intro.png" 
                                alt="Giới thiệu DESMON" 
                                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 rounded-2xl" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* 3. Benefit Cards Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Benefit Card 1 */}
                    <motion.div 
                        className="bg-white dark:bg-black/20 border border-gray-150 dark:border-white/5 rounded-2xl p-8 text-center space-y-4 shadow-md transition-all duration-150 cursor-pointer"
                        whileHover={{ y: -4, shadow: "0 20px 25px -5px rgba(197,168,128,0.08)" }}
                    >
                        <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-2">
                            <img src="/images/col1.png" alt="Mẫu mã đa dạng" className="h-8 w-8 object-contain" />
                        </div>
                        <h4 className="text-lg font-bold font-heading text-brand-gold tracking-wide">MẪU MÃ ĐA DẠNG</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                            Thấu hiểu thị hiếu khách hàng, mẫu mã của DESMON đa dạng, phù hợp với nhiều yêu cầu khác nhau.
                        </p>
                    </motion.div>

                    {/* Benefit Card 2 */}
                    <motion.div 
                        className="bg-white dark:bg-black/20 border border-gray-150 dark:border-white/5 rounded-2xl p-8 text-center space-y-4 shadow-md transition-all duration-150 cursor-pointer"
                        whileHover={{ y: -4, shadow: "0 20px 25px -5px rgba(197,168,128,0.08)" }}
                    >
                        <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-2">
                            <img src="/images/col-2.png" alt="Chất lượng đi đầu" className="h-8 w-8 object-contain" />
                        </div>
                        <h4 className="text-lg font-bold font-heading text-brand-gold tracking-wide">CHẤT LƯỢNG ĐI ĐẦU</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                            Các sản phẩm được chọn lựa kỹ lưỡng, độ tinh xảo cao đi cùng chuyên viên kinh nghiệm và máy móc tiên tiến.
                        </p>
                    </motion.div>

                    {/* Benefit Card 3 */}
                    <motion.div 
                        className="bg-white dark:bg-black/20 border border-gray-150 dark:border-white/5 rounded-2xl p-8 text-center space-y-4 shadow-md transition-all duration-150 cursor-pointer"
                        whileHover={{ y: -4, shadow: "0 20px 25px -5px rgba(197,168,128,0.08)" }}
                    >
                        <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-2">
                            <img src="/images/col-3.png" alt="Giá cả hợp lý" className="h-8 w-8 object-contain" />
                        </div>
                        <h4 className="text-lg font-bold font-heading text-brand-gold tracking-wide">GIÁ CẢ HỢP LÝ</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                            Mức giá cạnh tranh tương xứng với chất lượng, nhiều chương trình ưu đãi và chế độ bảo hành hậu mãi.
                        </p>
                    </motion.div>

                </div>
            </div>

            {/* 4. Eye Examination Registration Form */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    className="bg-white/50 dark:bg-black/10 backdrop-blur-2xl border border-gray-150 dark:border-white/5 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 lg:p-12 items-center"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Left: Illustration Image */}
                    <div className="lg:col-span-6 relative overflow-hidden rounded-2xl shadow-lg border border-gray-250/20 max-w-md mx-auto w-full group">
                        <img 
                            src="/images/dki-1024x514.jpg" 
                            alt="Khám mắt định kỳ" 
                            className="w-full h-auto object-cover transform group-hover:scale-102 transition duration-500 rounded-2xl" 
                        />
                        <div className="absolute inset-0 bg-brand-gold/5 mix-blend-overlay"></div>
                    </div>

                    {/* Right: Registration Form */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold tracking-widest text-brand-gold uppercase">Dịch vụ chăm sóc mắt</span>
                            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 dark:text-white tracking-wide uppercase">
                                Đăng Ký Khám Mắt Miễn Phí
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                Quý khách vui lòng đặt lịch khám mắt trước 30 phút để đội ngũ chuyên viên của Kính Mắt Luxury chuẩn bị phục vụ chu đáo nhất.
                            </p>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-4 font-sans text-sm font-medium">
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-gray-500"><UserCheck className="text-base" /></span>
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full bg-white/[0.04] dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-brand-gold/60 rounded-xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:ring-1 focus:ring-brand-gold/30 text-gray-800 dark:text-white placeholder-gray-500" 
                                    placeholder="Họ và tên quý khách" 
                                />
                            </div>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-gray-500"><Phone className="text-base" /></span>
                                <input 
                                    type="tel" 
                                    required 
                                    className="w-full bg-white/[0.04] dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-brand-gold/60 rounded-xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:ring-1 focus:ring-brand-gold/30 text-gray-800 dark:text-white placeholder-gray-500" 
                                    placeholder="Số điện thoại liên hệ" 
                                />
                            </div>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-gray-500"><CalendarDays className="text-base" /></span>
                                <select 
                                    required 
                                    className="w-full bg-white/[0.04] dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-brand-gold/60 rounded-xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:ring-1 focus:ring-brand-gold/30 text-gray-800 dark:text-white placeholder-gray-500 appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-luxury-cream dark:bg-brand-dark">Chọn khung giờ khám</option>
                                    <option value="morning" className="bg-luxury-cream dark:bg-brand-dark">Buổi sáng (8h00 - 11h30)</option>
                                    <option value="afternoon" className="bg-luxury-cream dark:bg-brand-dark">Buổi chiều (13h30 - 17h30)</option>
                                    <option value="evening" className="bg-luxury-cream dark:bg-brand-dark">Buổi tối (18h00 - 20h30)</option>
                                </select>
                                <div className="absolute right-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-500"></div>
                            </div>

                            <motion.button 
                                type="submit" 
                                className="w-full py-3.5 rounded-xl text-black font-heading font-bold text-xs tracking-widest bg-gradient-to-r from-brand-gold via-[#e8d7c0] to-brand-gold-hover hover:brightness-110 active:brightness-95 transition-all duration-150 cursor-pointer shadow-lg shadow-brand-gold/15 mt-2"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ duration: 0.1 }}
                            >
                                ĐĂNG KÝ HẸN LỊCH KHÁM
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </div>

            {/* 5. Top Partners Logo Bar */}
            <div className="bg-white/30 dark:bg-black/10 py-10 transition-colors duration-150">
                <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
                    <p className="text-[10px] font-bold tracking-widest text-brand-gold uppercase">Đối tác hàng đầu</p>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50 dark:opacity-30">
                        <img src="/images/doitac5.png" alt="Partner 5" className="h-6 md:h-8 w-auto object-contain grayscale hover:grayscale-0 transition duration-300" />
                        <img src="/images/doitac4.png" alt="Partner 4" className="h-6 md:h-8 w-auto object-contain grayscale hover:grayscale-0 transition duration-300" />
                        <img src="/images/doitac1.png" alt="Partner 1" className="h-6 md:h-8 w-auto object-contain grayscale hover:grayscale-0 transition duration-300" />
                        <img src="/images/doitac2.jpg" alt="Partner 2" className="h-6 md:h-8 w-auto object-contain grayscale hover:grayscale-0 transition duration-300 rounded-md" />
                        <img src="/images/doitac3.jpg" alt="Partner 3" className="h-6 md:h-8 w-auto object-contain grayscale hover:grayscale-0 transition duration-300 rounded-md" />
                    </div>
                </div>
            </div>

        </div>
    );
}