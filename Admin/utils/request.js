// utils/request.js
import axios from "axios";

const API_DOMAIN = "http://localhost:5273/api";

const instance = axios.create({
  baseURL: API_DOMAIN,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Tự động thêm token từ localStorage vào mỗi request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // token lưu sau khi đăng nhập admin
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Gửi token theo chuẩn Bearer
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
