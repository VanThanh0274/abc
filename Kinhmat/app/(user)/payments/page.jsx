"use client";

import { useEffect, useState } from "react";
import { Getiduser } from "../../../services/auth";
import { createOrder } from "../../../services/order";
import { createMomoPayment } from "../../../services/momo";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronRight,
  User,
  Phone,
  Mail,
  MapPin,
  ClipboardSignature,
  Wallet,
  Package,
  CheckCircle,
  Loader2,
} from "lucide-react";

const PAYMENT_METHODS = [
  {
    id: "cod",
    label: "Thanh toán khi nhận hàng",
    sublabel: "COD",
    icon: Package,
    description: "Thanh toán bằng tiền mặt khi nhận hàng",
    color: "from-amber-50 to-orange-50 border-amber-200",
    activeColor: "from-amber-100 to-orange-100 border-amber-400",
    iconColor: "text-amber-600",
  },
  {
    id: "momo",
    label: "Ví điện tử MoMo",
    sublabel: "MOMO",
    icon: Wallet,
    description: "Thanh toán nhanh chóng qua ví MoMo",
    color: "from-pink-50 to-rose-50 border-pink-200",
    activeColor: "from-pink-100 to-rose-100 border-[#a4135b]",
    iconColor: "text-[#a4135b]",
  },
];

