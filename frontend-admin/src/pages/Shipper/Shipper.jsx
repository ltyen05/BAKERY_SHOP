import React, { useMemo, useState } from 'react';
import { 
  FiEdit2, FiTrash2, FiPlus, FiDownload, FiChevronUp, FiChevronDown, 
  FiSearch, FiTruck, FiCheckCircle, FiClock 
} from 'react-icons/fi';
import './Shipper.css';
import AddShipperModal from './AddShipperModal';
import EditShipperModal from './EditShipperModal';

// Generate sample shipper data
const generateShippers = () => {
  const shippers = [
    { id: 1, name: 'Nguyễn Văn Giao', shipperId: 'SH001', phone: '0901234567', email: 'giao1@bakery.com', vehicle: '29A-12345', vehicleType: 'Xe máy', status: 'Active', todayOrders: 8, totalOrders: 234 },
    { id: 2, name: 'Trần Thị Hàng', shipperId: 'SH002', phone: '0912345678', email: 'hang2@bakery.com', vehicle: '30B-67890', vehicleType: 'Xe máy', status: 'Active', todayOrders: 12, totalOrders: 456 },
    { id: 3, name: 'Lê Văn Chuyển', shipperId: 'SH003', phone: '0923456789', email: 'chuyen3@bakery.com', vehicle: '29C-11111', vehicleType: 'Ô tô', status: 'Busy', todayOrders: 5, totalOrders: 189 },
    { id: 4, name: 'Phạm Minh Tốc', shipperId: 'SH004', phone: '0934567890', email: 'toc4@bakery.com', vehicle: '30D-22222', vehicleType: 'Xe máy', status: 'Inactive', todayOrders: 0, totalOrders: 567 },
    { id: 5, name: 'Hoàng Thu Nhanh', shipperId: 'SH005', phone: '0945678901', email: 'nhanh5@bakery.com', vehicle: '29E-33333', vehicleType: 'Xe máy', status: 'Active', todayOrders: 9, totalOrders: 345 },
    { id: 6, name: 'Vũ Đức Hỏa', shipperId: 'SH006', phone: '0956789012', email: 'hoa6@bakery.com', vehicle: '30F-44444', vehicleType: 'Ô tô', status: 'Active', todayOrders: 6, totalOrders: 278 },
  ];

  return shippers;
};

const VEHICLE_TABS = ['Tất cả', 'Xe máy', 'Ô tô'];

