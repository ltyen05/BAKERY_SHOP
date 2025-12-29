import React, { useMemo, useState } from 'react';
import { 
  FiEye, FiTrash2, FiDownload, FiChevronUp, FiChevronDown,
  FiShoppingBag, FiClock, FiCheckCircle, FiTruck, FiSearch,
  FiDollarSign, FiPackage, FiXCircle
} from 'react-icons/fi';

import './OrdersView.css';

// Generate sample orders
const generateOrders = () => {
  const statuses = ['Pending', 'Confirmed', 'Shipping', 'Delivered', 'Cancelled'];
  const customers = [
    { name: 'Nguyễn Văn A', phone: '0123456789' },
    { name: 'Trần Thị B', phone: '0987654321' },
    { name: 'Lê Hoàng C', phone: '0911222333' },
    { name: 'Phạm Minh D', phone: '0934567890' },
    { name: 'Hoàng Thu E', phone: '0945678901' }
  ];

  const products = [
    'Bánh Croissant', 'Bánh Tiramisu', 'Bánh Macaron', 
    'Bánh Bông Lan', 'Bánh Mì Que', 'Bánh Red Velvet',
    'Bánh Chocolate', 'Bánh Eclair', 'Bánh Tart'
  ];

  const orders = [];
  
  for (let i = 1; i <= 50; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const numItems = Math.floor(Math.random() * 4) + 1;
    const items = [];
    let total = 0;

    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const price = Math.floor(Math.random() * 40000) + 15000;
      items.push({ product, quantity, price });
      total += quantity * price;
    }

    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    orders.push({
      id: `#ORD${1000 + i}`,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: `${Math.floor(Math.random() * 500) + 1} Đường ABC, Quận ${Math.floor(Math.random() * 12) + 1}, Hà Nội`,
      items,
      total,
      status,
      paymentMethod: Math.random() > 0.5 ? 'COD' : 'Online',
      date: date.toISOString(),
      note: Math.random() > 0.7 ? 'Giao hàng buổi sáng' : ''
    });
  }

  return orders.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const STATUS_TABS = ['Tất cả', 'Pending', 'Confirmed', 'Shipping', 'Delivered', 'Cancelled'];

