// ===============================================
// FILE: src/api/dashboardApi.js
// ===============================================
import api from "./axiosConfig";

// Định nghĩa đường dẫn gốc cho gọn code
const ADMIN_PATH = "/api/admin/dashboard";
const SUPER_ADMIN_PATH = "/api/superadmin/dashboard";

export const dashboardApi = {
  // ========================================
  // BRANCH ADMIN APIs
  // ========================================

  getTotalOrders: async (month, year) => {
    try {
      // Đã sửa: dùng ADMIN_PATH
      const response = await api.get(`${ADMIN_PATH}/total_orders`, {
        params: { month, year },
      });
      return {
        success: true,
        data: response.data?.total_orders || 0,
      };
    } catch (error) {
      console.error("[dashboardApi] getTotalOrders error:", error);
      return { success: false, data: 0 };
    }
  },

  getTotalAmount: async (month, year, branch_id) => {
    try {
      const response = await api.post(
        `${ADMIN_PATH}/total_amount_for_month`,
        null,
        {
          params: { month, year, branch_id },
        }
      );
      return {
        success: true,
        data: response.data?.total_amount || 0,
      };
    } catch (error) {
      console.error("[dashboardApi] getTotalAmount error:", error);
      return { success: false, data: 0 };
    }
  },

  getTotalCustomers: async (month, year) => {
    console.log("DEBUG getTotalCustomers:", { month, year });
    try {
      const response = await api.post(
        `${ADMIN_PATH}/total_customer_of_month`,
        null,
        {
          params: { month, year },
        }
      );
      console.log("Response total:", response.data);
      return {
        success: true,
        data: response.data?.total_customers || 0,
      };
    } catch (error) {
      console.error("[dashboardApi] getTotalCustomers error:", error);
      return { success: false, data: 0 };
    }
  },

  getTotalProducts: async (month, year) => {
    try {
      const response = await api.post(
        `${ADMIN_PATH}/total_product_of_month`,
        null,
        {
          params: { month, year },
        }
      );
      return {
        success: true,
        data: response.data?.total_products || 0,
      };
    } catch (error) {
      console.error("[dashboardApi] getTotalProducts error:", error);
      return { success: false, data: 0 };
    }
  },

  getOrderStatusDistribution: async (month, year, branch_id) => {
    try {
      const response = await api.get(
        `${ADMIN_PATH}/order-status-distribution`,
        {
          params: { month, year, branch_id },
        }
      );

      return {
        success: true,
        data: response.data?.data || { total_orders: 0, distribution: [] },
      };
    } catch (error) {
      console.error(
        "[dashboardApi] getOrderStatusDistribution error:",
        error
      );
      return {
        success: false,
        data: { total_orders: 0, distribution: [] },
      };
    }
  },

  getTopProducts: async (month, year, branch_id) => {
    try {
      const response = await api.get(`${ADMIN_PATH}/top-products`, {
        params: { month, year, branch_id },
      });

      return {
        success: true,
        data: response.data?.data || [],
      };
    } catch (error) {
      console.error("[dashboardApi] getTopProducts error:", error);
      return { success: false, data: [] };
    }
  },

  getCustomerGrowth: async () => {
    try {
      const response = await api.get(`${ADMIN_PATH}/customer-growth`);
      return {
        success: true,
        data: response.data?.data || [],
      };
    } catch (error) {
      console.error("[dashboardApi] getCustomerGrowth error:", error);
      return { success: false, data: [] };
    }
  },

  // ========================================
  // SUPER ADMIN APIs (CÓ FILTER MONTH/YEAR)
  // ========================================

  //  Doanh thu theo chi nhánh - THÊM month, year
  getRevenuePerBranch: async (month, year) => {
    try {
      // Đã sửa: dùng SUPER_ADMIN_PATH
      const response = await api.get(
        `${SUPER_ADMIN_PATH}/revenue_per_branch`,
        {
          params: { month, year },
        }
      );
      console.log(
        "[dashboardApi] getRevenuePerBranch response:",
        response.data
      );
      return {
        success: true,
        data: response.data?.data || [],
      };
    } catch (error) {
      console.error("[dashboardApi] getRevenuePerBranch error:", error);
      return { success: false, data: [] };
    }
  },

  // Thống kê đơn hàng theo status
  getOrderStats: async (month, year) => {
    try {
      const response = await api.get(`${SUPER_ADMIN_PATH}/order_stats`, {
        params: { month, year },
      });
      console.log("[dashboardApi] getOrderStats response:", response.data);
      return {
        success: true,
        data: response.data?.data || [],
      };
    } catch (error) {
      console.error("[dashboardApi] getOrderStats error:", error);
      return { success: false, data: [] };
    }
  },

  //  Biểu đồ doanh thu theo thời gian
  getRevenueChart: async (period = "month", month, year) => {
    try {
      const response = await api.get(`${SUPER_ADMIN_PATH}/revenue_chart`, {
        params: { period, month, year },
      });
      console.log("[dashboardApi] getRevenueChart response:", response.data);
      return {
        success: true,
        data: response.data?.data || [],
      };
    } catch (error) {
      console.error("[dashboardApi] getRevenueChart error:", error);
      return { success: false, data: [] };
    }
  },
};

export default dashboardApi;