import api from '../../utils/request'

export const getAllCategory = async () => {
  const res = await api.get('Ctr_Danhmuc/Get-all');
  return res.data;
};
export const searchCategory = async (danhmuc) => {
  const res = await api.get(`/Ctr_Danhmuc/Search?danhmuc=${danhmuc}`);
  return res.data;
};
export const CreatCategory = async (obj) => {
  const res = await api.post('Ctr_Danhmuc/Create',obj);
  return res.data;
}
export const DeleteCategory = async (id) => {
  const res = await api.delete(`Ctr_Danhmuc/Delete?id=${id}`);
  return res.data;
}
export const UpdateCategory = async (obj) => {
  const res = await api.put(`Ctr_Danhmuc/Update`,obj);
  return res.data;
}