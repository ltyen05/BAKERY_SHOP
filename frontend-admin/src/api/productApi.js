// ===============================================
// src/api/productApi.js
// ===============================================
import api from './axiosConfig';

const BASE_PATH = '/admin/product_management';

const transformToBackendFormat = (data) => {
  return {
    name: data.name,
    category: data.category_id, 
    price: data.unit_price, 
    image: data.image_url, 
    description: data.description || '',
    rating: data.rating || 5.0
  };
};

const transformToFrontendFormat = (data) => {
  return {
    product_id: data.product_id,
    name: data.name,
    category_id: data.category, 
    unit_price: data.price, 
    image_url: data.image, 
    description: data.description || '',
    rating: data.rating || 5.0
  };
};

export const productApi = {
  // Lấy danh sách tất cả sản phẩm
  getAllProducts: async () => {
    const response = await api.get(`${BASE_PATH}/products`);
    return response.data.map(transformToFrontendFormat);
  },

  // Thêm sản phẩm mới
  addProduct: async (data) => {
    const backendData = transformToBackendFormat(data);
    const response = await api.post(`${BASE_PATH}/products`, backendData);
    return transformToFrontendFormat(response.data);
  },

  // Cập nhật sản phẩm
  updateProduct: async (productId, data) => {
    const backendData = transformToBackendFormat(data);
    const response = await api.put(`${BASE_PATH}/products/${productId}`, backendData);
    return transformToFrontendFormat(response.data);
  },

  // Xóa sản phẩm
  deleteProduct: async (productId) => {
    const response = await api.delete(`${BASE_PATH}/products/${productId}`);
    return response.data;
  },

  // Lấy chi tiết sản phẩm theo ID
  getProductById: async (productId) => {
    const response = await api.get(`${BASE_PATH}/products/${productId}`);
    return transformToFrontendFormat(response.data);
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (keyword) => {
    const response = await api.get(`${BASE_PATH}/products/search`, {
      params: { keyword },
    });
    return response.data.map(transformToFrontendFormat);
  },
};

export default productApi;