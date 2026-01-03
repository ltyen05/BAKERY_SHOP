// ===============================================
// FILE: src/api/orderApi.js - CLEAN VERSION
// ===============================================
import api from "./axiosConfig";

// Đã sửa: Dùng path tương đối, bỏ http://localhost:5001
const BASE_PATH = "/api/admin/order_management";

export const orderApi = {
  // GET - Lấy tất cả orders theo branch
  getAllOrders: async (branchId) => {
    try {
      const response = await api.get(`${BASE_PATH}/orders`, {
        params: { branch_id: branchId },
      });

      // Axios trả về data nằm trong response.data
      const result = response.data;

      return {
        success: result.success,
        data: result.data || [],
        count: result.count || 0,
        branch_id: result.branch_id,
      };
    } catch (error) {
      console.error("[orderApi] getAllOrders error:", error);
      throw error;
    }
  },

  getOrderDetail: async (orderId) => {
    try {
      const response = await api.get(`${BASE_PATH}/order_detail`, {
        params: { order_id: orderId },
      });

      const data = response.data;

      return {
        success: true,
        items: data.order_items || [],
        shipping_address: data.shipping_address || null,
        total_amount: data.total_amount || 0,
      };
    } catch (error) {
      // Giữ nguyên logic cũ: Nếu lỗi 404 (không tìm thấy) thì trả về rỗng chứ không throw lỗi
      if (error.response && error.response.status === 404) {
        return {
          success: true,
          items: [],
          shipping_address: null,
          total_amount: 0,
        };
      }

      console.error("[orderApi] getOrderDetail error:", error);
      return {
        success: false,
        items: [],
        error: error.message,
      };
    }
  },

  deleteOrder: async (orderId) => {
    try {
      const response = await api.delete(`${BASE_PATH}/delete_order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("[orderApi] deleteOrder error:", error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const response = await api.put(`${BASE_PATH}/orders/${orderId}`, {
        status: newStatus,
      });
      return response.data;
    } catch (error) {
      console.error("[orderApi] updateOrderStatus error:", error);
      throw error;
    }
  },
};

export default orderApi;