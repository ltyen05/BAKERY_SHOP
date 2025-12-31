// ===============================================
// Location: src/context/AuthContext.jsx - FIXED
// ===============================================
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// ✅ Mock users - ĐÃ FIX branch_id thành số
const mockUsers = {
  superAdmin: {
    id: 'SA001',
    name: 'Helen Walter',
    email: 'helen@husbakery.vn',
    role: 'super_admin',
    branch_id: null,
    branch_name: null,
    viewing_branch: null
  },
  branchAdmin: {
    id: 'BA001',
    name: 'Nguyễn Bảo Thạch',
    email: 'thach@husbakery.vn',
    role: 'admin',
    branch_id: 1, // ✅ ĐÃ SỬA: Số thực, không phải 'CN001'
    branch_name: 'HUS Bakery - Hoàn Kiếm',
    viewing_branch: null
  }
};

export const AuthProvider = ({ children }) => {
  // Mặc định là Super Admin (hoặc đổi thành branchAdmin để test)
  const [user, setUser] = useState(mockUsers.superAdmin);

  // Hàm để super admin xem chi nhánh cụ thể
  const viewBranch = (branch) => {
    setUser(prev => ({
      ...prev,
      viewing_branch: branch
    }));
  };

  // Hàm để về lại chế độ xem tổng quan
  const viewAllBranches = () => {
    setUser(prev => ({
      ...prev,
      viewing_branch: null
    }));
  };

  // Helper functions
  const isSuperAdmin = user?.role === 'super_admin';
  const isBranchAdmin = user?.role === 'admin';
  
  // Super admin đang xem 1 chi nhánh cụ thể
  const isViewingBranch = isSuperAdmin && user?.viewing_branch !== null;
  
  // Lấy branch hiện tại đang xem
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

  const value = {
    user,
    setUser,
    isSuperAdmin,
    isBranchAdmin,
    isViewingBranch,
    viewBranch,
    viewAllBranches,
    getCurrentBranch
  };

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