// ===============================================
// Location: src/pages/Orders/useOrders.jsx
// ===============================================

import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import { orderApi } from '../../api/orderApi';
import { 
  STATUS_MAPPING_FROM_BACKEND, 
  STATUS_MAPPING_TO_BACKEND 
} from './constants';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStatus, setActiveStatus] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await orderApi.getAllOrders();
      const mappedOrders = data.map(order => ({
        ...order,
        status: mapStatusFromBackend(order.status)
      }));
      
      setOrders(mappedOrders);
    } catch (err) {
      console.error(' Error fetching orders:', err);
      setError(`Không thể tải dữ liệu: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const mapStatusFromBackend = (status) => {
    return STATUS_MAPPING_FROM_BACKEND[status] || status;
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) return;

    try {
      await orderApi.deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o.order_id !== orderId));
      message.success('Xóa đơn hàng thành công!');
    } catch (err) {
      console.error(' Error deleting order:', err);
      message.error('Không thể xóa đơn hàng. Vui lòng thử lại.');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const backendStatus = STATUS_MAPPING_TO_BACKEND[newStatus] || newStatus;
      await orderApi.updateOrderStatus(orderId, backendStatus);
      
      setOrders(prev => prev.map(order => 
        order.order_id === orderId ? { ...order, status: newStatus } : order
      ));
      
      message.success('Cập nhật trạng thái thành công!');
      return true;
    } catch (err) {
      console.error(' Error updating status:', err);
      message.error('Không thể cập nhật trạng thái. Vui lòng thử lại.');
      return false;
    }
  };

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'Pending').length;
    const confirmed = orders.filter(o => o.status === 'Confirmed').length;
    const shipping = orders.filter(o => o.status === 'Shipping').length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    const cancelled = orders.filter(o => o.status === 'Cancelled').length;
    const totalRevenue = orders
      .filter(o => o.status === 'Delivered')
      .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
    
    return { total, pending, confirmed, shipping, delivered, cancelled, totalRevenue };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchStatus = activeStatus === 'Tất cả' || order.status === activeStatus;
      const matchSearch = searchQuery === '' ||
        `#ORD${order.order_id}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customer_id && order.customer_id.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchStatus && matchSearch;
    });
  }, [orders, activeStatus, searchQuery]);

  const statusCount = (status) => {
    return status === 'Tất cả' 
      ? orders.length 
      : orders.filter(o => o.status === status).length;
  };

  return {
    orders,
    loading,
    error,
    activeStatus,
    setActiveStatus,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    stats,
    filteredOrders,
    statusCount,
    deleteOrder,
    updateOrderStatus,
    fetchOrders,
  };
};