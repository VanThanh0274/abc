import api from '../../utils/request'

export const getAllPromotions = async () => {
  const res = await api.get('Ctr_Khuyenmai/GetAll');
  return res.data;
};

export const getPromotionByCode = async (code) => {
  const res = await api.get(`Ctr_Khuyenmai/GetByCode/${code}`);
  return res.data;
};

export const createPromotion = async (obj) => {
  const res = await api.post('Ctr_Khuyenmai/Create', obj);
  return res.data;
}

export const updatePromotion = async (obj) => {
  const res = await api.put(`Ctr_Khuyenmai/Update`, obj);
  return res.data;
}

export const deletePromotion = async (id) => {
  const res = await api.delete(`Ctr_Khuyenmai/Delete/${id}`);
  return res.data;
}
