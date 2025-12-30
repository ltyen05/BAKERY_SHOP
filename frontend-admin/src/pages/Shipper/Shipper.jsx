// ===============================================
// Location: src/pages/Shipper/Shipper.jsx - FIXED EDIT MAPPING
// ===============================================
import React, { useState } from 'react';
import { Tag, Space, Button, Tooltip, Modal } from 'antd';
import { FiSearch, FiDownload, FiPlus, FiTruck, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import StatsCard from '../../components/StatsCard/StatsCard';
import DataTable from '../../components/Table/Table';
import FormModal from '../../components/FormModal/FormModal';
import { useShipper } from './useShipper';
import { 
  SHIPPER_FIELDS, 
  SHIPPER_EDIT_FIELDS,
  VEHICLE_TABS,
  STATS_CONFIG,
  getInitials,
  getVehicleIcon,
  getVehicleColor,
  formatRating,
  getBranchName
} from './shipperConstants';
import './Shipper.css';

const { confirm } = Modal;

const Shipper = () => {
  const {
    filteredShippers,
    stats,
    loading,
    activeVehicle,
    statusFilter,
    searchQuery,
    currentPage,
    addShipper,
    updateShipper,
    deleteShipper,
    vehicleCount,
    getHeaderTitle,
    getHeaderSubtitle,
    setCurrentPage,
    handleVehicleChange,
    handleStatusChange,
    handleSearchChange,
    isSuperAdmin,
    isBranchAdmin,
    currentBranchId
  } = useShipper();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedShipper, setSelectedShipper] = useState(null);

  const handleAddClick = () => {
    setModalMode('add');
    setSelectedShipper(null);
    setIsModalOpen(true);
  };

  // ✅ FIX: Map data đúng field names cho form
  const handleEditClick = (shipper) => {
    setModalMode('edit');
    
    // Map từ display data sang form data
    const formData = {
      shipper_id: shipper.shipper_id,
      shipper_name: shipper.name,        // ✅ name → shipper_name
      email: shipper.email,
      phone: shipper.phone,
      vehicle_type: shipper.vehicle_type,
      status: shipper.status,
      branch_id: shipper.branch_id,
      rating: shipper.rating,
      total_success: shipper.total_success
    };
    
    setSelectedShipper(formData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedShipper(null);
  };

  const handleSaveShipper = async (shipperData) => {
    let result;
    
    if (modalMode === 'add') {
      result = await addShipper(shipperData);
    } else {
      const shipperId = selectedShipper.shipper_id || selectedShipper.id;
      console.log('📝 Editing shipper ID:', shipperId, 'Data:', shipperData);
      result = await updateShipper(shipperId, shipperData);
    }
    
    if (result?.success) {
      handleCloseModal();
    }
  };

  const handleDelete = (shipper) => {
    confirm({
      title: 'Xác nhận xóa shipper',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa shipper "${shipper.name}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      centered: true,
      async onOk() {
        await deleteShipper(shipper.shipper_id, shipper.name);
      }
    });
  };

  const getFormFields = () => {
    const baseFields = modalMode === 'edit' ? SHIPPER_EDIT_FIELDS : SHIPPER_FIELDS;
    
    return baseFields.map(field => {
      if (field.name === 'branch_id' && isBranchAdmin) {
        return {
          ...field,
          defaultValue: currentBranchId?.toString() || '1',
          disabled: true
        };
      }
      
      if (field.name === 'branch_id' && currentBranchId) {
        return {
          ...field,
          defaultValue: currentBranchId.toString()
        };
      }
      
      return field;
    });
  };

  const handleExport = () => {
    if (filteredShippers.length === 0) return;
    
    const headers = ['ID', 'Tên', 'Email', 'Số điện thoại', 'Loại xe', 'Rating', 'Trạng thái', 'Chi nhánh'];
    const rows = filteredShippers.map(s => [
      s.shipper_id,
      s.name,
      s.email,
      s.phone,
      s.vehicle_type,
      s.rating,
      s.status,
      getBranchName(s.branch_id)
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `shippers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'shipper_id',
      key: 'shipper_id',
      width: 80,
      align: 'center',
      fixed: 'left',
      render: (id) => (
        <span style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>
          {id}
        </span>
      )
    },
    {
      title: 'Shipper',
      key: 'shipper',
      width: 220,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#FFBD71',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#5D0C0C',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            {getInitials(record.name)}
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
              {record.name}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 220,
      render: (email) => (
        <span style={{ color: '#475569', fontSize: '13px' }}>{email}</span>
      )
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
      render: (phone) => (
        <span style={{ color: '#475569', fontSize: '13px' }}>{phone}</span>
      )
    },
    {
      title: 'Loại xe',
      dataIndex: 'vehicle_type',
      key: 'vehicle_type',
      width: 150,
      align: 'center',
      render: (type) => (
        <Tag 
          color={type === 'Ô tô' ? 'magenta' : 'blue'} 
          style={{ fontWeight: '600', fontSize: '13px' }}
        >
          {getVehicleIcon(type)} {type}
        </Tag>
      )
    },
    {
      title: 'Rating',
      key: 'rating',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <span style={{ fontWeight: '600', color: '#f59e0b', fontSize: '14px' }}>
            ⭐ {formatRating(record.rating)}
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            ({record.total_success})
          </span>
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
        <Tag color={status === 'Đang hoạt động' ? 'success' : status === 'Đang giao' ? 'warning' : 'default'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'branch_id',
      key: 'branch_id',
      width: 200,
      render: (branchId) => (
        <span style={{ color: '#64748b', fontSize: '13px' }}>
          {getBranchName(branchId)}
        </span>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<FiEdit2 />}
              onClick={() => handleEditClick(record)}
              style={{ color: '#3b82f6' }}
            />
          </Tooltip>
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

  const paginationConfig = {
    current: currentPage,
    pageSize: 10,
    total: filteredShippers.length,
    showSizeChanger: false
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  return (
    <div className="shipper-container">
      <div className="shipper-header">
        <h1 className="shipper-title">{getHeaderTitle()}</h1>
        <p className="shipper-subtitle">{getHeaderSubtitle()}</p>
      </div>

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

      <div className="tabs-action-bar">
        <div className="vehicle-tabs">
          {VEHICLE_TABS.map(tab => (
            <div
              key={tab.id}
              className={`vehicle-tab ${activeVehicle === tab.id ? 'active' : ''}`}
              onClick={() => handleVehicleChange(tab.id)}
            >
              {tab.label} <span className="tab-count">({vehicleCount(tab.id)})</span>
            </div>
          ))}
        </div>

        <div className="right-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Tìm theo tên, email, ID..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <button
            className="export-btn"
            onClick={handleExport}
            disabled={filteredShippers.length === 0 || loading}
          >
            <FiDownload />
            Export
          </button>

          <button
            className="add-btn"
            onClick={handleAddClick}
            disabled={loading}
          >
            <FiPlus />
            Thêm shipper
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        dataSource={filteredShippers}
        loading={loading}
        pagination={paginationConfig}
        onChange={handleTableChange}
        rowKey="shipper_id"
        scroll={{ x: 1400 }}
        emptyText="Không có shipper nào"
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveShipper}
        title={{
          add: 'Thêm shipper mới',
          addDesc: 'Điền thông tin shipper vào form bên dưới',
          edit: 'Chỉnh sửa shipper',
          editDesc: 'Cập nhật thông tin shipper'
        }}
        icon={FiTruck}
        data={selectedShipper}
        fields={getFormFields()}
      />
    </div>
  );
};

export default Shipper;