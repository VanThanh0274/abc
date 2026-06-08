"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Trash2, 
  ShoppingBag, 
  Minus, 
  Plus, 
  RefreshCw, 
  Tag, 
  ArrowLeft, 
  ChevronRight,
  Sparkles,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { applyVoucher, getAvailableVouchers } from "../../../services/voucherService";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [reload, setReload] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [isVoucherListOpen, setIsVoucherListOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const { getCartDB } = await import("../../../services/cartService");
        const dbCart = await getCartDB();
        if (dbCart) {
          // Map dbCart fields to match local storage structure for compatibility
          const mappedCart = dbCart.map(item => ({
            id: item.masp,
            ten: item.tenSanPham,
            gia: item.giaBan,
            soluong: item.soluong,
            tong: item.tongTien,
            anh: item.anh
          }));
          setCartItems(mappedCart);
          // Sync with local storage
          localStorage.setItem("sanphams", JSON.stringify(mappedCart));
          window.dispatchEvent(new Event('localStorageUpdated'));
        }
      } else {
        let stored = [];
        try {
          stored = JSON.parse(localStorage.getItem("sanphams")) || [];
          if (!Array.isArray(stored)) stored = [];
        } catch (e) {
          stored = [];
        }
        setCartItems(stored);
      }
    };
    
    const fetchVouchers = async () => {
      const vouchers = await getAvailableVouchers();
      setAvailableVouchers(vouchers || []);
    };
    
    fetchCart();
    fetchVouchers();
  }, [reload]);

  const updateQuantity = async (index, delta) => {
    const updatedCart = [...cartItems];
    const newQuantity = Math.max(1, updatedCart[index].soluong + delta);
    updatedCart[index].soluong = newQuantity;
    updatedCart[index].tong = newQuantity * updatedCart[index].gia;
    
    const token = localStorage.getItem('token');
    if (token) {
        const { updateCartDB } = await import("../../../services/cartService");
        await updateCartDB(updatedCart[index].id, newQuantity);
    }
    
    setCartItems(updatedCart);
    localStorage.setItem("sanphams", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('localStorageUpdated'));
  };

  const removeItem = async (index) => {
    const updatedCart = [...cartItems];
    const removedItemName = updatedCart[index].ten;
    const removedId = updatedCart[index].id;
    updatedCart.splice(index, 1);
    
    const token = localStorage.getItem('token');
    if (token) {
        const { removeFromCartDB } = await import("../../../services/cartService");
        await removeFromCartDB(removedId);
    }
    
    setCartItems(updatedCart);
    localStorage.setItem("sanphams", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('localStorageUpdated'));
    toast.success(`Đã xóa "${removedItemName}" khỏi giỏ hàng.`);
  };

  const capnhat = () => {
    toast.success("Giỏ hàng đã được cập nhật!");
    setReload(!reload);
  };

  const thanhtoan = () => {
    if (cartItems.length === 0) {
      toast.warn("Giỏ hàng của bạn đang trống!");
      return;
    }
    router.push("/payments");
  };

  const [appliedPromo, setAppliedPromo] = useState(null);

  useEffect(() => {
    const promo = JSON.parse(localStorage.getItem("promo_data"));
    if (promo) setAppliedPromo(promo);
  }, []);

  const applyCoupon = async (codeToApply = couponCode.trim()) => {
    if (!codeToApply) {
      toast.warn("Vui lòng nhập mã ưu đãi.");
      return;
    }
    
    const tamTinhHienTai = cartItems.reduce((total, item) => total + item.tong, 0);
    
    try {
        const res = await applyVoucher(codeToApply, tamTinhHienTai);
        
        if (res.success) {
            const promo = res.data;
            let tienGiam = 0;
            if (promo.loai_km === 1) { // 1 là giảm theo %
                tienGiam = (tamTinhHienTai * promo.giatri_km) / 100;
            } else { // 2 là giảm số tiền cố định
                tienGiam = promo.giatri_km;
            }

            const promoData = {
                idVoucher: promo.id,
                ma_km: promo.ma_km,
                tien_giam: tienGiam,
                loai_km: promo.loai_km,
                giatri_km: promo.giatri_km,
                giam_toi_da: null // Khuyenmai system doesn't have max discount
            };
            
            localStorage.setItem("promo_data", JSON.stringify(promoData));
            setAppliedPromo(promoData);
            toast.success("Áp dụng mã thành công!");
        } else {
            toast.error(res.message);
        }
    } catch (error) {
        toast.error("Không thể kiểm tra mã ưu đãi lúc này.");
    }
  };

  const clearCoupon = () => {
    localStorage.removeItem("promo_data");
    setAppliedPromo(null);
    setCouponCode("");
    toast.info("Đã huỷ mã ưu đãi.");
  };

  const tamTinh = cartItems.reduce((total, item) => total + item.tong, 0);
  let tienGiamHienTai = 0;
  if (appliedPromo) {
      if (appliedPromo.loai_km === 1) {
          tienGiamHienTai = (tamTinh * appliedPromo.giatri_km) / 100;
      } else {
          tienGiamHienTai = appliedPromo.giatri_km;
      }
      
      // Update if changed
      if (appliedPromo.tien_giam !== tienGiamHienTai) {
          const p = {...appliedPromo, tien_giam: tienGiamHienTai};
          // Schedule localStorage update to avoid React warnings during render
          setTimeout(() => {
              localStorage.setItem("promo_data", JSON.stringify(p));
              setAppliedPromo(p);
          }, 0);
      }
  }

  return (
    <div className="min-h-screen bg-luxury-cream transition-colors duration-150 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Page Title */}
        <div className="border-b border-gray-200 pb-6 mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest mb-1.5">
              <Sparkles className="text-sm" /> LUXURY SHOPPING BAG
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-gray-900 tracking-wide">
              Giỏ Hàng Của Bạn
            </h1>
          </div>
          <Link 
            href="/listproduct?id=1" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-gold hover:text-brand-gold-hover transition-colors duration-150 group self-start md:self-auto"
          >
            <ArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform duration-150" /> 
            Tiếp tục mua sắm
          </Link>
        </div>

        {cartItems.length === 0 ? (
          /* Empty State */
          <motion.div 
            className="text-center py-20 px-4 max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-gold">
              <ShoppingBag className="text-3xl animate-bounce" />
            </div>
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-550 text-sm mb-8 leading-relaxed">
              Bạn chưa thêm sản phẩm kính mắt cao cấp nào vào giỏ hàng của mình. Hãy tiếp tục khám phá các bộ sưu tập của chúng tôi.
            </p>
            <Link 
              href="/listproduct?id=1" 
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-hover text-black hover:brightness-105 transition-all font-heading font-bold text-sm tracking-wider w-full shadow-lg shadow-brand-gold/15"
            >
              KHÁM PHÁ CÁC MẪU KÍNH
            </Link>
          </motion.div>
        ) : (
          /* Cart Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Desktop Table Header (Only show on medium screen & up) */}
              <div className="hidden md:grid grid-cols-12 pb-4 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500 px-4">
                <div className="col-span-6">Sản phẩm</div>
                <div className="col-span-2 text-right">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-right">Thành tiền</div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-100 bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-md">
                <AnimatePresence initial={false}>
                  {cartItems.map((item, index) => (
                    <motion.div 
                      key={item.id} 
                      className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 items-center gap-4 sm:gap-6 relative group"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0, transition: { duration: 0.15 } }}
                      layout={{ transition: { duration: 0.2, ease: "easeOut" } }}
                    >
                      {/* Product details & image */}
                      <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                        {/* Remove item button */}
                        <button 
                          onClick={() => removeItem(index)}
                          className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-550 rounded-lg transition-colors duration-150 cursor-pointer outline-none"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="text-lg" />
                        </button>
                        
                        {/* Image */}
                        <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-150 flex items-center justify-center flex-shrink-0 group-hover:shadow-md transition duration-200">
                          <img loading="lazy"
                            className="w-full h-full object-contain p-1 transform group-hover:scale-105 transition duration-300"
                            src={`http://localhost:5273/images/product/${item.anh || 'default.jpg'}`}
                            alt={item.ten}
                          />
                        </div>

                        {/* Title */}
                        <div className="min-w-0">
                          <Link 
                            href={`/products?id=${item.id}`} 
                            className="font-semibold text-gray-900 hover:text-brand-gold transition-colors duration-150 text-sm sm:text-base leading-snug block truncate"
                          >
                            {item.ten}
                          </Link>
                          <span className="text-[11px] text-gray-400 font-medium block mt-0.5">Sản phẩm chính hãng</span>
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className="col-span-1 md:col-span-2 flex md:justify-end items-center gap-2 md:gap-0">
                        <span className="md:hidden text-xs text-gray-400 font-medium">Đơn giá:</span>
                        <span className="font-semibold text-sm text-gray-800">
                          {item.gia.toLocaleString("vi-VN")} đ
                        </span>
                      </div>

                      {/* Quantity Controller */}
                      <div className="col-span-1 md:col-span-2 flex md:justify-center items-center gap-3 md:gap-0">
                        <span className="md:hidden text-xs text-gray-400 font-medium mr-auto">Số lượng:</span>
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                          <button 
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-gray-850 transition duration-150 cursor-pointer"
                            onClick={() => updateQuantity(index, -1)}
                          >
                            <Minus className="text-xs" />
                          </button>
                          <span className="w-10 text-center text-sm font-bold text-gray-900">
                            {item.soluong}
                          </span>
                          <button 
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-gray-850 transition duration-150 cursor-pointer"
                            onClick={() => updateQuantity(index, 1)}
                          >
                            <Plus className="text-xs" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-1 md:col-span-2 flex md:justify-end items-center gap-2 md:gap-0">
                        <span className="md:hidden text-xs text-gray-400 font-medium">Tổng cộng:</span>
                        <span className="font-bold text-sm text-brand-gold text-right">
                          {item.tong.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 items-center justify-between pt-4">
                <button 
                  onClick={capnhat}
                  className="inline-flex items-center gap-2 py-3 px-6 rounded-xl border border-gray-300 hover:border-brand-gold hover:text-brand-gold text-xs font-bold uppercase tracking-wider text-gray-600 transition duration-150 bg-white/50 cursor-pointer"
                >
                  <RefreshCw className="text-sm animate-spin-hover" /> Cập nhật giỏ hàng
                </button>
              </div>
            </div>

            {/* Right Column: Order Checkout Summary */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              
              <div className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 shadow-xl space-y-6">
                <h3 className="text-xl font-bold font-heading text-gray-900 tracking-wide border-b border-gray-150 pb-4">
                  Cộng giỏ hàng
                </h3>

                <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Tạm tính</span>
                    <span className="font-semibold text-gray-900">
                      {tamTinh.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Giao hàng</span>
                    <span className="text-emerald-600 font-bold uppercase tracking-wide text-xs">Miễn phí</span>
                  </div>
                  
                  <hr className="border-gray-150" />
                  
                  {appliedPromo && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Giảm giá ({appliedPromo.ma_km})</span>
                      <span className="font-semibold">- {tienGiamHienTai.toLocaleString("vi-VN")} đ</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-end">
                    <span className="text-base font-bold font-heading text-gray-900">Tổng tiền</span>
                    <span className="text-xl font-extrabold text-brand-gold tracking-wide">
                      {Math.max(0, tamTinh - tienGiamHienTai).toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </div>

                {/* Promo Code Coupon Section */}
                <div className="pt-6 border-t border-gray-150 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gold">
                    <Tag className="text-sm" /> Phiếu ưu đãi
                  </div>
                  {appliedPromo ? (
                    <div className="flex justify-between items-center bg-green-50 border border-green-200 p-3 rounded-xl">
                      <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
                        <CheckCircle size={16} /> Đang áp dụng mã: {appliedPromo.ma_km}
                      </div>
                      <button onClick={clearCoupon} className="text-red-500 text-xs font-bold hover:underline">Huỷ</button>
                    </div>
                  ) : (
                    <div className="space-y-3 relative">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-gray-800 placeholder-gray-400"
                          placeholder="Nhập hoặc chọn mã..."
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          onFocus={() => setIsVoucherListOpen(true)}
                        />
                        <button 
                          onClick={() => applyCoupon()}
                          className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-brand-gold hover:text-black border border-transparent text-xs font-bold uppercase tracking-wider text-gray-700 transition duration-150 cursor-pointer flex-shrink-0"
                        >
                          Áp dụng
                        </button>
                      </div>

                      {/* Voucher List Dropdown */}
                      {isVoucherListOpen && availableVouchers && availableVouchers.length > 0 && (
                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-150 rounded-xl shadow-2xl z-[9999] max-h-64 overflow-y-auto">
                          <div className="p-3 flex justify-between items-center sticky top-0 bg-white border-b border-gray-100 z-10">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mã khả dụng</span>
                            <button onClick={() => setIsVoucherListOpen(false)} className="text-xs text-gray-400 hover:text-gray-700">Đóng</button>
                          </div>
                          <div className="p-2 space-y-2">
                            {availableVouchers
                              .filter(v => v.ma_km.toLowerCase().includes(couponCode.toLowerCase()))
                              .map(v => (
                              <div key={v.id} className="flex items-center justify-between p-3 rounded-lg border border-brand-gold/20 bg-brand-gold/5 hover:bg-brand-gold/10 transition-colors cursor-pointer group"
                                onClick={() => {
                                  setCouponCode(v.ma_km);
                                  setIsVoucherListOpen(false);
                                  applyCoupon(v.ma_km);
                                }}
                              >
                                <div>
                                  <div className="font-bold text-brand-gold text-sm">{v.ma_km}</div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {v.loai_km === 1 ? `Giảm ${v.giatri_km}%` : `Giảm ${v.giatri_km.toLocaleString("vi-VN")}đ`}
                                  </div>
                                  {v.dieukien_toithieu > 0 && <div className="text-[10px] text-gray-400 mt-0.5">Đơn tối thiểu {v.dieukien_toithieu.toLocaleString("vi-VN")}đ</div>}
                                </div>
                                <button className="text-xs font-bold text-brand-gold bg-white border border-brand-gold px-3 py-1.5 rounded-lg group-hover:bg-brand-gold group-hover:text-white transition-colors">
                                  Dùng ngay
                                </button>
                              </div>
                            ))}
                            {availableVouchers.filter(v => v.ma_km.toLowerCase().includes(couponCode.toLowerCase())).length === 0 && (
                              <div className="text-center text-xs text-gray-400 py-4">Không tìm thấy mã phù hợp</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Checkout CTA */}
                <motion.button 
                  onClick={thanhtoan}
                  className="w-full py-4 rounded-xl text-black font-heading font-bold text-xs tracking-widest bg-gradient-to-r from-brand-gold via-[#e8d7c0] to-brand-gold-hover hover:brightness-110 active:brightness-95 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/15"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.1 }}
                >
                  <span>TIẾN HÀNH THANH TOÁN</span>
                  <ChevronRight className="text-sm font-bold" />
                </motion.button>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}
