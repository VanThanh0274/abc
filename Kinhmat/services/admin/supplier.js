import api from '../../utils/request'

export const getAllSupplier = async () => {
  const res = await api.get('API_Nhacungcap/Get-all');
  return res.data;
};

export const createSupplier = async (obj) => {
  const res = await api.post('API_Nhacungcap/Create', obj);
  return res.data;
}

export const deleteSupplier = async (id) => {
  const res = await api.delete(`API_Nhacungcap/Delete/${id}`);
  return res.data;
}

export const updateSupplier = async (obj) => {
  const res = await api.put(`API_Nhacungcap/Update`, obj);
  return res.data;
}

export const getSupplierById = async (id) => {
  const res = await api.get(`API_Nhacungcap/GetbyId?id=${id}`);
  return res.data;
}
