// ===============================================
// Location: src/api/dashboardApi.js (FIXED VERSION)
// ===============================================
import api from "./axiosConfig";

// ============= ADMIN DASHBOARD APIs =============

/**
 * Lấy tổng số đơn hàng theo thời gian
 * @param {number} year - Năm (bắt buộc)
 * @param {number} month - Tháng (tùy chọn, truyền null để lấy cả năm)
 */
export const getTotalOrders = async (year, month) => {
  try {
    const params = { year };
    if (month) params.month = month;

    const response = await api.get("/api/admin/dashboard/total_orders", { params });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching total orders:", error);
    throw error;
  }
};

/**
 * Lấy tổng doanh thu theo thời gian
 * @param {number} year - Năm (bắt buộc)
 * @param {number} month - Tháng (tùy chọn, truyền null để lấy cả năm)
 */
export const getTotalAmount = async (year, month) => {
  try {
    const params = { year };
    if (month) params.month = month;

    const response = await api.get("/api/admin/dashboard/total_amount", { params });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching total amount:", error);
    throw error;
  }
};

/**
 * Lấy tổng số khách hàng theo thời gian
 * @param {number} year - Năm (bắt buộc)
 * @param {number} month - Tháng (tùy chọn, truyền null để lấy cả năm)
 */
export const getTotalCustomers = async (year, month) => {
  try {
    const params = { year };
    if (month) params.month = month;

    const response = await api.get("/api/admin/dashboard/total_customer", { params });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching total customers:", error);
    throw error;
  }
};

/**
 * Lấy tổng số sản phẩm đã bán theo thời gian
 * @param {number} year - Năm (bắt buộc)
 * @param {number} month - Tháng (tùy chọn, truyền null để lấy cả năm)
 */
export const getTotalProducts = async (year, month) => {
  try {
    const params = { year };
    if (month) params.month = month;

    const response = await api.get("/api/admin/dashboard/total_product", { params });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching total products:", error);
    throw error;
  }
};

/**
 * Lấy phân bố trạng thái đơn hàng
 */
export const getOrderStatusDistribution = async () => {
  try {
    const response = await api.get("/api/admin/dashboard/order-status-distribution");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching order status distribution:", error);
    throw error;
  }
};

/**
 * Lấy danh sách sản phẩm bán chạy nhất
 * ⚠️ FIX: URL đã sửa từ "//apiadmin" -> "/api/admin"
 */
export const getTopProducts = async (limit = 5) => {
  try {
    const response = await api.get("/api/admin/dashboard/top-products", {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching top products:", error);
    throw error;
  }
};

/**
 * Lấy dữ liệu tăng trưởng khách hàng theo tháng
 */
export const getCustomerGrowth = async () => {
  try {
    const response = await api.get("/api/admin/dashboard/customer-growth");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching customer growth:", error);
    throw error;
  }
};

// ============= SUPERADMIN DASHBOARD APIs =============

/**
 * Lấy tổng doanh thu của từng chi nhánh
 */
export const getRevenuePerBranch = async () => {
  try {
    const response = await api.get("/api/superadmin/dashboard/revenue_per_branch");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching revenue per branch:", error);
    throw error;
  }
};

/**
 * Lấy thống kê trạng thái đơn hàng toàn hệ thống
 */
export const getOrderStats = async () => {
  try {
    const response = await api.get("/api/superadmin/dashboard/order_stats");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching order stats:", error);
    throw error;
  }
};

/**
 * Lấy dữ liệu doanh thu theo thời gian để vẽ biểu đồ
 */
export const getRevenueChart = async (period = "month") => {
  try {
    if (!["month", "week"].includes(period)) {
      throw new Error("Period phải là 'month' hoặc 'week'");
    }

    const response = await api.get("/api/superadmin/dashboard/revenue_chart", {
      params: { period },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching revenue chart:", error);
    throw error;
  }
};

// ============= HELPER FUNCTIONS =============

export const formatCurrency = (amount) => {
  if (!amount) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(amount);
};

export const formatNumber = (num) => {
  if (!num) return '0';
  return new Intl.NumberFormat('vi-VN').format(num);
};

export default {
  getTotalOrders,
  getTotalAmount,
  getTotalCustomers,
  getTotalProducts,
  getOrderStatusDistribution,
  getTopProducts,
  getCustomerGrowth,
  getRevenuePerBranch,
  getOrderStats,
  getRevenueChart,
  formatCurrency,
  formatNumber
};