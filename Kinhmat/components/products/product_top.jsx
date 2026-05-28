"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProductbyid } from '../../services/product';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, PhoneCall, Sparkles, CircleCheck } from 'lucide-react';

export default function ProductTop() {
  const [quantity, setQuantity] = useState(1);
  const [idcategory, setidcategory] = useState(0);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const data = await getProductbyid(id);
          setProduct(data);
          console.log('Sản phẩm:', data);
          setidcategory(data.madanhmuc);
        } catch (error) {
          console.error('Lỗi khi lấy sản phẩm:', error);
        }
      };
      fetchData();
    }
  }, [id]);

  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increase = () => {
    setQuantity(quantity + 1);
  };

  const addToCart = () => {
    if (!product) return;

    let sanphams = JSON.parse(localStorage.getItem("sanphams")) || [];
    const giaNumber = Number(product.giaban);
    const tong = giaNumber * quantity;
    const sptontai = sanphams.find(item => item.id === product.id);

    if (sptontai) {
      sptontai.soluong += quantity;
      sptontai.tong = sptontai.gia * sptontai.soluong;
      toast.success("Cập nhật số lượng sản phẩm thành công!");
    } else {
      const sp = {
        id: product.id,
        ten: product.ten,
        gia: giaNumber,
        soluong: quantity,
        tong: tong,
        anh: product.anh
      };
      sanphams.push(sp);
      toast.success("Thêm sản phẩm vào giỏ hàng thành công!");
    }

    localStorage.setItem("sanphams", JSON.stringify(sanphams));
    window.dispatchEvent(new Event('localStorageUpdated'));
  };

  return (
    <div className="w-full bg-luxury-cream dark:bg-[#0c0d0f] transition-colors duration-150 py-12 md:py-16 font-sans text-gray-800 dark:text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Side: Product Image Display (5 cols) */}
          <motion.div 
            className="lg:col-span-5 space-y-4"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-white dark:bg-black/20 border border-gray-150 dark:border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl flex items-center justify-center relative overflow-hidden group">
              {/* Product Badge */}
              <div className="absolute top-4 left-4 bg-brand-gold/10 text-brand-gold text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-brand-gold/20 flex items-center gap-1 z-10">
                <Sparkles className="text-[10px]" /> Exclusive
              </div>

              {/* Main Image */}
              <motion.img 
                className="max-h-[380px] sm:max-h-[450px] w-auto object-contain transform group-hover:scale-102 transition duration-500 p-2" 
                src={`http://localhost:5273/images/product/${product?.anh || 'default.jpg'}`} 
                alt={product?.ten} 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              <div className="absolute inset-0 bg-brand-gold/[0.01] mix-blend-overlay"></div>
            </div>
          </motion.div>

          {/* Right Side: Product Details & Specs (7 cols) */}
          <motion.div 
            className="lg:col-span-7 space-y-6"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Category / Name */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-widest text-brand-gold uppercase">
                {idcategory === 1 ? "GỌNG KÍNH THỜI TRANG" : idcategory === 2 ? "KÍNH RÂM CAO CẤP" : "PHỤ KIỆN CHÍNH HÃNG"}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-gray-900 dark:text-white tracking-wide leading-tight">
                {product?.ten}
              </h1>
            </div>

            {/* Price */}
            <div className="border-y border-gray-200 dark:border-white/5 py-4">
              <span className="text-xs text-gray-400 font-bold block mb-1">GIÁ NIÊM YẾT</span>
              <span className="text-3xl font-extrabold text-brand-gold tracking-wide">
                {product?.giaban.toLocaleString("vi-VN") || '...'} đ
              </span>
            </div>

            {/* Basic Info Bullet Points */}
            <div className="space-y-3 pl-4 border-l-2 border-brand-gold/30">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase block">Đặc điểm cơ bản:</span>
              
              {idcategory === 1 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2"><CircleCheck className="text-brand-gold text-sm flex-shrink-0" /> <span>Màu sắc: Nhiều màu</span></li>
                  <li className="flex items-center gap-2"><CircleCheck className="text-brand-gold text-sm flex-shrink-0" /> <span>Chất liệu: {product?.chatlieu || "Kim loại cao cấp"}</span></li>
                  <li className="flex items-center gap-2"><CircleCheck className="text-brand-gold text-sm flex-shrink-0" /> <span>Kiểu dáng: {product?.kieudang || "Thanh lịch"}</span></li>
                  <li className="flex items-center gap-2"><CircleCheck className="text-brand-gold text-sm flex-shrink-0" /> <span>Đa dạng khuôn mặt</span></li>
                </ul>
              )}
              {idcategory === 2 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2"><CircleCheck className="text-brand-gold text-sm flex-shrink-0" /> <span>Chống chói & tia UV</span></li>
                  <li className="flex items-center gap-2"><CircleCheck className="text-brand-gold text-sm flex-shrink-0" /> <span>Chất liệu: {product?.chatlieu || "Nhựa cao cấp"}</span></li>
                  <li className="flex items-center gap-2"><CircleCheck className="text-brand-gold text-sm flex-shrink-0" /> <span>Kiểu dáng: {product?.kieudang || "Kính phi công"}</span></li>
                  <li className="flex items-center gap-2"><CircleCheck className="text-brand-gold text-sm flex-shrink-0" /> <span>Giảm mỏi mắt ngoài trời</span></li>
                </ul>
              )}
              {idcategory !== 1 && idcategory !== 2 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2"><CircleCheck className="text-brand-gold text-sm flex-shrink-0" /> <span>Hạn chế phản quang</span></li>
                  <li className="flex items-center gap-2"><CircleCheck className="text-brand-gold text-sm flex-shrink-0" /> <span>Chất liệu: {product?.chatlieu || "Hợp kim cao cấp"}</span></li>
                  <li className="flex items-center gap-2"><CircleCheck className="text-brand-gold text-sm flex-shrink-0" /> <span>Kiểu dáng: {product?.kieudang || "Modern"}</span></li>
                  <li className="flex items-center gap-2"><CircleCheck className="text-brand-gold text-sm flex-shrink-0" /> <span>Hạn chế bám vân tay & bụi</span></li>
                </ul>
              )}
            </div>

            {/* Description Text */}
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
              {idcategory === 1 ? (
                "Gọng kính thời trang được thiết kế theo xu hướng mắt kính thời trang thế giới hiện nay. Sản phẩm đem đến cảm giác đeo chân thật, không gây khó chịu cho sóng mũi. Đồng thời giúp tôn lên vẻ đẹp của người đeo một cách tối ưu và hoàn hảo nhất."
              ) : idcategory === 2 ? (
                "Kính râm thời trang cao cấp với tròng kính phân cực ngăn chặn tia sáng có hại và chống chói tối đa, giúp hình ảnh rõ nét và trung thực. Việc đeo kính râm dưới nắng hè sẽ bảo vệ đôi mắt của bạn và cản trở tầm nhìn bị lóa."
              ) : (
                "Sản phẩm phụ kiện tròng kính được phủ lớp Polymer trơn láng giúp bề mặt luôn bóng, cứng và hạn chế tối đa bám nước, bụi bẩn hay trầy xước. Phòng chống tia tử ngoại và bức xạ điện từ để bảo vệ mắt toàn diện."
              )}
            </div>

            {/* Order Interface (Quantity & Buttons) */}
            <div className="flex flex-wrap gap-4 items-center pt-4">
              
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden bg-gray-50 dark:bg-white/[0.02] h-12 flex-shrink-0">
                <button 
                  className="w-12 h-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 hover:text-gray-800 dark:hover:text-white transition duration-150 cursor-pointer outline-none"
                  onClick={decrease}
                >
                  <Minus className="text-xs" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button 
                  className="w-12 h-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 hover:text-gray-800 dark:hover:text-white transition duration-150 cursor-pointer outline-none"
                  onClick={increase}
                >
                  <Plus className="text-xs" />
                </button>
              </div>

              {/* Add to Cart button */}
              <motion.button 
                onClick={addToCart}
                className="flex-grow min-w-[200px] h-12 rounded-xl text-black font-heading font-bold text-xs tracking-wider bg-gradient-to-r from-brand-gold via-[#e8d7c0] to-brand-gold-hover hover:brightness-110 active:brightness-95 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/15"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.1 }}
              >
                <ShoppingBag className="text-sm font-bold" />
                <span>THÊM VÀO GIỎ HÀNG</span>
              </motion.button>
            </div>

            {/* Contact details */}
            <div className="pt-4">
              <div className="inline-flex items-center gap-3 bg-white dark:bg-black/25 border border-gray-100 dark:border-white/5 rounded-2xl p-4 sm:p-5 shadow-lg max-w-md w-full">
                <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0">
                  <PhoneCall className="text-base" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">LIÊN HỆ ĐẶT HÀNG TRỰC TIẾP</h4>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Để nhận được mức giá tốt và nhiều ưu đãi đặc quyền.</span>
                </div>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </div>
  );
}