export default function Shipper() {
  const [shippers, setShippers] = useState(generateShippers());
  const [activeVehicle, setActiveVehicle] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const rowsPerPage = 10;

  // Stats
  const stats = useMemo(() => {
    const total = shippers.length;
    const active = shippers.filter(s => s.status === 'Active').length;
    const busy = shippers.filter(s => s.status === 'Busy').length;
    const totalOrdersToday = shippers.reduce((sum, s) => sum + s.todayOrders, 0);
    return { total, active, busy, totalOrdersToday };
  }, [shippers]);

  // Filtered data
  const filteredShippers = useMemo(() => {
    return shippers.filter(shipper => {
      const matchVehicle = activeVehicle === 'Tất cả' || shipper.vehicleType === activeVehicle;
      const matchStatus = statusFilter === 'all' || shipper.status === statusFilter;
      const matchSearch = searchQuery === '' ||
        shipper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipper.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipper.phone.includes(searchQuery) ||
        shipper.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchVehicle && matchStatus && matchSearch;
    });
  }, [shippers, activeVehicle, statusFilter, searchQuery]);

  // Sort
  const sortedShippers = useMemo(() => {
    if (!sortConfig.key) return filteredShippers;
    
    return [...filteredShippers].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredShippers, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedShippers.length / rowsPerPage);
  const paginatedShippers = sortedShippers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const vehicleCount = vehicle =>
    vehicle === 'Tất cả'
      ? shippers.length
      : shippers.filter(s => s.vehicleType === vehicle).length;

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

  // Delete shipper
  const handleDelete = (id) => {
    if(window.confirm('Bạn có chắc muốn xóa shipper này?')) {
      setShippers(prev => prev.filter(s => s.id !== id));
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Họ và tên', 'Mã shipper', 'Số điện thoại', 'Email', 'Biển số xe', 'Loại xe', 'Trạng thái', 'Đơn hôm nay', 'Tổng đơn'];
    const csvContent = [
      headers.join(','),
      ...filteredShippers.map(s => 
        [s.id, s.name, s.shipperId, s.phone, s.email, s.vehicle, s.vehicleType, s.status, s.todayOrders, s.totalOrders].join(',')
      )
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'shippers.csv';
    link.click();
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
  };

  return (
    <div className="shipper-container">
      {/* Header */}
      <div className="shipper-header">
        <div>
          <h2 className="shipper-title">Shipper Management</h2>
          <p className="shipper-subtitle">Quản lý đội ngũ giao hàng</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-blue">
          <div className="stat-icon">
            <FiTruck />
          </div>
          <div>
            <p className="stat-label">TỔNG SHIPPER</p>
            <h3 className="stat-value">{stats.total}</h3>
          </div>
        </div>
        
        <div className="stat-card stat-card-green">
          <div className="stat-icon">
            <FiCheckCircle />
          </div>
          <div>
            <p className="stat-label">SẴN SÀNG</p>
            <h3 className="stat-value">{stats.active}</h3>
          </div>
        </div>
        
        <div className="stat-card stat-card-orange">
          <div className="stat-icon">
            <FiClock />
          </div>
          <div>
            <p className="stat-label">ĐANG GIAO</p>
            <h3 className="stat-value">{stats.busy}</h3>
          </div>
        </div>
      </div>

      {/* Tabs + Actions Bar */}
      <div className="tabs-action-bar">
        <div className="vehicle-tabs">
          {VEHICLE_TABS.map(vehicle => (
            <div
              key={vehicle}
              className={`vehicle-tab ${activeVehicle === vehicle ? 'active' : ''}`}
              onClick={() => { setActiveVehicle(vehicle); setCurrentPage(1); }}
            >
              {vehicle} <span className="tab-count">({vehicleCount(vehicle)})</span>
            </div>
          ))}
        </div>
        
        <div className="right-actions">
          {/* SEARCH BOX */}
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm shipper..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="search-input"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="status-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Active">Sẵn sàng</option>
            <option value="Busy">Đang giao</option>
            <option value="Inactive">Nghỉ việc</option>
          </select>

          <button className="export-btn" onClick={handleExportCSV}>
            <FiDownload />
            Export
          </button>

          <button className="add-btn">
            <FiPlus />
            Thêm shipper
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="table-container">
        <table className="shipper-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('shipperId')} className="sortable">
                <div className="th-content">
                  Mã Shipper {getSortIcon('shipperId')}
                </div>
              </th>
              <th onClick={() => handleSort('name')} className="sortable">
                <div className="th-content">
                  Họ và tên {getSortIcon('name')}
                </div>
              </th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Biển số xe</th>
              <th onClick={() => handleSort('vehicleType')} className="sortable">
                <div className="th-content">
                  Loại xe {getSortIcon('vehicleType')}
                </div>
              </th>
              <th onClick={() => handleSort('todayOrders')} className="sortable">
                <div className="th-content">
                  Đơn hôm nay {getSortIcon('todayOrders')}
                </div>
              </th>
              <th onClick={() => handleSort('status')} className="sortable">
                <div className="th-content">
                  Trạng thái {getSortIcon('status')}
                </div>
              </th>
              <th className="action-col">Edit</th>
            </tr>
          </thead>
          <tbody>
            {paginatedShippers.map(shipper => (
              <tr key={shipper.id}>
                <td>
                  <span className="shipper-id-badge">{shipper.shipperId}</span>
                </td>
                <td>
                  <div className="name-cell">
                    <div className="avatar">{getInitials(shipper.name)}</div>
                    <span>{shipper.name}</span>
                  </div>
                </td>
                <td>{shipper.phone}</td>
                <td>{shipper.email}</td>
                <td>
                  <span className="vehicle-badge">{shipper.vehicle}</span>
                </td>
                <td>
                  <span className={`vehicle-type ${shipper.vehicleType === 'Ô tô' ? 'vehicle-car' : 'vehicle-bike'}`}>
                    {shipper.vehicleType === 'Ô tô' ? '🚗' : '🏍️'} {shipper.vehicleType}
                  </span>
                </td>
                <td>
                  <span className="order-count">{shipper.todayOrders}</span>
                </td>
                <td>
                  <span className={`status ${shipper.status.toLowerCase()}`}>
                    {shipper.status === 'Active' ? 'Sẵn sàng' : 
                     shipper.status === 'Busy' ? 'Đang giao' : 'Nghỉ việc'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn edit" title="Chỉnh sửa">
                      <FiEdit2 />
                    </button>
                    <button className="icon-btn delete" onClick={() => handleDelete(shipper.id)} title="Xóa">
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
            Trang {currentPage} / {totalPages} • {sortedShippers.length} kết quả
          </span>
        </div>
      )}
    </div>
  );
}