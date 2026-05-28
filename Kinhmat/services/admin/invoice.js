import api from '../../utils/request';

// ======= NHÀ CUNG CẤP =======
export const getAllSuppliers = async () => {
  const res = await api.get('/API_Nhacungcap/Get-all');
  return res.data;
};

// ======= HÓA ĐƠN NHẬP KHO =======
export const getAllHoadonNhap = async () => {
  const res = await api.get('/API_HoadonNhap/Get-all');
  return res.data;
};

export const getHoadonNhapById = async (mahdn) => {
  const res = await api.get(`/API_HoadonNhap/Get-by-id/${mahdn}`);
  return res.data;
};

export const getHoadonNhapChitiet = async (mahdn) => {
  const res = await api.get(`/API_HoadonNhap/Get-chitiet/${mahdn}`);
  return res.data;
};

export const createHoadonNhap = async (data) => {
  // data: { mancc, nguoinhap, ghichu, chitiet: [{masp, soluong, gianhap}] }
  const res = await api.post('/API_HoadonNhap/Create', data);
  return res.data;
};

export const confirmHoadonNhap = async (mahdn) => {
  const res = await api.put(`/API_HoadonNhap/Confirm/${mahdn}`);
  return res.data;
};

// ======= HÓA ĐƠN XUẤT KHO =======
export const getAllHoadonXuat = async () => {
  const res = await api.get('/API_HoadonXuat/Get-all');
  return res.data;
};

export const getHoadonXuatById = async (mahdx) => {
  const res = await api.get(`/API_HoadonXuat/Get-by-id/${mahdx}`);
  return res.data;
};

export const getHoadonXuatChitiet = async (mahdx) => {
  const res = await api.get(`/API_HoadonXuat/Get-chitiet/${mahdx}`);
  return res.data;
};

export const createHoadonXuatFromDonhang = async (data) => {
  // data: { mahd, nguoixuat, ghichu }
  const res = await api.post('/API_HoadonXuat/Create-from-donhang', data);
  return res.data;
};
