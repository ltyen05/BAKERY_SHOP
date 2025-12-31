// ===============================================
// Location: src/api/productApi.js
// ===============================================
import api from './axiosConfig';

const BASE_PATH = '/admin/product_management';

export const productApi = {
  // GET all products
  getAllProducts: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/products`);
      console.log('Backend response:', response.data);
      
      // Backend trả về: { product_id, name, category, price, image, description, rating }
      return response.data;
    } catch (error) {
      console.error(' Error fetching products:', error);
      throw error;
    }
  },

  // CREATE product
  addProduct: async (data) => {
    try {

      const backendData = {
        name: data.name,
        unit_price: parseFloat(data.unit_price),
        description: data.description || '',
        category_id: parseInt(data.category_id),
        image_url: data.image_url || ''
      };

      console.log(' Sending to backend:', backendData);
      const response = await api.post(`${BASE_PATH}/add_products`, backendData);
      console.log(' Add product response:', response.data);
      return response.data;
    } catch (error) {
      console.error(' Error adding product:', error.response?.data || error);
      throw error;
    }
  },

  // UPDATE product
  updateProduct: async (productId, data) => {
    try {
      const backendData = {
        name: data.name,
        unit_price: parseFloat(data.unit_price),
        description: data.description || '',
        category_id: parseInt(data.category_id),
        image_url: data.image_url || ''
      };

      console.log(' Updating product:', productId, backendData);
      const response = await api.put(`${BASE_PATH}/update_products/${productId}`, backendData);
      console.log(' Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error(' Error updating product:', error.response?.data || error);
      throw error;
    }
  },

  // DELETE product
  deleteProduct: async (productId) => {
    try {
      console.log(' Deleting product:', productId);
      const response = await api.delete(`${BASE_PATH}/delete_products/${productId}`);
      console.log(' Delete response:', response.data);
      return response.data;
    } catch (error) {
      console.error(' Error deleting product:', error.response?.data || error);
      throw error;
    }
  }
};

export default productApi;