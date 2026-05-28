import api from '../utils/request'

export const getListProductCategory = async (id,page_number,page_size) => {
  const res = await api.get(`/Ctr_Kinhmat_user/GetKinhmatdanhmuc?id=${id}&page_number=${page_number}&page_size=${page_size}`);
  return res.data;
};

export const getProductbyid = async (id) => {
  const res = await api.get(`/Ctr_Kinhmat_user/Getbyid?id=${id}`);
  return res.data;
};
export const searchProduct= async (name,page_number=1) => {
  const res = await api.get(`/Ctr_Kinhmat_user/Search?ten=${name}&page_number=${page_number}&page_size=9`);
  return res.data;
};

export const getProductgioithieu = async (gioithieu) => {
  const res = await api.get(`Ctr_Kinhmat_user/Getgioithieu?gioithieu=${encodeURIComponent(gioithieu)}`);
  return res.data;
};

export const filterProduct =async (chatlieu,kieudang) => {
  let url = "/Ctr_Kinhmat_user/Filter";

  // Trường hợp lọc cả hai
  if (chatlieu && chatlieu.trim() !== "" && kieudang && kieudang.trim() !== "") {
    url += `?chatlieu=${encodeURIComponent(chatlieu)}&kieudang=${encodeURIComponent(kieudang)}`;
  }
  // Chỉ lọc theo chất liệu
  else if (chatlieu && chatlieu.trim() !== "") {
    url += `?chatlieu=${encodeURIComponent(chatlieu)}`;
  }
  // Chỉ lọc theo kiểu dáng
  else if (kieudang && kieudang.trim() !== "") {
    url += `?kieudang=${encodeURIComponent(kieudang)}`;
  }
  // Còn lại: không lọc gì, giữ nguyên `/Filter`

  const res = await api.get(url);
  return res.data;
}