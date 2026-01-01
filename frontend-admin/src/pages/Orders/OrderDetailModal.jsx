// ===============================================
// Location: src/pages/Orders/OrderDetailModal.jsx - FIXED
// ===============================================
import React from 'react';
import { Modal, Spin, Empty } from 'antd';
import { FiPackage, FiImage } from 'react-icons/fi';
import { formatCurrency, formatDate, STATUS_INFO } from './orderConstants';
import './OrderDetailModal.css';

const OrderDetailModal = ({ 
  isOpen, 
  onClose, 
  order, 
  orderDetails, 
  loadingDetails 
}) => {
  if (!order) return null;

  // Backend response structure:
  // {
  //   "branch": 5,
  //   "image": "https://...",
  //   "price_at_purchase": 800000.0,
  //   "product_name": "Sourdough",
  //   "quantity": 4,
  //   "total_item_price": 3200000.0
  // }

  const items = orderDetails?.items || [];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FiPackage size={20} />
          <span>Chi tiết đơn hàng #{order.order_id}</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
    >
      <div className="order-detail-content">
        {/* Thông tin đơn hàng */}
        <div className="info-section">
          <h3 className="section-title">Thông tin đơn hàng</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Mã đơn hàng</span>
              <span className="info-value">#{order.order_id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Ngày đặt</span>
              <span className="info-value">{formatDate(order.created_at)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Khách hàng</span>
              <span className="info-value">{order.customer_name || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Số điện thoại</span>
              <span className="info-value">{order.phone || 'N/A'}</span>
            </div>
            <div className="info-item full-width">
              <span className="info-label">Địa chỉ giao hàng</span>
              <span className="info-value">{order.order_address || 'N/A'}</span>
            </div>
            {order.note && (
              <div className="info-item full-width">
                <span className="info-label">Ghi chú</span>
                <span className="info-value">{order.note}</span>
              </div>
            )}
            <div className="info-item">
              <span className="info-label">Trạng thái</span>
              <span className={`status ${STATUS_INFO[order.status]?.class || ''}`}>
                {STATUS_INFO[order.status]?.label || order.status}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Phương thức thanh toán</span>
              <span className="info-value">{order.payment_method || 'COD'}</span>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="info-section">
          <h3 className="section-title">Sản phẩm ({items.length})</h3>
          
          {loadingDetails ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Spin size="large" />
              <p style={{ marginTop: '16px', color: '#64748b' }}>Đang tải chi tiết...</p>
            </div>
          ) : items.length === 0 ? (
            <Empty 
              description="Không có sản phẩm nào" 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <div className="products-list">
              {items.map((item, index) => (
                <div key={index} className="product-item">
                  <div className="product-image">
                    {item.image ? (
                      <img src={item.image} alt={item.product_name} />
                    ) : (
                      <FiImage className="no-image" />
                    )}
                  </div>
                  <div className="product-info">
                    <h4 className="product-name">{item.product_name}</h4>
                    <div className="product-details">
                      <span>Số lượng: <strong>{item.quantity}</strong></span>
                      <span>Đơn giá: <strong>{formatCurrency(item.price_at_purchase)}</strong></span>
                      {item.branch && <span>Chi nhánh: <strong>{item.branch}</strong></span>}
                    </div>
                  </div>
                  <div className="product-total">
                    {formatCurrency(item.total_item_price)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tổng tiền */}
        {!loadingDetails && items.length > 0 && (
          <div className="total-section">
            <div className="total-row">
              <span className="total-label">Tổng cộng:</span>
              <span className="total-value">{formatCurrency(order.total_amount)}</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default OrderDetailModal;