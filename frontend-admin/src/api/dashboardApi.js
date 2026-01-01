// ===============================================
// src/api/dashboardApi.js - Dashboard API (FIXED - Match Backend)
// ===============================================
import api from './axiosConfig';

const BASE_PATH = '/admin/dashboard';

export const dashboardApi = {
  // ============= TỔNG SỐ ĐƠN HÀNG THEO THÁNG =============
  getTotalOrders: async (month, year) => {
    try {
      const response = await api.get(`${BASE_PATH}/total_orders`, {
        params: { month, year }
      });

      return {
        success: true,
        data: response.data.total_orders
      };
    } catch (error) {
      console.error('Error fetching total orders:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message,
        data: 0
      };
    }
  },

  // ============= TỔNG DOANH THU THEO THÁNG =============
  getTotalAmount: async (month, year) => {
    try {
      const response = await api.post(`${BASE_PATH}/total_amount_for_month`, null, {
        params: { month, year }
      });

      return {
        success: true,
        data: response.data.total_amount
      };
    } catch (error) {
      console.error('Error fetching total amount:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message,
        data: 0
      };
    }
  },

  // ============= TỔNG SỐ KHÁCH HÀNG THEO THÁNG =============
  getTotalCustomers: async (month, year) => {
    try {
      const response = await api.post(`${BASE_PATH}/total_customer_of_month`, null, {
        params: { month, year }
      });

      return {
        success: true,
        data: response.data.total_customers
      };
    } catch (error) {
      console.error('Error fetching total customers:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message,
        data: 0
      };
    }
  },

  // ============= TỔNG SỐ SẢN PHẨM BÁN RA THEO THÁNG =============
  getTotalProducts: async (month, year) => {
    try {
      const response = await api.post(`${BASE_PATH}/total_product_of_month`, null, {
        params: { month, year }
      });

      return {
        success: true,
        data: response.data.total_products
      };
    } catch (error) {
      console.error('Error fetching total products:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message,
        data: 0
      };
    }
  },

  // ============= PHÂN BỐ TRẠNG THÁI ĐƠN HÀNG =============
  getOrderStatusDistribution: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/order-status-distribution`);

      // Backend trả về: { success: true, data: { total_orders, distribution: [...] } }
      return {
        success: response.data.success,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error fetching order status distribution:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        data: { total_orders: 0, distribution: [] }
      };
    }
  },

  // ============= TOP SẢN PHẨM BÁN CHẠY =============
  getTopProducts: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/top-products`);

      // Backend trả về: { success: true, data: [...] }
      // Mỗi item: { name, image, orders, revenue, percentage }
      return {
        success: response.data.success,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error fetching top products:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        data: []
      };
    }
  },

  // ============= TĂNG TRƯỞNG KHÁCH HÀNG =============
  getCustomerGrowth: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/customer-growth`);

      // Backend trả về: { success: true, data: [{ month: "Jan", customers: 45 }, ...] }
      return {
        success: response.data.success,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error fetching customer growth:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        data: []
      };
    }
  },

  // ============= LẤY TẤT CẢ DỮ LIỆU DASHBOARD (Optimized) =============
  getAllDashboardData: async (month, year) => {
    try {
      const [
        ordersRes,
        amountRes,
        customersRes,
        productsRes,
        statusRes,
        topProductsRes,
        growthRes
      ] = await Promise.all([
        dashboardApi.getTotalOrders(month, year),
        dashboardApi.getTotalAmount(month, year),
        dashboardApi.getTotalCustomers(month, year),
        dashboardApi.getTotalProducts(month, year),
        dashboardApi.getOrderStatusDistribution(),
        dashboardApi.getTopProducts(),
        dashboardApi.getCustomerGrowth()
      ]);

      return {
        success: true,
        data: {
          stats: {
            orders: ordersRes.data || 0,
            amount: amountRes.data || 0,
            customers: customersRes.data || 0,
            products: productsRes.data || 0
          },
          orderStatus: statusRes.data || { total_orders: 0, distribution: [] },
          topProducts: topProductsRes.data || [],
          customerGrowth: growthRes.data || []
        }
      };
    } catch (error) {
      console.error('Error fetching all dashboard data:', error);
      return {
        success: false,
        message: error.message,
        data: {
          stats: { orders: 0, amount: 0, customers: 0, products: 0 },
          orderStatus: { total_orders: 0, distribution: [] },
          topProducts: [],
          customerGrowth: []
        }
      };
    }
  }
};

export default dashboardApi;