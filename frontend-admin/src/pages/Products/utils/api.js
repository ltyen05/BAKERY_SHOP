import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001", // đổi theo backend của cậu
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Gắn token tự động
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
