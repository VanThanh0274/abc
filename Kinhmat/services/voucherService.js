const API_URL = "http://localhost:5273/api/Ctr_Voucher";

export const getAvailableVouchers = async () => {
    try {
        const res = await fetch(`${API_URL}/available`);
        if (res.ok) {
            return await res.json();
        }
    } catch (error) {
        console.error("Lỗi lấy danh sách voucher", error);
    }
    return [];
};

export const applyVoucher = async (code, total) => {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, message: "Vui lòng đăng nhập" };

    try {
        const res = await fetch(`${API_URL}/apply?code=${code}&total=${total}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.ok) {
            const data = await res.json();
            return { success: true, data };
        } else {
            const errorData = await res.json();
            return { success: false, message: errorData.message || "Mã không hợp lệ" };
        }
    } catch (error) {
        console.error("Lỗi áp dụng voucher", error);
        return { success: false, message: "Lỗi kết nối Server" };
    }
};
