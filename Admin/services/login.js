import api from "../utils/request";
export const apiLogin = async (obj) => {
    const res = await api.post("/CtrNguoidung/login",obj);
    return res.data;
}
export const apiGetprofile_byid = async (id) => {
    const res = await api.get(`/CtrNguoidung/getbyid?id=${id}`);
    return res.data;
}
export const apiChangepassword = async (pass,id) => {
    const res = await api.get(`/CtrNguoidung/Changepassword?password=${pass}&id=${id}`);
    return res.data;
}
export const apiUpdateUser = async (obj) => {
    const res = await api.put(`/CtrNguoidung/update`,obj);
    return res.data;
}

export const apiGetall = async () => {
    const res = await api.get(`/CtrNguoidung/Getall?page_number=1&page_size=20`);
    return res.data;
}
export const apiUpdateRole = async (id,role,state) => {
    const res = await api.get(`/CtrNguoidung/UpdateRole?id=${id}&role=${role}&state=${state}`);
    return res.data;
}
