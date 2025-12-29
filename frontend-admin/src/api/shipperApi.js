// ===============================================
// src/api/shipperApi.js 
// ===============================================
import api from './axiosConfig';

const BASE_PATH = '/admin/shipper_management';

export const shipperApi = {
  /**
   * Lấy danh sách shipper
   * @param {Object} options - Tùy chọn filter
   * @param {string} options.branchId - ID chi nhánh (nếu muốn filter)
   * @param {string} options.status - Trạng thái shipper
   */
  getAllShippers: async (options = {}) => {
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

      const response = await api.get(`${BASE_PATH}/infomation`, { params });
      
      // Backend trả về array trực tiếp
      let shippers = response.data;
      
      // CLIENT-SIDE FILTER theo branch_id  trường hợp backend chưa filter)
      if (options.branchId) {
        shippers = shippers.filter(shipper => 
          shipper.branch_id === parseInt(options.branchId)
        );
      }
      
      return {
        success: true,
        data: shippers
      };
    } catch (error) {
      console.error('Error fetching shippers:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message,
        data: []
      };
    }
  },

  /**
   * Thêm shipper mới
   * @param {Object} shipperData - Dữ liệu shipper
   */
  addShipper: async (shipperData) => {
    try {
      const response = await api.post(`${BASE_PATH}/add_shipper`, {
        shipper_id: null,
        shipper_name: shipperData.shipper_name,
        email: shipperData.email,
        phone: shipperData.phone,
        password: shipperData.password,
        vehicle_type: shipperData.vehicle_type || 'Xe máy',
        status: shipperData.status || 'Đang hoạt động',
        branch_id: parseInt(shipperData.branch_id),
        salary: parseFloat(shipperData.salary) || 8000000
      });
      
      return {
        success: true,
        message: response.data.message || 'Thêm shipper thành công',
        data: response.data
      };
    } catch (error) {
      console.error('Error adding shipper:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message
      };
    }
  },

  /**
   * Cập nhật thông tin shipper
   * @param {number} shipperId - ID của shipper
   * @param {Object} shipperData - Dữ liệu cập nhật
   */
  updateShipper: async (shipperId, shipperData) => {
    try {
      const payload = {
        shipper_name: shipperData.shipper_name,
        email: shipperData.email,
        phone: shipperData.phone,
        vehicle_type: shipperData.vehicle_type,
        status: shipperData.status,
        branch_id: parseInt(shipperData.branch_id),
        salary: parseFloat(shipperData.salary)
      };
      
      // Chỉ thêm password nếu có
      if (shipperData.password && shipperData.password.trim()) {
        payload.password = shipperData.password;
      }
      
      const response = await api.put(
        `${BASE_PATH}/update_shipper/${shipperId}`, 
        payload
      );
      
      return {
        success: true,
        message: response.data.message || 'Cập nhật shipper thành công',
        data: response.data
      };
    } catch (error) {
      console.error('Error updating shipper:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message
      };
    }
  },

  /**
   * Xóa shipper
   * @param {number} shipperId - ID của shipper cần xóa
   */
  deleteShipper: async (shipperId) => {
    try {
      const response = await api.delete(
        `${BASE_PATH}/delete_shipper/${shipperId}`
      );
      
      return {
        success: true,
        message: response.data.message || 'Xóa shipper thành công',
        data: response.data
      };
    } catch (error) {
      console.error('Error deleting shipper:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message
      };
    }
  },

  /**
   * Lọc shipper theo trạng thái
   * @param {string} status - Trạng thái cần lọc
   * @param {number} branchId - ID chi nhánh (optional)
   */
  filterByStatus: async (status, branchId = null) => {
    try {
      const params = { status };
      
      if (branchId) {
        params.branch_id = branchId;
      }
      
      const response = await api.get(`${BASE_PATH}/infomation`, { params });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error filtering shippers by status:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message,
        data: []
      };
    }
  }
};

export default shipperApi;