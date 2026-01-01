// ===============================================
// Location: src/pages/Orders/OrdersView.jsx - FIXED PERMISSIONS
// ===============================================

import React, { useState } from 'react';
import { Tag, Space, Button, Tooltip, Modal, message } from 'antd';
import { 
  FiSearch, 
  FiDownload, 
  FiEye, 
  FiEdit3, 
  FiTrash2,
  FiCheckCircle
} from 'react-icons/fi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import DataTable from '../../components/Table/Table';
import OrderDetailModal from './OrderDetailModal';
import FormModal from '../../components/FormModal/FormModal';
import { useOrders } from './useOrders';
import { 
  STATUS_TABS, 
  STATUS_INFO,
  STATUS_OPTIONS,
  formatCurrency,
  formatDate,
  getStatusColor
} from './orderConstants';
import './OrdersView.css';

const { confirm } = Modal;

const OrdersView = () => {
  const {
    filteredOrders,
    stats,
    loading,
    activeStatus,
    searchQuery,
    currentPage,
    deleteOrder,
    updateOrderStatus,
    fetchOrderDetails,
    statusCount,
    getHeaderTitle,
    getHeaderSubtitle,
    setCurrentPage,
    handleStatusChange,
    handleSearchChange,
    canUpdateStatus, 
    canDeleteOrder   
  } = useOrders();

  // ============= MODAL STATE =============
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrderForUpdate, setSelectedOrderForUpdate] = useState(null);

  // ============= VIEW DETAIL =============
  const handleViewDetail = async (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
    setLoadingDetails(true);
    
    try {
      const details = await fetchOrderDetails(order.order_id);
      setOrderDetails(details);
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
    setOrderDetails(null);
  };

  // ============= UPDATE STATUS =============
  const handleOpenStatusModal = (order) => {
    if (!canUpdateStatus) {
      message.warning('Bạn không có quyền cập nhật trạng thái đơn hàng');
      return;
    }
    setSelectedOrderForUpdate(order);
    setIsStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedOrderForUpdate(null);
  };

  const handleStatusUpdate = async (formData) => {
    const success = await updateOrderStatus(
      selectedOrderForUpdate.order_id, 
      formData.status
    );
    
    if (success) {
      handleCloseStatusModal();
    }
  };

  // ============= DELETE =============
  const handleDelete = (order) => {
    if (!canDeleteOrder) {
      message.warning('Bạn không có quyền xóa đơn hàng');
      return;
    }

    confirm({
      title: 'Xác nhận xóa đơn hàng',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa đơn hàng #${order.order_id}?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      centered: true,
      async onOk() {
        await deleteOrder(order.order_id);
      }
    });
  };

  // ============= EXPORT =============
  const handleExport = () => {
    if (filteredOrders.length === 0) {
      message.warning('Không có dữ liệu để export');
      return;
    }
    
    const headers = ['Mã đơn', 'Khách hàng', 'Tổng tiền', 'Trạng thái', 'Ngày đặt'];
    const rows = filteredOrders.map(order => [
      order.order_id,
      order.customer_name || 'N/A',
      order.total_amount,
      STATUS_INFO[order.status]?.label || order.status,
      formatDate(order.created_at)
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    message.success('Export thành công!');
  };

  // ============= TABLE COLUMNS =============
  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'order_id',
      key: 'order_id',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: (id) => (
        <span style={{ fontWeight: '600', color: '#475569', fontSize: '14px' }}>
          #{id}
        </span>
      ),
      sorter: (a, b) => a.order_id - b.order_id
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#667eea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            {record.customer_name?.charAt(0)?.toUpperCase() || 'K'}
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
              {record.customer_name || 'N/A'}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {record.phone || 'N/A'}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'order_address',
      key: 'order_address',
      width: 250,
      render: (address) => (
        <Tooltip title={address}>
          <span style={{ 
            color: '#475569', 
            fontSize: '13px',
            display: 'block',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {address || 'N/A'}
          </span>
        </Tooltip>
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 150,
      align: 'right',
      render: (amount) => (
        <span style={{ fontWeight: '600', color: '#059669', fontSize: '14px' }}>
          {formatCurrency(amount)}
        </span>
      ),
      sorter: (a, b) => a.total_amount - b.total_amount
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      align: 'center',
      render: (date) => (
        <span style={{ color: '#64748b', fontSize: '13px' }}>
          {formatDate(date)}
        </span>
      ),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at)
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      align: 'center',
      render: (status) => (
        <Tag 
          color={getStatusColor(status)} 
          style={{ fontWeight: '600', fontSize: '13px', margin: 0 }}
        >
          {STATUS_INFO[status]?.label || status}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: canUpdateStatus ? 140 : 100, 
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<FiEye />}
              onClick={() => handleViewDetail(record)}
              style={{ color: '#3b82f6' }}
            />
          </Tooltip>
          
          {canUpdateStatus && (
            <Tooltip title="Cập nhật trạng thái">
              <Button
                type="text"
                icon={<FiEdit3 />}
                onClick={() => handleOpenStatusModal(record)}
                style={{ color: '#8b5cf6' }}
              />
            </Tooltip>
          )}
          
          {canDeleteOrder && (
            <Tooltip title="Xóa">
              <Button
                type="text"
                icon={<FiTrash2 />}
                onClick={() => handleDelete(record)}
                danger
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  // ============= STATUS UPDATE FORM =============
  const statusFormFields = [
    {
      name: 'order_id',
      label: 'Mã đơn hàng',
      type: 'text',
      icon: FiCheckCircle,
      disabled: true,
      defaultValue: selectedOrderForUpdate?.order_id || '',
      fullWidth: false
    },
    {
      name: 'customer_name',
      label: 'Khách hàng',
      type: 'text',
      icon: FiCheckCircle,
      disabled: true,
      defaultValue: selectedOrderForUpdate?.customer_name || '',
      fullWidth: false
    },
    {
      name: 'status',
      label: 'Trạng thái mới',
      type: 'select',
      icon: FiCheckCircle,
      required: true,
      defaultValue: selectedOrderForUpdate?.status || '',
      options: STATUS_OPTIONS.map(opt => ({
        value: opt.value,
        label: opt.label
      })),
      fullWidth: true,
      helperText: 'Chọn trạng thái mới cho đơn hàng'
    }
  ];

  // ============= PAGINATION =============
  const paginationConfig = {
    current: currentPage,
    pageSize: 10,
    total: filteredOrders.length,
    showSizeChanger: false,
    showTotal: (total) => `Tổng ${total} đơn hàng`
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  // ============= RENDER =============
  return (
    <div className="order-container">
      {/* HEADER */}
      <div className="order-header">
        <h1 className="order-title">{getHeaderTitle()}</h1>
        <p className="order-subtitle">{getHeaderSubtitle()}</p>
      </div>

      {/* TABS + ACTIONS */}
      <div className="tabs-action-bar">
        <div className="status-tabs">
          {STATUS_TABS.map(tab => (
            <div
              key={tab.id}
              className={`status-tab ${activeStatus === tab.id ? 'active' : ''}`}
              onClick={() => handleStatusChange(tab.id)}
            >
              {tab.label} <span className="tab-count">({statusCount(tab.id)})</span>
            </div>
          ))}
        </div>

        <div className="right-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Tìm theo mã đơn, khách hàng..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <button
            className="export-btn"
            onClick={handleExport}
            disabled={filteredOrders.length === 0 || loading}
          >
            <FiDownload />
            Export
          </button>
        </div>
      </div>

      {/* DATA TABLE */}
      <DataTable
        columns={columns}
        dataSource={filteredOrders}
        loading={loading}
        pagination={paginationConfig}
        onChange={handleTableChange}
        rowKey="order_id"
        scroll={{ x: 1400 }}
        emptyText="Không có đơn hàng nào"
      />

      {/* DETAIL MODAL */}
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        order={selectedOrder}
        orderDetails={orderDetails}
        loadingDetails={loadingDetails}
      />

      {/* STATUS UPDATE MODAL */}
      {canUpdateStatus && (
        <FormModal
          isOpen={isStatusModalOpen}
          onClose={handleCloseStatusModal}
          onSubmit={handleStatusUpdate}
          title={{
            edit: 'Cập nhật trạng thái',
            editDesc: 'Thay đổi trạng thái đơn hàng'
          }}
          icon={FiEdit3}
          data={selectedOrderForUpdate}
          fields={statusFormFields}
        />
      )}
    </div>
  );
};

export default OrdersView;