"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getTotalCategory } from "../../services/category";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Quantityproduct() {
  const [tongKinhCan, setTongKinhCan] = useState({ sl: 0, id: 1 });
  const [tongKinhRam, setTongKinhRam] = useState({ sl: 0, id: 2 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTotalCategory("Gọng kính");
        const data1 = await getTotalCategory("Kính râm");
        if (data) setTongKinhCan(data);
        if (data1) setTongKinhRam(data1);
      } catch (e) {
        console.error("Lỗi lấy số lượng sản phẩm:", e);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full bg-luxury-cream dark:bg-[#0c0d0f] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-150">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Sunglasses (Kính râm) Card */}
        <motion.div 
          className="relative group overflow-hidden rounded-2xl bg-white dark:bg-black/20 border border-gray-150 dark:border-white/5 shadow-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 cursor-pointer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ y: -4, shadow: "0 20px 25px -5px rgba(197,168,128,0.1)" }}
        >
          {/* Image Container */}
          <div className="w-40 sm:w-48 h-32 relative flex-shrink-0 flex items-center justify-center overflow-hidden rounded-xl bg-luxury-cream dark:bg-brand-dark/50">
            <Image
              src="/images/kinh-ram.png"
              alt="Kính râm"
              width={200}
              height={150}
              className="object-contain transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          {/* Content */}
          <div className="flex-grow text-center sm:text-left space-y-2">
            <span className="text-[10px] font-bold tracking-widest text-brand-gold uppercase">Collection</span>
            <h2 className="text-2xl font-extrabold font-heading text-gray-900 dark:text-white tracking-wide">KÍNH RÂM</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{tongKinhRam.sl || 0} SẢN PHẨM SẴN CÓ</p>
            
            <Link href={`/listproduct?id=${tongKinhRam.id}`} className="inline-block pt-2">
              <motion.button 
                className="inline-flex items-center gap-2 py-2 px-5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-brand-gold to-brand-gold-hover hover:brightness-110 active:brightness-95 transition-all duration-150 cursor-pointer shadow-md shadow-brand-gold/10"
                whileTap={{ scale: 0.97 }}
              >
                <span>Xem ngay</span>
                <ArrowRight className="text-sm" />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Prescription Glasses (Kính cận) Card */}
        <motion.div 
          className="relative group overflow-hidden rounded-2xl bg-white dark:bg-black/20 border border-gray-150 dark:border-white/5 shadow-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 cursor-pointer"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ y: -4, shadow: "0 20px 25px -5px rgba(197,168,128,0.1)" }}
        >
          {/* Image Container */}
          <div className="w-40 sm:w-48 h-32 relative flex-shrink-0 flex items-center justify-center overflow-hidden rounded-xl bg-luxury-cream dark:bg-brand-dark/50">
            <Image
              src="/images/Artboard-1-1.png"
              alt="Kính cận"
              width={200}
              height={150}
              className="object-contain transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          {/* Content */}
          <div className="flex-grow text-center sm:text-left space-y-2">
            <span className="text-[10px] font-bold tracking-widest text-brand-gold uppercase">Collection</span>
            <h2 className="text-2xl font-extrabold font-heading text-gray-900 dark:text-white tracking-wide">KÍNH CẬN</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{tongKinhCan.sl || 0} SẢN PHẨM SẴN CÓ</p>
            
            <Link href={`/listproduct?id=${tongKinhCan.id}`} className="inline-block pt-2">
              <motion.button 
                className="inline-flex items-center gap-2 py-2 px-5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-brand-gold to-brand-gold-hover hover:brightness-110 active:brightness-95 transition-all duration-150 cursor-pointer shadow-md shadow-brand-gold/10"
                whileTap={{ scale: 0.97 }}
              >
                <span>Xem ngay</span>
                <ArrowRight className="text-sm" />
              </motion.button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
