import api from './axiosConfig';

const BASE_PATH = '/admin/customer_management';

export const customerApi = {
  // Lấy danh sách tất cả khách hàng
  getAllCustomers: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/customer`);
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

 

  // Thêm khách hàng mới
  addCustomer: async (customerData) => {
    try {
      const response = await api.post(`${BASE_PATH}/customer`, {
        name: customerData.name,
        email: customerData.email.toLowerCase(),
        phone: customerData.phone,
        password: customerData.password
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

  // Cập nhật thông tin khách hàng
  updateCustomer: async (customerId, customerData) => {
    try {
      const payload = {
        name: customerData.name,
        email: customerData.email.toLowerCase(),
        phone: customerData.phone
      };
      
      // Chỉ gửi password nếu có thay đổi
      if (customerData.password && customerData.password.trim()) {
        payload.password = customerData.password;
      }
      
      const response = await api.put(`${BASE_PATH}/customer/${customerId}`, payload);
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

  // Xóa khách hàng
  deleteCustomer: async (customerId) => {
    try {
      const response = await api.delete(`${BASE_PATH}/customer/${customerId}`);
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

  // Lọc khách hàng theo hạng thành viên
  getCustomersByRank: async (rank) => {
    try {
      const response = await api.get(`${BASE_PATH}/customer`, {
        params: { rank }
      });
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

  // Tìm kiếm khách hàng
  searchCustomers: async (keyword) => {
    try {
      const response = await api.get(`${BASE_PATH}/customer`);
      
      if (!response.data || !Array.isArray(response.data)) {
        return {
          success: false,
          message: 'Invalid data format',
          data: []
        };
      }

      const filtered = response.data.filter(customer => {
        const searchTerm = keyword.toLowerCase();
        return (
          customer.name?.toLowerCase().includes(searchTerm) ||
          customer.email?.toLowerCase().includes(searchTerm) ||
          customer.phone?.includes(searchTerm)
        );
      });

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
  }
};

export default customerApi;