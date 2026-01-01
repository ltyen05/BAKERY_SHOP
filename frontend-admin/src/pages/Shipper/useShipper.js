// ===============================================
// src/pages/Shipper/useShipper.js - FIXED
// ===============================================
import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import { useAuth } from '../../context/AuthContext';
import { shipperApi } from '../../api/shipperApi';

export const useShipper = () => {
  const { user, isSuperAdmin, isBranchAdmin, getCurrentBranch } = useAuth();

  const [shippers, setShippers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Xác định branch_id hiện tại
  const currentBranchId = useMemo(() => {
    if (isBranchAdmin) {
      return user.branch_id;
    }
    
    if (isSuperAdmin && user.viewing_branch) {
      const branch = getCurrentBranch();
      console.log('📍 Current branch:', branch);
      
      if (!branch || !branch.id) {
        return null;
      }
      
      if (typeof branch.id === 'number') {
        return branch.id;
      }
      
      if (typeof branch.id === 'string') {
        const match = branch.id.match(/\d+/);
        return match ? parseInt(match[0]) : null;
      }
      
      return null;
    }
    
    return null;
  }, [user, isSuperAdmin, isBranchAdmin, getCurrentBranch]);

  useEffect(() => {
    console.log('🔄 Branch changed, reloading shippers. Current branch_id:', currentBranchId);
    loadShippers();
  }, [currentBranchId]);

  const loadShippers = async () => {
    try {
      setLoading(true);
      
      console.log('📡 Loading shippers for branch_id:', currentBranchId || 'ALL');
      
      const response = await shipperApi.getAllShippers(currentBranchId);
      
      if (response.success && response.data) {
        setShippers(response.data);
        console.log(`✅ Loaded ${response.data.length} shippers`);
      } else {
        message.error(response.message || 'Không thể tải danh sách shipper');
        setShippers([]);
      }
    } catch (error) {
      console.error('❌ Error loading shippers:', error);
      message.error('Lỗi khi tải danh sách shipper');
      setShippers([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Thêm stats cho "Nghỉ việc"
  const stats = useMemo(() => {
    const total = shippers.length;
    const active = shippers.filter(s => s.status === 'Đang hoạt động').length;
    const busy = shippers.filter(s => s.status === 'Đang giao').length;
    const inactive = shippers.filter(s => s.status === 'Nghỉ việc').length;
    
    return { total, active, busy, inactive };
  }, [shippers]);

  const filteredShippers = useMemo(() => {
    return shippers.filter(shipper => {
      const query = searchQuery.trim().toLowerCase();
      const matchSearch = query === '' ||
        shipper.name?.toLowerCase().includes(query) ||
        shipper.email?.toLowerCase().includes(query) ||
        shipper.phone?.includes(query) ||
        shipper.shipper_id.toString() === query;
      
      return matchSearch;
    });
  }, [shippers, searchQuery]);

  const addShipper = async (newShipper) => {
    try {
      setLoading(true);
      
      // ✅ Branch Admin: Bắt buộc dùng branch_id của mình
      if (isBranchAdmin) {
        newShipper.branch_id = currentBranchId;
      }
      
      // Super Admin: Nếu không chọn thì dùng branch đang xem
      if (!newShipper.branch_id && currentBranchId) {
        newShipper.branch_id = currentBranchId;
      }
      
      const response = await shipperApi.addShipper(newShipper);
      
      if (response.success) {
        message.success('Thêm shipper thành công!');
        await loadShippers();
        return { success: true };
      } else {
        message.error(response.message || 'Không thể thêm shipper');
        return { success: false };
      }
    } catch (error) {
      console.error('❌ Error adding shipper:', error);
      message.error('Lỗi khi thêm shipper');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const updateShipper = async (id, updatedShipper) => {
    try {
      setLoading(true);
      
      // ✅ Branch Admin: Không được đổi branch_id
      if (isBranchAdmin) {
        updatedShipper.branch_id = currentBranchId;
      }
      
      const response = await shipperApi.updateShipper(id, updatedShipper);
      
      if (response.success) {
        message.success('Cập nhật shipper thành công!');
        await loadShippers();
        return { success: true };
      } else {
        message.error(response.message || 'Không thể cập nhật shipper');
        return { success: false };
      }
    } catch (error) {
      console.error('❌ Error updating shipper:', error);
      message.error('Lỗi khi cập nhật shipper');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const deleteShipper = async (shipperId) => {
    try {
      const response = await shipperApi.deleteShipper(shipperId);
      if (response.success) {
        message.success('Xóa shipper thành công!');
        await loadShippers();
        return { success: true };
      } else {
        message.error(response.message || 'Không thể xóa shipper');
        return { success: false };
      }
    } catch (error) {
      console.error('❌ Error deleting shipper:', error);
      message.error('Lỗi khi xóa shipper');
      return { success: false };
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const getHeaderTitle = () => {
    if (isBranchAdmin) {
      return `Shipper ${user.branch_name || ''}`;
    }
    
    if (isSuperAdmin && user.viewing_branch) {
      return `Shipper ${user.viewing_branch.name}`;
    }
    
    return 'Quản lý Shipper';
  };

  const getHeaderSubtitle = () => {
    if (isBranchAdmin) {
      return `Quản lý ${stats.total} shipper chi nhánh ${user.branch_name}`;
    }
    
    if (isSuperAdmin && user.viewing_branch) {
      return `Đang xem ${stats.total} shipper tại ${user.viewing_branch.name}`;
    }
    
    return `Quản lý ${stats.total} shipper trên toàn hệ thống`;
  };

  return {
    shippers,
    filteredShippers,
    stats,
    loading,
    searchQuery,
    currentPage,
    loadShippers,
    addShipper,
    updateShipper,
    deleteShipper,
    getHeaderTitle,
    getHeaderSubtitle,
    setCurrentPage,
    handleSearchChange,
    isSuperAdmin,
    isBranchAdmin,
    currentBranchId
  };
};