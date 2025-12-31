// ===============================================
// src/pages/Voucher/Voucher.jsx - COMPLETE WITH FORM
// ===============================================
import React, { useState } from 'react';
import { Tag, Space, Button, Tooltip, Modal } from 'antd';
import { 
  FiSearch, FiPlus, FiTrash2, FiCheckCircle, 
  FiXCircle, FiCalendar, FiPercent, FiDollarSign,
  FiGrid, FiList, FiTag
} from 'react-icons/fi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import StatsCard from '../../components/StatsCard/StatsCard';
import DataTable from '../../components/Table/Table';
import FormModal from '../../components/FormModal/FormModal';
import { useVoucher } from './useVoucher';
import { 
  VOUCHER_FIELDS,
  STATS_CONFIG,
  formatDate,
  formatDiscount,
  getStatusText
} from './voucherConstants';
import './Voucher.css';

const { confirm } = Modal;

const Voucher = () => {
  const {
    filteredVouchers,
    stats,
    loading,
    viewMode,
    statusFilter,
    typeFilter,
    searchQuery,
    currentPage,
    addVoucher,
    deleteVoucher,
    setCurrentPage,
    handleViewModeChange,
    handleStatusChange,
    handleTypeChange,
    handleSearchChange
  } = useVoucher();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // ============= HANDLERS =============
  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveVoucher = async (voucherData) => {
    const result = await addVoucher(voucherData);
    if (result?.success) {
      handleCloseModal();
    }
  };

  const handleDelete = (voucher) => {
    confirm({
      title: 'Xác nhận xóa voucher',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa voucher "${voucher.code}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      centered: true,
      async onOk() {
        await deleteVoucher(voucher.id, voucher.code);
      }
    });
  };

  // ============= RENDER VOUCHER CARD =============
  const renderVoucherCard = (voucher) => (
    <div 
      key={voucher.id} 
      className={`voucher-card ${voucher.status === 'Expired' ? 'expired' : ''}`}
    >
      <div className="voucher-header-card">
        <div className="voucher-badge-group">
          <div className="voucher-badge">
            {voucher.status === 'Active' ? <FiCheckCircle /> : <FiXCircle />}
            {getStatusText(voucher.status)}
          </div>
        </div>
        <div className="voucher-actions">
          <button 
            className="btn-icon" 
            onClick={() => handleDelete(voucher)}
            title="Xóa"
          >
            <FiTrash2 data-icon="trash" />
          </button>
        </div>
      </div>

      <div className="voucher-code">
        <span className="code-label">Mã:</span>
        <span className="code-value">{voucher.code}</span>
      </div>

      <h3 className="voucher-name">{voucher.name}</h3>

      <div className="voucher-discount">
        {voucher.type === 'percent' ? <FiPercent /> : <FiDollarSign />}
        {formatDiscount(voucher)}
      </div>

      <div className="voucher-details">
        <div className="detail-item">
          <span className="detail-label">Đơn tối thiểu:</span>
          <span className="detail-value">
            {voucher.minOrder > 0 ? `${voucher.minOrder.toLocaleString('vi-VN')}đ` : 'Không'}
          </span>
        </div>
        {voucher.maxDiscount > 0 && (
          <div className="detail-item">
            <span className="detail-label">Giảm tối đa:</span>
            <span className="detail-value">{voucher.maxDiscount.toLocaleString('vi-VN')}đ</span>
          </div>
        )}
        <div className="detail-item">
          <span className="detail-label">Đã dùng:</span>
          <span className="detail-value">{voucher.used}/{voucher.quantity}</span>
        </div>
      </div>

      <div className="voucher-progress">
        <div className="progress-info">
          <span>Tỷ lệ sử dụng</span>
          <span>{Math.round((voucher.used / voucher.quantity) * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(voucher.used / voucher.quantity) * 100}%` }}
          />
        </div>
      </div>

      <div className="voucher-date">
        <FiCalendar />
        {formatDate(voucher.startDate)} - {formatDate(voucher.endDate)}
      </div>
    </div>
  );

  // ============= TABLE COLUMNS =============
  const columns = [
    {
      title: 'Mã voucher',
      dataIndex: 'code',
      key: 'code',
      width: 140,
      fixed: 'left',
      render: (code) => (
        <span style={{ 
          fontWeight: '700', 
          color: '#667eea', 
          fontSize: '14px',
          fontFamily: 'monospace',
          letterSpacing: '0.5px'
        }}>
          {code}
        </span>
      )
    },
    {
      title: 'Tên voucher',
      dataIndex: 'name',
      key: 'name',
      width: 280,
      render: (name) => (
        <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
          {name}
        </span>
      )
    },
    {
      title: 'Giảm giá',
      key: 'discount',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <Tag 
          color={record.type === 'percent' ? 'blue' : 'green'}
          style={{ 
            fontWeight: '600', 
            fontSize: '14px',
            padding: '6px 16px',
            borderRadius: '8px'
          }}
        >
          {record.type === 'percent' ? <FiPercent size={12} /> : <FiDollarSign size={12} />}
          {' '}{formatDiscount(record)}
        </Tag>
      )
    },
    {
      title: 'Đơn tối thiểu',
      dataIndex: 'minOrder',
      key: 'minOrder',
      width: 150,
      align: 'right',
      render: (value) => (
        <span style={{ color: '#475569', fontSize: '13px' }}>
          {value > 0 ? `${value.toLocaleString('vi-VN')}đ` : 'Không'}
        </span>
      )
    },
    {
      title: 'Giảm tối đa',
      dataIndex: 'maxDiscount',
      key: 'maxDiscount',
      width: 150,
      align: 'right',
      render: (value) => (
        <span style={{ color: '#475569', fontSize: '13px' }}>
          {value > 0 ? `${value.toLocaleString('vi-VN')}đ` : 'Không giới hạn'}
        </span>
      )
    },
    {
      title: 'Đã sử dụng',
      key: 'used',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '4px' 
        }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            {record.used}/{record.quantity}
          </span>
          <div style={{ 
            width: '60px', 
            height: '4px', 
            background: '#e2e8f0', 
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${(record.used / record.quantity) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
      )
    },
    {
      title: 'Thời gian',
      key: 'dates',
      width: 200,
      render: (_, record) => (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '2px',
          fontSize: '13px',
          color: '#64748b'
        }}>
          <span>{formatDate(record.startDate)}</span>
          <span>{formatDate(record.endDate)}</span>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      align: 'center',
      render: (status) => (
        <Tag 
          color={status === 'Active' ? 'success' : 'error'}
          style={{ fontWeight: '600', fontSize: '13px' }}
        >
          {status === 'Active' ? <FiCheckCircle size={12} /> : <FiXCircle size={12} />}
          {' '}{getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<FiTrash2 />}
              onClick={() => handleDelete(record)}
              danger
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // ============= PAGINATION =============
  const paginationConfig = {
    current: currentPage,
    pageSize: 10,
    total: filteredVouchers.length,
    showSizeChanger: false
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  // ============= MAIN RENDER =============
  return (
    <div className="voucher-page">
      {/* Header */}
      <div className="voucher-header">
        <div className="header-left">
          <h1>Quản lý Voucher</h1>
          <p>Quản lý và theo dõi các mã giảm giá của cửa hàng</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {STATS_CONFIG.map(stat => (
          <StatsCard
            key={stat.key}
            title={stat.title}
            value={stats[stat.key]}
            icon={stat.icon}
            color={stat.color}
            trend={null}
          />
        ))}
      </div>

      {/* Toolbar */}
      <div className="voucher-toolbar">
        <div className="toolbar-left">
          <div className="search-box-toolbar">
            <FiSearch />
            <input
              type="text"
              placeholder="Tìm kiếm voucher..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <button className="btn-add-voucher" onClick={handleAddClick}>
            <FiPlus />
            Thêm voucher
          </button>
        </div>

        <div className="toolbar-right">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('grid')}
            >
              <FiGrid />
            </button>
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('table')}
            >
              <FiList />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="voucher-filters">
        <div className="filter-group">
          <label>Trạng thái:</label>
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleStatusChange('all')}
            >
              Tất cả
            </button>
            <button 
              className={`filter-tab ${statusFilter === 'active' ? 'active' : ''}`}
              onClick={() => handleStatusChange('active')}
            >
              Đang hoạt động
            </button>
            <button 
              className={`filter-tab ${statusFilter === 'expired' ? 'active' : ''}`}
              onClick={() => handleStatusChange('expired')}
            >
              Đã hết hạn
            </button>
          </div>
        </div>

        <div className="filter-group">
          <label>Loại giảm giá:</label>
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${typeFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleTypeChange('all')}
            >
              Tất cả
            </button>
            <button 
              className={`filter-tab ${typeFilter === 'percent' ? 'active' : ''}`}
              onClick={() => handleTypeChange('percent')}
            >
              Phần trăm
            </button>
            <button 
              className={`filter-tab ${typeFilter === 'fixed' ? 'active' : ''}`}
              onClick={() => handleTypeChange('fixed')}
            >
              Số tiền cố định
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : filteredVouchers.length === 0 ? (
        <div className="empty-state">
          <FiTag size={64} color="#9ca3af" />
          <h3>Không tìm thấy voucher</h3>
          <p>Hãy thêm voucher mới hoặc thay đổi bộ lọc</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="vouchers-grid">
          {filteredVouchers.map(renderVoucherCard)}
        </div>
      ) : (
        <DataTable
          columns={columns}
          dataSource={filteredVouchers}
          loading={loading}
          pagination={paginationConfig}
          onChange={handleTableChange}
          rowKey="id"
          scroll={{ x: 1600 }}
          emptyText="Không có voucher nào"
        />
      )}

      {/* Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveVoucher}
        title={{
          add: 'Thêm voucher mới',
          addDesc: 'Điền thông tin voucher vào form bên dưới'
        }}
        icon={FiTag}
        data={null}
        fields={VOUCHER_FIELDS}
      />
    </div>
  );
};

export default Voucher;