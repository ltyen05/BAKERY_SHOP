// ===============================================
// Location: src/pages/Orders/StatusUpdateModal.jsx
// ===============================================

import React, { useState, useEffect } from 'react';
import { Modal, Select } from 'antd';
import { FiEdit3 } from 'react-icons/fi';
import { STATUS_OPTIONS, STATUS_INFO } from './constants';

const { Option } = Select;

export default function StatusUpdateModal({ 
  isOpen, 
  order, 
  onClose, 
  onUpdate 
}) {
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order && isOpen) {
      setNewStatus(order.status);
    }
  }, [order, isOpen]);

  const handleUpdate = async () => {
    if (!newStatus || newStatus === order.status) {
      return;
    }

    setLoading(true);
    const success = await onUpdate(order.order_id, newStatus);
    setLoading(false);
    
    if (success) {
      onClose();
    }
  };

  if (!order) return null;

  const currentStatusInfo = STATUS_INFO[order.status] || STATUS_INFO['Pending'];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiEdit3 style={{ color: '#667eea' }} />
          <span>Cập nhật trạng thái đơn hàng</span>
        </div>
      }
      open={isOpen}
      onOk={handleUpdate}
      onCancel={onClose}
      confirmLoading={loading}
      okText="Cập nhật"
      cancelText="Hủy"
      okButtonProps={{ 
        disabled: newStatus === order.status,
        style: { 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none'
        } 
      }}
    >
      <div style={{ padding: '16px 0' }}>
        <div style={{ marginBottom: '16px' }}>
          <strong>Mã đơn:</strong> #ORD{order.order_id}
        </div>
        <div style={{ marginBottom: '16px' }}>
          <strong>Trạng thái hiện tại:</strong>{' '}
          <span className={`status ${currentStatusInfo.class}`}>
            {currentStatusInfo.label}
          </span>
        </div>
        <div>
          <strong style={{ display: 'block', marginBottom: '8px' }}>
            Chọn trạng thái mới:
          </strong>
          <Select
            value={newStatus}
            onChange={setNewStatus}
            style={{ width: '100%' }}
            size="large"
          >
            {STATUS_OPTIONS.map(option => (
              <Option key={option.value} value={option.value}>
                <span style={{ color: option.color, fontWeight: 600 }}>
                  {option.label}
                </span>
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </Modal>
  );
}