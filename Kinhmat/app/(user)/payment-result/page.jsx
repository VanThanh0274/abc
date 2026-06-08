"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, XCircle, Clock, ArrowRight, ShoppingBag, Home, Printer, X
} from "lucide-react";
import { toast } from "react-toastify";
import { createOrder } from "../../../services/order";

// ─── Invoice for MoMo ─────────────────────────────────────────────────────────
function MomoInvoicePrint({ info, pendingOrder, onClose }) {
  const donhang = pendingOrder?.donhang || {};
  const items = donhang.listjson_chitiet || [];
  const subtotal = items.reduce((acc, i) => acc + i.giaban * i.soluong, 0);
  const tienGiam = donhang.tien_giam || 0;
  const total = donhang.tongtien || subtotal;
  const shippingFee = total - Math.max(0, subtotal - tienGiam);
  const issueDate = donhang.thoigian ? new Date(donhang.thoigian) : new Date();

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      {/* Control Bar */}
      <div className="print:hidden fixed top-4 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-3">
        <motion.button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#a4135b] text-white font-bold text-xs rounded-xl shadow-lg hover:brightness-110 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Printer size={15} />
          In Hóa Đơn MoMo
        </motion.button>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-semibold text-xs rounded-xl shadow hover:bg-gray-50 transition-all"
        >
          <X size={14} />
          Đóng
        </button>
      </div>

      {/* Invoice Page */}
      <div
        id="invoice-content"
        className="bg-white w-full max-w-[800px] mt-16 print:mt-0 rounded-2xl print:rounded-none shadow-2xl print:shadow-none"
        style={{ fontFamily: "'Be Vietnam Pro', Arial, sans-serif" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6d0b39] to-[#a4135b] text-white px-10 py-8 print:px-8 print:py-6 rounded-t-2xl print:rounded-none">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-[#a4135b] font-black text-sm">K</span>
                </div>
                <span className="text-white font-black text-lg tracking-widest uppercase">Kính Mắt Luxury</span>
              </div>
              <p className="text-pink-200 text-xs mt-1">Kính mắt cao cấp · Phong cách đẳng cấp</p>
              <p className="text-pink-300 text-[10px] mt-0.5">ĐT: 0900 000 000 · Email: kinhmatluxury@gmail.com</p>
            </div>
            <div className="text-right">
              <p className="text-pink-200 text-xs font-bold uppercase tracking-widest">Hóa Đơn Thanh Toán MoMo</p>
              <p className="text-white text-2xl font-black mt-1">{info.orderId || "—"}</p>
              <p className="text-pink-200 text-xs mt-1">
                {issueDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-white/20 text-white rounded-full text-[9px] font-bold border border-white/30">
                ✓ Đã thanh toán MoMo
              </span>
            </div>
          </div>
        </div>

        <div className="px-10 py-8 print:px-8 print:py-6 space-y-7">
          {/* MoMo Transaction Info */}
          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-5">
            <div className="text-[10px] font-black text-[#a4135b] uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-[#a4135b] flex items-center justify-center">
                <span className="text-white text-[7px] font-black">M</span>
              </div>
              Thông tin giao dịch MoMo Sandbox
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {info.orderId && (
                <div>
                  <p className="text-gray-500 text-xs">Mã đơn hàng</p>
                  <p className="font-bold text-gray-900 text-xs font-mono mt-0.5">{info.orderId}</p>
                </div>
              )}
              {info.transId && (
                <div>
                  <p className="text-gray-500 text-xs">Mã giao dịch MoMo</p>
                  <p className="font-bold text-gray-900 text-xs font-mono mt-0.5">{info.transId}</p>
                </div>
              )}
              {info.amount && (
                <div>
                  <p className="text-gray-500 text-xs">Số tiền thanh toán</p>
                  <p className="font-black text-[#a4135b] mt-0.5">{parseInt(info.amount).toLocaleString("vi-VN")} đ</p>
                </div>
              )}
              <div>
                <p className="text-gray-500 text-xs">Trạng thái</p>
                <p className="font-bold text-emerald-600 mt-0.5">✓ Thành công</p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          {donhang.ten && (
            <>
              <div className="border-t-2 border-dashed border-gray-200" />
              <div>
                <p className="text-[10px] font-black text-[#c5a880] uppercase tracking-widest mb-3">Thông tin khách hàng</p>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                  <p><span className="text-gray-500">Họ tên:</span> <strong className="text-gray-900">{donhang.ten}</strong></p>
                  <p><span className="text-gray-500">Điện thoại:</span> <strong className="text-gray-900">{donhang.sdt}</strong></p>
                  <p><span className="text-gray-500">Email:</span> <strong className="text-gray-900">{donhang.email || "N/A"}</strong></p>
                  <p><span className="text-gray-500">Địa chỉ:</span> <strong className="text-gray-900 text-xs">{donhang.diachi}</strong></p>
                </div>
              </div>
            </>
          )}

          {/* Product Table */}
          {items.length > 0 && (
            <>
              <div className="border-t-2 border-dashed border-gray-200" />
              <div>
                <p className="text-[10px] font-black text-[#c5a880] uppercase tracking-widest mb-3">Chi tiết sản phẩm</p>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      <th className="py-3 px-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider">STT</th>
                      <th className="py-3 px-3 text-left text-[10px] font-black text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                      <th className="py-3 px-3 text-center text-[10px] font-black text-gray-500 uppercase tracking-wider">SL</th>
                      <th className="py-3 px-3 text-right text-[10px] font-black text-gray-500 uppercase tracking-wider">Đơn giá</th>
                      <th className="py-3 px-3 text-right text-[10px] font-black text-gray-500 uppercase tracking-wider">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="py-3 px-3 text-gray-400 text-xs">{idx + 1}</td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-gray-900 text-xs">{item.ten || `Sản phẩm #${item.masp}`}</p>
                          <p className="text-gray-400 text-[10px]">Mã SP: {item.masp}</p>
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-gray-700">{item.soluong}</td>
                        <td className="py-3 px-3 text-right text-gray-600 text-xs">{item.giaban.toLocaleString("vi-VN")} đ</td>
                        <td className="py-3 px-3 text-right font-bold text-[#c5a880]">{(item.giaban * item.soluong).toLocaleString("vi-VN")} đ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Tạm tính</span>
                    <span className="font-semibold text-gray-700">{subtotal.toLocaleString("vi-VN")} đ</span>
                  </div>
                  {tienGiam > 0 && (
                    <div className="flex justify-between text-[#a4135b]">
                      <span>Khuyến mãi</span>
                      <span className="font-semibold">- {tienGiam.toLocaleString("vi-VN")} đ</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500">
                    <span>Phí vận chuyển</span>
                    <span className="font-semibold text-gray-700">
                      {shippingFee <= 0 ? (
                        <span className="text-emerald-500">Miễn phí (VIP)</span>
                      ) : (
                        `${shippingFee.toLocaleString("vi-VN")} đ`
                      )}
                    </span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-2 flex justify-between items-center">
                    <span className="font-black text-gray-900 text-base">TỔNG CỘNG</span>
                    <span className="font-black text-[#a4135b] text-xl">{total.toLocaleString("vi-VN")} đ</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="border-t-2 border-dashed border-gray-200 pt-6 text-center space-y-1">
            <p className="text-sm font-bold text-gray-700">
              Cảm ơn quý khách đã thanh toán qua <span className="text-[#a4135b]">MoMo</span>!
            </p>
            <p className="text-xs text-gray-400">Hóa đơn được xuất tự động · {new Date().toLocaleString("vi-VN")}</p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          #invoice-content, #invoice-content * { visibility: visible; }
          #invoice-content { position: fixed; left: 0; top: 0; width: 100%; }
        }
      ` }} />
    </div>
  );
}

// ─── Main Payment Result Content ──────────────────────────────────────────────
function PaymentResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("loading");
  const [orderCreated, setOrderCreated] = useState(false);
  const [info, setInfo] = useState({});
  const [pendingOrder, setPendingOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    const processResult = async () => {
      const resultCode = parseInt(searchParams.get("resultCode") ?? "-1");
      const orderId = searchParams.get("orderId") || "";
      const transId = searchParams.get("transId") || "";
      const amount = searchParams.get("amount") || "";
      const message = searchParams.get("message") || "";

      setInfo({ resultCode, orderId, transId, amount, message });

      // Load pending order from localStorage for invoice
      const pendingRaw = localStorage.getItem("momo_pending_order");
      if (pendingRaw) {
        try { setPendingOrder(JSON.parse(pendingRaw)); } catch (_) {}
      }

      if (resultCode === 0) {
        try {
          if (pendingRaw && !orderCreated) {
            const pending = JSON.parse(pendingRaw);
            await createOrder(JSON.stringify(pending.donhang));
            // Keep momo_pending_order for display purposes on refresh
            // localStorage.removeItem("momo_pending_order");
            localStorage.removeItem("sanphams");
            window.dispatchEvent(new Event("localStorageUpdated"));
            setOrderCreated(true);
            toast.success("Đặt hàng thành công sau thanh toán MoMo!");
          }
          setStatus("success");
        } catch (e) {
          console.error("Lỗi tạo đơn hàng sau MoMo:", e);
          setStatus("success");
        }
      } else if (resultCode === 1006) {
        setStatus("cancelled");
      } else if (resultCode === 9000) {
        setStatus("pending");
      } else if (resultCode === -1 && !searchParams.get("resultCode")) {
        setStatus("unknown");
      } else {
        setStatus("failed");
      }
    };

    processResult();
  }, []);

  const configs = {
    loading: {
      icon: <Clock size={56} className="text-gray-400 animate-pulse" />,
      title: "Đang xử lý kết quả...",
      subtitle: "Vui lòng chờ trong giây lát",
      bg: "from-gray-50 to-gray-100",
      ringColor: "ring-gray-200",
    },
    success: {
      icon: <CheckCircle size={56} className="text-emerald-500" />,
      title: "Thanh toán thành công!",
      subtitle: "Đơn hàng của bạn đã được đặt và đang chờ xác nhận từ cửa hàng.",
      bg: "from-emerald-50 to-teal-50",
      ringColor: "ring-emerald-200",
    },
    failed: {
      icon: <XCircle size={56} className="text-red-500" />,
      title: "Thanh toán thất bại",
      subtitle: "Giao dịch không thể hoàn tất. Vui lòng thử lại hoặc chọn phương thức khác.",
      bg: "from-red-50 to-rose-50",
      ringColor: "ring-red-200",
    },
    cancelled: {
      icon: <XCircle size={56} className="text-orange-400" />,
      title: "Giao dịch đã bị hủy",
      subtitle: "Bạn đã hủy giao dịch MoMo. Đơn hàng chưa được đặt.",
      bg: "from-orange-50 to-amber-50",
      ringColor: "ring-orange-200",
    },
    pending: {
      icon: <Clock size={56} className="text-yellow-500" />,
      title: "Giao dịch đang chờ xử lý",
      subtitle: "Giao dịch của bạn đang được xử lý. Chúng tôi sẽ thông báo khi hoàn tất.",
      bg: "from-yellow-50 to-amber-50",
      ringColor: "ring-yellow-200",
    },
    unknown: {
      icon: <ShoppingBag size={56} className="text-[#c5a880]" />,
      title: "Trang kết quả thanh toán",
      subtitle: "Trang này hiển thị kết quả sau khi bạn hoàn tất thanh toán qua MoMo.",
      bg: "from-[#faf9f6] to-amber-50",
      ringColor: "ring-[#c5a880]/30",
    },
  };

  const cfg = configs[status] || configs.loading;

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-4 py-16 font-sans">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Result Card */}
        <div className={`bg-gradient-to-br ${cfg.bg} rounded-3xl ring-1 ${cfg.ringColor} p-8 md:p-10 shadow-xl text-center space-y-5`}>
          {/* Icon */}
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="p-4 bg-white rounded-full shadow-lg ring-1 ring-gray-100">
              {cfg.icon}
            </div>
          </motion.div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-wide">{cfg.title}</h1>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{cfg.subtitle}</p>
          </div>

          {/* Transaction info */}
          {((info.transId && info.transId !== "0") || pendingOrder) && (
            <div className="bg-white/70 rounded-2xl p-4 text-left space-y-2 text-sm border border-white">
              {info.orderId && (
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Mã đơn hàng</span>
                  <span className="font-bold text-gray-800 text-xs font-mono">{info.orderId}</span>
                </div>
              )}
              {info.transId && (
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Mã giao dịch MoMo</span>
                  <span className="font-bold text-gray-800 text-xs font-mono">{info.transId}</span>
                </div>
              )}

              {pendingOrder && pendingOrder.donhang && (
                <>
                  <div className="border-t border-gray-100 my-2 pt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Tạm tính</span>
                      <span className="font-bold text-gray-800">
                        {pendingOrder.donhang.listjson_chitiet.reduce((acc, i) => acc + i.giaban * i.soluong, 0).toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                    {(pendingOrder.donhang.tien_giam || 0) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#a4135b] font-medium">Khuyến mãi</span>
                        <span className="font-bold text-[#a4135b]">
                          - {(pendingOrder.donhang.tien_giam).toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Phí vận chuyển</span>
                      <span className="font-bold text-gray-800">
                        {(() => {
                           const sub = pendingOrder.donhang.listjson_chitiet.reduce((acc, i) => acc + i.giaban * i.soluong, 0);
                           const tg = pendingOrder.donhang.tien_giam || 0;
                           const tot = pendingOrder.donhang.tongtien || sub;
                           const ship = tot - Math.max(0, sub - tg);
                           return ship <= 0 ? <span className="text-emerald-500">Miễn phí (VIP)</span> : `${ship.toLocaleString("vi-VN")} đ`;
                        })()}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {info.amount && (
                <div className="flex justify-between border-t border-gray-200 pt-3 mt-2">
                  <span className="text-gray-800 font-bold">Tổng thanh toán</span>
                  <span className="font-black text-[#a4135b] text-base">{parseInt(info.amount).toLocaleString("vi-VN")} đ</span>
                </div>
              )}
            </div>
          )}

          {/* MoMo branding */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#a4135b] font-semibold">
            <div className="w-5 h-5 rounded-full bg-[#a4135b] flex items-center justify-center">
              <span className="text-white text-[7px] font-black">M</span>
            </div>
            Thanh toán qua MoMo Sandbox
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          {status === "success" && (
            <>
              {/* Print Invoice Button */}
              <motion.button
                onClick={() => setShowInvoice(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#a4135b] to-[#d4246e] text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg hover:brightness-105 transition-all"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Printer size={16} />
                Xem & In Hóa Đơn MoMo
              </motion.button>

              <motion.button
                onClick={() => router.push("/orderhistory")}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#c5a880] to-[#d4b896] text-black font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg hover:brightness-105 transition-all"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <ShoppingBag size={16} />
                Xem đơn hàng của tôi
                <ArrowRight size={16} />
              </motion.button>
            </>
          )}

          {(status === "failed" || status === "cancelled") && (
            <motion.button
              onClick={() => router.push("/payments")}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#c5a880] to-[#d4b896] text-black font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg hover:brightness-105 transition-all"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Thử thanh toán lại
              <ArrowRight size={16} />
            </motion.button>
          )}

          <motion.button
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-2xl border border-gray-200 bg-white text-gray-600 font-semibold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Home size={15} />
            Về trang chủ
          </motion.button>
        </div>
      </motion.div>

      {/* MoMo Invoice Print Modal */}
      <AnimatePresence>
        {showInvoice && (
          <MomoInvoicePrint
            info={info}
            pendingOrder={pendingOrder}
            onClose={() => setShowInvoice(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PaymentResult() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-sm font-medium">Đang tải...</div>
      </div>
    }>
      <PaymentResultContent />
    </Suspense>
  );
}
