// ===============================================
// src/pages/Shipper/Shipper.jsx - FIXED
// ✅ Logic render rating đã chuyển vào đây
// ===============================================
import React, { useState, useEffect } from 'react';
import { Tag, Space, Button, Tooltip, Modal, Alert } from 'antd';
import { FiSearch, FiDownload, FiPlus, FiTruck, FiEdit2, FiTrash2, FiStar } from 'react-icons/fi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import DataTable from '../../components/Table/Table';
import FormModal from '../../components/FormModal/FormModal';
import { useShipper } from './useShipper';
import branchApi from '../../api/branchApi';
import { 
  SHIPPER_FIELDS,
  SHIPPER_EDIT_FIELDS,
  getInitials,
  getStatusColor,
  getBranchName
} from './shipperConstants';
import './Shipper.css';

const { confirm } = Modal;

const Shipper = () => {
  const {
    filteredShippers,
    loading,
    searchQuery,
    currentPage,
    currentBranchId,
    addShipper,
    updateShipper,
    deleteShipper,
    getHeaderTitle,
    getHeaderSubtitle,
    setCurrentPage,
    handleSearchChange,
  } = useShipper();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [branchError, setBranchError] = useState(null);

  // ========================================
  // FETCH BRANCHES
  // ========================================
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoadingBranches(true);
    setBranchError(null);
    
    const result = await branchApi.getAllBranches();
    
    if (result.success && result.data) {
      const branchOptions = result.data.map(branch => ({
        value: String(branch.branch_id),
        label: `[${branch.branch_id}] ${branch.name || branch.branch_name}`
      }));
      
      setBranches(branchOptions);
      console.log(' Đã load branches cho shipper:', branchOptions);
    } else {
      const errorMsg = 'Không thể tải danh sách chi nhánh. Vui lòng thử lại.';
      setBranchError(errorMsg);
      console.error(' Lỗi load branches:', result.message);
      Modal.error({
        title: 'Lỗi tải dữ liệu',
        content: errorMsg,
        centered: true
      });
    }
    
    setLoadingBranches(false);
  };

  // ========================================
  // HANDLERS
  // ========================================
  const handleAddClick = () => {
    if (branchError || branches.length === 0) {
      Modal.warning({
        title: 'Chưa thể thêm shipper',
        content: 'Vui lòng đợi tải xong danh sách chi nhánh hoặc thử làm mới trang.',
        centered: true
      });
      return;
    }
    
    setModalMode('add');
    setSelectedShipper(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (shipper) => {
    setModalMode('edit');
    
    const formData = {
      shipper_id: shipper.shipper_id,
      shipper_name: shipper.name,
      email: shipper.email,
      phone: shipper.phone,
      status: shipper.status,
      branch_id: shipper.branch_id,
      salary: shipper.salary || 8000000
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
      // THÊM MỚI
      if (!shipperData.branch_id && currentBranchId) {
        shipperData.branch_id = currentBranchId;
        console.log(' Tự động điền branch_id từ context:', currentBranchId);
      }
      
      if (!shipperData.branch_id) {
        Modal.error({
          title: 'Thiếu thông tin',
          content: 'Không xác định được chi nhánh. Vui lòng chọn chi nhánh.',
          centered: true
        });
        return;
      }
      
      result = await addShipper(shipperData);
    } else {
      // EDIT
      const shipperId = selectedShipper.shipper_id;
      const updateData = {
        ...shipperData,
        branch_id: selectedShipper.branch_id
      };
      
      result = await updateShipper(shipperId, updateData);
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
        await deleteShipper(shipper.shipper_id);
      }
    });
  };

  const getFormFields = () => {
    const baseFields = modalMode === 'edit' ? SHIPPER_EDIT_FIELDS : SHIPPER_FIELDS;
    
    if (modalMode === 'add') {
      return baseFields.map(field => {
        if (field.name === 'branch_id') {
          return {
            ...field,
            options: branches,
            disabled: loadingBranches || branchError !== null,
            placeholder: loadingBranches ? 'Đang tải...' : 'Chọn chi nhánh',
            defaultValue: currentBranchId ? String(currentBranchId) : ''
          };
        }
        return field;
      });
    }
    
    return baseFields;
  };

  const handleExport = () => {
    if (filteredShippers.length === 0) return;
    
    const headers = ['ID', 'Tên', 'Email', 'Số điện thoại', 'Chi nhánh', 'Trạng thái', 'Rating', 'Thành công'];
    const rows = filteredShippers.map(s => [
      s.shipper_id,
      s.name,
      s.email,
      s.phone,
      getBranchName(s.branch_id, branches),
      s.status,
      s.rating || 0,
      s.total_success || 0
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

  // ========================================
  // TABLE COLUMNS
  // ========================================
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
      width: 130,
      render: (phone) => (
        <span style={{ color: '#475569', fontSize: '13px' }}>{phone}</span>
      )
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'branch_id',
      key: 'branch_id',
      width: 180,
      render: (branchId) => (
        <span style={{ color: '#64748b', fontSize: '13px' }}>
          {getBranchName(branchId, branches)}
        </span>
      )
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 150,
      align: 'center',
      render: (rating) => {
        // ✅ Logic render rating ở đây
        const stars = [];
        const fullStars = Math.floor(rating || 0);
        
        for (let i = 0; i < 5; i++) {
          stars.push(
            <FiStar
              key={i}
              style={{
                color: i < fullStars ? '#FFA500' : '#e2e8f0',
                fill: i < fullStars ? '#FFA500' : 'none',
                width: '16px',
                height: '16px'
              }}
            />
          );
        }
        
        return (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {stars}
            <span style={{ marginLeft: '8px', color: '#64748b', fontSize: '13px' }}>
              {(rating || 0).toFixed(1)}
            </span>
          </div>
        );
      }
    },
    {
      title: 'Thành công',
      dataIndex: 'total_success',
      key: 'total_success',
      width: 110,
      align: 'center',
      render: (total) => (
        <span style={{ fontWeight: '600', color: '#059669', fontSize: '14px' }}>
          {total || 0}
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      align: 'center',
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontSize: '13px' }}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      align: 'center',
      fixed: 'right',
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

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="shipper-container">
      <div className="shipper-header">
        <h1 className="shipper-title">{getHeaderTitle()}</h1>
        <p className="shipper-subtitle">{getHeaderSubtitle()}</p>
      </div>

      {branchError && (
        <Alert
          message="Lỗi tải dữ liệu"
          description={branchError}
          type="error"
          showIcon
          closable
          style={{ marginBottom: '16px' }}
          action={
            <Button size="small" onClick={fetchBranches}>
              Thử lại
            </Button>
          }
        />
      )}

      <div className="tabs-action-bar">
        <div className="vehicle-tabs">
          {/* Empty - có thể thêm tabs nếu cần */}
        </div>

        <div className="right-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Tìm theo tên, email, SĐT..."
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
            disabled={loading || loadingBranches || branchError !== null}
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