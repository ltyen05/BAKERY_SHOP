import React, { useEffect } from 'react';
import { 
  FiX, FiPackage, FiUser, FiMapPin, FiPhone, FiCalendar,
  FiCreditCard, FiTruck, FiClock, FiCheckCircle, FiXCircle,
  FiFileText, FiDollarSign, FiShoppingBag
} from 'react-icons/fi';
import './OrderDetailModal.css';

export default function OrderDetailModal({ 
  isOpen, 
  onClose, 
  order, 
  orderDetails, 
  loadingDetails 
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

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
      weekday: 'long',
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'Pending': { 
        label: 'Chờ xác nhận', 
        color: '#f59e0b',
        bg: '#fef3c7',
        icon: <FiClock />
      },
      'Confirmed': { 
        label: 'Đã xác nhận', 
        color: '#3b82f6',
        bg: '#dbeafe',
        icon: <FiCheckCircle />
      },
      'Shipping': { 
        label: 'Đang giao hàng', 
        color: '#8b5cf6',
        bg: '#ede9fe',
        icon: <FiTruck />
      },
      'Delivered': { 
        label: 'Đã giao thành công', 
        color: '#10b981',
        bg: '#d1fae5',
        icon: <FiCheckCircle />
      },
      'Cancelled': { 
        label: 'Đã hủy', 
        color: '#ef4444',
        bg: '#fee2e2',
        icon: <FiXCircle />
      }
    };
    return statusMap[status] || statusMap['Pending'];
  };

  const statusInfo = getStatusInfo(order.status);
  const totalAmount = orderDetails.reduce((sum, item) => 
    sum + parseFloat(item.total_item_price || 0), 0
  );

  return (
    <div className="order-detail-overlay" onClick={onClose}>
      <div className="order-detail-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header với gradient */}
        <div className="order-detail-header">
          <div className="order-detail-header-content">
            <div className="order-detail-icon-wrapper">
              <FiShoppingBag className="order-detail-main-icon" />
            </div>
            <div className="order-detail-header-text">
              <h2 className="order-detail-title">Chi tiết đơn hàng</h2>
              <p className="order-detail-id">#ORD{order.order_id}</p>
            </div>
          </div>
          <button className="order-detail-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Status Banner - Eye-catching */}
        <div 
          className="order-status-banner"
          style={{ 
            background: `linear-gradient(135deg, ${statusInfo.bg} 0%, ${statusInfo.bg}dd 100%)`,
            borderLeft: `4px solid ${statusInfo.color}`
          }}
        >
          <div className="status-banner-icon" style={{ color: statusInfo.color }}>
            {statusInfo.icon}
          </div>
          <div className="status-banner-text">
            <span className="status-banner-label">Trạng thái đơn hàng</span>
            <span className="status-banner-value" style={{ color: statusInfo.color }}>
              {statusInfo.label}
            </span>
          </div>
          <div className="status-banner-date">
            <FiCalendar style={{ marginRight: '6px' }} />
            {formatDate(order.created_at)}
          </div>
        </div>

        {/* Body - Scrollable content */}
        <div className="order-detail-body">
          
          {/* Thông tin 2 cột */}
          <div className="order-detail-grid">
            
            {/* Card 1: Khách hàng */}
            <div className="detail-card">
              <div className="detail-card-header">
                <div className="detail-card-icon customer-icon">
                  <FiUser />
                </div>
                <h3 className="detail-card-title">Thông tin khách hàng</h3>
              </div>
              <div className="detail-card-body">
                <div className="detail-info-row">
                  <div className="detail-info-item">
                    <FiUser className="detail-item-icon" />
                    <div>
                      <p className="detail-item-label">Tên khách hàng</p>
                      <p className="detail-item-value">{order.customer_id || 'Khách vãng lai'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="detail-info-row">
                  <div className="detail-info-item">
                    <FiPhone className="detail-item-icon" />
                    <div>
                      <p className="detail-item-label">Số điện thoại</p>
                      <p className="detail-item-value">{order.customer_phone || 'Chưa có'}</p>
                    </div>
                  </div>
                </div>

                <div className="detail-info-row">
                  <div className="detail-info-item">
                    <FiMapPin className="detail-item-icon" />
                    <div>
                      <p className="detail-item-label">Địa chỉ giao hàng</p>
                      <p className="detail-item-value">{order.order_address || 'Chưa có địa chỉ'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Thanh toán */}
            <div className="detail-card">
              <div className="detail-card-header">
                <div className="detail-card-icon payment-icon">
                  <FiCreditCard />
                </div>
                <h3 className="detail-card-title">Thông tin thanh toán</h3>
              </div>
              <div className="detail-card-body">
                <div className="detail-info-row">
                  <div className="detail-info-item">
                    <FiCreditCard className="detail-item-icon" />
                    <div>
                      <p className="detail-item-label">Phương thức</p>
                      <p className="detail-item-value">{order.payment_method || 'COD'}</p>
                    </div>
                  </div>
                </div>

                <div className="detail-info-row">
                  <div className="detail-info-item">
                    <FiDollarSign className="detail-item-icon" />
                    <div>
                      <p className="detail-item-label">Tổng tiền đơn hàng</p>
                      <p className="detail-item-value total-amount">
                        {formatCurrency(order.total_amount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="detail-info-row">
                  <div className="detail-info-item">
                    <FiTruck className="detail-item-icon" />
                    <div>
                      <p className="detail-item-label">Phí vận chuyển</p>
                      <p className="detail-item-value">Miễn phí</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sản phẩm - Full width */}
          <div className="detail-card product-card">
            <div className="detail-card-header">
              <div className="detail-card-icon product-icon">
                <FiPackage />
              </div>
              <h3 className="detail-card-title">
                Danh sách sản phẩm 
                <span className="product-count">({orderDetails.length} món)</span>
              </h3>
            </div>
            
            <div className="detail-card-body products-body">
              {loadingDetails ? (
                <div className="products-loading">
                  <div className="loading-spinner"></div>
                  <p>Đang tải sản phẩm...</p>
                </div>
              ) : orderDetails.length === 0 ? (
                <div className="products-empty">
                  <FiPackage size={48} />
                  <p>Không có sản phẩm nào trong đơn hàng</p>
                </div>
              ) : (
                <>
                  <div className="products-list">
                    {orderDetails.map((item, index) => (
                      <div key={index} className="product-item">
                        <div className="product-image-wrapper">
                          <img 
                            src={item.image || 'https://via.placeholder.com/80'} 
                            alt={item.product_name}
                            className="product-image"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                          />
                        </div>
                        <div className="product-info">
                          <h4 className="product-name">{item.product_name}</h4>
                          <div className="product-details-row">
                            <span className="product-quantity">
                              Số lượng: <strong>x{item.quantity}</strong>
                            </span>
                            <span className="product-unit-price">
                              {formatCurrency(item.price_at_purchase)}
                            </span>
                          </div>
                        </div>
                        <div className="product-total">
                          {formatCurrency(item.total_item_price)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tổng cộng */}
                  <div className="order-total-section">
                    <div className="order-total-row subtotal">
                      <span>Tạm tính</span>
                      <span>{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="order-total-row shipping">
                      <span>Phí vận chuyển</span>
                      <span className="free">Miễn phí</span>
                    </div>
                    <div className="order-total-divider"></div>
                    <div className="order-total-row final">
                      <span>Tổng cộng</span>
                      <span>{formatCurrency(order.total_amount)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Footer - Optional actions */}
        <div className="order-detail-footer">
          <button className="order-detail-btn secondary" onClick={onClose}>
            Đóng
          </button>
          <button className="order-detail-btn primary">
            <FiFileText style={{ marginRight: '8px' }} />
            In đơn hàng
          </button>
        </div>

      </div>
    </div>
  );
}