// ===============================================
// src/pages/Shipper/useShipper.js - UPDATED WITH CONSTANTS
// ===============================================
import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import { useAuth } from '../../context/AuthContext';
import { shipperApi } from '../../api/shipperApi'; 
import { VEHICLE_TABS } from './shipperConstants'

export const useShipper = () => {
  // ============= AUTH CONTEXT =============
  const { user, isSuperAdmin, isBranchAdmin, getCurrentBranch } = useAuth();

  // ============= STATE =============
  const [shippers, setShippers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeVehicle, setActiveVehicle] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // ============= LOAD DATA WITH AUTH FILTER =============
  useEffect(() => {
    loadShippers();
  }, [user.viewing_branch, user.branch_id]);

  const loadShippers = async () => {
    try {
      setLoading(true);
      
      // 🔹 XÁC ĐỊNH BRANCH ID CẦN FILTER
      let options = {};
      
      // CASE 1: Branch Admin → chỉ xem shipper chi nhánh của mình
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
      
      console.log('📦 Loading shippers with options:', options);
      
      const response = await shipperApi.getAllShippers(options);
      
      if (response.success && response.data) {
        const transformedData = response.data.map(shipper => ({
          key: shipper.shipper_id,
          id: shipper.shipper_id,
          shipper_id: shipper.shipper_id,
          name: shipper.shipper_name,
          email: shipper.email,
          phone: shipper.phone,
          status: shipper.status || 'Đang hoạt động',
          branch_id: shipper.branch_id,
          rating: shipper.rating || 0,
          total_success: shipper.total_success || 0,
          vehicle_type: shipper.vehicle_type || 'Xe máy'
        }));
        
        setShippers(transformedData);
        console.log(`✅ Loaded ${transformedData.length} shippers`);
      } else {
        message.error(response.message || 'Không thể tải danh sách shipper');
      }
    } catch (error) {
      console.error('Error loading shippers:', error);
      message.error('Lỗi khi tải danh sách shipper');
    } finally {
      setLoading(false);
    }
  };

  // ============= COMPUTED VALUES =============
  const stats = useMemo(() => {
    const total = shippers.length;
    const active = shippers.filter(s => s.status === 'Đang hoạt động').length;
    const busy = shippers.filter(s => s.status === 'Đang giao').length;
    return { total, active, busy };
  }, [shippers]);

  const filteredShippers = useMemo(() => {
    return shippers.filter(shipper => {
      // Filter theo vehicle type
      const currentTab = VEHICLE_TABS.find(t => t.id === activeVehicle);
      const matchVehicle = !currentTab?.vehicle || shipper.vehicle_type === currentTab.vehicle;
      
      // Filter theo status
      const matchStatus = statusFilter === 'all' || shipper.status === statusFilter;
      
      // Filter theo search query
      const query = searchQuery.trim().toLowerCase();
      const matchSearch = query === '' ||
        shipper.name?.toLowerCase().includes(query) ||
        shipper.email?.toLowerCase().includes(query) ||
        shipper.phone?.includes(query) ||
        shipper.shipper_id.toString() === query ||
        shipper.shipper_id.toString().includes(query);
      
      return matchVehicle && matchStatus && matchSearch;
    });
  }, [shippers, activeVehicle, statusFilter, searchQuery]);

  const vehicleCount = (vehicleId) => {
    const tab = VEHICLE_TABS.find(t => t.id === vehicleId);
    if (!tab?.vehicle) return shippers.length;
    return shippers.filter(s => s.vehicle_type === tab.vehicle).length;
  };

  // ============= CRUD OPERATIONS =============
  const addShipper = async (newShipper) => {
    try {
      setLoading(true);
      
      // 🔹 Tự động set branch_id nếu là Branch Admin
      if (isBranchAdmin && !newShipper.branch_id) {
        newShipper.branch_id = user.branch_id;
      }
      
      // 🔹 Nếu Super Admin đang xem chi nhánh, set branch_id đó
      if (isSuperAdmin && user.viewing_branch && !newShipper.branch_id) {
        const currentBranch = getCurrentBranch();
        newShipper.branch_id = currentBranch.id.replace('CN', '');
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
      console.error('Error adding shipper:', error);
      message.error('Lỗi khi thêm shipper. Vui lòng thử lại.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const updateShipper = async (id, updatedShipper) => {
    try {
      setLoading(true);
      console.log('🔄 Updating shipper with ID:', id);
      console.log('📝 Data:', updatedShipper);
      
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
      console.error('Error updating shipper:', error);
      message.error('Lỗi khi cập nhật shipper. Vui lòng thử lại.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const deleteShipper = async (shipperId, shipperName) => {
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
      console.error('Error deleting shipper:', error);
      message.error('Lỗi khi xóa shipper. Vui lòng thử lại.');
      return { success: false };
    }
  };

  // ============= FILTER HANDLERS =============
  const handleVehicleChange = (vehicleId) => {
    setActiveVehicle(vehicleId);
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
      return `Shipper ${user.branch_name}`;
    }
    
    if (isSuperAdmin && user.viewing_branch) {
      return `Shipper ${user.viewing_branch.name}`;
    }
    
    return 'Quản lý Shipper';
  };

  const getHeaderSubtitle = () => {
    if (isBranchAdmin) {
      return `Quản lý shipper chi nhánh ${user.branch_name}`;
    }
    
    if (isSuperAdmin && user.viewing_branch) {
      return `Đang xem chi nhánh: ${user.viewing_branch.name}`;
    }
    
    return 'Quản lý toàn bộ shipper của hệ thống';
  };

  // ============= RETURN =============
  return {
    // Data
    shippers,
    filteredShippers,
    stats,
    
    // State
    loading,
    activeVehicle,
    statusFilter,
    searchQuery,
    currentPage,
    
    // CRUD
    loadShippers,
    addShipper,
    updateShipper,
    deleteShipper,
    
    // Helpers
    vehicleCount,
    getHeaderTitle,
    getHeaderSubtitle,
    
    // Handlers
    setCurrentPage,
    handleVehicleChange,
    handleStatusChange,
    handleSearchChange,
    
    // Auth
    isSuperAdmin,
    isBranchAdmin,
    currentBranchId: user.viewing_branch?.id || user.branch_id
  };
};