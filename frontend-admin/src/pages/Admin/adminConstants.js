// ===============================================
// FILE: src/pages/Admin/adminConstants.js
// CHỈ GIỮ FIELD CÓ THỂ CHỈNH SỬA
// ===============================================
import { FiMail, FiDollarSign } from 'react-icons/fi';

// ✅ CHỈ cho phép sửa: email, salary, status
// ❌ BỎ: manager_name, branch_id, role (không cho sửa)
export const ADMIN_FIELDS = [
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    inputType: 'email',
    icon: FiMail,
    placeholder: 'VD: admin@husbakery.vn',
    required: true
  },
  {
    name: 'salary',
    label: 'Lương',
    type: 'text',
    inputType: 'number',
    icon: FiDollarSign,
    placeholder: 'VD: 15000000',
    required: false,
    helpText: 'Để trống nếu chưa xác định'
  },
  {
    name: 'status',
    label: 'Trạng thái',
    type: 'select',
    placeholder: 'Chọn trạng thái',
    required: true,
    options: [
      { value: 'Đang làm việc', label: 'Đang làm việc' },
      { value: 'Nghỉ phép', label: 'Nghỉ phép' },
      { value: 'Đã nghỉ việc', label: 'Đã nghỉ việc' }
    ]
  }
];

export const STATUS_CONFIG = {
  'Đang làm việc': {
    color: 'success',
    label: 'Đang làm việc'
  },
  'Nghỉ phép': {
    color: 'warning',
    label: 'Nghỉ phép'
  },
  'Đã nghỉ việc': {
    color: 'error',
    label: 'Đã nghỉ việc'
  }
};

export const ROLE_CONFIG = {
  'Quản lý': {
    color: '#667eea',
    label: 'Quản lý'
  },
  'Super Admin': {
    color: '#f59e0b',
    label: 'Super Admin'
  }
};

export const formatCurrency = (amount) => {
  if (!amount) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};