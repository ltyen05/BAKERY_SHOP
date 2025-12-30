// ===============================================
// Location: src/pages/Orders/OrdersView.jsx
// ===============================================


import React, { useState } from 'react';
import { 
  FiEye, FiTrash2, FiDownload, FiShoppingBag, FiClock, 
  FiCheckCircle, FiTruck, FiSearch, FiDollarSign, 
  FiPackage, FiXCircle, FiAlertCircle, FiEdit3
} from 'react-icons/fi';
import DataTable from '../../components/Table/Table';
import StatsCard from '../../components/StatsCard/StatsCard';
import OrderDetailModal from './OrderDetailModal';
import StatusUpdateModal from './StatusUpdateModal';
import { useOrders } from './useOrders'; // ← Giữ nguyên (vì VSCode tự động thêm extension)
import { STATUS_TABS, STATUS_INFO } from './constants';
import { orderApi } from '../../api/orderApi';
import './OrdersView.css';

export default function OrdersView() {
  const {
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
  } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrderForUpdate, setSelectedOrderForUpdate] = useState(null);

  const rowsPerPage = 10;

  // Fetch order details
  const fetchOrderDetails = async (orderId) => {
    try {
      setLoadingDetails(true);
      const data = await orderApi.getOrderDetail(orderId);
      setOrderDetails(data);
    } catch (err) {
      console.error(' Error fetching order details:', err);
      setOrderDetails([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handlers
  const handleViewDetail = async (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
    await fetchOrderDetails(order.order_id);
  };

  const handleOpenStatusModal = (order) => {
    setSelectedOrderForUpdate(order);
    setIsStatusModalOpen(true);
  };

  const handleExportCSV = () => {
    const headers = ['Mã đơn', 'Khách hàng', 'Tổng tiền', 'Trạng thái', 'Ngày đặt'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => 
        [
          `#ORD${order.order_id}`, 
          order.customer_id || 'N/A', 
          order.total_amount, 
          order.status, 
          formatDate(order.created_at)
        ].join(',')
      )
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'orders.csv';
    link.click();
  };

  // Format helpers
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Icon mapping
  const getStatusIcon = (status) => {
    const icons = {
      'Pending': FiClock,
      'Confirmed': FiCheckCircle,
      'Shipping': FiTruck,
      'Delivered': FiPackage,
      'Cancelled': FiXCircle
    };
    return icons[status] || FiClock;
  };

  // Table columns
  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'order_id',
      key: 'order_id',
      align: 'center',
      render: (id) => <span className="order-id">#ORD{id}</span>,
      sorter: (a, b) => a.order_id - b.order_id,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      render: (date) => <span className="date-cell">{formatDate(date)}</span>,
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer_id',
      key: 'customer_id',
      align: 'center',
      render: (id) => <div className="customer-name">{id || 'N/A'}</div>,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'order_address',
      key: 'order_address',
      align: 'left',
      render: (address) => <div className="address-cell">{address || 'N/A'}</div>,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_amount',
      key: 'total_amount',
      align: 'right',
      render: (amount) => <span className="total-cell">{formatCurrency(amount)}</span>,
      sorter: (a, b) => a.total_amount - b.total_amount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => {
        const statusInfo = STATUS_INFO[status] || STATUS_INFO['Pending'];
        const StatusIcon = getStatusIcon(status);
        
        return (
          <span className={`status ${statusInfo.class}`}>
            <StatusIcon />
            {statusInfo.label}
          </span>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <div className="action-buttons">
          <button 
            className="icon-btn view" 
            onClick={() => handleViewDetail(record)}
            title="Xem chi tiết"
          >
            <FiEye />
          </button>
          <button 
            className="icon-btn edit" 
            onClick={() => handleOpenStatusModal(record)}
            title="Cập nhật trạng thái"
          >
            <FiEdit3 />
          </button>
          <button 
            className="icon-btn delete" 
            onClick={() => deleteOrder(record.order_id)}
            title="Xóa"
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="order-container">
        <div className="loading-state">Đang tải dữ liệu...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="order-container">
        <div className="error-state">
          <FiAlertCircle size={48} />
          <p className="error-message">{error}</p>
          <button onClick={fetchOrders} className="retry-btn">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="order-container">
      {/* Header */}
      <div className="order-header">
        <div>
          <h2 className="order-title">Order Management</h2>
          <p className="order-subtitle">Quản lý đơn hàng của cửa hàng</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Tổng đơn hàng"
          value={stats.total}
          icon={<FiShoppingBag />}
          color="blue"
        />
        <StatsCard
          title="Chờ xác nhận"
          value={stats.pending}
          icon={<FiClock />}
          color="yellow"
        />
        <StatsCard
          title="Đang giao"
          value={stats.shipping}
          icon={<FiTruck />}
          color="orange"
        />
        <StatsCard
          title="Doanh thu"
          value={formatCurrency(stats.totalRevenue).replace('₫', 'đ')}
          icon={<FiDollarSign />}
          color="green"
        />
      </div>

      {/* Tabs + Actions */}
      <div className="tabs-action-bar">
        <div className="status-tabs">
          {STATUS_TABS.map(status => (
            <div
              key={status}
              className={`status-tab ${activeStatus === status ? 'active' : ''}`}
              onClick={() => { setActiveStatus(status); setCurrentPage(1); }}
            >
              {status === 'Tất cả' ? status : STATUS_INFO[status]?.label || status}
              <span className="tab-count">({statusCount(status)})</span>
            </div>
          ))}
        </div>
        
        <div className="right-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm đơn hàng, khách hàng..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="search-input"
            />
          </div>
          <button className="export-btn" onClick={handleExportCSV}>
            <FiDownload />
            Export
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        dataSource={filteredOrders}
        loading={loading}
        rowKey="order_id"
        pagination={{
          current: currentPage,
          pageSize: rowsPerPage,
          total: filteredOrders.length,
          onChange: (page) => setCurrentPage(page),
        }}
        scroll={{ x: 1200 }}
        emptyText="Không tìm thấy đơn hàng nào"
      />

      {/* Modals */}
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={selectedOrder}
        orderDetails={orderDetails}
        loadingDetails={loadingDetails}
      />

      <StatusUpdateModal
        isOpen={isStatusModalOpen}
        order={selectedOrderForUpdate}
        onClose={() => setIsStatusModalOpen(false)}
        onUpdate={updateOrderStatus}
      />
    </div>
  );
}
