// ===============================================
// src/api/shipperApi.js - FIXED (BỎ vehicle_type, rating)
// ===============================================
import api from './axiosConfig';

const BASE_PATH = '/admin/shipper_management';

const mapShipperFromBackend = (shipper) => {
  return {
    shipper_id: shipper.shipper_id,
    name: shipper.shipper_name,
    email: shipper.email,
    phone: shipper.phone,
    status: shipper.status,
    branch_id: shipper.branch_id,
    salary: shipper.salary || 8000000
  };
};

export const shipperApi = {
  /**
   * Lấy danh sách shipper theo branch
   * @param {number} branchId - ID chi nhánh cần lọc
   */
  getAllShippers: async (branchId) => {
    try {
      const url = branchId 
        ? `${BASE_PATH}/infomation?branch_id=${branchId}`
        : `${BASE_PATH}/infomation`;
      
      console.log(' Fetching shippers from:', url);
      
      const response = await api.get(url);
      
      console.log(' Backend response:', response.data);
      console.log(' Total:', response.data?.length || 0);
      
      const mappedData = Array.isArray(response.data) 
        ? response.data.map(mapShipperFromBackend)
        : [];
      
      return {
        success: true,
        data: mappedData
      };
    } catch (error) {
      console.error(' Error fetching shippers:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message,
        data: []
      };
    }
  },

  addShipper: async (shipperData) => {
    try {
      const payload = {
        shipper_id: null,
        shipper_name: shipperData.shipper_name,
        email: shipperData.email,
        phone: shipperData.phone,
        password: shipperData.password,
        status: shipperData.status || 'Đang hoạt động',
        branch_id: parseInt(shipperData.branch_id),
        salary: parseFloat(shipperData.salary) || 8000000
        
      };

      console.log(' Adding shipper:', payload);
      
      const response = await api.post(`${BASE_PATH}/add_shipper`, payload);
      
      return {
        success: true,
        message: response.data.message || 'Thêm shipper thành công',
        data: response.data
      };
    } catch (error) {
      console.error(' Error adding shipper:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message
      };
    }
  },

  updateShipper: async (shipperId, shipperData) => {
    try {
      const payload = {
        shipper_name: shipperData.shipper_name,
        email: shipperData.email,
        phone: shipperData.phone,
        status: shipperData.status,
        branch_id: parseInt(shipperData.branch_id),
        salary: parseFloat(shipperData.salary) || 8000000
        
      };
      
      if (shipperData.password && shipperData.password.trim()) {
        payload.password = shipperData.password;
      }

      console.log(' Updating shipper:', shipperId, payload);
      
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
      console.error(' Error updating shipper:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message
      };
    }
  },

  deleteShipper: async (shipperId) => {
    try {
      console.log(' Deleting shipper:', shipperId);
      
      const response = await api.delete(
        `${BASE_PATH}/delete_shipper/${shipperId}`
      );
      
      return {
        success: true,
        message: response.data.message || 'Xóa shipper thành công',
        data: response.data
      };
    } catch (error) {
      console.error(' Error deleting shipper:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message
      };
    }
  }
};

export default shipperApi;