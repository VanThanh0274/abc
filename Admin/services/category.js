import api from '../utils/request'

export const getAllCategory = async () => {
  const res = await api.get('/Ctr_Danhmuc_user/Getall');
  return res.data;
};

export const getTotalCategory = async (danhmuc) => {
  const res = await api.get(`/Ctr_Danhmuc_user/Get_totalproductdanhmuc?danhmuc=${encodeURIComponent(danhmuc)}`);
  return res.data;
};