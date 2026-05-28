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
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token"); // token lưu sau khi đăng nhập admin
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Gửi token theo chuẩn Bearer
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
