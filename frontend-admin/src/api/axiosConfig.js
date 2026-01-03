// ===============================================
// Location: src/api/axiosConfig.js
// ===============================================
import axios from "axios";
import { tokenStorage } from "../utils/token";

// Lấy URL từ biến môi trường, nếu không có thì dùng localhost
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: BASE_URL, // <--- QUAN TRỌNG: Phải có cái này
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Gửi cookies nếu cần
  timeout: 10000, // 10s timeout
});

// ============= REQUEST INTERCEPTOR =============
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Vite dùng import.meta.env.DEV thay vì process.env.NODE_ENV
    if (import.meta.env.DEV) {
      console.log("🚀 Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        fullUrl: `${config.baseURL}${config.url}`, // Log full URL để dễ debug
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// ============= RESPONSE INTERCEPTOR =============
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log("✅ Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error("🔥 API Error:", {
        status: error.response.status,
        url: error.config?.url,
        message: error.response.data?.message || error.message,
      });

      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          console.error("⛔ Unauthorized - Token invalid or expired");
          // Có thể thêm logic tự động logout ở đây:
          // tokenStorage.remove();
          // window.location.href = '/login';
          break;
        case 403:
          console.error("🚫 Forbidden - No permission");
          break;
        case 404:
          console.error("❓ Not Found");
          break;
        case 500:
          console.error("💥 Server Error");
          break;
      }
    } else if (error.request) {
      console.error("⚠️ No response from server (Network Error?)");
    } else {
      console.error("⚠️ Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;