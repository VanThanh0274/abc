import api from '../../utils/request'
export const getThongke_by_year = async (year) => {
  const res = await api.get(`/Ctr_Thongke/Thongke_year?year=${year}`);
  return res.data;
};
export const getTop5product = async (type,month, year) => {
  const res = await api.get(`/Ctr_Thongke/Top5spbanchay?type=${type}&month=${month}&year=${year}`);
  return res.data;
};
export const getThongke_today = async () => {
  const res = await api.get(`/Ctr_Thongke/Thongke_today`);
  return res.data;
};
export const getThongke_tongquan = async () => {
  const res = await api.get(`/Ctr_Thongke/Thongke_tongquan`);
  return res.data;
};
export const getThongke_donhang = async (year) => {
  const res = await api.get(`/Ctr_Thongke/Thongke_Donhang?year=${year}`);
  return res.data;
};
export const getTop5sp_itduocmua = async (type,month,year) => {
  const res = await api.get(`/Ctr_Thongke/Top5sp_itduocmua?type=${type}&month=${month}&year=${year}`);
  return res.data;
};