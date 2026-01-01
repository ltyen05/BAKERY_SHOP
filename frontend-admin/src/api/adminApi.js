// ===============================================
// FILE: src/api/adminApi.js
// API để lấy thông tin admin đang đăng nhập
// ===============================================
import api from './axiosConfig';

const BASE_PATH = '/admin';

export const adminApi = {
  /**
   * Lấy thông tin admin hiện tại
   * GET /admin/me?e_id=xxx
   * 
   * Backend response:
   * {
   *   "id": 1,
   *   "name": "Nguyễn Bảo Thạch",
   *   "role_name": "Quản lý" | "Super Admin",
   *   "email": "admin@example.com",
   *   "salary": 15000000,
   *   "status": "Active",
   *   "branch_id": 1 | null
   * }
   */
  getAdminInfo: async (employeeId) => {
    try {
      console.log('🔍 [adminApi] Fetching admin info for:', employeeId);

      const response = await api.get(`${BASE_PATH}/me`, {
        params: { e_id: employeeId }
      });

      console.log('✅ [adminApi] Admin info:', response.data);

      // Transform data để phù hợp với AuthContext
      const adminData = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        
        // Chuyển đổi role_name thành role
        role: response.data.role_name === 'Super Admin' ? 'super_admin' : 'admin',
        role_name: response.data.role_name,
        
        salary: response.data.salary,
        status: response.data.status,
        branch_id: response.data.branch_id,
        branch_name: null, // Sẽ fetch sau nếu cần
        viewing_branch: null // Mặc định không xem chi nhánh nào
      };

      return {
        success: true,
        data: adminData
      };
    } catch (error) {
      console.error('❌ [adminApi] Error:', error);

      return {
        success: false,
        message: error.response?.data?.error || 
                 error.message || 
                 'Không thể lấy thông tin admin',
        data: null
      };
    }
  }
};

export default adminApi;