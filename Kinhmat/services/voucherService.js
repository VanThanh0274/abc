const API_URL = "http://localhost:5273/api/Ctr_Khuyenmai";

export const getAvailableVouchers = async () => {
    try {
        const res = await fetch(`${API_URL}/GetAll`);
        if (res.ok) {
            const data = await res.json();
            const now = new Date();
            return data.filter(km => 
                km.trangthai === 1 && 
                new Date(km.ngaybatdau) <= now && 
                new Date(km.ngayketthuc) >= now
            );
        }
    } catch (error) {
        console.error("Lỗi lấy danh sách voucher", error);
    }
    return [];
};

export const applyVoucher = async (code, total) => {
    try {
        const res = await fetch(`${API_URL}/GetByCode/${code}`);
        if (res.ok) {
            const data = await res.json();
            if (data.trangthai !== 1) {
                return { success: false, message: "Khuyến mãi đã bị khoá." };
            }
            const now = new Date();
            if (new Date(data.ngaybatdau) > now || new Date(data.ngayketthuc) < now) {
                return { success: false, message: "Khuyến mãi đã hết hạn hoặc chưa bắt đầu." };
            }
            if (total < data.dieukien_toithieu) {
                return { success: false, message: `Chưa đạt đơn tối thiểu ${data.dieukien_toithieu.toLocaleString('vi-VN')}đ` };
            }
            return { success: true, data };
        } else if (res.status === 404) {
            return { success: false, message: "Mã giảm giá không hợp lệ." };
        } else {
            return { success: false, message: "Lỗi kiểm tra mã." };
        }
    } catch (error) {
        console.error("Lỗi áp dụng voucher", error);
        return { success: false, message: "Lỗi kết nối Server" };
    }
};
