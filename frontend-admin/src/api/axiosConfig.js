// ===============================================
// Location: src/api/axiosConfig.js - CHECKED & FIXED
// ===============================================
import axios from 'axios';

const api = axios.create({
  //  KHÔNG CẦN baseURL vì Vite proxy đã handle
  // Vite proxy sẽ chuyển:
  // /admin/... -> http://localhost:5001/admin/...
  // /api/...   -> http://localhost:5000/api/...
  
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, //  Gửi cookies
  timeout: 10000, //  10s timeout
});

// ============= REQUEST INTERCEPTOR =============
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(' Request:', {
      method: config.method.toUpperCase(),
      url: config.url,
      params: config.params,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error(' Request error:', error);
    return Promise.reject(error);
  }
);

// ============= RESPONSE INTERCEPTOR =============
api.interceptors.response.use(
  (response) => {
    console.log(' Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Handle error responses
    if (error.response) {
      // Server responded with error
      console.error(' API Error:', {
        status: error.response.status,
        url: error.config?.url,
        data: error.response.data
      });

      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          console.error(' Unauthorized - Token expired or invalid');
          // Optional: Clear token and redirect to login
          // localStorage.removeItem('token');
          // window.location.href = '/login';
          break;
        case 403:
          console.error(' Forbidden - No permission');
          break;
        case 404:
          console.error(' Not Found');
          break;
        case 500:
          console.error(' Server Error');
          break;
      }
    } else if (error.request) {
      // Request was made but no response
      console.error(' No response from server:', error.request);
    } else {
      // Something else happened
      console.error(' Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;