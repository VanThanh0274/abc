import api from '../../utils/request';
export const GetallOrder = async (page_number, page_size) => {
  const res = await api.get(`/CtrDonhang/Getall?page_number=${page_number}&page_size=${page_size}`);
  return res.data
}
export const FilterOrder = async function (trangthai, keyword, page_number, page_size) {
  var query = "";

  if (trangthai) {
    query += "trangthai=" + encodeURIComponent(trangthai) + "&";
  }

  if (keyword!=='') {
    query += "keyword=" + encodeURIComponent(keyword) + "&";
  }

  if (page_number !== undefined) {
    query += "page_number=" + page_number + "&";
  }

  if (page_size !== undefined) {
    query += "page_size=" + page_size + "&";
  }

  // Xoá dấu & cuối cùng nếu có
  if (query.endsWith("&")) {
    query = query.slice(0, -1);
  }

  const res = await api.get("/CtrDonhang/Filter?" + query);
  return res.data;
};

export const UpdateState = async (state, id) => {
  const res = await api.put(`/CtrDonhang/Update_trangthai?trangthai=${encodeURIComponent(state)}&mahd=${id}`);
  return res.data
}

export const CreateVanchuyen = async (obj) => {
  const res = await api.post('/CtrDonhang/Insert_vanchuyen', obj);
  return res.data
}

export const Getorderbyid = async (id) => {
  const res = await api.get(`/CtrDonhang/Getdonhang_byid?mahd=${id}`);
  return res.data;
}

export const Getvanchuyen = async (id) => {
  const res = await api.get(`/CtrDonhang/Get_vanchuyen?mahd=${id}`);
  return res.data;
}

export const Updatevanchuyen = async (id) => {
  const res = await api.put(`/CtrDonhang/Update_vanchuyen?mavandon=${id}`);
  return res.data;
}
