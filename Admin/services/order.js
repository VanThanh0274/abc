import api from "../utils/request"
export const createOrder = async (obj) => {
    const res = await api.post('/Ctr_Donhang_user/Insert',obj);
    return res.data;
}
export const GetListorder_byid = async (id) => {
    const res = await api.get(`/Ctr_Donhang_user/GetbyidUser?id=${id}`);
    return res.data;
}