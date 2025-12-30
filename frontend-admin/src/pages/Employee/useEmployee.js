// ===============================================
//  src/pages/Employee/useEmployee.js 
// ===============================================
import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import { useAuth } from '../../context/AuthContext';
import { employeeApi } from '../../api/employeeApi';
import { ROLE_TABS } from './employeeConstants';

export const useEmployee = () => {
  // ============= AUTH CONTEXT =============
  const { user, isSuperAdmin, isBranchAdmin, getCurrentBranch } = useAuth();

  // ============= STATE =============
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // ============= LOAD DATA WITH AUTH FILTER =============
  useEffect(() => {
    loadEmployees();
  }, [user.viewing_branch, user.branch_id]); // ← Reload khi đổi chi nhánh

  const loadEmployees = async () => {
    try {
      setLoading(true);
      
      //  XÁC ĐỊNH BRANCH ID CẦN FILTER
      let options = {};
      
      // CASE 1: Branch Admin → chỉ xem nhân viên chi nhánh của mình
      if (isBranchAdmin) {
        options.branchId = user.branch_id;
      }
      
      // CASE 2: Super Admin đang xem 1 chi nhánh cụ thể
      else if (isSuperAdmin && user.viewing_branch) {
        const currentBranch = getCurrentBranch();
        const branchId = currentBranch.id.replace('CN', ''); // CN001 → 1
        options.branchId = branchId;
      }
      
      // CASE 3: Super Admin chưa chọn chi nhánh → xem tất cả
      // (không set branchId)
      
      console.log(' Loading employees with options:', options);
      
      const response = await employeeApi.getAllEmployees(options);
      
      if (response.success && response.data) {
        const transformedData = response.data.map(emp => ({
          key: emp.employee_id,
          id: emp.employee_id,
          employee_id: emp.employee_id,
          name: emp.employee_name,
          role: emp.role_name,
          email: emp.email,
          phone: emp.phone || '',
          salary: emp.salary,
          status: emp.status || 'Đang làm việc',
          branch_id: emp.branch_id
        }));
        
        setEmployees(transformedData);
        console.log(` Loaded ${transformedData.length} employees`);
      } else {
        message.error(response.message || 'Không thể tải danh sách nhân viên');
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      message.error('Lỗi khi tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  // ============= COMPUTED VALUES =============
  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter(e => e.status === 'Đang làm việc').length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const currentTab = ROLE_TABS.find(t => t.id === activeRole);
      const matchRole = !currentTab?.role || emp.role === currentTab.role;
      
      const matchStatus = statusFilter === 'all' || 
        (statusFilter === 'Đang làm việc' && emp.status === 'Đang làm việc') ||
        (statusFilter === 'Nghỉ việc' && emp.status !== 'Đang làm việc');
      
      const query = searchQuery.trim();
      const matchSearch = query === '' ||
        emp.name.toLowerCase().includes(query.toLowerCase()) ||
        emp.email.toLowerCase().includes(query.toLowerCase()) ||
        emp.employee_id.toString() === query ||
        emp.employee_id.toString().includes(query);
      
      return matchRole && matchStatus && matchSearch;
    });
  }, [employees, activeRole, statusFilter, searchQuery]);

  const roleCount = (roleId) => {
    const tab = ROLE_TABS.find(t => t.id === roleId);
    if (!tab?.role) return employees.length;
    return employees.filter(e => e.role === tab.role).length;
  };

  // ============= CRUD OPERATIONS =============
  const addEmployee = async (newEmp) => {
    try {
      setLoading(true);
      
      //  Tự động set branch_id nếu là Branch Admin
      if (isBranchAdmin && !newEmp.branch_id) {
        newEmp.branch_id = user.branch_id;
      }
      
      //  Nếu Super Admin đang xem chi nhánh, set branch_id đó
      if (isSuperAdmin && user.viewing_branch && !newEmp.branch_id) {
        const currentBranch = getCurrentBranch();
        newEmp.branch_id = currentBranch.id.replace('CN', '');
      }
      
      const response = await employeeApi.addEmployee(newEmp);
      
      if (response.success) {
        message.success('Thêm nhân viên thành công!');
        await loadEmployees();
        return { success: true };
      } else {
        message.error(response.message || 'Không thể thêm nhân viên');
        return { success: false };
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      message.error('Lỗi khi thêm nhân viên. Vui lòng thử lại.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id, updatedEmp) => {
    try {
      setLoading(true);
      console.log(' Updating employee with ID:', id);
      console.log(' Data:', updatedEmp);
      
      const response = await employeeApi.updateEmployee(id, updatedEmp);
      
      if (response.success) {
        message.success('Cập nhật nhân viên thành công!');
        await loadEmployees();
        return { success: true };
      } else {
        message.error(response.message || 'Không thể cập nhật nhân viên');
        return { success: false };
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      message.error('Lỗi khi cập nhật nhân viên. Vui lòng thử lại.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (employeeId, employeeName) => {
    try {
      const response = await employeeApi.deleteEmployee(employeeId);
      if (response.success) {
        message.success('Xóa nhân viên thành công!');
        await loadEmployees();
        return { success: true };
      } else {
        message.error(response.message || 'Không thể xóa nhân viên');
        return { success: false };
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      message.error('Lỗi khi xóa nhân viên. Vui lòng thử lại.');
      return { success: false };
    }
  };

  // ============= FILTER HANDLERS =============
  const handleRoleChange = (roleId) => {
    setActiveRole(roleId);
    setCurrentPage(1);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // ============= HEADER TITLE HELPER =============
  const getHeaderTitle = () => {
    if (isBranchAdmin) {
      return `Nhân viên ${user.branch_name}`;
    }
    
    if (isSuperAdmin && user.viewing_branch) {
      return `Nhân viên ${user.viewing_branch.name}`;
    }
    
    return 'Quản lý Nhân viên';
  };

  const getHeaderSubtitle = () => {
    if (isBranchAdmin) {
      return `Quản lý nhân viên chi nhánh ${user.branch_name}`;
    }
    
    if (isSuperAdmin && user.viewing_branch) {
      return `Đang xem chi nhánh: ${user.viewing_branch.name}`;
    }
    
    return 'Quản lý toàn bộ nhân viên của hệ thống';
  };

  // ============= RETURN =============
  return {
    // Data
    employees,
    filteredEmployees,
    stats,
    
    // State
    loading,
    activeRole,
    statusFilter,
    searchQuery,
    currentPage,
    
    // CRUD
    loadEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    
    // Helpers
    roleCount,
    getHeaderTitle,
    getHeaderSubtitle,
    
    // Handlers
    setCurrentPage,
    handleRoleChange,
    handleStatusChange,
    handleSearchChange,
    
    // Auth
    isSuperAdmin,
    isBranchAdmin,
    currentBranchId: user.viewing_branch?.id || user.branch_id
  };
};