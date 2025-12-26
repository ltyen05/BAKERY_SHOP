import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const BranchContext = createContext();

export const useBranch = () => useContext(BranchContext);

export function BranchProvider({ children }) {
  const { user } = useAuth();
  
  // Mock data theo đúng DB - Sau này sẽ fetch từ API
  const [branches] = useState([
    { 
      branch_id: 1, 
      name: 'HUS Bakery - Hoàn Kiếm', 
      address: '15 Hàng Bạc, Hoàn Kiếm, Hà Nội',
      manager_id: 1 
    },
    { 
      branch_id: 2, 
      name: 'HUS Bakery - Cầu Giấy', 
      address: '89 Trần Duy Hưng, Cầu Giấy, Hà Nội',
      manager_id: 9 
    },
    { 
      branch_id: 3, 
      name: 'HUS Bakery - Đống Đa', 
      address: '120 Tây Sơn, Đống Đa, Hà Nội',
      manager_id: 17 
    },
    { 
      branch_id: 4, 
      name: 'HUS Bakery - Hà Đông', 
      address: '65 Quang Trung, Hà Đông, Hà Nội',
      manager_id: 25 
    },
    { 
      branch_id: 5, 
      name: 'HUS Bakery - Long Biên', 
      address: '20 Nguyễn Văn Cừ, Long Biên, Hà Nội',
      manager_id: 33 
    },
  ]);

  // Chi nhánh hiện tại
  const [currentBranch, setCurrentBranch] = useState(() => {
    // ADMIN thường: Dùng branch_id được gán
    if (user?.role === 'admin') {
      return user.branch_id; // ← Đổi từ branchId thành branch_id
    }
    // SUPER ADMIN: Lấy từ localStorage
    return localStorage.getItem('currentBranch') || 1; // ← Đổi string thành number
  });

  // Đổi chi nhánh (CHỈ SUPER ADMIN)
  const changeBranch = (branchId) => {
    if (user?.role !== 'super_admin') {
      alert('⚠️ Bạn không có quyền chuyển đổi chi nhánh!');
      return;
    }
    setCurrentBranch(branchId);
    localStorage.setItem('currentBranch', branchId);
  };

  // Lấy thông tin chi nhánh hiện tại
  const getCurrentBranchInfo = () => {
    return branches.find(b => b.branch_id == currentBranch); // ← Đổi id thành branch_id
  };

  // Kiểm tra có thể đổi chi nhánh không
  const canChangeBranch = () => {
    return user?.role === 'super_admin';
  };

  // Auto-update khi user thay đổi
  useEffect(() => {
    if (user?.role === 'admin' && user?.branch_id) {
      setCurrentBranch(user.branch_id);
    }
  }, [user]);

  return (
    <BranchContext.Provider value={{ 
      currentBranch, 
      branches, 
      changeBranch,
      getCurrentBranchInfo,
      canChangeBranch
    }}>
      {children}
    </BranchContext.Provider>
  );
}