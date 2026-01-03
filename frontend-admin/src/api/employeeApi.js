// ===============================================
// src/api/employeeApi.js - THÊM PASSWORD
// ===============================================
import api from "./axiosConfig";

const BASE_PATH = "http://localhost:5001/api/admin/employee_management";

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
  getAllEmployees: async (options = {}) => {
    try {
      const params = {};

      if (options.branchId) {
        params.branch_id = options.branchId;
      }

      if (options.status) {
        params.status = options.status;
      }

      console.log(" Fetching employees with params:", params);

      const response = await api.get(`${BASE_PATH}/employee`, { params });

      console.log(" Backend raw response:", response.data);

      const mappedData = Array.isArray(response.data)
        ? response.data.map(mapEmployeeFromBackend)
        : [];

      console.log(" Mapped data for frontend:", mappedData);

      return {
        success: true,
        data: mappedData,
      };
    } catch (error) {
      console.error(" Error fetching employees:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      return {
        success: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Lỗi khi tải danh sách nhân viên",
        data: [],
      };
    }
  },

  // ============= ADD EMPLOYEE =============
  addEmployee: async (employeeData) => {
    try {
      console.group(" ADD EMPLOYEE API CALL");
      console.log("1. employeeData nhận được:", employeeData);

      let branchId;

      if (!employeeData.branch_id || employeeData.branch_id === "") {
        throw new Error("Branch ID bị thiếu trong employeeData");
      }

      branchId = parseInt(String(employeeData.branch_id).trim());

      if (isNaN(branchId) || branchId <= 0) {
        throw new Error(
          `Branch ID không hợp lệ: "${employeeData.branch_id}". Vui lòng nhập số từ 1-5`
        );
      }

      console.log("branchId sau khi parse:", branchId, typeof branchId);

      if (!employeeData.password || employeeData.password.trim() === "") {
        throw new Error("Mật khẩu không được để trống");
      }

      // Map frontend format to backend format
      const payload = {
        employee_id: null,
        employee_name: employeeData.name || "",
        role_name: employeeData.role || "",
        email: employeeData.email || "",
        password: employeeData.password, //  THÊM PASSWORD
        salary: parseFloat(employeeData.salary) || 9000000,
        status: employeeData.status || "Đang làm việc",
        branch_id: branchId,
      };

      //  DOUBLE CHECK tất cả field
      if (!payload.employee_name || payload.employee_name.trim() === "") {
        throw new Error("Tên nhân viên không được để trống");
      }
      if (!payload.email || payload.email.trim() === "") {
        throw new Error("Email không được để trống");
      }
      if (!payload.role_name || payload.role_name === "") {
        throw new Error("Vai trò không được để trống");
      }
      if (!payload.password || payload.password.trim() === "") {
        throw new Error("Mật khẩu không được để trống");
      }
      if (!payload.branch_id || isNaN(payload.branch_id)) {
        throw new Error("Branch ID không hợp lệ");
      }

      console.log("5.  Gọi API POST...");
      console.log("6.  Final payload:", JSON.stringify(payload, null, 2));

      // Call API
      const response = await api.post(`${BASE_PATH}/add_employee`, payload);

      console.log("6.  API Response:", response.data);
      console.groupEnd();

      return {
        success: true,
        message: response.data.message || "Thêm nhân viên thành công",
        data: response.data,
      };
    } catch (error) {
      console.error(" Error adding employee:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      console.groupEnd();

      return {
        success: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Lỗi khi thêm nhân viên",
      };
    }
  },

  // ============= UPDATE EMPLOYEE =============
  updateEmployee: async (employeeId, employeeData) => {
    try {
      console.group(" UPDATE EMPLOYEE API CALL");
      console.log("1. employeeId:", employeeId);
      console.log("2. employeeData:", employeeData);

      if (!employeeData.branch_id) {
        throw new Error("Branch ID bị thiếu trong employeeData");
      }

      const branchId = parseInt(employeeData.branch_id);

      if (isNaN(branchId)) {
        throw new Error(`Branch ID không hợp lệ: ${employeeData.branch_id}`);
      }

      const payload = {
        employee_name: employeeData.name,
        role_name: employeeData.role,
        email: employeeData.email,
        salary: parseFloat(employeeData.salary),
        status: employeeData.status,
        branch_id: branchId,
      };

      console.log("3.  Payload chuẩn bị gửi:", payload);

      // Call API
      const response = await api.put(
        `${BASE_PATH}/update_employee/${employeeId}`,
        payload
      );

      console.log("4.  API Response:", response.data);
      console.groupEnd();

      return {
        success: true,
        message: response.data.message || "Cập nhật nhân viên thành công",
        data: response.data,
      };
    } catch (error) {
      console.error(" Error updating employee:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      console.groupEnd();

      return {
        success: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Lỗi khi cập nhật nhân viên",
      };
    }
  },

  // ============= DELETE EMPLOYEE =============
  deleteEmployee: async (employeeId) => {
    try {
      console.log(" Deleting employee:", employeeId);

      // Call API
      const response = await api.delete(
        `${BASE_PATH}/delete_employee/${employeeId}`
      );

      console.log(" Employee deleted successfully:", response.data);

      return {
        success: true,
        message: response.data.message || "Xóa nhân viên thành công",
        data: response.data,
      };
    } catch (error) {
      console.error(" Error deleting employee:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      return {
        success: false,
        message:
          error.response?.data?.error ||
          error.message ||
          "Lỗi khi xóa nhân viên",
      };
    }
  },
};

// Export default
export default employeeApi;
