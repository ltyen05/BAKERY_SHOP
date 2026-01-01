import api from './axiosConfig';

const BASE_PATH = '/admin/customer_management';

export const customerApi = {
  // LẤY DANH SÁCH KHÁCH HÀNG (có thể lọc theo branch_id)
  getAllCustomers: async (branchId = null) => {
    try {
      const params = {};
      if (branchId) {
        params.branch_id = branchId;
      }

      const response = await api.get(`${BASE_PATH}/customer`, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching customers:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message,
        data: []
      };
    }
  },

  // LẤY KHÁCH HÀNG THEO CHI NHÁNH
  getCustomersByBranch: async (branchId) => {
    try {
      const response = await api.get(`${BASE_PATH}/customer`, {
        params: { branch_id: branchId }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching customers by branch:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message,
        data: []
      };
    }
  },

  // THÊM KHÁCH HÀNG MỚI
  addCustomer: async (customerData) => {
    try {
      const response = await api.post(`${BASE_PATH}/customer`, {
        name: customerData.name,
        email: customerData.email.toLowerCase(),
        phone: customerData.phone,
        password: customerData.password,
        branch_id: customerData.branch_id
      });

      return {
        success: true,
        message: response.data.message || 'Thêm khách hàng thành công',
        data: response.data
      };
    } catch (error) {
      console.error('Error adding customer:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message
      };
    }
  },

  // CẬP NHẬT THÔNG TIN KHÁCH HÀNG
  updateCustomer: async (customerId, customerData) => {
    try {
      const payload = {
        name: customerData.name,
        email: customerData.email.toLowerCase(),
        phone: customerData.phone
      };

      if (customerData.branch_id) {
        payload.branch_id = customerData.branch_id;
      }

      if (customerData.password && customerData.password.trim()) {
        payload.password = customerData.password;
      }

      const response = await api.put(
        `${BASE_PATH}/customer/${customerId}`,
        payload
      );

      return {
        success: true,
        message: response.data.message || 'Cập nhật khách hàng thành công',
        data: response.data
      };
    } catch (error) {
      console.error('Error updating customer:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message
      };
    }
  },

  // XÓA KHÁCH HÀNG
  deleteCustomer: async (customerId) => {
    try {
      const response = await api.delete(
        `${BASE_PATH}/customer/${customerId}`
      );
      return {
        success: true,
        message: response.data.message || 'Đã xóa khách hàng thành công',
        data: response.data
      };
    } catch (error) {
      console.error('Error deleting customer:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message
      };
    }
  },

  // LỌC KHÁCH HÀNG THEO HẠNG
  getCustomersByRank: async (rank, branchId = null) => {
    try {
      const params = { rank };
      if (branchId) {
        params.branch_id = branchId;
      }

      const response = await api.get(`${BASE_PATH}/customer`, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error filtering customers by rank:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message,
        data: []
      };
    }
  },

  // TÌM KIẾM KHÁCH HÀNG
  searchCustomers: async (keyword, branchId = null) => {
    try {
      const params = {};
      if (branchId) {
        params.branch_id = branchId;
      }

      const response = await api.get(`${BASE_PATH}/customer`, { params });

      if (!Array.isArray(response.data)) {
        return {
          success: false,
          message: 'Invalid data format',
          data: []
        };
      }

      const searchTerm = keyword.toLowerCase();
      const filtered = response.data.filter(customer =>
        customer.name?.toLowerCase().includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm) ||
        customer.phone?.includes(searchTerm)
      );

      return {
        success: true,
        data: filtered
      };
    } catch (error) {
      console.error('Error searching customers:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message,
        data: []
      };
    }
  },

  // LẤY DANH SÁCH CHI NHÁNH
  getBranches: async () => {
    try {
      const response = await api.get(
        '/admin/branch_management/branches'
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching branches:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message,
        data: []
      };
    }
  }
};

export default customerApi;
