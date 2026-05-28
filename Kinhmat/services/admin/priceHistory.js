import api from '../../utils/request';

export const getAllActivePrice = async () => {
  const res = await api.get('/API_LichSuGia/Get-all-active');
  return res.data;
};

export const getPriceHistoryBySP = async (masp) => {
  const res = await api.get(`/API_LichSuGia/Get-by-sku/${masp}`);
  return res.data;
};

export const updatePrice = async (data) => {
  // data: { masp, gianhap, giaban }
  const res = await api.post('/API_LichSuGia/Create', data);
  return res.data;
};
