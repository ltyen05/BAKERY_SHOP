import { 
  FiTag, 
  FiPercent,
  FiDollarSign,
  FiCalendar,
  FiShoppingCart,
  FiTrendingDown,
  FiPackage,
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp
} from 'react-icons/fi';

export const STATS_CONFIG = [
  {
    key: 'total',
    title: 'Tổng voucher',
    icon: FiPackage,
    color: 'blue'
  },
  {
    key: 'active',
    title: 'Đang hoạt động',
    icon: FiCheckCircle,
    color: 'green'
  },
  {
    key: 'expired',
    title: 'Đã hết hạn',
    icon: FiXCircle,
    color: 'red'
  },
  {
    key: 'totalUsed',
    title: 'Đã sử dụng',
    icon: FiTrendingUp,
    color: 'orange'
  }
];

export const DISCOUNT_TYPE_OPTIONS = [
  { value: 'percent', label: 'Phần trăm (%)' },
  { value: 'fixed', label: 'Số tiền cố định (đ)' }
];

export const VOUCHER_FIELDS = [
  {
    name: 'name',
    label: 'Tên voucher',
    type: 'text',
    icon: FiTag,
    placeholder: 'VD: Giảm 20% cho đơn hàng đầu tiên',
    required: true,
    fullWidth: true,
    helperText: 'Tên mô tả cho voucher'
  },
  {
    name: 'type',
    label: 'Loại giảm giá',
    type: 'select',
    icon: FiPercent,
    required: true,
    defaultValue: 'percent',
    options: [
      { value: '', label: 'Chọn loại giảm giá' },
      ...DISCOUNT_TYPE_OPTIONS
    ],
    helperText: 'Chọn loại giảm giá'
  },
  {
    name: 'discount',
    label: 'Giá trị giảm',
    type: 'text',
    inputType: 'number',
    icon: FiDollarSign,
    placeholder: 'VD: 20 hoặc 50000',
    required: true,
    helperText: 'Nhập số % hoặc số tiền',
    transform: (value) => parseFloat(value || 0)   // ✅ fix NaN khi nhập rỗng
  },
  {
    name: 'minOrder',
    label: 'Đơn hàng tối thiểu',
    type: 'text',
    inputType: 'number',
    icon: FiShoppingCart,
    placeholder: 'VD: 200000',
    required: false,
    defaultValue: '0',
    helperText: 'Giá trị đơn hàng tối thiểu (đ)',
    transform: (value) => parseFloat(value || 0)
  },
  {
    name: 'maxDiscount',
    label: 'Giảm tối đa',
    type: 'text',
    inputType: 'number',
    icon: FiTrendingDown,
    placeholder: 'VD: 50000',
    required: false,
    defaultValue: '0',
    helperText: 'Số tiền giảm tối đa (đ), 0 = không giới hạn',
    transform: (value) => parseFloat(value || 0)
  },
  {
    name: 'startDate',
    label: 'Ngày bắt đầu',
    type: 'text',
    inputType: 'date',
    icon: FiCalendar,
    required: true,
    helperText: 'Ngày voucher có hiệu lực'
  },
  {
    name: 'endDate',
    label: 'Ngày kết thúc',
    type: 'text',
    inputType: 'date',
    icon: FiCalendar,
    required: true,
    helperText: 'Ngày voucher hết hạn'
  }
];

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

export const formatDiscount = (voucher) => {
  if (voucher.type === 'percent') {
    return `${voucher.discount ?? 0}%`;   // ✅ fix undefined
  }
  return `${(voucher.discount ?? 0).toLocaleString('vi-VN')}đ`;  // ✅ fix undefined
};

export const getStatusColor = (status) => {
  return status === 'Active' ? 'success' : 'error';
};

export const getStatusText = (status) => {
  return status === 'Active' ? 'Hoạt động' : 'Hết hạn';
};
