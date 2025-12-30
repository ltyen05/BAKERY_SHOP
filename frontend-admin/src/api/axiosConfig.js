// ===============================================
// src/api/axiosConfig
// ===============================================
import axios from 'axios';

const api = axios.create({
  baseURL: '', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

// Thêm token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(' Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(' API Error:', error);
    return Promise.reject(error);
  }
);

export default api;