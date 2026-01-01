// ===============================================
// FILE: src/api/orderApi.js - FINAL FIXED
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

  getOrderDetail: async (orderId) => {
    try {
      console.log('[orderApi] Fetching order detail for ID:', orderId);

      const response = await fetch(
        `${BASE_URL}/order_detail?order_id=${orderId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 404) {
        console.warn('[orderApi] Order has no items (404)');
        return {
          success: true,
          items: [],
          shipping_address: null,
          total_amount: 0
        };
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log('[orderApi] Raw response:', data);

      const items = data.order_items || [];
      const shipping_address = data.shipping_address || null;
      const total_amount = data.total_amount || 0;

      console.log('[orderApi] Parsed items:', items);

      return {
        success: true,
        items: items,
        shipping_address: shipping_address,
        total_amount: total_amount
      };
    } catch (error) {
      console.error('[orderApi] Error fetching order details:', error);

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
      const response = await fetch(`${BASE_URL}/delete_order/${orderId}`, {
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