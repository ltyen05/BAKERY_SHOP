// ===============================================
// FILE: src/api/dashboardApi.js
// Kéo API Dashboard cho Admin và Super Admin
// ===============================================
import api from './axiosConfig';

export const dashboardApi = {
  // ========================================
  // BRANCH ADMIN APIs - Chi nhánh cụ thể
  // ========================================
  
  // Tổng số đơn hàng theo tháng
  getTotalOrders: async (month, year) => {
    try {
      console.log(` [Branch API] GET /admin/dashboard/total_orders?month=${month}&year=${year}`);
      const response = await api.get('/admin/dashboard/total_orders', {
        params: { month, year }
      });
      console.log(' Response:', response.data);
      
      return { 
        success: true, 
        data: response.data.total_orders || 0 
      };
    } catch (error) {
      console.error(' Error:', error);
      return { success: false, data: 0 };
    }
  },

  // Tổng doanh thu theo tháng
  getTotalAmount: async (month, year) => {
    try {
      console.log(` [Branch API] POST /admin/dashboard/total_amount_for_month?month=${month}&year=${year}`);
      const response = await api.post('/admin/dashboard/total_amount_for_month', null, {
        params: { month, year }
      });
      console.log(' Response:', response.data);
      
      return { 
        success: true, 
        data: response.data.total_amount || 0 
      };
    } catch (error) {
      console.error(' Error:', error);
      return { success: false, data: 0 };
    }
  },

  // Tổng số khách hàng theo tháng
  getTotalCustomers: async (month, year) => {
    try {
      console.log(`📡 [Branch API] POST /admin/dashboard/total_customer_of_month?month=${month}&year=${year}`);
      const response = await api.post('/admin/dashboard/total_customer_of_month', null, {
        params: { month, year }
      });
      console.log(' Response:', response.data);
      
      return { 
        success: true, 
        data: response.data.total_customers || 0 
      };
    } catch (error) {
      console.error(' Error:', error);
      return { success: false, data: 0 };
    }
  },

  // Tổng sản phẩm bán ra theo tháng
  getTotalProducts: async (month, year) => {
    try {
      console.log(` [Branch API] POST /admin/dashboard/total_product_of_month?month=${month}&year=${year}`);
      const response = await api.post('/admin/dashboard/total_product_of_month', null, {
        params: { month, year }
      });
      console.log(' Response:', response.data);
      
      return { 
        success: true, 
        data: response.data.total_products || 0 
      };
    } catch (error) {
      console.error(' Error:', error);
      return { success: false, data: 0 };
    }
  },

  // Phân bố trạng thái đơn hàng
  getOrderStatusDistribution: async () => {
    try {
      console.log(' [Branch API] GET /admin/dashboard/order-status-distribution');
      const response = await api.get('/admin/dashboard/order-status-distribution');
      console.log(' Response:', response.data);
      
      return { 
        success: true, 
        data: response.data.data || { total_orders: 0, distribution: [] }
      };
    } catch (error) {
      console.error(' Error:', error);
      return { 
        success: false, 
        data: { total_orders: 0, distribution: [] } 
      };
    }
  },

  // Top sản phẩm bán chạy
  getTopProducts: async () => {
    try {
      console.log(' [Branch API] GET /admin/dashboard/top-products');
      const response = await api.get('/admin/dashboard/top-products');
      console.log(' Response:', response.data);
      
      return { 
        success: true, 
        data: response.data.data || [] 
      };
    } catch (error) {
      console.error(' Error:', error);
      return { success: false, data: [] };
    }
  },

  // Tăng trưởng khách hàng
  getCustomerGrowth: async () => {
    try {
      console.log(' [Branch API] GET /admin/dashboard/customer-growth');
      const response = await api.get('/admin/dashboard/customer-growth');
      console.log(' Response:', response.data);
      
      return { 
        success: true, 
        data: response.data.data || [] 
      };
    } catch (error) {
      console.error(' Error:', error);
      return { success: false, data: [] };
    }
  },

  // ========================================
  // SUPER ADMIN APIs - Toàn hệ thống
  // ========================================
  
  // Doanh thu theo chi nhánh
  getRevenuePerBranch: async () => {
    try {
      console.log(' [Super API] GET /superadmin/dashboard/revenue_per_branch');
      const response = await api.get('/superadmin/dashboard/revenue_per_branch');
      console.log(' Response:', response.data);
      
      return { 
        success: true, 
        data: response.data.data || [] 
      };
    } catch (error) {
      console.error(' Error:', error);
      return { success: false, data: [] };
    }
  },

  // Thống kê trạng thái đơn hàng (toàn hệ thống)
  getOrderStats: async () => {
    try {
      console.log(' [Super API] GET /superadmin/dashboard/order_stats');
      const response = await api.get('/superadmin/dashboard/order_stats');
      console.log(' Response:', response.data);
      
      return { 
        success: true, 
        data: response.data.data || [] 
      };
    } catch (error) {
      console.error(' Error:', error);
      return { success: false, data: [] };
    }
  },

  // Biểu đồ doanh thu theo thời gian
  getRevenueChart: async (period = 'month') => {
    try {
      console.log(` [Super API] GET /superadmin/dashboard/revenue_chart?period=${period}`);
      const response = await api.get('/superadmin/dashboard/revenue_chart', {
        params: { period }
      });
      console.log(' Response:', response.data);
      
      return { 
        success: true, 
        data: response.data.data || [] 
      };
    } catch (error) {
      console.error(' Error:', error);
      return { success: false, data: [] };
    }
  }
};

export default dashboardApi;