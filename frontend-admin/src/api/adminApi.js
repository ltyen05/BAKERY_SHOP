// ===============================================
// FILE: src/api/adminApi.js
// ===============================================
import api from './axiosConfig';

export const adminApi = {
  // ================= GET ALL BRANCHES =================
  getAllBranches: async () => {
    try {
      const response = await api.get('/superadmin/api/branches');
      
      if (response.data && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data
        };
      }
      
      return {
        success: false,
        data: []
      };
    } catch (error) {
      console.error('[adminApi]  Get branches error:', error);
      return {
        success: false,
        data: []
      };
    }
  },

  // ================= GET ALL ADMINS =================
  getAllAdmins: async () => {
    try {
      console.log('[adminApi]  Fetching all admins from branches...');

      // Bước 1: Lấy danh sách tất cả branches từ API
      const branchesResult = await adminApi.getAllBranches();
      
      if (!branchesResult.success || branchesResult.data.length === 0) {
        console.log('[adminApi]  No branches found');
        return {
          success: true,
          data: [],
          count: 0
        };
      }

      const branches = branchesResult.data;
      console.log('[adminApi]  Found', branches.length, 'branches');

      // Bước 2: Lấy manager từng chi nhánh
      const adminPromises = branches.map(async (branch) => {
        try {
          const managerResponse = await api.get(`/superadmin/branch/${branch.branch_id}/manager`);
          
          if (managerResponse.data && managerResponse.data.data) {
            const manager = managerResponse.data.data;
            return {
              manager_id: manager.manager_id || manager.employee_id,
              manager_name: manager.manager_name || manager.employee_name,
              email: manager.email,
              phone: manager.phone,
              salary: manager.salary,
              status: manager.status || 'Active',
              role: manager.role || manager.role_name || 'Quản lý',
              branch_id: branch.branch_id,
              branch_name: manager.branch_name || branch.name
            };
          }
          return null;
        } catch (error) {
          if (error.response?.status === 404) {
            console.log(`[adminApi] ℹBranch ${branch.branch_id} (${branch.name}): No manager`);
            return null;
          }
          console.error(`[adminApi]  Branch ${branch.branch_id} error:`, error.message);
          return null;
        }
      });

      const admins = (await Promise.all(adminPromises)).filter(admin => admin !== null);

      console.log('[adminApi]  Total admins:', admins.length);

      return {
        success: true,
        data: admins,
        count: admins.length
      };
    } catch (error) {
      console.error('[adminApi]  Error:', error);

      return {
        success: false,
        message: error.message || 'Không thể lấy danh sách admin',
        data: []
      };
    }
  },

  // ================= UPDATE ADMIN =================
  updateAdmin: async (adminId, adminData) => {
    try {
      console.log('[adminApi]  Updating admin:', adminId, adminData);

      const payload = {
        employee_name: adminData.username || adminData.manager_name,
        email: adminData.email,
      };

      // Password chỉ gửi nếu có nhập
      if (adminData.password && adminData.password.trim() !== '') {
        payload.password = adminData.password;
      }

      // Optional: status
      if (adminData.status) {
        const statusMap = {
          'Đang làm việc': 'Active',
          'Đã nghỉ việc': 'Inactive'
        };
        payload.status = statusMap[adminData.status] || 'Active';
      }

      // Optional: branch_id
      if (adminData.branch_id !== undefined) {
        if (adminData.branch_id === '' || adminData.branch_id === null) {
          payload.branch_id = null;
        } else {
          payload.branch_id = parseInt(adminData.branch_id);
        }
      }

      console.log('[adminApi]  Payload:', payload);

      const response = await api.put(`/superadmin/update_admin/${adminId}`, payload);

      console.log('[adminApi]  Response:', response.data);

      return {
        success: response.data.success !== false,
        message: response.data.message || 'Cập nhật admin thành công'
      };
    } catch (error) {
      console.error('[adminApi]  Update Error:', error);

      return {
        success: false,
        message: error.response?.data?.error ||
                 error.response?.data?.message ||
                 'Không thể cập nhật admin'
      };
    }
  },

  // ================= DELETE ADMIN =================
  deleteAdmin: async (adminId) => {
    try {
      console.log('[adminApi]  Deleting admin:', adminId);

      const response = await api.delete(`/superadmin/delete_admin/${adminId}`);

      console.log('[adminApi]  Response:', response.data);

      return {
        success: response.data.success !== false,
        message: response.data.message || 'Xóa admin thành công'
      };
    } catch (error) {
      console.error('[adminApi]  Delete Error:', error);

      return {
        success: false,
        message: error.response?.data?.error ||
                 error.response?.data?.message ||
                 'Không thể xóa admin'
      };
    }
  }
};

export default adminApi;