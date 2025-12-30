// ===============================================
// src/api/employeeApi.js - PHIÊN BẢN ĐÃ FIX
// ===============================================
import api from './axiosConfig';

const BASE_PATH = '/admin/employee_management';

export const employeeApi = {
  /**
   * Lấy danh sách nhân viên
   * @param {Object} options - Tùy chọn filter
   * @param {string} options.branchId - ID chi nhánh (nếu muốn filter)
   * @param {string} options.status - Trạng thái nhân viên
   */
  getAllEmployees: async (options = {}) => {
    try {
      const params = {};
      
      // Nếu có branchId thì thêm vào params
      if (options.branchId) {
        params.branch_id = options.branchId;
      }
      
      // Nếu có status filter
      if (options.status) {
        params.status = options.status;
      }

      const response = await api.get(`${BASE_PATH}/employee`, { params });
      
      // Backend trả về array trực tiếp
      let employees = response.data;
      
      // ✅ CLIENT-SIDE FILTER theo branch_id (phòng trường hợp backend chưa filter)
      if (options.branchId) {
        employees = employees.filter(emp => 
          emp.branch_id === parseInt(options.branchId)
        );
      }
      
      return {
        success: true,
        data: employees
      };
    } catch (error) {
      console.error('Error fetching employees:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message,
        data: []
      };
    }
  },

  // Lấy chi tiết nhân viên theo ID
  getEmployeeDetail: async (employeeId) => {
    try {
      const response = await api.get(`${BASE_PATH}/employee/${employeeId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching employee detail:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message
      };
    }
  },

  // Thêm nhân viên mới
  addEmployee: async (employeeData) => {
    try {
      const response = await api.post(`${BASE_PATH}/employee`, {
        employee_id: null,
        employee_name: employeeData.name,
        role_name: employeeData.role,
        email: employeeData.email,
        password: employeeData.password,
        salary: parseFloat(employeeData.salary) || 9000000,
        status: employeeData.status || 'Đang làm việc',
        branch_id: parseInt(employeeData.branch_id)
      });
      
      return {
        success: true,
        message: response.data.message,
        data: response.data
      };
    } catch (error) {
      console.error('Error adding employee:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message
      };
    }
  },

  // Cập nhật thông tin nhân viên
  updateEmployee: async (employeeId, employeeData) => {
    try {
      const payload = {
        employee_name: employeeData.name,
        role_name: employeeData.role,
        email: employeeData.email,
        salary: parseFloat(employeeData.salary),
        status: employeeData.status,
        branch_id: parseInt(employeeData.branch_id)
      };
      
      if (employeeData.password && employeeData.password.trim()) {
        payload.password = employeeData.password;
      }
      
      const response = await api.put(`${BASE_PATH}/employee/${employeeId}`, payload);
      
      return {
        success: true,
        message: response.data.message,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating employee:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message
      };
    }
  },

  // Xóa nhân viên
  deleteEmployee: async (employeeId) => {
    try {
      const response = await api.delete(`${BASE_PATH}/employee/${employeeId}`);
      
      return {
        success: true,
        message: response.data.message,
        data: response.data
      };
    } catch (error) {
      console.error('Error deleting employee:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message
      };
    }
  },

  // Lọc nhân viên theo trạng thái
  filterByStatus: async (status, branchId = null) => {
    try {
      const params = { status };
      
      if (branchId) {
        params.branch_id = branchId;
      }
      
      const response = await api.get(`${BASE_PATH}/employee`, { params });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error filtering employees by status:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message,
        data: []
      };
    }
  }
};

export default employeeApi;