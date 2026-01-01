// ===============================================
// FILE: src/context/AuthContext.jsx
// FIXED: Removed redundant loading UI, optimized logic
// ===============================================
import { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ========== KHỞI TẠO: ĐỌC TỪ LOCALSTORAGE ==========
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Đọc thông tin admin từ localStorage
   */
  const initializeAuth = () => {
    try {
      const adminInfoStr = localStorage.getItem('admin_info');

      if (!adminInfoStr) {
        console.log('[Auth] Chưa đăng nhập');
        setLoading(false);
        return;
      }

      const adminInfo = JSON.parse(adminInfoStr);
      console.log('[Auth] Loaded user:', adminInfo);

      setUser(adminInfo);
    } catch (error) {
      console.error('[Auth] Error:', error);
      localStorage.removeItem('admin_info');
      localStorage.removeItem('access_token');
      localStorage.removeItem('employee_id');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Đăng xuất
   */
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('employee_id');
    localStorage.removeItem('admin_info');
    setUser(null);
    message.info('Đã đăng xuất');
    window.location.href = '/';
  };

  /**
   * Super Admin xem chi nhánh cụ thể
   */
  const viewBranch = (branch) => {
    if (!isSuperAdmin) {
      message.warning('Chỉ Super Admin mới có thể xem chi nhánh');
      return;
    }

    const updatedUser = {
      ...user,
      viewing_branch: branch
    };

    setUser(updatedUser);
    localStorage.setItem('admin_info', JSON.stringify(updatedUser));
    message.info(`Đang xem chi nhánh: ${branch.name}`);
  };

  /**
   * Super Admin quay về xem tổng quan
   */
  const viewAllBranches = () => {
    if (!isSuperAdmin) return;

    const updatedUser = {
      ...user,
      viewing_branch: null
    };

    setUser(updatedUser);
    localStorage.setItem('admin_info', JSON.stringify(updatedUser));
    message.info('Đã quay về chế độ xem tổng quan');
  };

  // ========== HELPER FUNCTIONS ==========

  const isSuperAdmin = user?.role === 'super_admin';
  const isBranchAdmin = user?.role === 'admin';
  const isViewingBranch = isSuperAdmin && user?.viewing_branch !== null;

  const getCurrentBranch = () => {
    if (isBranchAdmin) {
      return {
        id: user.branch_id,
        name: user.branch_name
      };
    }

    if (isViewingBranch) {
      return user.viewing_branch;
    }

    return null;
  };

  // ========== PERMISSION CHECKS ==========

  const canManageProducts = () => isSuperAdmin;
  const canManageVouchers = () => isSuperAdmin;
  const canViewProducts = () => isSuperAdmin || isBranchAdmin;
  const canViewVouchers = () => isSuperAdmin || isBranchAdmin;
  const canManageBranches = () => isSuperAdmin;

  // ========== CONTEXT VALUE ==========

  const value = {
    user,
    setUser,
    loading,
    logout,
    isSuperAdmin,
    isBranchAdmin,
    isViewingBranch,
    viewBranch,
    viewAllBranches,
    getCurrentBranch,
    canManageProducts,
    canManageVouchers,
    canViewProducts,
    canViewVouchers,
    canManageBranches
  };

  // ✅ FIXED: Removed redundant loading UI - handled in App.jsx
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};