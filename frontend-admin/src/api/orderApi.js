// ===============================================
// Location: src/api/orderApi.js - HANDLE EMPTY ITEMS
// ===============================================

const BASE_URL = '/admin/order_management';

export const orderApi = {
  // GET - Lấy tất cả orders theo branch
  getAllOrders: async (branchId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/orders?branch_id=${branchId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return {
        success: result.success,
        data: result.data || [],
        count: result.count || 0,
        branch_id: result.branch_id,
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // GET DETAIL - Handle 404 và empty items
  getOrderDetail: async (orderId) => {
    try {
      console.log('Fetching order detail for ID:', orderId);

      const response = await fetch(
        `${BASE_URL}/order_detail?order_id=${orderId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Handle 404 - order không có items
      if (response.status === 404) {
        console.warn('Order has no items (404)');
        return {
          success: true,
          items: [],
        };
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const items = await response.json();

      console.log('Order items:', items);

      // Handle empty response
      if (!items || (Array.isArray(items) && items.length === 0)) {
        console.warn('Order has no items (empty array)');
        return {
          success: true,
          items: [],
        };
      }

      // Backend trả về array items trực tiếp
      return {
        success: true,
        items: Array.isArray(items) ? items : [items],
      };
    } catch (error) {
      console.error('Error fetching order details:', error);

      // Trả về empty items thay vì throw error
      return {
        success: false,
        items: [],
        error: error.message,
      };
    }
  },

  // DELETE - Xóa order
  deleteOrder: async (orderId) => {
    try {
      const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  // UPDATE STATUS
  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },
};

export default orderApi;
