// ===============================================
// Location: src/pages/Orders/constants.js
// ===============================================

export const STATUS_TABS = [
  'Tất cả', 
  'Pending', 
  'Confirmed', 
  'Shipping', 
  'Delivered', 
  'Cancelled'
];

export const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Chờ xác nhận', color: '#f59e0b' },
  { value: 'Confirmed', label: 'Đã xác nhận', color: '#3b82f6' },
  { value: 'Shipping', label: 'Đang giao hàng', color: '#8b5cf6' },
  { value: 'Delivered', label: 'Đã giao thành công', color: '#10b981' },
  { value: 'Cancelled', label: 'Đã hủy', color: '#ef4444' },
];

export const STATUS_INFO = {
  'Pending': { label: 'Chờ xác nhận', class: 'pending' },
  'Confirmed': { label: 'Đã xác nhận', class: 'confirmed' },
  'Shipping': { label: 'Đang giao', class: 'shipping' },
  'Delivered': { label: 'Đã giao', class: 'delivered' },
  'Cancelled': { label: 'Đã hủy', class: 'cancelled' }
};

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

export const STATUS_MAPPING_TO_BACKEND = {
  'Pending': 'Chờ xác nhận',
  'Confirmed': 'Đã xác nhận',
  'Shipping': 'Đang giao hàng',
  'Delivered': 'Đã giao',
  'Cancelled': 'Đã hủy'
};