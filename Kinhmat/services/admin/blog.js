import api from '../../utils/request';

// ==========================
// API DANH MỤC BLOG
// ==========================
export const getAllDanhmucBlog = async () => {
    const res = await api.get('/Ctr_Blog/GetallDanhmuc');
    return res.data;
};

export const createDanhmucBlog = async (data) => {
    const res = await api.post('/Ctr_Blog/CreateDanhmuc', data);
    return res.data;
};

export const deleteDanhmucBlog = async (id) => {
    const res = await api.delete(`/Ctr_Blog/DeleteDanhmuc?id=${id}`);
    return res.data;
};


// ==========================
// API BÀI VIẾT BLOG
// ==========================
export const getAllBlogs = async (page = 1, size = 10) => {
    const res = await api.get(`/Ctr_Blog/Getall?page_number=${page}&page_size=${size}`);
    return res.data;
};

export const getBlogById = async (id) => {
    const res = await api.get(`/Ctr_Blog/Getbyid?id=${id}`);
    return res.data;
};

export const createBlog = async (data) => {
    const payload = { ...data };
    if (!payload.madanhmuc) payload.madanhmuc = null;
    else payload.madanhmuc = parseInt(payload.madanhmuc);
    const res = await api.post('/Ctr_Blog/Create', payload);
    return res.data;
};

export const updateBlog = async (data) => {
    const payload = { ...data };
    if (!payload.madanhmuc) payload.madanhmuc = null;
    else payload.madanhmuc = parseInt(payload.madanhmuc);
    const res = await api.put('/Ctr_Blog/Update', payload);
    return res.data;
};

export const deleteBlog = async (id) => {
    const res = await api.delete(`/Ctr_Blog/Delete?id=${id}`);
    return res.data;
};

export const searchBlog = async (keyword = '', trangthai = '', page = 1, size = 10) => {
    const res = await api.get(`/Ctr_Blog/Search?keyword=${encodeURIComponent(keyword)}&trangthai=${trangthai}&page_number=${page}&page_size=${size}`);
    return res.data;
};

export const increaseView = async (id) => {
    const res = await api.post(`/Ctr_Blog/IncreaseView?id=${id}`);
    return res.data;
};

export const uploadBlogImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post('/Ctr_Blog/UploadImage', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return res.data; // { Message: "Thành công", url: "..." }
};
