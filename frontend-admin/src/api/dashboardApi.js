// ===============================================
// FILE: src/api/dashboardApi.js

// ===============================================
import api from './axiosConfig';

export const dashboardApi = {
  // ========================================
  // BRANCH ADMIN APIs
  // ========================================
  
  //  4 APIs  theo month/year
  getTotalOrders: async (month, year) => {
    try {
      const response = await api.get('/admin/dashboard/total_orders', {
        params: { month, year }
      });
      return { 
        success: true, 
        data: response.data?.total_orders || 0 
      };
    } catch (error) {
      console.error('[dashboardApi] getTotalOrders error:', error);
      return { success: false, data: 0 };
    }
  },

  getTotalAmount: async (month, year) => {
    try {
      const response = await api.post('/admin/dashboard/total_amount_for_month', null, {
        params: { month, year }
      });
      return { 
        success: true, 
        data: response.data?.total_amount || 0 
      };
    } catch (error) {
      console.error('[dashboardApi] getTotalAmount error:', error);
      return { success: false, data: 0 };
    }
  },

  getTotalCustomers: async (month, year) => {
    try {
      const response = await api.post('/admin/dashboard/total_customer_of_month', null, {
        params: { month, year }
      });
      return { 
        success: true, 
        data: response.data?.total_customers || 0 
      };
    } catch (error) {
      console.error('[dashboardApi] getTotalCustomers error:', error);
      return { success: false, data: 0 };
    }
  },

  getTotalProducts: async (month, year) => {
    try {
      const response = await api.post('/admin/dashboard/total_product_of_month', null, {
        params: { month, year }
      });
      return { 
        success: true, 
        data: response.data?.total_products || 0 
      };
    } catch (error) {
      console.error('[dashboardApi] getTotalProducts error:', error);
      return { success: false, data: 0 };
    }
  },

  // trả tất cả data)
  getOrderStatusDistribution: async () => {
    try {
      const response = await api.get('/admin/dashboard/order-status-distribution');
      return { 
        success: true, 
        data: response.data?.data || { total_orders: 0, distribution: [] } 
      };
    } catch (error) {
      console.error('[dashboardApi] getOrderStatusDistribution error:', error);
      return { success: false, data: { total_orders: 0, distribution: [] } };
    }
  },

  getTopProducts: async () => {
    try {
      const response = await api.get('/admin/dashboard/top-products');
      return { 
        success: true, 
        data: response.data?.data || [] 
      };
    } catch (error) {
      console.error('[dashboardApi] getTopProducts error:', error);
      return { success: false, data: [] };
    }
  },

  getCustomerGrowth: async () => {
    try {
      const response = await api.get('/admin/dashboard/customer-growth');
      return { 
        success: true, 
        data: response.data?.data || [] 
      };
    } catch (error) {
      console.error('[dashboardApi] getCustomerGrowth error:', error);
      return { success: false, data: [] };
    }
  },

  // ========================================
  // SUPER ADMIN APIs (KHÔNG FILTER)
  // ========================================
  
  //  Doanh thu theo chi nhánh
  getRevenuePerBranch: async () => {
    try {
      const response = await api.get('/superadmin/dashboard/revenue_per_branch');
      console.log('[dashboardApi] getRevenuePerBranch response:', response.data);
      return { 
        success: true, 
        data: response.data?.data || [] 
      };
    } catch (error) {
      console.error('[dashboardApi] getRevenuePerBranch error:', error);
      return { success: false, data: [] };
    }
  },

  //  Thống kê đơn hàng theo status
  getOrderStats: async () => {
    try {
      const response = await api.get('/superadmin/dashboard/order_stats');
      console.log('[dashboardApi] getOrderStats response:', response.data);
      return { 
        success: true, 
        data: response.data?.data || [] 
      };
    } catch (error) {
      console.error('[dashboardApi] getOrderStats error:', error);
      return { success: false, data: [] };
    }
  },

  //  Biểu đồ doanh thu theo thời gian
  getRevenueChart: async (period = 'month') => {
    try {
      const response = await api.get('/superadmin/dashboard/revenue_chart', {
        params: { period }
      });
      console.log('[dashboardApi] getRevenueChart response:', response.data);
      return { 
        success: true, 
        data: response.data?.data || [] 
      };
    } catch (error) {
      console.error('[dashboardApi] getRevenueChart error:', error);
      return { success: false, data: [] };
    }
  }
};

export default dashboardApi;