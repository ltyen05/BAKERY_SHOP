// ===============================================
// FILE: src/api/branchApi.js
// ===============================================
import api from "./axiosConfig";

// Định nghĩa path gốc để code gọn hơn (tùy chọn)
// Lưu ý: Đây là đường dẫn tương đối, không có http://localhost...
const ROOT_PATH = "/api/superadmin";

export const branchApi = {
  // ================= GET ALL BRANCHES =================
  getAllBranches: async () => {
    try {
      // Đã sửa: dùng đường dẫn tương đối
      const response = await api.get(`${ROOT_PATH}/api/branches`);

      let branches = [];

      // Logic xử lý dữ liệu trả về (giữ nguyên như cũ)
      if (response.data) {
        if (response.data.success && response.data.data) {
          branches = response.data.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          branches = response.data.data;
        } else if (Array.isArray(response.data)) {
          branches = response.data;
        } else if (
          response.data.branches &&
          Array.isArray(response.data.branches)
        ) {
          branches = response.data.branches;
        }
      }

      // Fetch manager info for each branch
      const branchesWithManager = await Promise.all(
        branches.map(async (branch) => {
          try {
            if (branch.manager_id) {
              // Đã sửa: dùng đường dẫn tương đối
              const managerRes = await api.get(
                `${ROOT_PATH}/branch/${branch.branch_id}/manager`
              );

              if (managerRes.data?.success && managerRes.data?.data) {
                return {
                  ...branch,
                  manager_name: managerRes.data.data.manager_name,
                  manager_email: managerRes.data.data.email,
                  manager_role: managerRes.data.data.role,
                  manager_status: managerRes.data.data.status,
                };
              }
            }

            return branch;
          } catch (err) {
            // Silent fail for manager fetch - not critical
            return branch;
          }
        })
      );

      return {
        success: true,
        data: branchesWithManager,
        count: branchesWithManager.length,
      };
    } catch (error) {
      console.error(
        "[branchApi] Error:",
        error.response?.data || error.message
      );

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Không thể lấy danh sách chi nhánh",
        data: [],
      };
    }
  },

  // ================= GET BRANCH DETAIL =================
  getBranchDetail: async (branchId) => {
    try {
      // Đã sửa: dùng đường dẫn tương đối
      const response = await api.get(
        `${ROOT_PATH}/branch/${branchId}`
      );

      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      console.error(
        "[branchApi] getBranchDetail error:",
        error.response?.data || error.message
      );

      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể lấy thông tin chi nhánh",
        data: null,
      };
    }
  },

  // ================= GET BRANCH MANAGER =================
  getBranchManager: async (branchId) => {
    try {
      // Đã sửa: dùng đường dẫn tương đối
      const response = await api.get(
        `${ROOT_PATH}/branch/${branchId}/manager`
      );

      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      console.error(
        "[branchApi] getBranchManager error:",
        error.response?.data || error.message
      );

      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể lấy thông tin quản lý",
        data: null,
      };
    }
  },

  // ================= ADD BRANCH =================
  addBranch: async (branchData) => {
    try {
      // Chuẩn hóa dữ liệu
      const payload = {
        name: branchData.name,
        address: branchData.address,
        phone: branchData.phone,
        email: branchData.email || null,
        mapSrc: branchData.mapSrc || null,
        lat: branchData.lat ? parseFloat(branchData.lat) : null,
        lng: branchData.lng ? parseFloat(branchData.lng) : null,
      };

      // Chỉ thêm manager_id nếu có giá trị hợp lệ
      if (
        branchData.manager_id &&
        branchData.manager_id !== "" &&
        branchData.manager_id !== "0"
      ) {
        payload.manager_id = parseInt(branchData.manager_id);
      }

      // Đã sửa: dùng đường dẫn tương đối
      const response = await api.post(
        `${ROOT_PATH}/add_branch`,
        payload
      );

      return {
        success: response.data.success !== false,
        message: response.data.message || "Thêm chi nhánh thành công",
        id: response.data.id,
      };
    } catch (error) {
      console.error(
        "[branchApi] addBranch error:",
        error.response?.data || error.message
      );

      return {
        success: false,
        message: error.response?.data?.message || "Không thể thêm chi nhánh",
      };
    }
  },

  // ================= UPDATE BRANCH =================
  updateBranch: async (branchId, branchData) => {
    try {
      // Chuẩn hóa dữ liệu
      const payload = {
        name: branchData.name,
        address: branchData.address,
        phone: branchData.phone,
        email: branchData.email || null,
        mapSrc: branchData.mapSrc || null,
        lat: branchData.lat ? parseFloat(branchData.lat) : null,
        lng: branchData.lng ? parseFloat(branchData.lng) : null,
      };

      // Chỉ thêm manager_id nếu có giá trị hợp lệ
      if (
        branchData.manager_id &&
        branchData.manager_id !== "" &&
        branchData.manager_id !== "0"
      ) {
        payload.manager_id = parseInt(branchData.manager_id);
      }

      // Đã sửa: dùng đường dẫn tương đối
      const response = await api.put(
        `${ROOT_PATH}/update_branch/${branchId}`,
        payload
      );

      return {
        success: response.data.success !== false,
        message: response.data.message || "Cập nhật chi nhánh thành công",
      };
    } catch (error) {
      console.error(
        "[branchApi] updateBranch error:",
        error.response?.data || error.message
      );

      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể cập nhật chi nhánh",
      };
    }
  },

  // ================= DELETE BRANCH =================
  deleteBranch: async (branchId) => {
    try {
      // Đã sửa: dùng đường dẫn tương đối
      const response = await api.delete(
        `${ROOT_PATH}/delete_branch/${branchId}`
      );

      return {
        success: response.data.success !== false,
        message: response.data.message || "Xóa chi nhánh thành công",
      };
    } catch (error) {
      console.error(
        "[branchApi] deleteBranch error:",
        error.response?.data || error.message
      );

      return {
        success: false,
        message: error.response?.data?.message || "Không thể xóa chi nhánh",
      };
    }
  },
};

export default branchApi;