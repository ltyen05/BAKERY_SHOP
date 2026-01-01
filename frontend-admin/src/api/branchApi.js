import api from './axiosConfig';

const BASE_PATH = '/superadmin/api';

export const branchApi = {
  getAllBranches: async () => {
    try {
      console.log('[branchApi] Fetching all branches...');

      const response = await api.get(`${BASE_PATH}/branches`);

      console.log('[branchApi] 📡 Raw response:', response.data);

      let branches = [];

      if (response.data) {
        if (response.data.success && response.data.data) {
          branches = response.data.data;
        }
        else if (response.data.data && Array.isArray(response.data.data)) {
          branches = response.data.data;
        }
        else if (Array.isArray(response.data)) {
          branches = response.data;
        }
        else if (response.data.branches && Array.isArray(response.data.branches)) {
          branches = response.data.branches;
        }
      }

      console.log('[branchApi] Branches loaded:', branches.length);

      console.log('[branchApi] 📋 Fetching manager info for each branch...');
      
      const branchesWithManager = await Promise.all(
        branches.map(async (branch) => {
          try {
            if (branch.manager_id) {
              const managerRes = await api.get(`/superadmin/branch/${branch.branch_id}/manager`);
              
              if (managerRes.data && managerRes.data.success && managerRes.data.data) {
                return {
                  ...branch,
                  manager_name: managerRes.data.data.manager_name,
                  manager_email: managerRes.data.data.email,
                  manager_role: managerRes.data.data.role,
                  manager_status: managerRes.data.data.status
                };
              }
            }
            
            return branch;
            
          } catch (err) {
            console.warn(`[branchApi] ⚠️ Cannot fetch manager for branch ${branch.branch_id}`);
            return branch;
          }
        })
      );

      console.log('[branchApi] ✅ Branches with manager info:', branchesWithManager.length);
      if (branchesWithManager.length > 0) {
        console.log('[branchApi] 📄 Sample branch:', branchesWithManager[0]);
      }

      return {
        success: true,
        data: branchesWithManager,
        count: branchesWithManager.length
      };

    } catch (error) {
      console.error('[branchApi] ❌ Error:', error);
      console.error('[branchApi] Response:', error.response?.data);

      return {
        success: false,
        message: error.response?.data?.message ||
          error.message ||
          'Không thể lấy danh sách chi nhánh',
        data: []
      };
    }
  },

  getBranchDetail: async (branchId) => {
    try {
      console.log('[branchApi] Fetching branch detail:', branchId);

      const response = await api.get(`/superadmin/branch/${branchId}`);

      console.log('[branchApi] Branch detail:', response.data);

      return {
        success: response.data.success,
        data: response.data.data
      };
    } catch (error) {
      console.error('[branchApi] Error:', error);

      return {
        success: false,
        message: error.response?.data?.message ||
          error.message ||
          'Không thể lấy thông tin chi nhánh',
        data: null
      };
    }
  },

  getBranchManager: async (branchId) => {
    try {
      console.log('[branchApi] Fetching branch manager:', branchId);

      const response = await api.get(`/superadmin/branch/${branchId}/manager`);

      console.log('[branchApi] Manager info:', response.data);

      return {
        success: response.data.success,
        data: response.data.data
      };
    } catch (error) {
      console.error('[branchApi] Error:', error);

      return {
        success: false,
        message: error.response?.data?.message ||
          error.message ||
          'Không thể lấy thông tin quản lý',
        data: null
      };
    }
  },

  addBranch: async (branchData) => {
    try {
      console.log('[branchApi] ➕ Adding branch:', branchData);

      // Chuẩn hóa dữ liệu trước khi gửi
      const payload = {
        name: branchData.name,
        address: branchData.address,
        phone: branchData.phone,
        email: branchData.email || null,
        mapSrc: branchData.mapSrc || null,
        lat: branchData.lat ? parseFloat(branchData.lat) : null,
        lng: branchData.lng ? parseFloat(branchData.lng) : null
      };

      // IMPORTANT: Chỉ thêm manager_id nếu có giá trị hợp lệ
      // Tránh gửi manager_id không tồn tại trong bảng employees
      if (branchData.manager_id && branchData.manager_id !== '' && branchData.manager_id !== '0') {
        payload.manager_id = parseInt(branchData.manager_id);
      }

      console.log('[branchApi] 📤 Payload:', payload);

      const response = await api.post('/superadmin/add_branch', payload);

      console.log('[branchApi] ✅ Response:', response.data);

      // Backend trả về {success: true, message: "...", id: 123}
      return {
        success: response.data.success !== false, // Mặc định true nếu không có lỗi
        message: response.data.message || 'Thêm chi nhánh thành công',
        id: response.data.id
      };
    } catch (error) {
      console.error('[branchApi] ❌ Add Error:', error);
      console.error('[branchApi] Response:', error.response?.data);

      return {
        success: false,
        message: error.response?.data?.message ||
          error.message ||
          'Không thể thêm chi nhánh'
      };
    }
  },

  updateBranch: async (branchId, branchData) => {
    try {
      console.log('[branchApi] ✏️ Updating branch:', branchId, branchData);

      // Chuẩn hóa dữ liệu trước khi gửi (giống add)
      const payload = {
        name: branchData.name,
        address: branchData.address,
        phone: branchData.phone,
        email: branchData.email || null,
        mapSrc: branchData.mapSrc || null,
        lat: branchData.lat ? parseFloat(branchData.lat) : null,
        lng: branchData.lng ? parseFloat(branchData.lng) : null
      };

      // IMPORTANT: Chỉ thêm manager_id nếu có giá trị hợp lệ
      if (branchData.manager_id && branchData.manager_id !== '' && branchData.manager_id !== '0') {
        payload.manager_id = parseInt(branchData.manager_id);
      }

      console.log('[branchApi] 📤 Payload:', payload);

      // FIX: Sửa endpoint đúng với backend
      const response = await api.put(`/superadmin/update_branch/${branchId}`, payload);

      console.log('[branchApi] ✅ Response:', response.data);

      // Backend trả về {success: true, message: "Cập nhật chi nhánh thành công"}
      return {
        success: response.data.success !== false, // Mặc định true nếu không có lỗi
        message: response.data.message || 'Cập nhật chi nhánh thành công'
      };
    } catch (error) {
      console.error('[branchApi] ❌ Update Error:', error);
      console.error('[branchApi] Response:', error.response?.data);

      return {
        success: false,
        message: error.response?.data?.message ||
          error.message ||
          'Không thể cập nhật chi nhánh'
      };
    }
  },

  deleteBranch: async (branchId) => {
    try {
      console.log('[branchApi] 🗑️ Deleting branch:', branchId);

      const response = await api.delete(`/superadmin/delete_branch/${branchId}`);

      console.log('[branchApi] ✅ Branch deleted:', response.data);

      return {
        success: response.data.success !== false,
        message: response.data.message || 'Xóa chi nhánh thành công'
      };
    } catch (error) {
      console.error('[branchApi] ❌ Delete Error:', error);
      console.error('[branchApi] Response:', error.response?.data);

      return {
        success: false,
        message: error.response?.data?.message ||
          error.message ||
          'Không thể xóa chi nhánh'
      };
    }
  }
};

export default branchApi;