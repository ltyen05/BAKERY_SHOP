// ===============================================
// FILE: src/api/productApi.js
// ===============================================
import api from "./axiosConfig";

const BASE_PATH = "http://localhost:5001/api/superadmin";

export const productApi = {
  getAllProducts: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/products`);

      let productsArray = [];

      if (Array.isArray(response.data)) {
        productsArray = response.data;
      } else if (response.data.success && Array.isArray(response.data.data)) {
        productsArray = response.data.data;
      } else {
        return [];
      }

      const mappedProducts = productsArray.map((p) => ({
        product_id: p.product_id,
        name: p.name,
        category_id: p.category_id,
        unit_price: p.unit_price,
        image_url: p.image_url,
        description: p.description || "",
        rating: p.rating || 0,
        updated_at: p.updated_at || null,
        id: p.product_id,
        categoryId: p.category,
        price: p.unit_price,
        image: p.image,
      }));

      return mappedProducts;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể tải danh sách sản phẩm"
      );
    }
  },

  addProduct: async (productData) => {
    try {
      const payload = {
        name: productData.name,
        description: productData.description || "",
        image_url: productData.image_url || "",
        unit_price: parseFloat(productData.unit_price) || 0,
        category_id: parseInt(productData.category_id),
      };

      const response = await api.post(`${BASE_PATH}/add_products`, payload);

      return {
        success: response.data.success !== false,
        message: response.data.message || "Thêm sản phẩm thành công",
        id: response.data.id || response.data.product_id,
      };
    } catch (error) {
      if (error.response?.status === 403) {
        return {
          success: false,
          message: "Bạn không có quyền thêm sản phẩm",
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || "Lỗi khi thêm sản phẩm",
      };
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      const payload = {
        name: productData.name,
        description: productData.description || "",
        image_url: productData.image_url || "",
        unit_price: parseFloat(productData.unit_price),
        category_id: parseInt(productData.category_id),
      };

      const response = await api.put(
        `${BASE_PATH}/update_products/${productId}`,
        payload
      );

      return {
        success: response.data.success !== false,
        message: response.data.message || "Cập nhật sản phẩm thành công",
      };
    } catch (error) {
      if (error.response?.status === 403) {
        return {
          success: false,
          message: "Bạn không có quyền cập nhật sản phẩm",
        };
      }

      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Không tìm thấy sản phẩm",
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || "Lỗi khi cập nhật sản phẩm",
      };
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(
        `${BASE_PATH}/delete_products/${productId}`
      );

      return {
        success: response.data.success !== false,
        message: response.data.message || "Xóa sản phẩm thành công",
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Không tìm thấy sản phẩm",
        };
      }

      if (error.response?.status === 403) {
        return {
          success: false,
          message: "Bạn không có quyền xóa sản phẩm",
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || "Lỗi khi xóa sản phẩm",
      };
    }
  },
};

export default productApi;