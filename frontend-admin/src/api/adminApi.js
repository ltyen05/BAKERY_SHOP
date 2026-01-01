// ===============================================
// FILE: src/api/adminApi.js
// FIXED: Update API không cần branch_id
// ===============================================
import api from './axiosConfig';

const BASE_PATH = '/superadmin/branch';

export const adminApi = {
  getManagerByBranch: async (branchId) => {
    try {
      console.log('[adminApi] Fetching manager for branch:', branchId);

      const response = await api.get(`${BASE_PATH}/${branchId}/manager`);

      if (response.data.success && response.data.data) {
        const data = response.data.data;
        
        return {
          success: true,
          data: {
            manager_id: data.manager_id,
            manager_name: data.manager_name,
            email: data.email,
            role: data.role,
            status: data.status,
            salary: data.salary,
            branch_id: branchId,
            branch_name: data.branch_name
          }
        };
      }

      return {
        success: false,
        message: 'Không tìm thấy manager',
        data: null
      };
    } catch (error) {
      console.error('[adminApi] Error:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Không thể lấy thông tin manager',
        data: null
      };
    }
  },

  getAllAdmins: async (branchIds) => {
    try {
      console.log('[adminApi] Fetching admins for branches:', branchIds);

      const promises = branchIds.map(id => adminApi.getManagerByBranch(id));
      const results = await Promise.allSettled(promises);

      const admins = results
        .filter(result => result.status === 'fulfilled' && result.value.success)
        .map(result => result.value.data)
        .filter(admin => admin !== null);

      console.log('[adminApi] All admins loaded:', admins.length);

      return {
        success: true,
        data: admins,
        count: admins.length
      };
    } catch (error) {
      console.error('[adminApi] Error:', error);
      return {
        success: false,
        message: 'Không thể lấy danh sách admin',
        data: [],
        count: 0
      };
    }
  },

  // ✅ FIXED: Update admin - Lấy branch_id từ admin hiện tại
  updateAdmin: async (adminId, adminData, currentBranchId) => {
    try {
      console.log('[adminApi] 📤 Updating admin:', {
        adminId,
        adminData,
        currentBranchId
      });

      // ✅ Validate branch_id
      if (!currentBranchId) {
        console.error('[adminApi] ❌ Missing branch_id');
        return {
          success: false,
          message: 'Thiếu thông tin chi nhánh'
        };
      }

      // ✅ Chỉ gửi các field được phép sửa
      const payload = {
        email: adminData.email,
        salary: adminData.salary ? parseFloat(adminData.salary) : null,
        status: adminData.status
      };

      console.log('[adminApi] 📤 Payload:', payload);

      const response = await api.put(
        `${BASE_PATH}/${currentBranchId}/manager/${adminId}`,
        payload
      );

      console.log('[adminApi] ✅ Response:', response.data);

      if (response.data.success) {
        return {
          success: true,
          message: 'Cập nhật admin thành công',
          data: response.data.data
        };
      }

      return {
        success: false,
        message: response.data.error || 'Không thể cập nhật admin'
      };
    } catch (error) {
      console.error('[adminApi] ❌ Update error:', error);
      console.error('[adminApi] ❌ Response:', error.response?.data);
      
      return {
        success: false,
        message: error.response?.data?.error || 
                 error.response?.data?.message ||
                 'Đã xảy ra lỗi khi cập nhật admin'
      };
    }
  },

  // ✅ FIXED: Delete admin - Không cần branch_id
  deleteAdmin: async (adminId) => {
    try {
      console.log('[adminApi] 📤 Deleting admin:', adminId);

      // ✅ Endpoint đơn giản hơn
      const response = await api.delete(`/superadmin/manager/${adminId}`);

      console.log('[adminApi] ✅ Response:', response.data);

      if (response.data.success) {
        return {
          success: true,
          message: 'Xóa admin thành công'
        };
      }

      return {
        success: false,
        message: response.data.error || 'Không thể xóa admin'
      };
    } catch (error) {
      console.error('[adminApi] ❌ Delete error:', error);
      console.error('[adminApi] ❌ Response:', error.response?.data);
      
      return {
        success: false,
        message: error.response?.data?.error || 
                 error.response?.data?.message ||
                 'Đã xảy ra lỗi khi xóa admin'
      };
    }
  }
};

export default adminApi;