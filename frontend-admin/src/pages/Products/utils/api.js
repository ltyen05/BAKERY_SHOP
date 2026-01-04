// FILE: src/pages/Products/utils/api.js
// FIXED: Changed baseURL to production domain
import axios from "axios";

const api = axios.create({
  // 👇 SỬA Ở ĐÂY: Trỏ về domain thật
  baseURL: "https://husbakery.duckdns.org", 
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