export default function Order() {
  const [orders, setOrders] = useState(generateOrders());
  const [activeStatus, setActiveStatus] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const rowsPerPage = 10;

  // Stats
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'Pending').length;
    const confirmed = orders.filter(o => o.status === 'Confirmed').length;
    const shipping = orders.filter(o => o.status === 'Shipping').length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    const cancelled = orders.filter(o => o.status === 'Cancelled').length;
    const totalRevenue = orders
      .filter(o => o.status === 'Delivered')
      .reduce((sum, o) => sum + o.total, 0);
    
    return { total, pending, confirmed, shipping, delivered, cancelled, totalRevenue };
  }, [orders]);

  // Filtered data
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchStatus = activeStatus === 'Tất cả' || order.status === activeStatus;
      const matchSearch = searchQuery === '' ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.includes(searchQuery);
      
      return matchStatus && matchSearch;
    });
  }, [orders, activeStatus, searchQuery]);

  // Sort
  const sortedOrders = useMemo(() => {
    if (!sortConfig.key) return filteredOrders;
    
    return [...filteredOrders].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === 'date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredOrders, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedOrders.length / rowsPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const statusCount = status =>
    status === 'Tất cả'
      ? orders.length
      : orders.filter(o => o.status === status).length;

  const handlePageChange = (page) => {
    if(page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (id) => {
    if(window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
      setOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Mã đơn', 'Khách hàng', 'SĐT', 'Tổng tiền', 'Trạng thái', 'Ngày đặt'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => 
        [
          order.id, 
          order.customerName, 
          order.customerPhone, 
          order.total, 
          order.status, 
          formatDate(order.date)
        ].join(',')
      )
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'orders.csv';
    link.click();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status info
  const getStatusInfo = (status) => {
    const statusMap = {
      'Pending': { label: 'Chờ xác nhận', class: 'pending', icon: <FiClock /> },
      'Confirmed': { label: 'Đã xác nhận', class: 'confirmed', icon: <FiCheckCircle /> },
      'Shipping': { label: 'Đang giao', class: 'shipping', icon: <FiTruck /> },
      'Delivered': { label: 'Đã giao', class: 'delivered', icon: <FiPackage /> },
      'Cancelled': { label: 'Đã hủy', class: 'cancelled', icon: <FiXCircle /> }
    };
    return statusMap[status] || statusMap['Pending'];
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
  };

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
        <div className="stat-card stat-card-blue">
          <div className="stat-icon">
            <FiShoppingBag />
          </div>
          <div>
            <p className="stat-label">Tổng đơn hàng</p>
            <h3 className="stat-value">{stats.total}</h3>
          </div>
        </div>
        
        <div className="stat-card stat-card-yellow">
          <div className="stat-icon">
            <FiClock />
          </div>
          <div>
            <p className="stat-label">Chờ xác nhận</p>
            <h3 className="stat-value">{stats.pending}</h3>
          </div>
        </div>
        
        <div className="stat-card stat-card-orange">
          <div className="stat-icon">
            <FiTruck />
          </div>
          <div>
            <p className="stat-label">Đang giao</p>
            <h3 className="stat-value">{stats.shipping}</h3>
          </div>
        </div>

        <div className="stat-card stat-card-green">
          <div className="stat-icon">
            <FiDollarSign />
          </div>
          <div>
            <p className="stat-label">Doanh thu</p>
            <h3 className="stat-value">{formatCurrency(stats.totalRevenue).replace('₫', 'đ')}</h3>
          </div>
        </div>
      </div>

      {/* Tabs + Actions Bar */}
      <div className="tabs-action-bar">
        <div className="status-tabs">
          {STATUS_TABS.map(status => (
            <div
              key={status}
              className={`status-tab ${activeStatus === status ? 'active' : ''}`}
              onClick={() => { setActiveStatus(status); setCurrentPage(1); }}
            >
              {status === 'Tất cả' ? status : getStatusInfo(status).label}
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

      {/* Table Container with Scroll */}
      <div className="table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} className="sortable">
                <div className="th-content">
                  Mã đơn {getSortIcon('id')}
                </div>
              </th>
              <th onClick={() => handleSort('date')} className="sortable">
                <div className="th-content">
                  Ngày đặt {getSortIcon('date')}
                </div>
              </th>
              <th onClick={() => handleSort('customerName')} className="sortable">
                <div className="th-content">
                  Khách hàng {getSortIcon('customerName')}
                </div>
              </th>
              <th>Sản phẩm</th>
              <th onClick={() => handleSort('total')} className="sortable">
                <div className="th-content">
                  Tổng tiền {getSortIcon('total')}
                </div>
              </th>
              <th>Thanh toán</th>
              <th onClick={() => handleSort('status')} className="sortable">
                <div className="th-content">
                  Trạng thái {getSortIcon('status')}
                </div>
              </th>
              <th className="action-col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map(order => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <tr key={order.id}>
                  <td>
                    <span className="order-id">{order.id}</span>
                  </td>
                  <td className="date-cell">{formatDate(order.date)}</td>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-avatar">
                        {order.customerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="customer-name">{order.customerName}</div>
                        <div className="customer-phone">{order.customerPhone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="items-cell">
                      <span className="items-count">{order.items.length} món</span>
                      <span className="items-preview">
                        {order.items[0].product}
                        {order.items.length > 1 && ` +${order.items.length - 1}`}
                      </span>
                    </div>
                  </td>
                  <td className="total-cell">{formatCurrency(order.total)}</td>
                  <td>
                    <span className={`payment-badge ${order.paymentMethod.toLowerCase()}`}>
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${statusInfo.class}`}>
                      {statusInfo.icon}
                      {statusInfo.label}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="icon-btn view" 
                        onClick={() => handleViewDetail(order)}
                        title="Xem chi tiết"
                      >
                        <FiEye />
                      </button>
                      <button 
                        className="icon-btn delete" 
                        onClick={() => handleDelete(order.id)}
                        title="Xóa"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Prev
          </button>
          
          {Array.from({length: totalPages}, (_, i) => i + 1).map(page => {
            if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return <span key={page} className="pagination-ellipsis">...</span>;
            }
            return null;
          })}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
          
          <span className="pagination-info">
            Trang {currentPage} / {totalPages} • {sortedOrders.length} kết quả
          </span>
        </div>
      )}

      {/* Order Detail Modal - Comment if not created yet */}
      {/*
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={selectedOrder}
      />
      */}
    </div>
  );
}