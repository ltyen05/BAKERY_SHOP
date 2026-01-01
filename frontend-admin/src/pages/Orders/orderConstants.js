// ===============================================
// Location: src/pages/Orders/orderConstants.js
// ===============================================

import {
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiPackage,
  FiXCircle,
  FiShoppingCart,
  FiAlertCircle,
  FiDollarSign
} from 'react-icons/fi';

// ============= STATS CONFIG =============
export const STATS_CONFIG = [
  {
    key: 'total',
    title: 'Tổng đơn hàng',
    icon: FiShoppingCart,
    color: 'blue'
  },
  {
    key: 'pending',
    title: 'Chờ xác nhận',
    icon: FiClock,
    color: 'orange'
  },
  {
    key: 'confirmed',
    title: 'Đã xác nhận',
    icon: FiCheckCircle,
    color: 'blue'
  },
  {
    key: 'shipping',
    title: 'Đang giao',
    icon: FiTruck,
    color: 'purple'
  },
  {
    key: 'delivered',
    title: 'Đã giao',
    icon: FiPackage,
    color: 'green'
  },
  {
    key: 'cancelled',
    title: 'Đã hủy',
    icon: FiXCircle,
    color: 'red'
  }
];

// ============= STATUS TABS =============
export const STATUS_TABS = [
  { id: 'all', label: 'Tất cả', status: null },
  { id: 'pending', label: 'Chờ xác nhận', status: 'Pending' },
  { id: 'confirmed', label: 'Đã xác nhận', status: 'Confirmed' },
  { id: 'shipping', label: 'Đang giao', status: 'Shipping' },
  { id: 'delivered', label: 'Đã giao', status: 'Delivered' },
  { id: 'cancelled', label: 'Đã hủy', status: 'Cancelled' }
];

// ============= STATUS INFO =============
export const STATUS_INFO = {
  'Pending': { label: 'Chờ xác nhận', class: 'pending', color: '#f59e0b' },
  'Confirmed': { label: 'Đã xác nhận', class: 'confirmed', color: '#3b82f6' },
  'Shipping': { label: 'Đang giao', class: 'shipping', color: '#8b5cf6' },
  'Delivered': { label: 'Đã giao', class: 'delivered', color: '#10b981' },
  'Cancelled': { label: 'Đã hủy', class: 'cancelled', color: '#ef4444' }
};

// ============= STATUS OPTIONS FOR SELECT =============
export const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Chờ xác nhận', color: '#f59e0b' },
  { value: 'Confirmed', label: 'Đã xác nhận', color: '#3b82f6' },
  { value: 'Shipping', label: 'Đang giao hàng', color: '#8b5cf6' },
  { value: 'Delivered', label: 'Đã giao thành công', color: '#10b981' },
  { value: 'Cancelled', label: 'Đã hủy', color: '#ef4444' }
];

// ============= STATUS MAPPING =============
// Map từ backend status (tiếng Việt) sang frontend status (tiếng Anh)
export const STATUS_MAPPING_FROM_BACKEND = {
  'Đang xử lý': 'Pending',
  'Chờ xác nhận': 'Pending',
  'Đã xác nhận': 'Confirmed',
  'Đang giao': 'Shipping',
  'Đang giao hàng': 'Shipping',
  'Đã giao': 'Delivered',
  'Hoàn thành': 'Delivered',
  'Đã hủy': 'Cancelled',
  'Hủy': 'Cancelled'
};

// Map từ frontend status (tiếng Anh) sang backend status (tiếng Việt)
export const STATUS_MAPPING_TO_BACKEND = {
  'Pending': 'Đang xử lý',
  'Confirmed': 'Đã xác nhận',
  'Shipping': 'Đang giao',
  'Delivered': 'Đã giao',
  'Cancelled': 'Đã hủy'
};

// ============= HELPER FUNCTIONS =============
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const formatDate = (dateString) => {
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

export const getStatusIcon = (status) => {
  const icons = {
    'Pending': FiClock,
    'Confirmed': FiCheckCircle,
    'Shipping': FiTruck,
    'Delivered': FiPackage,
    'Cancelled': FiXCircle
  };
  return icons[status] || FiClock;
};

export const getStatusColor = (status) => {
  const colors = {
    'Pending': 'orange',
    'Confirmed': 'blue',
    'Shipping': 'purple',
    'Delivered': 'green',
    'Cancelled': 'red'
  };
  return colors[status] || 'default';
};