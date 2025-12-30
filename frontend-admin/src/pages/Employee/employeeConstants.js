// ===============================================
//  src/pages/Employee/employeeConstants.js - FIXED
// ===============================================
import { 
  FiUser, 
  FiMail, 
  FiHash, 
  FiShield, 
  FiDollarSign, 
  FiMapPin, 
  FiCheckCircle,
  FiLock,
  FiUsers,
  FiUserCheck,
  FiUserX
} from 'react-icons/fi';

// ============= STATS CONFIG =============

export const STATS_CONFIG = [
  {
    key: 'total',
    title: 'Tổng nhân viên',
    icon: FiUsers,  // ← KHÔNG có <>
    color: 'blue'
  },
  {
    key: 'active',
    title: 'Đang làm việc',
    icon: FiUserCheck,  // ← KHÔNG có <>
    color: 'green'
  },
  {
    key: 'inactive',
    title: 'Nghỉ việc',
    icon: FiUserX,  // ← KHÔNG có <>
    color: 'orange'
  }
];

// ============= ROLE TABS =============
export const ROLE_TABS = [
  { id: 'all', label: 'Tất cả', role: null },
  { id: 'manager', label: 'Quản lý', role: 'Quản lý' },
  { id: 'baker', label: 'Thợ làm bánh', role: 'Thợ làm bánh' },
  { id: 'sales', label: 'Bán hàng', role: 'Bán hàng' }
];

// ============= BRANCHES =============
export const BRANCHES = [
  { value: '1', label: 'HUS Bakery - Hoàn Kiếm', code: 'CN001' },
  { value: '2', label: 'HUS Bakery - Cầu Giấy', code: 'CN002' },
  { value: '3', label: 'HUS Bakery - Đống Đa', code: 'CN003' },
  { value: '4', label: 'HUS Bakery - Hà Đông', code: 'CN004' },
  { value: '5', label: 'HUS Bakery - Thanh Xuân', code: 'CN005' }
];

// Helper function để lấy tên chi nhánh
export const getBranchName = (branchId) => {
  const branch = BRANCHES.find(b => b.value === String(branchId));
  return branch ? branch.label : `Chi nhánh ${branchId}`;
};

// ============= FORM FIELDS =============
export const EMPLOYEE_FIELDS = [
  {
    name: 'name',
    label: 'Họ và tên',
    type: 'text',
    icon: FiUser,
    placeholder: 'Nguyễn Văn A',
    required: true
  },
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    inputType: 'email',
    icon: FiMail,
    placeholder: 'example@husbakery.vn',
    required: true
  },
  {
    name: 'password',
    label: 'Mật khẩu',
    type: 'password',
    icon: FiLock,
    placeholder: '••••••••',
    required: true,
    helperText: 'Tối thiểu 6 ký tự',
    showOnEdit: false
  },
  {
    name: 'role',
    label: 'Vai trò',
    type: 'select',
    icon: FiShield,
    required: true,
    options: [
      { value: '', label: 'Chọn vai trò' },
      { value: 'Quản lý', label: 'Quản lý' },
      { value: 'Thợ làm bánh', label: 'Thợ làm bánh' },
      { value: 'Bán hàng', label: 'Bán hàng' }
    ]
  },
  {
    name: 'salary',
    label: 'Lương (VNĐ)',
    type: 'text',
    inputType: 'number',
    icon: FiDollarSign,
    placeholder: '9000000',
    required: true,
    defaultValue: '9000000'
  },
  {
    name: 'status',
    label: 'Trạng thái',
    type: 'select',
    icon: FiCheckCircle,
    required: false,
    defaultValue: 'Đang làm việc',
    options: [
      { value: 'Đang làm việc', label: 'Đang làm việc' },
      { value: 'Nghỉ việc', label: 'Nghỉ việc' }
    ]
  },
  {
    name: 'branch_id',
    label: 'Chi nhánh',
    type: 'select',
    icon: FiMapPin,
    required: true,
    defaultValue: '1',
    fullWidth: true,
    options: [
      { value: '', label: 'Chọn chi nhánh' },
      ...BRANCHES
    ],
    transform: (value) => parseInt(value)
  }
];

// Fields cho Edit (có thể đổi password hoặc không)
export const EMPLOYEE_EDIT_FIELDS = EMPLOYEE_FIELDS.map(field => {
  if (field.name === 'password') {
    return {
      ...field,
      required: false,
      helperText: 'Để trống nếu không muốn đổi mật khẩu'
    };
  }
  return field;
});

// ============= HELPER FUNCTIONS =============
export const getInitials = (name) => {
  if (!name) return 'NA';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const getRoleColor = (role) => {
  switch(role) {
    case 'Quản lý': return 'purple';
    case 'Thợ làm bánh': return 'orange';
    case 'Bán hàng': return 'blue';
    default: return 'default';
  }
};

export const getStatusColor = (status) => {
  return status === 'Đang làm việc' ? 'success' : 'default';
};