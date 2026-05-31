"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ProductRelated({ productId }) {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (!productId) return;
    
    const fetchRelated = async () => {
      try {
        const res = await fetch(`http://localhost:5273/api/Ctr_Kinhmat_user/Related/${productId}`);
        const data = await res.json();
        setRelatedProducts(data);
      } catch (error) {
        console.error("Error fetching related products", error);
      }
    };
    
    fetchRelated();
  }, [productId]);

  if (relatedProducts.length === 0) return null;

  return (
    <div className="w-full bg-luxury-cream dark:bg-[#0c0d0f] transition-colors duration-150 py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-white mb-8 border-l-4 border-brand-gold pl-4 tracking-wide uppercase">
          Sản phẩm tương tự
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((item, index) => (
            <motion.div 
              key={item.id}
              className="bg-white dark:bg-black/20 rounded-2xl p-4 shadow-lg flex flex-col group overflow-hidden border border-gray-100 dark:border-white/5 relative hover:border-brand-gold/30 transition duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={`/products?id=${item.id}`} className="flex-grow flex flex-col">
                <div className="relative h-48 w-full flex items-center justify-center bg-gray-50 dark:bg-white/[0.02] rounded-xl overflow-hidden mb-4">
                  <img 
                    src={`http://localhost:5273/images/product/${item.anh || 'default.jpg'}`}
                    alt={item.ten}
                    className="max-h-full w-auto object-contain transform group-hover:scale-105 transition duration-500"
                  />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[40px] group-hover:text-brand-gold transition duration-200">
                  {item.ten}
                </h3>
                <div className="mt-auto pt-3 flex justify-between items-end">
                  <span className="text-brand-gold font-bold text-lg">
                    {item.giaban?.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
