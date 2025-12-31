// ===============================================
// src/pages/Voucher/useVoucher.js
// ===============================================
import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import couponApi from '../../api/voucherApi';

export const useVoucher = () => {
  // ============= STATE =============
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // ============= LOAD DATA =============
  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      setLoading(true);
      const data = await couponApi.getAllCoupons();
      setVouchers(data);
    } catch (error) {
      console.error('Error loading vouchers:', error);
      message.error('Không thể tải danh sách voucher');
    } finally {
      setLoading(false);
    }
  };

  // ============= COMPUTED VALUES =============
  const stats = useMemo(() => {
    const total = vouchers.length;
    const active = vouchers.filter(v => v.status === 'Active').length;
    const expired = vouchers.filter(v => v.status === 'Expired').length;
    const totalUsed = vouchers.reduce((sum, v) => sum + v.used, 0);

    return { total, active, expired, totalUsed };
  }, [vouchers]);

  const filteredVouchers = useMemo(() => {
    return vouchers.filter(voucher => {
      const matchSearch = 
        voucher.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voucher.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = 
        statusFilter === 'all' || 
        voucher.status.toLowerCase() === statusFilter.toLowerCase();
      
      const matchType = 
        typeFilter === 'all' || 
        voucher.type === typeFilter;

      return matchSearch && matchStatus && matchType;
    });
  }, [vouchers, searchQuery, statusFilter, typeFilter]);

  // ============= CRUD OPERATIONS =============
  const addVoucher = async (newVoucher) => {
    try {
      setLoading(true);
      const response = await couponApi.addCoupon(newVoucher);
      
      if (response.success) {
        message.success('Thêm voucher thành công!');
        await loadVouchers();
        return { success: true };
      } else {
        message.error(response.message || 'Không thể thêm voucher');
        return { success: false };
      }
    } catch (error) {
      console.error('Error adding voucher:', error);
      message.error('Lỗi khi thêm voucher. Vui lòng thử lại.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const deleteVoucher = async (voucherId, voucherCode) => {
    try {
      const response = await couponApi.deleteCoupon(voucherId);
      if (response.success) {
        message.success('Xóa voucher thành công!');
        await loadVouchers();
        return { success: true };
      } else {
        message.error(response.message || 'Không thể xóa voucher');
        return { success: false };
      }
    } catch (error) {
      console.error('Error deleting voucher:', error);
      message.error('Lỗi khi xóa voucher. Vui lòng thử lại.');
      return { success: false };
    }
  };

  // ============= FILTER HANDLERS =============
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleTypeChange = (type) => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // ============= RETURN =============
  return {
    // Data
    vouchers,
    filteredVouchers,
    stats,
    
    // State
    loading,
    viewMode,
    statusFilter,
    typeFilter,
    searchQuery,
    currentPage,
    
    // CRUD
    loadVouchers,
    addVoucher,
    deleteVoucher,
    
    // Handlers
    setCurrentPage,
    handleViewModeChange,
    handleStatusChange,
    handleTypeChange,
    handleSearchChange
  };
};