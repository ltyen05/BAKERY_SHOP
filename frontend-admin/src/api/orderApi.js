import api from './axiosConfig';

const BASE_PATH = '/admin/order_management';

export const orderApi = {
  // Lấy danh sách tất cả đơn hàng
  getAllOrders: async () => {
    const response = await api.get(`${BASE_PATH}/orders`);
    return response.data;
  },

  // Lấy chi tiết đơn hàng theo ID
  getOrderDetail: async (orderId) => {
    const response = await api.get(`${BASE_PATH}/order_management`, {
      params: { order_id: orderId }
    });
    return response.data;
  },

  // Xóa đơn hàng
  deleteOrder: async (orderId) => {
    const response = await api.delete(`${BASE_PATH}/orders/${orderId}`);
    return response.data;
  },

  // Tìm kiếm đơn hàng (nếu backend có)
  searchOrders: async (keyword) => {
    const response = await api.get(`${BASE_PATH}/orders/search`, {
      params: { keyword }
    });
    return response.data;
  },

  // Cập nhật trạng thái đơn hàng (nếu cần thêm)
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`${BASE_PATH}/orders/${orderId}/status`, {
      status
    });
    return response.data;
  }
};

export default orderApi;