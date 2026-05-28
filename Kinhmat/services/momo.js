import api from "../utils/request";

/**
 * Tạo URL thanh toán MoMo Sandbox
 * @param {number} amount - Số tiền thanh toán (VNĐ)
 * @param {string} orderId - Mã đơn hàng (optional, sẽ tự tạo nếu không truyền)
 * @param {string} orderInfo - Thông tin đơn hàng
 * @returns {Promise<{payUrl: string, orderId: string, requestId: string}>}
 */
export const createMomoPayment = async (amount, orderId = null, orderInfo = "Thanh toán đơn hàng Kính Mắt Luxury") => {
  const res = await api.post("/Ctr_Momo/CreatePayment", {
    amount,
    orderId,
    orderInfo,
  });
  return res.data;
};

/**
 * Kiểm tra trạng thái giao dịch MoMo
 * @param {string} orderId - Mã đơn hàng
 * @param {string} requestId - Request ID
 */
export const queryMomoStatus = async (orderId, requestId) => {
  const res = await api.get(`/Ctr_Momo/QueryStatus?orderId=${orderId}&requestId=${requestId}`);
  return res.data;
};
