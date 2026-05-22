import api from '../../utils/request'
export const Uploadimage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post('/Ctr_Kinhmat/Upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data; // { Message: "Thành công", url: "..." }
};

export const GetallProduct = async (index, size) => {
  const res = await api.get(`/Ctr_Kinhmat/Getall?page_number=${index}&page_size=${size}`);
  return (await res).data
}
export const SearchProduct = async (kinhmat,page_number,page_size) => {
  const res = await api.get(`/Ctr_Kinhmat/Search?kinhmat=${encodeURIComponent(kinhmat)}&page_number=${page_number}&page_size=${page_size}`);
  return res.data;
}
export const Getbyidproduct = async (id) => {
  const res = await api.get(`/Ctr_Kinhmat/Getbyid?id=${id}`);
  return res.data
}
export const Createproduct = async(obj) => {
  const res = await api.post('/Ctr_Kinhmat/Create',obj);
  return res.data;
}
export const Updateproduct = async(obj) => {
  const res = await api.put('/Ctr_Kinhmat/Update',obj);
  return res.data;
}