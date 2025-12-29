// src/api/branchApi.js
import axiosConfig from './axiosConfig';

const branchApi = {
  // Lấy tất cả chi nhánh
  getAllBranches: async () => {
    try {
      const response = await axiosConfig.get('/branches');
      return response.data;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  },

  // Lấy chi tiết 1 chi nhánh
  getBranchById: async (branchId) => {
    try {
      const response = await axiosConfig.get(`/branches/${branchId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branch:', error);
      throw error;
    }
  },

  // Thêm chi nhánh mới
  createBranch: async (branchData) => {
    try {
      const response = await axiosConfig.post('/branches', branchData);
      return response.data;
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  },

  // Cập nhật chi nhánh
  updateBranch: async (branchId, branchData) => {
    try {
      const response = await axiosConfig.put(`/branches/${branchId}`, branchData);
      return response.data;
    } catch (error) {
      console.error('Error updating branch:', error);
      throw error;
    }
  },

  // Xóa chi nhánh
  deleteBranch: async (branchId) => {
    try {
      const response = await axiosConfig.delete(`/branches/${branchId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting branch:', error);
      throw error;
    }
  }
};

export default branchApi;