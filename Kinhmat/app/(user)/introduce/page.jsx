'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Globe, Award, Heart } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function GioiThieu() {
    return (
        <div className="bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 overflow-hidden">
            
            {/* Hero Section */}
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src="/images/intro/gioithieu1.jpg" 
                        alt="Luxury Eyewear" 
                        layout="fill"
                        objectFit="cover"
                        className="brightness-75 scale-105"
                        priority
                        onError={(e) => { e.target.onerror = null; e.target.src = '/images/sale.jpg'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-gray-950"></div>
                </div>
                
                <motion.div 
                    className="relative z-10 text-center px-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                >
                    <Image 
                        src="/images/logo3.png" 
                        alt="Logo" 
                        width={250} 
                        height={80} 
                        className="mx-auto mb-8 brightness-0 invert opacity-90"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-2 text-shadow-xl">
                        BOLD
                    </h1>
                    <h2 className="text-4xl md:text-6xl font-light text-brand-gold uppercase tracking-widest">
                        LIKE YOU
                    </h2>
                </motion.div>
            </section>

            {/* Main Video Section */}
            <section className="relative w-full max-w-7xl mx-auto -mt-32 z-20 px-4 sm:px-6 lg:px-8 mb-24">
                <motion.div 
                    className="rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-800 bg-gray-900 aspect-video relative group"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                >
                    <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                        <source src="/images/intro/cut-1-20230818045639-kkb4i.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                </motion.div>
            </section>

            {/* A Dream of Italy Section */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeIn}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 text-brand-gold text-sm font-bold uppercase tracking-widest">
                                <Award size={16} /> Di sản Châu Âu
                            </div>
                            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                                A Dream of <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-600 font-serif italic">Italy</span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                Được thiết kế tại Ý bởi những nghệ nhân có kinh nghiệm hàng chục năm. Mỗi chiếc kính không chỉ là một phụ kiện, mà là một tác phẩm nghệ thuật tôn vinh vẻ đẹp khuôn mặt bạn.
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                Dù đó là một cặp kính râm thanh lịch dạo phố hay gọng kính cận tri thức, Luxury Optic cam kết mang đến chất lượng hoàn mỹ và trải nghiệm đeo thoải mái nhất.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4 relative">
                            <motion.div 
                                className="space-y-4 pt-12"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <img loading="lazy" src="/images/intro/gioithieu3.jpg" alt="Italian Design" className="rounded-2xl shadow-xl w-full h-auto object-cover aspect-[4/5]" onError={(e) => { e.target.onerror = null; e.target.src = '/images/sale.jpg'; }} />
                            </motion.div>
                            <motion.div 
                                className="space-y-4"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <img loading="lazy" src="/images/intro/gioithieu4.jpg" alt="Craftsmanship" className="rounded-2xl shadow-xl w-full h-auto object-cover aspect-[4/5]" onError={(e) => { e.target.onerror = null; e.target.src = '/images/sale.jpg'; }} />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Worldwide Presence Section */}
            <section className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <h2 className="text-[80px] md:text-[120px] font-black text-gray-100 dark:text-gray-800 uppercase leading-none opacity-50 tracking-tighter">
                                Worldwide
                            </h2>
                            <h3 className="text-4xl md:text-5xl font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-900 dark:text-white uppercase tracking-widest">
                                Presence
                            </h3>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div className="md:col-span-2 rounded-3xl overflow-hidden shadow-2xl" variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                            <img loading="lazy" src="/images/intro/gioithieu6.png" alt="Global Stores" className="w-full h-full object-cover min-h-[400px]" onError={(e) => { e.target.onerror = null; e.target.src = '/images/sale.jpg'; }} />
                        </motion.div>
                        <motion.div className="bg-gray-900 rounded-3xl p-8 flex flex-col justify-center text-white shadow-2xl relative overflow-hidden" variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/20 blur-3xl rounded-full"></div>
                            <Globe size={48} className="text-brand-gold mb-6" />
                            <h4 className="text-2xl font-bold mb-4">Mạng lưới toàn cầu</h4>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                Với hơn 50 cửa hàng phủ sóng tại các thành phố lớn trên toàn thế giới, chúng tôi luôn sẵn sàng phục vụ nhu cầu làm đẹp và bảo vệ đôi mắt của bạn.
                            </p>
                            <ul className="space-y-3">
                                {['Hà Nội', 'TP. Hồ Chí Minh', 'Tokyo', 'Paris', 'New York'].map((city, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div>
                                        {city}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Brand Ambassador Section */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 flex gap-6 justify-center">
                            <motion.img 
                                src="/images/intro/gioithieu8.jpg" 
                                alt="Ambassador 1" 
                                className="w-[45%] rounded-[40px] shadow-2xl object-cover"
                                initial={{ opacity: 0, rotate: -5, x: -20 }}
                                whileInView={{ opacity: 1, rotate: 0, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                onError={(e) => { e.target.onerror = null; e.target.src = '/images/sale.jpg'; }}
                            />
                            <motion.img 
                                src="/images/intro/gioithieu9.jpg" 
                                alt="Ambassador 2" 
                                className="w-[45%] rounded-[40px] shadow-2xl object-cover mt-12"
                                initial={{ opacity: 0, rotate: 5, x: 20 }}
                                whileInView={{ opacity: 1, rotate: 0, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                onError={(e) => { e.target.onerror = null; e.target.src = '/images/sale.jpg'; }}
                            />
                        </div>
                        
                        <motion.div 
                            className="order-1 lg:order-2 space-y-6"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 text-sm font-bold uppercase tracking-widest">
                                <Heart size={16} /> Gương mặt đại diện
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                                Brand Ambassador <br/>
                                <span className="text-brand-gold">Urassaya Sperbund</span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                Gặp gỡ đại sứ thương hiệu toàn cầu mới nhất của chúng tôi. Được lựa chọn nhờ sự tinh tế trong phong cách và sự quyến rũ tự nhiên, cô ấy đại diện hoàn hảo cho tinh thần của Luxury Optic.
                            </p>
                            <button className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-brand-gold dark:hover:bg-brand-gold hover:text-black transition-colors duration-300">
                                KHÁM PHÁ BỘ SƯU TẬP
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

        </div>
    );
}
