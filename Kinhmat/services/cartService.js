const API_URL = "http://localhost:5273/api/Ctr_Giohang";

export const getCartDB = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const res = await fetch(`${API_URL}/get`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (error) {
        console.error("Lỗi lấy giỏ hàng DB", error);
    }
    return null;
};

export const addToCartDB = async (masp, soluong) => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const res = await fetch(`${API_URL}/add?masp=${masp}&soluong=${soluong}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return res.ok;
    } catch (error) {
        console.error("Lỗi thêm vào giỏ hàng DB", error);
    }
    return false;
};

export const updateCartDB = async (masp, soluong) => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const res = await fetch(`${API_URL}/update?masp=${masp}&soluong=${soluong}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return res.ok;
    } catch (error) {
        console.error("Lỗi cập nhật giỏ hàng DB", error);
    }
    return false;
};

export const removeFromCartDB = async (masp) => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const res = await fetch(`${API_URL}/remove?masp=${masp}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return res.ok;
    } catch (error) {
        console.error("Lỗi xóa giỏ hàng DB", error);
    }
    return false;
};
