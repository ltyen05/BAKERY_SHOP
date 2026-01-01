// ===============================================
// src/api/employeeApi.js - FULL COMPLETE FILE
// ===============================================
import api from './axiosConfig';

const BASE_PATH = '/admin/employee_management';

const mapEmployeeFromBackend = (employee) => {
  return {
    employee_id: employee.employee_id,
    name: employee.employee_name,
    role: employee.role_name,
    email: employee.email,
    salary: employee.salary,
    status: employee.status,
    branch_id: employee.branch_id,
  };
};

// ============= API FUNCTIONS =============
export const employeeApi = {
  // ============= GET ALL EMPLOYEES =============
  /**
   * Lấy danh sách nhân viên
   * @param {Object} options - Filter options
   * @param {number} options.branchId - Lọc theo chi nhánh
   * @param {string} options.status - Lọc theo trạng thái
   * @returns {Promise<{success: boolean, data: Array, message?: string}>}
   */
  getAllEmployees: async (options = {}) => {
    try {
      const params = {};

      // Add filters if provided
      if (options.branchId) {
        params.branch_id = options.branchId;
      }

      if (options.status) {
        params.status = options.status;
      }

      console.log('Fetching employees with params:', params);

      // Call API
      const response = await api.get(`${BASE_PATH}/employee`, { params });

      console.log('Backend raw response:', response.data);

      const mappedData = Array.isArray(response.data)
        ? response.data.map(mapEmployeeFromBackend)
        : [];

      console.log('Mapped data for frontend:', mappedData);

      return {
        success: true,
        data: mappedData,
      };
    } catch (error) {
      console.error('Error fetching employees:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      return {
        success: false,
        message:
          error.response?.data?.error ||
          error.message ||
          'Lỗi khi tải danh sách nhân viên',
        data: [],
      };
    }
  },

  // ============= ADD EMPLOYEE =============
  /**
   * Thêm nhân viên mới
   * @param {Object} employeeData - Dữ liệu nhân viên
   * @param {string} employeeData.name - Tên nhân viên
   * @param {string} employeeData.role - Vai trò
   * @param {string} employeeData.email - Email
   * @param {string} employeeData.password - Mật khẩu
   * @param {number} employeeData.salary - Lương
   * @param {string} employeeData.status - Trạng thái
   * @param {number} employeeData.branch_id - ID chi nhánh
   * @returns {Promise<{success: boolean, message: string, data?: Object}>}
   */
  addEmployee: async (employeeData) => {
    try {
      // Map frontend format to backend format
      const payload = {
        employee_id: null,
        employee_name: employeeData.name,
        role_name: employeeData.role,
        email: employeeData.email,
        password: employeeData.password,
        salary: parseFloat(employeeData.salary) || 9000000,
        status: employeeData.status || 'Đang làm việc',
        branch_id: parseInt(employeeData.branch_id),
      };

      console.log('Adding employee with payload:', payload);

      // Call API
      const response = await api.post(`${BASE_PATH}/add_employee`, payload);

      console.log('Employee added successfully:', response.data);

      return {
        success: true,
        message: response.data.message || 'Thêm nhân viên thành công',
        data: response.data,
      };
    } catch (error) {
      console.error('Error adding employee:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      return {
        success: false,
        message:
          error.response?.data?.error ||
          error.message ||
          'Lỗi khi thêm nhân viên',
      };
    }
  },

  // ============= UPDATE EMPLOYEE =============
  /**
   * Cập nhật thông tin nhân viên
   * @param {number} employeeId - ID nhân viên
   * @param {Object} employeeData - Dữ liệu cập nhật
   * @returns {Promise<{success: boolean, message: string, data?: Object}>}
   */
  updateEmployee: async (employeeId, employeeData) => {
    try {
      const payload = {
        employee_name: employeeData.name,
        role_name: employeeData.role,
        email: employeeData.email,
        salary: parseFloat(employeeData.salary),
        status: employeeData.status,
        branch_id: parseInt(employeeData.branch_id),
      };

      // Chỉ gửi password nếu user nhập mật khẩu mới
      if (employeeData.password && employeeData.password.trim()) {
        payload.password = employeeData.password;
      }

      console.log('Updating employee:', employeeId, payload);

      // Call API
      const response = await api.put(
        `${BASE_PATH}/update_employee/${employeeId}`,
        payload
      );

      console.log('Employee updated successfully:', response.data);

      return {
        success: true,
        message: response.data.message || 'Cập nhật nhân viên thành công',
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating employee:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      return {
        success: false,
        message:
          error.response?.data?.error ||
          error.message ||
          'Lỗi khi cập nhật nhân viên',
      };
    }
  },

  // ============= DELETE EMPLOYEE =============
  /**
   * Xóa nhân viên
   * @param {number} employeeId - ID nhân viên cần xóa
   * @returns {Promise<{success: boolean, message: string, data?: Object}>}
   */
  deleteEmployee: async (employeeId) => {
    try {
      console.log('Deleting employee:', employeeId);

      // Call API
      const response = await api.delete(
        `${BASE_PATH}/delete_employee/${employeeId}`
      );

      console.log('Employee deleted successfully:', response.data);

      return {
        success: true,
        message: response.data.message || 'Xóa nhân viên thành công',
        data: response.data,
      };
    } catch (error) {
      console.error('Error deleting employee:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      return {
        success: false,
        message:
          error.response?.data?.error ||
          error.message ||
          'Lỗi khi xóa nhân viên',
      };
    }
  },
};

// Export default
export default employeeApi;
