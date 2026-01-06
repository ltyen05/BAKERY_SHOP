
// ===============================================
// FILE: src/api/customerApi.js
// ===============================================
import api from "./axiosConfig";

const BASE_PATH = "http://localhost:5001/api/admin/customer_management";

export const customerApi = {
  getAllCustomers: async (branchId = null) => {
    try {
      const params = {};
      if (branchId) {
        params.branch_id = branchId;
      }

      const response = await api.get(`${BASE_PATH}/customer`, { params });

      if (!Array.isArray(response.data)) {
        return [];
      }

      const mappedCustomers = response.data.map((c) => ({
        id: c.id || c.customer_id,
        customer_id: c.id || c.customer_id,
        name: c.name || "N/A",
        email: c.email || "N/A",
        phone: c.phone || "N/A",
        total_amount: parseFloat(c.total_amount) || 0,
        rank: c.rank || "Đồng",
        customerId: c.customer_id || c.id,
        key: c.id || c.customer_id,
      }));

      return mappedCustomers;
    } catch (error) {
      throw new Error(
        error.response?.data?.error ||
          error.message ||
          "Không thể tải danh sách khách hàng"
      );
    }
  },

  deleteCustomer: async (customerId) => {
    try {
      const response = await api.delete(
        `${BASE_PATH}/delete_customer/${customerId}`
      );

      return {
        success: true,
        message: response.data.message || "Đã xóa khách hàng thành công",
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || error.message,
      };
    }
  },

  searchCustomers: async (keyword, branchId = null) => {
    try {
      const params = {};
      if (branchId) {
        params.branch_id = branchId;
      }

      const response = await api.get(`${BASE_PATH}/customer`, { params });

      if (!Array.isArray(response.data)) {
        return [];
      }

      const searchTerm = keyword.toLowerCase();
      const filtered = response.data.filter(
        (customer) =>
          customer.name?.toLowerCase().includes(searchTerm) ||
          customer.email?.toLowerCase().includes(searchTerm) ||
          customer.phone?.includes(searchTerm)
      );

      return filtered.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        total_amount: parseFloat(c.total_amount) || 0,
        rank: c.rank || "Đồng",
        customerId: `KH${String(c.id).padStart(3, "0")}`,
        key: c.id,
      }));
    } catch (error) {
      throw new Error(error.response?.data?.error || "Không thể tìm kiếm");
    }
  },
};

export default customerApi;