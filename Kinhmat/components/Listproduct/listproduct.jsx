"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { filterProduct, getListProductCategory, searchProduct } from '../../services/product';
import { useState, useEffect } from 'react';
import { getAllCategory } from '../../services/category';
import { getCategoryContent } from './getCategoryContent';
import ReactPaginate from 'react-paginate';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Listproduct() {
  const [categories, setCategories] = useState([]);
  const [product, setproduct] = useState([]);
  const [tranghientai, settranghientai] = useState(0);
  const [tongtrang, settongtrang] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get('id');
  const tk = searchParams.get('search');
  const chatlieu = searchParams.get('chatlieu');
  const kieudang = searchParams.get('kieudang');

  const handlePageClick = (event) => {
    settranghientai(event.selected);
  };

  // ===== FETCH CATEGORY =====
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategory();
        if (data) setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // ===== FETCH PRODUCT =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const data = await getListProductCategory(id, tranghientai + 1, 6);
          setproduct(data.data || []);
          settongtrang(data.total || 0);
          return;
        }

        if (tk) {
          const dataSearch = await searchProduct(tk);
          setproduct(dataSearch.data || []);
          settongtrang(Math.ceil((dataSearch.data || []).length / 6));
          return;
        }

        if (chatlieu || kieudang) {
          const dataFilter = await filterProduct(chatlieu || '', kieudang || '');
          setproduct(dataFilter || []);
          settongtrang(Math.ceil((dataFilter || []).length / 6));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, [id, tk, chatlieu, kieudang, tranghientai]);

  return (
    <div className="w-full space-y-8 font-sans">
      
      {/* Category Rich Presentation Block */}
      {id && (
        <motion.div 
          className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="prose prose-sm max-w-none text-gray-600 [&>h1]:text-2xl [&>h1]:font-extrabold [&>h1]:font-heading [&>h1]:text-gray-900 [&>h1]:mb-2 [&>p]:text-sm [&>p]:leading-relaxed">
            {getCategoryContent(id, categories)}
          </div>
        </motion.div>
      )}

      {/* Catalog Grid */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          <AnimatePresence mode="wait">
            {product.map((sp, idx) => (
              <motion.div
                key={sp.id}
                className="flex flex-col rounded-2xl bg-white border border-gray-150 shadow-md overflow-hidden p-4 group cursor-pointer w-full relative justify-between h-[360px]"
                onClick={() => router.push(`/products?id=${sp.id}`)}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
                whileHover={{ y: -4, shadow: "0 15px 25px -5px rgba(197,168,128,0.08)" }}
              >
                {/* Badge SALE */}
                <span className="absolute top-3 left-3 bg-brand-gold text-black text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border border-brand-gold/10 z-10 flex items-center gap-1 shadow-md">
                  <Sparkles className="text-[10px]" /> SALE!
                </span>

                {/* Product Image */}
                <div className="h-48 w-full bg-gray-50/50 flex items-center justify-center rounded-xl overflow-hidden relative border border-gray-150 flex-shrink-0">
                  <img
                    src={`http://localhost:5273/images/product/${sp.anh || 'default.jpg'}`}
                    alt={sp.ten}
                    className="h-36 w-auto object-contain transform group-hover:scale-103 transition duration-500 p-2"
                  />
                  <div className="absolute inset-0 bg-brand-gold/[0.01] mix-blend-overlay"></div>
                </div>

                {/* Title and Pricing */}
                <div className="space-y-1.5 pt-4 flex-grow flex flex-col justify-end">
                  <h3 className="font-semibold text-gray-800 text-xs sm:text-sm text-center truncate group-hover:text-brand-gold transition duration-150 leading-snug">
                    {sp.ten}
                  </h3>
                  <div className="text-center">
                    <span className="font-bold text-sm text-brand-gold tracking-wide">
                      {sp.giaban.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>

                {/* Hover border glow highlight */}
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-brand-gold/25 to-transparent absolute bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </motion.div>
            ))}
          </AnimatePresence>

          {product.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-500 font-sans">
              Không tìm thấy sản phẩm kính mắt nào phù hợp.
            </div>
          )}
        </div>

        {/* Custom Pagination Style (ReactPaginate integration) */}
        {tongtrang > 1 && (
          <div className="flex justify-center pt-8 border-t border-gray-200">
            <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              pageCount={tongtrang}
              previousLabel="<"
              containerClassName="pagination flex items-center gap-1.5 list-none select-none text-xs font-semibold font-heading"
              pageLinkClassName="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 hover:border-brand-gold hover:text-brand-gold transition duration-150"
              previousLinkClassName="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 hover:border-brand-gold hover:text-brand-gold transition duration-150"
              nextLinkClassName="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 hover:border-brand-gold hover:text-brand-gold transition duration-150"
              activeLinkClassName="!border-brand-gold !bg-brand-gold !text-black shadow-md shadow-brand-gold/15"
              forcePage={tranghientai}
            />
          </div>
        )}
      </div>

    </div>
  );
}
