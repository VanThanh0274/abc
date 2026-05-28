import api from '../utils/request';

// ==========================
// API BÀI VIẾT BLOG (USER SIDE)
// ==========================
export const getAllBlogsUser = async (page = 1, size = 10, keyword = '', danhmuc = '') => {
    let url = `/Ctr_Blog/Search?keyword=${encodeURIComponent(keyword)}&trangthai=1&page_number=${page}&page_size=${size}`;
    const res = await api.get(url);
    
    // Nếu có lọc danh mục, thực hiện lọc ở client vì SP search hiện tại chưa hỗ trợ tham số danh mục
    let blogs = res.data.data;
    if (danhmuc) {
        blogs = blogs.filter(b => b.madanhmuc != null && b.madanhmuc.toString() === danhmuc.toString());
    }
    
    return {
        ...res.data,
        data: blogs
    };
};

export const getBlogById = async (id) => {
    const res = await api.get(`/Ctr_Blog/Getbyid?id=${id}`);
    return res.data;
};

export const increaseView = async (id) => {
    const res = await api.post(`/Ctr_Blog/IncreaseView?id=${id}`);
    return res.data;
};

export const getAllDanhmucBlog = async () => {
    const res = await api.get('/Ctr_Blog/GetallDanhmuc');
    return res.data;
};