export default function Thanhtoan() {
  const [cart, setcart] = useState([]);
  const [tong, settong] = useState(0);
  const [promo, setPromo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tenkh: "",
    sdt: "",
    email: "",
    diachi: "",
    ghichu: "",
  });
  const router = useRouter();

  const logCurrentTime = () => new Date().toISOString();

  useEffect(() => {
    const fetchdata = () => {
      const liststorage = JSON.parse(localStorage.getItem("sanphams")) || [];
      setcart(liststorage);
      const tong = liststorage.reduce((acc, item) => acc + item.tong, 0);
      settong(tong);
      
      const promoData = JSON.parse(localStorage.getItem("promo_data")) || null;
      setPromo(promoData);
    };
    fetchdata();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để tiến hành đặt hàng!");
      router.push("/login");
      return false;
    }
    if (!form.tenkh.trim() || !form.sdt.trim() || !form.diachi.trim()) {
      toast.warn("Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!");
      return false;
    }
    if (cart.length === 0) {
      toast.warn("Giỏ hàng của bạn đang trống!");
      return false;
    }
    return true;
  };

  const buildDonhang = () => {
    const list = JSON.parse(localStorage.getItem("sanphams")) || [];
    const listjson_chitiet = list.map((item) => ({
      macthd: 0,
      mahd: 0,
      masp: parseInt(item.id),
      soluong: parseInt(item.soluong),
      giaban: parseInt(item.gia),
    }));
    
    const promo = JSON.parse(localStorage.getItem("promo_data")) || { tien_giam: 0, ma_km: null };
    const finalTotal = Math.max(0, tong - promo.tien_giam) + 30000;

    return {
      iduser: Getiduser(),
      ten: form.tenkh,
      sdt: form.sdt,
      email: form.email,
      diachi: form.diachi,
      ghichu: form.ghichu,
      thoigian: logCurrentTime(),
      tongtien: finalTotal,
      tien_giam: promo.tien_giam,
      ma_km: promo.ma_km,
      idVoucher: promo.idVoucher || null,
      trangthai: "Chờ xác nhận",
      listjson_chitiet,
    };
  };

  // COD flow
  const handleCOD = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await createOrder(JSON.stringify(buildDonhang()));
      localStorage.removeItem("sanphams");
      setcart([]);
      window.dispatchEvent(new Event("localStorageUpdated"));
      toast.success("Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.");
      router.push("/orderhistory");
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      toast.error("Đã xảy ra lỗi trong quá trình đặt hàng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // MoMo flow
  const handleMoMo = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const promo = JSON.parse(localStorage.getItem("promo_data")) || { tien_giam: 0 };
      const totalAmount = Math.max(0, tong - promo.tien_giam) + 30000;
      const orderId = `KM${Date.now()}`;
      const orderInfo = `Thanh toan don hang kinh mat - ${form.tenkh}`;

      // Save order info to localStorage for use after redirect
      localStorage.setItem(
        "momo_pending_order",
        JSON.stringify({
          donhang: buildDonhang(),
          orderId,
          amount: totalAmount,
        })
      );

      const result = await createMomoPayment(totalAmount, orderId, orderInfo);
      if (result?.payUrl) {
        toast.info("Đang chuyển đến cổng thanh toán MoMo...");
        window.location.href = result.payUrl;
      } else {
        toast.error("Không thể tạo liên kết thanh toán MoMo. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi MoMo:", error);
      toast.error("Có lỗi kết nối cổng thanh toán MoMo. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (paymentMethod === "momo") handleMoMo();
    else handleCOD();
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] py-12 md:py-16 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="border-b border-gray-200 pb-6 mb-8 md:mb-12">
          <div className="flex items-center gap-2 text-[#c5a880] text-xs font-bold uppercase tracking-widest mb-1.5">
            <Sparkles size={14} /> Checkout Procedure
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide text-gray-900">
            Thanh Toán Đơn Hàng
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column */}
          <motion.div
            className="lg:col-span-7 space-y-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Shipping Info */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-[#c5a880] tracking-wide uppercase border-b border-gray-100 pb-3">
                Thông tin giao hàng
              </h3>

              <div className="space-y-4 text-sm font-medium">
                {/* Full name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Họ và tên</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-400"><User size={16} /></span>
                    <input type="text" id="tenkh" value={form.tenkh} onChange={handleChange}
                      className="w-full bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 focus:border-[#c5a880] rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all duration-150 text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-[#c5a880]/30"
                      placeholder="Nhập tên người nhận hàng" />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Số điện thoại</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-400"><Phone size={16} /></span>
                    <input type="text" id="sdt" value={form.sdt} onChange={handleChange}
                      className="w-full bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 focus:border-[#c5a880] rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all duration-150 text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-[#c5a880]/30"
                      placeholder="Số điện thoại nhận hàng" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-400"><Mail size={16} /></span>
                    <input type="text" id="email" value={form.email} onChange={handleChange}
                      className="w-full bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 focus:border-[#c5a880] rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all duration-150 text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-[#c5a880]/30"
                      placeholder="Địa chỉ Email nhận thông tin" />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Địa chỉ nhận hàng</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-400"><MapPin size={16} /></span>
                    <input type="text" id="diachi" value={form.diachi} onChange={handleChange}
                      className="w-full bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 focus:border-[#c5a880] rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all duration-150 text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-[#c5a880]/30"
                      placeholder="Địa chỉ nhà, tên đường, phường/xã, quận/huyện..." />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1.5 pt-2">
                  <h3 className="text-sm font-bold text-[#c5a880] tracking-wide uppercase">Thông tin bổ sung</h3>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Ghi chú đơn hàng</label>
                  <div className="relative flex">
                    <span className="absolute left-4 top-3.5 text-gray-400"><ClipboardSignature size={16} /></span>
                    <textarea id="ghichu" rows="4" value={form.ghichu} onChange={handleChange}
                      className="w-full bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 focus:border-[#c5a880] rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all duration-150 text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-[#c5a880]/30"
                      placeholder="Ghi chú về đơn hàng, thời gian giao nhận đặc biệt..." />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-[#c5a880] tracking-wide uppercase border-b border-gray-100 pb-3">
                Phương thức thanh toán
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isActive = paymentMethod === method.id;
                  return (
                    <motion.button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`relative w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 bg-gradient-to-br cursor-pointer
                        ${isActive ? method.activeColor + " shadow-md" : method.color + " hover:shadow-sm"}`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-white shadow-sm ${method.iconColor}`}>
                          <Icon size={22} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm text-gray-800">{method.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{method.description}</p>
                        </div>
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                            >
                              <CheckCircle size={20} className="text-green-500" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {method.id === "momo" && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-[#a4135b] flex items-center justify-center">
                            <span className="text-white text-[8px] font-black">M</span>
                          </div>
                          <span className="text-xs text-[#a4135b] font-bold">MoMo Sandbox</span>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {paymentMethod === "momo" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-pink-50 border border-pink-200 rounded-xl p-3.5 text-xs text-[#a4135b] font-medium leading-relaxed"
                >
                  <span className="font-bold">Lưu ý:</span> Bạn sẽ được chuyển đến trang thanh toán MoMo (Sandbox)
                  để hoàn tất giao dịch. Đơn hàng sẽ được xác nhận sau khi thanh toán thành công.
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Order Summary */}
          <motion.div
            className="lg:col-span-5 lg:sticky lg:top-24"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-gray-900 tracking-wide border-b border-gray-100 pb-4">
                Đơn hàng của bạn
              </h3>

              {/* Items List */}
              <div className="max-h-[220px] overflow-y-auto pr-2 divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-600 truncate max-w-[200px]">
                      {item.ten} <span className="text-xs text-[#c5a880]">x{item.soluong}</span>
                    </span>
                    <span className="font-semibold text-gray-900">{item.tong.toLocaleString("vi-VN")} đ</span>
                  </div>
                ))}
                {cart.length === 0 && (
                  <p className="text-center py-6 text-sm text-gray-500">Chưa có sản phẩm nào.</p>
                )}
              </div>

              {/* Subtotal, Ship, Total */}
              <div className="space-y-4 pt-4 border-t border-gray-100 text-sm font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Tạm tính</span>
                  <span className="font-semibold text-gray-900">{tong.toLocaleString("vi-VN")} đ</span>
                </div>
                
                {promo && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Mã giảm giá ({promo.ma_km})</span>
                    <span className="font-semibold">- {promo.tien_giam.toLocaleString("vi-VN")} đ</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Phí vận chuyển</span>
                  <span className="font-semibold text-gray-900">{cart.length > 0 ? "30.000 đ" : "0 đ"}</span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between items-end">
                  <span className="text-base font-bold text-gray-900">Tổng cộng</span>
                  <span className="text-xl font-extrabold text-[#c5a880] tracking-wide">
                    {cart.length > 0 ? (Math.max(0, tong - (promo?.tien_giam || 0)) + 30000).toLocaleString("vi-VN") : "0"} đ
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-2 space-y-3">
                {/* Payment method badge */}
                <div className={`rounded-xl p-3 text-xs font-semibold text-center border
                  ${paymentMethod === "momo"
                    ? "bg-pink-50 border-pink-200 text-[#a4135b]"
                    : "bg-gray-50 border-gray-100 text-gray-500"
                  }`}
                >
                  {paymentMethod === "momo"
                    ? "💳 Thanh toán qua ví điện tử MoMo"
                    : "📦 Thanh toán khi nhận hàng (COD)"}
                </div>

                <motion.button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-bold text-xs tracking-widest transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 shadow-lg
                    ${paymentMethod === "momo"
                      ? "bg-gradient-to-r from-[#a4135b] via-[#d4246e] to-[#a4135b] text-white hover:brightness-110 shadow-pink-200 disabled:opacity-70"
                      : "bg-gradient-to-r from-[#c5a880] via-[#e8d7c0] to-[#c5a880] text-black hover:brightness-110 shadow-[#c5a880]/20 disabled:opacity-70"
                    }`}
                  whileHover={!loading ? { scale: 1.01 } : {}}
                  whileTap={!loading ? { scale: 0.99 } : {}}
                  transition={{ duration: 0.1 }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{paymentMethod === "momo" ? "Đang kết nối MoMo..." : "Đang xử lý..."}</span>
                    </>
                  ) : paymentMethod === "momo" ? (
                    <>
                      <Wallet size={16} />
                      <span>THANH TOÁN VIA MOMO</span>
                    </>
                  ) : (
                    <>
                      <span>XÁC NHẬN ĐẶT HÀNG</span>
                      <ChevronRight size={16} className="font-bold" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
