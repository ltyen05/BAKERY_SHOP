import api from './axiosConfig';

const BASE_PATH = '/admin/product_management';

export const productApi = {
  // Lấy danh sách tất cả sản phẩm
  getAllProducts: async () => {
    const response = await api.get(`${BASE_PATH}/products`);
    return response.data;
  },

  // Thêm sản phẩm mới
  addProduct: async (data) => {
    const response = await api.post(`${BASE_PATH}/products`, data);
    return response.data;
  },

  // Cập nhật sản phẩm
  updateProduct: async (productId, data) => {
    const response = await api.put(`${BASE_PATH}/products/${productId}`, data);
    return response.data;
  },

  // Xóa sản phẩm
  deleteProduct: async (productId) => {
    const response = await api.delete(`${BASE_PATH}/products/${productId}`);
    return response.data;
  },

  // Lấy chi tiết sản phẩm theo ID
  getProductById: async (productId) => {
    const response = await api.get(`${BASE_PATH}/products/${productId}`);
    return response.data;
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (keyword) => {
    const response = await api.get(`${BASE_PATH}/products/search`, {
      params: { keyword },
    });
    return response.data;
  },
};

export default productApi;
