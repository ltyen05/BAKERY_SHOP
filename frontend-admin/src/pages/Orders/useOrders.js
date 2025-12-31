// ===============================================
// Location: src/pages/Orders/useOrders.js - FIXED
// ===============================================

import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import { orderApi } from '../../api/orderApi';
import { useAuth } from '../../context/AuthContext';
import { STATUS_TABS } from './orderConstants';

export const useOrders = () => {
  const { user, getCurrentBranch } = useAuth();
  
  // ✅ Lấy branch_id đúng cách
  const currentBranch = getCurrentBranch();
  const branchId = currentBranch?.id;

  // ============= STATE =============
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // ============= FETCH ORDERS =============
  const fetchOrders = async () => {
    if (!branchId) {
      message.error('Không tìm thấy branch ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('📞 Fetching orders for branch:', branchId);
      
      const response = await orderApi.getAllOrders(branchId);
      
      console.log('📦 API response:', response);
      
      if (response.success && response.data) {
        // ✅ Transform data từ backend
        const transformedOrders = response.data.map(order => ({
          order_id: order.order_id,
          customer_id: order.customer_id,
          branch_id: order.branch_id,
          shipper_id: order.shipper_id,
          coupon_id: order.coupon_id,
          total_amount: order.total_amount,
          payment_method: order.payment_method,
          phone: order.phone,
          note: order.note,
          created_at: order.created_at,
          
          // ✅ Mapping fields
          order_address: order.shipping_address || 'N/A',
          customer_name: order.recipient_name || 'Khách hàng',
          
          // ⚠️ Backend chưa trả status - dùng default
          status: order.status || 'Pending'
        }));

        console.log('✅ Transformed orders:', transformedOrders);
        setOrders(transformedOrders);
      } else {
        console.warn('⚠️ No data in response');
        setOrders([]);
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      message.error('Không thể tải danh sách đơn hàng');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ============= INITIAL LOAD =============
  useEffect(() => {
    console.log('🔄 useOrders effect, branchId:', branchId);
    if (branchId) {
      fetchOrders();
    }
  }, [branchId]);

  // ============= FILTERED ORDERS =============
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Filter by status tab
    if (activeStatus !== 'all') {
      const tabConfig = STATUS_TABS.find(tab => tab.id === activeStatus);
      if (tabConfig?.status) {
        result = result.filter(order => order.status === tabConfig.status);
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => {
        const orderId = String(order.order_id).toLowerCase();
        const customerName = (order.customer_name || '').toLowerCase();
        const address = (order.order_address || '').toLowerCase();
        const phone = (order.phone || '').toLowerCase();
        
        return orderId.includes(query) || 
               customerName.includes(query) || 
               address.includes(query) ||
               phone.includes(query);
      });
    }

    return result;
  }, [orders, activeStatus, searchQuery]);

  // ============= STATS =============
  const stats = useMemo(() => {
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      total: orders.length,
      pending: statusCounts['Pending'] || 0,
      confirmed: statusCounts['Confirmed'] || 0,
      shipping: statusCounts['Shipping'] || 0,
      delivered: statusCounts['Delivered'] || 0,
      cancelled: statusCounts['Cancelled'] || 0,
    };
  }, [orders]);

  // ============= CRUD OPERATIONS =============
  
  const deleteOrder = async (orderId) => {
    try {
      await orderApi.deleteOrder(orderId);
      message.success('Xóa đơn hàng thành công');
      await fetchOrders(); // Refresh
      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      message.error('Không thể xóa đơn hàng');
      return false;
    }
  };

  // ⚠️ UPDATE STATUS - Backend chưa có API
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.warn('⚠️ Backend chưa có API update status');
      await orderApi.updateOrderStatus(orderId, newStatus);
      message.success('Cập nhật trạng thái thành công (mock)');
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Không thể cập nhật trạng thái');
      return false;
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      console.warn('⚠️ Backend chưa có API get order details');
      const details = await orderApi.getOrderDetail(orderId);
      return details;
    } catch (error) {
      console.error('Error fetching details:', error);
      message.error('Không thể tải chi tiết đơn hàng');
      return { items: [] };
    }
  };

  // ============= HELPERS =============
  const statusCount = (statusId) => {
    if (statusId === 'all') return orders.length;
    const tabConfig = STATUS_TABS.find(tab => tab.id === statusId);
    if (!tabConfig?.status) return 0;
    return orders.filter(o => o.status === tabConfig.status).length;
  };

  const getHeaderTitle = () => {
    const branchName = currentBranch?.name || 'Chi nhánh';
    return `Quản lý đơn hàng - ${branchName}`;
  };

  const getHeaderSubtitle = () => {
    const count = filteredOrders.length;
    if (activeStatus === 'all') {
      return `Tổng cộng ${count} đơn hàng`;
    }
    const tab = STATUS_TABS.find(t => t.id === activeStatus);
    return `${count} đơn hàng ${tab?.label?.toLowerCase() || ''}`;
  };

  // ============= HANDLERS =============
  const handleStatusChange = (statusId) => {
    setActiveStatus(statusId);
    setCurrentPage(1);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // ============= PERMISSION CHECKS =============
  const canUpdateStatus = user?.role === 'super_admin'; // ✅ Chỉ super admin mới được update status
  const canDeleteOrder = true; // Admin được xóa order

  return {
    // Data
    orders,
    filteredOrders,
    stats,
    
    // State
    loading,
    activeStatus,
    searchQuery,
    currentPage,
    
    // CRUD
    deleteOrder,
    updateOrderStatus,
    fetchOrderDetails,
    refetchOrders: fetchOrders,
    
    // Permissions
    canUpdateStatus,
    canDeleteOrder,
    
    // Helpers
    statusCount,
    getHeaderTitle,
    getHeaderSubtitle,
    
    // Handlers
    setCurrentPage,
    handleStatusChange,
    handleSearchChange
  };
};