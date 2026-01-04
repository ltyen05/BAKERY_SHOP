// ===============================================
// Location: src/api/axiosConfig.js
// FIXED: Auto-detect correct Env Var & Production Domain
// ===============================================
import axios from "axios";
import { tokenStorage } from "../utils/token";

// 👇 ĐÃ SỬA ĐOẠN NÀY:
// 1. Ưu tiên VITE_API_URL (cho khớp với docker-compose)
// 2. Dự phòng VITE_API_BASE_URL (cho code cũ)
// 3. Cuối cùng dùng domain thật (HUS BAKERY) thay vì localhost
const BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "https://husbakery.duckdns.org";

const api = axios.create({
  baseURL: BASE_URL, 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
  timeout: 10000, 
});

// ============= REQUEST INTERCEPTOR =============
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      console.log("🚀 Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        fullUrl: `${config.baseURL}${config.url}`,
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
      console.error("🔥 API Error:", {
        status: error.response.status,
        url: error.config?.url,
        message: error.response.data?.message || error.message,
      });

      switch (error.response.status) {
        case 401:
          console.error("⛔ Unauthorized - Token invalid or expired");
          // Có thể thêm logic logout: tokenStorage.remove(); window.location.href = '/';
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